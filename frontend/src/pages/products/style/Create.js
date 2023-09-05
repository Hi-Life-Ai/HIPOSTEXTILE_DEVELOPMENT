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

function Stylecreatetable() {

    const { auth, setngs } = useContext(AuthContext);
    const [styleData, setStyleData] = useState([])
    const [styleForm, setstyleForm] = useState({ stylename: "" });

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



    // style
    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.STYLE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setStyleData(res.data.styles);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const backLPage = useNavigate();

    // Add Datas
    const sendRequest = async () => {
        try {
            let req = await axios.post(SERVICE.STYLE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                stylename: String(styleForm.stylename),
                assignbusinessid: String(setngs.businessid),
            });
            setstyleForm(req.data);
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/product/style/list');
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

    	
    // style
    const handleClear = () => {
        setstyleForm({
            stylename: "" 
        })
    }

    // Add Datas
    const sendRequestOther = async () => {
        try {
            let req = await axios.post(SERVICE.STYLE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                stylename: String(styleForm.stylename),
                assignbusinessid: String(setngs.businessid),
            });
            await fetchData();
            setstyleForm({ ...styleForm, stylename: "" });
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

    const handleCancel = () => {
        backLPage('/product/style/list');
    }

    const addStyleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = styleData.some(item => item.stylename.toLowerCase() === (styleForm.stylename).toLowerCase());

        if (styleForm.stylename == "") {
            setShowAlert("Please enter style name!");
            handleClickOpen();
        } else if (isNameMatch) {
            setShowAlert("Stylename already exists");
            handleClickOpen();
        } else {
            sendRequest();
        }
    };

    const addStyleSubmitOther = (e) => {
        e.preventDefault();
        const isNameMatch = styleData.some(item => item.stylename.toLowerCase() === (styleForm.stylename).toLowerCase());

        if (styleForm.stylename == "") {
            setShowAlert("Please enter style name!");
            handleClickOpen();
        } else if (isNameMatch) {
            setShowAlert("Stylename Already Exists");
            handleClickOpen();
        } else {
            sendRequestOther();
        }
    };

    return (
        <Box>
            <Headtitle title={'Add Style'} />
            {/* header text */}
            <form>
                <Typography sx={userStyle.HeaderText}>Add Style</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Style Name <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={styleForm.stylename}
                                    onChange={(e) => { setstyleForm({ ...styleForm, stylename: e.target.value }) }}
                                    type="text"
                                    name="stylename"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                        <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Button sx={userStyle.buttoncancel} onClick={handleCancel}>CANCEL</Button>
                            <Button sx={userStyle.buttonadd} onClick={addStyleSubmitOther}>Save And Add Another</Button>
                            <Button sx={userStyle.buttonadd} onClick={addStyleSubmit}>SAVE</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
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
        </Box>
    );
}

function Stylecreate() {
    return (
        <>
             <Stylecreatetable /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default Stylecreate;