/*!
 * Copyright (c) 2021-2023 Digital Bazaar, Inc. All rights reserved.
 */
import {expect} from 'chai';

import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;

import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import {
  credential,
  ed25519MultikeyKeyPair
} from './mock-data.js';
import {DataIntegrityProof} from '../lib/index.js';
import {
  cryptosuite as eddsa2022CryptoSuite
} from '@digitalbazaar/eddsa-2022-cryptosuite';

import {loader} from './documentLoader.js';

const documentLoader = loader.build();

describe('DataIntegrityProof', () => {
  describe('exports', () => {
    it('it should have proper exports', async () => {
      should.exist(DataIntegrityProof);
    });
  });

  describe('constructor', () => {
    it('should fail to instantiate w/ incorrect signer algorithm', async () => {
      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const signer = keyPair.signer();
      signer.algorithm = 'wrong-algorithm';

      let error;
      try {
        new DataIntegrityProof({
          signer, date, cryptosuite: eddsa2022CryptoSuite
        });
      } catch(e) {
        error = e;
      }
      const errorMessage = `The signer's algorithm "${signer.algorithm}" ` +
        `does not match the required algorithm for the cryptosuite ` +
        `"${eddsa2022CryptoSuite.requiredAlgorithm}".`;
      expect(error).to.exist;
      expect(error.message).to.equal(errorMessage);
    });
  });

  describe('sign() using multikey key type', () => {
    it('should sign a document with a key pair', async () => {
      const unsignedCredential = {...credential};

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: eddsa2022CryptoSuite
      });

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('z3mUohG26PXywKkpw9v3Eacceo6kEDL44ps37hgYLj434kJhfigbqUATJJJbM' +
          'kue8HgagkTEtNXNkojGGiZU48cR9');
    });

    it('should sign with custom "createVerifyData"', async () => {
      const unsignedCredential = {...credential};
      const customCryptosuite = {
        ...eddsa2022CryptoSuite,
        async createVerifyData({
          document, proof, proofSet, documentLoader, dataIntegrityProof
        }) {
          // use default
          return dataIntegrityProof.createVerifyData(
            {document, proof, proofSet, documentLoader});
        }
      };

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: customCryptosuite
      });

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('z3mUohG26PXywKkpw9v3Eacceo6kEDL44ps37hgYLj434kJhfigbqUATJJJbM' +
          'kue8HgagkTEtNXNkojGGiZU48cR9');
    });

    it('should sign with custom "createProofValue"', async () => {
      const unsignedCredential = {...credential};
      const customCryptosuite = {
        ...eddsa2022CryptoSuite,
        async createProofValue({
          verifyData, document, proof, proofSet, documentLoader,
          dataIntegrityProof
        }) {
          // use default
          proof = await dataIntegrityProof.sign(
            {verifyData, document, proof, proofSet, documentLoader});
          return proof.proofValue;
        }
      };

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: customCryptosuite
      });

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('z3mUohG26PXywKkpw9v3Eacceo6kEDL44ps37hgYLj434kJhfigbqUATJJJbM' +
          'kue8HgagkTEtNXNkojGGiZU48cR9');
    });

    it('should sign with "createVerifyData" + "createProofValue"', async () => {
      const unsignedCredential = {...credential};
      const customCryptosuite = {
        ...eddsa2022CryptoSuite,
        async createVerifyData({
          document, proof, proofSet, documentLoader, dataIntegrityProof
        }) {
          // use default
          return dataIntegrityProof.createVerifyData(
            {document, proof, proofSet, documentLoader});
        },
        async createProofValue({
          verifyData, document, proof, proofSet, documentLoader,
          dataIntegrityProof
        }) {
          // use default
          proof = await dataIntegrityProof.sign(
            {verifyData, document, proof, proofSet, documentLoader});
          return proof.proofValue;
        }
      };

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: customCryptosuite
      });

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('z3mUohG26PXywKkpw9v3Eacceo6kEDL44ps37hgYLj434kJhfigbqUATJJJbM' +
          'kue8HgagkTEtNXNkojGGiZU48cR9');
    });

    it('should fail to sign with undefined term', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));
      unsignedCredential.undefinedTerm = 'foo';

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: eddsa2022CryptoSuite
      });

      let error;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        error = e;
      }
      expect(error).to.exist;
      expect(error.name).to.equal('jsonld.ValidationError');
    });

    it('should fail to sign with relative type URL', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));
      unsignedCredential.type.push('UndefinedType');

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: eddsa2022CryptoSuite
      });

      let error;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        error = e;
      }
      expect(error).to.exist;
      expect(error.name).to.equal('jsonld.ValidationError');
    });

    it('should fail to sign with custom "createVerifyData"', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));
      const brokenCryptosuite = {
        ...eddsa2022CryptoSuite,
        async createVerifyData() {
          throw new Error('Invalid createVerifyData');
        }
      };

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: brokenCryptosuite
      });

      let error;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        error = e;
      }
      expect(error).to.exist;
      expect(error.message).to.equal('Invalid createVerifyData');
    });

    it('should fail to sign with custom "createProofValue"', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));
      const brokenCryptosuite = {
        ...eddsa2022CryptoSuite,
        async createProofValue() {
          throw new Error('Invalid createProofValue');
        }
      };

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: brokenCryptosuite
      });

      let error;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        error = e;
      }
      expect(error).to.exist;
      expect(error.message).to.equal('Invalid createProofValue');
    });

    it('should throw error if "signer" is not specified', async () => {
      const unsignedCredential = {...credential};
      let signedCredential;
      //  no keypair, no signer object given
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        date, cryptosuite: eddsa2022CryptoSuite
      });

      let err;
      try {
        signedCredential = await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        err = e;
      }
      expect(signedCredential).to.equal(undefined);
      expect(err.name).to.equal('Error');
      expect(err.message).to.equal('A signer API has not been specified.');
    });

    it('should add the suite context by default', async () => {
      const unsignedCredential = {...credential};
      unsignedCredential['@context'] = [
        'https://www.w3.org/2018/credentials/v1',
        {
          AlumniCredential: 'https://schema.org#AlumniCredential',
          alumniOf: 'https://schema.org#alumniOf'
        }
        // do not include the suite-specific context
      ];

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: eddsa2022CryptoSuite
      });

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      expect(signedCredential['@context']).to.eql([
        'https://www.w3.org/2018/credentials/v1',
        {
          AlumniCredential: 'https://schema.org#AlumniCredential',
          alumniOf: 'https://schema.org#alumniOf'
        },
        'https://w3id.org/security/data-integrity/v1'
      ]);
    });

    it('should error if no context and addSuiteContext false', async () => {
      const unsignedCredential = {...credential};
      unsignedCredential['@context'] = [
        'https://www.w3.org/2018/credentials/v1',
        {
          AlumniCredential: 'https://schema.org#AlumniCredential',
          alumniOf: 'https://schema.org#alumniOf'
        },
        // do not include the suite-specific context
      ];

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: eddsa2022CryptoSuite
      });

      let err;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader,
          addSuiteContext: false
        });
      } catch(e) {
        err = e;
      }
      expect(err.name).to.equal('TypeError');
      expect(err.message).to
        .match(/The document to be signed must contain this suite's @context/);
    });
  });

  describe('derive() using multikey key type', () => {
    it('should create a proof with "derive"', async () => {
      const unsignedCredential = {...credential};
      // add `proof` that should not exist in derived output
      unsignedCredential.proof = [{type: 'urn:fake1'}];
      const customCryptosuite = {
        ...eddsa2022CryptoSuite,
        async derive({
          document, purpose, proofSet, documentLoader, dataIntegrityProof
        }) {
          // use default
          const proof = await dataIntegrityProof.createProof(
            {document, purpose, proofSet, documentLoader});
          return {
            ...document,
            proof
          };
        }
      };

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: customCryptosuite
      });

      const signedCredential = await jsigs.derive(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('z3mUohG26PXywKkpw9v3Eacceo6kEDL44ps37hgYLj434kJhfigbqUATJJJbM' +
          'kue8HgagkTEtNXNkojGGiZU48cR9');
    });
  });

  describe('verify() using multikey key type', () => {
    let signedCredential;

    before(async () => {
      const unsignedCredential = {...credential};

      const keyPair = await Ed25519Multikey.from({...ed25519MultikeyKeyPair});
      const date = '2022-09-06T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(), date, cryptosuite: eddsa2022CryptoSuite
      });

      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    });

    it('should verify a document', async () => {
      const suite = new DataIntegrityProof({cryptosuite: eddsa2022CryptoSuite});
      const result = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(result.verified).to.be.true;
    });

    it('should fail verification if "proofValue" is not string',
      async () => {
        const suite = new DataIntegrityProof({
          cryptosuite: eddsa2022CryptoSuite
        });
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proofValue type to not be string
        signedCredentialCopy.proof.proofValue = {};

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {error} = result.results[0];
        expect(result.verified).to.be.false;
        expect(error.name).to.equal('TypeError');
        expect(error.message).to.equal(
          'The proof does not include a valid "proofValue" property.'
        );
      });

    it('should fail verification if "proofValue" is not given',
      async () => {
        const suite = new DataIntegrityProof({
          cryptosuite: eddsa2022CryptoSuite
        });
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proofValue to be undefined
        signedCredentialCopy.proof.proofValue = undefined;

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {error} = result.results[0];

        expect(result.verified).to.be.false;
        expect(error.name).to.equal('TypeError');
        expect(error.message).to.equal(
          'The proof does not include a valid "proofValue" property.'
        );
      });

    it('should fail verification if proofValue string does not start with "z"',
      async () => {
        const suite = new DataIntegrityProof({
          cryptosuite: eddsa2022CryptoSuite
        });
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proofValue to not start with 'z'
        signedCredentialCopy.proof.proofValue = 'a';

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {errors} = result.error;

        expect(result.verified).to.be.false;
        expect(errors[0].name).to.equal('Error');
        expect(errors[0].message).to.equal(
          'Only base58btc or base64url multibase encoding is supported.'
        );
      });

    it('should fail verification if proof type is not DataIntegrityProof',
      async () => {
        const suite = new DataIntegrityProof({
          cryptosuite: eddsa2022CryptoSuite
        });
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proof type to be InvalidSignature2100
        signedCredentialCopy.proof.type = 'InvalidSignature2100';

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {errors} = result.error;

        expect(result.verified).to.be.false;
        expect(errors[0].name).to.equal('NotFoundError');
      });
  });
});
