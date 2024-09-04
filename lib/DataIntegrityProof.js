/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */
import * as base58btc from 'base58-universal';
import * as base64url from 'base64url-universal';
import * as util from './util.js';
import jsigs from 'jsonld-signatures';
import {sha256digest} from './sha256digest.js';

const {suites: {LinkedDataProof}} = jsigs;

// multibase base58-btc header
const MULTIBASE_BASE58BTC_HEADER = 'z';
// multibase base64url no pad header
const MULTIBASE_BASE64URL_HEADER = 'u';
const DATA_INTEGRITY_CONTEXT_V2 = 'https://w3id.org/security/data-integrity/v2';
const DATA_INTEGRITY_CONTEXT_V1 = 'https://w3id.org/security/data-integrity/v1';
const PROOF_TYPE = 'DataIntegrityProof';
// VCDM 2.0 core context
const VC_2_0_CONTEXT = 'https://www.w3.org/ns/credentials/v2';

export class DataIntegrityProof extends LinkedDataProof {
  /**
   * The constructor for the DataIntegrityProof Class.
   *
   * @param {object} options - Options for the Class.
   * @param {object} [options.signer] - A signer for the suite.
   * @param {string|Date|number} [options.date] - A date for created.
   * @param {object} options.cryptosuite - A compliant cryptosuite.
   * @param {boolean} [options.legacyContext = false] - Toggles between
   *   the current DI context and a legacy DI context.
   * @param {number} [options.maxClockSkew = 300] - The maximum acceptable
   *   delta between clocks in the verification process in seconds.
   */
  constructor({
    signer, date, cryptosuite,
    legacyContext = false, maxClockSkew = 300
  } = {}) {
    super({type: PROOF_TYPE});
    const {
      canonize, createVerifier, name, requiredAlgorithm,
      derive, createProofValue, createVerifyData
    } = cryptosuite;
    // `createVerifier` is required
    if(!(createVerifier && typeof createVerifier === 'function')) {
      throw new TypeError(
        '"cryptosuite.createVerifier" must be a function.');
    }
    // assert optional functions
    if(derive && typeof derive !== 'function') {
      throw new TypeError(
        '"cryptosuite.derive" must be a function.');
    }
    if(createProofValue && typeof createProofValue !== 'function') {
      throw new TypeError(
        '"cryptosuite.createProofValue" must be a function.');
    }
    if(createVerifyData && typeof createVerifyData !== 'function') {
      throw new TypeError(
        '"cryptosuite.createVerifyData" must be a function.');
    }
    this.contextUrl = DATA_INTEGRITY_CONTEXT_V2;
    if(legacyContext) {
      this.contextUrl = DATA_INTEGRITY_CONTEXT_V1;
    }
    this.canonize = canonize;
    this.createVerifier = createVerifier;
    this.cryptosuite = name;
    // save internal reference to cryptosuite instance
    this._cryptosuite = cryptosuite;
    this.requiredAlgorithm = requiredAlgorithm;
    if(date) {
      this.date = new Date(date);
      if(isNaN(this.date)) {
        throw TypeError(`"date" "${date}" is not a valid date.`);
      }
    } else if(date === null) {
      this.date = null;
    }

    const vm = _processSignatureParams({signer, requiredAlgorithm});
    this.verificationMethod = vm.verificationMethod;
    this.signer = vm.signer;
    this.maxClockSkew = maxClockSkew;
  }

  /**
   * Adds a signature (proofValue) field to the proof object. Called by
   * LinkedDataSignature.createProof().
   *
   * @param {object} options - The options to use.
   * @param {Uint8Array|object} options.verifyData - Data to be signed
   *   (extracted from document, according to the suite's spec).
   * @param {object} options.proof - Proof object (containing the proofPurpose,
   *   verificationMethod, etc).
   *
   * @returns {Promise<object>} Resolves with the proof containing the signature
   *   value.
   */
  async sign({verifyData, proof}) {
    if(!(this.signer && typeof this.signer.sign === 'function')) {
      throw new Error('A signer API has not been specified.');
    }

    const signatureBytes = await this.signer.sign({data: verifyData});
    proof.proofValue =
      MULTIBASE_BASE58BTC_HEADER + base58btc.encode(signatureBytes);

    return proof;
  }

