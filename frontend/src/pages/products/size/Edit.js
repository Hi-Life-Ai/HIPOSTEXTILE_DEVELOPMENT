import React, { useState, useEffect, useContext } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';

function Sizeeditlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [sizeData, setSizeData] = useState([])
    const [sizeForm, setSizeForm] = useState({});

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

  

    // check edit
    const [overallSize, setOverAlSize] = useState("")
    const [getSize, setGetSize] = useState("")
    const [EditSizeCount, setEditSizeCount] = useState(0)

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    const id = useParams().id;

    // Get Datas
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.SIZE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setSizeForm(response?.data?.ssize);
            getEditId(response?.data?.ssize?.sizename);
            setGetSize(response?.data?.ssize?.sizename);
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
        fetchHandler();
    }, [id]);

    // Size
    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setSizeData(res.data.sizes?.filter(item => item._id !== sizeForm._id));
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

    const getEditId = async (value) => {
        try {
            let res = await axios.post(SERVICE.EDIT_SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                sizename: String(value)
            });
            setEditSizeCount(res?.data?.count)
            setOverAlSize(`The ${value} is linked in ${res?.data?.sizename?.length > 0 ? "Product " : ""} 
                ${res?.data?.stock?.length > 0 ? "Stock " : ""}
                whether you want to do changes ..??`
            )
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };


    const getOverAlldepUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.EDIT_SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                sizename: getSize

            });
            editOveAllDepartment(res?.data?.sizename, res?.data?.stock,)
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }

        }
    };

    const editOveAllDepartment = async (product, stock) => {
        try {

            if (product?.length > 0) {
                let result = product.map((data, index) => {
                    let request = axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        size: String(sizeForm.sizename),
                    });
                })
            }
            if (stock?.length > 0) {
                let answ = stock.map((d, i) => {
                    const updatedTodos = d.products.map(data => {
                        if (data.size === getSize) {
                            return { ...data, size: sizeForm.sizename };
                        }
                    });
                    let res = axios.put(`${SERVICE.STOCK_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        products: updatedTodos,
                    });
                })
            }
        } catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const backLPage = useNavigate();

    const sendEditRequest = async () => {
        try {
            let req = await axios.put(`${SERVICE.SIZE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                sizename: String(sizeForm.sizename),
            });
            setSizeForm(req.data);
            await getOverAlldepUpdate();
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

    const editSizeSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = sizeData.some(item => item.sizename.toLowerCase() === (sizeForm.sizename).toLowerCase());

        if (sizeForm.sizename == "") {
            setShowAlert("Please enter size name!");
            handleClickOpen();
        }
        else if (isNameMatch) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Sizename already exits!"}
                    </p>
                </>
            );
            handleClickOpenerrpop();
        }
        else if (sizeForm.sizename != getSize && EditSizeCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {overallSize}
                    </p>
                </>
            )
            handleClickOpenerrpop();

        } else {
            sendEditRequest();
        }
    };
    const handleCancel = () => {
        backLPage('/product/size/list');
    }

    return (
        <Box>
            <Headtitle title={'Edit Size'} />
            <Typography sx={userStyle.HeaderText}>Edit Size</Typography>
            <form onSubmit={editSizeSubmit}>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Size Name <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
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
                            <Button sx={userStyle.buttoncancel} onClick={handleCancel}>CANCEL</Button>
                            <Button sx={userStyle.buttonadd} type="submit"> UPDATE </Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={() => {
                            sendEditRequest();
                            handleCloseerrpop();
                        }}>
                            ok
                        </Button>
                        <Button
                            sx={userStyle.buttoncancel}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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
        </Box >
    );
}

function Sizeedit() {
    return (
       <>
            <Sizeeditlist /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}
export default Sizeedit;