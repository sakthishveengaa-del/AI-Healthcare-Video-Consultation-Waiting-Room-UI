// v1.0.1 - Refactored Structure
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CallProvider } from './context/CallContext'
import NewWaitingRoom from './WaitingRoom/jsx/NewWaitingRoom'
import VideoCall from './VideoCall/jsx/VideoCall'
import './WaitingRoom/css/WaitingRoom.css'
import './VideoCall/css/VideoCall.css'


function App() {
  return (
    <CallProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<NewWaitingRoom />} />
            <Route path="/consultation" element={<VideoCall />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CallProvider>
  )
}

export default App


