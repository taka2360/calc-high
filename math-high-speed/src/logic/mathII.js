import { getRandomInt, gcd, simplifyFraction, toLatexFraction } from './utils.js';

export const generators = {
    'remainder_thm': {
        label: '剰余の定理',
        func: () => {
            const k = getRandomInt(-3, 3);
            if (k === 0) return generators['remainder_thm'].func(); 
            const b = getRandomInt(-5, 5);
            const c = getRandomInt(-5, 5);
            const remainder = k*k + b*k + c;
            const polyLatex = `(x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c})`;
            const divisorLatex = `(x ${k >= 0 ? '-' : '+'}${Math.abs(k)})`;
            const questionLatex = `${polyLatex} \\div ${divisorLatex} \\text{ の余り}`;
            return {
                id: `math2_rem`,
                subtopic: "Remainder Thm",
                question: questionLatex,
                answer: { values: [remainder], display: `${remainder}` },
                type: "math-input"
            };
        }
    },
    'log_eq': {
        label: '対数方程式',
        func: () => {
             const type = getRandomInt(0, 1);
            if (type === 0) {
                const a = getRandomInt(2, 5);
                const b = getRandomInt(1, 3);
                const x = Math.pow(a, b);
                return {
                    id: `math2_log`,
                    subtopic: "Log Equation",
                    question: `\\log_{${a}} x = ${b} \\text{ の } x`,
                    answer: { values: [x], display: `${x}` },
                    type: "math-input"
                };
            } else {
                 return {
                    id: `math2_log`,
                    subtopic: "Log Equation",
                    question: `\\log_2 x + \\log_2 (x-2) = 3 \\text{ の } x`,
                    answer: { values: [4], display: "4" },
                    type: "math-input"
                };
            }
        }
    },
    'def_integral': {
        label: '定積分',
        func: () => {
            const m = getRandomInt(1, 3) * 2; 
            const n = getRandomInt(-5, 5);
            const a = getRandomInt(0, 2);
            const b = a + getRandomInt(1, 2); 
            const F = (val) => (m/2)*val*val + n*val;
            const ans = F(b) - F(a);
            const termX = `${m}x`;
            const termN = n === 0 ? "" : (n > 0 ? `+ ${n}` : `- ${Math.abs(n)}`);
            return {
                id: `math2_int`,
                subtopic: "Definite Integral",
                question: `\\int_{${a}}^{${b}} (${termX} ${termN}) dx`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    }
};
