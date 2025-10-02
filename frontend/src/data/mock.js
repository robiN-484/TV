// Mock data for TV+ Social Watching App

export const mockUsers = [
  {
    user_id: "user_1",
    name: "Ahmet Yılmaz",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    user_id: "user_2", 
    name: "Elif Kaya",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    user_id: "user_3",
    name: "Murat Demir",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    user_id: "user_4",
    name: "Ayşe Şahin",
    avatar: "https://i.pravatar.cc/150?img=4"
  }
];

export const mockContent = [
  {
    content_id: "content_1",
    title: "Kurtlar Vadisi",
    type: "series",
    duration_min: 90,
    tags: ["aksiyon", "drama"],
    poster: "https://images.unsplash.com/photo-1489599263714-de7c0c7b4902?w=300&h=450&fit=crop",
    votes: 3
  },
  {
    content_id: "content_2",
    title: "Ayla",
    type: "movie", 
    duration_min: 125,
    tags: ["drama", "savaş"],
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    votes: 2
  },
  {
    content_id: "content_3",
    title: "Galatasaray - Fenerbahçe",
    type: "sports",
    duration_min: 105,
    tags: ["futbol", "derbi"],
    poster: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=450&fit=crop",
    votes: 1
  },
  {
    content_id: "content_4",
    title: "Çukur",
    type: "series",
    duration_min: 80,
    tags: ["suç", "aksiyon"],
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    votes: 0
  }
];

export const mockRoom = {
  room_id: "room_123",
  title: "Cumartesi Gecesi Film Keyfi",
  start_at: "2025-01-18T20:00:00Z",
  host_id: "user_1",
  members: ["user_1", "user_2", "user_3"],
  selected_content: "content_1",
  status: "waiting" // waiting, started, ended
};

export const mockChatMessages = [
  {
    id: "msg_1",
    room_id: "room_123",
    user_id: "user_2",
    message: "Bu film çok güzel olacak!",
    created_at: "2025-01-18T19:45:00Z",
    type: "text"
  },
  {
    id: "msg_2", 
    room_id: "room_123",
    user_id: "user_3",
    message: "🍿",
    created_at: "2025-01-18T19:46:00Z",
    type: "emoji"
  },
  {
    id: "msg_3",
    room_id: "room_123", 
    user_id: "user_1",
    message: "Pizza siparişi verdim, 30 dakikada gelir",
    created_at: "2025-01-18T19:47:00Z",
    type: "text"
  }
];

export const mockExpenses = [
  {
    expense_id: "exp_1",
    room_id: "room_123",
    user_id: "user_1", 
    amount: 45,
    note: "Pizza siparişi",
    weight: 3,
    created_at: "2025-01-18T19:30:00Z"
  },
  {
    expense_id: "exp_2",
    room_id: "room_123",
    user_id: "user_2",
    amount: 15,
    note: "Atıştırmalık",
    weight: 1,
    created_at: "2025-01-18T19:35:00Z"
  }
];

export const mockSyncState = {
  room_id: "room_123",
  is_playing: false,
  current_position: 0, // seconds
  host_timestamp: Date.now(),
  duration: 5400, // 90 minutes in seconds
  sync_drift_threshold: 2 // seconds
};

// Mock functions to simulate API calls
export const mockApi = {
  createRoom: (roomData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          room_id: `room_${Date.now()}`,
          invite_url: `https://tvplus.social/room/${Date.now()}`,
          ...roomData
        });
      }, 500);
    });
  },

  joinRoom: (roomId, userId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          room: mockRoom,
          user_role: userId === mockRoom.host_id ? 'host' : 'member'
        });
      }, 300);
    });
  },

  voteContent: (roomId, userId, contentId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          vote_recorded: true
        });
      }, 200);
    });
  },

  sendMessage: (roomId, userId, message) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message_id: `msg_${Date.now()}`
        });
      }, 100);
    });
  },

  addExpense: (roomId, userId, expense) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          expense_id: `exp_${Date.now()}`
        });
      }, 300);
    });
  },

  getBalances: (roomId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Calculate mock balances
        const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalWeight = mockExpenses.reduce((sum, exp) => sum + exp.weight, 0);
        
        resolve({
          total_amount: totalExpenses,
          per_user: [
            { user_id: "user_1", balance: -30.00 }, // paid 45, owes 30
            { user_id: "user_2", balance: 0.00 },   // paid 15, owes 15  
            { user_id: "user_3", balance: 15.00 }   // paid 0, owes 15
          ]
        });
      }, 400);
    });
  }
};