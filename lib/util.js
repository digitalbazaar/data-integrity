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

export const timezoneOffset = new RegExp(
  '(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))$');

// Z and T must be uppercase
// xml schema date time RegExp
// @see https://www.w3.org/TR/xmlschema11-2/#dateTime
export const XMLDateTimeRegExp = new RegExp(
  '-?([1-9][0-9]{3,}|0[0-9]{3})' +
  '-(0[1-9]|1[0-2])' +
  '-(0[1-9]|[12][0-9]|3[01])' +
  'T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))' +
  '(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?');
export const isW3cDate = timeStamp => XMLDateTimeRegExp.test(timeStamp);

export const convertTimeStamp = timestamp => {
  if(!timestamp) {
    throw new Error(`Unexpected timestamp ("${timestamp}") received.`);
  }
  if(!timezoneOffset.test(timestamp)) {
    return new Date(`${timestamp}Z`);
  }
  return new Date(timestamp);
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