  /**
   * Verifies the proof signature against the given data.
   *
   * @param {object} options - The options to use.
   * @param {Uint8Array|object} options.verifyData - Verify data as produced
   *   from `createVerifyData`.
   * @param {object} options.verificationMethod - Key object.
   * @param {object} options.proof - The proof to be verified.
   *
   * @returns {Promise<boolean>} Resolves with the verification result.
   */
  async verifySignature({verifyData, verificationMethod, proof}) {
    const verifier = await this.createVerifier({verificationMethod});
    const isSupportedAlgorithm = Array.isArray(this.requiredAlgorithm) ?
      this.requiredAlgorithm.includes(verifier.algorithm) :
      this.requiredAlgorithm === verifier.algorithm;

    if(!isSupportedAlgorithm) {
      const supportedAlgorithms = Array.isArray(this.requiredAlgorithm) ?
        this.requiredAlgorithm.join(', ') : this.requiredAlgorithm;
      const messageSuffix = Array.isArray(this.requiredAlgorithm) ?
        `is not a supported algorithm for the cryptosuite. The supported ` +
        `algorithms are: "${supportedAlgorithms}".` :
        `does not match the required algorithm for the cryptosuite ` +
        `"${supportedAlgorithms}".`;
      const message = `The verifier's algorithm "${verifier.algorithm}" ` +
        `${messageSuffix}`;
      throw new Error(message);
    }

    const {proofValue} = proof;
    if(!(proofValue && typeof proofValue === 'string')) {
      throw new TypeError(
        'The proof does not include a valid "proofValue" property.');
    }
    const multibaseHeader = proofValue[0];
    let signature;
    if(multibaseHeader === MULTIBASE_BASE58BTC_HEADER) {
      signature = base58btc.decode(proofValue.slice(1));
    } else if(multibaseHeader === MULTIBASE_BASE64URL_HEADER) {
      signature = base64url.decode(proofValue.slice(1));
    } else {
      throw new Error(
        'Only base58btc or base64url multibase encoding is supported.');
    }
    return verifier.verify({data: verifyData, signature});
  }

  /**
   * @param {object} options - The options to use.
   * @param {object} options.document - The document to create a proof for.
   * @param {object} options.purpose - The `ProofPurpose` instance to use.
   * @param {Array} options.proofSet - Any existing proof set.
   * @param {Function} options.documentLoader - The document loader to use.
   *
   * @returns {Promise<object>} Resolves with the created proof object.
   */
  async createProof({document, purpose, proofSet, documentLoader}) {
    // build proof (currently known as `signature options` in spec)
    let proof;
    if(this.proof) {
      // shallow copy
      proof = {...this.proof};
    } else {
      // create proof JSON-LD document
      proof = {};
    }

    // ensure proof type is set
    proof.type = this.type;

    // set default `now` date if not given in `proof` or `options`
    let date = this.date;
    if(proof.created === undefined && date === undefined) {
      date = new Date();
    }

    // ensure date is in string format
    if(date && typeof date !== 'string') {
      date = util.w3cDate(date);
    }

    // add API overrides
    if(date) {
      proof.created = date;
    }
    proof.verificationMethod = this.verificationMethod;
    proof.cryptosuite = this.cryptosuite;

    // add any extensions to proof (mostly for legacy support)
    proof = await this.updateProof({
      document, proof, purpose, proofSet, documentLoader
    });

    // allow purpose to update the proof; any terms added to `proof` must have
    // be compatible with its context
    proof = await purpose.update(
      proof, {document, suite: this, documentLoader});

    // create data to sign
    let verifyData;
    // use custom cryptosuite `createVerifyData` if available
    if(this._cryptosuite.createVerifyData) {
      verifyData = await this._cryptosuite.createVerifyData({
        cryptosuite: this._cryptosuite,
        document, proof, proofSet, documentLoader,
        dataIntegrityProof: this
      });
    } else {
      verifyData = await this.createVerifyData(
        {document, proof, proofSet, documentLoader});
    }

    // use custom `createProofValue` if available
    if(this._cryptosuite.createProofValue) {
      proof.proofValue = await this._cryptosuite.createProofValue({
        cryptosuite: this._cryptosuite,
        verifyData, document, proof, proofSet,
        documentLoader, dataIntegrityProof: this
      });
    } else {
      // default to simple signing of data
      proof = await this.sign(
        {verifyData, document, proof, proofSet, documentLoader});
    }

    return proof;
  }

