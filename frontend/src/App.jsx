import React, { useState } from 'react';
import Login from './components/Login.jsx';
import FileUpload from './components/FileUpload.jsx';
import FileList from './components/FileList.jsx';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>LamVault</h1>
      {!loggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <>
          <FileUpload apiUrl={apiUrl} />
          <FileList apiUrl={apiUrl} />
        </>
      )}
    </div>
  );
}