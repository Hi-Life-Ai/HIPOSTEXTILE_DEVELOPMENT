import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, InputLabel, FormControl, Typography, FormGroup, FormControlLabel, Checkbox, Classes, Box, OutlinedInput, Tooltip, MenuItem, IconButton, Dialog, DialogContent, DialogActions, } from '@mui/material';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BusinessCenterIconOutlined from '@mui/icons-material/BusinessCenterOutlined';
import EmailIconOutlined from '@mui/icons-material/EmailOutlined';
import MobileScreenShareIconOutlined from '@mui/icons-material/MobileScreenShareOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowDropDownIconOutlined from '@mui/icons-material/ArrowDropDownOutlined';
import LocationOnIconOutlined from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FcInfo } from "react-icons/fc";
import { FaInfo } from 'react-icons/fa';
import { userStyle, colourStyles } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { Country, State, City } from "country-state-city";
import Select from 'react-select';
import { Select as MuiSelect } from "@mui/material";
import Createcustomergroup from "./Createcustomergroup";


function Customereditlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [customHide, setCustomHide] = useState(true);
    const [hidden, setHidden] = useState(true);
    const [cgroups, setcgroups] = useState();
    const [custom, setCustom] = useState([]);
    const [fetchsavecustomergroup, setFetchsavecustomergroup] = useState("");


    const [addSupModForm, setAddSupModForm] = useState({
        contacttype: "", contactid: "", businessname: "", customergroup: "", firstname: "", lastname: "", email: "",
        phonenumber: "", taxnumber: "", openbalance: "", payterm: "", paytermassign: "", addressone: "", addresstwo: "",
        country: "", state: "", contactpersonname: "", phonecheck: "", city: "", zipcode: "", contactperson: "", whatsappno: "", gstno: "", shippingadd: "", creditlimit: "",
    });

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    // Edit Popup model start
    const [getUnit, setGetUnit] = useState("") // 1 compare value
    const [overAllUnit, setOverAllUnit] = useState("")//3
    const [editUnit, setEditUnit] = useState(0)//2 find length

    // Edit Popup model end
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const handlePhonefour = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setAddSupModForm({ ...addSupModForm, phonenumber: num })
        }
    }
    const handleWhatsapp = (e) => {
        if (e.length > 10) {
            setShowAlert("Whatsapp no can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setAddSupModForm({ ...addSupModForm, whatsappno: num })
        }
    }
    const handleZipcode = (e) => {
        if (e.length > 6) {
            setShowAlert("Zipcode can't more than 6 characters!")
            handleClickOpen();
            let num = e.slice(0, 6);
            setAddSupModForm({ ...addSupModForm, zipcode: num })
        }
    }


    const handleGstn = (e) => {
        if (e.length > 15) {
            setShowAlert("GSTN Number can't more than 15 characters!")
            handleClickOpen();
            let num = e.slice(0, 15);
            setAddSupModForm({ ...addSupModForm, gstno: num })
        }
    }


    const handleValidationBName = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]');
        var regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, businessname: value })
        }

        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, businessname: value })
        }

    }
    const handleValidationcontactperson = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]');
        var regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, contactpersonname: value })
        }

        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, contactpersonname: value })
        }

    }



    // fetch customergroups
    const fetchHandlercgroup = async () => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER_GROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setcgroups(res?.data?.cgroups);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };


    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.CUSTOMER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })

            const savedCustomer = response?.data?.scustomer;
            // Find the corresponding Country, State, and City objects
            const country = Country.getAllCountries().find(country => country.name === savedCustomer.country);
            const state = State.getStatesOfCountry(country?.isoCode).find(state => state.name === savedCustomer.state);
            const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find(city => city.name === savedCustomer.city);

            // start
            setGetUnit(response?.data?.scustomer?.contactid)
            getEditId(response?.data?.scustomer?.contactid);
            // End

            setSelectedCountry(country);
            setSelectedState(state);
            setSelectedCity(city);
            setAddSupModForm(savedCustomer);
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

    useEffect(() => {
        fetchHandlercgroup()
    }, [fetchsavecustomergroup])


    // Customers
    const fetchCustomers = async () => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setCustom(res?.data?.customers?.filter(item => item._id !== addSupModForm._id));
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
        fetchCustomers();
    }, [addSupModForm, custom]);


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);


    // Edit Update Start
    const getEditId = async (id) => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                contactid: String(id),
                businessid: String(setngs.businessid),
            });
            setEditUnit(res.data.count)
            setOverAllUnit(`The ${id} is linked in ${res?.data?.draft?.length > 0 ? "Draft ," : ""}
                ${res?.data?.pos1?.length > 0 ? "Sell  " : ""},
                ${res?.data?.quotation?.length > 0 ? "Quotation  " : ""}
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
            let res = await axios.post(SERVICE.CUSTOMER_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                contactid: getUnit,
                businessid: String(setngs.businessid),

            });
            editOveAllDepartment(res.data.draft, res.data.pos1, res.data.quotation)
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

    const editOveAllDepartment = async (draft, pos1, quotation) => {
        try {
            if (draft?.length > 0) {
                let result = draft.map((data, index) => {

                    let request = axios.put(`${SERVICE.DRAFT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        contactnumber: Number(addSupModForm.phonenumber),
                        customer: String(addSupModForm.firstname + " " + addSupModForm.lastname),
                    });

                })

            }
            if (pos1?.length > 0) {
                let result = pos1.map((data, index) => {

                    let request = axios.put(`${SERVICE.POS_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        contactnumber: Number(addSupModForm.phonenumber),
                        customer: String(addSupModForm.firstname + " " + addSupModForm.lastname),
                    });

                })

            }
            if (quotation?.length > 0) {
                let result = quotation.map((data, index) => {

                    let request = axios.put(`${SERVICE.QUOTATION_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        contactnumber: Number(addSupModForm.phonenumber),
                        customer: String(addSupModForm.firstname + " " + addSupModForm.lastname),
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
    // Edit Update End

    const backLPage = useNavigate();

    const updateContact = async () => {
        try {
            let req = await axios.put(`${SERVICE.CUSTOMER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                contacttype: String(addSupModForm.contacttype),
                contactid: String(addSupModForm.contactid),
                businessname: String(addSupModForm.businessname ? addSupModForm.businessname : "Individual"),
                firstname: String(addSupModForm.firstname),
                lastname: String(addSupModForm.lastname),
                phonenumber: Number(addSupModForm.phonenumber),
                email: String(addSupModForm.email),
                taxnumber: Number(addSupModForm.taxnumber),
                openbalance: Number(addSupModForm.openbalance),
                payterm: Number(addSupModForm.payterm),
                phonecheck: Boolean(addSupModForm.phonecheck),
                paytermassign: String(addSupModForm.paytermassign),
                creditlimit: Number(addSupModForm.creditlimit),
                addressone: String(addSupModForm.addressone),
                addresstwo: String(addSupModForm.addresstwo),
                country: String(addSupModForm.country),
                state: String(addSupModForm.state),
                city: String(addSupModForm.city),
                zipcode: Number(addSupModForm.zipcode),
                shippingadd: String(addSupModForm.shippingadd),
                contactpersonname: String(addSupModForm.contactpersonname),
                whatsappno: Number(addSupModForm.whatsappno),
                contactperson: String(addSupModForm.contactperson),
                gstno: String(addSupModForm.gstno),
                customergroup: String(addSupModForm.customergroup),
                ledgerbalance: Number(addSupModForm.ledgerbalance),
            });
            setAddSupModForm(req.data)
            await getOverAlldepUpdate();
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/contact/customer/list');
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };


    const handlecontactnumber = (e) => {
        if (e.length > 10) {
            setShowAlert(" Contact Person number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setAddSupModForm({ ...addSupModForm, contactperson: num })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = custom.some(item => item.firstname.toLowerCase() === addSupModForm.firstname.toLowerCase());
        const isBusiNameMatch = custom.some(item => item.businessname?.toLowerCase() === (addSupModForm.businessname)?.toLowerCase());

        if (addSupModForm.contacttype == "") {
            setShowAlert("Please Select Contact Type!");
            handleClickOpen();
        }
        else if (addSupModForm.contacttype == "Individual") {
            if (addSupModForm.firstname == "") {
                setShowAlert("Please enter first name!");
                handleClickOpen();
            }
            else if (isNameMatch) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"First name already exits!"}
                        </p>
                    </>
                );
                handleClickOpenerrpop();
            }

            else if (addSupModForm.phonenumber.length != 10) {
                setShowAlert("Please enter Phone No can't more than 10 characters!")
                handleClickOpen();
            }
            else if (addSupModForm.whatsappno == "") {
                setShowAlert("Please enter phone number!");
                handleClickOpen();
            } else if (addSupModForm.whatsappno.length != 10) {
                setShowAlert("Please enter Whatsapp No can't more than 10 characters!")
                handleClickOpen();
            }
            else if ((addSupModForm.firstname + " " + addSupModForm.lastname) || addSupModForm.phonenumber != getUnit && editUnit > 0) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {overAllUnit}
                        </p>
                    </>
                )
                handleClickOpenerrpop();
            }

            else if (addSupModForm.gstno != "" && addSupModForm.gstno.length != 15) {
                setShowAlert("Please enter GSTN Number can't more than 15 characters!")
                handleClickOpen();
            }
            else if (addSupModForm.email && (!addSupModForm.email.includes('@' && '.'))) {
                setShowAlert('Please enter correct email!')
                handleClickOpen();
            }
            else {
                updateContact();
            }
        }


        else if (addSupModForm.contacttype == "Business") {
            if (addSupModForm.businessname == "") {
                setShowAlert("Please enter business name!");
                handleClickOpen();
            }
            // else if (String(addSupModForm.phonenumber)?.length != 10) {
            //     setShowAlert("Please enter Phone No can't more than 10 characters!")
            //     handleClickOpen();
            // }
            else if (addSupModForm.whatsappno == "") {
                setShowAlert("Please enter phone number!");
                handleClickOpen();
            }
            // else if (String(addSupModForm.whatsappno)?.length != 10) {
            //     setShowAlert("Please enter Whatsapp No can't more than 10 characters!")
            //     handleClickOpen();
            // }
            else if (isBusiNameMatch) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Business name already exits!"}
                        </p>
                    </>
                );
                handleClickOpenerrpop();
            }

            else if (addSupModForm.email && (!addSupModForm.email.includes('@' && '.'))) {
                setShowAlert('Please enter correct email!')
                handleClickOpen();
            }
            else {
                updateContact();
            }
        }
    }

    const handleValidationLName = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]');
        var regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, lastname: value })
        }
        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, lastname: value })
        }
    }
    const handleValidationFName = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]');
        var regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, firstname: value })
        }
        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAddSupModForm({ ...addSupModForm, firstname: value })
        }
    }

    return (
        <Box>
            <Headtitle title={'Customer Edit'} />
            <form onSubmit={handleSubmit}>
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>Edit Customer</Typography>
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
                                    <MuiSelect fullWidth
                                        value={addSupModForm.contacttype}
                                        onChange={(event) => { setAddSupModForm({ ...addSupModForm, contacttype: event.target.value }) }}
                                    >
                                        <MenuItem value="Individual">Individual </MenuItem>
                                        <MenuItem value="Business">Business</MenuItem>
                                    </MuiSelect>
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

                                        value={addSupModForm.contactid}
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

                                                value={addSupModForm.businessname}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        businessname: event.target.value,
                                                    }); handleValidationBName(event);
                                                }}
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
                                                sx={userStyle.input}
                                                value={addSupModForm.contactpersonname}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        contactpersonname: event.target.value,
                                                    }); handleValidationcontactperson(event)
                                                }}
                                                type="text"
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

                                                value={addSupModForm.contactperson}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        contactperson: event.target.value,
                                                    }); handlecontactnumber(event.target.value)
                                                }}
                                                type="text"
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

                                                value={addSupModForm.gstno}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        gstno: event.target.value,
                                                    }); handleGstn(event.target.value)
                                                }}
                                                type="text"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                {/* ****** 3rd Grid Start-Individual ****** */}
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel sx={{ display: "flex" }}>
                                        First Name&ensp;<Typography style={{ color: "red" }}>*</Typography>
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput

                                                value={addSupModForm.firstname}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        firstname: event.target.value,
                                                    }); handleValidationFName(event)
                                                }}
                                                type="text"
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

                                                value={addSupModForm.lastname}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        lastname: event.target.value,
                                                    }); handleValidationLName(event)
                                                }}
                                                type="text"
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
                                            <MuiSelect
                                                value={addSupModForm.customergroup}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        customergroup: event.target.value,
                                                    });
                                                }}
                                            >
                                                {cgroups &&
                                                    cgroups.map((row, index) => (
                                                        <MenuItem key={index} value={row.cusgroupname}>
                                                            {row.cusgroupname}
                                                        </MenuItem>
                                                    ))}
                                            </MuiSelect>
                                        </FormControl>
                                        <Grid sx={userStyle.spanIcons}>
                                            <Createcustomergroup setFetchsavecustomergroup={setFetchsavecustomergroup} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </>
                        )}
                        {customHide ? (
                            <>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >
                                        Mobile<b style={{ color: "red", marginLeft: "2px" }}>*</b>
                                    </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <MobileScreenShareIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}

                                                value={addSupModForm.phonenumber}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        phonenumber: event.target.value,
                                                    });
                                                    handlePhonefour(event.target.value)
                                                }}
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox checked={Boolean(addSupModForm.phonecheck)} onChange={(e) => setAddSupModForm({ ...addSupModForm, phonecheck: !addSupModForm.phonecheck })} />} label="Same as Mobile number" />
                                        </FormGroup>
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

                                                value={addSupModForm.whatsappno}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        whatsappno: event.target.value, phonecheck: false
                                                    });
                                                    handleWhatsapp(event.target.value)
                                                }}
                                                type="number"
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
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        email: event.target.value,
                                                    });
                                                }}
                                                type="email"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </>
                        ) : <>
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

                                                value={addSupModForm.contactperson}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        contactperson: event.target.value,
                                                    }); handlecontactnumber(event.target.value)
                                                }}
                                                type="text"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                        </>}


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

                                                value={addSupModForm.taxnumber}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        taxnumber: event.target.value,
                                                    });
                                                }}
                                                type="text"
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
                                                sx={userStyle.input}
                                                value={addSupModForm.openbalance}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        openbalance: event.target.value,
                                                    });
                                                }}
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <InputLabel>
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
                                                    value={addSupModForm.payterm}
                                                    onChange={(e) => {
                                                        setAddSupModForm({
                                                            ...addSupModForm,
                                                            payterm: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <FormControl
                                            size="small"
                                            fullWidth
                                            sx={{ display: "flex" }}
                                        >
                                            <MuiSelect
                                                value={addSupModForm.paytermassign}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        paytermassign: event.target.value,
                                                    });
                                                }}
                                                fullWidth
                                            >
                                                <MenuItem value="Month">Month</MenuItem>
                                                <MenuItem value="Days">Days</MenuItem>
                                            </MuiSelect>
                                        </FormControl>
                                        <Tooltip
                                            title="Payments to be paid for purchases/sales within the given time period."
                                            placement="top"
                                            arrow
                                        >
                                            <IconButton edge="end" size="small">
                                                <FcInfo />
                                            </IconButton>
                                        </Tooltip>
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

                                                value={addSupModForm.creditlimit}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        creditlimit: event.target.value,
                                                    });
                                                }}
                                                type="text"
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

                                                value={addSupModForm.addressone}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        addressone: event.target.value,
                                                    });
                                                }}
                                                type="text"
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

                                                value={addSupModForm.addresstwo}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        addresstwo: event.target.value,
                                                    });
                                                }}
                                                type="text"
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
                                            <Select
                                                options={Country.getAllCountries()}
                                                getOptionLabel={(options) => options["name"]}
                                                getOptionValue={(options) => options["name"]}
                                                value={selectedCountry}
                                                styles={colourStyles}
                                                onChange={(item) => {
                                                    setSelectedCountry(item);
                                                    setAddSupModForm((prevCustomer) => ({
                                                        ...prevCustomer,
                                                        country: item?.name || "",
                                                    }));
                                                }}
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
                                            <Select
                                                options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                                getOptionLabel={(options) => options["name"]}
                                                getOptionValue={(options) => options["name"]}
                                                value={selectedState}
                                                styles={colourStyles}
                                                onChange={(item) => {
                                                    setSelectedState(item);
                                                    setAddSupModForm((prevCustomer) => ({
                                                        ...prevCustomer,
                                                        state: item?.name || "",
                                                    }));
                                                }}
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
                                            <Select
                                                options={City.getCitiesOfState(
                                                    selectedState?.countryCode,
                                                    selectedState?.isoCode
                                                )}
                                                getOptionLabel={(options) => options["name"]}
                                                getOptionValue={(options) => options["name"]}
                                                value={selectedCity}
                                                styles={colourStyles}
                                                onChange={(item) => {
                                                    setSelectedCity(item);
                                                    setAddSupModForm((prevCustomer) => ({
                                                        ...prevCustomer,
                                                        city: item?.name || "",
                                                    }));
                                                }}
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

                                                value={addSupModForm.zipcode}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        zipcode: event.target.value,
                                                    });
                                                    handleZipcode(event.target.value)
                                                }}
                                                type="text"
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

                                            value={addSupModForm.shippingadd}
                                            onChange={(event) => {
                                                setAddSupModForm({
                                                    ...addSupModForm,
                                                    shippingadd: event.target.value,
                                                });
                                            }}
                                            type="text"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2}></Grid>
                            </Grid>
                        </Grid>
                    ) : null}
                    {/* ****** More Information Grid End ****** */}
                    <input type="hidden" value={false} name="activate" />
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/contact/customer/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type="submit" >UPDATE</Button>
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
                            updateContact();
                            handleCloseerrpop();
                        }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4', color: '#444', boxShadow: 'none', borderRadius: '3px', padding: '7px 13px', border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
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

function Customeredit() {
    return (
        <>
            <Customereditlist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}
export default Customeredit;