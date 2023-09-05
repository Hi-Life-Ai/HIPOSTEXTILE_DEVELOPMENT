import React, { useState, useEffect, useContext } from 'react';
import { Grid, Badge, Box, Button, MenuItem, Menu, Typography, DialogActions, Dialog, DialogContent } from '@mui/material';
import { navbarStyle } from './Style';
import Navbar from './Navbar';
import { BiCalculator } from 'react-icons/bi';
import { CgMicrosoft } from 'react-icons/cg';
import { Logout } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Calculator from './Calculator';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { SERVICE } from '../../services/Baseservice';
import { AUTH } from '../../services/Authservice';
import NotificationsIcon from '@mui/icons-material/Notifications';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const Header = () => {

  //***** Action button *****//

  const [Notification, setNotification] = useState()

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => { setAnchorEl(event.currentTarget); };
  const handleClose = () => { setAnchorEl(null); };

  const { auth, setAuth, setngs, setSetngs } = useContext(AuthContext);
  const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);

 // Start model
 const [isAppstart, setIsAppstart] = useState(false);
 const handleAppstartOpen = () => { handleSteponeClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsAppstart(true); };
 const handleAppstartClose = () => { setIsAppstart(false); };

 // Step 1 model
 const [isStepone, setIsStepone] = useState(false);
 const handleSteponeOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsStepone(true); };
 const handleSteponeClose = () => { setIsStepone(false); };

 // Step 2 model
 const [isSteptwo, setIsSteptwo] = useState(false);
 const handleSteptwoOpen = () => { handleAppstartClose();handleSteponeClose();handleStepthreeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsSteptwo(true); };
 const handleSteptwoClose = () => { setIsSteptwo(false); };

  // Step 3 model
  const [isStepthree, setIsStepthree] = useState(false);
  const handleStepthreeOpen = () => { handleAppstartClose();handleSteptwoClose();handleSteponeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsStepthree(true); };
  const handleStepthreeClose = () => { setIsStepthree(false); };

  // Step 4 model
  const [isStepfour, setIsStepfour] = useState(false);
  const handleStepfourOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleSteponeClose();handleStepfiveClose();handleStepsixClose();setIsStepfour(true); };
  const handleStepfourClose = () => { setIsStepfour(false); };

   // Step 5 model
   const [isStepfive, setIsStepfive] = useState(false);
   const handleStepfiveOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleSteponeClose();handleStepsixClose();setIsStepfive(true); };
   const handleStepfiveClose = () => { setIsStepfive(false); };

    // Step 6 model
    const [isStepsix, setIsStepsix] = useState(false);
    const handleStepsixOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleSteponeClose();handleStepfiveClose();setIsStepfive(true); };
    const handleStepsixClose = () => { setIsStepsix(false); };
 
  useEffect(
    () => {
      fetchTransfers();
    }, []
  )

  const fetchTransfers = async () => {
    try {
      var response = await axios.post(SERVICE.TRANSFERS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid:String(setngs.businessid),
        role:String(isUserRoleAccess.role),
        userassignedlocation:[isUserRoleAccess.businesslocation]
      });

      let arr = [];
      
      let answer = response?.data?.transfers?.filter((data, index) => {
        if ((data.status == false && data.reject == false ) || (data.status == false && data.reject == true)) {
          arr.push(data)
          return data
        }
      })
      setNotification(arr.length);
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  }
 
  const backLPage = useNavigate();

  const logOut = async () => {
    try {
      let res = await axios.get(AUTH.LOGOUT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      //change login state
      setAuth({ ...auth, loginState: false });
      toast.success(res.data.message);
      localStorage.clear();
      setSetngs({});
      backLPage('/signin');
    } catch (err) {
      const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
    }
  }

  return (
    <header>   
      <Box sx={{ display: 'flex' }}>
     
        <Grid container sx={{ justifyContent: 'flex-start', color: 'white', marginTop: '3px', fontSize: '18px', fontWeight: 600 }}>
        {setngs?.businesslogo ? <img src={setngs?.businesslogo} width="50px" height="50px" alt="Logo" /> : setngs?.businessname ? <p>{setngs?.businessname}</p> : <></>}
        </Grid>
        <Grid container sx={{ justifyContent: 'flex-end', paddingTop: "10px" }}>
        <Button onClick={handleAppstartOpen} sx={navbarStyle.navbarrightbtn}><QuestionMarkIcon /></Button>
          {isUserRoleCompare[0]?.allstocktransferlist && (
            <>
            <Link to='/stockadjust/list'>
              <Badge badgeContent={Notification} color="error"
                style={{ color: 'white', cursor: "pointer" }}  anchorOrigin={{ vertical: 'top', horizontal: 'left', }}>
                <NotificationsIcon sx={navbarStyle.navbarrightbtn} style={{ padding: "5px" }} />
              </Badge>
            </Link> 
          </>
          )}
          <>
            <Button
              id="demo-customized-button"
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              disableElevation
              onClick={handleClick}
              sx={navbarStyle.navbarrightbtn}
            >
              <BiCalculator></BiCalculator>
            </Button>
            <Menu
              id="demo-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem>
                <Calculator />
              </MenuItem>
            </Menu>
          </>
          {isUserRoleCompare[0]?.apos && (
            <Link to="/sell/pos/create"><Button sx={navbarStyle.navbarrightbtn}><CgMicrosoft />&ensp;POS</Button></Link>
          )}
          <Button onClick={logOut} sx={navbarStyle.navbarrightbtn}><Logout /></Button>
        </Grid>
      </Box>
       <Navbar />
        {/* Application tour */}
      <Box>
          {/* START DIALOG */}
        <Box>
            <Dialog
                open={isAppstart}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px'}}>
                <Typography variant="h5"><b>Application Tour</b></Typography><br />
                <Typography variant="body1" >Let's go through the application in 5 quick steps..</Typography>
                </DialogContent>
                <DialogActions sx={{display:'flex', justifyContent:'space-between'}}>
                  <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteponeOpen}>Next</Button>
                  <Button variant="contained" sx={{backgroundColor:'#878080', color:'white'}} onClick={handleAppstartClose}>End Tour</Button>
                </DialogActions>
            </Dialog>
        </Box>

        {/* STEP 1 DIALOG */}
          <Box>
            <Dialog
                open={isStepone}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '450px'}}>
                <Typography variant="h4"><b>Step1: Shop Details</b></Typography><br />
                <Typography sx={{fontSize:'20px', color:'black'}} >Settings you can find your shop related information, Basic information,Business name, branches, Product SKU,Add Multiple Locations,Taxes & other for your shop.</Typography>
                </DialogContent>
                <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
                <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleAppstartOpen}>Previous</Button>
                  <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteptwoOpen}>Next</Button>
                </DialogActions>
            </Dialog>
          </Box>
        {/* STEP 2 DIALOG */}
        <Box>
            <Dialog
                open={isSteptwo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '450px'}}>
                <Typography variant="h4"><b>Step2: Manage User</b></Typography><br />
                <Typography sx={{fontSize:'20px', color:'black'}} >User - here you can add your new users assign multiple branches access, add role app each module access and departments.</Typography>
                </DialogContent>
                <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
                <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteponeOpen}>Previous</Button>
                  <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepthreeOpen}>Next</Button>
                </DialogActions>
            </Dialog>
        </Box>
          {/* STEP 3 DIALOG */}
             <Box>
                <Dialog
                    open={isStepthree}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '450px'}}>
                    <Typography variant="h4"><b>Step3: Manage Products</b></Typography><br />
                    <Typography sx={{fontSize:'20px', color:'black'}} >Add Products - Import products, Units, variaous categories and subcategories, print layout, Products report</Typography>
                    </DialogContent>
                    <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
                    <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteptwoOpen}>Previous</Button>
                      <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfourOpen}>Next</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* STEP 4 DIALOG */}
            <Box>
                <Dialog
                    open={isStepfour}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '450px'}}>
                    <Typography variant="h4"><b>Step4: Purchase</b></Typography><br />
                    <Typography sx={{fontSize:'20px', color:'black'}} >Purchase - Here you can purchase new products with tax details, invoice detals and stock update</Typography>
                    </DialogContent>
                    <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
                    <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepthreeOpen}>Previous</Button>
                      <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfiveOpen}>Next</Button>
                    </DialogActions>
                </Dialog>
            </Box>
             {/* STEP 5 DIALOG */}
             <Box>
                <Dialog
                    open={isStepfive}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '450px'}}>
                    <Typography variant="h4"><b>Step5: Manage Stock</b></Typography><br />
                    <Typography sx={{fontSize:'20px', color:'black'}} >Stock - Product stock update, stock details, transfer products multiple branches and verify transfered products</Typography>
                    </DialogContent>
                    <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
                    <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfourOpen}>Previous</Button>
                      <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepsixOpen}>Next</Button>
                    </DialogActions>
                </Dialog>
            </Box>
             {/* STEP 6 DIALOG */}
             <Box>
                <Dialog
                    open={isStepsix}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '450px'}}>
                    <Typography variant="h4"><b>Step6: Manage Sales</b></Typography><br />
                    <Typography sx={{fontSize:'20px', color:'black'}} >Sell - POS, Use this screen while selling products or billing. Select Location, Add Products, discounts and invoice details Finalize it..</Typography>
                    </DialogContent>
                    <DialogActions sx={{display:'flex', justifyContent:'space-between'}}>
                    <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfiveOpen}>Previous</Button>
                    <Button variant="contained" sx={{backgroundColor:'#878080', color:'white'}} onClick={handleAppstartClose}>End Tour</Button>                    
                    </DialogActions>
                </Dialog>
            </Box>
      </Box>
    </header>
  )
}

export default Header;