  /**
   * @param {object} options - The options to use.
   * @param {object} options.document - The document to derive from.
   * @param {object} options.purpose - The `ProofPurpose` instance to use.
   * @param {Array} options.proofSet - Any existing proof set.
   * @param {Function} options.documentLoader - The document loader to use.
   *
   * @returns {Promise<object>} Resolves with the new document with a new
   *   `proof` field.
   */
  async derive({document, purpose, proofSet, documentLoader}) {
    // delegate entirely to cryptosuite instance
    if(!this._cryptosuite.derive) {
      throw new Error('"cryptosuite.derive" not provided.');
    }
    return this._cryptosuite.derive({
      cryptosuite: this._cryptosuite, document, purpose, proofSet,
      documentLoader, dataIntegrityProof: this
    });
  }

  /**
   * @param {object} options - The options to use.
   * @param {object} options.proof - The proof to update.
   *
   * @returns {Promise<object>} Resolves with the created proof object.
   */
  async updateProof({proof}) {
    return proof;
  }

  /**
   * @param {object} options - The options to use.
   * @param {object} options.proof - The proof to verify.
   * @param {Array} options.proofSet - Any existing proof set.
   * @param {object} options.document - The document to create a proof for.
   * @param {Function} options.documentLoader - The document loader to use.
   * @param {Date} [options.now] - A date for now.
   *
   * @returns {Promise<{object}>} Resolves with the verification result.
   */
  async verifyProof({
    proof, proofSet,
    document, documentLoader,
    now = new Date()
  }) {
    try {
      // fetch verification method
      const verificationMethod = await this.getVerificationMethod({
        proof, documentLoader
      });

      // create data to verify
      let verifyData;
      // use custom cryptosuite `createVerifyData` if available
      if(this._cryptosuite.createVerifyData) {
        verifyData = await this._cryptosuite.createVerifyData({
          cryptosuite: this._cryptosuite,
          document, proof, proofSet, documentLoader,
          dataIntegrityProof: this,
          verificationMethod
        });
      } else {
        verifyData = await this.createVerifyData({
          document, proof, proofSet, documentLoader, verificationMethod
        });
      }

      // verify signature on data
      const verified = await this.verifySignature({
        verifyData, verificationMethod, proof
      });
      if(!verified) {
        throw new Error('Invalid signature.');
      }
      if(proof.created) {
        if(!util.isW3cDate(proof.created)) {
          throw new Error('Invalid XML TimeStamp');
        }
        const deltaCreated = (now.getTime() + (this.maxClockSkew * 1000)) -
          util.convertTimeStamp(proof.created).getTime();
        if(deltaCreated < 0) {
          throw new Error('"proof.created" in the future');
        }
      }

      return {verified: true, verificationMethod};
    } catch(error) {
      return {verified: false, error};
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {object} options.document - The document to create verify data for.
   * @param {object} options.proof - The proof to create verify data for.
   * @param {Function} options.documentLoader - The document loader to use.
   *
   * @returns {Promise<Uint8Array|object>} Resolves to the verify data to
   *   be passed to `sign` or `verifySignature`.
   */
  async createVerifyData({document, proof, documentLoader}) {
    // get cached document hash
    let cachedDocHash;
    const {_hashCache} = this;
    if(_hashCache && _hashCache.document === document) {
      cachedDocHash = _hashCache.hash;
    } else {
      this._hashCache = {
        document,
        // canonize and hash document
        hash: cachedDocHash =
          this.canonize(document, {documentLoader, base: null, safe: true})
            .then(c14nDocument => sha256digest({string: c14nDocument}))
      };
    }

    // await both c14n proof hash and c14n document hash
    const [proofHash, docHash] = await Promise.all([
      // canonize and hash proof
      this.canonizeProof(proof, {document, documentLoader})
        .then(c14nProofOptions => sha256digest({string: c14nProofOptions})),
      cachedDocHash
    ]);
    // concatenate hash of c14n proof options and hash of c14n document
    return util.concat(proofHash, docHash);
  }

  /**
   * @param {object} options - The options to use.
   * @param {object} options.proof - The proof for which to get the
   *   verification method.
   * @param {Function} options.documentLoader - The document loader to use.
   *
   * @returns {object} - The verificationMethod.
   */
  async getVerificationMethod({proof, documentLoader}) {
    let {verificationMethod} = proof;

    if(typeof verificationMethod === 'object') {
      verificationMethod = verificationMethod.id;
    }

    if(!verificationMethod) {
      throw new Error('No "verificationMethod" found in proof.');
    }

    const result = await documentLoader(verificationMethod);
    if(!result) {
      throw new Error(
        `Unable to load verification method "${verificationMethod}".`);
    }

    const {document} = result;
    verificationMethod = typeof document === 'string' ?
      JSON.parse(document) : document;
    return verificationMethod;
  }

  async canonizeProof(proof, {documentLoader, document}) {
    // `proofValue` must not be included in the proof options
    proof = {
      '@context': document['@context'],
      ...proof
    };
    this.ensureSuiteContext({document: proof, addSuiteContext: true});
    delete proof.proofValue;
    return this.canonize(proof, {
      documentLoader,
      safe: true,
      base: null,
      skipExpansion: false
    });
  }

  /**
   * Checks whether a given proof exists in the document.
   *
   * @param {object} options - The options to use.
   * @param {object} options.proof - The proof to match.
   *
   * @returns {Promise<boolean>} Whether a match for the proof was found.
   */
  async matchProof({
    proof /*, document, purpose, documentLoader, expansionMap */
  }) {
    const {type, cryptosuite} = proof;
    return type === this.type && cryptosuite === this.cryptosuite;
  }

  /**
   * Ensures the document to be signed contains the required signature suite
   * specific `@context`, by either adding it (if `addSuiteContext` is true),
   * or throwing an error if it's missing.
   *
   * @param {object} options - Options hashmap.
   * @param {object} options.document - JSON-LD document to be signed.
   * @param {boolean} options.addSuiteContext - Add suite context?
   */
  ensureSuiteContext({document, addSuiteContext}) {
    const {contextUrl} = this;

    if(_includesContext({document, contextUrl}) ||
      _includesContext({document, contextUrl: VC_2_0_CONTEXT})) {
      // document already includes the required context
      return;
    }

    if(!addSuiteContext) {
      throw new TypeError(
        `The document to be signed must contain this suite's @context, ` +
          `"${contextUrl}".`);
    }

    // enforce the suite's context by adding it to the document
    const existingContext = document['@context'] || [];

    document['@context'] = Array.isArray(existingContext) ?
      [...existingContext, contextUrl] : [existingContext, contextUrl];
  }
}

/**
 * Tests whether a provided JSON-LD document includes a context URL in its
 * `@context` property.
 *
 * @param {object} options - Options hashmap.
 * @param {object} options.document - A JSON-LD document.
 * @param {string} options.contextUrl - A context URL.
 *
 * @returns {boolean} Returns true if document includes context.
 */
function _includesContext({document, contextUrl}) {
  const context = document['@context'];
  return context === contextUrl ||
    (Array.isArray(context) && context.includes(contextUrl));
}

/**
 * See constructor docstring for param details.
 *
 * @param {object} options - The options to use.
 * @param {object} options.signer - The signer to use.
 * @param {Array|string} options.requiredAlgorithm - The required algorithm.
 * @returns {{verificationMethod: string
 *   signer: {sign: Function, id: string, algorithm: string}}}} - Validated and
 *   initialized signature-related parameters.
 */
function _processSignatureParams({signer, requiredAlgorithm}) {
  const vm = {
    verificationMethod: undefined,
    signer: undefined
  };

  if(!signer) {
    return vm;
  }

  if(typeof signer.sign !== 'function') {
    throw new TypeError('A signer API has not been specified.');
  }
  const isSupportedAlgorithm = Array.isArray(requiredAlgorithm) ?
    requiredAlgorithm.includes(signer.algorithm) :
    requiredAlgorithm === signer.algorithm;

  if(!isSupportedAlgorithm) {
    const supportedAlgorithms = Array.isArray(requiredAlgorithm) ?
      requiredAlgorithm.join(', ') : requiredAlgorithm;
    const messageSuffix = Array.isArray(requiredAlgorithm) ?
      `is not a supported algorithm for the cryptosuite. The supported ` +
      `algorithms are: "${supportedAlgorithms}".` :
      `does not match the required algorithm for the cryptosuite ` +
      `"${supportedAlgorithms}".`;
    const message = `The signer's algorithm "${signer.algorithm}" ` +
      `${messageSuffix}`;
    throw new Error(message);
  }

  vm.signer = signer;
  vm.verificationMethod = signer.id;

  return vm;
}
