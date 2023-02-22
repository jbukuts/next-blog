import zlib from 'zlib';
import { inflate } from 'pako';

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

function compressData(data: object) {
  const compressedContent = zlib
    .gzipSync(JSON.stringify(data))
    .toString('base64');

  return compressedContent;
}

export { compressData, decompressData };
