import React, { useState } from 'react';
import axios from 'axios';

export default function FileUpload({ apiUrl }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const { data } = await axios.post(`${apiUrl}getPresignedUrl`, { fileName: file.name });
      const { uploadUrl } = data;

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      alert('Upload complete!');
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert('Upload failed!');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={!file} style={{ marginLeft: '10px' }}>Upload</button>
      {progress > 0 && (
        <div>
          <progress value={progress} max="100" /> {progress}%
        </div>
      )}
    </div>
  );
}