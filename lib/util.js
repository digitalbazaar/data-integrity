
/*
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Converts the given date into W3C datetime format (eg: 2011-03-09T21:55:41Z).
 *
 * @param date - the date to convert.
 *
 * @returns the date in W3C datetime format.
 */
export const w3cDate = date => {
  if(date === undefined || date === null) {
    date = new Date();
  } else if(typeof date === 'number' || typeof date === 'string') {
    date = new Date(date);
  }
  const str = date.toISOString();
  return str.substr(0, str.length - 5) + 'Z';
};

/**
 * Concatenates two Uint8Arrays.
 *
 * @param b1 - {Uint8Array}.
 * @param b2 - {Uint8Array}.
 *
 * @returns {Uint8Array} the result.
 */
export const concat = (b1, b2) => {
  const rval = new Uint8Array(b1.length + b2.length);
  rval.set(b1, 0);
  rval.set(b2, b1.length);
  return rval;
};
