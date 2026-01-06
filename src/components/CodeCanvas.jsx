import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Check, Copy } from 'lucide-react';

const CodeCanvas = ({ language, code }) => {
    const [copied, setCopied] = useState(false);
    const codeRef = useRef(null);

    useEffect(() => {
        const highlight = () => {
            if (window.Prism && codeRef.current) {
                window.Prism.highlightElement(codeRef.current);
            }
        };

        if (window.Prism) {
            highlight();
        } else {
            const interval = setInterval(() => {
                if (window.Prism) {
                    highlight();
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [code, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-4 rounded-xl overflow-hidden glass-card border border-white/40 shadow-sm group animate-pop">
            <div className="flex items-center justify-between px-4 py-2 glass-code-header bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{language || 'Code'}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/50 rounded-md transition-colors text-xs font-medium text-gray-600"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="bg-[#2d2d2d] overflow-x-auto">
                <pre className="!m-0 !p-5 !bg-transparent" style={{ margin: 0 }}>
                    <code
                        ref={codeRef}
                        className={`text-sm font-mono leading-relaxed text-gray-200 whitespace-pre language-${language || 'text'}`}
                        style={{ fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                    >
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeCanvas;
