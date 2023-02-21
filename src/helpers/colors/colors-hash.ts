/* eslint-disable no-bitwise */
interface ColorsMapItem {
  color: string;
  compliment: string;
}

const rgbToHex = (rgbArr: number[]) =>
  rgbArr.reduce(
    (acc: string, curr: number) => `${acc}${curr.toString(16)}`,
    `#`
  );

const calculateCompliment = (rgbArr: number[]): string => {
  const [r, g, b] = rgbArr;
  return r * 0.299 + g * 0.587 + b * 0.114 < 186 ? 'white' : 'black';
};

// eslint-disable-next-line arrow-body-style
const colorFromString = (input: string): ColorsMapItem => {
  const hash = Array.from(input).reduce(
    (acc, curr) => curr.charCodeAt(0) + ((acc << 5) - acc),
    0
  );
  const rgbColor = [0, 0, 0].map((_, i) => (hash >> (i * 8)) & 0xff);
  // const hexColor = rgbToHex(rgbColor);
  return {
    color: `hsl(${(hash & hash) % 360}, ${95}%, ${45}%)`,
    compliment: 'white'
  };
};

export default (() => {
  const colorsMap = new Map<string, ColorsMapItem>();
  return new Proxy({} as any, {
    get(_, key: string) {
      if (!colorsMap.has(key)) {
        const colorItem = colorFromString(key);
        colorsMap.set(key, colorItem);
      }
      return colorsMap.get(key);
    }
  });
})();
