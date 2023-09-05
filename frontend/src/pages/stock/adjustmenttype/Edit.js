import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Grid, Button, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import Selects from "react-select";

function AdjustmentTypeEdittable() {

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;


    const { auth, setngs } = useContext(AuthContext);

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

    // check edit
    const [overAllAdjustType, setOverAllAdjustType] = useState("");
    const [getProduct, setGetAdjustType] = useState("");
    const [editAdjustTypeCount, setEditAdjustTypeCount] = useState("");

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    const mode = [
        { value: "Add", label: 'Add', },
        { value: "Sub", label: 'Sub', }
    ]
    const [adjustment, setAdjustment] = useState({
        adjustmentitem: "", mode: ""
    });

    const backLPage = useNavigate();

    const id = useParams().id;

    // Add Datas
    const getAdjustment = async () => {
        try {
            let res = await axios.get(`${SERVICE.ADJUSTMENTTYPE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });
            setAdjustment(res?.data?.sadjustment)
            getOverallEditAdjustType(res?.data?.sadjustment?.adjustmentitem)
            setGetAdjustType(res?.data?.sadjustment?.adjustmentitem)
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

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);
        

    //overall edit section for all pages 
    const getOverallEditAdjustType = async (e) => {
        try {
            let res = await axios.post(SERVICE.ADJUSTMENTTYPE_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                adjustmenttype: String(e),
            });
            setEditAdjustTypeCount(res?.data?.count);
            setOverAllAdjustType(`The ${e} is linked in 
                ${res?.data?.adjustmenttype?.length > 0 ? "Stock Adjust ," : ""} whether you want to do changes ..??`
            )
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    //overall edit section for all pages 
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.ADJUSTMENTTYPE_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                adjustmenttype: getProduct,
            });
            sendEditRequestOverall(res?.data?.purchase, res?.data?.purchasereturn,
                res?.data?.pos, res?.data?.draft, res?.data?.quotation)
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    const sendEditRequestOverall = async (adjustmenttype) => {
        try {
            if (adjustmenttype?.length > 0) {
                let answ = adjustmenttype.map((d, i) => {
                    const updatedTodos = d.transferproducts.map(data => {
                        if (data.adjustmenttype === getProduct) {
                            return { ...data, prodname: adjustment.adjustmentitem };
                        }
                    });
                    let res = axios.put(`${SERVICE.STOCK_ADJUSTMENT_SINGLE}/${d._id}`, {
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
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something 8 went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    const sendRequest = async () => {
        try {
            let req = await axios.put(`${SERVICE.ADJUSTMENTTYPE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                adjustmentitem: String(adjustment.adjustmentitem),
                mode: String(adjustment.mode),
                today: String(today),

            });
            await getOverallEditSectionUpdate()
            backLPage('/stock/adjustmenttype/create');
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
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

    const addStyleSubmit = (e) => {
        e.preventDefault();
        if (adjustment.adjustmentitem != getProduct && editAdjustTypeCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {overAllAdjustType} </p>
                </>
            );
            handleClickOpenerrpop()
        }
        else {
            sendRequest();
        }
    };

    return (
        <Box>
            <Headtitle title={' Edit Adjustment Type'} />
            {/* header text */}
            <form onSubmit={addStyleSubmit}>
                <Typography sx={userStyle.HeaderText}>Edit Adjustment Type</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item lg={5} md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Adjustment Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={adjustment.adjustmentitem}
                                    onChange={(e) => { setAdjustment({ ...adjustment, adjustmentitem: e.target.value }) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={5} md={6} sm={12} xs={12} >
                            <InputLabel id="demo-select-small">Mode</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <Selects
                                        options={mode}
                                        value={{ label: adjustment.mode, value: adjustment.mode }}
                                        onChange={(e) => { setAdjustment({ ...adjustment, mode: e.value }); }}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                            <Link to="/stock/adjustmenttype/create"><Button sx={userStyle.buttoncancel} >cancel</Button></Link>
                            <Button sx={userStyle.buttonadd} type="submit">update</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>

            {/* Check edit popup */}
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
                            sendRequest();
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
        </Box>
    );
}

function AdjustmenttypeEdit() {
    return (
        <>
             <AdjustmentTypeEdittable /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default AdjustmenttypeEdit;