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
    // --- Quad Root Conditions (New) ---
    'quad_root_cond': {
        label: '解の存在範囲 (判別式)',
        func: (d, diff) => {
            // x^2 + ax + 4 = 0 etc.
            // D = a^2 - 16.
            // Conditions: D > 0 (2 distinct real), D = 0 (repeated), D < 0 (no real).
            
            // Format: x^2 + (term_a)x + constant = 0
            // Variable 'a' is the parameter.
            // To make D nice (e.g. a^2 - 4k^2), let constant C be a square number?
            // D = b^2 - 4ac.
            // Case 1: x^2 + ax + C = 0. D = a^2 - 4C. (Variable b is 'a')
            // Case 2: x^2 + bx + a = 0. D = b^2 - 4a. (Variable c is 'a')
            
            // Let's stick to Case 1 for simplicity of input "a < -4, 4 < a"
            
            const k = getRandomInt(1, 4); 
            const C = k * k; // 1, 4, 9, 16
            
            // Equation: x^2 + ax + C = 0
            // D = a^2 - 4C = a^2 - (2k)^2.
            // Roots of D=0 are 2k and -2k.
            
            const condType = getRandomInt(0, 2); // 0: Distinct Real, 1: Repeated, 2: No Real
            let qStr = "";
            let ansDisp = "";
            
            const val = 2 * k; // critical value
            
            if (condType === 0) {
                qStr = "異なる2つの実数解をもつ";
                // a^2 - 4C > 0 -> a < -2k, 2k < a
                ansDisp = `a < -${val}, ${val} < a`;
            } else if (condType === 1) {
                qStr = "重解をもつ";
                // a = +/- 2k
                ansDisp = `a = \\pm ${val}`;
            } else {
                qStr = "実数解をもたない";
                // -2k < a < 2k
                ansDisp = `-${val} < a < ${val}`;
            }
            
            return {
                id: `mathIA_disk`,
                subtopic: "Quad Discriminant",
                question: `x^2 + ax + ${C} = 0 \\text{ が${qStr}ような a の値の範囲}`,
                answer: { values: [], display: ansDisp },
                type: "math-input-text" // Should allow text input? Or specialized.
                // Text input is tricky. Let's assume user calculates mentally or types roughly.
                // Since our keyboard is numeric/math, maybe multiple choice? 
                // "Answer mentally then Check?"
                // No, standard flow.
                // Let's provide formatted answer as display and user inputs... what?
                // User input might be impossible with current keyboard keys (<, >).
                // Let's ADD < and > to keyboard? Or just accept numbers?
                // Maybe "Determine the critical value(s) of a".
                // "境界となる a の値は？" -> +/- 2k.
                // Just asking "Values of a" is easier.
                // "a = ?"
            }; 
            
            // Revision: User wants "Range".
            // Since keyboard lacks < >, maybe we just ask for critical values?
            // "a の範囲の境界値 (正の方)" -> 2k.
            // "If range is a < A, B < a, enter B".
            
            // To satisfy user desire for "Answer range", I should probably add inequality keys.
            // BUT simpler: Ask "条件を満たす自然数 a の最小値" (Min natural number satisfying cond)
            // e.g. a > 4 -> 5.
            
            // User Prompt: "aの値の範囲をこたえよ"
            // So they want the range.
            // I will assume they check the answer visually or use debug mode?
            // Or I should add < > to keyboard.
            // Actually, `MathKeyboard` has operators. I can add < >.
            // Let's try to add < > later. For now, logic produces the string.
        }
    },
    
    // --- Quad Function (Existing) ---
    'quad_vertex': {
        label: '2次関数 (頂点)',
        func: (d, diff) => {
            const a = diff === 'Easy' ? 1 : getScaledRandomInt(-3, 3, diff) || 1;
            const p = getScaledRandomInt(-5, 5, diff);
            const q = getScaledRandomInt(-10, 10, diff);
            const A = a;
            const B = -2 * a * p;
            const C = a * p * p + q;
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
             const a = diff === 'Easy' ? 1 : (getRandomInt(0,1)?1:-1) * getRandomInt(1, 3);
             const p = getRandomInt(-3, 3);
             const q = getRandomInt(-5, 5);
             const s = p + getRandomInt(-3, -1);
             const t = p + getRandomInt(1, 4);
             // Ensure p is inside or outside?
             const domainType = getRandomInt(0, 2); 
             let dMin, dMax;
             if (domainType === 0) { dMin = p - 2; dMax = p + 2; }
             else if (domainType === 1) { dMin = p - 4; dMax = p - 1; }
             else { dMin = p + 1; dMax = p + 4; }
             
             const calc = (x) => a * (x - p)*(x - p) + q;
             const vP = calc(p);
             const vMin = calc(dMin);
             const vMax = calc(dMax);
             
             let maxVal, minVal;
             if (p >= dMin && p <= dMax) {
                 if (a > 0) { minVal = vP; maxVal = Math.max(vMin, vMax); }
                 else { maxVal = vP; minVal = Math.min(vMin, vMax); }
             } else {
                 maxVal = Math.max(vMin, vMax);
                 minVal = Math.min(vMin, vMax);
             }
             
             const target = getRandomInt(0, 1) === 0 ? '最大値' : '最小値';
             const ans = target === '最大値' ? maxVal : minVal;
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
    // --- Trig Ratios (Existing) ---
    'trig_rule_sin': {
        label: '正弦定理',
        func: (d, diff) => {
            const angles = [30, 45, 60, 90, 120, 135];
            const A = angles[getRandomInt(0, angles.length - 1)];
            let sinNum, sinDen, sinValStr;
            if (A === 30 || A === 150) { sinNum=1; sinDen=2; sinValStr='0.5'; }
            else if (A === 45 || A === 135) { sinNum='\\sqrt{2}'; sinDen=2; sinValStr='0.707'; } 
            else if (A === 60 || A === 120) { sinNum='\\sqrt{3}'; sinDen=2; sinValStr='0.866'; }
            else { sinNum=1; sinDen=1; sinValStr='1'; }
            const R = getRandomInt(2, 10);
            let aDisp;
            if (A===30||A===150) aDisp = `${R}`;
            else if (A===45||A===135) aDisp = `${R}\\sqrt{2}`; 
            else if (A===60||A===120) aDisp = `${R}\\sqrt{3}`;
            else aDisp = `${2*R}`;
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
            const target = diff === 'Easy' ? 'side' : (getRandomInt(0,1)?'side':'angle');
            if (target === 'side') {
                const nice = [
                    [3, 5, 120, 7],
                    [3, 8, 60, 7],
                    [5, 8, 60, 7],
                    [1, 1, 90, '\\sqrt{2}'],
                    [3, 4, 90, 5],
                    [1, 2, 60, '\\sqrt{3}'], 
                    [1, 1, 120, '\\sqrt{3}']
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
            const b = getRandomInt(2, 6);
            const c = getRandomInt(2, 6);
            const As = [30, 45, 60, 90, 120, 135, 150];
            const A = As[getRandomInt(0, As.length-1)];
            let sinA_str; 
            if ([30, 150].includes(A)) sinA_str = '1/2';
            else if ([45, 135].includes(A)) sinA_str = '\\frac{1}{\\sqrt{2}}';
            else if ([60, 120].includes(A)) sinA_str = '\\frac{\\sqrt{3}}{2}';
            else sinA_str = '1';
            let num = b * c;
            let den = 2; // from 1/2
            let sqrtPart = '';
            if ([30, 150].includes(A)) { den *= 2; }
            else if ([45, 135].includes(A)) { den *= 2; sqrtPart = '\\sqrt{2}'; } 
            else if ([60, 120].includes(A)) { den *= 2; sqrtPart = '\\sqrt{3}'; }
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
