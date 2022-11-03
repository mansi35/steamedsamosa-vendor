import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withSnackbar } from 'notistack';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import CouponBackground from '../../assets/CouponBackground.svg';
import { createCoupon } from '../../actions/coupons';
import './CouponsPage.scss';

function CouponsPage({ enqueueSnackbar }) {
  const { coupons } = useSelector((state) => state.coupons);
  const user = JSON.parse(localStorage.getItem('profile'))?.user;
  const [couponValue, setCouponValue] = useState('');
  const [isCouponGenerated, setIsCouponGenerated] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [coupon, setCoupon] = useState({ couponCode: '', couponValue: '' });
  const dispatch = useDispatch();
  const textAreaRef = useRef(null);

  const handleGenerateCoupon = () => {
    let characterList = '';
    characterList += characters;
    const code = generateCoupon(characterList);
    setCoupon({ couponCode: code, couponValue: couponValue });
    setIsCouponGenerated(true);
    dispatch(createCoupon({ couponCode: code, couponValue: couponValue, mhp: user.id }));
  };

  const generateCoupon = (characterList) => {
    let coupon = '';
    const characterListLength = characterList.length;

    for (let i = 0; i < 10; i += 1) {
      const characterIndex = Math.round(Math.random() * characterListLength);
      coupon += characterList.charAt(characterIndex);
    }
    return coupon;
  };

  const CopyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setIsLinkCopied(true);
    enqueueSnackbar('Coupon code copied to clipboard!', { variant: 'success' });
  };

  const pastCopyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    enqueueSnackbar('Coupon code copied to clipboard!', { variant: 'success' });
  };

  return (
    <div className="coupons">
      <h1>Generate coupons,</h1>
      <h2>Generate coupon code for desired amount of discount.</h2>
      <div className="steps">
        <div className="step">
          <LooksOneIcon style={{ color: '#AB70CA', fontSize: '30px' }} />
          <p>Enter discount percentage, you want to provide.</p>
        </div>
        <div className="coupon__verticalLine" style={!isCouponGenerated ? { backgroundColor: 'grey' } : { backgroundColor: '#AB70CA' }} />
        <div className="step">
          <LooksTwoRoundedIcon style={!isCouponGenerated ? { color: 'grey', fontSize: '30px' } : { color: '#AB70CA', fontSize: '30px' }} />
          <p>Click on generate coupon, to generate a unique code.</p>
        </div>
        <div className="coupon__verticalLine" style={!isLinkCopied ? { backgroundColor: 'grey' } : { backgroundColor: '#AB70CA' }} />
        <div className="step">
          <Looks3RoundedIcon style={!isLinkCopied ? { color: 'grey', fontSize: '30px' } : { color: '#AB70CA', fontSize: '30px' }} />
          <p>Done! share the coupon with your client.</p>
        </div>
      </div>
      <div className="coupon">
        <img src={CouponBackground} alt="coupons" width="520px" />
        <form>
          {!isCouponGenerated ? <label>Discount Percentage</label> : (
            <label style={{ fontSize: '25px' }}>
              {couponValue}
              % OFF
            </label>
          )}
          <br />
          {!isCouponGenerated ? <input type="Number" placeholder="Eg.  20%" value={couponValue} onChange={(e) => setCouponValue(e.target.value)} /> : (
            <div className="code">
              <p style={{ fontSize: '14px', color: '#898989', marginLeft: '5px' }}>Coupon Code :</p>
              <input ref={textAreaRef} value={coupon.couponCode} style={{ fontSize: '14px', border: 'none', background: '#FDF9FA', marginLeft: '2px', color: '#AB70CA' }} contentEditable={false} readOnly />
            </div>
          )}
          <br />
          {!isCouponGenerated ? <button disabled={!couponValue} onClick={handleGenerateCoupon}>Generate Coupon</button> : <button onClick={CopyToClipboard} style={{ marginTop: '0' }} type="button">Share Coupon</button>}
        </form>
      </div>
      <div className="pastCoupons">
        <h1>Your past coupons</h1>
        <div className="past">
          {coupons.map((coupon, i) => {
            return (
              <div key={i} className="coupon">
                <img src={CouponBackground} alt="coupons" width="520px" />
                <form>
                  <label style={{ fontSize: '25px' }}>
                    {coupon.couponValue}
                    % OFF
                  </label>
                  <div className="code">
                    <p style={{ fontSize: '14px', color: '#898989', marginLeft: '5px' }}>Coupon Code :</p>
                    <input ref={textAreaRef} value={coupon.couponCode} style={{ fontSize: '14px', border: 'none', background: '#FDF9FA', marginLeft: '2px', color: '#AB70CA' }} contentEditable={false} readOnly />
                  </div>
                  <button onClick={pastCopyToClipboard} style={{ marginTop: '0' }}>Share Coupon</button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default withSnackbar(CouponsPage);
