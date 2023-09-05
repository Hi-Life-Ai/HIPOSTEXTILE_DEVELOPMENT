import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Grid, InputLabel, FormControl, OutlinedInput, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { toast } from 'react-toastify';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

function Customergroupcreate() {

  const { auth, setngs } = useContext(AuthContext);
  const [customergrp, setCustomergrp] = useState([]);
  const [custGroup, setCustGroup] = useState({ cusgroupname: "", cusgroupid: "" });

  //popup modal
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };



  // auto id for purchase number
  let newval = setngs ? setngs.cusgroupsku == undefined ? "CG0001" : setngs.cusgroupsku + "0001" : "CG0001";

  // Customer Group Auto Id Function
  const fetchHandler = async () => {
    try {
      let res = await axios.post(SERVICE.CUSTOMER_GROUP, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setCustomergrp(res?.data?.cgroups)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(
    () => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);


  // customer group
  const handleClear = () => {
    setCustGroup({
      cusgroupname: "", cusgroupid: ""
    })
	
  }

  const backLPage = useNavigate();

  const addCustGroup = async () => {
    try {
      let response = await axios.post(SERVICE.CUSTOMER_GROUP_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        cusgroupname: String(custGroup.cusgroupname),
        cusgroupid: String(custGroup.cusgroupid),
        assignbusinessid: String(setngs.businessid),
      });
      setCustGroup(response.data);
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backLPage('/contact/customergroup/list');
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(messages);
        handleClickOpen();
      } else {
        setShowAlert("Something went wrong!");
        handleClickOpen();
      }
    }
  }

  const addCustGroupOther = async () => {
    try {

      let response = await axios.post(SERVICE.CUSTOMER_GROUP_CREATE, {
        headers: {

          'Authorization': `Bearer ${auth.APIToken}`
        },
        cusgroupname: String(custGroup.cusgroupname),
        cusgroupid: String(custGroup.cusgroupid),
        assignbusinessid: String(setngs.businessid),
      });
      await fetchHandler();
      setCustGroup({ ...custGroup, cusgroupname: "", cusgroupid: "" });

      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(messages);
        handleClickOpen();
      } else {
        setShowAlert("Something went wrong!");
        handleClickOpen();
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = customergrp.some(item => item.cusgroupname?.toLowerCase() === (custGroup.cusgroupname)?.toLowerCase());
    const isCodeMatch = customergrp.some(item => item.cusgroupid?.toLowerCase() === (newval)?.toLowerCase());

    if (custGroup.cusgroupname == "") {
      setShowAlert("Please Enter Customer Group Name!")
      handleClickOpen();
    } else if (custGroup.cusgroupid == "") {
      setShowAlert("Please Enter Customer Group Code!")
      handleClickOpen();
    } else if (isCodeMatch) {
      setShowAlert("ID Already Exists");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlert("Name Already Exists");
      handleClickOpen();
    } else {
      addCustGroup();
    }
  }

  const handleSubmitOther = (e) => {
    e.preventDefault();
    const isNameMatch = customergrp.some(item => item.cusgroupname?.toLowerCase() === (custGroup.cusgroupname)?.toLowerCase());
    const isCodeMatch = customergrp.some(item => item.cusgroupid?.toLowerCase() === (newval)?.toLowerCase());

    if (custGroup.cusgroupname == "") {
      setShowAlert("Please Enter Customer Group Name!")
      handleClickOpen();
    } else if (custGroup.cusgroupid == "") {
      setShowAlert("Please Enter Customer Group Code!")
      handleClickOpen();
    } else if (isCodeMatch) {
      setShowAlert("ID Already Exists");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlert("Name Already Exists");
      handleClickOpen();
    } else {
      addCustGroupOther();
    }
  }

  return (
    <Box>
      <Headtitle title={'Add Customer group'} />
      {/* ****** Form Start ****** */}
      <Typography sx={userStyle.HeaderText}>Add Customer Group</Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            {customergrp && (
              customergrp.map(
                () => {
                  let strings = setngs ? setngs.cusgroupsku : "CG";
                  let refNo = customergrp[customergrp.length - 1].cusgroupid;
                  let digits = (customergrp.length + 1).toString();
                  const stringLength = refNo.length;
                  let lastChar = refNo.charAt(stringLength - 1);
                  let getlastBeforeChar = refNo.charAt(stringLength - 2);
                  let getlastThreeChar = refNo.charAt(stringLength - 3);
                  let lastBeforeChar = refNo.slice(-2);
                  let lastThreeChar = refNo.slice(-3);
                  let lastDigit = refNo.slice(-4);
                  let refNOINC = parseInt(lastChar) + 1
                  let refLstTwo = parseInt(lastBeforeChar) + 1;
                  let refLstThree = parseInt(lastThreeChar) + 1;
                  let refLstDigit = parseInt(lastDigit) + 1;
                  if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                    refNOINC = ("000" + refNOINC).substr(-4);
                    newval = strings + refNOINC;
                  } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                    refNOINC = ("00" + refLstTwo).substr(-4);
                    newval = strings + refNOINC;
                  } else if (digits.length < 4 && getlastThreeChar > 0) {
                    refNOINC = ("0" + refLstThree).substr(-4);
                    newval = strings + refNOINC;
                  } else {
                    refNOINC = (refLstDigit).substr(-4);
                    newval = strings + refNOINC;
                  }
                }))}
            <InputLabel htmlFor="component-outlined">Contact Id</InputLabel>
            <Grid sx={{ display: 'flex' }}  >
              <Grid sx={userStyle.spanIcons}><ContactPageOutlinedIcon /></Grid>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={newval}
                  type="text"
                  name="cusgroupid"
                  readOnly
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Customer Group Name<b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
            <FormControl size="small" fullWidth >
              <OutlinedInput
                id="addCustGroupName"
                value={custGroup.cusgroupname}
                onChange={(e) => { setCustGroup({ ...custGroup, cusgroupname: e.target.value, cusgroupid: newval }) }}
                placeholder="Customer Group Name"
                name="cusgroupname"
                type="text"
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container sx={userStyle.gridcontainer}>
          <Grid>
          <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
            <Link to="/contact/customergroup/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
            <Button sx={userStyle.buttonadd} type="submit" color="success" onClick={handleSubmitOther}>SAVE AND ADDANOTHER</Button>
            <Button sx={userStyle.buttonadd} type="submit" color="success" onClick={handleSubmit}>SAVE</Button>
          </Grid>
        </Grid>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
function Customergrpcreate() {
  return (
    <>
       <Customergroupcreate /><br /><br /><br /><br />
          <Footer />
    </>
  );
}

export default Customergrpcreate;
