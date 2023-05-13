# @digitalbazaar/data-integrity Changelog

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
