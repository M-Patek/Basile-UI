import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, isClosing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className={`absolute inset-0 bg-black/10 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={onClose}
            />
            <div className={`glass-darker rounded-[32px] w-[90%] max-w-md p-6 relative z-10 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isClosing ? 'animate-modal-out' : 'animate-modal'}`}>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
