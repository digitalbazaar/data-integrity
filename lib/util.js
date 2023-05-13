
/*!
 * Copyright (c) 2022-2023 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Converts the given date into W3C datetime format (eg: 2011-03-09T21:55:41Z).
 *
 * @param {Date|number|string} date - The date to convert.
 *
 * @returns {string} The date in W3C datetime format.
 */
export const w3cDate = date => {
  if(date === undefined || date === null) {
    date = new Date();
  } else if(typeof date === 'number' || typeof date === 'string') {
    date = new Date(date);
  }
  const str = date.toISOString();
  return str.slice(0, - 5) + 'Z';
};

/**
 * Concatenates two Uint8Arrays.
 *
 * @param {Uint8Array} b1 - The first buffer to concat.
 * @param {Uint8Array} b2 - The second buffer to concat.
 *
 * @returns {Uint8Array} The result.
 */
export const concat = (b1, b2) => {
  const rval = new Uint8Array(b1.length + b2.length);
  rval.set(b1, 0);
  rval.set(b2, b1.length);
  return rval;
};
