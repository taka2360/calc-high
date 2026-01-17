// Normalizes user input and expected answer for comparison
export const normalizeAnswer = (input) => {
    if (!input) return "";
    let s = input.toString();
    
    // Remove all whitespace
    s = s.replace(/\s+/g, '');
    
    // Convert common user inputs to LaTeX-ish format for comparison
    s = s.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
    s = s.replace(/\\frac{([^}]+)}{([^}]+)}/g, '$1/$2'); 
    s = s.replace(/\\sqrt{([^{}]+)}/g, 'sqrt($1)');
    s = s.replace(/[{}]/g, ''); 
    s = s.replace(/\\/g, ''); 
    
    // Remove "x=" or similar prefixes for pure value comparison
    s = s.replace(/^[a-zA-Z0-9]+=/i, '');

    return s;
};

// Helper to split by comma and normalize each part
const getParts = (str) => {
    // Split by comma
    return str.split(',')
        .map(normalizeAnswer)
        .filter(p => p.length > 0)
        .sort(); // Sort for set comparison
};

export const checkAnswer = (userAns, correctAnsObj) => {
    // 1. Direct display string match (fast path)
    if (userAns === correctAnsObj.display) return true;
    
    // 2. Set Comparison (Order Independent for multiple answers)
    // Expected: "x = 1, -2" or just values.
    // We compare the normalized sets of values.
    
    // Extract values from Display string if correctAnsObj.values is not sufficient
    // Actually correctAnsObj.values usually contains the numeric/raw values.
    // logic/mathIA.js for quad_eq returns: values: [ans1, ans2], display: "x = ..."
    
    // If we have specific values array, use it? 
    // But userAns is a string.
    
    // Let's rely on string parsing of both.
    // Parse Correct Display: "x = 1, 2" -> ["1", "2"]
    // Parse User Input: "1, 2" -> ["1", "2"]
    
    const correctParts = getParts(correctAnsObj.display);
    const userParts = getParts(userAns);
    
    if (correctParts.length === userParts.length) {
        // deeply equal sorted arrays
        const match = correctParts.every((val, index) => val === userParts[index]);
        if (match) return true;
    }

    // 3. Fallback: Flexible "x=" removal (Single value case handled by getParts too actually)
    // If not multiple, getParts returns length 1 array.
    // normalized match check
    
    const normUser = normalizeAnswer(userAns);
    const normCorrect = normalizeAnswer(correctAnsObj.display);
    
    if (normUser === normCorrect) return true;

    return false;
};
