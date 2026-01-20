import { getRandomInt } from './utils.js';

// digits: number OR [number, number]
export const generateArithmetic = (digitsConfig = 1, difficulty = 'Normal', opType = 'add') => {
    // Basic Arithmetic Logic (Existing)
    if (opType !== 'mixed') {
         let d1, d2;
        if (Array.isArray(digitsConfig)) {
            d1 = digitsConfig[0];
            d2 = digitsConfig[1];
        } else {
            d1 = digitsConfig || 2;
            d2 = digitsConfig || 2;
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
                if (difficulty !== 'Hard') {
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
                 const minD1 = Math.pow(10, d1 - 1);
                 const maxD1 = Math.pow(10, d1) - 1;
                 const minMult = Math.ceil(minD1 / v2);
                 const maxMult = Math.floor(maxD1 / v2);
                 if (minMult > maxMult) {
                     v1 = getRandomInt(minD1, maxD1);
                     v1 = v1 - (v1 % v2);
                     if (v1 < minD1) v1 += v2;
                     if (v1 > maxD1) { ans = 0; v1 = 0; } else { ans = v1 / v2; }
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
    } else {
        // --- AUTO-GENERATED MIXED CALCULATION ---
        // Easy: Depth 2 (3-4 numbers). Old "Normal".
        // Normal: Depth 3 with heavy pruning (approx 5-6 numbers).
        // Hard: Depth 3 full (approx 6-8 numbers).
        
        let MAX_DEPTH, BRANCH_CHANCE;
        
        if (difficulty === 'Easy') {
            MAX_DEPTH = 2;
            BRANCH_CHANCE = 0.5; // Some branching to depth 2
        } else if (difficulty === 'Normal') {
            MAX_DEPTH = 3;
            BRANCH_CHANCE = 0.4; // Aggressive pruning at lower depths
        } else {
            MAX_DEPTH = 3;
            BRANCH_CHANCE = 0.8; // High branching
        }
        
        const MAX_VAL = difficulty === 'Hard' ? 9 : 5;
        
        const ops = [
            { sym: '+', eval: (a,b)=>a+b, priority: 1, lat: '+' },
            { sym: '-', eval: (a,b)=>a-b, priority: 1, lat: '-' },
            { sym: '*', eval: (a,b)=>a*b, priority: 2, lat: '\\times' }
        ];
        
        const generateTree = (depth) => {
            // Leaf condition
            if (depth === 0) {
                return { type: 'num', val: getRandomInt(1, MAX_VAL) };
            }
            
            // Branch condition
            // If depth is high, more likely to branch?
            // Actually recursion goes down: depth=MAX -> depth=0.
            // When depth=MAX, we WANT to branch (unless easy).
            // Let's modify: passed depth is REMAINING depth.
            
            // Chance to stop early
            // If difficulty is Easy, and depth=2 (start), we must branch.
            // If depth=1, we might stop.
            
            let shouldBranch = true;
            if (difficulty === 'Easy' && depth < 2 && Math.random() > 0.5) shouldBranch = false;
            // For Normal/Hard, we want deeper trees.
            if (difficulty !== 'Easy' && depth < MAX_DEPTH && Math.random() > BRANCH_CHANCE) shouldBranch = false;
             
             // Base constraint
            if (depth === 0) shouldBranch = false;

            if (!shouldBranch) {
                 return { type: 'num', val: getRandomInt(1, MAX_VAL) };
            }
            
            const op = ops[getRandomInt(0, 2)];
            let left = generateTree(depth - 1);
            let right = generateTree(depth - 1);
            
            return { type: 'op', op: op, left: left, right: right };
        };
        
        const processTree = (node) => {
            if (node.type === 'num') {
                return { str: `${node.val}`, val: node.val, priority: 3 }; 
            }
            
            const l = processTree(node.left);
            const r = processTree(node.right);
            
            const val = node.op.eval(l.val, r.val);
            
            let sL = l.str;
            let sR = r.str;
            
            const needsBracket = (childNode, childPrio, isRight) => {
                 if (childPrio < node.op.priority) return true;
                 if (childPrio === node.op.priority) {
                     if (isRight && (node.op.sym === '-' || node.op.sym === '/')) return true;
                 }
                 return false;
            };
            
            if (needsBracket(node.left, l.priority, false)) sL = `(${sL})`;
            if (needsBracket(node.right, r.priority, true)) sR = `(${sR})`;
            
            return { str: `${sL} ${node.op.lat} ${sR}`, val: val, priority: node.op.priority };
        };
        
        let tree, res;
        let attempts = 0;
        do {
           tree = generateTree(MAX_DEPTH);
           // Retry if simple number
           if (tree.type === 'num') continue; 
           
           res = processTree(tree);
           attempts++;
        } while (attempts < 5 && (res.val === 0)); 
        
        return {
            id: `arith_mixed_${Date.now()}_${Math.random()}`,
            subtopic: "Mixed Operations",
            question: res.str,
            answer: { values: [res.val], display: `${res.val}` },
            type: "math-input"
        };
    }
};

export const generators = {
    'arith_add': { label: '加算 (+)', func: (d, diff) => generateArithmetic(d, diff, 'add') },
    'arith_sub': { label: '減算 (-)', func: (d, diff) => generateArithmetic(d, diff, 'sub') },
    'arith_mul': { label: '乗算 (×)', func: (d, diff) => generateArithmetic(d, diff, 'mul') },
    'arith_div': { label: '除算 (÷)', func: (d, diff) => generateArithmetic(d, diff, 'div') },
    'arith_mixed': { label: '四則混合 (Mixed)', func: (d, diff) => generateArithmetic(d, diff, 'mixed') },
};
