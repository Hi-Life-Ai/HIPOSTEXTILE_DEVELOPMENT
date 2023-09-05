import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Typography, Dialog, DialogContent, DialogActions, Select, MenuItem, } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Footer from '../../../components/footer/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import { toast } from 'react-toastify';
import axios from 'axios';

const Discounteditlist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext)
    const [isBusilocations, setIsBusilocations] = useState();

    const [disAddForm, setDisAddForm] = useState({
        businesslocation: "", discountid: "", name: "", products: "", category: "", subcategory: "", brand: "", subbrand: "", purchaseexcludetax: "",
        pruchaseincludetax: "", sellingvalue: "", discounttype: "", selectdiscountprice: "",
        discountamt: "", discountvalue: "", startsat: "", endsat: "", isactive: "",
    });

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.DISCOUNT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let selectlocation = allLocations.length > 0 && allLocations.filter((data, index) => {
                return data.locationid == response?.data?.sdiscount?.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setDisAddForm(response?.data?.sdiscount);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(() => {
        fetchHandler()
    }, [id]);

    let purExc = disAddForm.purchaseexcludetax
    let purInc = disAddForm.pruchaseincludetax
    let selExc = disAddForm.sellingvalue

    const getDiscount = () => {

        if (disAddForm.discounttype == "None") {
            setDisAddForm({
                ...disAddForm, discountvalue: disAddForm.discountvalue
            })
        }
        if (disAddForm.discounttype == "Fixed" || disAddForm.discounttype == "Amount") {
            if (disAddForm.selectdiscountprice == "Purchase Excluding Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purExc) - Number(disAddForm.discountamt)
                })
            }
            else if (disAddForm.selectdiscountprice == "Purchase Including Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purInc) - Number(disAddForm.discountamt)
                })
            }
            else if (disAddForm.selectdiscountprice == "Selling Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(selExc) - Number(disAddForm.discountamt)
                })
            }
        }
        if (disAddForm.discounttype == "Percentage") {
            if (disAddForm.selectdiscountprice == "Purchase Excluding Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purExc) - (Number(purExc) * (Number(disAddForm.discountamt) / 100))
                })
            }
            else if (disAddForm.selectdiscountprice == "Purchase Including Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purInc) - (Number(purExc) * (Number(disAddForm.discountamt) / 100))
                })
            }
            else if (disAddForm.selectdiscountprice == "Selling Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(selExc) - (Number(purExc) * (Number(disAddForm.discountamt) / 100))
                })
            }
        }
    }

    useEffect(() => {
        getDiscount();
    }, [disAddForm.discountamt, disAddForm.discountvalue])
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const bactToPage = useNavigate();

    const sendRequest = async () => {
        try {
            let req = await axios.put(`${SERVICE.DISCOUNT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(disAddForm.businesslocation),
                discountid: String(disAddForm.discountid),
                name: String(disAddForm.name),
                products: String(disAddForm.products),
                category: String(disAddForm.category),
                subcategory: String(disAddForm.subcategory),
                brand: String(disAddForm.brand),
                subbrand: String(disAddForm.subbrand),
                purchaseexcludetax: Number(disAddForm.purchaseexcludetax),
                pruchaseincludetax: Number(disAddForm.pruchaseincludetax),
                sellingvalue: Number(disAddForm.sellingvalue),
                discounttype: String(disAddForm.discounttype),
                selectdiscountprice: String(disAddForm.selectdiscountprice),
                discountamt: Number(disAddForm.discountamt),
                discountvalue: Number(disAddForm.discountvalue),
                startsat: String(disAddForm.startsat),
                endsat: String(disAddForm.endsat),
                assignbusinessid: String(setngs.businessid),
            });
            setDisAddForm(req.data)
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            bactToPage('/product/discount/list');
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (disAddForm.businesslocation == "") {
            setShowAlert("Please Select Location!")
            handleClickOpen();
        }
        else if (disAddForm.name == "") {
            setShowAlert("Please Enter Name!")
            handleClickOpen();
        }
        else if (disAddForm.products == "") {
            setShowAlert("Please Select Product Name!")
            handleClickOpen();
        }
        else if (disAddForm.discounttype == "") {
            setShowAlert("Please Select Discount Type!")
            handleClickOpen();
        }
        else if (disAddForm.discountamt == "") {
            setShowAlert("Please Enter Discount Amount!")
            handleClickOpen();
        }
        else {
            sendRequest();
        }
    }

    const handleBack = () => {
        bactToPage('/product/discount/list')
    }

    const handleValidationAmount = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[`₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setDisAddForm({ ...disAddForm, discountamt: value })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setDisAddForm({ ...disAddForm, discountamt: value })
        }
    }

    return (
        <Box>
            <Headtitle title={'Edit Discount'} />
            <Typography sx={userStyle.HeaderText}>Edit Discount</Typography>
            <Box sx={userStyle.container}>
                <form onSubmit={handleEditSubmit}>
                    <Grid container spacing={3}>
                        {/* Grid one */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ display: "flex" }}>Location <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isBusilocations ? isBusilocations.name : ""}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Discount Id</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discountid}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.name}
                                />
                            </FormControl>
                        </Grid>

                        {/* Grid two */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Product Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        size='small'
                                        value={disAddForm.products}
                                    />
                                </FormControl>

                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.category}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub Category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.subcategory}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Brand</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.brand}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub Brand</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.subbrand}
                                />
                            </FormControl>
                        </Grid>
                        {/* Grid three */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Excluding Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.purchaseexcludetax}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Including Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.pruchaseincludetax}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Selling Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.sellingvalue}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ display: "flex" }}>Discount Type <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.discounttype}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, discounttype: e.target.value }) }}
                                >
                                    <MenuItem value="selectdiscounttype" onClick={(e) => { getDiscount() }}>None</MenuItem>
                                    <MenuItem value="Fixed" onClick={(e) => { getDiscount() }}>Fixed</MenuItem>
                                    <MenuItem value="Amount" onClick={(e) => { getDiscount() }}>Amount</MenuItem>
                                    <MenuItem value="Percentage" onClick={(e) => { getDiscount() }}>Percentage</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Select Discount Price</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    id="demo-select-small"
                                    value={disAddForm.selectdiscountprice}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, selectdiscountprice: e.target.value }); }}
                                >
                                    <MenuItem value="Purchase Including Tax" onClick={(e) => { getDiscount() }}>Purchase Including Tax</MenuItem>
                                    <MenuItem value="Purchase Excluding Tax" onClick={(e) => { getDiscount() }}>Purchase Excluding Tax</MenuItem>
                                    <MenuItem value="Selling Tax" onClick={(e) => { getDiscount() }}>Selling Tax</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Discount Amount <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discountamt}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, discountamt: e.target.value, }); handleValidationAmount(e) }}
                                />
                            </FormControl>
                        </Grid>
                        {/* Grid four */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Discount value</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discountvalue}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Start At</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.startsat}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, startsat: e.target.value }) }}
                                    type="date"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Ends At</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.endsat}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, endsat: e.target.value }) }}
                                    type="date"
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Button sx={userStyle.buttoncancel} onClick={handleBack}>CANCEL</Button>
                                <Button autoFocus sx={userStyle.buttonadd} type="submit" disableRipple>UPDATE</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
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
        </Box>
    );
}
function Discountedit() {
    return (

        <>
            <Discounteditlist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default Discountedit;