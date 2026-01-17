import { getRandomInt } from './utils.js';

// digits: number (1-5), difficulty: 'Easy'|'Normal'|'Hard'
export const generateArithmetic = (digits = 1, difficulty = 'Normal', opType = 'add') => {
    // Difficulty can slightly tweak "digits" or complexity?
    // User requested "digits" explicitly in config.
    // So difficulty shouldn't override digits.
    // Maybe difficulty affects "simple numbers" vs "complex numbers"?
    // Easy: Avoid carry over? (Too hard to logic).
    // Hard: No change?
    // Let's largely rely on digits for Arithmetic.
    // Maybe Hard allows negatives for Sub?
    
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    let v1 = getRandomInt(min, max);
    let v2 = getRandomInt(min, max);
    
    let ans, operator;

    switch(opType) {
        case 'sub':
            operator = '-';
            if (difficulty !== 'Hard' && v2 > v1) [v1, v2] = [v2, v1]; // No negative unless Hard
            ans = v1 - v2;
            break;
        case 'mul':
            operator = '\\times';
            // Easy: limit one operand to 1 digit?
            if (difficulty === 'Easy' && digits > 1) {
                 v2 = getRandomInt(2, 9);
            }
            ans = v1 * v2;
            break;
        case 'div':
             operator = '\\div';
             // Easy: Divisor is single digit
             // Hard: Divisor can be N digits
             let dDiv = digits;
             if (difficulty === 'Easy') dDiv = 1;
             
             // Regenerate v2 based on divisor constraint
             const divMin = Math.pow(10, dDiv - 1);
             const divMax = Math.pow(10, dDiv) - 1;
             v2 = getRandomInt(divMin, divMax);
             
             // Ensure v1 is multiple
             ans = getRandomInt(min, max); // Answer is N digits?
             // "N digit op N digit" -> Result size?
             // Usually Input sizes.
             // Dividend (v1) / Divisor (v2)
             if (difficulty === 'Easy') ans = getRandomInt(1, 10); // Small quotient
             
             v1 = ans * v2;
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
