import React, { useState, useContext } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Box, Grid, FormControl, Typography, InputLabel, OutlinedInput, TextareaAutosize } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Select from 'react-select';
import { Country, State, City } from "country-state-city";
import { useNavigate, useParams, Link } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function BusinessLoceditlist() {

    const [businsLoca, setBusinsLoca] = useState({});
    const { auth } = useContext(AuthContext);

    const exceptThisSymbols = ["e", "E", "+", "-", "."];

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };


    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()

    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            const savedLocation = response?.data?.sbusilocation;

            // Find the corresponding Country, State, and City objects
            const country = Country.getAllCountries().find(country => country.name === savedLocation.country);
            const state = State.getStatesOfCountry(country?.isoCode).find(state => state.name === savedLocation.state);
            const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find(city => city.name === savedLocation.city);

            setSelectedCountry(country);
            setSelectedState(state);
            setSelectedCity(city);
            setBusinsLoca(response?.data?.sbusilocation);
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

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

        

    const bactToPage = useNavigate();

    const updatebusinsLoca = async () => {
        try {
            let req = await axios.put(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                activate: Boolean(businsLoca.activate),
                name: String(businsLoca.businessname + "_" +businsLoca.locationname),
                businessname: String(businsLoca.businessname),
                locationname: String(businsLoca.locationname),
                locationid: String(businsLoca.locationid),
                landmark: String(businsLoca.landmark),
                address: String(businsLoca.address),
                city: String(businsLoca.city),
                zipcde: Number(businsLoca.zipcde),
                state: String(businsLoca.state),
                country: String(businsLoca.country),
                phonenumber: Number(businsLoca.phonenumber),
                landlinenumber: String(businsLoca.landlinenumber),
                email: String(businsLoca.email),
                website: String(businsLoca.website),
                onephonenumber: Number(businsLoca.onephonenumber),
                twophonenumber: Number(businsLoca.twophonenumber),
                threephonenumber: Number(businsLoca.threephonenumber),
                whatsappno: Number(businsLoca.whatsappno)
            });
            setBusinsLoca(req.data)
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            bactToPage('/settings/location/list');
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

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (businsLoca.name == "") {
            setShowAlert('Please enter business name!')
            handleClickOpen();
        }
        else if (businsLoca.whatsappno == "") {
            setShowAlert('Please enter WhatsApp number!')
            handleClickOpen();
        }
        else if (businsLoca.email && (!businsLoca.email.includes('@' && '.'))) {
            setShowAlert('Please enter correct email!')
            handleClickOpen();
        } 
        else if(businsLoca.phonenumber == ""){
            setShowAlert('Please enter Phone Number!')
            handleClickOpen();
        }else {
            updatebusinsLoca();
        }
    }

    return (
        <Box>
            <Headtitle title={'BusinessLocation Edit'} />
            <form onSubmit={handleEditSubmit}>
                <Typography sx={userStyle.HeaderText}>Edit Business Locations</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <InputLabel htmlFor="component-outlined">Business Name <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="business name"
                                    type="text"
                                    value={businsLoca.businessname}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <InputLabel htmlFor="component-outlined">Location Name <b style={{ color: "red" }}> *</b></InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="locationname"
                                    type="text"
                                    value={businsLoca.locationname}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, locationname: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Location Id</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="location id"
                                    type="text"
                                    value={businsLoca.locationid}
                                />
                            </FormControl>
                            <Typography variant="body2" sx={{ marginTop: "5px" }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Landmark</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
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
                            {/* <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="country"
                                    type="text"
                                    value={businsLoca.country}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, country: e.target.value }) }}
                                />
                            </FormControl> */}
                            <FormControl size="small" fullWidth>
                                    <Select
                                        options={Country.getAllCountries()}
                                        getOptionLabel={(options) => options["name"]}
                                        getOptionValue={(options) => options["name"]}
                                        value={selectedCountry}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCountry(item);
                                            // Update supplier's country property
                                            setBusinsLoca((businsLoca) => ({
                                                ...businsLoca,
                                                country: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">State</InputLabel>
                            {/* <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="state"
                                    type="text"
                                    value={businsLoca.state}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, state: e.target.value }) }}
                                />
                            </FormControl> */}
                            <FormControl size="small" fullWidth>
                                    <Select
                                        options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                        getOptionLabel={(options) => options["name"]}
                                        getOptionValue={(options) => options["name"]}
                                        value={selectedState}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedState(item);
                                            // Update supplier's state property
                                            setBusinsLoca((businsLoca) => ({
                                                ...businsLoca,
                                                state: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">City</InputLabel>
                            {/* <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="city"
                                    type="text"
                                    value={businsLoca.city}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, city: e.target.value }) }}
                                />
                            </FormControl> */}
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
                                            // Update supplier's city property
                                            setBusinsLoca((businsLoca) => ({
                                                ...businsLoca,
                                                city: item?.name || "",
                                            }));
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
                                    value={businsLoca.zipcde}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, zipcde: e.target.value }); handlePincode(e.target.value) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile Number</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber"
                                    type="number"
                                    value={businsLoca.phonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, phonenumber: e.target.value }); handlePhone(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}

                                />
                            </FormControl>

                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile 1</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber 1"
                                    type="number"
                                    value={businsLoca.onephonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, onephonenumber: e.target.value }); handlePhoneOne(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}

                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile 2</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber 2"
                                    type="number"
                                    value={businsLoca.twophonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, twophonenumber: e.target.value }); handlePhoneTwo(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}

                                />
                            </FormControl>

                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Mobile 3</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="mobilenumber 3"
                                    type="number"
                                    value={businsLoca.threephonenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, threephonenumber: e.target.value }); handlePhoneThree(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}

                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Landline Number</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="Landline number"
                                    type="text"
                                    value={businsLoca.landlinenumber}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, landlinenumber: e.target.value }); handleValidationLandline(e); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">WhatsApp <b style={{ color: "red" }}> *</b></InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    sx={userStyle.input}
                                    name="whatsappno"
                                    type="number"
                                    value={businsLoca.whatsappno}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, whatsappno: e.target.value }); handleWhatsApp(e.target.value) }}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </FormControl>

                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Email</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="email"
                                    type="email"
                                    value={businsLoca.email}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, email: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <InputLabel htmlFor="component-outlined">Website</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput id="outlined-adornment-password"
                                    name="website"
                                    type="text"
                                    value={businsLoca.website}
                                    onChange={(e) => { setBusinsLoca({ ...businsLoca, website: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/settings/location/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            {/* // Alert Box */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography>{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
function Businesslocationedit() {
    return (

<>
<BusinessLoceditlist /><br /><br /><br /><br />
                    <Footer />
</>
    );
}



export default Businesslocationedit;