import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Typography, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Departmentviewlist() {

  const [isDepartment, setIsDepartment] = useState({});
  const { auth } = useContext(AuthContext);

  const id = useParams().id;

  // fetch particular id value
  const fetchDepartment = async () => {
    try {
      let req = await axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsDepartment(req?.data?.sdepartment);

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
      fetchDepartment();
    }, []
  )

  return (
    <Box>
      <Headtitle title={'View Department'} />
      {/* Form Start */}
      <form>
        <Typography sx={userStyle.HeaderText}>View Department</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Department ID<b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isDepartment.departmentid}
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Department Name<b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isDepartment.departmentname}
                  type="text"
                />
              </FormControl>
            </Grid>
          </Grid><br />

          <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <Link to="/user/department/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
          </Grid>
        </Box>
      </form>
    </Box>
  );
}

const Departmentsview = () => {
  return (
    <>
      <Departmentviewlist /><br /><br /><br />
            <Footer />
    </>
  );
}
export default Departmentsview;