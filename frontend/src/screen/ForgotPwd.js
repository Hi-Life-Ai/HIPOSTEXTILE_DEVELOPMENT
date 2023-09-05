import React, { useEffect, useContext }  from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { Container } from '@mui/system';
import Forgotlogo from '../assets/images/mainlogo.png';
import { loginforgot } from './Loginstyle';
import './Signin.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import { AuthContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPwd = () => {

  const { forgotAuth, setForgotAuth } = useContext(AuthContext);
 
  const backPage = useNavigate();

  useEffect(
    () => {
      document.body.classList.add('signinbackground');
      return () => {
        document.body.classList.remove('signinbackground');
      }
    }, []
  );

  const handleForgot = () => {
     
    if(forgotAuth.email === ""){
      toast.warning("Enter your email address");
    }else{
      backPage('/forgetcaptcha');
    }

  }

  return (
    <>
    <Container maxWidth="sm" sx={loginforgot.container}>
      <Box >
        <Grid >
          <img src={ Forgotlogo } alt="HILIFE.AI LOGO" /><br /><br/>
          <Typography variant="h5">Forgot Password</Typography><br />
          <Container>
          <Typography variant="subtitle1" sx={{ textAlign: 'justify'}}>Enter your registered email address, mobile number, or username to change your HIPOS account password. </Typography>
          </Container><br/>
          <TextField fullWidth 
            id="outlined-basic" 
            value={forgotAuth.email}
            label="Email address or Mobile Number" 
            variant="outlined" 
            type="email"
            onChange={(e) => setForgotAuth({...forgotAuth, email: e.target.value})}
            sx={{ maxWidth: '90%'}} 
          /><br /><br />
          <Button variant="contained" onClick={handleForgot} fullWidth sx={{ maxWidth: '90%',fontSize: '22px', backgroundColor: '#159AFF !important',}}>Next</Button>
        </Grid>
      </Box>
    </Container><br /><br />
    <Footer />
    </>
  )
}

export default ForgotPwd;