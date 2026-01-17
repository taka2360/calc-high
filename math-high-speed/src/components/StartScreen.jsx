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
    const [arithDigits, setArithDigits] = useState(initialConfig?.digits || 2);
    const [difficulty, setDifficulty] = useState(initialConfig?.difficulty || 'Normal');
    const [isDebug, setIsDebug] = useState(initialConfig?.debug || false);
    
    const [showDigitConfig, setShowDigitConfig] = useState(false);

    useEffect(() => {
        const arithKeys = Object.keys(ALL_TOPICS['Arithmetic'].subtopics);
        const hasArith = selectedSubtopics.some(k => arithKeys.includes(k));
        setShowDigitConfig(hasArith);
    }, [selectedSubtopics]);

    const toggleSubtopic = (key) => {
        if (selectedSubtopics.includes(key)) {
            if (selectedSubtopics.length > 1) {
                setSelectedSubtopics(selectedSubtopics.filter(k => k !== key));
            }
        } else {
            setSelectedSubtopics([...selectedSubtopics, key]);
        }
    };

    const toggleCategory = (catKey) => {
        const catSubtopics = Object.keys(ALL_TOPICS[catKey].subtopics);
        const allSelected = catSubtopics.every(k => selectedSubtopics.includes(k));
        
        if (allSelected) {
            setSelectedSubtopics(selectedSubtopics.filter(k => !catSubtopics.includes(k)));
        } else {
            const newSet = new Set([...selectedSubtopics, ...catSubtopics]);
            setSelectedSubtopics(Array.from(newSet));
        }
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
                digits: arithDigits,
                difficulty: difficulty,
                debug: isDebug
            });
        }
    };

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
                                        <input 
                                            type="checkbox" 
                                            checked={isCategorySelected(catKey)}
                                            onChange={() => toggleCategory(catKey)}
                                        />
                                        {catVal.label}
                                    </label>
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
                        <h2 className="section-title">Settings</h2>
                        
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
                                <label className="setting-label">Digits (Arithmetic)</label>
                                <div className="count-selector">
                                    {DIGITS.map(d => (
                                        <button 
                                            key={d} 
                                            className={`count-btn ${arithDigits === d ? 'active' : ''}`}
                                            onClick={() => setArithDigits(d)}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        
                        <div className="setting-group debug-toggle">
                             <label>
                                <input 
                                    type="checkbox" 
                                    checked={isDebug}
                                    onChange={(e) => setIsDebug(e.target.checked)}
                                />
                                Debug Mode
                            </label>
                        </div>
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
