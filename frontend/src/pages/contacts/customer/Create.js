import React, { useState, useEffect, useContext } from "react";
import { Button, Grid, FormGroup, InputLabel, Checkbox, FormControlLabel, FormControl, Box, OutlinedInput, Typography, Tooltip, MenuItem, Dialog, DialogContent, DialogActions, IconButton, } from "@mui/material";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BusinessCenterIconOutlined from "@mui/icons-material/BusinessCenterOutlined";
import EmailIconOutlined from "@mui/icons-material/EmailOutlined";
import MobileScreenShareIconOutlined from "@mui/icons-material/MobileScreenShareOutlined";
import ArrowDropDownIconOutlined from "@mui/icons-material/ArrowDropDownOutlined";
import LocationOnIconOutlined from "@mui/icons-material/LocationOnOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import MoneyOutlinedIcon from "@mui/icons-material/MoneyOutlined";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { FcInfo } from "react-icons/fc";
import { FaInfo } from "react-icons/fa";
import { userStyle, colourStyles } from "../../PageStyle";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { Country, State, City } from "country-state-city";
import Select from 'react-select';
import { Select as MuiSelect } from "@mui/material";
// import Createcustomergroup from './Createcustomergroup';
import Createcustomergroup from "./Createcustomergroup";

function Customercreatelist() {

    const { auth, setngs } = useContext(AuthContext);
    const [customHide, setCustomHide] = useState(true);
    const [hidden, setHidden] = useState(true);
    const [cgroups, setcgroups] = useState([]);
    const [custom, setCustom] = useState([]);
    const [fetchsavecustomergroup, setFetchsavecustomergroup] = useState("");


    const [addSupModForm, setAddSupModForm] = useState({
        contacttype: "Individual", contactid: "", businessname: "", customergroup: "Please Select CustomerGroup", firstname: "", lastname: "", email: "",
        phonenumber: "", taxnumber: "", openbalance: "", payterm: "", paytermassign: "Days", addressone: "", addresstwo: "",
        country: "", state: "", phonecheck: false, city: "", zipcode: "", contactperson: "", whatsappno: "", gstno: "", contactpersonname: "", shippingadd: "", creditlimit: "",
    });

    // Country city state datas
    const [selectedCountry, setSelectedCountry] = useState(Country.getAllCountries().find(country => country.name === "India"));
    const [selectedState, setSelectedState] = useState(State.getStatesOfCountry(selectedCountry?.isoCode).find(state => state.name === "Tamil Nadu"));
    const [selectedCity, setSelectedCity] = useState(City.getCitiesOfState(selectedState?.countryCode, selectedState?.isoCode).find(city => city.name === "Tiruchirappalli"));

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // auto id for purchase number
    let newval = setngs ? setngs.customersku == undefined ? "CU0001" : setngs.customersku + "0001" : "CU0001";

    const getPhoneNumber = () => {
        
        if (addSupModForm.phonecheck) {
            setAddSupModForm({ ...addSupModForm, whatsappno: addSupModForm.phonenumber })
        } else {
            setAddSupModForm({ ...addSupModForm, whatsappno: "" })
        }
    }

    useEffect(
        () => {
            getPhoneNumber();
        }, [addSupModForm.phonecheck]
    )

     // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

    //fetch customergroups
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

    const Customerlist = async () => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setCustom(res?.data?.customers);
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
        Customerlist();
    }, []);

    useEffect(() => {
        fetchHandlercgroup();
    }, [fetchsavecustomergroup]);

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);



    const handleGstn = (e) => {
        if (e.length > 15) {
            setShowAlert("GSTN Number can't more than 15 characters!")
            handleClickOpen();
            let num = e.slice(0, 15);
            setAddSupModForm({ ...addSupModForm, gstno: num })
        }
    }

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

    const handlecontactnumber = (e) => {
        if (e.length > 10) {
            setShowAlert(" Contact Person number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setAddSupModForm({ ...addSupModForm, contactperson: num })
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

    const handleValidationCName = (e) => {
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
    const handleValidationCtName = (e) => {
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

    const backLPage = useNavigate();

    const addCustomer = async () => {
        try {
            let req = await axios.post(SERVICE.CUSTOMER_CREATE,
                {
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
                    paytermassign: String(addSupModForm.paytermassign),
                    creditlimit: Number(setngs?.credeitlimit),
                    addressone: String(addSupModForm.addressone),
                    addresstwo: String(addSupModForm.addresstwo),
                    country: String(addSupModForm.country),
                    state: String(addSupModForm.state),
                    city: String(addSupModForm.city),
                    zipcode: Number(addSupModForm.zipcode),
                    phonecheck: Boolean(addSupModForm.phonecheck),
                    shippingadd: String(addSupModForm.shippingadd),
                    whatsappno: Number(addSupModForm.whatsappno),
                    contactperson: String(addSupModForm.contactperson),
                    gstno: String(addSupModForm.gstno),
                    customergroup: String(addSupModForm.customergroup == "Please Select CustomerGroup" ? "ALL" : addSupModForm.customergroup),
                    ledgerbalance: Number(0),
                    assignbusinessid: String(setngs.businessid),
                    contactpersonname: String(addSupModForm.contactpersonname),
                }
            );
            setAddSupModForm(req.data);
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/contact/customer/list')
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = custom.some(item => item.firstname?.toLowerCase() === (addSupModForm.firstname)?.toLowerCase());
        const isCodeMatch = custom.some(item => item.contactid?.toLowerCase() === (newval)?.toLowerCase());
        const isBusiNameMatch = custom.some(item => item.businessname?.toLowerCase() === (addSupModForm.businessname)?.toLowerCase());

        if (isCodeMatch) {
            setShowAlert("ID Already Exists");
            handleClickOpen();
        }
        else
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
                    setShowAlert("Name is Already Exist!");
                    handleClickOpen();
                }
                else if (addSupModForm.phonenumber.length != 10) {
                    setShowAlert("Please enter Phone No can't more than 10 characters!")
                    handleClickOpen();
                }
                else if (addSupModForm.whatsappno == "") {
                    setShowAlert("Please enter Whatsapp number!");
                    handleClickOpen();
                }
                else if (addSupModForm.whatsappno.length != 10) {
                    setShowAlert("Please enter Whatsapp No can't more than 10 characters!")
                    handleClickOpen();
                }
                else if (addSupModForm.email && (!addSupModForm.email.includes('@' && '.'))) {
                    setShowAlert('Please enter correct email!')
                    handleClickOpen();
                }
                else if (addSupModForm.gstno != "" && addSupModForm.gstno.length != 15) {
                    setShowAlert("Please enter GSTN Number can't more than 15 characters!")
                    handleClickOpen();
                }
                else {
                    addCustomer();
                }
            } else if (addSupModForm.contacttype == "Business") {
                if (addSupModForm.businessname == "") {
                    setShowAlert("Please enter business name!");
                    handleClickOpen();
                }
                else if (isBusiNameMatch) {
                    setShowAlert("Business Name Already Exist!");
                    handleClickOpen();
                }
                else if (addSupModForm.phonenumber.length != 10) {
                    setShowAlert("Please enter Phone No can't more than 10 characters!")
                    handleClickOpen();
                }
                else if (addSupModForm.whatsappno == "") {
                    setShowAlert("Please enter Whatsapp number!");
                    handleClickOpen();
                } else if (addSupModForm.whatsappno.length != 10) {
                    setShowAlert("Please enter Whatsapp No can't more than 10 characters!")
                    handleClickOpen();
                }
                else if (addSupModForm.email && (!addSupModForm.email.includes('@' && '.'))) {
                    setShowAlert('Please enter correct email!')
                    handleClickOpen();
                }
                else if (addSupModForm.gstno != "" && addSupModForm.gstno.length != 15) {
                    setShowAlert("Please enter GSTN No can't more than 15 characters!")
                    handleClickOpen();
                }
                else {
                    addCustomer();
                }
            }
    }

    //customer...
  const handleClear = () => {
    setAddSupModForm({
        contacttype: "Individual", contactid: "", businessname: "", customergroup: "Please Select CustomerGroup", firstname: "", lastname: "", email: "",
        phonenumber: "", taxnumber: "", openbalance: "", payterm: "", paytermassign: "", addressone: "", addresstwo: "",
        country: "", state: "", phonecheck: "", city: "", zipcode: "", contactperson: "", whatsappno: "", gstno: "", contactpersonname: "", shippingadd: "", creditlimit: "",
    })
  }

    return (
        <Box >
            <Headtitle title={'Customer Create'} />
            <form onSubmit={handleSubmit}>
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>Add Customer</Typography>
                    </Grid>
                </Box>
                <Box sx={userStyle.container} >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <InputLabel sx={{ display: "flex" }}> Contact Type<b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons}> <PersonOutlineOutlinedIcon /> </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <MuiSelect fullWidth
                                        value={addSupModForm.contacttype}
                                        onChange={(event) => { setAddSupModForm({ ...addSupModForm, contacttype: event.target.value, contactid: newval }) }}
                                    >
                                        <MenuItem value="Individual">Individual </MenuItem>
                                        <MenuItem value="Business">Business</MenuItem>
                                    </MuiSelect>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <InputLabel > Contact Id </InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons}> <ContactPageOutlinedIcon /> </Grid>
                                <FormControl size="small" fullWidth>
                                    {custom && (
                                        custom.map(
                                            () => {
                                                let strings = setngs ? setngs.customersku : "CU";
                                                let refNo = custom[custom.length - 1].contactid;
                                                let digits = (custom.length + 1).toString();
                                                const stringLength = refNo.length;
                                                let lastChar = refNo.charAt(stringLength - 1);
                                                let getlastBeforeChar = refNo.charAt(stringLength - 2);
                                                let getlastThreeChar = refNo.charAt(stringLength - 3);
                                                let lastBeforeChar = refNo.slice(-2);
                                                let lastThreeChar = refNo.slice(-3);
                                                let lastDigit = refNo.slice(-4);
                                                let refNOINC = parseInt(lastChar) + 1
                                                let refLstTwo = parseInt(lastBeforeChar) + 1;
                                                let refLstThree = parseInt(lastThreeChar) + 1;
                                                let refLstDigit = parseInt(lastDigit) + 1;
                                                if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                                                    refNOINC = ("000" + refNOINC);
                                                    newval = strings + refNOINC;
                                                } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                                    refNOINC = ("00" + refLstTwo);
                                                    newval = strings + refNOINC;
                                                } else if (digits.length < 4 && getlastThreeChar > 0) {
                                                    refNOINC = ("0" + refLstThree);
                                                    newval = strings + refNOINC;
                                                } else {
                                                    refNOINC = (refLstDigit);
                                                    newval = strings + refNOINC;
                                                }
                                            }))}
                                    <OutlinedInput
                                        value={newval}
                                        type="text"
                                        name="contactid"
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        {addSupModForm.contacttype == "Business" ? (
                            <>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel sx={{ display: "flex" }}> Business Name<b style={{ color: "red", marginLeft: "2px" }}>*</b> </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}><BusinessCenterIconOutlined /></Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                value={addSupModForm.businessname}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        businessname: event.target.value, contactid: newval
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
                                    <InputLabel >Contact Person Number:</InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}><AccountCircleIcon /> </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                value={addSupModForm.contactperson}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        contactperson: event.target.value,
                                                    }); handlecontactnumber(event.target.value)
                                                }}
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel > GST Number </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}> <BusinessCenterIconOutlined /> </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
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
                                    <InputLabel sx={{ display: "flex" }}> First Name<b style={{ color: "red", marginLeft: "2px" }}>*</b> </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                value={addSupModForm.firstname}
                                                onChange={(e) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        firstname: e.target.value, contactid: newval
                                                    });
                                                    ; handleValidationFName(e)
                                                }}
                                                type="text"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >  Last Name  </InputLabel>
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
                                    <InputLabel > Customer Groups </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}> <BusinessCenterIconOutlined /> </Grid>
                                        <FormControl size="small" fullWidth>
                                            <MuiSelect
                                                placeholder="Please Select CustomerGroup"
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        customergroup: event.target.value,
                                                    });
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={addSupModForm.customergroup}
                                            >
                                                {cgroups &&
                                                    cgroups.map((row, index) => (
                                                        <MenuItem key={index} value={row.cusgroupname}>
                                                            {row.cusgroupname}
                                                        </MenuItem>
                                                    ))}
                                            </MuiSelect>
                                        </FormControl>
                                        <Grid sx={userStyle.spanIcons}><Createcustomergroup setFetchsavecustomergroup={setFetchsavecustomergroup} /></Grid>
                                    </Grid>
                                </Grid>

                            </>
                        )}
                        {customHide ? (
                            <>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >Mobile<b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}><MobileScreenShareIconOutlined /></Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                id="component-outlined"
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
                                            <FormControlLabel control={<Checkbox checked={addSupModForm.phonecheck} onChange={(e) => setAddSupModForm({ ...addSupModForm, phonecheck: !addSupModForm.phonecheck })} />} label="Same as Mobile number" />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >Whatsapp<b style={{ color: 'red', marginLeft: "2px" }}>*</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}> <MobileScreenShareIconOutlined /></Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                id="component-outlined"
                                                value={addSupModForm.whatsappno}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        whatsappno: event.target.value,
                                                    });
                                                    handleWhatsapp(event.target.value)
                                                }}
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3}>
                                    <InputLabel >Email</InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}><EmailIconOutlined /> </Grid>
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
                                    <InputLabel >Tax Number </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIconTax}> <FaInfo /> </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                value={addSupModForm.taxnumber}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        taxnumber: event.target.value,
                                                    });
                                                }}
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <InputLabel >Opening Balance </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
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
                                    <InputLabel >  Pay Term  </InputLabel>
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
                                            <MuiSelect fullWidth
                                                value={addSupModForm.paytermassign}
                                                onChange={(event) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        paytermassign: event.target.value,
                                                    });
                                                }}
                                            >
                                                <MenuItem value="month">Month</MenuItem>
                                                <MenuItem value="days">Days</MenuItem>
                                            </MuiSelect>
                                        </FormControl>
                                        <Tooltip
                                            title="Payments to be paid for sales within the given time period."
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
                                    <InputLabel >  Credit Limit </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <MoneyOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                value={setngs?.credeitlimit}
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item lg={8}>
                                    {" "}
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
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <InputLabel > Address Line 1  </InputLabel>
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
                                    <InputLabel > Address Line 2  </InputLabel>
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
                                    <InputLabel > Country  </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}> <LanguageOutlinedIcon />  </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                placeholder=""
                                                options={Country.getAllCountries()}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                value={selectedCountry}
                                                styles={colourStyles}
                                                onChange={(item) => {
                                                    setSelectedCountry(item);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <InputLabel >  State  </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <LocationOnIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                placeholder=""
                                                options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                value={selectedState}
                                                styles={colourStyles}
                                                onChange={(item) => {
                                                    setSelectedState(item);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <InputLabel>City</InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>  <LocationOnIconOutlined />  </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                placeholder=""
                                                options={City.getCitiesOfState(
                                                    selectedState?.countryCode,
                                                    selectedState?.isoCode
                                                )}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                value={selectedCity}
                                                styles={colourStyles}
                                                onChange={(item) => {
                                                    setSelectedCity(item);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <InputLabel >  Zip Code  </InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons}>
                                            <LocationOnIconOutlined />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                value={addSupModForm.zipcode}
                                                onChange={(e) => {
                                                    setAddSupModForm({
                                                        ...addSupModForm,
                                                        zipcode: e.target.value,
                                                    });
                                                    handleZipcode(e.target.value)
                                                }}
                                                type="number"
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
                                    <InputLabel>Shipping Address</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            value={addSupModForm.shippingadd}
                                            onChange={(e) => {
                                                setAddSupModForm({
                                                    ...addSupModForm,
                                                    shippingadd: e.target.value,
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
                        <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Link to="/contact/customer/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type="submit" onClick={handleSubmit}>Save</Button>
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

function Customercreate() {
    return (

      <>
        <Customercreatelist /><br /><br /><br /><br />
        <Footer />
      </>
    );
}

export default Customercreate;