import React, { useState } from 'react';
import { Calendar, Clock, Users, Share2, Copy, QrCode, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { mockApi } from '../data/mock';

const RoomCreation = ({ onRoomCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  
  const [roomData, setRoomData] = useState({
    title: '',
    date: '',
    time: ''
  });
  
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!roomData.title || !roomData.date || !roomData.time) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Combine date and time
      const startAt = new Date(`${roomData.date}T${roomData.time}:00.000Z`);
      
      const room = await mockApi.createRoom({
        title: roomData.title,
        start_at: startAt.toISOString(),
        host_id: "user_1"
      });
      
      setCreatedRoom(room);
      setShowInviteDialog(true);
      
      toast({
        title: "Başarılı!",
        description: "Oda başarıyla oluşturuldu",
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Hata", 
        description: "Oda oluşturulurken bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleCopyInviteLink = () => {
    if (createdRoom?.invite_url) {
      navigator.clipboard.writeText(createdRoom.invite_url);
      toast({
        title: "Kopyalandı!",
        description: "Davet linki panoya kopyalandı"
      });
    }
  };
  
  const handleJoinRoom = () => {
    if (createdRoom && onRoomCreated) {
      onRoomCreated(createdRoom);
    }
  };
  
  // Get current date and time for min values  
  const now = new Date();
  // Add one day to current date to avoid timezone issues
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const currentDate = tomorrow.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">TV+ Sosyal İzleme</h1>
          <p className="text-slate-400">Arkadaşlarınızla birlikte film izleyin</p>
        </div>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Yeni Oda Oluştur</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <Label htmlFor="title">Oda Adı</Label>
                <Input
                  id="title"
                  value={roomData.title}
                  onChange={(e) => setRoomData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Cumartesi Gecesi Film Keyfi"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date" className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Tarih</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={roomData.date}
                    onChange={(e) => setRoomData(prev => ({ ...prev, date: e.target.value }))}
                    min={currentDate}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time" className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Saat</span>
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={roomData.time}
                    onChange={(e) => setRoomData(prev => ({ ...prev, time: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                disabled={isCreating}
              >
                {isCreating ? 'Oluşturuluyor...' : 'Oda Oluştur'}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-center text-slate-400 text-sm mb-3">
                Zaten bir odanız var mı?
              </p>
              <Button 
                variant="outline"
                className="w-full border-slate-600 hover:bg-slate-700"
                onClick={() => {
                  // Mock joining existing room
                  onRoomCreated && onRoomCreated({ room_id: 'room_123', title: 'Demo Oda' });
                }}
              >
                Demo Odaya Katıl
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-green-400" />
                <span>Oda Oluşturuldu!</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-green-300 mb-1">
                  {createdRoom?.title || roomData.title}
                </h3>
                <Badge variant="outline" className="border-green-500/50 text-green-300">
                  Oda ID: {createdRoom?.room_id}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm text-slate-400">Davet Linki</Label>
                <div className="flex mt-1">
                  <Input
                    value={createdRoom?.invite_url || ''}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white rounded-r-none"
                  />
                  <Button
                    onClick={handleCopyInviteLink}
                    className="rounded-l-none bg-blue-600 hover:bg-blue-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600 hover:bg-slate-700"
                  onClick={() => setShowInviteDialog(false)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Kod
                </Button>
                
                <Button
                  onClick={handleJoinRoom}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <span>Odaya Gir</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <p className="text-xs text-slate-400 text-center">
                Linki arkadaşlarınızla paylaşın ve birlikte izleme keyfini çıkarın!
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RoomCreation;