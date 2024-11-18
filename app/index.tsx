import React, { useState } from 'react';
import WelcomeScreen from './welcome'; // Import the Welcome Screen
import { Tabs } from 'expo-router'; // Import the Tabs

export default function AppIndex() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state

  return (
    isLoggedIn ? (
      <Tabs /> // Show the Tabs for logged-in users
    ) : (
      <WelcomeScreen onSignIn={() => setIsLoggedIn(true)} /> // Show WelcomeScreen
    )
  );
}
