# @digitalbazaar/data-integrity Changelog

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
