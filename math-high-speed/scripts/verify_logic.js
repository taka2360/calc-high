import { generateProblem } from '../src/logic/generator.js';

console.log("=== Testing Logic Generation ===");
try {
    for(let i=0; i<10; i++) {
        const p = generateProblem(['MathIA', 'MathII', 'MathB']);
        console.log(`[${p.subtopic}] Q: ${p.question}  A: ${p.answer.display}`);
    }
} catch (e) {
    console.error("Error during generation:", e);
}
console.log("=== End Test ===");
