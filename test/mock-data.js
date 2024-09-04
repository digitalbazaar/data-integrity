/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
export const controller = 'https://example.edu/issuers/565049';

export const mockPublicEd25519Multikey = {
  '@context': 'https://w3id.org/security/multikey/v1',
  type: 'Multikey',
  controller,
  id: controller + '#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
  publicKeyMultibase: 'z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT'
};

export const ed25519MultikeyKeyPair = {
  '@context': 'https://w3id.org/security/multikey/v1',
  type: 'Multikey',
  controller,
  id: controller + '#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
  publicKeyMultibase: 'z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
  secretKeyMultibase: 'zrv3rbPamVDGvrm7LkYPLWYJ35P9audujKKsWn3x29EUiGwwhdZQd' +
    '1iHhrsmZidtVALBQmhX3j9E5Fvx6Kr29DPt6LH'
};

export const controllerDocEd25519Multikey = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/multikey/v1'
  ],
  id: 'https://example.edu/issuers/565049',
  assertionMethod: [mockPublicEd25519Multikey]
};

export const credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      AlumniCredential: 'https://schema.org#AlumniCredential',
      alumniOf: 'https://schema.org#alumniOf'
    },
    'https://w3id.org/security/data-integrity/v2'
  ],
  id: 'http://example.edu/credentials/1872',
  type: ['VerifiableCredential', 'AlumniCredential'],
  issuer: 'https://example.edu/issuers/565049',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'https://example.edu/students/alice',
    alumniOf: 'Example University'
  }
};

export const credentialWithLegacyContext = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      AlumniCredential: 'https://schema.org#AlumniCredential',
      alumniOf: 'https://schema.org#alumniOf'
    },
    'https://w3id.org/security/data-integrity/v1'
  ],
  id: 'http://example.edu/credentials/1872',
  type: ['VerifiableCredential', 'AlumniCredential'],
  issuer: 'https://example.edu/issuers/565049',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'https://example.edu/students/alice',
    alumniOf: 'Example University'
  }
};

