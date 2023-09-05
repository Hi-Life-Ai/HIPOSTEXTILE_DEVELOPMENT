import React, { useState, useEffect, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, TextareaAutosize, OutlinedInput, Typography, TextField, Button, } from '@mui/material';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Productviewlist() {

    const { auth } = useContext(AuthContext);
    const [product, setProduct] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState();
    const { allLocations } = useContext(UserRoleAccessContext)

    const id = useParams().id;

    // Tget HSN taxrates
    const getProducts = async () => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == res?.data?.sproduct?.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setProduct(res?.data?.sproduct);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // fetch all data from page load
    useEffect(() => {
        getProducts();
    }, [id]);


    return (
        <Box>
            <Headtitle title={'View Product'} />
            <form>

                {/* header text */}
                <Typography sx={userStyle.HeaderText}>View product</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={2} sx={userStyle.textInput}>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput

                                        value={product.category}
                                        disabled

                                    />
                                </FormControl>

                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput

                                    value={product.subcategory}
                                    disabled

                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Brand</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    value={product.brand}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub Brand</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    value={product.subbrand}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.productname}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel htmlFor="outlined-adornment-password">SKU <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.sku}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >HSN</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    readOnly
                                    id="component-outlined"
                                    value={product.hsn}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Barcode Type</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.barcodetype}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Size</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.size}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Color</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    disabled
                                    value={product.color}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Unit</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.unit}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Style</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.style}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Business location</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isBusilocations ? isBusilocations.name : ""}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        {product.managestock && (
                            <>
                                <Grid item lg={2} md={2} sm={6} xs={12}>
                                    <InputLabel htmlFor="component-outlined" >Minimum Quantity</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={product.minquantity}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={2} md={2} sm={6} xs={12}>
                                    <InputLabel htmlFor="component-outlined" >Maximum Quantity</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={product.maxquantity}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Rack</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.rack}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
                        <Grid item lg={9} md={9} sm={8} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Product Description</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={product.productdescription}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={4} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Product Image</InputLabel>
                            {product.productimage ? (
                                <>
                                    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <img src={product.productimage} width="60%" height="80px" />
                                    </Grid>
                                </>
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        {product.hsncode ?
                            <>
                                <Grid item md={4} sm={4} xs={12}>
                                    <InputLabel id="demo-select-small">HSN code</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <TextField
                                            disabled
                                            id="date"
                                            size='small'
                                            value={product.hsncode}
                                        />
                                    </FormControl>
                                </Grid>  </> : <>
                                <Grid item md={4} sm={4} xs={12}>
                                    <InputLabel htmlFor="component-outlined" >Applicable Tax</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={product.applicabletax}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid></>
                        }
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel id="demo-select-small">Selling Price Tax Type </InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.sellingpricetax}
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel >Product Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    disabled
                                    id="component-outlined"
                                    value={product.producttype}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/product/product/List"><Button sx={userStyle.buttoncancel} type='button'>BACK</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
                {/* content end */}
            </form>
        </Box>


    );
}

function Productview() {
    return (

       <>
        <Productviewlist /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}

export default Productview;