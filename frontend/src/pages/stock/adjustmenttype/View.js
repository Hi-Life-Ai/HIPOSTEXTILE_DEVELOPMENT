import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Grid, Button, Typography, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function AdjustmentView() {

    const { auth } = useContext(AuthContext);

    const [adjustment, setAdjustment] = useState({
        adjustmentitem: "", mode: ""
    });

    const id = useParams().id;
    // Add Datas
    const getAdjustment = async () => {
        try {
            let req = await axios.get(`${SERVICE.ADJUSTMENTTYPE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });
            setAdjustment(req?.data?.sadjustment)
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong")
            }
        }
    }
    useEffect(() => { getAdjustment() }, [])

    return (
        <Box>
            <Headtitle title={'View Adjustment Type Master'} />
            {/* header text */}
            <form>
                <Typography sx={userStyle.HeaderText}>View Adjustment Type</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item lg={5} md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Adjustment Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={adjustment.adjustmentitem}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={5} md={6} sm={12} xs={12} >
                            <InputLabel id="demo-select-small">Mode</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={adjustment.mode}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                            <Link to="/stock/adjustmenttype/create"><Button sx={userStyle.buttoncancel} >back</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

function AdjustmentTypeView() {
    return (
        <>
            <AdjustmentView /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default AdjustmentTypeView;