import React, { useState } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Copy, RotateCcw, CheckSquare, Square } from 'lucide-react';
import LatexRenderer from './LatexRenderer';
import CodeCanvas from './CodeCanvas';
import MarkdownTable from './MarkdownTable';

export const UserMessage = ({ content, delay = 0 }) => (
    <div
        className="flex justify-end mb-8 animate-message-slide-in"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="glass-bubble-user text-[#1F1F1F] px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] md:max-w-[70%] leading-relaxed whitespace-pre-wrap shadow-sm">
            {content}
        </div>
    </div>
);

export const AIMessage = ({ content, isTyping, onShowToast, delay = 0 }) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const handleCopy = () => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = content;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            onShowToast("Response copied to clipboard");
        } catch (e) {
            onShowToast("Failed to copy");
        }
    };

    const handleLike = () => {
        setLiked(!liked);
        setDisliked(false);
        if (!liked) onShowToast("Thanks for the feedback!");
    };

    const handleDislike = () => {
        setDisliked(!disliked);
        setLiked(false);
        if (!disliked) onShowToast("Thanks for the feedback!");
    };

    const parseInline = (text) => {
        const parts = text.split(/(\$[^$]+\$|`[^`]+`|\[.*?\]\(.*?\)|(\*\*|__).*?(\*\*|__)|\*.*?\*)/g);

        return parts.map((part, i) => {
            if (!part) return null;

            if (part.startsWith('$') && part.endsWith('$')) {
                return <LatexRenderer key={i} content={part.slice(1, -1)} displayMode={false} />;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={i} className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50 px-1.5 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
            }
            if (part.startsWith('[') && part.includes('](')) {
                const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
                if (match) {
                    return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{match[1]}</a>;
                }
            }
            if (part.startsWith('**') || part.startsWith('__')) {
                return <strong key={i} className="font-bold text-gray-900 dark:text-white">{parseInline(part.slice(2, -2))}</strong>;
            }
            if (part.startsWith('*')) {
                return <em key={i} className="italic text-gray-800 dark:text-gray-200">{parseInline(part.slice(1, -1))}</em>;
            }

            return part;
        });
    };

    const renderContent = (text) => {
        if (!text) return null;

        const parts = text.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const match = part.match(/^```(\w+)?\n([\s\S]*?)```$/);
                if (match) {
                    const language = match[1] || 'text';
                    const code = match[2];
                    return <CodeCanvas key={index} language={language} code={code} />;
                }
            }

            if (part.startsWith('$$') && part.endsWith('$$')) {
                const math = part.slice(2, -2).trim();
                return <LatexRenderer key={index} content={math} displayMode={true} />;
            }

            return renderTextSegment(part, index);
        });
    };

    const renderTextSegment = (text, parentIndex) => {
        const lines = text.split('\n');
        const elements = [];
        let currentTableBuffer = [];
        let inTable = false;

        lines.forEach((line, lineIdx) => {
            const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|');
            const isSeparator = line.trim() === '---';
            const isTaskList = line.trim().match(/^- \[(x| )\] (.*)$/);
            const isHeader = line.trim().match(/^(#{1,6})\s(.*)$/);
            const isBlockquote = line.trim().startsWith('> ');
            const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');

            if (isTableLine) {
                currentTableBuffer.push(line);
                inTable = true;
                return;
            } else if (inTable) {
                elements.push(
                    <MarkdownTable
                        key={`${parentIndex}-table-${lineIdx}`}
                        content={currentTableBuffer.join('\n')}
                        renderCell={parseInline}
                    />
                );
                currentTableBuffer = [];
                inTable = false;
            }

            const key = `${parentIndex}-${lineIdx}`;

            if (isSeparator) {
                elements.push(<div key={key} className="h-px bg-gray-300/50 dark:bg-gray-700 my-4" />);
            } else if (isTaskList) {
                const checked = isTaskList[1] === 'x';
                const content = isTaskList[2];
                elements.push(
                    <div key={key} className="task-list-item text-gray-700 dark:text-gray-300">
                        <div className="mt-1">
                            {checked ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="flex-1">{parseInline(content)}</div>
                    </div>
                );
            } else if (isHeader) {
                const level = isHeader[1].length;
                const content = isHeader[2];
                const sizes = { 1: 'text-2xl', 2: 'text-xl', 3: 'text-lg', 4: 'text-base', 5: 'text-sm', 6: 'text-xs' };
                elements.push(
                    <div key={key} className={`font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2 ${sizes[level] || 'text-base'}`}>
                        {parseInline(content)}
                    </div>
                );
            } else if (isBlockquote) {
                elements.push(
                    <div key={key} className="markdown-blockquote">
                        {parseInline(line.replace(/^> /, ''))}
                    </div>
                );
            } else if (isBullet) {
                elements.push(
                    <div key={key} className="flex items-start gap-2 mb-1 ml-1">
                        <span className="text-gray-400 mt-1.5 text-[0.6rem]">•</span>
                        <div className="whitespace-pre-wrap flex-1">{parseInline(line.replace(/^[* -]\s+/, ''))}</div>
                    </div>
                );
            } else if (line.trim() !== '') {
                elements.push(
                    <div key={key} className="whitespace-pre-wrap mb-1">
                        {parseInline(line)}
                    </div>
                );
            }
        });

        if (currentTableBuffer.length > 0) {
            elements.push(
                <MarkdownTable
                    key={`${parentIndex}-table-end`}
                    content={currentTableBuffer.join('\n')}
                    renderCell={parseInline}
                />
            );
        }

        return <div key={`text-${parentIndex}`}>{elements}</div>;
    };

    return (
        <div
            className="flex items-start space-x-4 mb-8 group animate-message-slide-in"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#4285F4] to-[#9B72CB] shadow-md">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
            </div>
            <div className="flex-1 space-y-2 min-w-0">
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Basile</div>

                <div className="prose prose-slate dark:prose-invert max-w-none text-[#1F1F1F] dark:text-[#E2E8F0] leading-7 fade-in-text">
                    {renderContent(content)}
                </div>

                {!isTyping && (
                    <div className="flex items-center space-x-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={handleLike}
                            className={`p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors ${liked ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleDislike}
                            className={`p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors ${disliked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <ThumbsDown className={`w-4 h-4 ${disliked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
