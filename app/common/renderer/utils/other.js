import _ from 'lodash';

import {STANDARD_W3C_CAPS} from '../constants/session-builder.js';

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

/**
 * Generates a random ID string for persistent data like session details or gestures.
 * Uses `crypto.getRandomValues` instead of `crypto.randomUUID` to support insecure contexts,
 * such as the plugin version when accessed over HTTP.
 * @returns random ID string (5-32 symbols)
 */
export const getRandomId = () => crypto.getRandomValues(new Uint32Array(3)).join('-');

/**
 * Adds vendor prefixes to capabilities that don't have them.
 * @param {Array} caps - The array of capabilities
 * @returns {Array<Object>} - The array of capabilities with vendor prefixes added
 */
export function addVendorPrefixes(caps) {
  return caps.map((cap) => {
    // if we don't have a valid unprefixed cap or a cap with an existing prefix, update it
    if (
      !_.isUndefined(cap.name) &&
      !STANDARD_W3C_CAPS.includes(cap.name) &&
      !_.includes(cap.name, ':')
    ) {
      cap.name = `appium:${cap.name}`;
    }
    return cap;
  });
}

/**
 * Converts pixels to a percentage of the total value (width/height).
 * @param {number} px - The pixel value to convert
 * @param {number} maxPixels - The total value (width/height) in pixels
 * @returns {number} - The percentage value
 */
export function pixelsToPercentage(px, maxPixels) {
  if (!isNaN(px)) {
    return parseFloat(((px / maxPixels) * 100).toFixed(1), 10);
  }
}

/**
 * Converts a percentage to pixels based on the total value (width/height).
 * @param {number} pct - The percentage value to convert
 * @param {number} maxPixels - The total value (width/height) in pixels
 * @returns {number} - The pixel value
 */
export function percentageToPixels(pct, maxPixels) {
  if (!isNaN(pct)) {
    return Math.round(maxPixels * (pct / 100));
  }
}

/**
 * Parses coordinates from an element's attributes.
 * Depending on the platform, this is contained either in the 'bounds' property,
 * or the 'x'/'y'/'width'/'height' properties
 * @param {Object} element - The element object
 * @returns {Object} - The parsed coordinates
 */
export function parseCoordinates(element) {
  const {bounds, x, y, width, height} = element.attributes || {};

  if (bounds) {
    const boundsArray = bounds.split(/\[|\]|,/).filter((str) => str !== '');
    const [x1, y1, x2, y2] = boundsArray.map((val) => parseInt(val, 10));
    return {x1, y1, x2, y2};
  } else if (x) {
    const originsArray = [x, y, width, height];
    const [xInt, yInt, widthInt, heightInt] = originsArray.map((val) => parseInt(val, 10));
    return {x1: xInt, y1: yInt, x2: xInt + widthInt, y2: yInt + heightInt};
  } else {
    return {};
  }
}
