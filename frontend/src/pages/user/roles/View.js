import React, { useState, useEffect, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, FormGroup, FormControlLabel, Checkbox, Divider, Button,  } from '@mui/material';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function RoleViewList() {

    const { auth } = useContext(AuthContext);
    const [role, setRole] = useState({});

    const id = useParams().id

    const fetchRole = async () => {
        try {
            let res = await axios.get(`${SERVICE.ROLE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setRole(res?.data?.srole)
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
        fetchRole()
    }, [id]);

    return (
        <Box>
            <Headtitle title={'View Role'} />
            <form >
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>View Role</Typography>
                    </Grid>
                </Box>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2} sx={{
                        padding: '40px 20px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #b97df0',
                        },
                    }}>
                        <Grid item md={5}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Role Name <Typography style={{ color: "red" }}>*</Typography></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={role.rolename}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={7}></Grid>
                        <Grid item md={12}>
                            <InputLabel sx={{ fontWeight: '600' }}>Permissions</InputLabel>
                        </Grid>
                       
                         {/* Dashboard start */}
                         <Divider sx={{ my: 2 }} />
                        <Grid item md={4}></Grid>
                        <Grid item md={8}>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.home)}  />} label="Home" />
                                    <Typography style={{ color: "red" }}>*</Typography>
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.selectlocation)} />} label="Select Location Dropdown" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.from)}/>} label="From" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.to)}  />} label="To" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.totalpurchase)} />} label="Total Purchase" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.totalsales)}  />} label="Total Sales" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.purchasedue)}  />} label="Purchase Due" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.salesdue)}  />} label="Sales Due" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.totalsalesreturn)}  />} label="Total Sales Return" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.totalpurchasereturn)}  />} label="Total Purchase Return" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.expenses)}  />} label="Expenses" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.barchart)}  />} label="Bar Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.topproductspiechart)}/>} label="Top Selling Products Pie Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.topcustomerspiechart)} />} label="Top Customers Pie Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.stockalerttable)}  />} label="Stock Alert Table" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.recentsalestable)}  />} label="Recent Sales Table" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.topsellproductstable)}  />} label="Top Selling Products Table" />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        {/* Dashboard end */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.usermanagement)}  />} label="Users" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alluser)}  />} label="User" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalluser)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.auser)}  />} label="Add user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.euser)}  />} label="Edit user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.duser)} />} label="Delete user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vuser)}  />} label="View user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceluser)}  />} label="Excel user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvuser)}  />} label="CSV user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printuser)}  />} label="Print user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfuser)}  />} label="Pdf user" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allrole)}  />} label="Role" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallrole)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.arole)}  />} label="Add role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.erole)}  />} label="Edit role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.drole)}  />} label="Delete role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vrole)}/>} label="View role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelrole)}  />} label="Excel role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvrole)}  />} label="CSV role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printrole)}  />} label="Print role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfrole)} />} label="Pdf role" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alldepartment)} />} label="Department" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalldepartment)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.adepartment)}  />} label="Add Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.edepartment)}  />} label="Edit Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ddepartment)}  />} label="Delete Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vdepartment)} />} label="View Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceldepartment)}  />} label="Excel Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvdepartment)}  />} label="Csv Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printdepartment)}/>} label="Print Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfdepartment)}  />} label="Pdf Department" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.suppliermanagement)} />} label="Suppliers" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allsupplier)}  />} label="Supplier" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallsupplier)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.isupplier)}  />} label="Import supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.asupplier)}/>} label="Add supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.esupplier)}  />} label="Edit supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dsupplier)}  />} label="Delete supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vsupplier)} />} label="View supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelsupplier)}  />} label="Excel supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvsupplier)}  />} label="CSV supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfsupplier)}  />} label="Pdf supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printsupplier)}  />} label="Print supplier" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.customermanagement)}/>} label="Customers" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcustomer)} />} label="Customer" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcustomer)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.icustomer)}  />} label="Import customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.acustomer)}  />} label="Add customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ecustomer)} />} label="Edit customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vcustomer)}  />} label="View customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dcustomer)} />} label="Delete customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcustomer)}  />} label="Excel customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcustomer)} />} label="CSV customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcustomer)}  />} label="Print customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcustomer)}  />} label="Pdf customer" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcustomergrp)}  />} label="Customer Group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcustomergrp)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.acustomergrp)}  />} label="Add customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ecustomergrp)}  />} label="Edit customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dcustomergrp)}  />} label="Delete customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vcustomergrp)}  />} label="View customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcustomergrp)}  />} label="Excel customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcustomergrp)}  />} label="CSV customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcustomergrp)} />} label="Print customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcustomergrp)}  />} label="Pdf customer group" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.productmanagement)}  />} label="Products" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allunit)}  />} label="Units" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallunit)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aunit)}  />} label="Add unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eunit)}  />} label="Edit unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dunit)}  />} label="Delete unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vunit)} />} label="View unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelunit)}  />} label="Excel unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvunit)}  />} label="CSV unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printunit)}  />} label="Print unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfunit)} />} label="Pdf unit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allsize)}  />} label="Size" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallsize)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.asize)} />} label="Add size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.esize)}  />} label="Edit size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dsize)} />} label="Delete size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vsize)}  />} label="View size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelsize)}  />} label="Excel size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvsize)}  />} label="CSV size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printsize)}  />} label="Print size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfsize)} />} label="Pdf size" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstyle)}  />} label="Style" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstyle)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.astyle)} />} label="Add Style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.estyle)}  />} label="Edit style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dstyle)} />} label="Delete style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vstyle)}  />} label="View style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelstyle)}  />} label="Excel style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvstyle)}  />} label="CSV style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstyle)}  />} label="Print style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstyle)} />} label="Pdf style" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allsectiongrp)}  />} label="Section Group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallsectiongrp)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.asectiongrp)}  />} label="Add SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.esectiongrp)}  />} label="Edit SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dsectiongrp)}  />} label="Delete SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vsectiongrp)}  />} label="View SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelsectiongrp)} />} label="Excel SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvsectiongrp)} />} label="CSV SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printsectiongrp)}  />} label="Print SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfsectiongrp)}  />} label="Pdf SectionGroup" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allUnitGroup)}  />} label="Unit Group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallUnitGroup)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aUnitGroup)} />} label="Add UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eUnitGroup)}  />} label="Edit Group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dUnitGroup)} />} label="Delete UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vUnitGroup)}  />} label="View UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelUnitGroup)}  />} label="Excel UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvUnitGroup)}  />} label="CSV UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printUnitGroup)}  />} label="Print UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfUnitGroup)} />} label="Pdf UnitGroup" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcolor)}  />} label="Color" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcolor)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.acolor)} />} label="Add color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ecolor)} />} label="Edit color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dcolor)}  />} label="Delete color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vcolor)} />} label="View color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcolor)}  />} label="Excel color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcolor)}  />} label="CSV color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcolor)}  />} label="Print color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcolor)}  />} label="Pdf color" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcategory)}  />} label="Category" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcategory)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.acategory)}  />} label="Add category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ecategory)} />} label="Edit category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dcategory)}  />} label="Delete category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vcategory)}  />} label="View category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcategory)} />} label="Print category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcategory)} />} label="Pdf category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allproduct)} />} label="Product" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallproduct)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.iproduct)}  />} label="Import product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aproduct)}  />} label="Add product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eproduct)}  />} label="Edit product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dproduct)}  />} label="Delete product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vproduct)}/>} label="View product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelproduct)}  />} label="Excel product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvproduct)}  />} label="CSV product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printproduct)}  />} label="Print product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfproduct)}  />} label="Pdf product" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Racks Start */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allracks)} />} label="Rack" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallracks)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aracks)}  />} label="Add Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eracks)}  />} label="Edit Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dracks)}  />} label="Delete Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vracks)}  />} label="View Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelracks)} />} label="Excel Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvracks)} />} label="Csv Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printracks)} />} label="Print Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfracks)}  />} label="Pdf Racks" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Racks End */}
                        <Divider sx={{ my: 2 }} />

                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allbrands)} />} label="Brand" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallbrands)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.addbrand)}  />} label="Add Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.editbrand)}   />} label="Edit Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.deletebrand)}  />} label="Delete Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.viewbrand)}  />} label="View Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelbrand)}  />} label="Excel Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvbrand)}  />} label="Csv Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printbrand)} />} label="Print Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfbrand)}  />} label="Pdf Brand" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allgrouping)}  />} label="Category Grouping" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallgrouping)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.addgrouping)}  />} label="Add Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.editgrouping)}  />} label="Edit Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.deletegrouping)}  />} label="Delete Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.viewgrouping)} />} label="View Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelgrouping)}  />} label="Excel Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvgrouping)} />} label="Csv Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printgrouping)}  />} label="Print Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfgrouping)} />} label="Pdf Grouping" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alldiscount)}  />} label="Discount" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalldiscount)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.adiscount)} />} label="Add discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ediscount)}  />} label="Edit discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ddiscount)}  />} label="Delete discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vdiscount)}  />} label="View discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceldiscount)}  />} label="Excel discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvdiscount)}  />} label="CSV discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printdiscount)}  />} label="Print discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfdiscount)} />} label="Pdf discount" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}></Grid>
                        <Grid item md={2}></Grid>
                        <Grid item md={8}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allproductlabel)}  />} label="Print Labels" />
                            </FormGroup><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.purchasemanagement)} />} label="Purchases" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allpurchase)} />} label="Purchase" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallpurchase)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.apurchase)}  />} label="Add purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.epurchase)}  />} label="Edit purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dpurchase)}  />} label="Delete purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vpurchase)} />} label="View purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvpurchase)} />} label="Csv purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelpurchase)}   />} label="Excel purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printpurchase)}  />} label="Print purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfpurchase)}  />} label="Pdf purchase" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Purchase Return Start */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allpurchasereturn)}  />} label="Purchase Return" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallpurchasereturn)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.apurchasereturn)}  />} label="Add Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.epurchasereturn)}  />} label="Edit Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dpurchasereturn)}  />} label="Delete Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vpurchasereturn)}  />} label="View Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelpurchasereturn)}  />} label="Excel Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvpurchasereturn)}  />} label="Csv Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printpurchasereturn)}  />} label="Print Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfpurchasereturn)}  />} label="Pdf Purchase Return" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.sellmanagement)}  />} label="Sell" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allpos)}  />} label="Pos" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallpos)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.apos)}  />} label="Add pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vpos)} />} label="View pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dpos)}  />} label="Delete pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelpos)}  />} label="Excel pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvpos)}  />} label="Csv pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printpos)}  />} label="Print pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfpos)}  />} label="Pdf pos" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alldraft)} />} label="Draft" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalldraft)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.adraft)} />} label="Add draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.edraft)}  />} label="Edit draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vdraft)} />} label="View draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ddraft)}  />} label="Delete draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceldraft)}  />} label="Excel draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvdraft)}  />} label="Csv draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printdraft)}  />} label="Print draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfdraft)}  />} label="Pdf draft" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allquotation)}  />} label="Quotation" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallquotation)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aquotation)}  />} label="Add quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.equotation)} />} label="Edit quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vquotation)}  />} label="View quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dquotation)}  />} label="Delete quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelquotation)} />} label="Excel quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvquotation)}  />} label="Csv quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printquotation)}  />} label="Print quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfquotation)} />} label="Pdf quotation" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        
                        {/* Stock Transfer Start */}

                        <Divider sx={{ my: 2 }} />
                        
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.stocktransferlistmanagement)}  />} label="Stock" />
                            </FormGroup>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstock)} />} label="All Stock Details" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstock)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.astock)}/>} label="View All Stock Details" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printlabelstock)}  />} label="Label All Stock Details" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelstock)} />} label="Excel All Stock Details" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvstock)}/>} label="CSV All Stock Details" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstock)}  />} label="Print stock" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstock)} />} label="Pdf stock" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstocktransferlist)}  />} label="Stock Transfer" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstocktransferlist)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.astocktransferlist)}  />} label="Add Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vstocktransferlist)}  />} label="View Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstocktransferlist)}  />} label="Pdf Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstocktransferlist)} />} label="Print Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Transfer End */}

                        {/* Stock Adjust Start */}

                       
                        {/* Stock Adjust Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstockadjust)} />} label="Stock Adjustment" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstockadjust)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                            <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.astockadjust)} />} label="Add Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vstockadjust)} />} label="View Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstockadjust)} />} label="Print Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstockadjust)} />} label="Pdf Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Adjust End */}
                        {/*Stock adjustment type  */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstockadjustmenttype)} />} label="Adjustment Type" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstockadjustmenttype)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.astockadjustmenttype)} />} label="Add Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.estockadjustmenttype)} />} label="Edit Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dstockadjustmenttype)} />} label="Delete Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vstockadjustmenttype)} />} label="View Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelstockadjustmenttype)} />} label="Excel Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvstockadjustmenttype)} />} label="CSV Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstockadjustmenttype)} />} label="Print Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstockadjustmenttype)} />} label="Pdf Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allmanualstockentry)}  />} label="Manual Stock Entry" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallmanualstockentry)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.astockmanualstockentry)}  />} label="Add Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.estockmanualstockentry)}  />} label="Edit Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dstockmanualstockentry)}  />} label="Delete Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vstockmanualstockentry)}  />} label="View Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelmanualstockentry)}  />} label="Excel Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvmanualstockentry)}  />} label="CSV Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printmanualstockentry)}  />} label="Print Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfmanualstockentry)} />} label="Print Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>


                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcurrentstockreport)} />} label="Current Stock Report " />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcurrentstock)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcurrentstockreport)} />} label=" Excel Current stock Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcurrentstockreport)}  />} label="CSV Current stock Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcurrentstockreport)}  />} label="Print Current stock Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcurrentstockreport)}  />} label="Pdf Current stock Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.expensemanagement)} />} label="Expenses" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allexpense)}  />} label="Expense" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallexpense)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aexpense)}  />} label="Add expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eexpense)} />} label="Edit expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dexpense)} />} label="Delete expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vexpense)}  />} label="View expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelexpense)}  />} label="Excel expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvexpense)}  />} label="Csv expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printexpense)}  />} label="Print expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfexpense)}  />} label="Pdf expense" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allexpensecategory)}  />} label="Expense category" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallexpensecategory)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aexpensecategory)}  />} label="Add Expense Category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eexpensecategory)} />} label="Edit Expense Category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dexpensecategory)} />} label="Delete Expense Category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vexpensecategory)}  />} label="View Expense Category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelexpensecategory)}  />} label="Excel Expense Category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvexpensecategory)}  />} label="Csv Expense Category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printexpensecategory)}  />} label="Print Expense Category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfexpensecategory)}  />} label="Pdf Expense Category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
          
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}></Grid>
                        <Grid item md={8}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.businesssettings)}  />} label="Business settings" />
                            </FormGroup><br /><hr /><br />
                        </Grid>


                        {/* Password Management Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.passwordmanagement)}  />} label="Password" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allpassword)}  />} label="Password" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallpassword)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.apassword)}  />} label="Add Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.epassword)}  />} label="Edit Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dpassword)}  />} label="Delete Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vpassword)}/>} label="View Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelpassword)}/>} label="Excel Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvpassword)}  />} label="Csv Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printpassword)}  />} label="Print Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfpassword)}  />} label="Pdf Password" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Password Management End */}

                        {/* Folder Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allfolder)}  />} label="Folder" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallfolder)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.afolder)} />} label="Add Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.efolder)}  />} label="Edit Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dfolder)}  />} label="Delete Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vfolder)}  />} label="View Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelfolder)}  />} label="Excel Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvfolder)}  />} label="Csv Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printfolder)}  />} label="Print Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdffolder)}  />} label="Pdf Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.addnewfolder)}  />} label="Add Password To Folder" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Folder End */}
                        {/* Assign password Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allassignpassword)}  />} label="Assign password" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallassignpassword)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.assignpasswordlist)}  />} label="Assign password List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelassignpassword)}  />} label="Excel Assign password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvassignpassword)}  />} label="Csv Assign password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printassignpassword)}  />} label="Print Assign password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfassignpassword)}  />} label="Pdf Assign password" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Assign passwoed End */}
                        <Divider sx={{ my: 2 }} />
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.settingsmanagement)} />} label="Settings" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allbusinesslocation)}  />} label="Business location" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallbusinesslocation)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.activatebusinesslocation)}  />} label="Activate business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.abusinesslocation)}  />} label="Add business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ebusinesslocation)}  />} label="Edit business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vbusinesslocation)}  />} label="View business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dbusinesslocation)} />} label="Delete business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelbusinesslocation)}  />} label="Excel business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvbusinesslocation)} />} label="Csv business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printbusinesslocation)} />} label="Print business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfbusinesslocation)}  />} label="Pdf expense category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allalpharate)}  />} label="Alpharate" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallalpharate)} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aalpharate)}  />} label="Add alpharate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.valpharate)}  />} label="View alpharate" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alltaxrate)}  />} label="Taxrate" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalltaxrate)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ataxrate)}  />} label="Add taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.etaxrate)}  />} label="Edit taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dtaxrate)}  />} label="Delete taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vtaxrate)}  />} label="View taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceltaxrate)}  />} label="Excel taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvtaxrate)}  />} label="Csv taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printtaxrate)}  />} label="Print taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdftaxrate)}/>} label="Pdf taxrate" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alltaxrategroup)}  />} label="Taxrate group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalltaxrategroup)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ataxrategroup)}/>} label="Add taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dtaxrategroup)}  />} label="Delete taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vtaxrategroup)}  />} label="View taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceltaxrategroup)}  />} label="Excel taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvtaxrategroup)}   />} label="Csv taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printtaxrategroup)}  />} label="Print taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdftaxrategroup)}  />} label="Pdf taxrate group" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alltaxratehsn)}  />} label="Hsn" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalltaxratehsn)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ataxratehsn)}  />} label="Add hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dtaxratehsn)}  />} label="Delete hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vtaxratehsn)}  />} label="View hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceltaxratehsn)} />} label="Excel hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvtaxratehsn)} />} label="Csv hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printtaxratehsn)}  />} label="Print hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdftaxratehsn)}  />} label="Pdf hsn" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>                     <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allpaymentintegration)} />} label="Payment Integration" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallpaymentintegration)}  />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.apaymentintegration)} />} label="Add payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dpaymentintegration)} />} label="Delete payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vpaymentintegration)}  />} label="View payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelpaymentintegration)}  />} label="Excel payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvpaymentintegration)}  />} label="Csv payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfpaymentintegration)}  />} label="Pdf payment integration" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
   

                       
                        <Grid item md={12} sm={6} xs={6} >
                            <Link to="/user/role/list"><Button sx={userStyle.buttoncancel} >BACK</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

function RoleView() {
    return (
<>
<RoleViewList /><br /><br /><br /><br />
                    <Footer />
</>
    );
}

export default RoleView;