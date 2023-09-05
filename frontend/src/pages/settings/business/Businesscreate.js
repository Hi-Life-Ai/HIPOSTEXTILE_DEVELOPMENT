import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, IconButton, OutlinedInput, Typography, Button } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import { userStyle, colourStyles } from '../../PageStyle';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import PercentIcon from '@mui/icons-material/Percent';
import Selects from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import BusinessLocCreate from './Locationcreate';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';


export default function Businesscreate({ isSetngs, setIsSetngs }) {
    const [file, setFile] = useState();
    const { auth, setngs } = useContext(AuthContext);
    const [isLocation, setIsLocation] = useState({});
    const [bslocation, setbsLocations] = useState("")
    const { allLocations, isActiveLocations } = useContext(UserRoleAccessContext)
    const { isUserRoleAccess, setAllPos, setIsActiveLocations, setAllLocations, setAllPurchases, isUserRoleCompare } = useContext(UserRoleAccessContext);


    const [busilocations, setBusilocations] = useState();
    //get all months
    const months = [
        { value: "January", label: "January", },
        { value: "February", label: "February", },
        { value: "March", label: "March", },
        { value: "April", label: "April", },
        { value: "May", label: "May", },
        { value: "June", label: "June", },
        { value: "July", label: "July", },
        { value: "August", label: "August", },
        { value: "September", label: "September", },
        { value: "October", label: "October", },
        { value: "November", label: "November", },
        { value: "December", label: "December" },
    ];
    //get account method
    const accountmethods = [
        { value: "FIFO(First in first out)", label: "FIFO(First in first out)" },
        { value: "LIFO(Last in first out)", label: "LIFO(Last in first out)" },
    ];
    //get date format
    const dateformats = [
        { value: "mm/dd/yyyy", label: "mm/dd/yyyy" },
        { value: "dd/mm/yyyy", label: "dd/mm/yyyy" },
        { value: "dd-mm-yyyy", label: "dd-mm-yyyy" },
        { value: "mm-dd-yyyy", label: "mm-dd-yyyy" },
    ];
    //get time format 
    const timeformats = [
        { value: "12 hour", label: "12 hour" },
        { value: "24 hour", label: "24 hour" },
    ];
    //get time zone 
    const timezones = [
        { value: "Asia/Kolkata", label: "Asia/Kolkata" },
    ];
    //get currency format
    const currencyformat = [
        { value: "Before Amount", label: "Before Amount" },
        { value: "After Amount", label: "After Amount" }
    ];
    //get currency
    const currencys = [
        { value: "India - Rupees(INR)", label: "India - Rupees(INR)" }
    ];
    // Business Location
    const fetchLocation = async () => {
        try {


            let res = await axios.post(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            let selectlocation = res.data.businesslocationsactive.filter((data, index) => {
                return data.locationid == isSetngs.businesslocation
            })
            setIsLocation(selectlocation[0]);
            setBusilocations(
                res.data.businesslocationsactive?.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.locationid,
                }))
            );
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
            fetchLocation();
        }, [isSetngs.businesslocation, bslocation, isLocation])

    // Image Upload
    function handleChange(e) {
        let businesslogo = document.getElementById("businesslogo")
        var path = (window.URL || window.webkitURL).createObjectURL(businesslogo.files[0]);
        toDataURL(path, function (dataUrl) {
            businesslogo.setAttribute('value', String(dataUrl));
            setIsSetngs({ ...isSetngs, businesslogo: String(dataUrl) })
            return dataUrl;
        })
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Business Name</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            value={isSetngs.businessname}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, businessname: e.target.value };
                            })}
                            type="text"
                            name="businessname"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Business Address</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            value={isSetngs.buniessaddress}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, buniessaddress: e.target.value };
                            })}
                            type="text"
                            name="buniessaddress"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Business Location</InputLabel>
                    <Grid sx={{ display: 'flex' }}>
                        <FormControl size="small" fullWidth>
                            <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                placeholder={isLocation ? isLocation.name : ""}
                                onChange={(e) => setIsSetngs((prevState) => {
                                    return { ...prevState, businesslocation: e.value };
                                })}
                                options={busilocations}
                            />


                        </FormControl>
                        <Grid sx={userStyle.spanIcons}><BusinessLocCreate setbsLocations={setbsLocations} /></Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Start date</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                value={isSetngs.startdate}
                                onChange={(e) => setIsSetngs((prevState) => {
                                    return { ...prevState, startdate: e.target.value };
                                })}
                                type="date"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <InputLabel htmlFor="outlined-adornment-password">Default Profit Percent</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >< PercentIcon /> </Grid>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                sx={userStyle.input}
                                id="component-outlined"
                                value={isSetngs.dprofitpercent}
                                onChange={(e) => setIsSetngs((prevState) => {
                                    return { ...prevState, dprofitpercent: e.target.value };
                                })}
                                name="dprofitpercent"
                                type="number"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Currency</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            <MoneyOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                placeholder={isSetngs.currency}
                                onChange={(e) => setIsSetngs((prevState) => {
                                    return { ...prevState, currency: e.value };
                                })}
                                options={currencys}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Currency Symbol Placement</InputLabel>
                    <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.currencysymbol}
                            onChange={(e) => setIsSetngs((prevState)=> {
                                return {...prevState,currencysymbol:e.value};
                            })}
                            options={currencyformat}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Time Zone</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            <ScheduleOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                placeholder={isSetngs.timezone}
                                onChange={(e) => setIsSetngs((prevState)=> {
                                    return {...prevState,timezone:e.value};
                                })}
                                options={timezones}
                            />
                        </FormControl>
                    </Grid>
                </Grid> */}
                <Grid item lg={4} md={6} sm={12} xs={12}>
                    <InputLabel>Upload Logo</InputLabel>
                    {file || isSetngs.businesslogo ? (
                        <>
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <img src={file ? file : isSetngs.businesslogo} style={{ width: '50%' }} height="80px" />
                            </Grid>
                        </>
                    ) : (
                        <></>
                    )

                    }
                    <Grid sx={{ display: 'flex' }}>
                        <FormControl size="small" fullWidth>
                            <Grid sx={{ display: 'flex' }}>
                                <Button component="label" sx={userStyle.uploadBtn}>
                                    Upload
                                    <input type='file' id="businesslogo" accept="image/*" name='file' hidden onChange={handleChange}
                                    />
                                </Button>
                                <Button onClick={(e) => { setFile(""); setIsSetngs({ ...isSetngs, businesslogo: "" }) }} sx={userStyle.buttoncancel}>Reset</Button>
                            </Grid>
                            <Typography variant='body2' style={{ marginTop: "5px", fontSize: '12px' }}>Allowed Type: .jpg,.png,.icon,.jpeg,Max File size: 3MB</Typography>
                        </FormControl>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Financial Year Start Month</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons}><CalendarTodayOutlinedIcon /></Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                placeholder={isSetngs.fyearsstartmonth}
                                onChange={(e) => setIsSetngs((prevState)=> {
                                    return {...prevState,fyearsstartmonth:e.value};
                                })}
                                options={months}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Stock Accounting Method</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            < CalculateOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                        <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                placeholder={isSetngs.stockaccountmethod}
                                onChange={(e) => setIsSetngs((prevState)=> {
                                    return {...prevState,stockaccountmethod:e.value};
                                })}
                                options={accountmethods}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Date Format</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            < CalendarTodayOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                placeholder={isSetngs.dateformat}
                                onChange={(e) => setIsSetngs((prevState)=> {
                                    return {...prevState,dateformat:e.value};
                                })}
                                options={dateformats}
                            />     
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Time Format</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} ><ScheduleOutlinedIcon /></Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                placeholder={isSetngs.timeformat}
                                onChange={(e) => setIsSetngs((prevState)=> {
                                    return {...prevState,timeformat:e.value};
                                })}
                                options={timeformats}
                            /> 
                        </FormControl>
                    </Grid>
                </Grid> */}
            </Grid>
        </Box>
    );
}