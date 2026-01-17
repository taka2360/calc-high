import React, { useEffect, useState } from 'react';
import LatexRenderer from './LatexRenderer';
import { motion } from 'framer-motion';
import './ResultScreen.css';

const ResultScreen = ({ results, onRetry, onHome }) => {
    // Determine Rank
    // Formula: Score % + Speed bonus?
    // Let's keep it simple: Correct %
    // S: 100%, A: 90%+, B: 80%+, C: 60%+, D: <60%
    const correctCount = results.filter(r => r.isCorrect).length; // Note: r.isCorrect tracks timeOver/skip
    const total = results.length;
    const percentage = total > 0 ? (correctCount / total) * 100 : 0;
    
    let rank = 'D';
    if (percentage === 100) rank = 'S';
    else if (percentage >= 90) rank = 'A';
    else if (percentage >= 80) rank = 'B';
    else if (percentage >= 60) rank = 'C';
    
    // Average Time
    const totalTime = results.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);
    const avgTime = total > 0 ? (totalTime / total).toFixed(2) : 0;

    return (
        <motion.div 
            className="result-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className={`rank-display rank-${rank}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
                {rank}
            </motion.div>

            <div className="score-summary">
                <div className="summary-item">
                    <span className="label">Score</span>
                    <span className="value large">{correctCount} / {total}</span>
                </div>
                <div className="summary-item">
                    <span className="label">Avg Time</span>
                    <span className="value">{avgTime}s</span>
                </div>
            </div>
            
            <div className="result-details">
                {results.map((r, i) => (
                    <div key={i} className={`detail-row ${r.isCorrect ? 'correct' : 'timeover'}`}>
                        <div className="row-header">
                            <span className="q-num">Q{i+1}</span>
                            <span className="time">{r.isTimeOver ? 'TIME' : `${r.timeTaken.toFixed(1)}s`}</span>
                        </div>
                        <div className="row-question">
                            <LatexRenderer latex={r.question} displayMode={false} />
                        </div>
                        <div className="row-answer">
                            <span className="user-ans">Your: {r.userAnswer}</span>
                            {!r.isCorrect && (
                                <span className="correct-ans">Ans: <LatexRenderer latex={r.correctAnswer} displayMode={false}/></span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="result-actions">
                <motion.button className="action-btn home-btn" onClick={onHome} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>HOME</motion.button>
                <motion.button className="action-btn retry-btn" onClick={onRetry} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>RETRY</motion.button>
            </div>
        </motion.div>
    );
};

export default ResultScreen;
