import React, { useState, useEffect } from 'react';
import './WalletPage.scss';

function WalletPage() {
  const [transactions, setTransactions] = useState([['']]);

  useEffect(() => {
    setTransactions([['02 Oct 2022', 'Aditi Tiwari', '03 Oct 2022', '03 Oct 2022', 'Rs. 8000', 'Settled'], ['19 Sept 2022', 'Shruthi Rao', '20 Oct 2022', '20 Oct 2022', 'Rs. 5000', 'Settled'], ['03 Mar 2022', 'Mansi Sharma', '05 Mar 2022', '05 Mar 2022', 'Rs. 18000', 'Pending'], ['27 Mar 2022', 'Sukriti Dawar', '29 Jan 2022', '29 Jan 2022', 'Rs. 7600', 'Settled'], ['02 Jan 2022', 'Amar Singh', '06 Jan 2022', '06 Jan 2022', 'Rs. 8000', 'Refunded'], ['24 Oct 2022', 'Vishal Sethi', '29 Oct 2022', '29 Oct 2022', 'Rs. 5500', 'Settled']]);
  });

  return (
    <div className="schedulePage">
      <div className="walletPage">
        <div className="transaction__heading">
          <div><p className="heading">My Transactions</p></div>
          <div className="balance">
            <div><p style={{ fontSize: '18px', fontWeight: 600 }}>Current Balance, </p></div>
            <div><p style={{ fontSize: '24px', fontWeight: 600 }}>Rs. 12000</p></div>
          </div>
        </div>
        <div><p style={{ fontSize: '18px', fontWeight: 600 }}>Here is the breakdown of the payments made by client, reimbursed by sTEAMedSaMoSA.</p></div>
        <div className="transactions">
          <table>
            <tbody>
              <tr>
                <th><strong>Date of payment</strong></th>
                <th><strong>Client name</strong></th>
                <th><strong>Date of session</strong></th>
                <th><strong>Date of reimbursement</strong></th>
                <th><strong>Reimburse amount</strong></th>
                <th><strong>Status</strong></th>
              </tr>
              {transactions && transactions.map(([date, name, dateOfSession, dateOfReimbursement, amount, status]) => (
                <tr>
                  <td>{date}</td>
                  <td>{name}</td>
                  <td>{dateOfSession}</td>
                  <td>{dateOfReimbursement}</td>
                  <td>{amount}</td>
                  <td style={{ color: status === 'Settled' ? '#6BD870' : status === 'Pending' ? '#E7E15B' : '#E76161' }}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
