import React, { useContext, useState, useEffect } from 'react';
import { userStyle } from '../PageStyle';
import { Box, Paper, Table, TableBody, TableHead, Grid,Typography, TableContainer, Button, } from '@mui/material';
import Footer from '../../components/footer/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../components/header/Headtitle';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
function Stockadjustviewlist() {
    const { auth } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext)
    const [adjustitem, setAdjustitem] = useState({});
    const [isFromLocation, setIsFromLocation] = useState({});
    const [isToLocation, setIsToLocation] = useState([]);
    const id = useParams().id;
    let tolocations = [];
    const fetchStockadjust = async () => {
        try {
            let response = await axios.get(`${SERVICE.TRANSFER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
           
            let fromlocation = allLocations?.filter((data, index)=>{
                return data.locationid.includes(response.data.stransfer.fromlocation)
            })
            let tolocation = allLocations?.filter((data, index)=>{
                response.data.stransfer.tobusinesslocations.forEach((value, i)=>{
                    tolocations.push(data.locationid.includes(value))
                })

                return tolocations
            })
            setIsFromLocation(fromlocation[0]);
            setIsToLocation(allLocations);
            setAdjustitem(response?.data?.stransfer);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(
        () => {
        fetchStockadjust();
    }, []);
    return (
        <Box>
            <Headtitle title={'View Stock Adjust'} />
            <Typography sx={userStyle.HeaderText}>View Stock Adjust</Typography>
            <Box sx={userStyle.container}>
                <TableContainer component={Paper} >
                    <Table aria-label="simple table" id="tableRefone2" >
                        <TableHead sx={{ fontWeight: "600" }} >
                            <StyledTableRow >
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell>From Location</StyledTableCell>
                                <StyledTableCell>Product Name</StyledTableCell>
                                <StyledTableCell>Quantity</StyledTableCell>
                                <StyledTableCell>To Locations</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow >
                                <StyledTableCell>{adjustitem.date}</StyledTableCell>    
                                <StyledTableCell>{isFromLocation.name}</StyledTableCell>
                                <StyledTableCell>{adjustitem.products?.map((a) => a.productname+ ", ")}</StyledTableCell>
                                <StyledTableCell>{adjustitem.products?.map((value) => value.locations?.map((data, liindec) => value.quantity[data] + ', '))}</StyledTableCell>
                                <StyledTableCell>{isToLocation?.map((data, i) => adjustitem.tobusinesslocations.map((value, liindec) => data.locationid.includes(value) ? data.name + ", " : ""))}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer><br /><br />
                <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                    <Grid >
                        <Link to='/stocktransfer/list'><Button sx={userStyle.buttoncancel} type="button">BACK</Button></Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
function Stockadjustview() {
    return (
       <>
             <Stockadjustviewlist /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}
export default Stockadjustview;