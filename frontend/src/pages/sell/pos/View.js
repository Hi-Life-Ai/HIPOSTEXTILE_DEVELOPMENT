import React, { useState, useEffect, useContext } from "react";
import { userStyle } from "../../PageStyle";
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, TableCell, Typography, Button, Table, TableContainer, TableHead, TableRow, TableBody } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import axios from "axios";
import { toast } from 'react-toastify';
import Mainlogo from "../../../assets/images/mainlogo.png";
import Headtitle from '../../../components/header/Headtitle';
import { useNavigate, useParams,Link } from 'react-router-dom';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import moment from 'moment'

const Posview = () => {

    const { auth } = useContext(AuthContext)
    const { allLocations } = useContext(UserRoleAccessContext)

    const [isPos, setIsPos] = useState({});
    const [isLocation, setIsLocation] = useState({});
    const [tableData, setTableData] = useState([]);

    const id = useParams().id; 

    // get all discount 
    const fetchPos = async () => {
        try {
            let res = await axios.get(`${SERVICE.POS_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            
            let selectlocation = allLocations.length > 0 && allLocations.filter((data, index) => {
                return data.locationid == res?.data?.spos?.businesslocation
            })
            setIsLocation(selectlocation[0]);
            setIsPos(res?.data?.spos);
            setTableData(res?.data?.spos?.goods);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    let backPage = useNavigate();

    const handleBack = ()=>{
        backPage('/sell/pos/list');
    }

    useEffect(
        ()=>{
            fetchPos();
        },[id]
    )
    return (
        <Box id="fullScreen"
            sx={userStyle.container}
        >
            <Headtitle title={'Pos View'} />
            <form >
                {/* Navbar Start */}
                <Box>
                    <Grid container spacing={1}>
                        <Grid item lg={1} md={1} sm={2} xs={12}>
                            <Box sx={{ float: "left" }}>
                                <Link to="/">
                                    <img src={Mainlogo} alt="logo" style={{ width: '50px', height: '50px' }}></img>
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item md={2} sm={8} xs={11} sx={{ marginTop: "17px" }}>
                            <InputLabel sx={{ marginTop: '-21px' }}>Business Location</InputLabel>
                                <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isLocation ? isLocation.name ? isLocation.name : "" : ""}
                                    sx={userStyle.estimateNavbarInput}
                                />
                                </FormControl>
                        </Grid>
                        <Grid item md={2} sm={8} xs={11} sx={{ marginTop: "17px" }}>
                            <InputLabel sx={{ marginTop: '-21px' }}>Customer</InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                    <SearchOutlinedIcon />
                                </Grid>
                                <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isPos.customer}
                                    sx={userStyle.estimateNavbarInput}
                                />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ padding: "5px", margin: '0px' }}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Date </InputLabel>
                            <FormControl size="small" fullWidth>
                             <OutlinedInput
                                    id="component-outlined"
                                    value={moment(isPos.date).utc().format('DD-MM-YYYY')}
                                    sx={userStyle.estimateNavbarInput}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={1} sm={6} xs={12} sx={{}}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Counter</InputLabel>
                            <FormControl
                                size="small"
                                fullWidth
                                sx={{ display: "flex" }}
                            >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isPos.counter}
                                    sx={userStyle.estimateNavbarInput}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Credit Limit </InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: '34px' }}>
                                    <MoneyOutlinedIcon sx={{ marginTop: '-1px' }} />
                                </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={isPos.creditlimit}
                                        sx={userStyle.estimateNavbarInput}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{}}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Ledger Balance </InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: '34px' }}>
                                    <PersonOutlineOutlinedIcon sx={{ marginTop: '-1px' }} />
                                </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                   <TextField
                                        size="small"
                                        value={isPos.ledgerbalance}
                                        sx={userStyle.input}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                {/* Navbar Ends */}
                <Grid container sx={{ backgroundColor: "#f0f2ff", }} >
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ paddingRight: '3px', backgroundColor: '#fff' }} >
                        <br />
                        <Grid container spacing={3}>
                            <Grid item md={1} sm={6} xs={12} sx={{ marginLeft: '25px' }}></Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                {/* Table start */}
                                <TableContainer
                                    sx={{ paddingLeft: 1, height: '478px' }}
                                >
                                    <Table
                                        aria-label="customized table" padding='none'>
                                        <TableHead >
                                            <TableRow>
                                                <TableCell sx={userStyle.tableHead1} style={{ marginLeft: '5px' }}>Product Name</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Qty</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Unit Cost ( Ex. Tax )</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Tax</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Unit Cost ( Inc. Tax )</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Discount value</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Subtotal </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tableData.length > 0 &&
                                                tableData.map((data, i) => {
                                                    return (
                                                        <>
                                                            <TableRow sx={{ height: '16px' }}>
                                                                <TableCell key={i}>{data?.productname}</TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {data?.quantity}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {data?.sellingexcludevalue}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {data?.taxtareval}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {data?.sellingincludevalue}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell >
                                                                    <Grid container>
                                                                        <Grid item lg={8} md={9} sm={9} xs={9}>
                                                                            <Typography>
                                                                                {data?.discountamt}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant='subtitle1'>{data?.subtotal}</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* Table Ends */}
                            </Grid>
                            <Grid item lg={3} md={3} sm={4} xs={12} sx={{ paddingLeft: '4px', paddingRight: '1px', marginTop: '-4px' }}>
                                <Button fullWidth variant="contained" sx={{ marginTop: "5px", }}>
                                    <b>GRAND TOTAL :</b>&ensp;{isPos.grandtotal}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: '-24px' }}><br />
                                <Grid container spacing={1}>
                                    <Grid item md={3} sm={4} xs={12}>
                                        <Typography sx={{ marginLeft: '15px' }}>
                                            <b> Total Items :</b>{isPos.totalitems}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Discount Type:</b>{isPos.granddistype}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Discount Amount:</b>{isPos.gdiscountvalue}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>total product:</b>{isPos.totalproducts}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Amount Gain:</b>{isPos.amountgain}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Balance:</b>{isPos.balance}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Order Tax:</b>{isPos.ordertax}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Shipping Tax:</b>{isPos.shippingtax}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Package Charge:</b>{isPos.packcharge}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Roundoff:</b>{isPos.roundof}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Due Amount:</b>{isPos.dueamount}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container sx={userStyle.btnGrid}>
                    <Grid item md={8} sm={8} xs={12} sx={{ display: "flex", color: 'black' }}>
                        <Button disableRipple sx={userStyle.buttoncancel} onClick={handleBack}>BACK</Button>
                        <Typography 
                            sx={{ marginLeft: '15px', color: 'grey', fontSize: "20px" }}>
                            <b>Total:</b> <span style={{ color: 'green' }}>{isPos.aftergranddisctotal}</span>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};
export default Posview;