/*
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
/* eslint-env browser */
const crypto = self && (self.crypto || self.msCrypto);

/**
 * Hashes a string of data using SHA-256.
 *
 * @param {string} string - The string to hash.
 *
 * @returns {Uint8Array} The hash digest.
 */
export async function sha256digest({string}) {
  const bytes = new TextEncoder().encode(string);
  return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
}
