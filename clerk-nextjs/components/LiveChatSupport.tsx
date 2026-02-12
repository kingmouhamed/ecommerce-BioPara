"use client";

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  User, 
  Clock, 
  Check,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
}

interface QuickReply {
  id: string;
  text: string;
  action?: string;
}

export default function LiveChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const quickReplies: QuickReply[] = [
    { id: '1', text: 'What are your shipping options?' },
    { id: '2', text: 'Do you ship internationally?' },
    { id: '3', text: 'How can I track my order?' },
    { id: '4', text: 'What is your return policy?' },
    { id: '5', text: 'Are your products organic?' },
    { id: '6', text: 'Do you offer bulk discounts?' }
  ];

  const agentResponses: { [key: string]: string } = {
    'shipping': 'We offer multiple shipping options:\n\n• Standard Shipping: 3-5 business days\n• Express Shipping: 2-3 business days\n• Free shipping on orders over $50 (US/EU) or equivalent\n\nAll orders are tracked and insured.',
    'international': 'Yes! We ship to over 50 countries worldwide including:\n\n• United States, Canada, UK, France, Germany\n• United Arab Emirates, Saudi Arabia\n• Morocco (our home country)\n\nInternational shipping takes 5-7 business days on average.',
    'track': 'You can track your order in multiple ways:\n\n1. Check your email for tracking updates\n2. Log into your account on our website\n3. Contact our support team with your order number\n\nTracking information is usually available within 24 hours of shipment.',
    'return': 'We offer a 30-day money-back guarantee:\n\n• Items must be unused and in original packaging\n• Contact us at support@biopara.com to initiate a return\n• We\'ll provide a prepaid return label\n• Refunds are processed within 5-7 business days',
    'organic': 'Yes! Most of our products are certified organic:\n\n• USDA Organic certified ingredients\n• No synthetic chemicals or pesticides\n• Sustainably sourced from Morocco\n• Full ingredient lists available on each product page',
    'bulk': 'Yes, we offer bulk discounts for orders over 10 units:\n\n• 10-24 items: 10% discount\n• 25-49 items: 15% discount\n• 50+ items: 20% discount\n\nContact our business team at business@biopara.com for custom quotes.'
  };

  useEffect(() => {
    // Simulate agent availability
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.3);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Add welcome message when chat opens
      if (messages.length === 0) {
        setTimeout(() => {
          const welcomeMessage: Message = {
            id: '1',
            text: 'Hello! Welcome to BioPara Support. How can I help you today?',
            sender: 'agent',
            timestamp: new Date(),
            agentName: 'Sarah'
          };
          setMessages([welcomeMessage]);
        }, 1000);
      }
    }
  }, [isOpen, isMinimized, messages.length]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Check for quick replies
    const lowerText = text.toLowerCase();
    let response = 'Thank you for your message. Let me connect you with our support team.';

    Object.keys(agentResponses).forEach(key => {
      if (lowerText.includes(key)) {
        response = agentResponses[key];
      }
    });

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'Sarah'
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.text);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      const emailMessage: Message = {
        id: Date.now().toString(),
        text: `Thank you! Your email (${userEmail}) has been saved. Our team will follow up with you there.`,
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'Sarah'
      };
      setMessages(prev => [...prev, emailMessage]);
      setShowEmailForm(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {isOnline && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            <div>
              <div className="font-semibold">BioPara Support</div>
              <div className="text-xs text-emerald-200 flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span>{isOnline ? 'Online' : 'Away'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-emerald-700 p-1 rounded transition-colors"
              aria-label={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-emerald-700 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.text}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.sender === 'agent' && message.agentName && (
                      <span className="font-medium">{message.agentName}</span>
                    )}
                    {' • '}
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-2xl p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email Form */}
            {showEmailForm && (
              <div className="px-4 pb-4">
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter your email for follow-up:
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="flex-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Email Support
                </button>
                <button
                  className="flex-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Us
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
