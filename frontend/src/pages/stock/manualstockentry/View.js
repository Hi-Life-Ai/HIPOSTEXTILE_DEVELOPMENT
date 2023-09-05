import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextareaAutosize, Typography, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

const ManualStockViewTable = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [manualStockEntry, setManualstockEntry] = useState({
        category: "",
        subcategory: "",
        brand: "",
        subbrand: "",
        size: "",
        color: "",
        style: "",
        unit: "",
        productname: "",
        businesslocation: "",
        producttax: "",
        producttaxtype: "",
        purchaserate: "",
        alpha: "",
        quantity: "",
        totalquantity: "",
        sellcostwithtax: "",
        sellcostwithouttax: "",
        sellingalpha: "",
        saletaxamount: "",
    });

    const id = useParams().id;

    //view fetch...
    const Manualstockentry = async () => {
        try {
            let req = await axios.get(`${SERVICE.MANUALSTOCKENTRY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });
            setManualstockEntry(req?.data?.smanualstock)
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    useEffect(() => {
        Manualstockentry()
    },[]);


    return (
        <Box>
            <Headtitle title={' View Manual Stock Entry'} />
            <form>
                <Grid container spacing={3} >
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Typography sx={userStyle.HeaderText}>View Manual Stock Entry</Typography>
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                        <InputLabel >Business Location<b style={{ color: "red" }}> *</b></InputLabel>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                            value={manualStockEntry.businesslocation}
                            />
                        </FormControl>
                    </Grid>
                </Grid><br /><br />
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} >
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Suppliername</InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                              value={manualStockEntry.suppliername}
                            
                            />
                               
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={manualStockEntry.category}
                                 
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">SubCategory</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.subcategory}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Brand</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.brand}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">SubBrand</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.subbrand}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Size</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.size}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Color</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.color}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Style</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.style}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Units</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.unit}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Product Name</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={manualStockEntry.productname}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        {/* <Grid container sx={userStyle.gridcontainer}>
                            <Grid>
                                <Button sx={userStyle.buttonadd}>filter</Button>
                            </Grid>
                        </Grid> */}
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Product Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={manualStockEntry.productappilcabletaxtax}
                                  
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Selling Tax Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockEntry.sellingtaxtype}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Margin</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={setngs.dprofitpercent}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Purchase Rate</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={manualStockEntry.purchaserate}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Purchase Alpha</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockEntry.alpha}
                                  
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Quantity</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockEntry.quantity}
                                  
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Unit</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockEntry.unit}
                            
                                />
                            </FormControl>
                        </Grid>


                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Total Quantity</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockEntry.totalquantity}
                                 
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Selling Cost With Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockEntry.sellcostwithtax}
                                   
                                />
                            </FormControl>
                        </Grid>


                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Sale Tax Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    placeholder="Sale Tax Amount"
                                    value={manualStockEntry.saletaxamount}
                                  
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Selling Cost Without Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockEntry.sellcostwithouttax}
                                    placeholder="Selling Cost Without Tax"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                     <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                            <Link to="/stock/manualstockentry/list"><Button sx={userStyle.buttoncancel} >back</Button></Link>
                        </Grid>
                    </Grid>
                </Box><br />
            </form>
        </Box >
    );
}
const ManualStockView = () => {
    return (
        <>
           <ManualStockViewTable /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default ManualStockView;  