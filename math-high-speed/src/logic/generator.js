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
    let availableFuncs = [];
    
    const lookup = {};
    Object.values(ALL_TOPICS).forEach(cat => {
        Object.entries(cat.subtopics).forEach(([k, v]) => {
            lookup[k] = v; 
        });
    });

    if (!selectedSubtopicIds || selectedSubtopicIds.length === 0) {
        selectedSubtopicIds = Object.keys(lookup);
    }
    
    availableFuncs = selectedSubtopicIds
        .filter(id => lookup[id])
        .map(id => ({ id, ...lookup[id] }));

    if (availableFuncs.length === 0) {
        return mathIaGens['quad_eq'].func();
    }

    const selected = availableFuncs[getRandomInt(0, availableFuncs.length - 1)];
    
    // Pass config object OR flattened params
    // Some gens take (digits), others will take (difficulty).
    // Let's standardize: func(config) or func(arg1, arg2...)
    // Previously arith took (digits).
    // Let's pass config to all, and update arith to read config.digits.
    // OR: pass (difficulty, extra)
    
    // Legacy support: arith func(d).
    // Let's update arithmetic.js first to accept object or just pass digits and difficulty separately?
    // Easiest: func(config)
    
    // But updating ALL generator signatures is risky if I miss one.
    // Javascript functions ignore extra args.
    // So if I pass (config.digits, config.difficulty), standard gens receiving () will ignore.
    // Arith receiving (d) will work.
    // New gens can receive (d, difficulty).
    
    const digits = config.digits || 2;
    const diff = config.difficulty || 'Normal';
    
    const problem = selected.func(digits, diff);
    problem.id = `${problem.id}_${Date.now()}`;
    return problem;
};
