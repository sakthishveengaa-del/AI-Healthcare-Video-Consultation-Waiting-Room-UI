import React, { useState } from 'react'
import WaitingRoom from './components/WaitingRoom'
import VideoConsultation from './components/VideoConsultation'

function App() {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  
  const patient = { name: "Karthi M", age: 28, id: "APP-92834", type: "Cardio Follow-up" };
  const doctor = { name: "Dr. Sathish S", specialty: "Interventional Cardiologist", time: "10:30 AM" };

  return (
    <div className="App">
      {!inCall ? (
        <WaitingRoom 
          onJoin={() => setInCall(true)} 
          initialMic={micOn}
          initialVideo={videoOn}
          onSettingsChange={(m, v) => { setMicOn(m); setVideoOn(v); }}
        />
      ) : (
        <VideoConsultation 
          patient={patient} 
          doctor={doctor} 
          onLeave={() => setInCall(false)} 
          initialMic={micOn}
          initialVideo={videoOn}
        />
      )}
    </div>
  );
}

export default App
