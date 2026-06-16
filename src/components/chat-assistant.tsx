"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, ArrowRight } from 'lucide-react';
import { getChatbotResponse } from '../utils/recommender';
import { Movie } from '../data/movies';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  movies?: Movie[];
}

const quickChips = [
  "Movies like Inception",
  "Inspiring Software Engineer films",
  "Find underrated masterpieces",
  "Movies for deep emotional recovery"
];

export default function ChatAssistant({ 
  onMovieClick,
  copilotQuery,
  onClearCopilotQuery
}: { 
  onMovieClick: (movie: Movie) => void;
  copilotQuery?: string;
  onClearCopilotQuery?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "ai",
      text: "Greetings explorer. I am the LumoraX Intelligence Core. Ask me for recommendations based on careers, moods, complex endings, or input semantic scenes like 'hero survives in space'."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    messageIdCounter.current += 1;
    const userMsg: Message = {
      id: `user-${messageIdCounter.current}`,
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    try {
      const aiResult = await getChatbotResponse(text);
      messageIdCounter.current += 1;
      const aiMsg: Message = {
        id: `ai-${messageIdCounter.current}`,
        sender: 'ai',
        text: aiResult.message,
        movies: aiResult.recommendedMovies
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat assistant processing error:", err);
      messageIdCounter.current += 1;
      setMessages(prev => [...prev, {
        id: `ai-${messageIdCounter.current}`,
        sender: 'ai',
        text: "Apologies, the query analyzer is currently offline. Please verify network dependencies."
      }]);
    }
  };

  // Watch for copilot directives
  useEffect(() => {
    if (copilotQuery && copilotQuery.trim()) {
      handleSendMessage(copilotQuery);
      if (onClearCopilotQuery) {
        onClearCopilotQuery();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copilotQuery]);

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="bg-black/40 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-primary glow-purple animate-pulse" />
          <h3 className="text-sm font-bold tracking-widest text-white uppercase font-mono">
            LUMORAX_INTELLIGENCE_CORE_v1.0
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-primary animate-pulse" />
          <span className="text-[10px] text-white/50 font-mono">SECTOR_ONLINE</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-primary/20 border border-indigo-primary/30 text-white rounded-tr-none'
                  : 'bg-white/5 border border-white/5 text-white/95 rounded-tl-none font-sans'
              }`}
            >
              {msg.text.split('\n').map((line, idx) => (
                <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>{line}</p>
              ))}
 
              {/* Connected recommendations inline */}
              {msg.movies && msg.movies.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
                  {msg.movies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => onMovieClick(movie)}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-primary/45 hover:bg-white/10 cursor-pointer flex items-center justify-between gap-3 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={movie.imageUrl} alt={movie.title} className="w-9 h-9 rounded object-cover shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-white truncate">{movie.title}</h4>
                          <p className="text-[9px] text-white/50">{movie.genre.join(', ')} • {movie.year}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-primary shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* QuickChips Footer */}
      <div className="px-6 py-2 bg-black/25 flex flex-wrap gap-2 overflow-x-auto select-none border-t border-white/5 shrink-0">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-indigo-primary hover:border-indigo-primary/30 transition-colors shrink-0 font-mono"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Message Input bar */}
      <div className="p-4 bg-black/40 border-t border-white/10 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2"
        >
          <input 
            type="text"
            placeholder="Query: 'Explain Interstellar ending' or 'Inspiring movies'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 glass-input text-xs font-mono"
          />
          <button 
            type="submit"
            className="p-2.5 rounded-lg bg-indigo-primary hover:bg-indigo-primary/90 text-white transition-colors"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </form>
      </div>

    </div>
  );
}
