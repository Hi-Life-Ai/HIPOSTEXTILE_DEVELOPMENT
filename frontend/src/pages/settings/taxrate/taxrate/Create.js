import React, { useState, useContext, useEffect } from 'react';
import { DialogActions, Typography, DialogContent, Dialog, Button, Grid, Box, InputLabel, FormControl, OutlinedInput, FormControlLabel, Checkbox, FormGroup, } from '@mui/material';
import { userStyle } from '../../../PageStyle';
import Footer from '../../../../components/footer/Footer';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import Headtitle from '../../../../components/header/Headtitle';

function TaxrateCreatelist() {

  const { auth, setngs } = useContext(AuthContext);
  const { setAllTaxratesGroup } = useContext(UserRoleAccessContext)
  const [isTax, setIsTax] = useState([]);

  const [taxRate, setTaxRate] = useState({
    taxname: "", taxrate: "", fortaxgonly: false
  });

  useEffect(
    () => {
      fetchTax();
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

  const fetchTax = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setIsTax(res.data.taxrates);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

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
  const sendRequest = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATE_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        taxname: String(taxRate.taxname),
        taxrate: Number(taxRate.taxrate),
        taxtype: String('taxrate'),
        fortaxgonly: Boolean(taxRate.fortaxgonly),
        assignbusinessid: String(setngs.businessid),
      });
      setTaxRate(res.data);
      backLPage('/settings/taxrate/list');
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      await fetchsTaxgroupfalse();
      await fetchsTaxgrouphsn();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //taxrate...
  const handleClear = () =>{
    setTaxRate({
      taxname: "", taxrate: "", fortaxgonly: ""
    })
  }

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

  const addTaxRateSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = isTax.some(item => item.taxname.toLowerCase() === (taxRate.taxname).toLowerCase());

    if (taxRate.taxname == "") {
      setShowAlert("Please enter tax name!");
      handleClickOpenalert();
    } else if (isNameMatch) {
      setShowAlert("Tax name already exits!");
      handleClickOpenalert();
    }
    else if (taxRate.taxrate == "") {
      setShowAlert("Please enter taxrate!");
      handleClickOpenalert();
    }
    else {
      sendRequest();
    }
  }

  return (
    <Box>
      <Headtitle title={'Taxrate - Create'} />
      <form onSubmit={addTaxRateSubmit}>
        <Typography sx={userStyle.HeaderText}>Add Tax Rate </Typography>
        <Box sx={userStyle.container}>
          <Box component="form" sx={{ '& .MuiTextField-root': { maxWidth: '100%', minWidth: '100%', width: '400px' }, '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #B97DF0', }, }} noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item sm={5} md={5}>
                <InputLabel htmlFor="component-outlined" >Name <b style={{ color: 'red' }}>*</b></InputLabel>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    id="component-outlined"
                    value={taxRate.taxname}
                    onChange={(e) => { setTaxRate({ ...taxRate, taxname: e.target.value }) }}
                    type='text'
                    name="taxname"
                    required
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item sm={5} md={5}>
                <InputLabel htmlFor="component-outlined" >Tax Rate% <b style={{ color: 'red' }}>*</b></InputLabel>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    id="component-outlined"
                    value={taxRate.taxrate}
                    onChange={(e) => { setTaxRate({ ...taxRate, taxrate: e.target.value }) }}
                    type='number'
                    name="taxrate"
                    required
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item sm={12} md={12}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={taxRate.fortaxgonly}
                    onClick={(e) => { setTaxRate({ ...taxRate, fortaxgonly: !taxRate.fortaxgonly }) }}
                  />} label={<div>For tax group only </div>}

                    name="fortaxgonly"
                  />
                </FormGroup> <br />
              </Grid>
            </Grid>
            <br />
          </Box>
        </Box>
        <Grid container sx={userStyle.gridcontainer}>
          <Grid>
          <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
            <Link to="/settings/taxrate/list" ><Button sx={userStyle.buttoncancel} >Cancel</Button></Link>
            <Button sx={userStyle.buttonadd} type="submit">Save</Button>
          </Grid>
        </Grid>
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
    </Box>
  );

}
function TaxrateCreate() {
  return (
    <>
       <TaxrateCreatelist /><br /><br /><br /><br />
          <Footer />
    </>
  );
}

export default TaxrateCreate;