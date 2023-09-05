import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Grid, Button, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Colorcreatetable() {

    const { auth, setngs } = useContext(AuthContext);
    const [allColors, setAllColors] = useState([])
    const [colors, setColors] = useState({ colorname: "" });

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };



    // Color
    const fetchColor = async () => {
        try {
            let res = await axios.post(SERVICE.COLOR, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setAllColors(res?.data?.colors);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    useEffect(() => {
        fetchColor()
    }, [])

    const backLPage = useNavigate();

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    // Add Datas
    const sendRequest = async () => {
        try {
            let req = await axios.post(SERVICE.COLOR_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                colorname: String(colors.colorname),
                assignbusinessid: String(setngs.businessid),
            });
            setColors(req.data);
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/product/color/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    };

    // color
    const handleClear = () => {
        setColors({ colorname: "" })
    }

    const sendRequestOther = async () => {
        try {
            let req = await axios.post(SERVICE.COLOR_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                colorname: String(colors.colorname),
                assignbusinessid: String(setngs.businessid),
            });
            await fetchColor();
            setColors({ ...colors, colorname: "" });
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    };

    const addColorSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allColors.some(item => item.colorname.toLowerCase() === (colors.colorname).toLowerCase());

        if (isNameMatch) {
            setShowAlert("Color already exists");
            handleClickOpen();
        }
        else if (colors.colorname == "") {
            setShowAlert("Please enter colour name");
            handleClickOpen();
        } else {
            sendRequest()
        }
    };

    const addColorSubmitOther = (e) => {
        e.preventDefault();
        const isNameMatch = allColors.some(item => item.colorname.toLowerCase() === (colors.colorname).toLowerCase());

        if (isNameMatch) {
            setShowAlert("Color already exists");
            handleClickOpen();
        }
        else if (colors.colorname == "") {
            setShowAlert("Please enter colour name");
            handleClickOpen();
        } else {
            sendRequestOther()
        }
    };

    const handleCancel = () => {
        backLPage('/product/color/list');
    }

    return (
        <Box>
            <Headtitle title={'Add color'} />
            {/* header text */}
            <form>
                <Typography sx={userStyle.HeaderText}>Add Color</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Color Name <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={colors.colorname}
                                    onChange={(e) => { setColors({ ...colors, colorname: e.target.value }) }}
                                    type="text"
                                    name="colorname"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                        <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Button sx={userStyle.buttoncancel} onClick={handleCancel}>CANCEL</Button>
                            <Button sx={userStyle.buttonadd} onClick={addColorSubmitOther}>Save And Add Another</Button>
                            <Button sx={userStyle.buttonadd} onClick={addColorSubmit}>SAVE</Button>
                            
                        </Grid>
                    </Grid>
                </Box>
                {/* ALERT DIALOG */}
                <Box>
                    <Dialog
                        open={isErrorOpen}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                            <Typography variant="h6" >{showAlert}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </form>
        </Box>
    );
}

function Colorcreate() {
    return (
        <>
             <Colorcreatetable /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default Colorcreate;
