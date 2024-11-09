import React, { useEffect, useRef } from 'react';
const JitsiOverlay = ({ roomName, displayName }) => {
  const jitsiContainerRef = useRef(null);
  useEffect(() => {
    if (typeof window.JitsiMeetExternalAPI !== 'function') {
      console.error('JitsiMeetExternalAPI is not loaded.');
      return;
    }
    console.log('JitsiMeetExternalAPI loaded successfully.');
  
    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      configOverwrite: { startWithAudioMuted: true },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'chat' , 'hangup'],
      },
      userInfo: { displayName: displayName },
    };
  
    const api = new window.JitsiMeetExternalAPI(domain, options);
  
    return () => api.dispose();
  }, [roomName, displayName]);
  
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div style={{ position: 'absolute', zIndex: 10, width: '100%', height: '100%' }}>
        <div ref={jitsiContainerRef} style={{ height: '100%', width: '100%' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, background: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%' }}>
        {/* Overlay or background content goes here */}
      </div>
    </div>
  );
};
export default JitsiOverlay;

