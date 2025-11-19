import axios from 'axios';
import config from '../../config';
import React, { useEffect, useState } from 'react';

function Staffdetail() {
  const [details, setDetails] = useState([]);
  const staffId = sessionStorage.getItem("staff_id"); // Retrieve staff_id from session storage

  useEffect(() => {
    // Fetch attendance details
    axios.get(`${config.apiURL}/staffs/getattenancedetails/${staffId}`)
      .then((res) => {
        setDetails(res.data); // Set details from response data
      })
      .catch((err) => {
        console.log(err);
      });
  }, [staffId]);

  // Function to format date and time as "YYYY-MM-DD HH:MM:SS"
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'});
  };

  return (
    <div>
      <h1>Staff Detail</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: 'black' }}>
            <th style={tableHeaderStyle}>S.No</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Entry Time</th>
            <th style={tableHeaderStyle}>Exit Time</th>
            <th style={tableHeaderStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {details.map((data, index) => (
            <tr key={data.attendance_id} style={{ border: '1px solid #ddd' }}>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>{data.statusn}</td>
              <td style={tableCellStyle}>{formatDateTime(data.entry_at)}</td>
              <td style={tableCellStyle}>{formatDateTime(data.exit_at)}</td>
              <td style={tableCellStyle}>{formatDate(data.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Inline styles for table header and cell
const tableHeaderStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  color: 'white',
};

const tableCellStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  backgroundColor: 'white',
};

export default Staffdetail;
