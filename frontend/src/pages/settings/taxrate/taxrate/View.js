import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import { userStyle } from '../../../PageStyle';
import Footer from '../../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Headtitle from '../../../../components/header/Headtitle';

import { toast } from 'react-toastify';
import { SERVICE } from '../../../../services/Baseservice';
import { AuthContext } from '../../../../context/Appcontext';
const View = () => {

  const [taxRate, setTaxRate] = useState({});
  const { auth } = useContext(AuthContext);

  const id = useParams().id;

  // Get Datas
  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.TAXRATE_SINGLE}/${id}`,{
        headers: {
          'Authorization':`Bearer ${auth.APIToken}`
        }
      })
      setTaxRate(response?.data?.staxrate)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  }

  useEffect(() => {
    fetchHandler()
  }, [id]);

  return (
    <Box>
      <Headtitle title={'Taxrate - View'}/>
      <form>
        <Typography sx={userStyle.HeaderText}>View Tax Rate</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} >
            <Grid item sm={12} md={6}>
              <InputLabel htmlFor="component-outlined">Name<b style={{color:'red'}}>*</b></InputLabel>
              <FormControl size="small" fullWidth >
                <OutlinedInput
                  id="component-outlined"
                  value={taxRate.taxname}
                  type='text'
                  name="taxname"
                />
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6}>
              <InputLabel htmlFor="component-outlined">Tax Rate%<b style={{color:'red'}}>*</b></InputLabel>
              <Grid sx={{ display: "flex" }}>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    id="component-outlined"
                    value={taxRate.taxrate}
                    type='number'
                    name="taxRate"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={12} md={12}>
              <FormGroup>
                <FormControlLabel control={<Checkbox
                checked={Boolean(taxRate.fortaxgonly)}
                 />} label={<div>For tax group only </div>}
                  name="fortaxgonly"
                />
              </FormGroup> <br />
            </Grid>
          </Grid>
        </Box>
        <Grid container sx={userStyle.gridcontainer}>
          <Grid >
            <Link to ="/settings/taxrate/list" ><Button sx={userStyle.buttoncancel} >BACK</Button></Link>
          </Grid>
        </Grid>
      </form>
    </Box >
  );
}
const Taxrateview = () => {
  return (
    <>
       <View /><br /><br /><br /><br />
            <Footer />
    </>
  );
}

export default Taxrateview;