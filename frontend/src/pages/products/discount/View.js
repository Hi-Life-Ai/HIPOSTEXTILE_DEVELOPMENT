import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Typography } from '@mui/material';
import Headtitle from '../../../components/header/Headtitle';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Footer from '../../../components/footer/Footer';
import { Link, useParams } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import { toast } from 'react-toastify';
import axios from 'axios';

const Discountviewlist = () => {

    const { auth } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext)
    const [isBusilocations, setIsBusilocations] = useState();

    const [disAddForm, setDisAddForm] = useState({});

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.DISCOUNT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == response?.data?.sdiscount?.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setDisAddForm(response?.data?.sdiscount);
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

    return (
        <Box>
            <Headtitle title={'View Discount'} />
            <Typography sx={userStyle.HeaderText}>View Discount</Typography>
            <Box sx={userStyle.container}>
                <form>
                    <Grid container spacing={3}>
                        {/* Grid one */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ display: "flex" }}>Location <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isBusilocations ? isBusilocations.name : ""}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Discount Id</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discountid}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.name}
                                />
                            </FormControl>
                        </Grid>

                        {/* Grid two */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Product Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        size='small'
                                        value={disAddForm.products}
                                    />
                                </FormControl>

                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.category}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub Category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.subcategory}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Brand</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.brand}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub Brand</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.subbrand}
                                />
                            </FormControl>
                        </Grid>
                        {/* Grid three */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Excluding Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.purchaseexcludetax}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Including Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.pruchaseincludetax}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Selling Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.sellingvalue}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ display: "flex" }}>Discount Type <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discounttype}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Select Discount Price</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.selectdiscountprice}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Discount Amount <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discountamt}
                                />
                            </FormControl>
                        </Grid>
                        {/* Grid four */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Discount value</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discountvalue}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Start At</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.startsat}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Ends At</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.endsat}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/product/discount/list"><Button sx={userStyle.buttoncancel}>Back</Button></Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
}
function Discountview() {
    return (

        <>
            <Discountviewlist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default Discountview;