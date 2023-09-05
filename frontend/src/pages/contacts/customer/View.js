import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, InputLabel, FormControl, Typography, Box, OutlinedInput, Tooltip, IconButton } from '@mui/material';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BusinessCenterIconOutlined from '@mui/icons-material/BusinessCenterOutlined';
import EmailIconOutlined from '@mui/icons-material/EmailOutlined';
import MobileScreenShareIconOutlined from '@mui/icons-material/MobileScreenShareOutlined';
import ArrowDropDownIconOutlined from '@mui/icons-material/ArrowDropDownOutlined';
import LocationOnIconOutlined from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FcInfo } from "react-icons/fc";
import { FaInfo } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Customerviewlist() {

    const { auth } = useContext(AuthContext);
    const [customHide, setCustomHide] = useState(true);
    const [hidden, setHidden] = useState(true);

    const [addSupModForm, setAddSupModForm] = useState({
        contacttype: "", customergroup: "", paytermassign: "",
    });

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.CUSTOMER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setAddSupModForm(response?.data?.scustomer);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(
        () => {
            fetchHandler()
        }, [id]);

    return (
        <Box>
            <Headtitle title={'Customer View'} />
            <form>
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>View Customer</Typography>
                    </Grid>
                </Box>
                <Box sx={userStyle.container} >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <InputLabel sx={{ display: "flex" }}> Contact Type&ensp;<Typography style={{ color: "red" }}>*</Typography></InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons}>
                                    <PersonOutlineOutlinedIcon />
                                </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={addSupModForm.contacttype}
                                        disabled
                                        type="text"
                                        name="contactid"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <InputLabel >Contact Id</InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons}>
                                    <ContactPageOutlinedIcon />
                                </Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={addSupModForm.contactid}
                                        disabled
                                        type="text"
                                        name="contactid"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        {addSupModForm.contacttype == "Business" ? (
                            <>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel sx={{ display: "flex" }}>
                                        Business Name&ensp;<Typography style={{ color: "red" }}>*</Typography>
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <BusinessCenterIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.businessname}
                                                disabled
                                                type="text"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >Contact Person Name:</InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}><AccountCircleIcon /> </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.contactpersonname}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        Contact Person Number:
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <AccountCircleIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.contactperson}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        GST Number
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <BusinessCenterIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.gstno}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                {/* ****** 3rd Grid Start-Individual ****** */}
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel sx={{ display: "flex" }} >
                                        First Name<b style={{ color: "red", marginLeft: "2px" }}>*</b>
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.firstname}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        Last Name
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.lastname}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        Customer Groups
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <BusinessCenterIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.customergroup}
                                                disabled
                                                name="contactid"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

                            </>
                        )}
                        {customHide ? (
                            <>
                               
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        Mobile<b style={{ color: 'red' }}></b>
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <MobileScreenShareIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                id="component-outlined"
                                                value={addSupModForm.phonenumber}
                                                disabled
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        Whatsapp<b style={{ color: "red", marginLeft: "2px" }}>*</b>
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <MobileScreenShareIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                id="component-outlined"
                                                value={addSupModForm.whatsappno}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        Email
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <EmailIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                value={addSupModForm.email}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                           
                            </>
                        ) : null}


                    </Grid>
                    {/* ****** More Information Button ****** */}
                    <Grid container sx={userStyle.buttonmore}>
                        <Grid>
                            <Button
                                sx={userStyle.buttonadd}
                                onClick={() => setHidden((s) => !s)}
                            >
                                More Information
                                <ArrowDropDownIconOutlined />
                            </Button>
                        </Grid>
                    </Grid>
                    {/* ****** More Information Grid Start ****** */}
                    {!hidden ? (
                        <Grid>
                            <hr />
                            <Grid
                                container
                                spacing={3}
                                sx={{
                                    paddingTop: "10px !important",
                                    paddingBottom: "10px",
                                }}
                            >
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <InputLabel >
                                        Tax Number
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIconTax}>
                                            <FaInfo />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.taxnumber}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <InputLabel >
                                        Opening Balance
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <MoneyOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                SX={userStyle.input}
                                                value={addSupModForm.openbalance}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <InputLabel htmlFor="outlined-adornment-password">
                                        Pay Term
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={{ width: "210px" }}>
                                            <FormControl
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                            >
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    endAdornment={
                                                        <Tooltip
                                                            title="Payments to be paid for purchases/sales within the given time period."
                                                            placement="top"
                                                            arrow
                                                        >
                                                            <IconButton edge="end" size="small">
                                                                <FcInfo />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    value={addSupModForm.payterm}
                                                    disabled
                                                />
                                            </FormControl>
                                        </Grid>
                                        <FormControl
                                            size="small"
                                            fullWidth
                                            sx={{ display: "flex" }}
                                        >

                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.paytermassign}
                                                disabled
                                                type="text"
                                                name="contactid"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <InputLabel >
                                        Credit Limit
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <MoneyOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.creditlimit}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item lg={8}> </Grid>
                            </Grid>
                            <hr />
                            <Grid
                                container
                                spacing={3}
                                sx={{
                                    paddingTop: "10px !important",
                                    paddingBottom: "10px",
                                }}
                            >
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <InputLabel >
                                        Address Line 1
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.addressone}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <InputLabel >
                                        Address Line 2
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.addresstwo}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <InputLabel >
                                        City
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <LocationOnIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.city}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <InputLabel >
                                        State
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <LocationOnIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.state}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <InputLabel >
                                        Country
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <LanguageOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.country}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <InputLabel >
                                        Zip Code
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <LocationOnIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={addSupModForm.zipcode}
                                                disabled
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <hr />
                            <Grid
                                container
                                spacing={3}
                                sx={{
                                    paddingTop: "10px !important",
                                    paddingBottom: "10px",
                                }}
                            >
                                <Grid item md={2}></Grid>
                                <Grid item md={8}>
                                    <InputLabel >
                                        Shipping Address
                                    </InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={addSupModForm.shippingadd}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2}></Grid>
                            </Grid>
                        </Grid>
                    ) : null}
                    {/* ****** More Information Grid End ****** */}
                    <input type="hidden" disabled value={false} name="activate" />

                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/contact/customer/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

function Customerview() {
    return (
       <>
        <Customerviewlist /><br /><br /><br /><br />
        <Footer />
       </>
    );
}
export default Customerview;