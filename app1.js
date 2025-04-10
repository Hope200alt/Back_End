import React, { useState, useEffect } from 'react';
import './App.css';

import Greeting from './Greetings';
import CryptoJS from 'crypto-js';

function App() {
  const [name, setName] = useState("");
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    const encryptedName = localStorage.getItem("userName");
    if (encryptedName && secretKey) {
      try {
        const decryptedName = CryptoJS.AES.decrypt(encryptedName, secretKey).toString(CryptoJS.enc.Utf8);
        setName(decryptedName);
      } catch {
        console.error("Decryption failed. Please check your secret key.");
      }
    }
  }, [secretKey]);

  const handleInputChange = (event) => {
    const newName = event.target.value;
    setName(newName);

    if (secretKey) {
      const encryptedName = CryptoJS.AES.encrypt(newName, secretKey).toString();
      localStorage.setItem("userName", encryptedName);
    } else {
      console.error("Secret key is missing. Unable to encrypt the name.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, {name || "Reader"}!</h1>
        <h2>Welcome To Our Online Library.</h2>

        <Greeting name={name || "Reader"} />
        <label><h2>User_Name:</h2></label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleInputChange}
        />
        <label><h3>Password:</h3></label>
        <input
          type="text"
          placeholder="Enter your password"
          value={secretKey}
          onChange={(event) => setSecretKey(event.target.value)}
        />
        <button onClick={() => alert("Submitted!")}>Submit</button>
        <button onClick={() => setName("")}>Change Login Details</button>
      </header>
    </div>
  );
}

export default App;



