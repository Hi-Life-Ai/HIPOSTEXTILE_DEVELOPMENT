import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, Button, TableContainer, Paper, Table, TableBody, TableHead } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';

const StockAdjustmentlist = () => {


    const { auth } = useContext(AuthContext);
    const [StockAdd, setStockAdd] = useState({});
    const [transferproducts, setTransferProducts] = useState([]);
    const [isLocation, setIsLocation] = useState({});
    const { allLocations } = useContext(UserRoleAccessContext)

    const id = useParams().id;
    const AddStockAdjust = async () => {
        try {
            let req = await axios.get(`${SERVICE.STOCK_ADJUSTMENT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });
            setStockAdd(req?.data?.sstockadjustments);
            setTransferProducts(req?.data?.sstockadjustments?.transferproducts)
            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == req?.data?.sstockadjustments?.businesslocation
            })
            setIsLocation(selectlocation[0]);
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

    useEffect(() => { AddStockAdjust() }, [])

    return (
        <Box>
            <Headtitle title={'View Stock Adjustment'} />
                <Typography sx={userStyle.HeaderText}>View Stock Adjustment</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isLocation ? isLocation.name : ""}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Section</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={StockAdd.section}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={StockAdd.category}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">SubCategory</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={StockAdd.subcategory}
                                    readOnly

                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Brand</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={StockAdd.brand}
                                    readOnly

                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">SubBrand</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={StockAdd.subbrand}
                                    readOnly

                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Size</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={StockAdd.size}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Color</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={StockAdd.color}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Style</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={StockAdd.style}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Units</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={StockAdd.unit}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <br /><br /><br />
                    <TableContainer component={Paper} >
                    <Table aria-label="simple table" id="stockadjustmentPDF">
                        <TableHead sx={{ fontWeight: "600" }} >
                            <StyledTableRow >
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Supplier Name</Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Purchase Date</Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Product Name</Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Purchase Quantity</Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Adjustment Quantity</Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Adjustment Mode</Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Adjustment Type</Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }}><Box>Balance Stok</Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {transferproducts.length > 0 ?
                                (transferproducts.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.supplier}</StyledTableCell>
                                        <StyledTableCell>{row.date}</StyledTableCell>
                                        <StyledTableCell>{row.productname}</StyledTableCell>
                                        <StyledTableCell>{row.purchasequantity}</StyledTableCell>
                                        <StyledTableCell>{row.adjustmentcount}</StyledTableCell>
                                        <StyledTableCell>{row.adjustmentmode}</StyledTableCell>
                                        <StyledTableCell>{row.adjustmenttype}</StyledTableCell>
                                        <StyledTableCell>{row.balancecount}</StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow><StyledTableCell colSpan={8} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                            }
                        </TableBody>
                    </Table >
                </TableContainer ><br /><br />
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/stock/adjustment/list"><Button sx={userStyle.buttoncancel}>back</Button></Link>
                        </Grid>
                    </Grid>
                </Box><br />
        </Box >
    );
}
const StockAdjustmentView = () => {
    return (
        <>
           <StockAdjustmentlist /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default StockAdjustmentView;  