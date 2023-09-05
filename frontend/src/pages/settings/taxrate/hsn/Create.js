import React, { useState, useEffect, useContext } from 'react';
import { Button, DialogActions, DialogContent, Dialog, Grid, Box, FormControl, OutlinedInput, InputLabel, Typography, } from '@mui/material';
import Selects from "react-select";
import { userStyle, colourStyles } from '../../../PageStyle';
import Footer from '../../../../components/footer/Footer';
import { useNavigate, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import Headtitle from '../../../../components/header/Headtitle';

function HSNCreatelist() {

  const { auth, setngs } = useContext(AuthContext);
  const { setAllTaxratesGroup } = useContext(UserRoleAccessContext)
  const [subtaxrate, setSubtaxrate] = useState([])
  const [isTax, setIsTax] = useState([]);

  const backLPage = useNavigate();

  let totalvalue = 0;
  const [taxrateHsn, setTaxrateHsn] = useState({ taxname: "" });

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenalert = () => { setIsErrorOpen(true); };
  const handleClosealert = () => { setIsErrorOpen(false); };

  //taxrate multi onchange
  const [isChangeSubtax, setIsChangeSubtax] = useState([]);
  const [isChangeSubtaxvalue, setIsChangeSubtaxvalue] = useState([]);
  const handleChangetaxmulti = (e) => {
    setIsChangeSubtax(Array.isArray(e) ? e.map((x) => x.label) : []);
    setIsChangeSubtaxvalue(Array.isArray(e) ? e.map((x) => x.taxrate) : []);
  }

  // Get Datas
  const taxrateHsnRequest = async () => {
    try {
      let req = await axios.post(SERVICE.TAXRATEHSN, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setIsTax(req?.data?.taxrateshsn)
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
    taxrateHsnRequest();
  }, [])

  // Taxrates
  const taxrateRequest = async () => {
    try {
      let response = await axios.post(SERVICE.TAXRATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setSubtaxrate(
        response.data.taxrates.length > 0 && response.data.taxrates.map((d) => ({
          ...d,
          label: d.taxname + '@' + d.taxrate,
          value: d.taxname + '@' + d.taxrate,
        }))
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!");
      }
    }
  }

  //tax calculation
  function taxrateCalc() {

    if (isChangeSubtaxvalue?.length > 0) {
      isChangeSubtaxvalue?.forEach((value) => {
        totalvalue += Number(value)
      })
    }

  }

  //hsn
  const handleClear = () =>{
    setTaxrateHsn({
      taxname: "" 
    });
  }

  const fetchsTaxgroupfalse = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATEGROUPFALSE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setAllTaxratesGroup(res?.data?.taxratesgroupforgroupfalse)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };
  const fetchsTaxgrouphsn = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATEGROUPHSN, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setAllTaxratesGroup(res?.data?.taxratesforgrouphsnfalse)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  // Add Datas
  const sendRequest = async () => {
    try {

      let res = await axios.post(SERVICE.TAXRATE_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        hsn: Number(taxrateHsn.taxname),
        assignbusinessid: String(setngs.businessid),
        subtax: [...isChangeSubtax],
        taxtype: String('hsn'),
        taxrate: String(totalvalue),
        fortaxgonly: String(false)

      });
      backLPage('/settings/taxrate/list');
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      await fetchsTaxgroupfalse();
      await fetchsTaxgrouphsn();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(messages);
        handleClickOpenalert();
      } else {
        setShowAlert("Something went wrong!");
        handleClickOpenalert();
      }
    }
  };

  useEffect(
    () => {
      taxrateRequest();
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
    const isNameMatch = isTax.some(item => item.hsn === parseInt(taxrateHsn.taxname));

    if (taxrateHsn.taxname == "") {
      setShowAlert("Please enter hsn number!");
      handleClickOpenalert();
    }
    else if (isNameMatch) {
      setShowAlert("Tax name already exits!");
      handleClickOpenalert();
    }
    else if (isChangeSubtax.length == 0) {
      setShowAlert("Please select any one of tax name!");
      handleClickOpenalert();
    }
    else {
      taxrateCalc();
      sendRequest();
    }
  }


  return (
    <>
      <Headtitle title={'Tax Group - Create'} />
      <form onSubmit={handleSubmit}>
        <Typography sx={userStyle.HeaderText}>Add HSN</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">HSN <b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  type='number'
                  value={taxrateHsn.taxname}
                  onChange={(e) => { setTaxrateHsn({ ...taxrateHsn, taxname: e.target.value }) }}
                  name="taxname"
                />
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ '& .css-1nrlq1o-MuiFormControl-root': { width: '100%' } }}>
              <InputLabel id="demo-multiple-chip-label">Tax Group <b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl>
                <Selects
                  isMulti
                  name="businesslocation"
                  styles={colourStyles}
                  width="100%"
                  options={subtaxrate}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleChangetaxmulti}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={userStyle.gridcontainer}>
            <Grid >
            <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
              <Link to="/settings/taxrate/list" ><Button sx={userStyle.buttoncancel} >Cancel</Button></Link>
              <Button sx={userStyle.buttonadd} type="submit">Save</Button>
            </Grid>
          </Grid>
        </Box>
      </form>
      {/* ALERT DIALOG */}
      <Dialog
        open={isErrorOpen}
        onClose={handleClosealert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
          <Typography variant="h6" >{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClosealert}>ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
const HsnCreate = () => {
  return (
    <>
       <HSNCreatelist /><br /><br /><br /><br />
            <Footer />
    </>
  );
}

export default HsnCreate;