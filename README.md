# Data Integrity library _(@digitalbazaar/data-integrity)_

[![Build status](https://img.shields.io/github/workflow/status/digitalbazaar/data-integrity/Node.js%20CI)](https://github.com/digitalbazaar/data-integrity/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage status](https://img.shields.io/codecov/c/github/digitalbazaar/data-integrity)](https://codecov.io/gh/digitalbazaar/data-integrity)
[![NPM Version](https://img.shields.io/npm/v/@digitalbazaar/data-integrity.svg)](https://npm.im/@digitalbazaar/data-integrity)

> DataIntegrity library for use with cryptosuites and jsonld-signatures.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

For use with https://github.com/digitalbazaar/jsonld-signatures v11.0 and above.

See also related specs:

* [Verifiable Credential Data Integrity](https://w3c.github.io/vc-data-integrity/)

## Security

TBD

## Install

- Browsers and Node.js 18+ are supported.

To install from NPM:

```
npm install @digitalbazaar/data-integrity
```

To install locally (for development):

```
git clone https://github.com/digitalbazaar/data-integrity.git
cd data-integrity
npm install
```

## Usage

The following code snippet provides a complete example of digitally signing
a verifiable credential using this library:

```javascript
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {cryptosuite as eddsa2022CryptoSuite} from
  '@digitalbazaar/eddsa-2022-cryptosuite';
import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;


// create the unsigned credential
const unsignedCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      AlumniCredential: 'https://schema.org#AlumniCredential',
      alumniOf: 'https://schema.org#alumniOf'
    }
  ],
  id: 'http://example.edu/credentials/1872',
  type: [ 'VerifiableCredential', 'AlumniCredential' ],
  issuer: 'https://example.edu/issuers/565049',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'https://example.edu/students/alice',
    alumniOf: 'Example University'
  }
};

// create the keypair to use when signing
const controller = 'https://example.edu/issuers/565049';
const keyPair = await Ed25519Multikey.from({
  '@context': 'https://w3id.org/security/multikey/v1',
  type: 'Multikey',
  controller,
  id: controller + '#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
  publicKeyMultibase: 'z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
  secretKeyMultibase: 'zrv3rbPamVDGvrm7LkYPLWYJ35P9audujKKsWn3x29EUiGwwhdZQd' +
    '1iHhrsmZidtVALBQmhX3j9E5Fvx6Kr29DPt6LH'
});

// export public key and add to document loader
const publicKey = await keyPair.export({publicKey: true, includeContext: true});
addDocumentToLoader({url: publicKey.id, document: publicKey});

// create key's controller document
const controllerDoc = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/multikey/v1'
  ],
  id: controller,
  assertionMethod: [publicKey]
};
addDocumentToLoader({url: controllerDoc.id, document: controllerDoc});

// create suite
const suite = new DataIntegrityProof({
  signer: keyPair.signer(), cryptosuite: eddsa2022CryptoSuite
});

// create signed credential
const signedCredential = await jsigs.sign(unsignedCredential, {
  suite,
  purpose: new AssertionProofPurpose(),
  documentLoader
});

// results in the following signed VC
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    {
      "AlumniCredential": "https://schema.org#AlumniCredential",
      "alumniOf": "https://schema.org#alumniOf"
    },
    "https://w3id.org/security/data-integrity/v2"
  ],
  "id": "http://example.edu/credentials/1872",
  "type": [
    "VerifiableCredential",
    "AlumniCredential"
  ],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "https://example.edu/students/alice",
    "alumniOf": "Example University"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2022-09-06T21:29:24Z",
    "verificationMethod": "https://example.edu/issuers/565049#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT",
    "cryptosuite": "eddsa-2022",
    "proofPurpose": "assertionMethod",
    "proofValue": "zakT6XP6P7ZVAGJKjvnVi1YjC96RufyeasEEMkDQrCkvMnG3QeAqBuoVoWAWkEEd5w8FATEigPA5788ByuwnCZrd"
  }
}
```

Note: To create or verify proofs using legacy draft data integrity suites, you
must pass `legacyContext: true` when creating a `DataIntegrityProof` instance;
this will cause the appropriate legacy data integrity context (
https://w3id.org/security/data-integrity/v1) to be used.

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © 2022 Digital Bazaar
