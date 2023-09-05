import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Grid, FormControl, Dialog, DialogContent, DialogActions, OutlinedInput, InputLabel, Typography, } from "@mui/material";
import { userStyle } from "../../PageStyle";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from "../../../components/footer/Footer";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Uniteditlist() {

  const { auth, setngs } = useContext(AuthContext);
  const [unitData, setUnitData] = useState([])
  const [unitForm, setUnitForm] = useState({});

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

  // Edit Popup model start
  const [getUnit, setGetUnit] = useState("") // 1
  const [overAllUnit, setOverAllUnit] = useState("")//3
  const [editUnit, setEditUnit] = useState(0)//2

  // Edit Update Start
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
  const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

  const id = useParams().id;

  // Get Datas
  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.UNIT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setUnitForm(response?.data?.sunit);
      setGetUnit(response?.data?.sunit.unit);
      getEditId(response?.data?.sunit.unit);
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

  // units
  const fetchData = async () => {
    try {
      let res = await axios.post(SERVICE.UNIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setUnitData(res?.data?.units?.filter(item => item._id !== unitForm._id));
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
      let res = await axios.post(SERVICE.UNIT_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        unit: String(value),
        businessid: String(setngs.businessid),
      });
      setEditUnit(res?.data?.count)
      setOverAllUnit(`The ${value} is linked in ${res?.data?.productunit?.length > 0 ? "Product ," : ""}
        ${res?.data?.purchase?.length > 0 ? "Purchase  " : ""}
        ${res?.data?.unitgroup?.length > 0 ? "Unitgroup  " : ""}  whether you want to do changes ..??`
      )
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
      let res = await axios.post(SERVICE.UNIT_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        unit: getUnit,
        businessid: String(setngs.businessid),
      });
      editOveAllDepartment(res.data.purchase, res.data.unitgroup, res.data.productunit);
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

  const editOveAllDepartment = async (purchase, unitgroup, product) => {
    try {
      if (purchase?.length > 0) {
        purchase.forEach((data, index) => {
          const updatedArray = data.products.map(item => {
            if (item.quantityunit === getUnit) {
              return { ...item, quantityunit: unitForm.unit };
            }
            return item;
          });
          let request = axios.put(`${SERVICE.PURCHASE_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            products: updatedArray,
          });
        })
      }
      if (unitgroup?.length > 0) {
        let result = unitgroup.map((data, index) => {

          let request = axios.put(`${SERVICE.UNIT_GROUP_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            unit: String(unitForm.unit),
          });

        })

      }
      if (product?.length > 0) {
        let result = product.map((data, index) => {
          let request = axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            unit: String(unitForm.unit),
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

  // Edit Datas
  const sendRequest = async () => {
    try {
      let response = await axios.put(`${SERVICE.UNIT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        unit: String(unitForm.unit),
        shortname: String(unitForm.shortname),
      });
      setUnitForm(response.data);
      await getOverAlldepUpdate();
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backLPage("/product/unit/list");
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const editUnitSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = unitData.some(item => item.unit.toLowerCase() === (unitForm.unit).toLowerCase());

    if (unitForm.unit == "") {
      setShowAlert("Please enter unit name!");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Unit already exits!"}
          </p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (unitForm.unit != getUnit && editUnit > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {overAllUnit}
          </p>
        </>
      )
      handleClickOpenerrpop();

    }
    else {
      sendRequest();
    }
  };

  return (
    <Box>
      <Headtitle title={'Edit Unit'} />
      <Typography sx={userStyle.HeaderText}>Edit Unit</Typography>
      <form onSubmit={editUnitSubmit}>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item md={6} lg={6} sm={12} xs={12}>
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
            <Grid item md={6} lg={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Short Name</InputLabel>
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
              <Link to="/product/unit/list"><Button sx={userStyle.buttoncancel} type='button'>CANCEL</Button></Link>
              <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button>
            </Grid>
          </Grid>
        </Box>
      </form>
      <Box>
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
                style={{
                  backgroundColor: '#f4f4f4',
                  color: '#444',
                  boxShadow: 'none',
                  borderRadius: '3px',
                  padding: '7px 13px',
                  border: '1px solid #0000006b',
                  '&:hover': {
                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                      backgroundColor: '#f4f4f4',
                    },
                  },
                }}
                onClick={handleCloseerrpop}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}

const Unitedit = () => {
  return (
    <>
       <Uniteditlist /><br /><br /><br /><br />
            <Footer />
    </>
  );
};
export default Unitedit;

