import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Typography, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Brandviewlist() {

  const [isCategory, setIsCategory] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const { auth } = useContext(AuthContext);
  const id = useParams().id;

  // fetch particular id value
  const fetchCategory = async () => {
    try {
      let req = await axios.get(`${SERVICE.BRAND_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsCategory(req?.data?.sbrand);
      setSubCategories(req?.data?.sbrand?.subbrands);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  useEffect(
    () => {
      fetchCategory();
    }, []
  )


  return (
    <Box>
      <Headtitle title={'View Brand'} />
      {/* Form Start */}
      <form>
        <Typography sx={userStyle.HeaderText}>View Brand</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Brand name <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isCategory.brandname}
                  type="text"
                  name="brandname"
                />
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Brand Short Name <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isCategory.brandshortname}
                  type="text"
                  name="brandshortname"
                />
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Brand Code <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isCategory.brandcode}
                />
              </FormControl>
            </Grid>
          </Grid><br />
          {
            subCategories.length >= 0 && (
              <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
                {subCategories.map((item, index) => {
                  return (
                    <li key={index}>
                      <br />
                      <Grid container columnSpacing={1}>
                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                          <InputLabel htmlFor="component-outlined">Sub Brand Name</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subbrandname}
                              type="text"
                              name="categoryname"
                              placeholder="Sub Brand Name"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                          <InputLabel htmlFor="component-outlined">Sub Brand Short Name</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subbrandshotname}
                              type="text"
                              name="categoryname"
                              placeholder="Sub Brand Shot Name"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                          <InputLabel htmlFor="component-outlined">Sub Brand Code</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subbrandcode}
                              name="categoryname"
                              placeholder="Sub Brand Code"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </li>
                  )
                })}
              </ul>
            )
          } <br />
          <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <Link to="/product/brand/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
          </Grid>
        </Box>
      </form>
      {/* Form End */}
    </Box>
  );
}

const Brandview = () => {
  return (
    <>
      <Brandviewlist /><br /><br /><br /><br />
            <Footer />
    </>
  );
}
export default Brandview;