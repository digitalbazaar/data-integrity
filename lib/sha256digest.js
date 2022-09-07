/*
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import crypto from 'node:crypto';

/**
 * Hashes a string of data using SHA-256.
 *
 * @param {string} string - The string to hash.
 *
 * @returns {Uint8Array} The hash digest.
 */
export async function sha256digest({string}) {
  return new Uint8Array(crypto.createHash('sha256').update(string).digest());
}
