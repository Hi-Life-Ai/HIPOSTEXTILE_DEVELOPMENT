import React, { useState, useEffect, useContext } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Button, Grid, Typography } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Colorviewlist() {

    const { auth } = useContext(AuthContext);
    const [colors, setColors] = useState({});
    const id = useParams().id;

    // Get Datas
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.COLOR_SINGLE}/${id}`,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                  },
            });
            setColors(response?.data?.scolor);
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
        <Box >
            <Headtitle title={'View color'} />
            <Typography sx={userStyle.HeaderText}>View Color</Typography>
            <form>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Color Name <b style={{color:'red',}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={colors.colorname}
                                    type="text"
                                    name="colorname"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                           <Link to="/product/color/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

function Colorview() {
    return (
        <>
            <Colorviewlist /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default Colorview;