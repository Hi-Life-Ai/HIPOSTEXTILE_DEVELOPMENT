import React, { useState, useEffect, useRef, createRef, useContext } from 'react';
import { Button, Grid, Typography, Box, FormControl,TextareaAutosize,FormGroup,Checkbox,FormControlLabel,OutlinedInput,InputLabel, MenuItem, Table, TableBody, TableContainer, TableHead, Paper, Dialog, DialogContent, DialogActions } from '@mui/material';
import Navbar from '../../../components/header/Navbar';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import Footer from '../../../components/footer/Footer';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailIconOutlined from '@mui/icons-material/EmailOutlined';
import LocationOnIconOutlined from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useParams, Link } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import Select from 'react-select';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Supplierviewlist() {

    const [supplier, setSupplier] = useState({});
    const { auth } = useContext(AuthContext);
    const id = useParams().id;
    const [sorting, setSorting] = useState({ column: '', direction: '' });

    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sorting.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.SUPPLIER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSupplier(response?.data?.ssupplier);
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
        <Box >
            <Headtitle title={'Supplier View'} />
            <Typography sx={userStyle.HeaderText}>View Supplier</Typography>
            <Box sx={userStyle.container}>

                <Grid container spacing={3}>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6' sx={{ justifyContent: 'center' }}>S.No</Typography>
                    </Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Fields</Typography>
                    </Grid>
                    <Grid item md={8} sm={6} xs={12}></Grid>

                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>1.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Supplier Code</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIcons}><ContactPageOutlinedIcon /></Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.autogenerate}
                                    type="text"
                                    name="autogenerate"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>2.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Supplier Name</Typography>
                    </Grid>
                    <Grid item md={3} sm={3} xs={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIcons}><PersonOutlineOutlinedIcon /></Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.suppliername}
                                    type="text"
                                    name="suppliername"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={3} sm={3} xs={12}>
                        <Grid container>
                            <Grid item lg={4} md={4}>
                                <InputLabel sx={{ marginTop: 1, marginRight: '3px' }}>Shortname</InputLabel>
                            </Grid>
                            <Grid item lg={8} md={8}>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        value={supplier.suppshortname}
                                        type="text"
                                        name="suppliershortname"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>

                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>3.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Address1</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <FormControl size="small" fullWidth >
                            <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                value={supplier.addressone}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>

                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>4.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Address2</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <FormControl size="small" fullWidth >
                            <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                value={supplier.addresstwo}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>

                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>5.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Country</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid sx={{ display: 'flex' }}>
                            <Grid sx={userStyle.spanIcons}><LanguageOutlinedIcon /></Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.country}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>6.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>State</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid sx={{ display: 'flex' }}>
                            <Grid sx={userStyle.spanIcons}><LocationOnIconOutlined /></Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.state}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>7.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>City</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIcons}><LocationOnIconOutlined /></Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.city}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>8.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Pincode</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIcons}><LocationOnIconOutlined /></Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    value={supplier.pincode}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>9.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Email</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIcons}><EmailIconOutlined /></Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.supplieremail}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>10.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>GSTN</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                value={supplier.gstn}
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>11.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Phone</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid container spacing={1}>
                            <Grid item md={6} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined">Phone1</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        value={supplier.phoneone}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined">Phone2</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        value={supplier.phonetwo}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined">Phone3</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        value={supplier.phonethree}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined">Phone4</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        value={supplier.phonefour}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>12.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Landline</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                value={supplier.landline}
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>13.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Whatsapp</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                sx={userStyle.input}
                                id="component-outlined"
                                value={supplier.whatsapp}
                                type="number"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>14.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Contact Person</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                value={supplier.contactperson}
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                    <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>15.</Typography></Grid>
                    <Grid item md={2} sm={3} xs={12}>
                        <Typography variant='h6'>Credit Days</Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                sx={userStyle.input}
                                id="component-outlined"
                                value={supplier.creditdays}
                                type="number"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>16.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Bank Details</Typography>
                        </Grid>
                        <Grid  item md={12} sm={6} xs={12} sx={{ justifyContent: "center" ,display:"flex"}}>
                                <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="categorytable">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell onClick={() => handleSorting('bankname')}><Box sx={userStyle.tableheadstyle}><Box>Brank Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('bankname')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('branchname')}><Box sx={userStyle.tableheadstyle}><Box>Branch Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('branchname')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('accountholdername')}><Box sx={userStyle.tableheadstyle}><Box>Account Holder Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('accountholdername')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('accountnumber')}><Box sx={userStyle.tableheadstyle}><Box>Account Number</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('accountnumber')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('ifsccode')}><Box sx={userStyle.tableheadstyle}><Box>IFSC Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('ifsccode')}</Box></Box></StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody align="left">

                                        {supplier?.bankdetails?.length > 0 ? supplier.bankdetails.map((todo , index)=>{  
                                            return(
                                                <>
                                        <StyledTableRow key={index}>     
                                        <StyledTableCell component="th" scope="row"> { todo.bankname} </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> { todo.branchname} </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> {todo.ifsccode } </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> {todo.accno } </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> {todo.ifsccode } </StyledTableCell>
                                            </StyledTableRow>
                                            </>
                                     
                                     )}) : 
                                     <StyledTableRow><StyledTableCell colSpan={6} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                 }

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                         </Grid><br /><br />
                    <Grid item md={2} xs={12}></Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/contact/supplier/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

function Supplierview() {
    return (
        <>
             <Supplierviewlist /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}

export default Supplierview;