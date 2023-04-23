/* eslint-disable no-bitwise */
interface ColorsMapItem {
  color: string;
  compliment: string;
}

interface AppleColor {
  aqua: number[];
}

const fullAquaList: Record<string, AppleColor> = {
  red: {
    aqua: [255, 59, 48]
  },
  orange: {
    aqua: [255, 149, 0]
  },
  yellow: {
    aqua: [255, 204, 0]
  },
  green: {
    aqua: [40, 205, 65]
  },
  mint: {
    aqua: [0, 199, 190]
  },
  teal: {
    aqua: [89, 173, 196]
  },
  cyan: {
    aqua: [85, 190, 240]
  },
  blue: {
    aqua: [0, 122, 255]
  },
  indigo: {
    aqua: [88, 86, 214]
  },
  purple: {
    aqua: [175, 82, 222]
  },
  pink: {
    aqua: [255, 45, 85]
  },
  brown: {
    aqua: [162, 132, 94]
  }
};

const rgbToHex = (rgbArr: number[]) => {
  const [r, g, b] = rgbArr;
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

const colorFromString = (input: string): ColorsMapItem => {
  const hash = Array.from(input).reduce(
    (acc, curr) => curr.charCodeAt(0) + ((acc << 5) - acc),
    0
  );

  const macColors = Object.values(fullAquaList);
  const { aqua } = macColors[Math.abs(hash % macColors.length)];

  return {
    color: rgbToHex(aqua),
    compliment: 'white'
  };
};

export default ((santaCheck: boolean) => {
  const colorsMap = new Map<string, ColorsMapItem>();
  const colorKeys = Object.keys(fullAquaList);
  const doesExist = (searchColor: string) =>
    Array.from(colorsMap.values()).filter(({ color }) => color === searchColor)
      .length > 0;

  return new Proxy({} as any, {
    get: function get(_, key: string) {
      if (!colorsMap.has(key)) {
        const colorItem = colorFromString(key);

        // exhaust all colors before repeats
        if (
          santaCheck &&
          colorsMap.size < colorKeys.length &&
          doesExist(colorItem.color)
        ) {
          const redoRandom = Math.floor(Math.random() * colorKeys.length);
          const redoColor = rgbToHex(fullAquaList[colorKeys[redoRandom]].aqua);

          if (doesExist(redoColor))
            (this as any).get(undefined, key, undefined);
          else
            colorsMap.set(key, {
              color: redoColor,
              compliment: 'white'
            });
        } else {
          colorsMap.set(key, colorItem);
        }
      }
      return colorsMap.get(key);
    }
  });
})(false);
