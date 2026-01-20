import React, { useState, useEffect } from 'react';
import { ALL_TOPICS } from '../logic/generator';
import { motion, AnimatePresence } from 'framer-motion';
import './StartScreen.css';

const COUNTS = [10, 20, 30];
const DIGITS = [1, 2, 3, 4, 5];
const DIFFICULTIES = ['Easy', 'Normal', 'Hard'];

const StartScreen = ({ onStart, initialConfig }) => {
    const getAllSubtopics = () => {
        let all = [];
        Object.values(ALL_TOPICS).forEach(cat => {
            all = [...all, ...Object.keys(cat.subtopics)];
        });
        return all;
    };

    const [selectedSubtopics, setSelectedSubtopics] = useState(
        initialConfig?.topics || getAllSubtopics()
    );
    const [questionCount, setQuestionCount] = useState(initialConfig?.count || 10);
    
    // Arithmetic Detailed Config: Now storing [d1, d2] for each op
    const [arithConfig, setArithConfig] = useState(
        initialConfig?.arithmetic || { 
            add: [2, 2], 
            sub: [2, 2], 
            mul: [2, 1], // Default: 2 digit x 1 digit
            div: [2, 1] 
        }
    );
    
    const [difficulty, setDifficulty] = useState(initialConfig?.difficulty || 'Normal');
    const [isDebug, setIsDebug] = useState(initialConfig?.debug || false);
    
    const [showDigitConfig, setShowDigitConfig] = useState(false);
    const [debugClicks, setDebugClicks] = useState(0);

    const handleSecretDebug = () => {
        setDebugClicks(prev => {
            const next = prev + 1;
            if (next >= 5) {
                setIsDebug(curr => !curr);
                return 0; // Reset
            }
            return next;
        });
    };

    useEffect(() => {
        const arithKeys = Object.keys(ALL_TOPICS['Arithmetic'].subtopics);
        const hasArith = selectedSubtopics.some(k => arithKeys.includes(k));
        setShowDigitConfig(hasArith);
    }, [selectedSubtopics]);

    const updateArithDigit = (type, index, val) => {
        setArithConfig(prev => {
            const newArr = [...prev[type]];
            newArr[index] = val;
            return { ...prev, [type]: newArr };
        });
    };

    const toggleSubtopic = (key) => {
        if (selectedSubtopics.includes(key)) {
            setSelectedSubtopics(selectedSubtopics.filter(k => k !== key));
        } else {
            setSelectedSubtopics([...selectedSubtopics, key]);
        }
    };

    const selectAllInCategory = (catKey) => {
        const catSubtopics = Object.keys(ALL_TOPICS[catKey].subtopics);
        const newSet = new Set([...selectedSubtopics, ...catSubtopics]);
        setSelectedSubtopics(Array.from(newSet));
    };

    const clearCategory = (catKey) => {
        const catSubtopics = Object.keys(ALL_TOPICS[catKey].subtopics);
        setSelectedSubtopics(selectedSubtopics.filter(k => !catSubtopics.includes(k)));
    };

    const isCategorySelected = (catKey) => {
        const catSubtopics = Object.keys(ALL_TOPICS[catKey].subtopics);
        return catSubtopics.some(k => selectedSubtopics.includes(k));
    };

    const handleStartClick = () => {
        if (selectedSubtopics.length > 0) {
            onStart({ 
                topics: selectedSubtopics, 
                count: questionCount,
                arithmetic: arithConfig, 
                difficulty: difficulty,
                debug: isDebug
            });
        }
    };

    const renderDigitRow = (label, type, opSymbol) => (
        <div className="arith-config-row">
            <span className="arith-label">{label}</span>
            <div className="dual-selector-container">
                 {/* Left Operand */}
                 <div className="digit-group">
                     {DIGITS.map(d => (
                        <button 
                            key={`L-${d}`} 
                            className={`count-btn mini ${arithConfig[type][0] === d ? 'active' : ''}`} 
                            onClick={() => updateArithDigit(type, 0, d)}
                        >
                            {d}
                        </button>
                    ))}
                 </div>
                 <span className="op-divider">{opSymbol}</span>
                 {/* Right Operand */}
                 <div className="digit-group">
                     {DIGITS.map(d => (
                        <button 
                            key={`R-${d}`} 
                            className={`count-btn mini ${arithConfig[type][1] === d ? 'active' : ''}`} 
                            onClick={() => updateArithDigit(type, 1, d)}
                        >
                            {d}
                        </button>
                    ))}
                 </div>
            </div>
        </div>
    );

    return (
        <motion.div 
            className="start-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="start-content-wrapper">
                <div className="start-main-col">
                    <h2 className="section-title">Topics</h2>
                    <div className="topics-container">
                        {Object.entries(ALL_TOPICS).map(([catKey, catVal]) => (
                            <div key={catKey} className="topic-category">
                                <div className="category-header">
                                    <label>
                                        {catVal.label}
                                    </label>
                                    <div className="cat-actions">
                                        <button className="text-btn" onClick={() => selectAllInCategory(catKey)}>All</button>
                                        <button className="text-btn" onClick={() => clearCategory(catKey)}>Clear</button>
                                    </div>
                                </div>
                                <div className="subtopic-grid">
                                    {Object.entries(catVal.subtopics).map(([subKey, subVal]) => (
                                        <label key={subKey} className={`subtopic-item ${selectedSubtopics.includes(subKey) ? 'selected' : ''}`}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedSubtopics.includes(subKey)}
                                                onChange={() => toggleSubtopic(subKey)}
                                            />
                                            <span>{subVal.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="start-sidebar-col">
                    <div className="sidebar-section">
                        <h2 
                            className="section-title" 
                            onClick={handleSecretDebug}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                           Settings
                           {isDebug && <span style={{fontSize: '0.6rem', color: 'var(--accent-color)', marginLeft: '10px'}}>★</span>}
                        </h2>
                        
                        <div className="setting-group">
                            <label className="setting-label">Difficulty</label>
                            <div className="count-selector">
                                {DIFFICULTIES.map(d => (
                                    <button 
                                        key={d} 
                                        className={`count-btn wide ${difficulty === d ? 'active' : ''}`}
                                        onClick={() => setDifficulty(d)}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">Questions</label>
                            <div className="count-selector">
                                {COUNTS.map(count => (
                                    <button 
                                        key={count} 
                                        className={`count-btn ${questionCount === count ? 'active' : ''}`}
                                        onClick={() => setQuestionCount(count)}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                       <AnimatePresence>
                        {showDigitConfig && (
                            <motion.div 
                                className="setting-group"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label className="setting-label">Arithmetic Digits (Left op Right)</label>
                                
                                {renderDigitRow('Add', 'add', '+')}
                                {renderDigitRow('Sub', 'sub', '-')}
                                {renderDigitRow('Mul', 'mul', '×')}
                                {renderDigitRow('Div', 'div', '÷')}

                            </motion.div>
                        )}
                        </AnimatePresence>
                        
                        {/* Debug Toggle Hidden */}
                        {isDebug && (
                             <div className="setting-group debug-toggle">
                                 <label>
                                    <input 
                                        type="checkbox" 
                                        checked={isDebug}
                                        onChange={(e) => setIsDebug(e.target.checked)}
                                    />
                                    Debug Mode Allowed
                                </label>
                            </div>
                        )}
                    </div>

                    <motion.button 
                        className="start-btn" 
                        onClick={handleStartClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={selectedSubtopics.length === 0}
                    >
                        START
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default StartScreen;
