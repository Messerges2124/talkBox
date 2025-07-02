// src/App.js

import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_FROM_FIREBASE', // <--- PASTE YOUR API KEY HERE
  authDomain: 'YOUR_AUTH_DOMAIN_FROM_FIREBASE', // <--- PASTE YOUR AUTH DOMAIN HERE
  projectId: 'YOUR_PROJECT_ID_FROM_FIREBASE', // <--- PASTE YOUR PROJECT ID HERE
  storageBucket: 'YOUR_STORAGE_BUCKET_FROM_FIREBASE', // <--- PASTE YOUR STORAGE BUCKET HERE
  messagingSenderId: 'YOUR_SENDER_ID_FROM_FIREBASE', // <--- PASTE YOUR SENDER ID HERE
  appId: 'YOUR_APP_ID_FROM_FIREBASE' // <--- PASTE YOUR APP ID HERE
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [message, setMessage] = useState('');
  const [boardId, setBoardId] = useState('esp1');
  const [status, setStatus] = useState('');

  const sendMessage = async () => {
    if (!message) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        recipient: boardId, // 'esp1', 'esp2', etc.
        timestamp: serverTimestamp()
      });
      setStatus('Message sent!');
      setMessage('');
    } catch (error) {
      setStatus('Error sending message');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Send Message to ESP32</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <label className="block mb-2">Select Board:</label>
        <select
          value={boardId}
          onChange={(e) => setBoardId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="esp1">ESP32 #1</option>
          <option value="esp2">ESP32 #2</option>
        </select>

        <label className="block mb-2">Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>

        {status && <p className="mt-4 text-green-600">{status}</p>}
      </div>
    </div>
  );
}