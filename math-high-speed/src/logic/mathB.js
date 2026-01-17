import { getRandomInt } from './utils.js';

export const generators = {
    'arith_seq': {
        label: '等差数列 (一般項)',
        func: () => {
            const d = getRandomInt(2, 5);
            const a1 = getRandomInt(1, 10);
            const n1 = 3;
            const n2 = 5;
            const v1 = a1 + (n1 - 1) * d;
            const v2 = a1 + (n2 - 1) * d;
            const constPart = a1 - d;
            const ansStr = `${d}n ${constPart >= 0 ? '+' : ''}${constPart}`;
            return {
                id: `mathb_arith_seq`,
                subtopic: "Arith Seq",
                question: `a_${n1} = ${v1}, \\quad a_${n2} = ${v2} \\text{ の等差数列の一般項 } a_n`,
                answer: { values: [ansStr], display: ansStr },
                type: "math-input-poly"
            };
        }
    },
    'arith_sum': {
        label: '等差数列の和',
        func: () => {
            // S_n = n/2 * (2a + (n-1)d)
            const a = getRandomInt(1, 5);
            const d = getRandomInt(2, 4);
            const n = getRandomInt(5, 10);
            const sum = (n * (2 * a + (n - 1) * d)) / 2;
            
            return {
                id: `mathb_arith_sum`,
                subtopic: "Arith Sum",
                question: `\\text{初項 } ${a}, \\text{ 公差 } ${d} \\text{ の等差数列の初項から第 } ${n} \\text{ 項までの和}`,
                answer: { values: [sum], display: `${sum}` },
                type: "math-input"
            };
        }
    },
    'geo_seq': {
        label: '等比数列 (一般項)',
        func: () => {
            // ar^{n-1}
            const a = getRandomInt(1, 4);
            const r = getRandomInt(2, 3);
            const questionLatex = `\\text{初項 } ${a}, \\text{ 公比 } ${r} \\text{ の等比数列の一般項 } a_n`;
            // a * r^(n-1)
            // if a=1, plain r^{n-1}
            const ansStr = a === 1 ? `${r}^{n-1}` : `${a} \\cdot ${r}^{n-1}`;
            
            return {
                id: `mathb_geo_seq`,
                subtopic: "Geo Seq",
                question: questionLatex,
                answer: { values: [ansStr], display: ansStr },
                type: "math-input"
            };
        }
    },
     'geo_sum': {
        label: '等比数列の和',
        func: () => {
            // S_n = a(r^n - 1) / (r - 1)
            const a = getRandomInt(1, 3);
            const r = getRandomInt(2, 3); // keep small usually 2 or 3
            const n = getRandomInt(3, 5); // 2^5 = 32, 3^4 = 81
            
            const num = a * (Math.pow(r, n) - 1);
            const den = r - 1;
            const sum = num / den;
            
            return {
                id: `mathb_geo_sum`,
                subtopic: "Geo Sum",
                question: `\\text{初項 } ${a}, \\text{ 公比 } ${r} \\text{ の等比数列の第 } ${n} \\text{ 項までの和}`,
                answer: { values: [sum], display: `${sum}` },
                type: "math-input"
            };
        }
    },
    'sigma': {
        label: 'Σ計算',
        func: () => {
            const N = getRandomInt(5, 12);
            const ans = N * N;
            return {
                id: `mathb_sigma`,
                subtopic: "Sigma",
                question: `\\sum_{k=1}^{${N}} (2k - 1)`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    },
    'stat': {
        label: '統計変換',
        func: () => {
            const m = getRandomInt(2, 10);
            const a = getRandomInt(2, 5);
            const b = getRandomInt(1, 10);
            const ans = a * m + b;
            return {
                id: `mathb_stat`,
                subtopic: "Statistics",
                question: `E(X) = ${m} \\text{ のとき } E(${a}X + ${b})`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    }
};
