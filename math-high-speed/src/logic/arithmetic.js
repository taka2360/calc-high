import { getRandomInt } from './utils.js';

// digits: number OR [number, number]
export const generateArithmetic = (digitsConfig = 1, difficulty = 'Normal', opType = 'add') => {
    // Parse digits configuration
    let d1, d2;
    if (Array.isArray(digitsConfig)) {
        d1 = digitsConfig[0];
        d2 = digitsConfig[1];
    } else {
        d1 = digitsConfig;
        d2 = digitsConfig;
    }

    const getRange = (d) => {
        const min = Math.pow(10, d - 1);
        const max = Math.pow(10, d) - 1;
        return [min, max];
    };

    let v1 = getRandomInt(...getRange(d1));
    let v2 = getRandomInt(...getRange(d2));
    
    let ans, operator;

    switch(opType) {
        case 'sub':
            operator = '-';
            // If strictly positive result required? usually yes.
            // If Hard, negative allowed.
            if (difficulty !== 'Hard') {
                // Ensure v1 >= v2.
                // But if user requested 1 digit - 3 digits? Result is neg.
                // If config explicitly asks for d1 < d2, we allow neg.
                // If config allows random swap, we might swap.
                // Here, user explicitly set d1 and d2. We should respect it.
                // 3 digits (100) - 2 digits (99) > 0.
                // 2 digits - 3 digits < 0.
                // We trust the config.
                // BUT, if d1 == d2, we might want to ensure v1 >= v2 for Easy/Normal.
                if (d1 === d2 && v2 > v1) {
                     [v1, v2] = [v2, v1];
                }
            }
            ans = v1 - v2;
            break;
        case 'mul':
            operator = '\\times';
            ans = v1 * v2;
            break;
        case 'div':
             operator = '\\div';
             // Logic: v1 (Dividend) / v2 (Divisor) = ans (Quotient)
             // User config: d1 is Dividend digits, d2 is Divisor digits?
             // Or d1 is Quotient digits?
             // Standard: "3 digit / 1 digit" implies 123 / 3.
             // We need to ensure divisibility.
             
             // Regenerate v2 (Divisor)
             v2 = getRandomInt(...getRange(d2));
             
             // We need a dividend v1 that is d1 digits AND divisible by v2.
             // Min v1: 10^(d1-1), Max v1: 10^d1 - 1.
             // Find multiples of v2 in this range.
             
             const minD1 = Math.pow(10, d1 - 1);
             const maxD1 = Math.pow(10, d1) - 1;
             
             // First multiple > minD1
             let start = Math.ceil(minD1 / v2) * v2;
             if (start > maxD1) {
                 // Impossible constraint (e.g. 1 digit / 4 digits -> 0.xx)
                 // Or e.g. 2 digits / 2 digits (10 / 99). Maybe 10/10=1. 10/99=0.
                 // Fallback: simple division
                 if (d1 < d2) {
                      // Just random integers, likely not integer result?
                      // User requested integer results usually.
                      // Adjust v1 to be v2 * something?
                      // But that violates "d1 digits".
                      // We must respect "d1 digits" primarily?
                      // If impossible, retrying with new v2?
                 }
             }

             // Let's generate Answer (Quotient) and Divisor (v2), then calc Dividend (v1).
             // But user specified Dividend Digits (d1).
             // So we must hunt for valid v1.
             
             // Optimized approach:
             // 1. Pick v2 (d2 digits).
             // 2. Pick v1 (d1 digits) such that v1 % v2 == 0.
             // Range [minD1, maxD1]. 
             // Pick random multiple.
             
             const minMult = Math.ceil(minD1 / v2);
             const maxMult = Math.floor(maxD1 / v2);
             
             if (minMult > maxMult) {
                 // No solution for this v2 (e.g. v2=50, d1=1 -> no multiple of 50 is 1 digit)
                 // Fallback: Pick v1 randomly, subtract remainder.
                 // If that changes digit count, too bad.
                 v1 = getRandomInt(minD1, maxD1);
                 v1 = v1 - (v1 % v2);
                 if (v1 < minD1) v1 += v2; // Adjust back up
                 if (v1 > maxD1) {
                     // Still fail
                     ans = 0; v1 = 0; // Error case
                 } else {
                     ans = v1 / v2;
                 }
             } else {
                 const scalar = getRandomInt(minMult, maxMult);
                 v1 = scalar * v2;
                 ans = scalar;
             }
             
             break;
        case 'add':
        default:
            operator = '+';
            ans = v1 + v2;
            break;
    }

    return {
        id: `arith_${opType}_${Date.now()}_${Math.random()}`,
        subtopic: `Arithmetic (${opType})`,
        question: `${v1} ${operator} ${v2}`,
        answer: { values: [ans], display: `${ans}` },
        type: "math-input"
    };
};

export const generators = {
    'arith_add': { label: '加算 (+)', func: (d, diff) => generateArithmetic(d, diff, 'add') },
    'arith_sub': { label: '減算 (-)', func: (d, diff) => generateArithmetic(d, diff, 'sub') },
    'arith_mul': { label: '乗算 (×)', func: (d, diff) => generateArithmetic(d, diff, 'mul') },
    'arith_div': { label: '除算 (÷)', func: (d, diff) => generateArithmetic(d, diff, 'div') },
};
