import { getRandomInt, gcd, simplifyFraction, toLatexFraction, getScaledRandomInt } from './utils.js';

export const generators = {
    // --- Quad Eq (Existing) ---
    'quad_eq': {
        label: '2次方程式 (たすき掛け)',
        func: (digits, difficulty) => {
            let a = 1, c = 1;
            if (difficulty !== 'Easy') {
                a = getRandomInt(1, difficulty === 'Hard' ? 5 : 3);
                c = getRandomInt(1, difficulty === 'Hard' ? 5 : 3);
            }
            const b = getScaledRandomInt(-5, 5, difficulty);
            const d = getScaledRandomInt(-5, 5, difficulty);
            
            const A = a * c;
            const B = a * d + b * c;
            const C = b * d;
            
            const [n1, d1] = simplifyFraction(-b, a);
            const [n2, d2] = simplifyFraction(-d, c);
            const ans1 = toLatexFraction(n1, d1);
            const ans2 = toLatexFraction(n2, d2);
            
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
    // --- Quad Function (New) ---
    'quad_vertex': {
        label: '2次関数 (頂点)',
        func: (d, diff) => {
            // y = a(x-p)^2 + q
            // Easy: y = (x-p)^2 + q (a=1)
            // Normal: y = a(x-p)^2 + q, expand it.
            // Hard: fractions?
            
            const a = diff === 'Easy' ? 1 : getScaledRandomInt(-3, 3, diff) || 1;
            const p = getScaledRandomInt(-5, 5, diff);
            const q = getScaledRandomInt(-10, 10, diff);
            
            // Expand: y = ax^2 - 2apx + (ap^2+q)
            const A = a;
            const B = -2 * a * p;
            const C = a * p * p + q;
            
            // Format polynomial
            const term2 = B === 0 ? '' : (B > 0 ? `+ ${B}x` : `${B}x`);
            const term3 = C === 0 ? '' : (C > 0 ? `+ ${C}` : `${C}`);
            
            const poly = `${A === 1 ? '' : (A===-1?'-':A)}x^2 ${term2} ${term3}`;
            
            return {
                id: `mathIA_qv`,
                subtopic: "Quad Vertex",
                question: `y = ${poly} \\text{ の頂点座標}`,
                answer: { values: [], display: `(${p}, ${q})` },
                type: "math-input"
            };
        }
    },
    'quad_minmax': {
        label: '2次関数 (最大・最小)',
        func: (d, diff) => {
             // y = a(x-p)^2 + q on domain [s, t]
             // Check boundary pts and vertex.
             
             const a = diff === 'Easy' ? 1 : (getRandomInt(0,1)?1:-1) * getRandomInt(1, 3);
             const p = getRandomInt(-3, 3);
             const q = getRandomInt(-5, 5);
             
             // Domain [s, t]
             const s = p + getRandomInt(-3, -1);
             const t = p + getRandomInt(1, 4);
             // Ensure p is inside or outside?
             // Randomize logic: shift domain relative to p
             // Easy: p inside.
             // Hard: p outside (monotonic).
             
             const domainType = getRandomInt(0, 2); // 0: p inside, 1: left, 2: right
             let dMin, dMax;
             if (domainType === 0) { dMin = p - 2; dMax = p + 2; }
             else if (domainType === 1) { dMin = p - 4; dMax = p - 1; }
             else { dMin = p + 1; dMax = p + 4; }
             
             // Calculate values
             const calc = (x) => a * (x - p)*(x - p) + q;
             const vP = calc(p);
             const vMin = calc(dMin);
             const vMax = calc(dMax);
             
             let maxVal, minVal;
             // If p inside [dMin, dMax]
             if (p >= dMin && p <= dMax) {
                 if (a > 0) { minVal = vP; maxVal = Math.max(vMin, vMax); }
                 else { maxVal = vP; minVal = Math.min(vMin, vMax); }
             } else {
                 // Monotonic
                 maxVal = Math.max(vMin, vMax);
                 minVal = Math.min(vMin, vMax);
             }
             
             const target = getRandomInt(0, 1) === 0 ? '最大値' : '最小値';
             const ans = target === '最大値' ? maxVal : minVal;
             
             // Expand eq
             const A = a;
             const B = -2 * a * p;
             const C = a * p * p + q;
             const term2 = B === 0 ? '' : (B > 0 ? `+ ${B}x` : `${B}x`);
             const term3 = C === 0 ? '' : (C > 0 ? `+ ${C}` : `${C}`);
             const poly = `${A === 1 ? '' : (A===-1?'-':A)}x^2 ${term2} ${term3}`;

             return {
                id: `mathIA_qmm`,
                subtopic: "Quad MinMax",
                question: `y = ${poly} (${dMin} \\leqq x \\leqq ${dMax}) \\text{ の${target}}`,
                answer: { values: [ans], display: `${ans}` },
                type: "math-input"
             };
        }
    },
    // --- Trig Ratios (New) ---
    'trig_rule_sin': {
        label: '正弦定理',
        func: (d, diff) => {
            // a / sin A = 2R
            // Ask for R or a side/angle.
            // Easy: Ask R given a, A (special angles).
            // Hard: Ask a given R, A.
            
            const angles = [30, 45, 60, 90, 120, 135];
            const A = angles[getRandomInt(0, angles.length - 1)];
            
            // sin A values: 1/2, 1/sqrt2, sqrt3/2, 1
            let sinNum, sinDen, sinValStr;
            if (A === 30 || A === 150) { sinNum=1; sinDen=2; sinValStr='0.5'; }
            else if (A === 45 || A === 135) { sinNum='\\sqrt{2}'; sinDen=2; sinValStr='0.707'; } 
            else if (A === 60 || A === 120) { sinNum='\\sqrt{3}'; sinDen=2; sinValStr='0.866'; }
            else { sinNum=1; sinDen=1; sinValStr='1'; }
            
            // a = 2R sin A.
            // Pick integer R.
            const R = getRandomInt(2, 10);
            
            // a?
            // If sinA = 1/2, a = R.
            // If sinA = sqrt3/2, a = R sqrt3.
            
            let aDisp;
            if (A===30||A===150) aDisp = `${R}`;
            else if (A===45||A===135) aDisp = `${R}\\sqrt{2}`; // 2R * 1/sqrt2 = R sqrt2
            else if (A===60||A===120) aDisp = `${R}\\sqrt{3}`;
            else aDisp = `${2*R}`;
            
            // Display R as R
            
            return {
                id: `mathIA_sin_rule`,
                subtopic: "Sine Rule",
                question: `\\triangle ABC \\text{ において } A=${A}^\\circ, a=${aDisp} \\text{ のときの外接円の半径 } R`,
                answer: { values: [R], display: `${R}` },
                type: "math-input"
            };
        }
    },
    'trig_rule_cos': {
        label: '余弦定理',
        func: (d, diff) => {
            // a^2 = b^2 + c^2 - 2bc cos A
            // Easy: A=60, b,c integers. Find a.
            // Hard: Find cos A given a,b,c.
            
            const target = diff === 'Easy' ? 'side' : (getRandomInt(0,1)?'side':'angle');
            
            if (target === 'side') {
                const b = getRandomInt(2, 6);
                const c = getRandomInt(2, 6);
                const angles = [60, 120]; // cos = +/- 1/2 for easy calculation
                const A = angles[getRandomInt(0,1)];
                const cosA = A===60 ? 0.5 : -0.5;
                
                // a^2 = b^2 + c^2 - 2bc(0.5) = b^2 + c^2 - bc (if 60)
                // a^2 = b^2 + c^2 + bc (if 120)
                const val = b*b + c*c - 2*b*c*cosA;
                // val needs to be square number? No, sqrt(val) is answer.
                // Try to generate Nice Triangles?
                // 3, 5, 7 (120deg) -> 9+25 - 2*15*(-0.5) = 34+15=49. a=7.
                // 3, 8, 7 (60deg) -> 9+64 - 2*24*(0.5) = 73-24=49. a=7.
                // 5, 8, 7 (60deg) -> 25+64 - 40 = 49. a=7.
                
                // Pre-baked nice tuples (b, c, A, a)
                const nice = [
                    [3, 5, 120, 7],
                    [3, 8, 60, 7],
                    [5, 8, 60, 7],
                    [1, 1, 90, '\\sqrt{2}'],
                    [3, 4, 90, 5],
                    [1, 2, 60, '\\sqrt{3}'], // 1+4-2=3
                    [1, 1, 120, '\\sqrt{3}'] // 1+1+1=3
                ];
                
                const t = nice[getRandomInt(0, nice.length-1)];
                
                return {
                    id: `mathIA_cos_rule`,
                    subtopic: "Cos Rule",
                    question: `b=${t[0]}, c=${t[1]}, A=${t[2]}^\\circ \\text{ のとき } a`,
                    answer: { values: [], display: `${t[3]}` },
                    type: "math-input"
                };
            } else {
                 // Angle
                 // 3, 5, 7 -> 120
                 const nice = [
                    [3, 5, 7, 120],
                    [7, 3, 5, 120], // Permutations? cos A means angle A is opp side a.
                    [7, 5, 3, 120],
                    [7, 3, 8, 60],
                    [7, 8, 5, 60],
                    [5, 3, 4, 90],
                    [13, 5, 12, 90]
                ];
                // Careful: [b, c, a, A] order in nice list above?
                // Logic: 3,5,7. Max side 7. 7^2 = 49. 3^2+5^2=34. 34 - 2*15*cosA = 49 => -30cosA = 15 => cosA = -1/2.
                // So opp side must be 7. -> A=120.
                
                // Revised tuples [side_b, side_c, side_a, angle_A]
                const cases = [
                    {b:3, c:5, a:7, A:120},
                    {b:3, c:8, a:7, A:60},
                    {b:5, c:8, a:7, A:60},
                    {b:3, c:4, a:5, A:90},
                    {b:1, c:1, a:'\\sqrt{2}', A:90},
                    {b:1, c:1, a:'\\sqrt{3}', A:120}
                ];
                const c = cases[getRandomInt(0, cases.length-1)];
                
                 return {
                    id: `mathIA_cos_angle`,
                    subtopic: "Cos Rule Ang",
                    question: `a=${c.a}, b=${c.b}, c=${c.c} \\text{ のとき } A (^{\\circ})`,
                    answer: { values: [c.A], display: `${c.A}` },
                    type: "math-input"
                };
            }
        }
    },
    'trig_area': {
        label: '三角形の面積',
        func: (d, diff) => {
            // S = 1/2 bc sin A
            const b = getRandomInt(2, 6);
            const c = getRandomInt(2, 6);
            const As = [30, 45, 60, 90, 120, 135, 150];
            const A = As[getRandomInt(0, As.length-1)];
            
            // Need S to be integer? Or format nice string.
            // 1/2 * b * c * sinA.
            
            let sinA_str; // Latex for sinA
            if ([30, 150].includes(A)) sinA_str = '1/2';
            else if ([45, 135].includes(A)) sinA_str = '\\frac{1}{\\sqrt{2}}';
            else if ([60, 120].includes(A)) sinA_str = '\\frac{\\sqrt{3}}{2}';
            else sinA_str = '1';
            
            // Format S answer
            // e.g. b=4, c=3, A=30 -> 1/2 * 12 * 1/2 = 3.
            
            let num = b * c;
            let den = 2; // from 1/2
            
            // Multiply by sinA
            let sqrtPart = '';
            if ([30, 150].includes(A)) { den *= 2; }
            else if ([45, 135].includes(A)) { den *= 2; sqrtPart = '\\sqrt{2}'; } // 1/sqrt2 = sqrt2/2
            else if ([60, 120].includes(A)) { den *= 2; sqrtPart = '\\sqrt{3}'; }
            
            // Simplify num/den
            const [sn, sd] = simplifyFraction(num, den);
            const frac = toLatexFraction(sn, sd);
            
            let ans = (frac === '1' && sqrtPart) ? sqrtPart : `${frac}${sqrtPart}`;
            if (frac === '0') ans = '0';
            
            return {
                id: `mathIA_area`,
                subtopic: "Triangle Area",
                question: `b=${b}, c=${c}, A=${A}^\\circ \\text{ のとき } \\triangle ABC \\text{ の面積}`,
                answer: { values: [], display: `${ans}` },
                type: "math-input"
            };
        }
    },
    
    // --- Existing (Expected Val, Trig Identity) ---
    'expected_val': {
        label: '期待値 (簡単な確率)',
        func: (d, diff) => {
            let maxScore;
            if (diff === 'Easy') maxScore = getRandomInt(1, 3) * 30; 
            else if (diff === 'Hard') maxScore = getRandomInt(10, 50) * 30; 
            else maxScore = getRandomInt(2, 6) * 30;
            
            return {
                id: `mathIA_exp`,
                subtopic: "Expected Val",
                question: `\\text{サイコロの目で } 1,2:\\text{10点}, 3,4:\\text{20点}, 5,6:\\text{${maxScore}点} \\text{ の期待値}`,
                answer: { values: [], display: `${(10+20+maxScore)/3}` },
                type: "math-input"
            };
        }
    },
    'trig_ratio': {
        label: '三角比 (相互関係)',
        func: (d, diff) => {
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
