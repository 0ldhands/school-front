import React, { useEffect, useState } from "react";
import "./payfees.css";
import axios from "axios";
import config from "../../config";
import { useNavigate, useParams } from "react-router";
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import CancelIcon from '@mui/icons-material/Cancel';


function SchemeFeeCollectionForm() {
  const { stu_id } = useParams();
  const [payfee, setPayfee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${config.apiURL}/feeAllocation/payfeestud/${stu_id}`)
      .then((res) => {
        setPayfee(res.data);
        console.log("fees data", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [stu_id]);

  const [formData, setFormData] = useState({
    payingfee: "",
    feedate: new Date().toISOString().slice(0, 10),
    paymentMethod: "Cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "payingfee" ? parseFloat(value) : value,
    }));
  };

  // Calculate remaining fees based on total fees (van) and the sum of already paid fees (vanpayFees) and current paying fee
  const calculateRemainingFees = (totalFees, paidFees) => {
    const updatedPaidFees = paidFees + (formData.payingfee || 0);
    const remainingFees = totalFees - updatedPaidFees;
    return remainingFees ;  // Ensure the remaining fee doesn't go negative
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { payingfee, feedate, paymentMethod } = formData;

    if (isNaN(payingfee) || payingfee <= 0) {
      alert("Invalid paying amount");
      return;
    }

    try {
      for (const data of payfee) {
        const remainingfee = calculateRemainingFees(data.scheme, data.schemepayFees);

        const formDataToSend = {
          stu_id: data.stu_id,
          stu_name: data.stu_name,
          payingfee,
          remainingfee,
          feedate,
          payment_method: paymentMethod,
        };

        console.log(formDataToSend);
        const response = await axios.post(`${config.apiURL}/feeAllocation/schemefeeslogdata`, formDataToSend);

        if (response.status === 201) {
          const { feeslogid } = response.data;
          navigate(`/schemeinvoice/${feeslogid}`);
        } else {
          alert("Failed to submit fees data");
        }
      }
    } catch (err) {
      console.error("Error saving fees data:", err);
      alert("Failed to submit fees data");
    }
  };

  return (
    <div className="fee-collection">
      <h2>Scheme Fee Collection</h2>

      {payfee.map((data) => (
        <form onSubmit={handleSubmit} key={data.stu_id}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={data.stu_name} readOnly />
          </div>
          <div className="form-group">
            <label>Class</label>
            <input type="text" value={data.cls_name} readOnly />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="feedate"
              value={formData.feedate}
              onChange={handleChange}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Particulars</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Scheme fees</td>
                <td><input type="text" value={data.scheme} readOnly /></td>
              </tr>
              <tr>
                <td></td>
                <td><span style={{color:data.scheme <= 0? 'green':'red '}}>Remaining Fees</span></td>
                <td>
                <div style={{position:'relative',display:'inline-block'}}> 
                  <input
                    type="number"
                    value={calculateRemainingFees(data.scheme, data.schemepayFees)}
                    style={{color:data.scheme <= 0 ? 'green':'red '}}
                    readOnly
                  />
                  {data.scheme <= 0 ?(<CheckCircleOutlineSharpIcon
                        style={{
                          position: 'absolute',
                          right: '-10px', // Position it at the right of the input field
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'green',
                        }}
                      />
                    ) : <CancelIcon
                      style={{
                        position: 'absolute',
                        right: '-10px', // Position it at the right of the input field
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'red',
                      }}
                      />
                    }
                      
                  </div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Paying amount</td>
                <td>
                  <input
                    type="number"
                    name="payingfee"
                    value={formData.payingfee}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <button type="submit" style={{display:calculateRemainingFees(data.scheme, data.schemepayFees) >=0 ? 'inline-block' : 'none'}} >Submit</button>
        </form>
      ))}
    </div>
  );
}

export default SchemeFeeCollectionForm;
