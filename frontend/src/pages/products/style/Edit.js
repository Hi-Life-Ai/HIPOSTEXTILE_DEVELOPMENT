import React, { useState, useEffect, useContext } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';

function Styleeditlist() {

  const { auth, setngs } = useContext(AuthContext);
  const [styleData, setStyleData] = useState([])
  const [styleForm, setStyleForm] = useState({});

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

  

  // check edit
  const [overallStyle, setOverAlStyle] = useState("");
  const [getStyle, setGetStyle] = useState("");
  const [EditStyleCount, setEditStyleCount] = useState(0);

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
  const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

  const id = useParams().id;

  // Get Datas
  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.STYLE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setStyleForm(response?.data?.sstyle);
      getEditId(response?.data?.sstyle.stylename);
      setGetStyle(response?.data?.sstyle.stylename);
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
  }, [id]);

  // style
  const fetchData = async () => {
    try {
      let res = await axios.post(SERVICE.STYLE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setStyleData(res?.data?.styles?.filter(item => item._id !== styleForm._id));
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


  const getEditId = async (value) => {
    try {
      let res = await axios.post(SERVICE.STYLE_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbusinessid: String(setngs.businessid),
        stylename: String(value)

      });
      setEditStyleCount(res?.data?.stylename?.length)
      setOverAlStyle(`The ${value} is linked in ${res?.data?.stylename?.length > 0 ? "Product " : ""} whether you want to do changes ..??`)
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
      let res = await axios.post(SERVICE.STYLE_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbusinessid: String(setngs.businessid),
        stylename: getStyle
      });
      editOveAllDepartment(res.data.stylename)
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

  const editOveAllDepartment = async (product) => {
    try {

      if (product?.length > 0) {
        let result = product.map((data, index) => {
          let request = axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            assignbusinessid: String(setngs.businessid),
            style: String(styleForm.stylename),
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

  const sendEditRequest = async () => {
    try {
      let req = await axios.put(`${SERVICE.STYLE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        stylename: String(styleForm.stylename),
      });
      setStyleForm(req.data);
      await getOverAlldepUpdate();
      toast.success(req.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backLPage('/product/style/list');

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

  const editStyleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = styleData.some(item => item.stylename.toLowerCase() === (styleForm.stylename).toLowerCase());

    if (styleForm.stylename == "") {
      setShowAlert("Please enter style name!");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Stylename already exits!"}
          </p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (styleForm.stylename != getStyle && EditStyleCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {overallStyle}
          </p>
        </>
      )
      handleClickOpenerrpop();

    } else {
      sendEditRequest();
    }
  };

  const handleCancel = () => {
    backLPage('/product/style/list');
  }

  return (
    <Box>
      <Headtitle title={'Edit Style'} />
      <Typography sx={userStyle.HeaderText}>Edit Style</Typography>
      <form onSubmit={editStyleSubmit}>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Style Name <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={styleForm.stylename}
                  onChange={(e) => { setStyleForm({ ...styleForm, stylename: e.target.value }) }}
                  type="text"
                  name="stylename"
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={userStyle.gridcontainer}>
            <Grid>
              <Button sx={userStyle.buttoncancel} onClick={handleCancel}>CANCEL</Button>
              <Button sx={userStyle.buttonadd} type="submit"> UPDATE </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
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
              sendEditRequest();
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
    </Box >
  );
}

function Styleedit() {
  return (
    <>
       <Styleeditlist /><br /><br /><br /><br />
          <Footer />
    </>
  );
}
export default Styleedit;