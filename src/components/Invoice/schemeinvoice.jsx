
import React, { useEffect, useState } from 'react';
import './Invoice.css';
import logo from '../../assets/images/icons/logo.png';
import moment from 'moment';
import axios from 'axios';
import config from '../../config';
import { useParams } from 'react-router';
import { color } from 'framer-motion';

function SchemeInvoice() {
  const { feeslogid } = useParams();
  const [feesslip, setFeesslip] = useState(null); // Initialize as null

  useEffect(() => {
    axios.get(`${config.apiURL}/feeAllocation/schemefeesslipprint/${feeslogid}`)
      .then((res) => {
        setFeesslip(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [feeslogid]);

  const handlePrint = () => {
    window.print();
  };

  if (!feesslip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="invoice">
      <div className="invoice-container">
        <header className="invoice-header">
          <div className="school-logo">
            <img src={logo} alt="School Logo" />
          </div>
          <div className="school-details">
            <h2>DREAM PUBLIC SCHOOL</h2>
            <p><strong>CBSE | AFFILIATION NO:</strong> 1931494</p>
            <p>Palani Aandavar nagar, Guruvayurappan nagar</p>
            <p>South, Poyampalayam, Trippur, Tamilnadu-641666</p>
            <p>Phone No: 7200 077 747</p>
          </div>
          <div className="receipt-details">
            <p>Receipt Date: {moment().format("YYYY-MM-DD")}</p>
            <p>Student Name: {feesslip.stu_name}</p>
            <p>Class: {feesslip.cls_name}</p>
            <p>Student Id: {feesslip.stu_id}</p>
          </div>
        </header>

        <table className="invoice-table" >
          <thead>
            <tr >
              <th>ITEM #</th>
              <th>ITEM DESCRIPTION</th>
              <th>Method</th>
              <th>PAID AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Scheme Fees</td>
              <td>{feesslip.payment_method}</td>
              <td>{Number(feesslip.schemepayingfee).toFixed(2)}</td>
            </tr>
            {/* You can add more rows as needed */}
          </tbody>
        </table>

        <footer>
          <p>This is a computer-generated receipt and does not require a signature.</p>
        </footer>
      </div>
      <div className="print-button">
        <button onClick={handlePrint}>Print</button>
      </div>
    </div>
  );
}

export default SchemeInvoice;
