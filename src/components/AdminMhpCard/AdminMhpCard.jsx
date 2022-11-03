import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMhp } from '../../actions/mhps';
import './AdminMhpCard.scss';

function AdminMhpCard({ mhp }) {
  const [isVerified, setIsVerified] = useState(mhp.verificationStage);
  const dispatch = useDispatch();
  const changeMHPStatus = () => {
    if (isVerified === 'verified') {
      dispatch(updateMhp(mhp.id, 'registered'));
      setIsVerified('registered');
    } else {
      dispatch(updateMhp(mhp.id, 'verified'));
      setIsVerified('verified');
    }
  };

  return (
    <div className="Admin">
      <div className="Admin__block-about">
        <h1>{mhp.displayName}</h1>
        <div className="Admin__block-email">
          <p>{mhp.email}</p>
        </div>
      </div>
      <div className="Admin_status">
        <button onClick={() => changeMHPStatus()}>{isVerified}</button>
      </div>
    </div>
  );
}
export default AdminMhpCard;
