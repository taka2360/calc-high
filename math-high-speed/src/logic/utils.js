export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Scaled random based on difficulty
// Easy: reduced range
// Hard: expanded range
export const getScaledRandomInt = (min, max, difficulty = 'Normal') => {
    let scale = 1;
    if (difficulty === 'Easy') scale = 0.5;
    if (difficulty === 'Hard') scale = 1.5;
    
    let sMin = Math.ceil(min * scale);
    let sMax = Math.ceil(max * scale);
    
    // Ensure bounds validity
    if (sMin > sMax) [sMin, sMax] = [sMax, sMin];
    if (sMin === sMax) sMax++;
    
    return getRandomInt(sMin, sMax);
};

export const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
};

export const simplifyFraction = (num, den) => {
    const common = gcd(Math.abs(num), Math.abs(den));
    return [num / common, den / common];
};

export const toLatexFraction = (num, den) => {
    if (den === 0) return 'undef';
    if (den === 1) return `${num}`;
    if (den === -1) return `${-num}`;
    if (num === 0) return '0';
    return `\\frac{${num}}{${den}}`;
};
