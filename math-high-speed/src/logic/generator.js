import { generators as mathIaGens } from './mathIA.js';
import { generators as mathIiGens } from './mathII.js';
import { generators as mathBGens } from './mathB.js';
import { generators as arithGens } from './arithmetic.js';
import { getRandomInt } from './utils.js';

export const ALL_TOPICS = {
    'Arithmetic': {
        label: '四則演算 (Arithmetic)',
        subtopics: arithGens,
        hasConfig: true 
    },
    'MathIA': {
        label: '数学 I・A',
        subtopics: mathIaGens
    },
    'MathII': {
        label: '数学 II',
        subtopics: mathIiGens
    },
    'MathB': {
        label: '数学 B',
        subtopics: mathBGens
    }
};

export const generateProblem = (selectedSubtopicIds, config = {}) => {
    const lookup = {};
    Object.values(ALL_TOPICS).forEach(cat => {
        Object.entries(cat.subtopics).forEach(([k, v]) => {
            lookup[k] = v; 
        });
    });

    if (!selectedSubtopicIds || selectedSubtopicIds.length === 0) {
        selectedSubtopicIds = Object.keys(lookup);
    }
    
    const availableFuncs = selectedSubtopicIds
        .filter(id => lookup[id])
        .map(id => ({ id, ...lookup[id] }));

    if (availableFuncs.length === 0) {
        return mathIaGens['quad_eq'].func(2, 'Normal');
    }

    const selected = availableFuncs[getRandomInt(0, availableFuncs.length - 1)];
    
    const diff = config.difficulty || 'Normal';
    
    // Default digits is single value or array?
    // Old logic: digits = 2.
    // New logic: digits = [d1, d2] for Arithmetic.
    
    let digits = config.digits || 2; 

    // Special handling for Arithmetic
    if (selected.id.startsWith('arith_') && config.arithmetic) {
        const parts = selected.id.split('_'); 
        if (parts.length >= 2) {
            const type = parts[1]; // 'add', 'sub', 'mul', 'div'
            if (config.arithmetic[type]) {
                digits = config.arithmetic[type]; // This is now an array [d1, d2]
            }
        }
    }
    
    const problem = selected.func(digits, diff);
    problem.id = `${problem.id}_${Date.now()}`; 
    return problem;
};
