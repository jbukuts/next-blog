import zlib from 'zlib';
import { inflate } from 'pako';

/**
 * Compresses JSON object into base64 encoded string.
 * @param {object} data - JSON object to be compressed.
 * @returns {string}
 */
function compressData(data: object) {
  const compressedContent = zlib
    .gzipSync(JSON.stringify(data))
    .toString('base64');

  return compressedContent;
}

/**
 * Decompress base64 encoded string back into JSON object
 * @param {object} data - base64 encoded string.
 * @returns {object}
 */
function decompressData(data: string) {
  const binString = atob(data);

  const bytes = new Uint8Array(binString.length);
  bytes.forEach((_, i) => {
    bytes[i] = binString.charCodeAt(i);
  });

  const infBytes = inflate(bytes);

  const infString = new TextDecoder().decode(infBytes);
  const infData = JSON.parse(infString);

  return infData;
}

export { compressData, decompressData };
