

import React, { useState, useContext, useEffect } from 'react';
import { Box, Table, TableRow, TableHead, Button, TableCell, TableContainer, Paper, TableBody, Grid, FormControl, OutlinedInput, InputLabel, Typography, } from '@mui/material';
import { userStyle, } from '../../PageStyle';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Rackviewlist() {

    const { auth, setngs } = useContext(AuthContext);

    const [rack, setRack] = useState({})

    //access...
    const { allLocations } = useContext(UserRoleAccessContext);

    // todo list list start
    const [todos, setTodos] = useState([]);

    // todo list list start
    const [isLocations, setIsLocations] = useState([]);
    const id = useParams().id
    // cascade sub category
    const searchSubcatename = async () => {
        try {
            let res = await axios.get(`${SERVICE.RACK_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            let selectlocation = allLocations?.filter((data, index) => {
                return data.locationid == res?.data?.srack?.businesslocation
            });
            setIsLocations(selectlocation);
            setRack(res?.data?.srack)
            setTodos(res?.data?.srack?.combinerack);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(() => { searchSubcatename() }, [])

    return (
        <Box>
            <Headtitle title={'View Rack'} />
            <Typography sx={userStyle.HeaderText}>View Rack</Typography>
            {/* content start */}
            <form>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel id="demo-select-small">Business Location<b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                   value={isLocations?.map((data, i) => data.name).join(',')}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Main Rack <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    name="mainrack"
                                    value={rack.mainrack}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                    </Grid><br />
                    <InputLabel id="demo-select-small">Display Rack</InputLabel><br />
                    <Grid container sx={{ display: "flex", }} >
                        {todos.map((item, index) => {
                            return (
                                <Grid spacing={2} item lg={1} md={1} sm={2} xs={2} >

                                    <Typography sx={{ border: "1px solid #1976d2", textAlign: "center", paddingTop: "20px", paddingBottom: "20px" }} >
                                        {item.subrackcode}
                                    </Typography>
                                </Grid>
                            )
                        })}&emsp;
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid sx={{ display: 'flex' }}>
                            <Link to="/product/rack/list"><Button sx={userStyle.buttoncancel}>Back</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form >
            {/* ALERT DIALOG */}
        </Box >
    );
}
function Rackview() {
    return (
        <>
             <Rackviewlist /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}

export default Rackview;