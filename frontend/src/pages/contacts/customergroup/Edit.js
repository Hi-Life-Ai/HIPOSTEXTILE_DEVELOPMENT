import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Grid, InputLabel, FormControl, OutlinedInput, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Customergrpeditlist() {

  const { auth, setngs } = useContext(AuthContext);
  const [customergrp, setCustomergrp] = useState([]);
  const [cgroups, setCgroups] = useState({ cusgroupname: "", cusgroupid: "" });

  // check edit
  const [overallCus, setOverAlCus] = useState("")
  const [getCusgrp, setGetCusGrp] = useState("")
  const [editCusgrpCount, setEditCusgrpCount] = useState(0)

  // popup modal
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };


  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
  const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

  const id = useParams().id

  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.CUSTOMER_GROUP_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setCgroups(response?.data?.scgroup);
      getEditId(response?.data?.scgroup?.cusgroupname);
      setGetCusGrp(response?.data?.scgroup?.cusgroupname)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  useEffect(() => {
    fetchHandler()
  }, [id]);

  // Customer Group Auto Id Function
  const fetchCustomerGroups = async () => {
    try {
      let res = await axios.post(SERVICE.CUSTOMER_GROUP, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setCustomergrp(res?.data?.cgroups?.filter(item => item._id !== cgroups._id))
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
    fetchCustomerGroups();
  }, []);

  useEffect(
    () => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);


  const getEditId = async (value) => {
    try {
      let res = await axios.post(SERVICE.EDIT_CUSGRP, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbusinessid: String(setngs.businessid),
        cusgroupname: String(value)

      });
      setEditCusgrpCount(res?.data?.customerGrp?.length)
      setOverAlCus(`The ${value} is linked in ${res?.data?.customerGrp?.length > 0 ? "Customer ," : ""} whether you want to do changes ..??`)

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
      let res = await axios.post(SERVICE.EDIT_CUSGRP, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbusinessid: String(setngs.businessid),
        cusgroupname: getCusgrp

      });
      editOveAllDepartment(res.data.customerGrp)

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

  const editOveAllDepartment = async (cusgroup) => {
    try {
     
      if (cusgroup.length > 0) {
        let result = cusgroup.map((data, index) => {
          let request = axios.put(`${SERVICE.CUSTOMER_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            customergroup: String(cgroups.cusgroupname),
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

  const backLPage = useNavigate();

  // UPDATE
  const updateCgrps = async () => {
    try {
      let response = await axios.put(`${SERVICE.CUSTOMER_GROUP_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        cusgroupname: String(cgroups.cusgroupname),
        cusgroupid: String(cgroups.cusgroupid),
      });
      setCgroups(response.data);
      await getOverAlldepUpdate();
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backLPage('/contact/customergroup/list');
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = customergrp.some(item => item.cusgroupname.toLowerCase() === cgroups.cusgroupname.toLowerCase());

    if (cgroups.cusgroupname == "") {
      setShowAlert("Please Enter Customer Group Name!")
      handleClickOpen();
    } else if (cgroups.cusgroupid == "") {
      setShowAlert("Please Enter Customer Group Code!")
      handleClickOpen();
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
    else if (cgroups.cusgroupname != getCusgrp && editCusgrpCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {overallCus}
          </p>
        </>
      )
      handleClickOpenerrpop();

    } else {
      updateCgrps();
    }
  }

  return (
    <Box>
      <Headtitle title={'Edit Customer group'} />
      <Box>
        <Grid display="flex">
          <Typography sx={userStyle.HeaderText}>Edit Customer Group</Typography>
        </Grid>
      </Box>
      <Box sx={userStyle.container}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <InputLabel htmlFor="component-outlined">Contact Id</InputLabel>
              <Grid sx={{ display: 'flex' }}  >
                <Grid sx={userStyle.spanIcons}><ContactPageOutlinedIcon /></Grid>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    value={cgroups.cusgroupid}
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
                  value={cgroups.cusgroupname}
                  onChange={(e) => { setCgroups({ ...cgroups, cusgroupname: e.target.value }) }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <Grid>
              <Link to="/contact/customergroup/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
              <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <br />
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
              updateCgrps();
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

function Customergrpedit() {
  return (
    <>
       <Customergrpeditlist /><br /><br /><br /><br />
          <Footer />
    </>
  );
}

export default Customergrpedit;