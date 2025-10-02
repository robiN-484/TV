import React, { useState } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import RoomCreation from './components/RoomCreation';
import WatchParty from './components/WatchParty';

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  
  const handleRoomCreated = (room) => {
    setCurrentRoom(room);
  };
  
  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              currentRoom ? (
                <WatchParty room={currentRoom} onLeaveRoom={handleLeaveRoom} />
              ) : (
                <RoomCreation onRoomCreated={handleRoomCreated} />
              )
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;