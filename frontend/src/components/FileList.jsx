import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FileList({ apiUrl }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`${apiUrl}listFiles`);
        setFiles(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFiles();
  }, [apiUrl]);

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Processed Files</h2>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {files.map((file) => (
          <li key={file.fileId} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            {file.thumbnailUrl && (
              <img
                src={file.thumbnailUrl}
                alt={file.fileId}
                width={100}
                style={{ marginRight: '10px', borderRadius: '4px', objectFit: 'cover' }}
              />
            )}
            <a href={file.processedFileUrl} target="_blank" rel="noopener noreferrer">
              {file.fileId}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}