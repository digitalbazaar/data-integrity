# @digitalbazaar/data-integrity Changelog

## 2.1.0 - 2024-02-13

### Added
- Add option to pass `date: null` to the `DataIntegrityProof`
  constructor, resulting in a proof without the `proof.created`
  property.

## 2.0.0 - 2023-11-13

### Added
- Add `legacyContext` flag to allow use of legacy context
  `https://w3id.org/security/data-integrity/v1`.

### Changed
- **BREAKING**: Update default `this.contextUrl` to point to
  `https://w3id.org/security/data-integrity/v2`.
- **BREAKING**: Drop support for Node.js < 18.

## 1.5.0 - 2023-11-06

### Changed
- Refactor algorithm check to accommodate `requiredAlgorithm` represented as
  array.

## 1.4.1 - 2023-08-02

### Fixed
- Change JSON-LD context fallback in `canonizeProof` to the document's
  `@context`, adding the suite context only if necessary. This ensures that
  the canonicalized proof is identical in both issuance and verification.

## 1.4.0 - 2023-05-21

### Added
- Allow the VCDM 2.0 context to be used as an alternative to the
  data integrity context for simpler usage with 2.0 VCs.

## 1.3.1 - 2023-05-17

### Fixed
- Ensure custom `createVerifyData` is called in `verifyProof`.

## 1.3.0 - 2023-05-13

### Added
- Add support for `derive` function to be implemented by the given
  `cryptosuite`. The `derive` function is used to derive a new document with
  a new `proof` based on an existing `document` (and `proof`). The `derive`
  function will be used when calling `derive` from `jsonld-signatures`.
- Enable `cryptosuite` to provide custom `createVerifyData`. If provided,
  the cryptosuite's function will be called passing the `cryptosuite` instance
  (that was given to the `DataIntegrityProof` constructor) and the
  `dataIntegrityProof` instance along with the usual parameters for that
  function. The resulting verify data may be either a `Uint8Array` or an
  `object` that will be understood by a compatible `signer`, `verifier`, or
  `createProofValue` custom function.
- Enable `cryptosuite` to provide custom `createProofValue`. If provided,
  the cryptosuite's function will be called passing the `cryptosuite` instance
  (that was given to the `DataIntegrityProof` constructor) and the
  `dataIntegrityProof` instance along with the created `verifyData`, `document`,
  `proof`, `proofSet`, and `documentLoader`. The `verifyData` will be either a
  `Uint8Array` or an `object` based on the default `createVerifyData` function
  or a custom one if the cryptosuite also provides it.

## 1.2.0 - 2023-04-14

### Added
- Add `matchProof()` to override the one in `LinkedDataProof` to check
  cryptosuite value.

## 1.1.0 - 2022-09-20

### Added
- Assertion method validation is to be handled by cryptosuites that
  are responsible for creating verifier interfaces. This assertion
  work was being duplicated in this library but it must already be
  done by the cryptosuite responsible for converting a verification
  method to a verifier interface so it has been removed. Additionally,
  the assertion work being done in this library was too restrictive;
  not allowing cryptosuites to convert key types as needed. This
  library now relinquishes all validation to the
  `cryptosuite.createVerifier` method provided.

## 1.0.0 - 2022-09-08

### Added
- Initial version.
