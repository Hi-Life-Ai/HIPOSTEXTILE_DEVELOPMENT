import React, { useState, useContext, useEffect } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Createcustomergroup({ setFetchsavecustomergroup }) {

    const { auth, setngs } = useContext(AuthContext);
    const [customergrp, setCustomergrp] = useState([]);
    const [custGroup, setCustGroup] = useState({ cusgroupname: "", cusgroupid: "" });
    const [showAlert, setShowAlert] = useState("")


    // department Modal
    const [customergrpmodal, setCustomergrpmodel] = useState(false);
    const CustomergrpModOpen = () => { setCustomergrpmodel(true); };
    const CustomergrpModClose = () => { setCustomergrpmodel(false); setCustGroup({ ...custGroup, cusgroupid: "", cusgroupname: "" }); setShowAlert("") };

    //autogenerate....
    let newval = setngs ? setngs.cusgroupsku == undefined ? "CG0001" : setngs.cusgroupsku + "0001" : "CG0001";


    //  Fetch department Data
    const fetchHandler = async () => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER_GROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setCustomergrp(res?.data?.cgroups)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchHandler();
    }, []);
    

    // ******** Request to db ******** //
    // Add Datas
    const sendRequest = async () => {
        try {
            let response = await axios.post(SERVICE.CUSTOMER_GROUP_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                cusgroupname: String(custGroup.cusgroupname),
                cusgroupid: String(custGroup.cusgroupid),
                assignbusinessid: String(setngs.businessid),
            });
            setFetchsavecustomergroup("None")
            setCustGroup(response.data);
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            CustomergrpModClose();
            await fetchHandler();
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
        const isNameMatch = customergrp.some(item => item.cusgroupname?.toLowerCase() === (custGroup.cusgroupname)?.toLowerCase());
        const isCodeMatch = customergrp.some(item => item.cusgroupid?.toLowerCase() === (newval)?.toLowerCase());

        if (custGroup.cusgroupname == "") {
            setShowAlert("Please Enter Customer Group Name!")

        } else if (custGroup.cusgroupid == "") {
            setShowAlert("Please Enter Customer Group Code!")
        } else if (isCodeMatch) {
            setShowAlert("ID Already Exists");
        }
        else if (isNameMatch) {
            setShowAlert("Name Already Exists");
        } else {
            setShowAlert("");
            sendRequest();
        }
    }

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={CustomergrpModOpen} ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={CustomergrpModClose}
                aria-labelledby="customized-dialog-title1"
                open={customergrpmodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="md"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={CustomergrpModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Customer Group
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '750px', height: 'auto', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} >
                            <Grid item md={12} sm={12} xs={12}>
                                {customergrp && (
                                    customergrp.map(
                                        () => {
                                            let strings = setngs ? setngs.cusgroupsku : "CG";
                                            let refNo = customergrp[customergrp.length - 1].cusgroupid;
                                            let digits = (customergrp.length + 1).toString();
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
                                <InputLabel htmlFor="component-outlined">Contact Id</InputLabel>
                                <Grid sx={{ display: 'flex' }}  >
                                    <Grid sx={userStyle.spanIcons}><ContactPageOutlinedIcon /></Grid>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={newval}
                                            type="text"
                                            name="cusgroupid"
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Customer Group Name<b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        id="addCustGroupName"
                                        value={custGroup.cusgroupname}
                                        onChange={(e) => { setCustGroup({ ...custGroup, cusgroupname: e.target.value, cusgroupid: newval });setShowAlert(""); }}
                                        placeholder="Customer Group Name"
                                        name="cusgroupname"
                                        type="text"
                                    />
                                    <p style={{ color: 'red' }}>{showAlert}</p> <br />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' onClick={handleSubmit} sx={userStyle.buttonadd}>Save</Button>
                        <Button onClick={CustomergrpModClose} variant='contained' color="error" sx={userStyle.buttoncancel} style={{ marginTop: "5px" }}>Clear</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
export default Createcustomergroup;