import { Grid, TextField, Typography, Button, Divider, Box, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Container } from '@mui/system';
import { FavoriteSharp } from '@mui/icons-material';
import React, { useEffect, useState, useContext } from 'react';
import logo from '../assets/images/mainlogo.png';
import { loginSignIn } from './Loginstyle';
import google from '../assets/images/icons/google.png';
import slack from '../assets/images/icons/slack.png';
import yahoo from '../assets/images/icons/yahoo.png';
import microsoft from '../assets/images/icons/microsoft.png';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaLinkedin, FaFacebook, FaApple } from 'react-icons/fa';
import './Signin.css';
import { BsThreeDots } from 'react-icons/bs';
import CarouselComponent from "./CarousalSignin";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';
import { AuthContext, UserRoleAccessContext } from '../context/Appcontext';
import { AUTH } from '../services/Authservice';
const Signin = () => {
  useEffect(
    () => {
      document.body.classList.add('signinbackground');
      return () => {
        document.body.classList.remove('signinbackground');
      }
    }, []
  );

  const [isActive, setActive] = useState("false");
  const handleToggle = () => {

    if (signin.email == "") {
      toast.warning("Enter your email address");
    } else {
      setActive(!isActive);
    }

  };

  const [hiddenCont, setHiddencont] = useState(true);
  const handleMorelogo = () => {
    setHiddencont(!hiddenCont);
  };

  const [fade, setFade] = useState(true);
  const [hidden, setHiiden] = useState(true);
  const [signin, setSignin] = useState({ email: "", password: "", });
  const { auth, setSetngs, setAuth } = useContext(AuthContext);
  const { setIsUserRoleAccess,setIsUserRoleCompare,setAllProducts,setAllLocations,setIsActiveLocations,setAllPurchases,setAllPos,setAllTaxrates,setAllTaxratesGroup } = useContext(UserRoleAccessContext);

  const triggerFade = () => {
    setFade(false);
    setHiiden(!hidden);
  };

  const responseGoogle = (response) => {
    return response
  }

  const backPage = useNavigate();

  const fetchHandler = async () => {
    try {
      const response = await axios.post(`${AUTH.LOGIN}`, {
        email: String(signin.email),
        password: String(signin.password)
      });
      if(response?.data?.user?.useractive == true){
        // set login data to local storage
      localStorage.setItem('APIToken', response.data.token);
      localStorage.setItem('LoginUserId', response.data.user._id)
      localStorage.setItem('LoginUseruniqid', response.data.user.userid)
      localStorage.setItem('LoginUserrole', response.data.user.role)
      localStorage.setItem('LoginUserlocation', response.data.user.businesslocation)
      localStorage.setItem('LoginUsersettings', response.data.user.assignbusinessid)
      
      const [
        loginuserdata,
        userroles,
        usersettings
      ] = await Promise.all([
        axios.get(`${AUTH.GETUSER}/${response.data.user._id}`),
        axios.post(AUTH.GETAUTHROLE,{
          userloginbusinessid:String(response.data.user.assignbusinessid),
          userrole:String(response.data.user.role)
        }),
        axios.post(AUTH.GETSINGLESETTINGS,{
          userloginbusinessid:String(response.data.user.assignbusinessid)
        }),
        
      ]);

      setIsUserRoleCompare(userroles?.data?.result);
      setIsUserRoleAccess(loginuserdata?.data?.suser);
      setSetngs(usersettings?.data?.result[0])
      //change login state
      setAuth({ ...auth, loginState: true, APIToken: response.data.token, loginuserid: response.data.user._id, loginuseruniqid: response.data.user.userid, loginuserlocation: response.data.user.businesslocation, loginusersettings: response.data.user.assignbusinessid, loginuserrole:response.data.user.role});
      backPage('/dashboard');
      //locations
      axios.post(AUTH.BUSINESS_LOCATION,{
        businessid:String(response?.data?.user?.assignbusinessid),
        role:String(response?.data?.user?.role),
        userassignedlocation:[response?.data?.user?.businesslocation]
      }).then((response)=>{
        setAllLocations(response?.data?.businesslocations);
      setIsActiveLocations(response?.data?.businesslocationsactive)
      })
      //products
      axios.post(AUTH.PRODUCT, {
        businessid:String(response?.data?.user?.assignbusinessid),
        role:String(response?.data?.user?.role),
        userassignedlocation:[response?.data?.user?.businesslocation]
      }).then((response)=>setAllProducts(response?.data?.products))
      
      //all tax
      axios.post(AUTH.TAXRATEGROUPHSN, {
        businessid:String(response?.data?.user?.assignbusinessid),
      }).then((response)=> setAllTaxrates(response?.data?.taxratesforgrouphsnfalse))
      //taxrate and taxrate group
      axios.post(AUTH.TAXRATEGROUPFALSE, {
        businessid:String(response.data.user.assignbusinessid),
      }).then((response) => setAllTaxratesGroup(response?.data?.taxratesgroupforgroupfalse))
      
      // setSignin(response);
      }else{
        toast.error("This user didn't has login access");
        backPage('/signin');
      }
    }
    catch (err) {
      const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
      backPage('/signin');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchHandler();
  }

  return (
    <>
      <Container maxWidth="md" sx={{ marginTop: '100px', boxShadow: '0px 0px 10px #d6d3d363', backgroundColor: 'white', '@media (max-width: 750px)': { boxShadow: 'none !important', marginTop: '0px' }, '@media (max-width: 1050px)': { maxWidth: 'md' } }}>
        <Grid container sx={{ marginBottom: '10px' }} className="signInContainer">
          <Grid item xs={12} sm={12} md={7} className="signInContainer">
            <Grid sx={{ textAlign: 'center', marginTop: '40px', }}>
              <img src={logo} alt="HILIFEAILOGO" />
            </Grid>

            <Grid>
              {hiddenCont ? <>

                <Grid sx={loginSignIn.container}>
                  <form onSubmit={handleSubmit}>
                    <Typography variant="h5" sx={loginSignIn.signInheadtxt} >Sign IN</Typography>
                    <Typography variant="h5" sx={loginSignIn.signInheadtxt}>to access HIPOS</Typography>
                    <TextField fullWidth
                      id="outlined-basic"
                      label="Email address or Mobile Number"
                      name="email"
                      variant="outlined" sx={{ maxWidth: '90%' }}
                      value={signin.email}
                      onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                    />

                    {/* PASSWORD CONTAINER START */}
                    <div className={fade ? 'fadedClass' : 'visibleClass'}>
                      <br />
                      <FormControl variant="outlined" fullWidth sx={{ maxWidth: '90%' }} >
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                          label="password *"
                          type="password"
                          name="password"
                          value={signin.password}
                          onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                        />
                      </FormControl>
                      <Button variant="contained" type="submit" sx={loginSignIn.signinBtn}>Signin</Button>
                      <Box sx={loginSignIn.otplinks}>
                        <Link to="/forgetotp" style={{ color: '#159AFF', textDecoration: 'none', textAlign: 'left', float: 'left' }} sx={loginSignIn.signInSendotp}>sign in using OTP</Link>
                        <Link to="/forgetpwd" style={{ color: '#159AFF', textDecoration: 'none', textAlign: 'right', float: 'right' }} sx={loginSignIn.signInForgptpassword}>Forgot Password?</Link>
                      </Box>
                    </div><br />
                  </form>
                  {/* PASSWORD CONTAINER END */}

                  {/* NEXT BUTTON START */}
                  <div className={!hidden ? "hiddenbtn" : "showbtn"}>
                    <Button variant="contained" onAnimationEnd={triggerFade} className={isActive ? "btncontainer" : "btncontainer active"} onClick={() => { handleToggle() }} style={{ maxWidth: '90%' }}>  <Typography className={isActive ? "text" : "text active"} style={{ fontWeight: 'bolder', fontSize: '20px' }}>Next</Typography> <Typography className={isActive ? "loader" : "loader active"}></Typography></Button><br />
                    <br /><Typography variant="subtitle1"><Link to="/forgetpwd" style={{ color: '#0b0b0b', textDecoration: 'none' }}>Forgot Password</Link></Typography>
                  </div><br />
                  {/* NEXT BUTTON END */}

                </Grid>

                <Divider /><br />
                {/* SOCIAL ICONS START */}
                <Grid container sx={loginSignIn.socialcontainer}>
                  <Box sx={loginSignIn.socialicons}>
                    <Box component="img" sx={loginSignIn.socialgoogle} alt="Google logo" src={google} />
                    {/* <Typography sx={loginSignIn.socialiconstxt}>Google</Typography> */}
                    <GoogleLogin
                      clientId="517438224490-cdrp1615c7jtmh2bb9orh31dvsiok6d8.apps.googleusercontent.com"

                      render={renderProps => (
                        <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>GOOGLE</Button>
                      )}
                      buttonText="Login"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                  </Box>
                  <Box sx={loginSignIn.micrsoftlogo}>
                    <Box component="img" sx={loginSignIn.socialmicrosoft} src={microsoft} alt="Microsoft Logo" /></Box>
                  <Box sx={loginSignIn.facebooklogo}>
                    <Box sx={loginSignIn.socialfacebook}><FaFacebookF></FaFacebookF></Box>
                  </Box>
                  <Box sx={loginSignIn.linkedinlogo}>
                    <Box sx={loginSignIn.sociallinkedin}><FaLinkedinIn></FaLinkedinIn></Box>
                  </Box>
                  <Box sx={loginSignIn.twitterlogo}>
                    <Box sx={loginSignIn.socialtwitter}><FaTwitter></FaTwitter></Box>
                  </Box>
                  <Box sx={loginSignIn.morelogo} onClick={() => { handleMorelogo() }}>
                    <Box sx={loginSignIn.socialmorelogo}><BsThreeDots></BsThreeDots></Box>
                  </Box><br />
                </Grid> </> :
                <Box sx={loginSignIn.moresocialiconcontainer} >
                  <Typography sx={loginSignIn.signInheadtxt}>Sign in using</Typography>
                  <Grid container>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialGooglebg}>
                        <Box component="img" sx={loginSignIn.socialgoogle} alt="Google logo" src={google} />
                        <Typography sx={loginSignIn.socialiconstxt}>Google</Typography>
                      </Box>
                    </Grid>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialMSbg}>
                        <Box component="img" sx={loginSignIn.socialgoogle} src={microsoft} alt="Microsoft Logo" />
                        <Typography sx={loginSignIn.moresocialiconstxt}> Microsoft</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialLINbg}>
                        <Typography sx={loginSignIn.moresocialiconstxt}>Linked</Typography>
                        <Box sx={loginSignIn.sociallinkedin}><FaLinkedin></FaLinkedin></Box>
                      </Box>
                    </Grid>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialFBbg}>
                        <Box sx={loginSignIn.socialfacebook}><FaFacebook></FaFacebook></Box>
                        <Typography sx={loginSignIn.moresocialiconstxt}>Facebook</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialTwitterbg}>
                        <Box sx={loginSignIn.socialtwitter}><FaTwitter></FaTwitter></Box>
                        <Typography sx={loginSignIn.moresocialiconstxt}>Twitter</Typography>
                      </Box>
                    </Grid>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialYahoobg}>
                        <Box component="img" sx={loginSignIn.socialyahoo} src={yahoo} alt="yahoo" />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialSlackbg}>
                        <Box component="img" sx={loginSignIn.socialgoogle} alt="Google logo" src={slack} />
                        <Typography sx={loginSignIn.moresocialiconslacktxt}>Slack</Typography>
                      </Box>
                    </Grid>
                    <Grid md={6} xs={6} sm={6} lg={6}>
                      <Box sx={loginSignIn.moresocialApplebg}>
                        <Box sx={loginSignIn.socialApple}><FaApple></FaApple></Box>
                        <Typography sx={loginSignIn.moresocialiconstxt} className="moresocialiconstxt">Sign in with Apple</Typography>

                      </Box>
                    </Grid>
                  </Grid>
                  <br />
                  <Button type='button' sx={loginSignIn.MoresignInbtn} onClick={() => { handleMorelogo() }}>Signin with Hilife.AI</Button>

                </Box>
              }
              {/* SOCIAL ICONS END               */}


            </Grid>
            <Grid>

            </Grid>
          </Grid>

          {/* CAROUSEL CONTAIENR START*/}
          <Grid item md={5} sx={loginSignIn.carouselcomp} className="carouselContainer">
            <CarouselComponent></CarouselComponent>
          </Grid>
          {/* CAROUSEL CONTAIENR END*/}

        </Grid>
      </Container><br /><br />
      <Box>
        {/* Sign In Footer Start  */}
        <Box sx={loginSignIn.singinfooter}>
          <Typography sx={{ justifyContent: 'center' }}>Don't have a HIPOS &ensp;<Link to="/signup" sx={loginSignIn.bottomlink} style={{ color: 'blue', textDecoration: 'none' }}>Sign Up Now</Link></Typography>
          <Typography sx={loginSignIn.hearts}>Made with <FavoriteSharp sx={loginSignIn.heart} />&ensp;&ensp;&ensp;in TRICHY <b>&ensp;| &ensp;</b> திருச்சியில் உருவாக்கப்பட்டது &ensp;<FavoriteSharp sx={loginSignIn.heart} /> </Typography>
        </Box><br />
        {/* Sign In Footer End  */}
      </Box>
    </>
  )

}

export default Signin;