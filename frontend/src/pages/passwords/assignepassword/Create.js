
import React, { useState, useEffect, useContext } from 'react';
import { Box, FormControl,Select, MenuItem, Button, Grid, Typography,InputLabel, Dialog, DialogContent, DialogActions } from '@mui/material';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';import { userStyle } from '../../PageStyle';
import { toast } from "react-toastify";
import { AuthContext } from '../../../context/Appcontext';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from '../../../services/Baseservice'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

function AssignedPassword() {
  const [user, setUser] = useState([])
  const [folder, setFolder] = useState([])
   // Access 
   const { auth, setngs } = useContext(AuthContext);

  const [assigned, setAssigned] = useState({
    username: "", useruniqid: ""
  })
  const [selectedValueedit, setSelectedValueedit] = useState([]);

  //error popup
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleErrorOpen = () => { setIsErrorOpen(true); };
  const handleErrorClose = () => { setIsErrorOpen(false); };
  const backPage = useNavigate();

  //Share popup
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleOpen = () => { 
    if(assigned.username == ""){
        setShowAlert("Please select user name!");
        handleErrorOpen();
    }else if(selectedValueedit.length == 0){
        setShowAlert("Please select atleast one folder!");
        handleErrorOpen();
    }else{
        setShowAlert("");
        setIsDeleteOpen(true);
    }
   };
  const handleClose = () => { setIsDeleteOpen(false) };

  const addAssigned = async () => {
    try {
      let req = await axios.post(SERVICE.ASSIGNPASSWORD_CREATE, {
        headers: {
            'Authorization': `Bearer ${auth.APIToken}`
        },
      username: String(assigned.username),
      userid: [...selectedValueedit],
      useruniqid: String(assigned.useruniqid),
      assignbusinessid:String(setngs.businessid),
    })
    setAssigned(req.data)
   
    handleClose()
    backPage('/passwords/assignpassword/list')
    toast.success(req.data.message, {
      position: toast.POSITION.TOP_CENTER
    });
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  }

  const fetchuser = async () => {

    try {
      let res = await axios.post(`${SERVICE.USER_TERMSFALSE}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid:String(setngs.businessid)
      });

      setUser(res?.data?.usersterms)
    } catch (err) {
      const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
    }
  }

  const fetchfolder = async () => {
    try {
      let res = await axios.post(SERVICE.FOLDER,{
        headers: {
            'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid:String(setngs.businessid)
      })

      setFolder(
        res.data.folders.length > 0 && res.data.folders.map((d) => ({
          ...d,
          label: d.foldername,
          value: d.foldername
        }))
      )
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  }
  
  const handleSubmit = () => {
    addAssigned()
  }

  const handleFetch = (e) => {
    let result = e.map((data, index) => {
      return data._id
    })
    setSelectedValueedit(result)
  }

  const pageDirect = () => {
    backPage('/passwords/assignpassword/list');
  }

  useEffect(() => {
    fetchuser();
    fetchfolder();
  }, [])

  return (

    <Box>
      <Headtitle title={'Share List'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Share Passwords<Typography sx={userStyle.SubHeaderText} component="span">Manage your passwords</Typography></Typography>
    <Box sx={userStyle.container}>  
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Share<Typography sx={userStyle.SubHeaderText} component="span">Manage your folder</Typography></Typography>
      {/* content start */}
      <br /><br />
      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
        <InputLabel htmlFor="component-outlined">Select user <b style={{color:'red'}}>*</b></InputLabel>
          <FormControl fullWidth sx={{display:'flex'}}>
          <Select
              MenuProps={{
                  PaperProps: {
                      style: {
                          maxHeight: 200
                      },
                  },
                }}
                fullWidth
                
            >
              {user.length > 0 &&
                user.map((row, index) => (
                  <MenuItem key={index} onClick={(e) => { setAssigned({ ...assigned, username: row.staffname, useruniqid: row.userid }) }} value={row.userid}>{row.staffname}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
        <InputLabel htmlFor="component-outlined">Select folder <b style={{color:'red'}}>*</b></InputLabel>
          <FormControl fullWidth>
            <Selects
              isMulti
              options={folder}
              onChange={(e) => handleFetch(e)}
            />
          </FormControl>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={12}>
          <Button sx={userStyle.buttonadd} onClick={handleOpen} >SHARE</Button>
        </Grid>
      </Grid>

    {/* Error alert popup */}
      <Box>
            <Dialog
                open={isErrorOpen}
                onClose={handleErrorClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h6" >{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleErrorClose} >ok</Button>
                </DialogActions>
            </Dialog>
        </Box>

      {/* share alert pop up */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
          <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleClose(); pageDirect();}} variant="outlined">Cancel</Button>
          <Button autoFocus variant="contained" color='error' onClick={() => { handleSubmit() }}> OK </Button>
        </DialogActions>
      </Dialog>
      <br /><br /><br /><br /><br /><br />
    </Box>

    </Box>
  );
}
function AssignedPasswordlist() {
  return (
    <>
          <AssignedPassword /><br /><br /><br />
      <Footer /><br /><br />
    </>
  )
}
export default AssignedPasswordlist;