export const proofChainTests = {
  missingProofString: {
    proof: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          '@protected': true,
          DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
          DriverLicense: {
            '@id': 'urn:example:DriverLicense',
            '@context': {
              '@protected': true,
              id: '@id',
              type: '@type',
              documentIdentifier: 'urn:example:documentIdentifier',
              dateOfBirth: 'urn:example:dateOfBirth',
              expirationDate: 'urn:example:expiration',
              issuingAuthority: 'urn:example:issuingAuthority'
            }
          },
          driverLicense: {
            '@id': 'urn:example:driverLicense',
            '@type': '@id'
          }
        },
        'https://w3id.org/security/data-integrity/v2'
      ],
      previousProof: 'urn:uuid:test:missing:proof',
      type: 'DataIntegrityProof',
      created: '2024-09-04T17:56:23Z',
      verificationMethod: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
      cryptosuite: 'eddsa-2022',
      proofPurpose: 'assertionMethod',
      proofValue: 'z2TgUCiDPt9DFyFuFN2vGq6Hi7dhnCnE8MVU6LJ6p69QvyLXfjiB9ut8g7A11omzrZxAZo8TeuyAtTJAcgzDmEkTL'
    },
    proofSet: [
      {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          {
            '@protected': true,
            DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
            DriverLicense: {
              '@id': 'urn:example:DriverLicense',
              '@context': {
                '@protected': true,
                id: '@id',
                type: '@type',
                documentIdentifier: 'urn:example:documentIdentifier',
                dateOfBirth: 'urn:example:dateOfBirth',
                expirationDate: 'urn:example:expiration',
                issuingAuthority: 'urn:example:issuingAuthority'
              }
            },
            driverLicense: {
              '@id': 'urn:example:driverLicense',
              '@type': '@id'
            }
          },
          'https://w3id.org/security/data-integrity/v2'
        ],
        id: 'urn:uuid:test:first:proof',
        type: 'DataIntegrityProof',
        created: '2024-09-04T17:56:23Z',
        verificationMethod: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
        cryptosuite: 'eddsa-2022',
        proofPurpose: 'assertionMethod',
        proofValue: 'zYJwkeNWFRcrM6zHMrWZVa1U8ZUFDMQBA6osVMaYE7moKsauoLyZsqRFAWbdnhumHjwb3dbtcjw5Xs6bTPuT8XvU'
      },
      {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          {
            '@protected': true,
            DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
            DriverLicense: {
              '@id': 'urn:example:DriverLicense',
              '@context': {
                '@protected': true,
                id: '@id',
                type: '@type',
                documentIdentifier: 'urn:example:documentIdentifier',
                dateOfBirth: 'urn:example:dateOfBirth',
                expirationDate: 'urn:example:expiration',
                issuingAuthority: 'urn:example:issuingAuthority'
              }
            },
            driverLicense: {
              '@id': 'urn:example:driverLicense',
              '@type': '@id'
            }
          },
          'https://w3id.org/security/data-integrity/v2'
        ],
        previousProof: 'urn:uuid:test:missing:proof',
        type: 'DataIntegrityProof',
        created: '2024-09-04T17:56:23Z',
        verificationMethod: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
        cryptosuite: 'eddsa-2022',
        proofPurpose: 'assertionMethod',
        proofValue: 'z2TgUCiDPt9DFyFuFN2vGq6Hi7dhnCnE8MVU6LJ6p69QvyLXfjiB9ut8g7A11omzrZxAZo8TeuyAtTJAcgzDmEkTL'
      }
    ],
    document: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          '@protected': true,
          DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
          DriverLicense: {
            '@id': 'urn:example:DriverLicense',
            '@context': {
              '@protected': true,
              id: '@id',
              type: '@type',
              documentIdentifier: 'urn:example:documentIdentifier',
              dateOfBirth: 'urn:example:dateOfBirth',
              expirationDate: 'urn:example:expiration',
              issuingAuthority: 'urn:example:issuingAuthority'
            }
          },
          driverLicense: {
            '@id': 'urn:example:driverLicense',
            '@type': '@id'
          }
        },
        'https://w3id.org/security/data-integrity/v2'
      ],
      id: 'urn:uuid:36245ee9-9074-4b05-a777-febff2e69757',
      type: [
        'VerifiableCredential',
        'DriverLicenseCredential'
      ],
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        id: 'urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440',
        driverLicense: {
          type: 'DriverLicense',
          documentIdentifier: 'T21387yc328c7y32h23f23',
          dateOfBirth: '01-01-1990',
          expirationDate: '01-01-2030',
          issuingAuthority: 'VA'
        }
      },
      issuer: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT'
    }

  },
  valid: {
    proof: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          '@protected': true,
          DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
          DriverLicense: {
            '@id': 'urn:example:DriverLicense',
            '@context': {
              '@protected': true,
              id: '@id',
              type: '@type',
              documentIdentifier: 'urn:example:documentIdentifier',
              dateOfBirth: 'urn:example:dateOfBirth',
              expirationDate: 'urn:example:expiration',
              issuingAuthority: 'urn:example:issuingAuthority'
            }
          },
          driverLicense: {
            '@id': 'urn:example:driverLicense',
            '@type': '@id'
          }
        },
        'https://w3id.org/security/data-integrity/v2'
      ],
      previousProof: 'urn:uuid:test:first:proof',
      type: 'DataIntegrityProof',
      created: '2024-09-04T17:56:23Z',
      verificationMethod: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
      cryptosuite: 'eddsa-2022',
      proofPurpose: 'assertionMethod',
      proofValue: 'z21G3JXgi1PcUazGXH1Vs4ugrioC3WcRQnZdn9QvP9kHL8mTXvPVaVczSM2EzwSTmz7iejiR6cXdrHDgxNSHJSHY8'
    },
    proofSet: [
      {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          {
            '@protected': true,
            DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
            DriverLicense: {
              '@id': 'urn:example:DriverLicense',
              '@context': {
                '@protected': true,
                id: '@id',
                type: '@type',
                documentIdentifier: 'urn:example:documentIdentifier',
                dateOfBirth: 'urn:example:dateOfBirth',
                expirationDate: 'urn:example:expiration',
                issuingAuthority: 'urn:example:issuingAuthority'
              }
            },
            driverLicense: {
              '@id': 'urn:example:driverLicense',
              '@type': '@id'
            }
          },
          'https://w3id.org/security/data-integrity/v2'
        ],
        id: 'urn:uuid:test:first:proof',
        type: 'DataIntegrityProof',
        created: '2024-09-04T17:56:23Z',
        verificationMethod: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
        cryptosuite: 'eddsa-2022',
        proofPurpose: 'assertionMethod',
        proofValue: 'zYJwkeNWFRcrM6zHMrWZVa1U8ZUFDMQBA6osVMaYE7moKsauoLyZsqRFAWbdnhumHjwb3dbtcjw5Xs6bTPuT8XvU'
      },
      {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          {
            '@protected': true,
            DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
            DriverLicense: {
              '@id': 'urn:example:DriverLicense',
              '@context': {
                '@protected': true,
                id: '@id',
                type: '@type',
                documentIdentifier: 'urn:example:documentIdentifier',
                dateOfBirth: 'urn:example:dateOfBirth',
                expirationDate: 'urn:example:expiration',
                issuingAuthority: 'urn:example:issuingAuthority'
              }
            },
            driverLicense: {
              '@id': 'urn:example:driverLicense',
              '@type': '@id'
            }
          },
          'https://w3id.org/security/data-integrity/v2'
        ],
        previousProof: 'urn:uuid:test:first:proof',
        type: 'DataIntegrityProof',
        created: '2024-09-04T17:56:23Z',
        verificationMethod: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT#z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT',
        cryptosuite: 'eddsa-2022',
        proofPurpose: 'assertionMethod',
        proofValue: 'z21G3JXgi1PcUazGXH1Vs4ugrioC3WcRQnZdn9QvP9kHL8mTXvPVaVczSM2EzwSTmz7iejiR6cXdrHDgxNSHJSHY8'
      }
    ],
    document: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          '@protected': true,
          DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
          DriverLicense: {
            '@id': 'urn:example:DriverLicense',
            '@context': {
              '@protected': true,
              id: '@id',
              type: '@type',
              documentIdentifier: 'urn:example:documentIdentifier',
              dateOfBirth: 'urn:example:dateOfBirth',
              expirationDate: 'urn:example:expiration',
              issuingAuthority: 'urn:example:issuingAuthority'
            }
          },
          driverLicense: {
            '@id': 'urn:example:driverLicense',
            '@type': '@id'
          }
        },
        'https://w3id.org/security/data-integrity/v2'
      ],
      id: 'urn:uuid:36245ee9-9074-4b05-a777-febff2e69757',
      type: [
        'VerifiableCredential',
        'DriverLicenseCredential'
      ],
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        id: 'urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440',
        driverLicense: {
          type: 'DriverLicense',
          documentIdentifier: 'T21387yc328c7y32h23f23',
          dateOfBirth: '01-01-1990',
          expirationDate: '01-01-2030',
          issuingAuthority: 'VA'
        }
      },
      issuer: 'did:key:z6MkwXG2WjeQnNxSoynSGYU8V9j3QzP3JSqhdmkHc6SaVWoT'
    }
  }
};
