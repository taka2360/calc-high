import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const LatexRenderer = ({ latex, displayMode = true }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(latex, containerRef.current, {
                    displayMode: displayMode,
                    throwOnError: false
                });
            } catch (e) {
                console.error("KaTeX error:", e);
                containerRef.current.innerText = latex;
            }
        }
    }, [latex, displayMode]);

    return <span ref={containerRef} />;
};

export default LatexRenderer;
