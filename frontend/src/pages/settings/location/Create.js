import React, { useState, useContext } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Box, Grid, Typography, FormGroup, FormControlLabel, Checkbox, FormControl, InputLabel, OutlinedInput, TextareaAutosize } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Country, State, City } from "country-state-city";
import Selects from 'react-select';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';

function BusinessLocCreate() {

    const [busilocations, setBusilocations] = useState();
    const [isBusilocations, setIsBusilocations] = useState([]);
    const [isBusilocationName, setIsBusilocationName] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const { allLocations, isUserRoleAccess } = useContext(UserRoleAccessContext)

    const [businsLoca, setBusinsLoca] = useState({
        activate: false, name: "", locationname: "", locationid: "", landmark: "", address: "", city: "", zipcde: "", state: "", country: "", phonenumber: "", landlinenumber: "",
        email: "", website: "", onephonenumber: "", twophonenumber: "", threephonenumber: "", whatsappno: "", phonecheck: false,
    });

    const exceptThisSymbols = ["e", "E", "+", "-", "."];

    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()

    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const backLPage = useNavigate();

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

    // Country city state datas
    const [selectedCountry, setSelectedCountry] = useState(Country.getAllCountries().find(country => country.name === "India"));
    const [selectedState, setSelectedState] = useState(State.getStatesOfCountry(selectedCountry?.isoCode).find(state => state.name === "Tamil Nadu"));
    const [selectedCity, setSelectedCity] = useState(City.getCitiesOfState(selectedState?.countryCode, selectedState?.isoCode).find(city => city.name === "Tiruchirappalli"));


    // Auto id
    let newval = setngs ? setngs.businesslocationsku == undefined ? "BL0001" : setngs.businesslocationsku + "0001" : "BL0001";
    let bnname = setngs ? setngs.businessname : "";

    const handleValidationLandline = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[a-z]');
        var regex = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter number only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setBusinsLoca({ ...businsLoca, landlinenumber: value })
        }
        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter number only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setBusinsLoca({ ...businsLoca, landlinenumber: value })
        }
    }

    // Fetch Business location data
    const fetchBusilocations = async () => {
        try {

            let resultloc = allLocations.filter((data, index) => {
                return data.locationid
            })

            setIsBusilocations(resultloc);
            setBusilocations(allLocations);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Business Locations
    const fetchLocationName = async () => {
        try {
            let res = await axios.post(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

            let result = res?.data?.businesslocations.map((data, index) => {
                return data.locationname
            })

            setIsBusilocationName(result)

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };
    //businesslocation  clear...
    const handleClear = () => {
        setBusinsLoca({
            activate: "", name: "", locationname: "", locationid: "", landmark: "", address: "", zipcde: "", state: "", country: "", phonenumber: "", landlinenumber: "",
            email: "", website: "", onephonenumber: "", twophonenumber: "", threephonenumber: "", whatsappno: "", phonecheck: "",
        })
    }

    const handlePincode = (e) => {
        if (e.length > 6) {
            setShowAlert("Zipcode can't have more than 6 characters!")
            handleClickOpen();
            let num = e.slice(0, 6);
            setBusinsLoca({ ...businsLoca, zipcde: num })
        }
    }
    const handlePhone = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't have more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setBusinsLoca({ ...businsLoca, phonenumber: num })
        }
    }
    const handlePhoneOne = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't have more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setBusinsLoca({ ...businsLoca, onephonenumber: num })
        }
    }
    const handlePhoneTwo = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't have more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setBusinsLoca({ ...businsLoca, twophonenumber: num })
        }
    }
    const handlePhoneThree = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't have more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setBusinsLoca({ ...businsLoca, threephonenumber: num })
        }
    }
    const handleWhatsApp = (e) => {
        if (e.length > 10) {
            setShowAlert("WhatsApp number can't have more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setBusinsLoca({ ...businsLoca, whatsappno: num })
        }
    }

    // Add
    const sendRequest = async () => {
        try {
            let res = await axios.post(SERVICE.BUSINESS_LOCATION_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(bnname + "_" + businsLoca.locationname),
                businessname: String(bnname),
                locationname: String(businsLoca.locationname),
                locationid: String(newval),
                landmark: String(businsLoca.landmark),
                address: String(businsLoca.address),
                zipcde: Number(businsLoca.zipcde),
                country: String(selectedCountry.name ? selectedCountry.name : ""),
                state: String(selectedState.name ? selectedState.name : ""),
                city: String(selectedCity.name ? selectedCity.name : ""),
                phonenumber: Number(businsLoca.phonenumber),
                landlinenumber: String(businsLoca.landlinenumber),
                email: String(businsLoca.email),
                website: String(businsLoca.website),
                onephonenumber: Number(businsLoca.onephonenumber),
                twophonenumber: Number(businsLoca.twophonenumber),
                threephonenumber: Number(businsLoca.threephonenumber),
                activate: Boolean(true),
                whatsappno: Number(businsLoca.whatsappno),
                assignbusinessid: String(setngs.businessid),
                phonecheck: Boolean(businsLoca.phonecheck),
            });
            setBusinsLoca(res.data);
            backLPage('/settings/location/list');
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };


    useEffect(
        () => {
            fetchBusilocations();
            fetchLocationName();
        }, []
    )

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isBusilocations.includes(newval)) {
            setShowAlert('ID already exits!')
            handleClickOpen();
        }
        else if (isBusilocationName.includes(businsLoca.locationname.toLowerCase())) {
            setShowAlert('Location Name already exits!')
            handleClickOpen();
        }
        else if (businsLoca.whatsappno == "") {
            setShowAlert('Please enter WhatsApp number!')
            handleClickOpen();
        }
        else if (businsLoca.whatsappno.length != 10) {
            setShowAlert('WhatsApp number can notmore than 10 characters!')
            handleClickOpen();
        }
        else if (businsLoca.email && (!businsLoca.email.includes('@' && '.'))) {
            setShowAlert('Please enter correct email!')
            handleClickOpen();
        }
        
        else if (businsLoca.website && (!businsLoca.website.includes('@' && '.'))) {
            setShowAlert('Please enter correct website!')
            handleClickOpen();
        }
        else if(businsLoca.phonenumber == ""){
            setShowAlert('Please enter Phone Number!')
            handleClickOpen();
        }
        else {
            sendRequest();
        }
    };

    const getPhoneNumber = () => {
        if (businsLoca.phonecheck) {
            setBusinsLoca({ ...businsLoca, whatsappno: businsLoca.phonenumber })
        } else {
            setBusinsLoca({ ...businsLoca, whatsappno: "" })
        }
    }

    useEffect(
        () => {
            getPhoneNumber();
        }, [businsLoca.phonecheck]
    )

    return (
        <Box>
            <Headtitle title={'Business Location Create'} />
            <form>
                <Typography sx={userStyle.HeaderText}>Add Business Locations</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Business Name <b style={{ color: "red" }}> *</b></InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="business name"
                                    label="Business Name *"
                                    type="text"
                                    value={bnname}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Location Name <b style={{ color: "red" }}> *</b></InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="locationname"
                                    label="Location Name *"
                                    type="text"
                                    value={businsLoca.locationname}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, locationname: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            {busilocations && (
                                busilocations.map(
                                    () => {
                                        let strings = setngs ? setngs.businesslocationsku : "BL";
                                        let refNo = busilocations[busilocations.length - 1].locationid;
                                        let digits = (busilocations.length + 1).toString();
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
                                            refNOINC = ("000" + refNOINC).substr(-4);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                            refNOINC = ("00" + refLstTwo).substr(-4);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastThreeChar > 0) {
                                            refNOINC = ("0" + refLstThree).substr(-4);
                                            newval = strings + refNOINC;
                                        } else {
                                            refNOINC = (refLstDigit).substr(-4);
                                            newval = strings + refNOINC;
                                        }
                                    }))}
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="location id"
                                    type="text"
                                    value={newval}
                                />
                            </FormControl>
                            <Typography variant="body2" sx={{ marginTop: "5px" }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Landmark</InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    label="Landmark"
                                    name="Landmark"
                                    type="text"
                                    value={businsLoca.landmark}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, landmark: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Address</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={businsLoca.address}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, address: e.target.value }) }}
                                    name="address"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Country</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <Selects
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
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">State</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <Selects
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
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">City</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <Selects
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
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Zipcode</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="zipcode"
                                    type="number"
                                    sx={userStyle.input}
                                    value={businsLoca.zipcde}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, zipcde: e.target.value }); handlePincode(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Mobile Number <b style={{ color: "red" }}> *</b></InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    label="Mobile Number *"
                                    name="mobilenumber"
                                    type="number"
                                    value={businsLoca.phonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, phonenumber: e.target.value, locationid: newval, name: bnname }); handlePhone(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </FormControl>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={businsLoca.phonecheck} onChange={(e) => setBusinsLoca({ ...businsLoca, phonecheck: !businsLoca.phonecheck })} />} label="Same as whatsapp number" />
                            </FormGroup>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Mobile 1</InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    label="Mobile 1"
                                    name="mobilenumber 1"
                                    type="number"
                                    value={businsLoca.onephonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, onephonenumber: e.target.value }); handlePhoneOne(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Mobile 2</InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    label="Mobile 2"
                                    name="mobilenumber 2"
                                    type="number"
                                    value={businsLoca.twophonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, twophonenumber: e.target.value }); handlePhoneTwo(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Mobile 3</InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    label="Mobile 3"
                                    name="mobilenumber 3"
                                    type="number"
                                    value={businsLoca.threephonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, threephonenumber: e.target.value }); handlePhoneThree(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Landline Number</InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    label="Landline Number"
                                    name="Landline number"
                                    type="text"
                                    value={businsLoca.landlinenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, landlinenumber: e.target.value }); handleValidationLandline(e); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">WhatsApp <b style={{ color: "red" }}> *</b></InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    label="WhatsApp *"
                                    name="whatsappno"
                                    type="number"
                                    value={businsLoca.whatsappno}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, whatsappno: e.target.value, name: bnname }); handleWhatsApp(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Email</InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={businsLoca.email}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, email: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Website</InputLabel>
                                <OutlinedInput id="outlined-adornment-password"
                                    label="Website"
                                    name="website"
                                    type="email"
                                    value={businsLoca.website}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, website: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                        <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Link to="/settings/location/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            {/* <Button sx={userStyle.buttonadd} type="submit" onClick={handleotherSubmit}>Save And Add Another</Button> */}
                            <Button sx={userStyle.buttonadd} type="submit" onClick={handleSubmit}>Save</Button>
                        </Grid>
                    </Grid>
                </Box>
                {/* ALERT DIALOG */}
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
            </form>
        </Box>
    );
}
function BusinessLocaCreate() {
    return (

        <>
            <BusinessLocCreate /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}

export default BusinessLocaCreate;