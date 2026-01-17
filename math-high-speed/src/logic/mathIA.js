import { getRandomInt, gcd, simplifyFraction, toLatexFraction, getScaledRandomInt } from './utils.js';

export const generators = {
    'quad_eq': {
        label: '2次方程式 (たすき掛け)',
        func: (digits, difficulty) => {
            // (ax + b)(cx + d) = 0
            // Easy: a=1, c=1 (Monsic)
            // Normal: small a, c
            // Hard: larger a, c
            
            let a = 1, c = 1;
            if (difficulty !== 'Easy') {
                a = getRandomInt(1, difficulty === 'Hard' ? 5 : 3);
                c = getRandomInt(1, difficulty === 'Hard' ? 5 : 3);
            }
            
            const b = getScaledRandomInt(-5, 5, difficulty);
            const d = getScaledRandomInt(-5, 5, difficulty);
            
            // Expand: ac x^2 + (ad+bc)x + bd
            const A = a * c;
            const B = a * d + b * c;
            const C = b * d;
            
            // Answers: x = -b/a, -d/c
            // Simplify fractions
            const [n1, d1] = simplifyFraction(-b, a);
            const [n2, d2] = simplifyFraction(-d, c);
            const ans1 = toLatexFraction(n1, d1);
            const ans2 = toLatexFraction(n2, d2);
            
            // Format answer string
            let ansDisplay = `x = ${ans1}`;
            if (ans1 !== ans2) {
                ansDisplay += `, ${ans2}`;
            }

            const term2 = B === 0 ? '' : (B > 0 ? `+ ${B}x` : `${B}x`);
            const term3 = C === 0 ? '' : (C > 0 ? `+ ${C}` : `${C}`);

            return {
                id: `mathIA_quad`,
                subtopic: "Quad Eq",
                question: `${A === 1 ? '' : A}x^2 ${term2} ${term3} = 0`,
                answer: { values: [ans1, ans2], display: ansDisplay },
                type: "math-input-poly"
            };
        }
    },
    'expected_val': {
        label: '期待値 (簡単な確率)',
        func: (d, diff) => {
            // Easy: simple dice items
            // Normal: 2 dice
            const maxScore = diff === 'Easy' ? 10 : (diff === 'Hard' ? 100 : 50);
            const scores = [10, 20, maxScore];
            const probDenom = 6;
            // random probs summing to 1?
            // Simple: One dice roll. 
            // 1,2 -> 10pts, 3,4 -> 20pts, 5,6 -> 50pts
            return {
                id: `mathIA_exp`,
                subtopic: "Expected Val",
                question: `\\text{サイコロの目で } 1,2:\\text{10点}, 3,4:\\text{20点}, 5,6:\\text{${maxScore}点} \\text{ の期待値}`,
                answer: { values: [], display: `${(10+20+maxScore)/3}` }, // 2/6 * sum
                type: "math-input"
            };
        }
    },
    'trig_ratio': {
        label: '三角比 (相互関係)',
        func: (d, diff) => {
             // sin^2 + cos^2 = 1. tan = sin/cos.
             // Easy: 3-4-5 triangle values.
             // Normal: sqrt involved.
             // Hard: complex fractions
             
             // Generate pythagorean triple or simple sqrt
             // 3, 4, 5
             // 1, 1, sqrt(2)
             // 1, 2, sqrt(5)
             // 1, sqrt(3), 2 (30-60-90)
             
             const types = [
                 {s: '3/5', c: '4/5', t: '3/4'},
                 {s: '4/5', c: '3/5', t: '4/3'},
                 {s: '1/2', c: '\\frac{\\sqrt{3}}{2}', t: '\\frac{1}{\\sqrt{3}}'},
                 {s: '\\frac{\\sqrt{3}}{2}', c: '1/2', t: '\\sqrt{3}'},
                 {s: '\\frac{1}{\\sqrt{2}}', c: '\\frac{1}{\\sqrt{2}}', t: '1'}
             ];
             
             const item = types[getRandomInt(0, types.length - 1)];
             const target = getRandomInt(0, 1) === 0 ? 'cos' : 'tan';
             
             return {
                id: `mathIA_trig`,
                subtopic: "Trig Ratio",
                question: `\\sin \\theta = ${item.s} (\\text{鋭角}) \\text{ のとき } \\${target} \\theta = ?`,
                answer: { values: [], display: target === 'cos' ? item.c : item.t },
                type: "math-input"
            };
        }
    }
};
