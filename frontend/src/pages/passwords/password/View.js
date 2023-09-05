import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography, Grid, InputLabel, FormControl, Box, OutlinedInput, TextareaAutosize } from '@mui/material';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import AddLinkIcon from '@mui/icons-material/AddLink';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import KeyIcon from '@mui/icons-material/Key';
import { userStyle } from '../../PageStyle';
import Password from '@mui/icons-material/Password';
import Dns from '@mui/icons-material/Dns';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../../context/Appcontext';
import { Link,  useParams } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';


function Passwordviewlist() {

    const { auth } = useContext(AuthContext);

    const [password, setPassword] = useState({});

    const id = useParams().id;

    // Password
    const fetchAllPassword = async () => {
        try {
            let req = await axios.get(`${SERVICE.PASSWORD_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setPassword(req?.data?.spassword);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }
    useEffect(
        () => {
            fetchAllPassword();
        }, []
    )

    return (
        <Box>
            <Headtitle title={'Passwords View'} />
            <Typography sx={userStyle.HeaderText}>View Password</Typography>
            <Box sx={userStyle.container}>
                <form>
                    <Grid container spacing={3}>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ justifyContent: 'center' }}>S.No</Typography>
                        </Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Fields</Typography>
                        </Grid>
                        <Grid item md={8} sm={6} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>1.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Password Code</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Auto Generate</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><ContactPageOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        name="autogenerate"
                                        value={password.passwordcode}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>2.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ display: "flex" }}>Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><Dns /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="name"
                                        value={password.name}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>3.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ display: "flex" }}>User Name<b style={{ color: "red", marginLeft: "2px" }}>*</b></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><AssignmentIndIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="username"
                                        value={password.username}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>4.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ display: "flex" }}>Password<b style={{ color: "red", marginLeft: "2px" }}>*</b></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><Password /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="password"
                                        name="password"
                                        value={password.password}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>5.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>TOTP Key</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><KeyIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="totpkey"
                                        value={password.totpkey}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>6.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Current TOTP Key</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><KeyIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="curtotpkey"
                                        value={password.curtotpkey}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>7.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Notes</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #b97df0' }}
                                    value={password.notes}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>8.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Url</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><AddLinkIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="url"
                                        value={password.url}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>9.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Logo</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12} sx={{ marginTop: '0px' }}>
                            <FormControl size="small" fullWidth>
                                <img src={password.logo} style={{ width: '75px', height: '75px' ,border:"1px solid" }} alt="img" />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/passwords/password/list"><Button sx={userStyle.buttoncancel} >Back</Button></Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
}

function Passwordview() {
    return (
       <>
         <Passwordviewlist /><br /><br /><br />
            <Footer /><br /><br />
       </>
    );
}
export default Passwordview;