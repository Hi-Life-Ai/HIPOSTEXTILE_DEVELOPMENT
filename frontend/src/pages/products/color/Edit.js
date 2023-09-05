import React, { useState, useEffect, useContext } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Button, Grid, Typography, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Coloreditlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [allColors, setAllColors] = useState([])
    const [colors, setColors] = useState({});

    // popup model
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
    const [overallColor, setOverAlColor] = useState("")
    const [getColor, setGetColor] = useState("")
    const [EditColorCount, setEditColorCount] = useState(0)

    // error popup modal
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    const id = useParams().id;

    // Get Datas
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.COLOR_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setColors(response?.data?.scolor);
            getEditId(response?.data?.scolor?.colorname);
            setGetColor(response?.data?.scolor?.colorname);
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

    // Color
    const fetchColor = async () => {
        try {
            let res = await axios.post(SERVICE.COLOR, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setAllColors(res?.data?.colors?.filter(item => item._id !== colors._id));
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
            let res = await axios.post(SERVICE.COLOR_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                colorname: String(value)
            });
            setEditColorCount(res?.data?.colorname?.length)
            setOverAlColor(`The ${value} is linked in ${res?.data?.colorname?.length > 0 ? "Product ," : ""} whether you want to do changes ..??`)
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
            let res = await axios.post(SERVICE.COLOR_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                colorname: getColor
            });
            editOveAllDepartment(res.data.colorname)
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

    const editOveAllDepartment = async (product) => {
        try {

            if (product?.length > 0) {
                let result = product.map((data, index) => {
                    let request = axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        color: String(colors.colorname),
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
            let req = await axios.put(`${SERVICE.COLOR_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                colorname: String(colors.colorname),
            });
            setColors(req.data);
            await getOverAlldepUpdate();
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/product/color/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const editSizeSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allColors.some(item => item.colorname.toLowerCase() === (colors.colorname).toLowerCase());

        if (colors.colorname == "") {
            setShowAlert("Please enter colour name");
            handleClickOpen();
        }
        else if (isNameMatch) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Color already exits!"}
                    </p>
                </>
            );
            handleClickOpenerrpop();
        }
        else if (colors.colorname != getColor && EditColorCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {overallColor}
                    </p>
                </>
            )
            handleClickOpenerrpop();

        } else {
            sendEditRequest();
        }

    };

    const handlecancel = () => {
        backLPage('/product/color/list');
    }

    return (
        <Box >
            <Headtitle title={'Edit color'} />
            <Typography sx={userStyle.HeaderText}>Edit Color</Typography>
            <form onSubmit={editSizeSubmit}>
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
                            <Button sx={userStyle.buttoncancel} onClick={handlecancel}>CANCEL</Button>
                            <Button sx={userStyle.buttonadd} type="submit"> UPDATE </Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>

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

function Coloredit() {
    return (
<>
<Coloreditlist /><br /><br /><br /><br />
                    <Footer />
    </>
    );
}
export default Coloredit;