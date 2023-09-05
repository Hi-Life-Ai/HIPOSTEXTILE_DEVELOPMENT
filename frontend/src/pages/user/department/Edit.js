import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Typography, FormControl, InputLabel, Dialog, DialogContent, DialogActions, OutlinedInput, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Departmenteditlist() {

  const { auth, setngs } = useContext(AuthContext);
  const [isDepartmentName, setIsDepartmentName] = useState([]);
  const [isDepartment, setIsDepartment] = useState({});
  
  // check edit
  const [overalldep, setOverAlDep] = useState("")
  const [getDepartment, setGetDepartment] = useState("")
  const [EditDepCount, setEditDepCount] = useState(0)
 
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
  const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

  // popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenc = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };

  const id = useParams().id;

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  // fetch particular id value
  const fetchDepartment = async () => {
    try {
      let req = await axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsDepartment(req?.data?.sdepartment);
      getEditId(req.data.sdepartment.departmentname);
      setGetDepartment(req.data.sdepartment.departmentname)

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  //  Fetch department Data
  const fetchDepartments = async () => {
    try {
      let res = await axios.post(SERVICE.DEPARTMENT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setIsDepartmentName(res?.data?.departments?.filter(item => item._id !== isDepartment._id));
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

  const getEditId = async (value) => {
    try {
      let res = await axios.post(SERVICE.DEPARTMENT_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbusinessid: String(setngs.businessid),
        department: String(value)

      });
      setEditDepCount(res?.data?.department?.length)
      setOverAlDep(`The ${value} is linked in ${res?.data?.department?.length > 0 ? "User ," : ""} whether you want to do changes ..??`)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const getOverAlldepUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.DEPARTMENT_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbusinessid: String(setngs.businessid),
        department: getDepartment

      });
      editOveAllDepartment(res.data.department)
    }
    catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }

    }
  };

  const editOveAllDepartment = async (department) => {
    try {

      if (department?.length > 0) {
        let result = department.map((data, index) => {
          let request = axios.put(`${SERVICE.USER_SINGLEPW}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            department: String(isDepartment.departmentname),
          });

        })

      }
    } catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  let backPage = useNavigate();

  // store edited data to particular id update request
  const sendRequest = async () => {

    try {
      let res = await axios.put(`${SERVICE.DEPARTMENT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        departmentid: String(isDepartment.departmentid),
        departmentname: String(isDepartment.departmentname),
      });
      setIsDepartment(res.data);
      await getOverAlldepUpdate();
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backPage("/user/department/list");
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(messages);
        handleClickOpenc();
      } else {
        setShowAlert("Something went wrong!");
        handleClickOpenc();
      }
    }
  };

  useEffect(
    () => {
      fetchDepartment();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = isDepartmentName.some(item => item.departmentname.toLowerCase() === isDepartment.departmentname.toLowerCase());

    if (isDepartment.departmentname == "") {
      setShowAlert("Please enter department name!");
      handleClickOpenc();
    }
    else if (isNameMatch) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (isDepartment.departmentname != getDepartment && EditDepCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {overalldep}
          </p>
        </>
      )
      handleClickOpenerrpop();
    }
    else {
      sendRequest();
    }
  }

  return (
    <Box>
      <Headtitle title={'Edit Department'} />
      {/* Form Start */}
      <form onSubmit={handleSubmit}>
        <Typography sx={userStyle.HeaderText}>Edit Department</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Department ID<b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isDepartment.departmentid}
                  type="text"
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Department Name<b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isDepartment.departmentname}
                  onChange={(e) => { setIsDepartment({ ...isDepartment, departmentname: e.target.value }) }}
                  type="text"
                />
              </FormControl>
            </Grid>
          </Grid><br />

          <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <Button sx={userStyle.buttonadd} type="submit" autoFocus>UPDATE</Button>
            <Link to="/user/department/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
          </Grid>
        </Box>
      </form>
      {/* Form End */}
      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{
              padding: '7px 13px',
              color: 'white',
              background: 'rgb(25, 118, 210)'
            }} onClick={() => {
              sendRequest();
              handleCloseerrpop();
            }}>
              ok
            </Button>
            <Button
              sx={userStyle.buttoncancel}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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

const Departmentsedit = () => {
  return (
    <>
       <Departmenteditlist /><br /><br /><br />
            <Footer />
    </>
  );
}
export default Departmentsedit;