/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import {DataIntegrityProof} from '../lib/index.js';
import {
  cryptosuite as eddsa2022CryptoSuite
} from '@digitalbazaar/eddsa-2022-cryptosuite';
import {expect} from 'chai';
import {proofChainTests} from './mock-data.js';

import {loader} from './documentLoader.js';

const documentLoader = loader.build();

describe('DataIntegrityProof.verifyProof', () => {
  it('should verify a proof with existant previousProof', async function() {
    const basicParams = structuredClone(proofChainTests.valid);
    const suite = new DataIntegrityProof({cryptosuite: eddsa2022CryptoSuite});
    const result = await suite.verifyProof({...basicParams, documentLoader});
    expect(result, 'Expected verifyProof to return a result').to.exist;
    expect(
      result.verified,
      'Expected result to have property verified'
    ).to.exist;
    expect(result.verified, 'Expected VC with proofChain to verify').to.be.true;
  });
  it('should not verify a proof w/o existant previousProof', async function() {
    const basicParams = structuredClone(proofChainTests.missingProofString);
    const suite = new DataIntegrityProof({cryptosuite: eddsa2022CryptoSuite});
    const result = await suite.verifyProof({...basicParams, documentLoader});
    expect(result, 'Expected verifyProof to return a result').to.exist;
    expect(
      result.verified,
      'Expected result to have property verified'
    ).to.exist;
    expect(
      result.verified,
      'Expected VC with missing previousProof to not verify'
    ).to.be.false;
  });
});
