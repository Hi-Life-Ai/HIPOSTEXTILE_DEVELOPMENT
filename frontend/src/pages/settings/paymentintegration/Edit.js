import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid,Dialog,DialogContent,DialogActions, FormControl, InputLabel, OutlinedInput, Select, MenuItem, Typography, FormGroup, FormControlLabel, Checkbox, Button, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Link, useParams } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

const Paymentintegrationeditlist = () => {

    const [payment, setPayment] = useState({});
    const [isLocation, setIsLocation] = useState({});
    const { auth } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext)

    const id = useParams().id

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

    // Fetch Payment integration data
    const fetchPayment = async () => {
        try {
            let response = await axios.get(`${SERVICE.PAYMENTINTEGRATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            
            let selectlocation = allLocations.length > 0 && allLocations.filter((data, index) => {
                return data.locationid == response?.data?.spaymentintegration?.businesslocation
            })
            setIsLocation(selectlocation[0]);
            setPayment(response?.data?.spaymentintegration)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    const backLPage = useNavigate();

    const sendRequest = async () => {
        try {
            let req = await axios.put(`${SERVICE.PAYMENTINTEGRATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(payment.businesslocation),
                cash: Boolean(payment.cash),
                card: Boolean(payment.card),
                cheque: Boolean(payment.cheque),
                bank: Boolean(payment.bank),
                upi: Boolean(payment.upi),
                cardnum: String(payment.cardnum),
                cardhname: String(payment.cardhname),
                cardtransnum: String(payment.cardtransnum),
                cardtype: String(payment.cardtype),
                month: String(payment.month),
                year: String(payment.year),
                securitycode: String(payment.securitycode),
                checkno: String(payment.checkno),
                baccno: String(payment.baccno),
                upino: String(payment.upino),
            });
            setPayment(req.data);
            toast.success(req.data.message,{
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/settings/paymentintegration/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchPayment();
    }, [id]);

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const editPaymentSubmit = (e) => {
        e.preventDefault();
        if (payment.businesslocation == "") {
            setShowAlert('Plesae select business Location!')
            handleClickOpen();
        } else {
            sendRequest();
        }
    }

    return (
        <Box>
            <Headtitle title={'Payment Integrations Edit'} />
            <form onSubmit={editPaymentSubmit}>
                <Typography sx={userStyle.HeaderText}>Edit Payment Integration</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={12}>
                        <InputLabel htmlFor="component-outlined" >Business Location <b style={{ color: "red" }}> *</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isLocation ? isLocation.name : ""}
                                    type='text'
                                    name="businesslocation"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Grid container spacing={2} >
                                <Grid item md={2.5} sm={6} xs={12}>
                                    <Typography variant="h6" >Payment Method</Typography><br />
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <Typography variant="h6" >Enable</Typography><br />
                                </Grid>
                                <Grid item md={7.5} sm={6} xs={12}> </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Grid container spacing={2} >
                                <Grid item md={2.5} sm={6} xs={12}>
                                    <Typography value={payment.cash}>Cash</Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.cash)} onChange={(e) => setPayment({ ...payment, cash: !payment.cash })} />} label="Cash" />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={7.5} sm={6} xs={12}></Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Grid container spacing={2} >
                                <Grid item md={2.5} sm={6} xs={12}>
                                    <Typography value={payment.card}>Card</Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.card)} onChange={(e) => setPayment({ ...payment, card: !payment.card })} />} label="Card" />
                                    </FormGroup>
                                </Grid>
                                {payment.card ?
                                    (
                                        <>
                                            <Grid item md={7.5} sm={6} xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item md={4} sm={6} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Card Number</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.cardnum}
                                                                onChange={(e) => { setPayment({ ...payment, cardnum: e.target.value }) }}
                                                                type='text'
                                                                name="cardnum"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} sm={6} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Card Holder Name</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.cardhname}
                                                                onChange={(e) => { setPayment({ ...payment, cardhname: e.target.value }) }}
                                                                type="text"
                                                                name="cardhname"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} sm={6} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Card Transaction No</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.cardtransnum}
                                                                onChange={(e) => { setPayment({ ...payment, cardtransnum: e.target.value }) }}
                                                                type='text'
                                                                name="cardtransnum"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <InputLabel id="demo-select-small">Card Type</InputLabel>
                                                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                                            <Select
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={payment.cardtype}
                                                                onChange={(e) => { setPayment({ ...payment, cardtype: e.target.value }) }}
                                                                name="cardtype"
                                                                fullWidth
                                                            >
                                                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                                                <MenuItem value="Debit Card">Debit Card</MenuItem>
                                                                <MenuItem value="Visa">Visa</MenuItem>
                                                                <MenuItem value="MasterCard">MasterCard</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Month</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.month}
                                                                onChange={(e) => { setPayment({ ...payment, month: e.target.value }) }}
                                                                type='text'
                                                                name="month"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Year</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.year}
                                                                onChange={(e) => { setPayment({ ...payment, year: e.target.value }) }}
                                                                type='text'
                                                                name="year"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Security Code</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.securitycode}
                                                                onChange={(e) => { setPayment({ ...payment, securitycode: e.target.value }) }}
                                                                type='text'
                                                                name="securitycode"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : null
                                }
                            </Grid>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Grid container spacing={2} >
                                <Grid item md={2.5} sm={6} xs={12}>
                                    <Typography value={payment.cheque}>Cheque</Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.cheque)} onChange={(e) => setPayment({ ...payment, cheque: !payment.cheque })} />} label="Cheque" />
                                    </FormGroup>
                                </Grid>
                                {payment.cheque ?
                                    (
                                        <>
                                            <Grid item md={7.5} sm={6} xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Cheque No.</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.checkno}
                                                                onChange={(e) => { setPayment({ ...payment, checkno: e.target.value }) }}
                                                                type='text'
                                                                name="checkno"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : null
                                }
                            </Grid>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Grid container spacing={2} >
                                <Grid item md={2.5} sm={6} xs={12}>
                                    <Typography value={payment.bank}>Bank</Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.bank)} onChange={(e) => setPayment({ ...payment, bank: !payment.bank })} />} label="Bank" />
                                    </FormGroup>
                                </Grid>
                                {payment.bank ?
                                    (
                                        <>
                                            <Grid item md={7.5} sm={6} xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <InputLabel htmlFor="component-outlined" >Bank Account No.</InputLabel>
                                                        <FormControl size="small" fullWidth >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                value={payment.baccno}
                                                                onChange={(e) => { setPayment({ ...payment, baccno: e.target.value }) }}
                                                                type='text'
                                                                name="baccno"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>

                                    ) : null
                                }
                            </Grid>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Grid container spacing={2} >
                                <Grid item md={2.5} sm={6} xs={12}>
                                    <Typography value={payment.upi}>UPI</Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.upi)} onChange={(e) => setPayment({ ...payment, upi: !payment.upi })} />} label="UPI" name="upi" />
                                    </FormGroup>
                                </Grid>
                                {payment.upi ? (
                                    <>
                                        <Grid item md={7.5} sm={6} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item md={4} sm={6} xs={12}>
                                                    <InputLabel htmlFor="component-outlined" >UPI No.</InputLabel>
                                                    <FormControl size="small" fullWidth >
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={payment.upino}
                                                            onChange={(e) => { setPayment({ ...payment, upino: e.target.value }) }}
                                                            type='text'
                                                            name="upi"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </>
                                ) : null}
                            </Grid>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/settings/paymentintegration/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                                <Button sx={userStyle.buttonadd} type='submit'>UPDATE</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form >
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
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >

    );
}
const Payintegrationedit = () => {
    return (
        <>
           <Paymentintegrationeditlist /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default Payintegrationedit;