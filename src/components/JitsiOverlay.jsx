import React, { useEffect, useRef, useState } from 'react';

const JitsiOverlay = () => {
  const jitsiContainerRef = useRef(null);
  const [displayName, setDisplayName] = useState('');
  // Generate a random user name
  const generateRandomUserName = () => `user_${Math.random().toString(36).substring(7)}`;
  // Generate a random room name
  const generateRandomRoomName = () => `room_${Math.random().toString(36).substring(7)}`;
  useEffect(() => {
    // Create a random user name and assign it to the state
    const randomUserName = generateRandomUserName();
    setDisplayName(randomUserName);
    if (typeof window.JitsiMeetExternalAPI !== 'function') {
      console.error('JitsiMeetExternalAPI not loaded');
      return;
    }
    const domain = 'meet.jit.si';  // Jitsi Meet server
    const roomName = "Workspace1";
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,  // Render the Jitsi container inside the div
      configOverwrite: {
        prejoinPageEnabled: false, // Skip the prejoin page
        prejoinConfig: {
          enabled: false
        },
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        disableModeratorIndicator: true,
        disableInviteFunctions: true,
        enableLobby: false,  // Disable lobby
        roomLock: false,  // Ensure the room is not locked
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        // Remove the restriction on toolbar buttons to allow all default options
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'chat', 'hangup', 'raisehand', 'desktop', 'filmstrip', 'invite', 'profile', 'settings', 'security', 'fullScreen', 'tileview', 'download', 'etherpad', 'recording', 'liveStreaming', 'followme', 'videomute', 'audioMute', 'chat', 'kick', 'mute', 'endMeeting', 'shareVideo', 'shareDocument', 'participants'
        ],
        SHOW_JITSI_WATERMARK: false, 
        SHOW_BRAND_WATERMARK: false, 
        SHOW_WATERMARK_FOR_GUESTS: false, 
        SHOW_POWERED_BY: false
      },
      userInfo: { displayName: randomUserName }, // Set the generated random user name
    };
    // Initialize Jitsi API
    const api = new window.JitsiMeetExternalAPI(domain, options);
    // Event listener to track when the conference has started
    api.addEventListener('videoConferenceJoined', () => {
      console.log(`Conference has started! Moderator: ${randomUserName}`);
      // The first user to join is automatically the moderator
    });
    // Log when a participant joins
    api.addEventListener('participantJoined', (participant) => {
      console.log(`${participant.id} joined the conference`);
    });
    // Log when Jitsi is ready to close
    api.addEventListener('readyToClose', () => {
      console.log('Jitsi is ready to close');
    });
    // Debugging: Log the API instance and options to ensure the setup is correct
    console.log('Jitsi API initialized with room: ', roomName);
    console.log('Options:', options);
    // Cleanup on component unmount
    return () => {
      api.dispose();
      console.log('Jitsi API disposed');
    };
  }, []); // Only run once when component mounts
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div ref={jitsiContainerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default JitsiOverlay;