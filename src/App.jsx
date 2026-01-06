import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, SquarePen, MoreVertical, Settings, Sparkles, Code, Sigma, Terminal,
  Moon, Sun, Puzzle, Globe, Shield, CreditCard, Bell, ExternalLink, Search,
  MessageSquare, X, HelpCircle, Keyboard, FileQuestion, Info
} from 'lucide-react';

// Custom Hooks
import useExternalLib from './hooks/useExternalLib';

// Components
import Toast from './components/Toast';
import Modal from './components/Modal';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import { AIMessage, UserMessage } from './components/Messages';

// Modal Content Components
const SettingsContent = ({ darkTheme, toggleTheme }) => (
  <div className="space-y-2">
    <div className="px-1 py-1">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Preferences</h3>
      <div
        onClick={toggleTheme}
        className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {darkTheme ? <Moon className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
          <span className="text-gray-700 dark:text-gray-200">Dark theme</span>
        </div>
        <div className={`w-10 h-6 rounded-full relative transition-colors ${darkTheme ? 'bg-blue-600' : 'bg-gray-200'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${darkTheme ? 'left-5' : 'left-1'}`} />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <Puzzle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-200">Extensions</span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-200">Language</span>
        </div>
        <span className="text-sm text-gray-400">English (US)</span>
      </div>
    </div>

    <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>

    <div className="px-1 py-1">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Account</h3>
      <div className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-200">Public links</span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-200">Subscription</span>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-200">Notifications</span>
        </div>
      </div>
    </div>
  </div>
);

const ActivityContent = () => (
  <div className="space-y-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search your activity"
        className="w-full bg-white/40 dark:bg-black/20 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-200 outline-none backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-200"
      />
    </div>

    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today</p>
        <button className="text-xs text-blue-600 hover:underline">Clear day</button>
      </div>
      {[
        { title: "Explain React Hooks", time: "10:42 AM" },
        { title: "Draft an email to boss", time: "09:15 AM" }
      ].map((item, i) => (
        <div key={i} className="group flex items-start gap-3 p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.time} • Web</p>
          </div>
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/60 rounded-full text-gray-500 transition-all">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>

    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Yesterday</p>
      {[
        { title: "Python script for data analysis", time: "4:20 PM" },
        { title: "Best sushi restaurants in Tokyo", time: "1:30 PM" }
      ].map((item, i) => (
        <div key={i} className="group flex items-start gap-3 p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.time} • Mobile</p>
          </div>
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/60 rounded-full text-gray-500 transition-all">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const HelpContent = () => (
  <div className="space-y-2">
    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl mb-4 border border-blue-100/50 dark:border-blue-800/30">
      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Gemini Advanced</h4>
      <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">Get our most capable AI models and priority access to new features.</p>
      <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
        Upgrade now
      </button>
    </div>

    {[
      { icon: HelpCircle, text: "Help Center" },
      { icon: Sparkles, text: "Updates & FAQ" },
      { icon: Keyboard, text: "Keyboard shortcuts" },
      { icon: FileQuestion, text: "Send feedback" },
      { icon: Info, text: "Privacy & Terms" }
    ].map((item, i) => (
      <div key={i} className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{item.text}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
      </div>
    ))}

    <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
      <p className="text-xs text-gray-400">Version 2024.05.15</p>
    </div>
  </div>
);

export default function App() {
  // Load external scripts (Prism, Katex)
  useExternalLib();

  // Dark Theme State
  const [darkTheme, setDarkTheme] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [conversationId, setConversationId] = useState(0);
  const [inputMode, setInputMode] = useState('Fast');
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "React UI Design Patterns", pinned: false },
    { id: 2, title: "Material 3 Specifications", pinned: true },
    { id: 3, title: "Tailwind Animation Guide", pinned: false },
    { id: 4, title: "Frontend Architecture", pinned: false },
    { id: 5, title: "Understanding CSS Grid", pinned: false },
    { id: 6, title: "Next.js vs Remix", pinned: false },
  ]);

  const scrollContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const modeMenuRef = useRef(null);

  const scrollToBottom = () => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      shouldAutoScrollRef.current = isAtBottom;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target)) {
        setShowModeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setActiveModal(null);
      setIsModalClosing(false);
    }, 200);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    shouldAutoScrollRef.current = true;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = "";
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const apiContents = [
        ...history,
        { role: 'user', parts: [{ text: text }] }
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: apiContents,
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

      const aiMsgId = Date.now() + 1;
      const aiMsg = {
        id: aiMsgId,
        role: 'ai',
        content: ''
      };
      setMessages(prev => [...prev, aiMsg]);

      let i = 0;
      const streamInterval = setInterval(() => {
        if (i < aiResponseText.length) {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMsgId
              ? { ...msg, content: aiResponseText.substring(0, i + 1) }
              : msg
          ));
          i++;
        } else {
          clearInterval(streamInterval);
          setIsTyping(false);
        }
      }, 10);

    } catch (error) {
      console.error("Gemini API Error:", error);
      showToast("Error connecting to Gemini API");

      const errorMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later."
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsTyping(false);
    setInput('');
    setConversationId(Date.now());
    setActiveChatId(null);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleLoadRecent = (id, topic) => {
    setIsTyping(false);
    setConversationId(Date.now());
    setActiveChatId(id);
    setMessages([
      { id: 1, role: 'user', content: `Show me ${topic} features` },
      { id: 2, role: 'ai', content: `Here is a demo of the new rendering capabilities:\n\n### 1. Math Formulas (LaTeX)\n\nInline: $E = mc^2$\nBlock:\n$$\n\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$\n\n### 2. Code with Highlighting\n\n\`\`\`python\ndef hello_world():\n    print("Hello from PrismJS!")\n    return True\n\`\`\`\n\n### 3. Task Lists\n\n- [x] Implement Markdown\n- [x] Add Syntax Highlighting\n- [ ] Create World Peace\n\n> "This is a blockquote to show off the styling."\n\nCheck the **source code** for implementation details!` }
    ]);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      showToast(`Image "${e.target.files[0].name}" attached`);
    }
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      showToast("Listening...");
      setTimeout(() => {
        setIsListening(false);
        setInput("Describe the theory of relativity using math.");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div
      className={`relative flex h-screen font-sans overflow-hidden text-[#1F1F1F] selection:bg-[#c2dbfe] selection:text-[#0b57d0] transition-colors duration-500 ${darkTheme ? 'dark' : ''}`}
      style={{ backgroundColor: darkTheme ? '#040008' : '#F8F9FA' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-[800px] h-[800px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <Modal
        isOpen={!!activeModal}
        onClose={handleCloseModal}
        title={activeModal === 'settings' ? 'Settings' : activeModal === 'activity' ? 'Gemini Activity' : 'Help'}
        isClosing={isModalClosing}
      >
        {activeModal === 'settings' ? <SettingsContent darkTheme={darkTheme} toggleTheme={() => setDarkTheme(!darkTheme)} /> : activeModal === 'activity' ? <ActivityContent /> : <HelpContent />}
      </Modal>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        onLoadRecent={handleLoadRecent}
        onOpenModal={setActiveModal}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        activeChatId={activeChatId}
      />

      <div className="flex-1 flex flex-col h-full relative z-10">
        <div className="flex items-center justify-between px-5 py-3 glass-header sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${!isSidebarOpen ? 'w-10 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'}`}>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors whitespace-nowrap">
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <button onClick={handleNewChat} className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors mr-2 text-gray-600 dark:text-gray-400" title="New Chat">
              <SquarePen className="w-5 h-5" />
            </button>

            <button className="flex items-center space-x-1 text-lg font-medium text-gray-600 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]">Basile</span>
              <MoreVertical className="w-4 h-4 ml-1 text-gray-400" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setActiveModal('settings')} className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium cursor-pointer hover:ring-4 hover:ring-purple-100 dark:hover:ring-purple-900 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/50">U</div>
          </div>
        </div>

        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto relative no-scrollbar scroll-mask">
          <div key={conversationId} className="h-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full max-w-[800px] mx-auto px-4 animate-pop">
                <div className="w-full max-w-3xl mb-6">
                  <span className="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#4285F4] to-[#9B72CB] block text-left">
                    Hello, User
                  </span>
                  <span className="text-3xl font-medium text-[#939699] dark:text-gray-400 block text-left mt-1">
                    How can I help today?
                  </span>
                </div>

                <div className="w-full max-w-3xl mb-8">
                  <InputArea
                    input={input}
                    setInput={setInput}
                    onSend={handleSend}
                    isCentered={true}
                    fileInputRef={fileInputRef}
                    handleFileUpload={handleFileUpload}
                    inputRef={inputRef}
                    isListening={isListening}
                    toggleMic={toggleMic}
                    showModeMenu={showModeMenu}
                    setShowModeMenu={setShowModeMenu}
                    inputMode={inputMode}
                    setInputMode={setInputMode}
                    modeMenuRef={modeMenuRef}
                    handleKeyDown={handleKeyDown}
                  />
                </div>

                <div className="flex flex-wrap gap-3 justify-center w-full max-w-4xl px-4">
                  {[
                    { text: 'Explain React Hooks', icon: Code },
                    { text: 'Solve Quadratic Equation', icon: Sigma },
                    { text: 'Write a Python Script', icon: Terminal },
                    { text: 'Plan a trip', icon: Sparkles }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(item.text)}
                      className={`glass-pill px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 animate-pop delay-${(i + 1) * 100}`}
                    >
                      {item.icon === Terminal ? <Terminal className="w-4 h-4 text-gray-500 dark:text-gray-400" /> :
                        item.icon === Code ? <Code className="w-4 h-4 text-gray-500 dark:text-gray-400" /> :
                          item.icon === Sigma ? <Sigma className="w-4 h-4 text-gray-500 dark:text-gray-400" /> :
                            <Sparkles className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-[800px] mx-auto px-4 pb-32 pt-10">
                {messages.map((msg, index) => (
                  msg.role === 'user' ?
                    <UserMessage key={msg.id} content={msg.content} delay={index * 100} /> :
                    <AIMessage
                      key={msg.id}
                      content={msg.content}
                      isTyping={isTyping && msg.id === messages[messages.length - 1].id}
                      onShowToast={showToast}
                      delay={index * 100}
                    />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {messages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 pt-10 pb-6 bg-gradient-to-t from-[#F8F9FA]/80 via-[#F8F9FA]/40 to-transparent dark:from-[#131117]/90 dark:via-[#131117]/60 pointer-events-none animate-fade-in">
            <div className="max-w-[800px] mx-auto px-4 pointer-events-auto">
              <InputArea
                input={input}
                setInput={setInput}
                onSend={handleSend}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                inputRef={inputRef}
                isListening={isListening}
                toggleMic={toggleMic}
                showModeMenu={showModeMenu}
                setShowModeMenu={setShowModeMenu}
                inputMode={inputMode}
                setInputMode={setInputMode}
                modeMenuRef={modeMenuRef}
                handleKeyDown={handleKeyDown}
              />
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Gemini may display inaccurate info, including about people, so double-check its responses.
                  <a href="#" className="underline ml-1">Your privacy and Gemini Apps</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
