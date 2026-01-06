import React, { useRef, useEffect } from 'react';

const LatexRenderer = ({ content, displayMode = false }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (window.katex && containerRef.current) {
            try {
                window.katex.render(content, containerRef.current, {
                    displayMode: displayMode,
                    throwOnError: false,
                    output: 'html'
                });
            } catch (e) {
                console.warn("Katex render error:", e);
                containerRef.current.innerText = content;
            }
        } else {
            containerRef.current.innerText = content;
        }
    }, [content, displayMode]);

    return <span ref={containerRef} className={displayMode ? "block my-4 w-full overflow-x-auto text-center" : "inline-block mx-0.5 align-middle"} />;
};

export default LatexRenderer;
