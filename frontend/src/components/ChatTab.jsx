import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { mockChatMessages, mockUsers, mockApi } from '../data/mock';

const ChatTab = ({ roomId, currentUserId }) => {
  const [messages, setMessages] = useState(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const scrollAreaRef = useRef(null);
  
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🍿', '🎬'];
  
  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };
  
  const canSendMessage = () => {
    const now = Date.now();
    const timeDiff = now - lastMessageTime;
    return timeDiff >= 2000; // 2 second rate limit
  };
  
  const handleSendMessage = async (messageText, type = 'text') => {
    if (!canSendMessage()) {
      alert('Çok hızlı mesaj gönderiyorsunuz. Lütfen 2 saniye bekleyin.');
      return;
    }
    
    if (!messageText.trim() && type === 'text') return;
    
    setIsSending(true);
    
    try {
      const newMsg = {
        id: `msg_${Date.now()}`,
        room_id: roomId,
        user_id: currentUserId,
        message: messageText,
        created_at: new Date().toISOString(),
        type: type
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setLastMessageTime(Date.now());
      
      await mockApi.sendMessage(roomId, currentUserId, messageText);
    } catch (error) {
      console.error('Message send failed:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(newMessage, 'text');
  };
  
  const handleEmojiClick = (emoji) => {
    handleSendMessage(emoji, 'emoji');
  };
  
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const getUserInfo = (userId) => {
    return mockUsers.find(user => user.user_id === userId) || {
      name: 'Bilinmeyen Kullanıcı',
      avatar: ''
    };
  };
  
  const nextMessageTime = lastMessageTime + 2000;
  const remainingTime = Math.max(0, Math.ceil((nextMessageTime - Date.now()) / 1000));
  
  return (
    <div className="h-96 flex flex-col">
      {/* Chat Header */}
      <div className="pb-3 border-b border-slate-700">
        <h3 className="font-semibold">Sohbet</h3>
        <p className="text-xs text-slate-400">
          {messages.length} mesaj
        </p>
      </div>
      
      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 py-3">
        <div className="space-y-3 pr-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">Henüz mesaj yok</p>
              <p className="text-xs">İlk mesajı siz gönderin!</p>
            </div>
          ) : (
            messages.map((message) => {
              const user = getUserInfo(message.user_id);
              const isCurrentUser = message.user_id === currentUserId;
              
              return (
                <div 
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 min-w-0 ${isCurrentUser ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-slate-300">
                        {isCurrentUser ? 'Sen' : user.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                    
                    <div className={`inline-block max-w-full ${
                      message.type === 'emoji' 
                        ? 'text-2xl' 
                        : `px-3 py-2 rounded-lg text-sm ${
                            isCurrentUser 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-600 text-slate-100'
                          }`
                    }`}>
                      {message.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
      
      {/* Quick Emojis */}
      <div className="py-3 border-t border-slate-700">
        <div className="flex items-center space-x-1 mb-3">
          <span className="text-xs text-slate-400 mr-2">Hızlı:</span>
          {quickEmojis.map((emoji) => (
            <Button
              key={emoji}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-600"
              onClick={() => handleEmojiClick(emoji)}
              disabled={!canSendMessage() || isSending}
            >
              {emoji}
            </Button>
          ))}
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              disabled={!canSendMessage() || isSending}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            {remainingTime > 0 && (
              <p className="text-xs text-orange-400 mt-1">
                {remainingTime} saniye bekleyin
              </p>
            )}
          </div>
          
          <Button 
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || !canSendMessage() || isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;