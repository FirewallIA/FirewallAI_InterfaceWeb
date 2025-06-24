import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatHistory } from '@/lib/data';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { ChatMessage } from '@/lib/types';

const AIAssistant: React.FC = () => {
  const { data, isLoading, error } = useChatHistory();
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    setSendingMessage(true);
    try {
      await apiRequest('POST', '/api/ai/chat/message', { content: messageText });
      // Refetch chat history after sending a message
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chat/history'] });
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
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

  const handleFullscreen = () => {
    // Implementation would go here
    alert('Fullscreen functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25] flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
              <i className="ri-robot-line text-white"></i>
            </div>
            <CardTitle className="text-white">ChatSec AI Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <i className="ri-fullscreen-line"></i>
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 bg-[#090a0d] rounded-lg p-4 mb-4 overflow-y-auto h-64 scrollbar-hide animate-pulse">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start">
                  <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 mt-1"></div>
                  <div className="bg-gray-800 rounded-lg p-3 w-3/4">
                    <div className="h-2 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Input
              placeholder="Ask ChatSec a question..."
              disabled
              className="w-full bg-[#1a1d25] border-[#222631]"
            />
            <Button
              disabled
              className="absolute right-1 top-1 bg-transparent hover:bg-transparent text-primary-500 hover:text-primary-400"
            >
              <i className="ri-send-plane-fill"></i>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25] flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
              <i className="ri-robot-line text-white"></i>
            </div>
            <CardTitle className="text-white">ChatSec AI Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={handleFullscreen}
          >
            <i className="ri-fullscreen-line"></i>
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 bg-[#090a0d] rounded-lg p-4 mb-4 overflow-y-auto h-64 scrollbar-hide">
            <div className="flex items-center justify-center h-full text-red-400">
              Error loading chat history
            </div>
          </div>
          <div className="relative">
            <Input
              placeholder="Ask ChatSec a question..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#1a1d25] border-[#222631]"
            />
            <Button
              onClick={handleSendMessage}
              disabled={sendingMessage || !messageText.trim()}
              className="absolute right-1 top-1 bg-transparent hover:bg-transparent text-primary-500 hover:text-primary-400"
            >
              <i className="ri-send-plane-fill"></i>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const messages: ChatMessage[] = data?.messages || [];

  // Default welcome message if no messages
  if (messages.length === 0) {
    messages.push({
      id: 'welcome',
      sender: 'ai',
      content: "Hello! I'm your FirewallAI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <Card className="bg-[#11131a] border-[#1a1d25] flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
            <i className="ri-robot-line text-white"></i>
          </div>
          <CardTitle className="text-white">ChatSec AI Assistant</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
          onClick={handleFullscreen}
        >
          <i className="ri-fullscreen-line"></i>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 bg-[#090a0d] rounded-lg p-4 mb-4 overflow-y-auto h-64 scrollbar-hide">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 ${
                  message.sender === 'ai' 
                    ? 'bg-primary-600' 
                    : 'bg-[#1a1d25]'
                  } rounded-full flex items-center justify-center ${
                    message.sender === 'ai' ? 'mr-3' : 'ml-3'
                  } mt-1`}>
                  <i className={`${
                    message.sender === 'ai' ? 'ri-robot-line' : 'ri-user-line'
                  } text-white text-sm`}></i>
                </div>
                <div className={`${
                  message.sender === 'ai'
                    ? 'bg-[#11131a]'
                    : 'bg-primary-900/50 border border-primary-800/50'
                  } rounded-lg p-3 max-w-[80%]`}>
                  <p className="text-sm text-gray-500">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <Input
            placeholder="Ask ChatSec a question..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#1a1d25] border-[#222631]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendingMessage || !messageText.trim()}
            className="absolute right-1 top-1 bg-transparent hover:bg-transparent text-primary-500 hover:text-primary-400"
          >
            <i className="ri-send-plane-fill"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
