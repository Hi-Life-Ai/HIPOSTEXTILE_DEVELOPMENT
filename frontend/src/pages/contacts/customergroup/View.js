import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Grid, InputLabel, FormControl, OutlinedInput } from '@mui/material';
import { userStyle } from '../../PageStyle';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Customergrpviewlist() {

  const { auth } = useContext(AuthContext);
  const [cgroups, setCgroups] = useState({ cusgroupname: "", cusgroupid: "" });

  const id = useParams().id

  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.CUSTOMER_GROUP_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setCgroups(response?.data?.scgroup)
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
      <Headtitle title={'View Customer group'} />
      <Box>
        <Grid display="flex">
          <Typography sx={userStyle.HeaderText}>View Customer Group</Typography>
        </Grid>
      </Box>
      <Box sx={userStyle.container}>
        <form>
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
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <Grid>
              <Link to="/contact/customergroup/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
            </Grid>
          </Grid>
        </form>
      </Box>
      <br />
    </Box>
  );
}
function Customergrpview() {
  return (
   <>
    <Customergrpviewlist /><br /><br /><br /><br />
          <Footer />
   </>
  );
}

export default Customergrpview;