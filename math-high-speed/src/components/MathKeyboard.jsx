import React from 'react';
import './MathKeyboard.css';

// Simple hook for responsiveness
const useIsWide = () => {
    const [isWide, setIsWide] = React.useState(window.innerWidth > 700);
    React.useEffect(() => {
        const handler = () => setIsWide(window.innerWidth > 700);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return isWide;
};

const MathKeyboard = ({ onInput, onDelete, onSubmit }) => {
  const isWide = useIsWide();

  const handlePress = (key) => {
    if (key.action === 'delete') {
      onDelete();
    } else if (key.action === 'submit') {
      onSubmit();
    } else if (key.action === 'clear') {
        onInput('__CLEAR__'); 
    } else {
      onInput(key.value);
    }
  };

  const enterKey = { label: 'Enter', action: 'submit', type: 'submit' };
  
  // Standard Layout (5 cols)
  // Need to add ',' key. Maybe replace '.'? Or add it.
  // We have 2 empty spots in wide layout bottom?
  // Standard layout:
  // Row 4: 0, ., pi, +, sqrt
  // Let's add ',' to Row 4 or 5.
  
  let standardLayout = [
    // Row 1
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '÷', value: '/', type: 'op' }, { label: 'DEL', action: 'delete', type: 'action' },
    // Row 2
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '×', value: '*', type: 'op' }, { label: 'AC', action: 'clear', type: 'action' },
    // Row 3
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '-', value: '-', type: 'op' }, { label: '^', value: '^', type: 'op' },
    // Row 4
    { label: '0', value: '0' }, { label: '.', value: '.' }, { label: ',', value: ',' }, { label: '+', value: '+', type: 'op' }, { label: '√', value: 'sqrt(', type: 'fn' },
    // Row 5
    { label: 'x', value: 'x', type: 'var' }, { label: 'y', value: 'y', type: 'var' }, { label: 'n', value: 'n', type: 'var' }, { label: 'θ', value: '\\theta', type: 'var' }, enterKey,
    // Row 6 (Legacy vars/funcs)
    { label: '(', value: '(' }, { label: ')', value: ')' }, { label: 'log', value: 'log(', type: 'fn' }, { label: 'sin', value: 'sin(', type: 'fn' }, { label: 'cos', value: 'cos(', type: 'fn' }, { label: 'π', value: '\\pi' }
  ];
  // Note: Standard layout map rendering might look weird if count % 5 != 0.
  // Row6 is 6 items? No, standardLayout is array. Grid fills 5. 
  // currently 31 items. 30 is 6 rows. 31st pushes to row 7.
  // It's acceptable.

  // Wide Layout (7 cols)
  const wideKeys = [
      // Row 1
      { label: 'x', value: 'x', type: 'var' }, { label: 'y', value: 'y', type: 'var' }, { label: 'n', value: 'n', type: 'var' }, { label: 'θ', value: '\\theta', type: 'var' },  { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' },
      // Row 2
      { label: '√', value: 'sqrt(', type: 'fn' }, { label: '^', value: '^', type: 'op' }, { label: '(', value: '(' }, { label: ')', value: ')' }, { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' },
      // Row 3
      { label: 'sin', value: 'sin(', type: 'fn' }, { label: 'cos', value: 'cos(', type: 'fn' }, { label: 'log', value: 'log(', type: 'fn' }, { label: 'π', value: '\\pi' }, { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' },
      // Row 4
      { label: '+', value: '+', type: 'op' }, { label: '-', value: '-', type: 'op' }, { label: '×', value: '*', type: 'op' }, { label: '÷', value: '/', type: 'op' }, { label: '.', value: '.' }, { label: '0', value: '0' }, { label: ',', value: ',' },
  ];
  
  const activeLayout = isWide ? [...wideKeys, { label: 'DEL', action: 'delete', type: 'action' }, { label: 'AC', action: 'clear', type: 'action' }, enterKey] : standardLayout;

  return (
    <div className={`math-keyboard ${isWide ? 'wide-layout' : ''}`}>
      {activeLayout.map((key, index) => (
        <button 
          key={index} 
          className={`key key-${key.type || 'default'} ${key.label === 'Enter' ? 'key-enter' : ''}`}
          onClick={() => handlePress(key)}
          style={isWide && key.label === 'Enter' ? { gridColumn: 'span 1' } : {}}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
};

export default MathKeyboard;
