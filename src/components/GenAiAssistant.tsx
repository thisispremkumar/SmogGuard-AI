import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, ArrowRight, CornerDownLeft, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types';
import { apiClient } from '../services/apiClient';

interface GenAiAssistantProps {
  currentCity: string;
  onNavigateTab: (tab: string) => void;
}

export const GenAiAssistant: React.FC<GenAiAssistantProps> = ({ currentCity, onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **SmogGuard AI**, your GenAI specialist for urban air pollution and winter smog mitigation.

Whether you need to protect an asthmatic child during the morning inversion spike, construct an affordable $40 Corsi-Rosenthal air cleaner, time your window ventilation safely, or plan a low-emission school run, I am here with grounded atmospheric science.

How can I assist your family today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        actionPills: [
          { label: 'Asthma & Pediatric Protection Protocol', action: 'view_routine' },
          { label: 'When to Open Windows Safely', action: 'view_forecast' },
          { label: 'Build $40 DIY HEPA Filter', action: 'view_hacks' },
          { label: 'Gas Stove vs Induction NO2 Impact', action: 'view_impact' },
        ],
      },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isSubmitting) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsSubmitting(true);

    try {
      const data = await apiClient.askAssistant(
        query,
        currentCity,
        'Family with children and vulnerable members navigating urban winter smog'
      );

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          groundedData: data.groundedFacts,
          actionPills: data.actionPills,
          safetyNotice: data.safetyNotice,
        },
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, but I encountered an error communicating with the reasoning service. Please check your network or try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionPill = (action: string, label: string) => {
    if (action.includes('routine')) onNavigateTab('routine');
    else if (action.includes('hack') || action.includes('hacks')) onNavigateTab('hacks');
    else if (action.includes('impact')) onNavigateTab('impact');
    else if (action.includes('community')) onNavigateTab('community');
    else if (action.includes('forecast')) onNavigateTab('dashboard');
    else {
      handleSend(label);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
          <span>GenAI Smog & Inversion Advisory Specialist</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Ask questions about managing severe pollution days, indoor air purification hacks, family health protection, and sustainable lifestyle adaptations.
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-slate-900 text-white dark:bg-slate-700'
                      : 'bg-cyan-600 text-white shadow-sm'
                  }`}
                  aria-hidden="true"
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-cyan-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="whitespace-pre-line prose-sm dark:prose-invert">
                      {msg.text}
                    </div>

                    <div className={`text-[10px] mt-2 font-mono ${isUser ? 'text-cyan-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Grounded Facts Strip */}
                  {msg.metadata?.groundedData && msg.metadata.groundedData.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                        Grounded Atmospheric Telemetry:
                      </strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {msg.metadata.groundedData.map((fact, idx) => (
                          <li key={idx}>{fact}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Navigation Pills */}
                  {msg.metadata?.actionPills && msg.metadata.actionPills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.metadata.actionPills.map((pill, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionPill(pill.action, pill.label)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-950 dark:hover:bg-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800 transition-colors"
                        >
                          <span>{pill.label}</span>
                          <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSubmitting && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 animate-pulse">
                Synthesizing grounded atmospheric & health advisory...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="ai-chat-input" className="sr-only">Type question for SmogGuard AI</label>
            <input
              id="ai-chat-input"
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              placeholder="E.g., How do I protect my asthmatic toddler during morning inversion?"
              disabled={isSubmitting}
              className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isSubmitting}
              className="p-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white shadow-sm transition-transform active:scale-95 shrink-0"
              aria-label="Send query to assistant"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-2 text-[11px] text-slate-500 text-center">
            *Environmental advisory grounded in WHO & EPA guidelines. Consult your healthcare provider for severe acute respiratory symptoms.
          </p>
        </div>
      </div>
    </div>
  );
};

