const helpers = {
    throttle(fn, wait) {
        var time = Date.now();
        return function(...args) {
            if ((time + wait - Date.now()) < 0) {
                fn(...args);
                time = Date.now();
            }
        };
    },
    debounce(fn, timeout) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { fn.apply(this, args); }, timeout);
        };
    },
    hashAColor(str) {
        const hash = Array.from(str).reduce((acc,curr) => curr.charCodeAt(0) + ((acc << 5) - acc), 0); 
        const color = [0,1,2].reduce((acc,i) => {
            const v = (hash >> (i * 8)) & 0xFF;
            return acc + ('00' + v.toString(16)).substr(-2);
        },'#');
        return color;
    },
    getAccentColor(inputColor) {
        if (inputColor.length !== 7) return '#000';
        const color = inputColor.replace('#', '');
        const [r,g,b] = [
            parseInt(color.slice(0,2), 16),
            parseInt(color.slice(2,4), 16),
            parseInt(color.slice(4,6), 16),
        ];
        const luma = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
        return `hsl(0, 0%, calc((${luma} - ${.5}) * -10000000%))`;
    }
};

export default helpers;