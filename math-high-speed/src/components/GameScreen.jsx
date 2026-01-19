import React, { useState, useEffect } from 'react';
import { generateProblem } from '../logic/generator';
import { checkAnswer } from '../logic/validator';
import LatexRenderer from './LatexRenderer';
import MathKeyboard from './MathKeyboard';
import { motion, AnimatePresence } from 'framer-motion';
import './GameScreen.css';

const TIME_LIMIT = 15; 

const formatInputDisplay = (raw) => {
    if (!raw) return "";
    return raw
        .replace(/\\theta/g, 'θ')
        .replace(/\\pi/g, 'π')
        .replace(/sqrt\(/g, '√(')
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/\\frac/g, 'frac');
};

const GameScreen = ({ config, onFinish, onHome }) => { // Added onHome
    const [problems, setProblems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [gameState, setGameState] = useState('loading');
    const [results, setResults] = useState([]); 
    const [isWrong, setIsWrong] = useState(false);
    const [isTimeOver, setIsTimeOver] = useState(false); 
    
    // Gamification State
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);

    useEffect(() => {
        const newProblems = [];
        for (let i = 0; i < config.count; i++) {
            newProblems.push(generateProblem(config.topics, config));
        }
        setProblems(newProblems);
        setGameState('playing');
    }, [config]);

    // Timer logic
    useEffect(() => {
        if (gameState !== 'playing' || isTimeOver) return; 
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev - 0.1;
                if (next <= 0) {
                    setIsTimeOver(true); 
                    return 0; 
                }
                return next;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [gameState, isTimeOver]);

    const finishQuestion = (isCorrect, skipped = false) => {
        const currentProblem = problems[currentIndex];
        const effectiveTime = isTimeOver ? (TIME_LIMIT + 1) : (TIME_LIMIT - timeLeft);
        
        let newCombo = combo;
        if (skipped || isTimeOver) {
            newCombo = 0;
        } else {
             newCombo += 1;
        }
        
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);

        const result = {
            id: currentProblem.id,
            question: currentProblem.question,
            userAnswer: skipped ? "SKIPPED" : userInput,
            correctAnswer: currentProblem.answer.display,
            isCorrect: (isCorrect && !isTimeOver) && !skipped,
            isTimeOver: isTimeOver,
            timeTaken: effectiveTime
        };
        
        const newResults = [...results, result];
        setResults(newResults);

        if (currentIndex < problems.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserInput('');
            setTimeLeft(TIME_LIMIT);
            setIsWrong(false);
            setIsTimeOver(false);
        } else {
            // Pass max combo to finish
            onFinish(newResults, newCombo > maxCombo ? newCombo : maxCombo);
        }
    };

    const submitAnswer = () => {
        const currentProblem = problems[currentIndex];
        const isCorrect = checkAnswer(userInput, currentProblem.answer);

        if (isCorrect) {
            finishQuestion(true);
        } else {
            setIsWrong(true);
            setCombo(0); 
            setTimeout(() => setIsWrong(false), 500);
        }
    };

    const handleSkip = () => {
        finishQuestion(false, true);
    };

    const handleInput = (val) => {
        if (val === '__CLEAR__') {
             setUserInput('');
        } else {
             setUserInput(prev => prev + val);
        }
        setIsWrong(false);
    };
    
    const handleDelete = () => {
        setUserInput(prev => prev.slice(0, -1));
    };

    if (gameState === 'loading') return <div>Generating Problems...</div>;

    const currentProblem = problems[currentIndex];
    const isDebug = config.debug;

    return (
        <div className="game-screen">
            <button className="game-home-btn" onClick={onHome}>🏠</button>
            
            <div className="game-header">
                <div className="progress-info">
                    Q {currentIndex + 1} / {problems.length}
                </div>
                <div className="timer-bar-container">
                    <motion.div 
                        className="timer-bar" 
                        animate={{ 
                            width: `${(timeLeft / TIME_LIMIT) * 100}%`,
                            backgroundColor: isTimeOver ? '#ff0000' : (timeLeft < 5 ? '#ff4d4d' : 'var(--accent-color)'),
                            opacity: isTimeOver ? [1, 0.5, 1] : 1
                        }}
                        transition={isTimeOver ? { duration: 0.8, repeat: Infinity } : { ease: "linear", duration: 0.1 }}
                    />
                </div>
            </div>

            {/* COMBO INDICATOR */}
            <AnimatePresence>
                {combo > 1 && (
                    <motion.div 
                        className="combo-display"
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1.2, rotate: -5 }}
                        exit={{ opacity: 0, scale: 0 }}
                        key={combo} // Re-trigger animation on change
                    >
                        {combo} COMBO!
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                <motion.div 
                    key={currentProblem.id}
                    className="question-area"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="latex-question">
                        <LatexRenderer latex={currentProblem.question} />
                    </div>
                    {/* DEBUG PANEL */}
                    {isDebug && (
                        <div className="debug-panel">
                             <div className="debug-ans">Ans: {currentProblem.answer.display}</div>
                             <button className="skip-btn" onClick={handleSkip}>SKIP >></button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <motion.div 
                className={`answer-display ${isWrong ? 'error' : ''} ${isTimeOver ? 'timeout' : ''}`}
                animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <span className="input-preview">
                    {userInput ? formatInputDisplay(userInput) : <span className="placeholder">Enter Answer...</span>}
                </span>
            </motion.div>
             
            <div className="keyboard-container">
                <MathKeyboard 
                    onInput={handleInput} 
                    onDelete={handleDelete}
                    onSubmit={submitAnswer}
                />
            </div>
        </div>
    );
};

export default GameScreen;
