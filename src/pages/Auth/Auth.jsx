import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { withSnackbar } from 'notistack';
import { Box, CircularProgress } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { signin, signup } from '../../actions/auth';
import { forgotPassword, sendEmailVerification } from '../../api';
import './Auth.scss';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

function Auth({ enqueueSnackbar }) {
  const user = JSON.parse(localStorage.getItem('profile'))?.user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState({ display: 'none' });
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPass, setForgotPass] = useState('Forgot password?');
  const [formData, setFormData] = useState(initialState);
  const [formText, setFormText] = useState({
    btn: 'Login',
    welcome: 'Sign In to Continue !',
    spanMain: 'Don\'t have an account? ',
    spanLink: 'Sign Up',
  });

  const switchMode = () => {
    if (!isSignup) {
      setFormText({
        btn: 'Register',
        welcome: 'Fill details to Continue!',
        spanMain: 'Already have an account? ',
        spanLink: 'Sign In',
      });
    } else {
      setFormText({
        btn: 'Login',
        welcome: 'Sign In to Continue!',
        spanMain: 'Don\'t have an account? ',
        spanLink: 'Sign Up',
      });
    }
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleShowConfirmPassword = () => setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      handleSignUp(e);
    } else {
      handleSignIn(e);
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading({ display: 'inline' });
    dispatch(signin({ identifier: formData.email, password: formData.password }))
      .then((response) => {
        setLoading({ display: 'none' });
        setFormData(initialState);
        if (response === 'Your account email is not confirmed') {
          enqueueSnackbar('Please verify your email first and then sign in!', { variant: 'error' });
        } else if (response === 'Identifier or password invalid.') {
          enqueueSnackbar('Wrong Email or Password. Please try again!', { variant: 'error' });
        } else if (response === 'regular users not allowed') {
          enqueueSnackbar('You are not a MHP. Please head over to raahee.in', { variant: 'error' });
        } else {
          enqueueSnackbar('Login Successful!', { variant: 'success' });
          if (response.user.email === 'admin@raahee.app') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading({ display: 'inline' });
    const {
      firstName, lastName, email, password, confirmPassword,
    } = formData;

    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords don\'t match. Please try again!', { variant: 'error' });
      return;
    }

    try {
      dispatch(signup({ username: email, firstName, lastName, displayName: firstName + ' ' + lastName, email, password, userType: 'MHP' }))
        .then((res) => {
          console.log(res);
          setLoading({ display: 'none' });
          if (res === 'Email is already taken.') {
            enqueueSnackbar('You have already registered. Please try signing in.', { variant: 'error' });
          } else {
            enqueueSnackbar('Registration Successfull! Please verify your email first and then login.', { variant: 'success' });
          }
        })
        .catch((error) => alert(error.message));

      setFormData(initialState);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgetPass = () => {
    if (formData.email === '') {
      setForgotPass('Enter the Email in field');
    } else {
      forgotPassword(formData.email)
        .then((response) => {
          console.log('Your user received an email', response);
          setForgotPass('Password Reset Email Sent.');
          enqueueSnackbar('Please check your email for password reset instructions', { variant: 'success' });
        })
        .catch((error) => console.log(error));
    }
    setTimeout(() => {
      setForgotPass('Forgot your password?');
    }, 4000);
  };

  const verifyEmail = () => {
    if (!user.confirmed) {
      sendEmailVerification(user.email).then(() => {
        enqueueSnackbar('Check your email for the link!', { variant: 'success' });
      }).catch((err) => {
        console.error(err);
      });
    } else {
      enqueueSnackbar('Email Already Verified!', { variant: 'error' });
    }
  };

  return (
    <div className="auth">
      {user && !user.confirmed && (
        <div className="emailWarning">
          <b>
            To get access to all the featues of the MHP Portal, please verify
            {' '}
            <span role="button" style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => verifyEmail()}>your email</span>
            {' '}
            and then Sign In.
          </b>
        </div>
      )}
      <div className="auth-div">
        <div className="welcome-div">
          <p className="welcome-p">Welcome,</p>
          <p>
            Login to continue or get
            <br />
            yourself an account by
            <br />
            signing up.
          </p>
        </div>
        <div className="form-div">
          <div className="welcome-div-mobile">
            Welcome,
            <p>{formText.welcome}</p>
          </div>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="name-div">
                <div>
                  <label htmlFor="firstName">First name</label>
                  <br />
                  <input onChange={handleChange} value={formData.firstName} type="text" id="firstName" name="firstName" placeholder="John" />
                </div>
                <div>
                  <label htmlFor="lastName">Last name</label>
                  <br />
                  <input onChange={handleChange} value={formData.lastName} type="text" id="lastName" name="lastName" placeholder="Doe" />
                </div>
              </div>
            )}
            <label htmlFor="email">Email Id</label>
            <br />
            <input onChange={handleChange} value={formData.email} type="email" id="email" name="email" placeholder="xyz@gmail.com" />
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <div className="password-div">
              <input onChange={handleChange} value={formData.password} type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="********" />
              {showPassword && <VisibilityOutlinedIcon className="visible-icons" onClick={handleShowPassword} />}
              {!showPassword && <VisibilityOffOutlinedIcon className="visible-icons" onClick={handleShowPassword} />}
            </div>
            <br />
            {!isSignup && (<p className="forgot-password" onClick={handleForgetPass}>{forgotPass}</p>)}
            {isSignup && (
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <br />
                <div className="password-div">
                  <input onChange={handleChange} value={formData.confirmPassword} type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" placeholder="********" />
                  {showConfirmPassword && <VisibilityOutlinedIcon className="visible-icons" onClick={handleShowConfirmPassword} />}
                  {!showConfirmPassword && <VisibilityOffOutlinedIcon className="visible-icons" onClick={handleShowConfirmPassword} />}
                </div>
                <br />
              </div>
            )}
            <div className="text-n-btn-div">
              <p className="signin-up-text" id={isSignup ? 'signup' : 'signin'}>
                {formText.spanMain}
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <span className="signin-up-click" onClick={switchMode}>{' ' + formText.spanLink}</span>
              </p>
              <button className="btn-submit">
                {formText.btn}
                <Box sx={loading}>
                  <CircularProgress style={{ color: '#FFFFFF' }} />
                </Box>
              </button>
            </div>
          </form>
          {/* !isSignup && (
            <div className="google-div">
              <div className="hr-div">
                <hr />
                <span>or</span>
                <hr />
              </div>
              <button className="google-btn">
                <a href="https://raahee-server.eastus.cloudapp.azure.com/connect/google" style={{ textDecoration: 'none' }}>
                  <img src={GoogleIcon} alt="google-icon" />
                  Continue with Google
                </a>
              </button>
            </div>
          ) */}
          <p className="signin-up-text-mobile">
            {formText.spanMain}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <span className="signin-up-click" onClick={switchMode}>{' ' + formText.spanLink}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default withSnackbar(Auth);
