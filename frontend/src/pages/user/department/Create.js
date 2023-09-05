import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Typography, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { AuthContext } from '../../../context/Appcontext';

function Departmentcreate() {

  const [departmentAdd, setdepartmentAdd] = useState({ departmentid: "", departmentname: "" });
  const { auth, setngs } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);

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

  //autogenerate....
  let newval = setngs ? setngs.departmentsku == undefined ? "DP0001" : setngs.departmentsku + "0001" : "DP0001";

  //  Fetch department Data
  const fetchDepartments = async () => {
    try {
      let res = await axios.post(SERVICE.DEPARTMENT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setDepartments(res?.data?.departments);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  useEffect(
    () => {
      fetchDepartments();
    }, []
  )

  useEffect(
    () => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);


  const backLPage = useNavigate();

  // store department data to db
  const sendRequest = async () => {

    try {
      let res = await axios.post(SERVICE.DEPARTMENT_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        departmentid: String(newval),
        departmentname: String(departmentAdd.departmentname),
        assignbusinessid: String(setngs.businessid),
      });
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      setdepartmentAdd(res.data);
      backLPage('/user/department/list');
    } catch (err) {
      const messages = err.response.data.errorMessage;
      setShowAlert(messages);
      handleClickOpen();
    }
  };

  // store department data to db
  const sendRequestAnother = async () => {

    try {
      let res = await axios.post(SERVICE.DEPARTMENT_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        departmentid: String(newval),
        departmentname: String(departmentAdd.departmentname),
        assignbusinessid: String(setngs.businessid),
      });
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      await fetchDepartments();
      setdepartmentAdd({ ...departmentAdd, departmentname: "" });
    } catch (err) {
      const messages = err.response.data.errorMessage;
      setShowAlert(messages);
      handleClickOpen();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = departments.some(item => item.departmentname?.toLowerCase() === (departmentAdd.departmentname)?.toLowerCase());
    const isCodeMatch = departments.some(item => item.departmentid?.toLowerCase() === (newval)?.toLowerCase());

    if (departmentAdd.departmentname == "") {
      setShowAlert("Please enter Department name!");
      handleClickOpen();
    }
    else if (isCodeMatch) {
      setShowAlert("Code already exits!");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlert("Name already exits!");
      handleClickOpen();
    } else {
      sendRequest();
    }
  }

  const handleSubmitAnother = (e) => {
    e.preventDefault();
    const isNameMatch = departments.some(item => item.departmentname.toLowerCase() === (departmentAdd.departmentname).toLowerCase());
    const isCodeMatch = departments.some(item => item.departmentid.toLowerCase() === (newval).toLowerCase());

    if (departmentAdd.departmentname == "") {
      setShowAlert("Please enter Department name!");
      handleClickOpen();
    }
    else if (isCodeMatch) {
      setShowAlert("Code already exits!");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlert("Name already exits!");
      handleClickOpen();
    } else {
      sendRequestAnother();
    }
  }

   //department...
const handleClear = () => {
  setdepartmentAdd({
    departmentid: "", departmentname: "" 
  });    

};

  return (
    <Box>
      <Headtitle title={'Add Department'} />
      <Typography sx={userStyle.HeaderText}>Add Department</Typography>
      {/* content start */}
      <form>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            {departments && (
              departments.map(
                () => {
                  let strings = setngs ? setngs.departmentsku : "DP";
                  let refNo = departments[departments.length - 1].departmentid;
                  let digits = (departments.length + 1).toString();
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
                    refNOINC = ("000" + refNOINC);
                    newval = strings + refNOINC;
                  } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                    refNOINC = ("00" + refLstTwo);
                    newval = strings + refNOINC;
                  } else if (digits.length < 4 && getlastThreeChar > 0) {
                    refNOINC = ("0" + refLstThree);
                    newval = strings + refNOINC;
                  } else {
                    refNOINC = (refLstDigit);
                    newval = strings + refNOINC;
                  }
                }))}
            <Grid item md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Department Id<b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={newval}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Department Name<b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={departmentAdd.departmentname}
                  onChange={(e) => { setdepartmentAdd({ ...departmentAdd, departmentname: e.target.value }) }}
                  type="text"
                />
              </FormControl>
            </Grid>
          </Grid><br />
          <br />
          <Grid container sx={userStyle.gridcontainer}>
            <Grid sx={{ display: 'flex' }}>
              <Button sx={userStyle.buttonadd} onClick={handleSubmit}>SAVE</Button>
              <Button sx={userStyle.buttonadd} onClick={handleSubmitAnother}>SAVE AND ANOTHER</Button>
              <Link to="/user/department/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
              <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
            </Grid>
          </Grid>
        </Box>
      </form>
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

function Departmentscreate() {
  return (
    <>
      <Departmentcreate /><br /><br /><br />
          <Footer />
    </>
  );
}

export default Departmentscreate;