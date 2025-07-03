// src/App.js

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth

const firebaseConfig = {
  apiKey: "AIzaSyCgpGMBNGohDrCxa1MCsNHKqoaWMAb1sD8",
  authDomain: "talkbox-23c25.firebaseapp.com",
  databaseURL: "https://talkbox-23c25-default-rtdb.firebaseio.com",
  projectId: "talkbox-23c25",
  storageBucket: "talkbox-23c25.appspot.com",
  messagingSenderId: "83481544518",
  appId: "1:83481544518:web:17dd8571c7612851c28747",
  measurementId: "G-JTKB93HFP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); // Initialize Firebase Auth

// --- HARDCODED CREDENTIALS (FOR DEMONSTRATION ONLY - SECURITY RISK!) ---
const FIREBASE_USER_EMAIL = "tnmesserges@gmail.com";
const FIREBASE_USER_PASS = "Messerges";
// --- END HARDCODED CREDENTIALS ---

export default function App() {
  const [message, setMessage] = useState('');
  const [boardId, setBoardId] = useState('board1'); // Changed default to 'board1' to match ESP32
  const [status, setStatus] = useState('Initializing...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authenticate user when component mounts
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        setStatus('Attempting to sign in...');
        await signInWithEmailAndPassword(auth, FIREBASE_USER_EMAIL, FIREBASE_USER_PASS);
        setIsAuthenticated(true);
        setStatus('Signed in successfully.');
        console.log('Firebase user signed in:', auth.currentUser.uid);
      } catch (error) {
        setIsAuthenticated(false);
        setStatus('Authentication failed. Check console for details.');
        console.error('Firebase Authentication Error:', error.message);
        // Common errors: "auth/user-not-found", "auth/wrong-password", "auth/invalid-email"
        // Ensure the email/password user exists in your Firebase Authentication section
      }
    };

    authenticateUser();
  }, []); // Empty dependency array means this runs once on mount

  const sendMessage = async () => {
    if (!message) {
      setStatus('Message cannot be empty.');
      return;
    }
    if (!isAuthenticated) {
      setStatus('Not authenticated. Please wait or check authentication status.');
      return;
    }

    try {
      const messageRef = ref(db, `messages/${boardId}`);
      await set(messageRef, message);

      setStatus(`Message sent to ${boardId}!`);
      setMessage('');
    } catch (error) {
      setStatus('Error sending message');
      console.error('Firebase Write Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Send Message to ESP32</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <p className={`text-sm mb-4 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
          Auth Status: {status}
        </p>

        <label className="block mb-2">Select Board:</label>
        <select
          value={boardId}
          onChange={(e) => setBoardId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          {/* Changed value to 'board1' to match ESP32 code's MESSAGE_PATH */}
          <option value="board1">ESP32 Board 1 (board1)</option>
          <option value="box2">ESP32 Board 2 (box2)</option>
        </select>

        <label className="block mb-2">Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={!isAuthenticated} // Disable input if not authenticated
        />

        <button
          onClick={sendMessage}
          className={`px-4 py-2 rounded ${isAuthenticated ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-700'}`}
          disabled={!isAuthenticated} // Disable button if not authenticated
        >
          Send
        </button>

        {status && <p className="mt-4 text-blue-600">{status}</p>}
      </div>
    </div>
  );
}