import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, FormControl, OutlinedInput, InputLabel, Typography, Dialog, DialogContent, DialogActions, Grid } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Unitcreate() {

  const { auth, setngs } = useContext(AuthContext);
  const [unitData, setUnitData] = useState([])
  const [unitForm, setUnitForm] = useState({ unit: "", shortname: "", });

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };


  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };



  // units
  const fetchData = async () => {
    try {
      let res = await axios.post(SERVICE.UNIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setUnitData(res?.data?.units);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  // units
  const handleClear = () => {
    setUnitForm({
      unit: "", shortname: "",
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(
    () => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

  const backLPage = useNavigate();

  // Add Datas
  const sendRequest = async () => {
    try {
      let response = await axios.post(SERVICE.UNIT_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        unit: String(unitForm.unit),
        shortname: String(unitForm.shortname),
        assignbusinessid: String(setngs.businessid),
      });
      setUnitForm(response.data);
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backLPage('/product/unit/list');
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
  };

  // Add Datas
  const sendRequestOther = async () => {
    try {
      let response = await axios.post(SERVICE.UNIT_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        unit: String(unitForm.unit),
        shortname: String(unitForm.shortname),
        assignbusinessid: String(setngs.businessid),
      });
      await fetchData();
      setUnitForm({ ...unitForm, unit: "", shortname: "", });
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

  const addUnitSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = unitData.some(item => item.unit.toLowerCase() === (unitForm.unit).toLowerCase());

    if (isNameMatch) {
      setShowAlert("Unit already exists");
      handleClickOpen();
    }
    else if (unitForm.unit == "") {
      setShowAlert("Please enter unit name!");
      handleClickOpen();
    } else {
      sendRequest();
    }

  };

  const addUnitSubmitOther = (e) => {
    e.preventDefault();
    const isNameMatch = unitData.some(item => item.unit.toLowerCase() === (unitForm.unit).toLowerCase());

    if (isNameMatch) {
      setShowAlert("Unit Already Exists");
      handleClickOpen();
    }
    else if (unitForm.unit == "") {
      setShowAlert("Please enter unit name!");
      handleClickOpen();
    } else {
      sendRequestOther();
    }

  };

  return (
    <Box>
      <Headtitle title={'Add unit'} />
      <Typography sx={userStyle.HeaderText}>Add Unit</Typography>
      <Box sx={userStyle.container}>
        <Grid container spacing={3} sx={userStyle.textInput}>
          <Grid item md={6} sm={12} xs={12}>
            <InputLabel htmlFor="component-outlined">Name <b style={{ color: 'red', }}>*</b></InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                value={unitForm.unit}
                onChange={(e) => { setUnitForm({ ...unitForm, unit: e.target.value }) }}
                type="text"
                name="unit"
              />
            </FormControl>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <InputLabel htmlFor="component-outlined">Short Name </InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={unitForm.shortname}
                onChange={(e) => { setUnitForm({ ...unitForm, shortname: e.target.value }) }}
                name="shortname"
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container sx={userStyle.gridcontainer}>
          <Grid>
          <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
            <Link to="/product/unit/list"><Button sx={userStyle.buttoncancel} type='button'>CANCEL</Button></Link>
            <Button sx={userStyle.buttonadd} type="submit" color="success" onClick={addUnitSubmit}>Save </Button>
            <Button sx={userStyle.buttonadd} type="submit" color="success" onClick={addUnitSubmitOther}>Save And Add Another </Button>
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
function Unitcreatelist() {
  return (

    <>
        <Unitcreate /><br /><br /><br /><br />
          <Footer />
      </>
  );
}

export default Unitcreatelist;
