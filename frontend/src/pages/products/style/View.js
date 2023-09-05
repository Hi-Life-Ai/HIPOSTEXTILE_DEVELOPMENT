import React, { useState, useEffect, useContext } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Button, Grid, Typography} from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';

function StyleViewlist() {

    const { auth } = useContext(AuthContext);

    const [styleForm, setstyleForm] = useState({});
    const id = useParams().id;

    // Get Datas
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.STYLE_SINGLE}/${id}`,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                  },
            });
            setstyleForm(response?.data?.sstyle);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const backLPage = useNavigate();

    useEffect(() => {
        fetchHandler();
    }, [id]);


    const handleCancel = () =>{
        backLPage('/product/style/list');
    }

    return (
        <Box>
            <Headtitle title={'View Style'} />
            <Typography sx={userStyle.HeaderText}>View Style</Typography>
            <form>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Style Name <b style={{color:'red',}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={styleForm.stylename}
                                    type="text"
                                    name="stylename"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                            <Button sx={userStyle.buttoncancel} onClick={handleCancel}>BACK</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box >
    );
}

function StyleView() {
    return (
       <>
        <StyleViewlist /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}
export default StyleView;