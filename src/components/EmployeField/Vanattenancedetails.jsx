import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { useParams } from 'react-router';

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  

function Vanattenancedetails() {
    const { staff_id } = useParams();
    const [vanattentdetail, setVanattentdetail] = useState([]);

    useEffect(() => {
        axios.get(`${config.apiURL}/students/vanattenancedetails/${staff_id}`)
            .then((res) => {
                setVanattentdetail(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [staff_id, config.apiURL]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th style={styles.tableHeader}>s.no</th>
                        <th style={styles.tableHeader}>Student Name</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {vanattentdetail.map((data, index) => (
                        <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                            <td style={styles.tableCell}>{index + 1}</td>
                            <td style={styles.tableCell}>{data.stu_name}</td>
                            <td style={styles.tableCell}>{data.statusn}</td>
                            <td style={styles.tableCell}>{formatDate(data.thatdate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// CSS-like styles object for table cells and rows
const styles = {
    tableHeader: {
        padding: '10px',
        textAlign: 'center',
        border: '1px solid #ddd',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: '10px',
        textAlign: 'center',
        border: '1px solid #ddd',
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#ffffff',
    },
};

export default Vanattenancedetails;
