import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import config from '../../config';

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await Axios.post(`${config.apiURL}/upload/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setData(response.data);
    } catch (err) {
      setError('Error uploading file');
      console.error(err);
    }
  };

  return (
    <div>
      <Grid container spacing={3} className="p-4">
        <div className="upload-wrapper">
          <h3>Upload & View Excel Sheets</h3>
          <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>
      </Grid>
    </div>
  );
}

export default UploadExcel;
