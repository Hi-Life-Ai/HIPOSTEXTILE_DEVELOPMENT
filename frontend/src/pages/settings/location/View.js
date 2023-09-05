import React, { useState, useContext } from 'react';
import { Button, Box, Grid, FormControl, Typography, InputLabel, OutlinedInput, TextareaAutosize } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function BusinessLocviewlist() {

    const [businsLoca, setBusinsLoca] = useState({});
    const { auth } = useContext(AuthContext);

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setBusinsLoca(response?.data?.sbusilocation);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(() => {
        fetchHandler()
    }, [id]);

    return (
        <Box>
            <Headtitle title={'BusinessLocation View'} />
            <form >
                <Typography sx={userStyle.HeaderText}>View Business Locations</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <InputLabel htmlFor="component-outlined">Business Name <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="business name"
                                    type="text"
                                    value={businsLoca.businessname}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <InputLabel htmlFor="component-outlined">Location Name <b style={{ color: "red" }}> *</b></InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="locationname"
                                    type="text"
                                    value={businsLoca.locationname}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Location Id</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="location id"
                                    type="text"
                                    value={businsLoca.locationid}
                                    readOnly
                                />
                            </FormControl>
                            <Typography variant="body2" sx={{ marginTop: "5px" }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Landmark</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="Landmark"
                                    type="text"
                                    value={businsLoca.landmark}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Address</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={businsLoca.address}
                                    name="address"
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Country</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="country"
                                    type="text"
                                    value={businsLoca.country}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">State</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="state"
                                    type="text"
                                    value={businsLoca.state}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">City</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="city"
                                    type="text"
                                    value={businsLoca.city}
                                    readOnly
                                />
                            </FormControl>

                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Zipcode</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="zipcode"
                                    type="number"
                                    value={businsLoca.zipcde}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile Number</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber"
                                    type="number"
                                    value={businsLoca.phonenumber}
                                    readOnly
                                />
                            </FormControl>

                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile 1</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber 1"
                                    type="number"
                                    value={businsLoca.onephonenumber}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile 2</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber 2"
                                    type="number"
                                    value={businsLoca.twophonenumber}
                                    readOnly
                                />
                            </FormControl>

                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile 3</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber 3"
                                    type="number"
                                    value={businsLoca.threephonenumber}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Landline Number</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="Landline number"
                                    type="text"
                                    value={businsLoca.landlinenumber}
                                    readOnly />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">WhatsApp <b style={{ color: "red" }}> *</b></InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="whatsappno"
                                    type="number"
                                    value={businsLoca.whatsappno}
                                    readOnly
                                />
                            </FormControl>

                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Email</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="email"
                                    type="email"
                                    value={businsLoca.email}
                                    readOnly />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Website</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="website"
                                    type="text"
                                    value={businsLoca.website}
                                    readOnly />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/settings/location/list"><Button sx={userStyle.buttoncancel}>Back</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}
function Businesslocationview() {
    return (

        <>
             <BusinessLocviewlist /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}



export default Businesslocationview;