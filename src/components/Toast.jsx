import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 glass-darker text-gray-800 dark:text-gray-200 px-4 py-3 rounded-2xl text-sm z-[100] toast-enter flex items-center gap-2 min-w-[200px] justify-center font-medium">
            <span>{message}</span>
        </div>
    );
};

export default Toast;
