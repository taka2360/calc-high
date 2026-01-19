import { getRandomInt, gcd, simplifyFraction, toLatexFraction, getScaledRandomInt } from './utils.js';

export const generators = {
    // --- Exp/Log (Extended) ---
    'log_eq': {
        label: '対数方程式',
        func: (digits, difficulty) => {
            // Easy: log_a x = b
            // Normal/Hard: Substitution (log_2 x)^2 - ... = 0
            
            const base = 2; // Keep base simple
            
            if (difficulty === 'Easy') {
                 const b = getRandomInt(1, 4);
                 const ans = Math.pow(base, b);
                 return {
                    id: `mathII_log_simple`,
                    subtopic: "Log Eq",
                    question: `\\log_{${base}} x = ${b}`,
                    answer: { values: [ans], display: `${ans}` },
                    type: "math-input"
                };
            } else {
                // Substitution: t^2 - (a+b)t + ab = 0, where t = log_2 x
                // Roots typically 1, 2, 3...
                const t1 = getRandomInt(1, 3);
                const t2 = getRandomInt(t1 + 1, 4); 
                
                // eq: t^2 - (t1+t2)t + t1t2 = 0
                const B = -(t1 + t2);
                const C = t1 * t2;
                
                // Actual eq: (log x)^2 + B log x + C = 0
                const qB = B === 0 ? '' : (B > 0 ? `+ ${B}\\log_{${base}} x` : `${B}\\log_{${base}} x`);
                const qC = C === 0 ? '' : (C > 0 ? `+ ${C}` : `${C}`);
                
                const ans1 = Math.pow(base, t1);
                const ans2 = Math.pow(base, t2);
                
                return {
                    id: `mathII_log_sub`,
                    subtopic: "Log Eq Sub",
                    question: `(\\log_{${base}} x)^2 ${qB} ${qC} = 0`,
                    answer: { values: [ans1, ans2], display: `x = ${ans1}, ${ans2}` },
                    type: "math-input"
                };
            }
        }
    },
    'exp_eq': { // NEW
        label: '指数方程式',
        func: (digits, diff) => {
            // Easy: 2^x = 8
            // Normal: 4^x - 3*2^x - 4 = 0
            
            const base = 2; // 2, 3
            
            if (diff === 'Easy') {
                 const b = getRandomInt(2, 6);
                 const val = Math.pow(base, b);
                 return {
                    id: `mathII_exp_simple`,
                    subtopic: "Exp Eq",
                    question: `${base}^x = ${val}`,
                    answer: { values: [b], display: `x = ${b}` },
                    type: "math-input"
                };
            } else {
                 // Substitution: X = 2^x. X^2 ...
                 // Roots for X needs to be positive powers of base.
                 // e.g. X=2 (x=1), X=4 (x=2).
                 const x1 = getRandomInt(1, 2); 
                 const x2 = getRandomInt(2, 3); // Powers
                 const X1 = Math.pow(base, x1);
                 const X2 = Math.pow(base, x2);
                 
                 // if diff=Hard, maybe one root is negative (rejected) -> X^2 - (X1-A)X - X1*A = 0
                 // If Normal, 2 valid roots?
                 // Let's do 2 valid for Normal.
                 
                 const B = -(X1 + X2);
                 const C = X1 * X2;
                 const baseSq = base * base; // 4
                 
                 const qB = B === 0 ? '' : (B > 0 ? `+ ${B}\\cdot ${base}^x` : `${B}\\cdot ${base}^x`);
                 const qC = C === 0 ? '' : (C > 0 ? `+ ${C}` : `${C}`);

                 return {
                    id: `mathII_exp_sub`,
                    subtopic: "Exp Eq Sub",
                    question: `${baseSq}^x ${qB} ${qC} = 0`,
                    answer: { values: [x1, x2], display: `x = ${x1}, ${x2}` },
                    type: "math-input"
                };
            }
        }
    },
    
    // --- Trig Functions (Math II) ---
    'trig_rad_deg': {
        label: '度数・弧度法変換',
        func: (d, diff) => {
             // Easy: Deg -> Rad. Normal -> Rad -> Deg.
             const isDegToRad = getRandomInt(0, 1) === 0;
             const angles = [30, 45, 60, 90, 120, 135, 150, 180, 270, 360];
             const deg = angles[getRandomInt(0, angles.length-1)];
             
             // Calc Rad
             const [n, den] = simplifyFraction(deg, 180);
             let rad = n === 1 ? '\\pi' : `${n}\\pi`;
             if (den !== 1) rad = `\\frac{${rad}}{${den}}`;
             if (deg === 0) rad = '0';
             
             if (isDegToRad) {
                 return {
                    id: `mathII_rad`,
                    question: `${deg}^\\circ \\text{ を弧度法で}`,
                    answer: { values: [], display: rad },
                    type: "math-input"
                 };
             } else {
                 return {
                    id: `mathII_deg`,
                    question: `${rad} \\text{ を度数法で} (^{\\circ}不要)`,
                    answer: { values: [deg], display: `${deg}` },
                    type: "math-input"
                 };
             }
        }
    },
    'trig2_eq': {
        label: '三角不等式・方程式',
        question: 'TODO', // Merged simplified logic
        func: (d, diff) => {
             // sin x = c
             const fn = getRandomInt(0,1) === 0 ? 'sin' : 'cos';
             const vals = [
                 {v: '1/2', ans: fn==='sin' ? ['\\pi/6', '5\\pi/6'] : ['\\pi/3', '5\\pi/3']},
                 {v: '\\frac{\\sqrt{3}}{2}', ans: fn==='sin' ? ['\\pi/3', '2\\pi/3'] : ['\\pi/6', '11\\pi/6']},
                 {v: '-\\frac{1}{2}', ans: fn==='sin' ? ['7\\pi/6', '11\\pi/6'] : ['2\\pi/3', '4\\pi/3']}
             ];
             const t = vals[getRandomInt(0, vals.length-1)];
             
             let ansDisp = t.ans.join(', ');
             
             return {
                id: `mathII_trig_eq`,
                question: `0 \\leqq x < 2\\pi \\text{ のとき } \\${fn} x = ${t.v}`,
                answer: { values: [], display: `x = ${ansDisp}` },
                type: "math-input"
             };
        }
    },
    
    // --- Figures & Equations ---
    'fig_dist': {
        label: '2点間の距離',
        func: (d, diff) => {
             // A(x1, y1), B(x2, y2).
             // Make distance integer -> pythagorean triple.
             const triples = [[3,4,5], [5,12,13], [8,15,17], [6,8,10]];
             const t = triples[getRandomInt(0, triples.length-1)];
             const dx = t[0];
             const dy = t[1];
             const D = t[2];
             
             const x1 = getRandomInt(-5, 5);
             const y1 = getRandomInt(-5, 5);
             const x2 = x1 + dx;
             const y2 = y1 + dy;
             
             return {
                id: `mathII_dist`,
                question: `A(${x1}, ${y1}), B(${x2}, ${y2}) \\text{ 間の距離}`,
                answer: { values: [D], display: `${D}` },
                type: "math-input"
             };
        }
    },
    'fig_divide': {
        label: '内分点・外分点',
        func: (d, diff) => {
             // A, B, m:n.
             // Internal: (nx1+mx2)/(m+n)
             const m = getRandomInt(1, 3);
             const n = getRandomInt(1, 3);
             
             const den = m + n;
             // Choose x1, x2 such that result is integer.
             // nx1 + mx2 = den * K
             const x1 = getRandomInt(-5, 5) * den; 
             const x2 = getRandomInt(-5, 5) * den; // Lazy way: multiple of den
             const y1 = getRandomInt(-5, 5) * den;
             const y2 = getRandomInt(-5, 5) * den;
             
             // Actually formula: (n x1 + m x2) / (m+n).
             // Since x1, x2 are multiples of (m+n), result is integer.
             
             const Px = (n*x1 + m*x2) / den;
             const Py = (n*y1 + m*y2) / den;
             
             return {
                id: `mathII_div`,
                question: `A(${x1}, ${y1}), B(${x2}, ${y2}) \\text{ を } ${m}:${n} \\text{ に内分する点}`,
                answer: { values: [], display: `(${Px}, ${Py})` },
                type: "math-input"
             };
        }
    },
    'fig_line': {
        label: '2点を通る直線',
        func: (d, diff) => {
             // y - y1 = m (x - x1)
             const x1 = getRandomInt(-3, 3);
             const y1 = getRandomInt(-3, 3);
             const x2 = x1 + getRandomInt(1, 4); // ensure x1 != x2
             const y2 = y1 + getRandomInt(1, 4) * (getRandomInt(0,1)?1:-1);
             
             const mNum = y2 - y1;
             const mDen = x2 - x1;
             const [smn, smd] = simplifyFraction(mNum, mDen);
             
             // y = mx + c
             // c = y1 - m x1
             // c = (y1*smd - smn*x1)/smd
             const cNum = y1 * smd - smn * x1;
             
             let mStr = toLatexFraction(smn, smd);
             if (mStr === '1') mStr = '';
             if (mStr === '-1') mStr = '-';
             
             let cStr = '';
             if (cNum !== 0) {
                 const [cn, cd] = simplifyFraction(cNum, smd);
                 const cf = toLatexFraction(cn, cd);
                 cStr = (cn > 0 && cf[0] !== '-') ? `+ ${cf}` : cf;
             }
             
             // x term
             let q = `y = `;
             if (smn === 0) q = `y = ${toLatexFraction(cNum, smd)}`;
             else q += `${mStr}x ${cStr}`;
             
             return {
                id: `mathII_line`,
                question: `2点 (${x1}, ${y1}), (${x2}, ${y2}) \\text{ を通る直線}`,
                answer: { values: [], display: q },
                type: "math-input"
             };
        }
    },
    'fig_dist_line': {
        label: '点と直線の距離',
        func: (d, diff) => {
             // |ax0 + by0 + c| / sqrt(a^2 + b^2)
             // Need sqrt(a^2+b^2) to be integer -> 3,4,5 etc.
             const triples = [[3,4,5], [6,8,10], [5,12,13]];
             const t = triples[getRandomInt(0, triples.length-1)];
             const a = t[0];
             const b = t[1] * (getRandomInt(0,1)?1:-1);
             const den = t[2];
             
             const x0 = getRandomInt(-5, 5);
             const y0 = getRandomInt(-5, 5);
             
             // Need numerator to be multiple of den
             // ax0 + by0 + c = den * K
             // c = den*K - ax0 - by0
             const K = getRandomInt(1, 5);
             const c = (den * K) - (a * x0) - (b * y0);
             
             const dist = K;
             
             // Line: ax + by + c = 0
             const lineEq = `${a}x ${b>=0?'+':''}${b}y ${c>=0?'+':''}${c} = 0`;
             
             return {
                id: `mathII_pt_line`,
                question: `点 (${x0}, ${y0}) \\text{ と直線 } ${lineEq} \\text{ の距離}`,
                answer: { values: [dist], display: `${dist}` },
                type: "math-input"
             };
        }
    },
    'fig_circle_3pts': {
        label: '3点を通る円',
        func: (d, diff) => {
             // (x-a)^2 + (y-b)^2 = r^2
             // Generate center (a, b) and radius r^2
             const a = getRandomInt(-3, 3);
             const b = getRandomInt(-3, 3);
             const rSq = getRandomInt(1, 10) * 5; // e.g. 5, 25...
             
             // Find 3 integer points on circle? Hard.
             // Actually, asking for Equation given 3 points is TEDIOUS for mental math.
             // User input: x^2 + y^2 + lx + my + n = 0 ?
             // Or (x-a)^2 + ...
             // Maybe provide center and one point? "円の方程式" usually means "Find Eq".
             // Easy: Center (a,b), Point P.
             // Hard: 3 Points.
             
             // Let's stick to Center + Point (Easy/Normal) for Speed Math.
             // 3 Points is too solving-heavy.
             // Wait, user asked "3点の座標からの円の方程式".
             // OK. We must afford it.
             // To make it solvable mentally: 
             // Points should be nice. e.g. (0,0), (something, 0), (0, something).
             // General form: x^2 + y^2 + lx + my + n = 0.
             // If passes (0,0) -> n=0.
             // Passes (p, 0) -> p^2 + lp = 0 -> l = -p.
             // Passes (0, q) -> q^2 + mq = 0 -> m = -q.
             
             const p = getRandomInt(2, 6) * 2; // even
             const q = getRandomInt(2, 6) * 2;
             
             const eq = `x^2 + y^2 - ${p}x - ${q}y = 0`;
             const ansFormat = `(x-${p/2})^2 + (y-${q/2})^2 = ${(p/2)**2 + (q/2)**2}`;
             
             return {
                id: `mathII_circle_3pts`,
                question: `3点 (0,0), (${p},0), (0,${q}) \\text{ を通る円の方程式}`,
                answer: { values: [], display: ansFormat },
                type: "math-input"
             };
        }
    },
    'fig_circle_tan': {
        label: '円の接線',
        func: (d, diff) => {
             // x1 x + y1 y = r^2
             // Point (x1, y1) must be ON circle x^2+y^2=r^2.
             // Pyth triples again.
             const triples = [[3,4,5], [5,12,13], [8,15,17]];
             const t = triples[getRandomInt(0, triples.length-1)];
             const x1 = t[0];
             const y1 = t[1];
             const r = t[2];
             
             return {
                id: `mathII_tan`,
                question: `円 x^2+y^2=${r*r} \\text{ 上の点 } (${x1}, ${y1}) \\text{ における接線}`,
                answer: { values: [], display: `${x1}x + ${y1}y = ${r*r}` },
                type: "math-input"
             };
        }
    },
    
    // --- Existing (Remainder, Def Int) ---
    'remainder_thm': {
        label: '剰余の定理',
        func: (digits, difficulty) => {
            const deg = difficulty === 'Easy' ? 2 : 3;
            const a = getScaledRandomInt(1, 3, difficulty) * (getRandomInt(0,1) ? 1 : -1); 
            let coeffs = [];
            for(let i=0; i<=deg; i++)coeffs.push(getScaledRandomInt(-3, 4, difficulty));
            let poly = '';
            let remainder = 0;
            for(let i=0; i<=deg; i++) {
                const p = deg - i;
                const c = coeffs[i];
                if (c === 0) continue;
                const sign = (c > 0 && poly !== '') ? '+' : '';
                const valStr = (Math.abs(c) === 1 && p > 0) ? (c<0?'-':'') : c;
                if (p === 0) poly += `${sign}${c}`;
                else if (p === 1) poly += `${sign}${valStr}x`;
                else poly += `${sign}${valStr}x^${p}`;
                remainder += c * Math.pow(a, p);
            }
            const divSign = a > 0 ? '-' : '+';
            return {
                id: `mathII_rem`,
                subtopic: "Remainder Thm",
                question: `P(x) = ${poly} \\text{ を } (x ${divSign} ${Math.abs(a)}) \\text{ で割った余り}`,
                answer: { values: [remainder], display: `${remainder}` },
                type: "math-input"
            };
        }
    },
    'def_int': {
        label: '定積分',
        func: (digits, difficulty) => {
            const isQuad = difficulty !== 'Easy';
            let low = getRandomInt(0, 2);
            let high = getRandomInt(low + 1, low + (difficulty === 'Hard' ? 4 : 2));
            let qStr = '';
            let F_high = 0, F_low = 0;
            if (isQuad) {
                const A = getScaledRandomInt(-2, 2, difficulty) || 1;
                const B = getScaledRandomInt(-3, 3, difficulty); 
                const C = getScaledRandomInt(-5, 5, difficulty);
                const c2 = 3 * A; const c1 = 2 * B; const c0 = C;
                const fmt = (k, p) => { if (k === 0) return ''; const s = (k > 0 && qStr !== '') ? '+' : ''; const v = Math.abs(k) === 1 && p > 0 ? (k<0?'-':'') : k; if (p === 2) return `${s}${v}x^2`; if (p === 1) return `${s}${v}x`; return `${s}${v}`; };
                qStr += fmt(c2, 2); qStr += fmt(c1, 1); qStr += fmt(c0, 0); if (qStr === '') qStr = '0';
                const calcF = (x) => A*x*x*x + B*x*x + C*x;
                F_high = calcF(high); F_low = calcF(low);
            } else {
                const A = getScaledRandomInt(-2, 2, difficulty) || 1;
                const B = getScaledRandomInt(-5, 5, difficulty);
                const c1 = 2 * A; const c0 = B;
                const fmt = (k, p) => { if (k === 0) return ''; const s = (k > 0 && qStr !== '') ? '+' : ''; const v = Math.abs(k) === 1 && p > 0 ? (k<0?'-':'') : k; if (p === 1) return `${s}${v}x`; return `${s}${v}`; };
                qStr += fmt(c1, 1); qStr += fmt(c0, 0); if (qStr === '') qStr = '0';
                const calcF = (x) => A*x*x + B*x;
                F_high = calcF(high); F_low = calcF(low);
            }
            const ans = F_high - F_low;
            return {
                id: `mathII_int`,
                subtopic: "Definite Int",
                question: `\\int_{${low}}^{${high}} (${qStr}) dx`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
            };
        }
    }
};
