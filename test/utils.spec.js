/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import {convertTimeStamp} from '../lib/util.js';
import {expect} from 'chai';

describe('util.js', function() {
  describe('util.convertTimeStamp', function() {
    it('should interpret as UTC if incorrectly serialized', async function() {
      const actualTimeStamp = '2024-09-03T14:13:10';
      const expectedUTCDateTime = '2024-09-03T14:13:10.000Z';
      const actualDate = convertTimeStamp(actualTimeStamp);
      const actualDateString = actualDate.toISOString();
      expect(
        actualDateString,
        'Expected timestamp to be interpreted as UTC'
      ).to.equal(expectedUTCDateTime);
    });
  });
});
