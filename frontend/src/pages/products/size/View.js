import React, { useState, useEffect, useContext } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Button, Grid, Typography } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';

function Sizeviewlist() {

    const { auth } = useContext(AuthContext);

    const [sizeForm, setSizeForm] = useState({});
    const id = useParams().id;

    // Get Datas
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.SIZE_SINGLE}/${id}`,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                  },
            });
            setSizeForm(response?.data?.ssize);
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
            <Headtitle title={'View Size'} />
            <Typography sx={userStyle.HeaderText}>View Size</Typography>
            <form>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Size Name <b style={{color:'red',}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={sizeForm.sizename}
                                    type="text"
                                    name="sizename"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                           <Link to="/product/size/list"><Button sx={userStyle.buttoncancel} >Back</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box >
    );
}

function Sizeview() {
    return (
        <>
             <Sizeviewlist /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default Sizeview;