import React, { useState } from 'react';
import { Vote, Trophy, Clock, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { mockContent, mockApi } from '../data/mock';

const VotingTab = ({ roomId, isHost }) => {
  const [content] = useState(mockContent);
  const [userVotes, setUserVotes] = useState({}); // Track user votes
  const [isVoting, setIsVoting] = useState(false);
  
  const handleVote = async (contentId) => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      // If user already voted for this content, remove vote
      if (userVotes[contentId]) {
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[contentId];
          return newVotes;
        });
      } else {
        // Remove any previous vote and add new vote
        setUserVotes({ [contentId]: true });
      }
      
      await mockApi.voteContent(roomId, "user_1", contentId);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };
  
  const getTotalVotes = () => {
    return content.reduce((sum, item) => sum + item.votes, 0);
  };
  
  const getWinningContent = () => {
    const maxVotes = Math.max(...content.map(c => c.votes));
    return content.find(c => c.votes === maxVotes);
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${minutes}dk`;
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'movie': return 'Film';
      case 'series': return 'Dizi';
      case 'sports': return 'Spor';
      default: return type;
    }
  };
  
  const totalVotes = getTotalVotes();
  const winningContent = getWinningContent();
  
  return (
    <div className="space-y-4">
      {/* Voting Status */}
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">İçerik Oylaması</h3>
        <p className="text-sm text-slate-400 mb-3">
          En çok oy alan içerik izlenecek
        </p>
        
        {totalVotes > 0 && winningContent && (
          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-green-300">Şu an önde</span>
            </div>
            <p className="text-sm">{winningContent.title}</p>
            <p className="text-xs text-slate-400">{winningContent.votes} oy</p>
          </div>
        )}
      </div>
      
      {/* Content List */}
      <div className="space-y-3">
        {content.map((item) => {
          const votePercentage = totalVotes > 0 ? (item.votes / totalVotes) * 100 : 0;
          const userVoted = userVotes[item.content_id];
          
          return (
            <Card 
              key={item.content_id}
              className={`bg-slate-700/50 border-slate-600 cursor-pointer transition-all hover:bg-slate-700/70 ${
                userVoted ? 'ring-2 ring-blue-500 bg-blue-600/10' : ''
              }`}
              onClick={() => handleVote(item.content_id)}
            >
              <CardContent className="p-3">
                <div className="flex space-x-3">
                  <img 
                    src={item.poster} 
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm leading-tight truncate">
                        {item.title}
                      </h4>
                      <Button
                        size="sm"
                        variant={userVoted ? "default" : "outline"}
                        className={`ml-2 h-6 px-2 ${
                          userVoted 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'border-slate-500 hover:border-blue-500'
                        }`}
                        disabled={isVoting}
                      >
                        <Vote className="w-3 h-3 mr-1" />
                        {item.votes}
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs bg-slate-600/50">
                        {getTypeLabel(item.type)}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(item.duration_min)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-slate-400 mb-2">
                      {item.tags.map((tag, index) => (
                        <span key={tag} className="capitalize">
                          {tag}{index < item.tags.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                    
                    {/* Vote Progress Bar */}
                    {totalVotes > 0 && (
                      <div className="space-y-1">
                        <Progress 
                          value={votePercentage} 
                          className="h-1"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{votePercentage.toFixed(0)}%</span>
                          <span>{item.votes}/{totalVotes} oy</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Host Controls */}
      {isHost && totalVotes > 0 && (
        <div className="pt-4 border-t border-slate-700">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              // Mock: Start watch party with winning content
              alert(`İzleme partisi başlatılıyor: ${winningContent?.title}`);
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            Partiyi Başlat
          </Button>
          <p className="text-xs text-center text-slate-400 mt-2">
            Oda sahibi olarak partiyi başlatabilirsiniz
          </p>
        </div>
      )}
      
      {/* Empty State */}
      {totalVotes === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Vote className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Henüz oy verilmedi</p>
          <p className="text-xs">Favori içeriğiniz için oy verin</p>
        </div>
      )}
    </div>
  );
};

export default VotingTab;