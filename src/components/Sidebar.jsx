import React, { useState, useEffect, useRef } from 'react';
import { Menu, Plus, HelpCircle, Activity, Settings, Pin, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

const SidebarItem = ({ chat, onLoad, onPin, onRename, onDelete, index, isActive }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(chat.title);
    const [showMenu, setShowMenu] = useState(false);
    const inputRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRenameSubmit = (e) => {
        e.preventDefault();
        if (editTitle.trim()) {
            onRename(chat.id, editTitle);
            setIsEditing(false);
            setShowMenu(false);
        }
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <div
            className={`relative group animate-slide-in-left ${showMenu ? 'z-50' : 'z-auto'}`}
            style={{ animationDelay: `${(index + 1) * 50}ms` }}
        >
            {isEditing ? (
                <form onSubmit={handleRenameSubmit} className="px-2 py-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => { setIsEditing(false); setEditTitle(chat.title); }}
                        className="w-full bg-white/50 dark:bg-white/10 border border-blue-500 rounded px-2 py-1 text-sm outline-none backdrop-blur-sm text-gray-800 dark:text-gray-200"
                    />
                </form>
            ) : (
                <div
                    onClick={() => onLoad(chat.id, chat.title)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-full cursor-pointer transition-all duration-200 relative
            ${isActive
                            ? 'bg-purple-300/50 dark:bg-purple-500/30 shadow-md border border-purple-100/50 dark:border-purple-400/20'
                            : 'hover:bg-white/60 dark:hover:bg-white/25'
                        }
          `}
                    style={isActive ? { boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)' } : {}}
                >
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <span className={`text-sm truncate ${isActive ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {chat.title}
                        </span>
                        {chat.pinned && <Pin className="w-3.5 h-3.5 text-gray-400 fill-current shrink-0" />}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                            className="p-1 hover:bg-white/50 dark:hover:bg-white/20 rounded-full text-gray-600 dark:text-gray-400"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {showMenu && !isEditing && (
                <div ref={menuRef} className="absolute right-0 top-8 z-50 w-36 glass-menu rounded-2xl shadow-2xl ring-1 ring-black/5 py-1 flex flex-col animate-fade-in">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPin(chat.id); setShowMenu(false); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10 w-full text-left"
                    >
                        <Pin className="w-4 h-4" />
                        {chat.pinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10 w-full text-left"
                    >
                        <Edit2 className="w-4 h-4" />
                        Rename
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(chat.id); setShowMenu(false); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50/50 w-full text-left"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ isOpen, toggleSidebar, onNewChat, onLoadRecent, onOpenModal, chatHistory, setChatHistory, activeChatId }) => {
    const handlePin = (id) => {
        setChatHistory(prev => prev.map(chat =>
            chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
        ).sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1)));
    };

    const handleDelete = (id) => {
        setChatHistory(prev => prev.filter(chat => chat.id !== id));
    };

    const handleRename = (id, newTitle) => {
        setChatHistory(prev => prev.map(chat =>
            chat.id === id ? { ...chat, title: newTitle } : chat
        ));
    };

    const sortedChats = [...chatHistory].sort((a, b) => Number(b.pinned) - Number(a.pinned));

    return (
        <div
            className={`
        fixed inset-y-0 left-0 z-50 glass-sidebar flex flex-col shadow-2xl 
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        w-72 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:transform-none lg:shadow-none lg:relative
        ${isOpen ? 'lg:w-64 lg:opacity-100' : 'lg:w-0 lg:opacity-0 lg:overflow-hidden'}
      `}
        >
            <div
                className={`
          w-72 lg:w-64 flex flex-col h-full min-w-[16rem] 
          transition-all duration-500 ease-out
          ${isOpen ? 'opacity-100 translate-x-0 scale-100 delay-100' : 'opacity-0 -translate-x-4 scale-95'}
        `}
            >
                <div className="p-4 flex items-center justify-between">
                    <button onClick={toggleSidebar} className="p-2 hover:bg-white/40 dark:hover:bg-white/10 rounded-full transition-colors">
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <div className="px-4 py-2">
                    <button
                        key={isOpen ? 'newchat-open' : 'newchat-closed'}
                        onClick={onNewChat}
                        className={`w-full flex items-center space-x-3 glass-card text-gray-700 dark:text-gray-200 hover:text-[#041E49] dark:hover:text-blue-300 px-4 py-3 rounded-2xl transition-all duration-200 whitespace-nowrap ${isOpen ? 'animate-pop delay-100' : ''}`}
                    >
                        <Plus className="w-5 h-5 shrink-0" />
                        <span className="font-medium text-sm">New chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-4 no-scrollbar">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 mb-2">Recent</div>
                    <div className="space-y-1 pb-10">
                        {sortedChats.map((chat, idx) => (
                            <SidebarItem
                                key={`${chat.id}-${isOpen}`}
                                index={idx}
                                chat={chat}
                                onLoad={onLoadRecent}
                                onPin={handlePin}
                                onDelete={handleDelete}
                                onRename={handleRename}
                                isActive={activeChatId === chat.id}
                            />
                        ))}
                        {sortedChats.length === 0 && (
                            <div className="px-4 text-sm text-gray-400 italic">No recent chats</div>
                        )}
                    </div>
                </div>

                <div className="p-2 mt-auto border-t border-white/20 dark:border-white/10">
                    <button
                        onClick={() => onOpenModal('help')}
                        className="w-full flex items-center space-x-3 hover:bg-white/40 dark:hover:bg-white/10 px-4 py-2.5 rounded-full text-left transition-colors whitespace-nowrap"
                    >
                        <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Help</span>
                    </button>
                    <button
                        onClick={() => onOpenModal('activity')}
                        className="w-full flex items-center space-x-3 hover:bg-white/40 dark:hover:bg-white/10 px-4 py-2.5 rounded-full text-left transition-colors whitespace-nowrap"
                    >
                        <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Activity</span>
                    </button>
                    <button
                        onClick={() => onOpenModal('settings')}
                        className="w-full flex items-center space-x-3 hover:bg-white/40 dark:hover:bg-white/10 px-4 py-2.5 rounded-full text-left transition-colors whitespace-nowrap"
                    >
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
