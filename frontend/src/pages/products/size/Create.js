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

function Sizecreatetable() {

    const { auth, setngs } = useContext(AuthContext);
    const [sizeData, setSizeData] = useState([])
    const [sizeForm, setSizeForm] = useState({ sizename: "" });

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


    // Size
    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setSizeData(res.data.sizes);
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
            let req = await axios.post(SERVICE.SIZE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                sizename: String(sizeForm.sizename),
                assignbusinessid: String(setngs.businessid),
            });
            setSizeForm(req.data);
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/product/size/list');
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

    // size clear
    const handleClear = () => {
        setSizeForm({
            sizename: "",
        })
    }

    // Add Datas
    const sendRequestOther = async () => {
        try {
            let req = await axios.post(SERVICE.SIZE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                sizename: String(sizeForm.sizename),
                assignbusinessid: String(setngs.businessid),
            });
            await fetchData();
            setSizeForm({ ...sizeForm, sizename: "" });
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
        backLPage('/product/size/list');
    }

    const addSizeSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = sizeData.some(item => item.sizename.toLowerCase() === (sizeForm.sizename).toLowerCase());

        if (sizeForm.sizename == "") {
            setShowAlert("Please enter size name!");
            handleClickOpen();
        } else if (isNameMatch) {
            setShowAlert("Sizename Already Exists");
            handleClickOpen();
        } else {
            sendRequest();
        }
    };

    const addSizeSubmitOther = (e) => {
        e.preventDefault();
        const isNameMatch = sizeData.some(item => item.sizename.toLowerCase() === (sizeForm.sizename).toLowerCase());

        if (sizeForm.sizename == "") {
            setShowAlert("Please enter size name!");
            handleClickOpen();
        } else if (isNameMatch) {
            setShowAlert("Sizename Already Exists");
            handleClickOpen();
        } else {
            sendRequestOther();
        }
    };

    return (
        <Box>
            <Headtitle title={'Add size'} />
            {/* header text */}
            <form>
                <Typography sx={userStyle.HeaderText}>Add Size</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Size Name <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={sizeForm.sizename}
                                    onChange={(e) => { setSizeForm({ ...sizeForm, sizename: e.target.value }) }}
                                    type="text"
                                    name="sizename"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                            <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Button sx={userStyle.buttoncancel} onClick={handleCancel}>CANCEL</Button>
                            <Button sx={userStyle.buttonadd} onClick={addSizeSubmitOther}>Save And Add Another</Button>
                            <Button sx={userStyle.buttonadd} onClick={addSizeSubmit}>SAVE</Button>
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

function Sizecreate() {
    return (
       <>
        <Sizecreatetable /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}
export default Sizecreate;
