import { getRandomInt, gcd, simplifyFraction, toLatexFraction, getScaledRandomInt } from './utils.js';

export const generators = {
    'seq_arith_n': {
        label: '等差数列 (一般項)',
        func: (digits, difficulty) => {
            // an = a + (n-1)d
            // Easy: Small positive d, small a.
            // Hard: Negative d, larger a.
            
            const a = getScaledRandomInt(1, 10, difficulty);
            let d = getScaledRandomInt(1, 5, difficulty);
            
            if (difficulty === 'Hard') {
                d = getScaledRandomInt(-10, 10, difficulty);
                if (d === 0) d = 2;
            }
            
            // Ask for Nth term.
            const n = getRandomInt(5, 15); 
            // Value = a + (n-1)d
            const ans = a + (n - 1) * d;

            return {
                id: `mathB_seq_an`,
                subtopic: "Arith Seq Term",
                question: `\\text{初項 } ${a}, \\text{ 公差 } ${d} \\text{ の等差数列の第 } ${n} \\text{ 項}`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    },
    'seq_arith_sum': {
        label: '等差数列の和',
        func: (digits, difficulty) => {
            // Sn = n/2 (2a + (n-1)d)
            // Easy: even n, positive d.
            
            const a = getScaledRandomInt(1, 10, difficulty);
            const d = getScaledRandomInt(1, 5, difficulty);
            const n = getRandomInt(4, difficulty === 'Hard' ? 12 : 8);

            const ans = (n * (2 * a + (n - 1) * d)) / 2;
            
            return {
                id: `mathB_seq_sum`,
                subtopic: "Arith Seq Sum",
                question: `\\text{初項 } ${a}, \\text{ 公差 } ${d} \\text{ の等差数列の初項から第 } ${n} \\text{ 項までの和}`,
                answer: { values: [ans], display: `${ans}` }, // Should vary integer
                type: "math-input"
            };
        }
    },
    'seq_geo_n': {
        label: '等比数列 (一般項)',
        func: (digits, difficulty) => {
             // an = a * r^(n-1)
             // Easy: r=2,3.
             // Hard: r=-2, -3.
             
             const a = getRandomInt(1, 5);
             let r = getRandomInt(2, 3);
             if (difficulty === 'Hard') r = getRandomInt(-3, 3) || 2;
             
             const n = getRandomInt(3, 6); // Don't explode numbers
             
             const ans = a * Math.pow(r, n - 1);
             
             return {
                id: `mathB_geo_n`,
                subtopic: "Geo Seq Term",
                question: `\\text{初項 } ${a}, \\text{ 公比 } ${r} \\text{ の等比数列の第 } ${n} \\text{ 項}`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    },
    'seq_geo_sum': {
        label: '等比数列の和',
        func: (digits, difficulty) => {
             // Sn = a(r^n - 1) / (r - 1)
             const a = getRandomInt(1, 3);
             const r = getRandomInt(2, 3); // keep small ratio
             const n = getRandomInt(3, 5);
             
             const ans = a * (Math.pow(r, n) - 1) / (r - 1);
             
             return {
                id: `mathB_geo_sum`,
                subtopic: "Geo Seq Sum",
                question: `\\text{初項 } ${a}, \\text{ 公比 } ${r} \\text{ の等比数列の初項から第 } ${n} \\text{ 項までの和}`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    },
    'sigma_k': {
        label: 'Σ計算',
        func: (digits, difficulty) => {
            // Easy: k, c
            // Hard: k^2
            
            const isQuad = difficulty === 'Hard';
            const n = getRandomInt(3, difficulty === 'Easy' ? 6 : 10);
            
            let formula, ans;
            
            if (isQuad) {
                // k^2
                formula = `k^2`;
                // n(n+1)(2n+1)/6
                ans = (n * (n + 1) * (2 * n + 1)) / 6;
            } else {
                // k or ak+b
                const a = getRandomInt(1, 3);
                formula = (a === 1) ? `k` : `${a}k`;
                ans = a * (n * (n + 1)) / 2;
            }
            
            return {
                id: `mathB_sigma`,
                subtopic: "Sigma",
                question: `\\sum_{k=1}^{${n}} ${formula}`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    },
    'stat_trans': {
        label: '統計変換 (y=ax+b)',
        func: (digits, difficulty) => {
             // mean(y) = a*mean(x) + b
             // std(y) = |a|*std(x)
             // var(y) = a^2 * var(x)
             
             const isVar = getRandomInt(0, 1) === 0; // Target Mean or Std/Var?
             
             const a = getScaledRandomInt(-5, 5, difficulty) || 2;
             const b = getScaledRandomInt(-10, 10, difficulty);
             
             const mx = getRandomInt(10, 50);
             const sx = getRandomInt(2, 10);
             const vx = sx * sx;
             
             if (isVar) {
                 // Ask for Var or Std
                 const askStd = getRandomInt(0, 1) === 0;
                 const target = askStd ? `\\sigma_y` : `V_y`; // Latex for sigma, variance
                 const val = askStd ? (Math.abs(a) * sx) : (a * a * vx);
                 
                 return {
                    id: `mathB_stat_var`,
                    subtopic: "Stat Var",
                    question: `y = ${a}x ${b>=0?'+':''}${b}, \\sigma_x = ${sx} \\text{ のとき } ${target}`,
                    answer: { values: [val], display: `${val}` },
                    type: "math-input"
                };
             } else {
                 // Mean
                 const my = a * mx + b;
                  return {
                    id: `mathB_stat_mean`,
                    subtopic: "Stat Mean",
                    question: `y = ${a}x ${b>=0?'+':''}${b}, \\bar{x} = ${mx} \\text{ のとき } \\bar{y}`,
                    answer: { values: [my], display: `${my}` },
                    type: "math-input"
                };
             }
        }
    }
};
