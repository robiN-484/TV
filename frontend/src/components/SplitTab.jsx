import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, Calculator, Users, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { mockExpenses, mockUsers, mockApi } from '../data/mock';

const SplitTab = ({ roomId, currentUserId }) => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [balances, setBalances] = useState([]);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    note: '',
    weight: 1
  });
  
  useEffect(() => {
    calculateBalances();
  }, [expenses]);
  
  const calculateBalances = async () => {
    try {
      const result = await mockApi.getBalances(roomId);
      setBalances(result.per_user);
    } catch (error) {
      console.error('Balance calculation failed:', error);
    }
  };
  
  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.note) return;
    
    setIsAddingExpense(true);
    
    try {
      const expense = {
        expense_id: `exp_${Date.now()}`,
        room_id: roomId,
        user_id: currentUserId,
        amount: parseFloat(newExpense.amount),
        note: newExpense.note,
        weight: parseInt(newExpense.weight) || 1,
        created_at: new Date().toISOString()
      };
      
      setExpenses(prev => [...prev, expense]);
      await mockApi.addExpense(roomId, currentUserId, expense);
      
      setNewExpense({ amount: '', note: '', weight: 1 });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Add expense failed:', error);
    } finally {
      setIsAddingExpense(false);
    }
  };
  
  const handleDeleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(exp => exp.expense_id !== expenseId));
  };
  
  const getUserInfo = (userId) => {
    return mockUsers.find(user => user.user_id === userId) || {
      name: 'Bilinmeyen Kullanıcı',
      avatar: ''
    };
  };
  
  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-400';
    if (balance < 0) return 'text-red-400';
    return 'text-slate-400';
  };
  
  const getBalanceText = (balance) => {
    if (balance > 0) return `+${formatCurrency(balance)} alacak`;
    if (balance < 0) return `${formatCurrency(balance)} borç`;
    return 'Borcu yok';
  };
  
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Masraf Paylaşımı</h3>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">
            {formatCurrency(getTotalExpenses())}
          </div>
          <p className="text-xs text-slate-400">Toplam masraf</p>
        </div>
      </div>
      
      {/* Add Expense Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Masraf Ekle
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Yeni Masraf Ekle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Tutar (₺)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            
            <div>
              <Label htmlFor="note">Açıklama</Label>
              <Input
                id="note"
                value={newExpense.note}
                onChange={(e) => setNewExpense(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Pizza siparişi, atıştırmalık..."
                className="bg-slate-700 border-slate-600"
              />
            </div>
            
            <div>
              <Label htmlFor="weight">Ağırlık (paylaşım oranı)</Label>
              <Input
                id="weight"
                type="number"
                min="1"
                value={newExpense.weight}
                onChange={(e) => setNewExpense(prev => ({ ...prev, weight: e.target.value }))}
                className="bg-slate-700 border-slate-600"
              />
              <p className="text-xs text-slate-400 mt-1">
                Yüksek ağırlık = daha fazla pay
              </p>
            </div>
            
            <Button 
              onClick={handleAddExpense}
              disabled={isAddingExpense || !newExpense.amount || !newExpense.note}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isAddingExpense ? 'Ekleniyor...' : 'Masrafı Ekle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Expenses List */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-slate-300">Masraflar</h4>
        
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Henüz masraf eklenmedi</p>
            <p className="text-xs">İlk masrafı ekleyerek başlayın</p>
          </div>
        ) : (
          expenses.map((expense) => {
            const user = getUserInfo(expense.user_id);
            const isCurrentUserExpense = expense.user_id === currentUserId;
            
            return (
              <Card 
                key={expense.expense_id}
                className="bg-slate-700/50 border-slate-600"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0">
                        <p className="font-medium text-sm">
                          {expense.note}
                        </p>
                        <p className="text-xs text-slate-400">
                          {isCurrentUserExpense ? 'Sen' : user.name} • 
                          {formatDate(expense.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="font-semibold text-green-400">
                          {formatCurrency(expense.amount)}
                        </p>
                        <Badge variant="outline" className="text-xs border-slate-500">
                          Ağırlık: {expense.weight}
                        </Badge>
                      </div>
                      
                      {isCurrentUserExpense && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteExpense(expense.expense_id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      
      {/* Balances */}
      {expenses.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-slate-400" />
            <h4 className="font-medium text-sm text-slate-300">Hesap Durumu</h4>
          </div>
          
          <div className="space-y-2">
            {mockUsers.slice(0, 3).map((user) => {
              const userBalance = balances.find(b => b.user_id === user.user_id);
              const balance = userBalance ? userBalance.balance : 0;
              const isCurrentUser = user.user_id === currentUserId;
              
              return (
                <Card 
                  key={user.user_id}
                  className={`bg-slate-700/50 border-slate-600 ${
                    isCurrentUser ? 'ring-2 ring-blue-500/30' : ''
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <p className="font-medium text-sm">
                            {isCurrentUser ? 'Sen' : user.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`text-right ${getBalanceColor(balance)}`}>
                        <p className="font-semibold">
                          {getBalanceText(balance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-blue-300" />
              <span className="font-semibold text-blue-300 text-sm">Nasıl Çalışır?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Masraflar ağırlık oranına göre bölünür. Pozitif bakiye alacak, 
              negatif bakiye borç anlamına gelir.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitTab;