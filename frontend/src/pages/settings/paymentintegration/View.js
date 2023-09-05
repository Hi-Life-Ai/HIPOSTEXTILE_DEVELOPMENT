import React, { useState, useEffect , useContext} from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Select, MenuItem, Typography, FormGroup, FormControlLabel, Checkbox, Button, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

const Paymentintegrationviewlist = () => {

    const [payment, setPayment] = useState({});
    const [isLocation, setIsLocation] = useState({});
    const { auth } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext)

    const id = useParams().id

    //  Payments
    const fetchPayment = async () => {
        try {
            let response = await axios.get(`${SERVICE.PAYMENTINTEGRATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setPayment(response?.data?.spaymentintegration);
            
            let selectlocation = allLocations.length > 0 && allLocations.filter((data, index) => {
                return data.locationid == response?.data?.spaymentintegration?.businesslocation
            })
            setIsLocation(selectlocation[0]);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(() => {
        fetchPayment();
    }, [id]);

    return (
        <Box >
            <Headtitle title={'Payment Integrations View'} />
            <Typography sx={userStyle.HeaderText}>View Payment Integration</Typography>
            <Box sx={userStyle.container}>
                <Box>
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
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.cash)} />} label="Cash" name="cash" />
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
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.card)} />} label="Card" name="Card" />
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
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.cheque)} />} label="Cheque" name="Cheque" />
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
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.bank)}  />} label="Bank" npi="bank"/>
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
                                        <FormControlLabel control={<Checkbox checked={Boolean(payment.upi)} />} label="UPI" name="upi"  />
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
                                <Link to="/settings/paymentintegration/list"><Button sx={userStyle.buttoncancel}>Back</Button></Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box >
    );
}
const Payintegrationview = () => {
    return (
        <>
            <Paymentintegrationviewlist /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default Payintegrationview;