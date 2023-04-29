export default (item) => Buffer.from(JSON.stringify(item)).byteLength / 1000;
