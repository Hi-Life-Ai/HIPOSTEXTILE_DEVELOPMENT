import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Grid, FormControl, Dialog,DialogContent, DialogActions, OutlinedInput, InputLabel, Typography, } from "@mui/material";
import { userStyle } from "../../PageStyle";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from "../../../components/footer/Footer";
import axios from "axios";
import { useNavigate, useParams ,Link} from "react-router-dom";
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Unitviewlist() {

  const { auth } = useContext(AuthContext);
  const [unitForm, setUnitForm] = useState({});
 
  const id = useParams().id;

  // Get Datas
  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.UNIT_SINGLE}/${id}`,{
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setUnitForm(response?.data?.sunit);
    } catch (err) {
      const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
    }
  };

  useEffect(() => {
    fetchHandler();
  }, [id]);

  return (
    <Box>
      <Headtitle title={'View Unit'} />
      <Typography sx={userStyle.HeaderText}>View Unit</Typography>
      <form>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item md={6} lg={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Name <b style={{color:'red',}}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={unitForm.unit}
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
                  name="shortname"
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={userStyle.gridcontainer}>
              <Grid>
                <Link to="/product/unit/list"><Button sx={userStyle.buttoncancel} type='button'>BACK</Button></Link>
              </Grid>
            </Grid>
        </Box>
      </form>
    </Box>
  );
}

const Unitview = () => {
  return (
    <>
       <Unitviewlist /><br /><br /><br /><br />
            <Footer />
    </>
  );
};
export default Unitview;

