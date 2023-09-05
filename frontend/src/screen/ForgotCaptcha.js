import React, { useEffect, useContext } from 'react';
import { Box, Grid, Typography, Button, FormControl, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Container } from '@mui/system';
import Forgotlogo from '../assets/images/mainlogo.png';
import { loginforgot } from './Loginstyle';
import Footer from '../components/footer/Footer';
import { Link } from 'react-router-dom';
import './Signin.css';
import Captcha from './Captcha';
import { AuthContext } from '../context/Appcontext';


const ForgotCaptcha = () => {

  const { forgotAuth, setForgotAuth } = useContext(AuthContext);

  useEffect(
    () => {
      document.body.classList.add('signinbackground');
      return () => {
        document.body.classList.remove('signinbackground');
      }
    }, []
     );

  return (
    <>
    <Container maxWidth="sm" sx={loginforgot.container}>
        <Box >
          <img src={Forgotlogo} alt="HILIFE.AI LOGO" /><br />
          <Typography variant="h5">Authentication</Typography><br /><br />
          <Container>
            <FormControl variant="outlined"  fullWidth sx={{ maxWidth: '90%' }}>
              <OutlinedInput
                id="outlined-adornment-password"
                value={forgotAuth.email}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <Typography><Link to="/forgetpwd" style={{ color: 'rgb(33, 150, 243)', textDecoration: 'none', fontWeight: 'bolder', fontFamily: 'revert'}}>Change</Link></Typography>
                    </IconButton>
                  </InputAdornment>
                }
                label=""
              />
            </FormControl><br /><br/>
            <Typography variant="h6">Forgot Password</Typography><br />
            {/* Verify captcha start */} 
            <Box sx={{textAlign:'center' }}>
              <Grid container>
                <Grid item xs={2} sm={2} md={2} lg={2}></Grid>
                <Grid xs={8} sm={8} md={8} lg={8}><Captcha /></Grid>
                <Grid xs={2} sm={2} md={2} lg={2}></Grid>
              </Grid>
            </Box>
            {/* <Grid container>
                <Captcha />
            </Grid> */}
            {/* Verify captcha end */}<br />
            <Link to="/forgetverifypwd" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bolder', textTransform: 'capitalize' }}><Button variant="contained" fullWidth sx={{ maxWidth: '90%',fontSize: '22px', backgroundColor: '#159AFF !important', }}>Next</Button></Link><br /><br />
          </Container>
        </Box>
      </Container><br /><br />
    <Footer />
    </>
  )
}

export default ForgotCaptcha;