import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatHistory } from '@/lib/data';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ChatMessage } from '@/lib/types';

const AIAssistant: React.FC = () => {
  const { data, isLoading, error } = useChatHistory();
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const messages: ChatMessage[] = data?.messages || [];

  // Message d'accueil par défaut si l'historique est vide
  if (messages.length === 0) {
    messages.push({
      id: 'welcome',
      sender: 'ai',
      content: "Hello! I'm your FirewallAI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    });
  }

  const isWaitingForAI = messages.length > 0 && messages[messages.length - 1].sender === 'user';

  // Système de Polling tant que l'IA réfléchit
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWaitingForAI) {
      interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/ai/chat/history'] });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isWaitingForAI]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    setSendingMessage(true);
    try {
      await apiRequest('POST', '/api/ai/chat/message', { content: messageText });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chat/history'] });
      setMessageText('');
    } catch (err) {
      console.error('Failed to send:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-[#11131a] border-[#1a1d25] flex flex-col h-[600px] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
            <i className="ri-robot-line text-white"></i>
          </div>
          <CardTitle className="text-white text-base">ChatSec AI Assistant</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-4">
        {/* Zone de messages : overflow-y-auto permet de scroller manuellement sans effet automatique */}
        <div className="flex-1 overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 shrink-0 ${msg.sender === 'ai' ? 'bg-primary-600' : 'bg-[#1a1d25]'} rounded-full flex items-center justify-center ${msg.sender === 'ai' ? 'mr-3' : 'ml-3'} mt-1`}>
                  <i className={`${msg.sender === 'ai' ? 'ri-robot-line' : 'ri-user-line'} text-white text-sm`}></i>
                </div>
                <div className={`${msg.sender === 'ai' ? 'bg-[#11131a] border border-gray-800/50' : 'bg-primary-900/50 border border-primary-800/50'} rounded-lg p-3 max-w-[85%] whitespace-pre-wrap break-words`}>
                  <p className="text-sm text-gray-300">{msg.content}</p>
                </div>
              </div>
            ))}

            {isWaitingForAI && (
              <div className="flex items-start">
                <div className="w-8 h-8 shrink-0 bg-primary-600 rounded-full flex items-center justify-center mr-3 mt-1">
                  <i className="ri-robot-line text-white text-sm animate-pulse"></i>
                </div>
                <div className="bg-[#11131a] border border-gray-800/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i> ChatSec is thinking...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input area fixe en bas */}
        <div className="relative shrink-0 flex items-center bg-[#1a1d25] rounded-lg border border-[#222631]">
          <Input
            placeholder="Ask ChatSec a question..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isWaitingForAI}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendingMessage || !messageText.trim() || isWaitingForAI}
            className="bg-transparent hover:bg-transparent text-primary-500 hover:text-primary-400 h-10 w-10 p-0"
          >
            <i className="ri-send-plane-fill text-lg"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;