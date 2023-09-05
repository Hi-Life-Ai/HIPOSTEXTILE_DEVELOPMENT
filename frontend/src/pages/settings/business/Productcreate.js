import React, { useState, useEffect, useContext } from "react";
import { Box, Grid, Dialog, DialogContent, DialogActions, Typography, Button, FormControl, InputLabel, OutlinedInput, Select, MenuItem, } from '@mui/material';
import { colourStyles } from "../../PageStyle";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Selects from 'react-select';
import { toast } from 'react-toastify';

export default function Productcreate({ isSetngs, setIsSetngs }) {

    const [units, setUnits] = useState([]);
    const [allTax, setAlltax] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const { allTaxratesGroup } = useContext(UserRoleAccessContext)
    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()

    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const handleValidationSku = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState) => {
                return { ...prevState, skuprefix: value };
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState) => {
                return { ...prevState, skuprefix: value };
            })
        } else if (val.length > 2) {
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState) => {
                return { ...prevState, skuprefix: num };
            })
        }
    }

    const handleValidationMinQty = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState) => {
                return { ...prevState, minquantity: value };
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState) => {
                return { ...prevState, minquantity: value };
            })
        }
    }

    const handleValidationMaxQty = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState) => {
                return { ...prevState, maxquantity: value };
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState) => {
                return { ...prevState, maxquantity: value };
            })
        }
    }

    //product types 
    const producttypes = [
        { value: "Single", label: "Single" },
        { value: "Combo", label: "Combo" }
    ];

    //barcode code types 
    const barcodetypes = [
        { value: "Qr code", label: "Qr code" },
        { value: "Code 128 (C128)", label: "Code 128 (C128)" },
        { value: "Code 39 (C39)", label: "Code 39 (C39)" },
        { value: "EAN-13", label: "EAN-13" },
        { value: "EAN-8", label: "EAN-8" },
        { value: "UPC-A", label: "UPC-A" },
        { value: "UPC-E", label: "UPC-E" },
    ];

    //selling price tax 
    const selltaxtype = [
        { value: "None", label: "None" },
        { value: "Exclusive", label: "Exclusive" },
        { value: "Inclusive", label: "Inclusive" }
    ];

    //multi select 
    const multiselect = [
        { value: "None", label: "None" },
        { value: "Size", label: "Size" },
        { value: "Color", label: "Color" },
    ];
    // Units
    const fetchUnit = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setUnits(
                res.data.units.map((d) => ({
                    ...d,
                    label: d.unit,
                    value: d.unit,
                }))
            );
            setAlltax(
                allTaxratesGroup.map((d) => ({
                    ...d,
                    label: d.taxname + '@' + d.taxrate,
                    value: d.taxname + '@' + d.taxrate,
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
            fetchUnit();
        }, []
    )

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">SKU Prefix</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            name="skuprefix"
                            value={isSetngs.skuprefix}
                            onChange={(e) => {
                                setIsSetngs((prevState) => {
                                    return { ...prevState, skuprefix: e.target.value };
                                }); handleValidationSku(e)
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Default Unit</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.defaultunit}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, defaultunit: e.value };
                            })}
                            options={units}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.applicabletax}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, applicabletax: e.value };
                            })}
                            options={allTax}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Multiselect</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.multivalue}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, multivalue: e.value };
                            })}
                            options={multiselect}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Selling price tax</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.sellingpricetax}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, sellingpricetax: e.value };
                            })}
                            options={selltaxtype}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Min quantity</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            name="skuprefix"
                            value={isSetngs.minquantity}
                            onChange={(e) => {
                                setIsSetngs((prevState) => {
                                    return { ...prevState, minquantity: e.target.value };
                                }); handleValidationMinQty(e)
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Max quantity</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            name="skuprefix"
                            value={isSetngs.maxquantity}
                            onChange={(e) => {
                                setIsSetngs((prevState) => {
                                    return { ...prevState, maxquantity: e.target.value };
                                }); handleValidationMaxQty(e)
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Barcode Type</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.barcodetype}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, barcodetype: e.value };
                            })}
                            options={barcodetypes}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Product Type</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            options={producttypes}
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.producttype}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, producttype: e.value };
                            })}
                        />
                    </FormControl>
                </Grid>
            </Grid>
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
        </Box>
    );
}