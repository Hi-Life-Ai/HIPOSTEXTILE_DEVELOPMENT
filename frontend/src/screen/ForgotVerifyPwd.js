import React, { useEffect, useContext } from 'react';
import { Box, Typography, Button,  FormControl, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Container } from '@mui/system';
import Forgotlogo from '../assets/images/mainlogo.png';
import { loginforgot } from './Loginstyle';
import { FaEyeSlash } from "react-icons/fa";
import Footer from '../components/footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import './Signin.css';
import axios from 'axios';
import { AuthContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import { AUTH } from '../services/Authservice'

const ForgotVerifyPwd = () => {

    const { auth, setAuth, forgotAuth, setForgotAuth } = useContext(AuthContext);

    useEffect(
        () => {
          document.body.classList.add('signinbackground');
          return () => {
            document.body.classList.remove('signinbackground');
          }
        }, []
      );

    const backPage = useNavigate();

    const fetchHandler = async () => {
        try {
        const response = await axios.post(`${AUTH.LOGIN}`,{
            email: String(forgotAuth.email),
            password: String(forgotAuth.password)
        });
        //change loin state
        setAuth({...auth, loginState: true});
        backPage('/dashboard');
        setForgotAuth(response);
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
                backPage('/forgetverifypwd');
            }else{
                toast.error("Something went wrong!")
            }
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if(forgotAuth.password === ""){
            toast.warning("Enter your password");
        }else{
            fetchHandler();
        }
    }

  return (
    <>
     <Container maxWidth="sm" sx={loginforgot.container}>
        <Box>
            <form onSubmit={handleSubmit}>
                <img src={Forgotlogo} alt="HILIFE.AI LOGO" /><br />
                <Typography variant="h5">Authentication</Typography><br /><br />
                <Container>
                    <FormControl variant="outlined" fullWidth sx={{ maxWidth: '90%' }}>
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
                    </FormControl><br /><br />
                    <Typography variant="h6">Forgot Password</Typography><br />
                    <Container>
                    <Typography variant="subtitle1" sx={{ textAlign: 'justify' }}>Enter the last password you remember with this HIPOS account. If it matches, you can continue to sign in.</Typography><br />
                    </Container>
                    <FormControl variant="outlined" fullWidth sx={{ maxWidth: '90%' }}>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            value={forgotAuth.password}
                            label=""
                            type="password"
                            onChange={(e) => setForgotAuth({...forgotAuth, password: e.target.value})}
                        />
                    </FormControl><br /><br />
                    <Button variant="contained" type="submit" fullWidth sx={{ maxWidth: '90%',fontSize: '22px', backgroundColor: '#159AFF !important', }}>VERIFY THE PASSWORD</Button><br /><br />
                    <Typography variant="subtitle1"><span  style={{textDecoration:'none'}}><Link to="/forgetotp" style={{ color: 'rgb(33, 150, 243)', textDecoration: 'none', fontSize: '20px', fontWeight: 'bolder',  }}>Continue to reset password</Link></span></Typography><br /><br />
                </Container>
            </form>
        </Box>
    </Container><br /><br />
    <Footer />
    </>
  )
}

export default ForgotVerifyPwd;