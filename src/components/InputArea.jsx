import React, { useState } from 'react';
import { Send, Image as ImageIcon, Mic, ChevronDown, Check } from 'lucide-react';

const InputArea = ({
    input,
    setInput,
    onSend,
    isCentered = false,
    fileInputRef,
    handleFileUpload,
    inputRef,
    isListening,
    toggleMic,
    showModeMenu,
    setShowModeMenu,
    inputMode,
    setInputMode,
    modeMenuRef,
    handleKeyDown
}) => {

    // NEW: State for handling menu exit animation
    const [isMenuClosing, setIsMenuClosing] = useState(false);

    // Wrapper to handle menu toggling with animation
    const toggleMenu = () => {
        if (showModeMenu) {
            setIsMenuClosing(true);
            setTimeout(() => {
                setShowModeMenu(false);
                setIsMenuClosing(false);
            }, 150); // Matches .animate-menu-out duration
        } else {
            setShowModeMenu(true);
        }
    };

    // Wrapper to select mode and close menu gracefully
    const selectMode = (modeId) => {
        setInputMode(modeId);
        setIsMenuClosing(true);
        setTimeout(() => {
            setShowModeMenu(false);
            setIsMenuClosing(false);
        }, 150);
    };

    return (
        <div className={`
      relative flex items-end gap-2 p-3 rounded-[32px] transition-all duration-300
      glass-input w-full
      ${isCentered ? 'shadow-lg' : ''}
    `}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-full transition-colors mb-0.5 tooltip"
                title="Upload image"
            >
                <ImageIcon className="w-6 h-6" />
            </button>

            <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a prompt here"
                className="w-full bg-transparent border-none outline-none resize-none text-base py-3 text-gray-800 placeholder-gray-500 overflow-y-auto"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '144px' }}
            />

            <div className="flex items-center gap-1 mb-0.5">
                {input ? (
                    <button
                        onClick={() => onSend()}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors animate-pop shadow-lg shadow-blue-500/30"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="relative" ref={modeMenuRef}>
                            <button
                                onClick={toggleMenu}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium border border-transparent ${showModeMenu ? 'bg-white/60 shadow-sm border-white/40' : 'hover:bg-white/40 text-gray-600'}`}
                                title="Select Model"
                            >
                                <span className="text-gray-700">{inputMode}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showModeMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {(showModeMenu || isMenuClosing) && (
                                <div className={`absolute bottom-full left-0 mb-2 w-80 glass-menu rounded-2xl p-2 z-50 shadow-xl flex flex-col ${isMenuClosing ? 'animate-menu-out' : 'animate-menu-in'}`}>
                                    <div className="px-3 py-2 border-b border-gray-100/50 dark:border-gray-700/50 mb-1">
                                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]">Basile</span>
                                    </div>
                                    {[
                                        { id: 'Fast', desc: 'Answers quickly' },
                                        { id: 'Thinking', desc: 'Solving complex problems' },
                                        { id: 'Pro', desc: 'Thinks longer for advanced math & code' }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => selectMode(mode.id)}
                                            className="flex items-center justify-between w-full p-3 hover:bg-white/60 dark:hover:bg-white/10 rounded-xl text-left transition-colors group"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{mode.id}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-light group-hover:text-gray-600 dark:group-hover:text-gray-300">{mode.desc}</span>
                                            </div>
                                            {inputMode === mode.id && <Check className="w-4 h-4 text-blue-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggleMic}
                            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100/50'}`}
                        >
                            <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputArea;
