import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Users, Clock, Wifi } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import VotingTab from './VotingTab';
import ChatTab from './ChatTab';
import SplitTab from './SplitTab';
import { mockUsers, mockRoom, mockContent, mockSyncState } from '../data/mock';

const WatchParty = () => {
  const [currentRoom, setCurrentRoom] = useState(mockRoom);
  const [syncState, setSyncState] = useState(mockSyncState);
  const [connectedUsers] = useState(mockUsers.slice(0, 3));
  const [timeToStart, setTimeToStart] = useState(null);
  const [isHost] = useState(true); // Mock: current user is host
  const [connectionQuality] = useState('good'); // good, medium, poor
  
  // Get selected content
  const selectedContent = mockContent.find(c => c.content_id === currentRoom.selected_content);
  
  useEffect(() => {
    // Calculate time until start
    const startTime = new Date(currentRoom.start_at);
    const now = new Date();
    const diff = startTime - now;
    
    if (diff > 0) {
      setTimeToStart(Math.floor(diff / 1000));
    }
    
    // Mock sync state updates
    const interval = setInterval(() => {
      if (syncState.is_playing && syncState.current_position < syncState.duration) {
        setSyncState(prev => ({
          ...prev,
          current_position: prev.current_position + 1
        }));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentRoom.start_at, syncState.is_playing]);
  
  const handlePlayPause = () => {
    if (isHost) {
      setSyncState(prev => ({
        ...prev,
        is_playing: !prev.is_playing,
        host_timestamp: Date.now()
      }));
    }
  };
  
  const handleSeek = (newPosition) => {
    if (isHost) {
      setSyncState(prev => ({
        ...prev,
        current_position: newPosition,
        host_timestamp: Date.now()
      }));
    }
  };
  
  const handleSyncFix = () => {
    // Mock sync fix - simulate seeking to correct position
    setSyncState(prev => ({
      ...prev,
      current_position: prev.current_position + Math.random() * 2 - 1 // Small adjustment
    }));
  };
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatTimeToStart = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'good': return 'text-green-500';
      case 'medium': return 'text-yellow-500'; 
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">{currentRoom.title}</h1>
            {selectedContent && (
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                {selectedContent.title}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            {timeToStart !== null && timeToStart > 0 && (
              <div className="flex items-center space-x-2 text-orange-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">{formatTimeToStart(timeToStart)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{connectedUsers.length} kişi</span>
            </div>
            
            <div className={`flex items-center space-x-1 ${getConnectionColor()}`}>
              <Wifi className="w-4 h-4" />
              <span className="text-xs">{connectionQuality === 'good' ? 'İyi' : connectionQuality === 'medium' ? 'Orta' : 'Zayıf'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-0">
              {/* Mock Video Player */}
              <div className="aspect-video bg-black rounded-t-lg relative group">
                {selectedContent ? (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                    <img 
                      src={selectedContent.poster} 
                      alt={selectedContent.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-bold mb-2">{selectedContent.title}</h3>
                      <p className="text-slate-300 mb-4">{selectedContent.type === 'movie' ? 'Film' : selectedContent.type === 'series' ? 'Dizi' : 'Spor'}</p>
                      
                      {/* Play/Pause Button */}
                      <Button
                        size="lg"
                        onClick={handlePlayPause}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4"
                        disabled={!isHost}
                      >
                        {syncState.is_playing ? 
                          <Pause className="w-8 h-8" /> : 
                          <Play className="w-8 h-8 ml-1" />
                        }
                      </Button>
                      
                      {!isHost && (
                        <p className="text-xs text-slate-400 mt-2">Sadece oda sahibi kontrol edebilir</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-slate-400 mb-2">İçerik seçimi bekleniyor</p>
                      <p className="text-sm text-slate-500">Oylama sekmesinden içerik seçin</p>
                    </div>
                  </div>
                )}
                
                {/* Sync Fix Button */}
                {syncState.is_playing && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSyncFix}
                      className="bg-black/50 border-slate-600 text-white hover:bg-black/70"
                    >
                      Senkronda değil misin?
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Video Controls */}
              <div className="p-4 bg-slate-800">
                <div className="flex items-center space-x-4 mb-3">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleSeek(Math.max(0, syncState.current_position - 10))}
                    disabled={!isHost}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={handlePlayPause}
                    disabled={!isHost}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {syncState.is_playing ? 
                      <Pause className="w-4 h-4" /> : 
                      <Play className="w-4 h-4" />
                    }
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleSeek(Math.min(syncState.duration, syncState.current_position + 10))}
                    disabled={!isHost}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1 flex items-center space-x-3">
                    <span className="text-sm font-mono text-slate-400">
                      {formatTime(Math.floor(syncState.current_position))}
                    </span>
                    
                    <Progress 
                      value={(syncState.current_position / syncState.duration) * 100} 
                      className="flex-1 h-2"
                    />
                    
                    <span className="text-sm font-mono text-slate-400">
                      {formatTime(syncState.duration)}
                    </span>
                  </div>
                  
                  <Button size="sm" variant="ghost">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  
                  <Button size="sm" variant="ghost">
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Connected Users */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Katılımcılar:</span>
                  <div className="flex -space-x-2">
                    {connectedUsers.map((user, index) => (
                      <Avatar key={user.user_id} className="w-6 h-6 border-2 border-slate-700">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Panel - Tabs */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 h-fit">
            <CardContent className="p-0">
              <Tabs defaultValue="voting" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                  <TabsTrigger value="voting" className="text-xs">Oylama</TabsTrigger>
                  <TabsTrigger value="chat" className="text-xs">Sohbet</TabsTrigger>
                  <TabsTrigger value="split" className="text-xs">Split</TabsTrigger>
                </TabsList>
                
                <div className="p-4">
                  <TabsContent value="voting" className="mt-0">
                    <VotingTab roomId={currentRoom.room_id} isHost={isHost} />
                  </TabsContent>
                  
                  <TabsContent value="chat" className="mt-0">
                    <ChatTab roomId={currentRoom.room_id} currentUserId="user_1" />
                  </TabsContent>
                  
                  <TabsContent value="split" className="mt-0">
                    <SplitTab roomId={currentRoom.room_id} currentUserId="user_1" />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WatchParty;