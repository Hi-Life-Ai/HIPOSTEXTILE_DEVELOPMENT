import React, { useEffect, useState, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Paper, TableCell, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { SERVICE } from '../../../services/Baseservice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';

const Purchasereturneditlist = () => {

    const [allProductsList, setAllProductsList] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState();
    const { auth, setngs } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext)

    const [purchaseReturn, setPurchaseReturn] = useState({});

    const id = useParams().id;

    const fetchHandlers = async () => {
        try {
            let req = await axios.get(`${SERVICE.PURCHASE_RETURN_SINGLE}/${id}`,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
           
            let selectlocation = allLocations.length > 0 && allLocations.filter((data, index) => {
                return data.locationid == req?.data?.spurchsertn?.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setPurchaseReturn(req?.data?.spurchsertn)
            setAllProductsList(req?.data?.spurchsertn?.products);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchHandlers()
    }, [id]);

    return (
        <Box>
            <form>
            <Headtitle title={'Purchase Return View'} />
                <Typography sx={userStyle.HeaderText}>View Purchase Return</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Supplier</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><PersonOutlineOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={purchaseReturn.supplier}
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Reference No:</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    type="text"
                                    value={purchaseReturn.referenceno}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Return Date</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    type="text"
                                    value={moment(purchaseReturn.purchasedate).format("DD-MM-YYYY")}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <Typography variant='subtitle1'>
                                <b>Address:</b> <br />
                                {purchaseReturn.addressone}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                        <InputLabel id="demo-select-small">Business Location :</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    type="text"
                                    value={isBusilocations ? isBusilocations.name : ""}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Invoice No</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    type="text"
                                    value={purchaseReturn.invoiceno}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box><br />
                <Box sx={userStyle.container} style={{ minHeight: '300px', }}>
                    <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                        <Table aria-label="customized table">
                            <TableHead >
                                <StyledTableRow >
                                    <TableCell sx={userStyle.tableHead1}>Product</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>LOT Number</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Tax</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Unit Cost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Quantity</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Netcost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Selling Price Unit Cost</TableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {allProductsList.length > 0 &&
                                    allProductsList.map((data, i) => {
                                        return (
                                            <>
                                                <StyledTableRow key={i}>
                                                    <StyledTableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <Typography variant='body2'>Product Name</Typography>
                                                                <TextField size='small'
                                                                    value={data?.prodname}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography variant='body2'>SKU</Typography>
                                                                <TextField size='small'
                                                                    value={data?.sku}
                                                                />
                                                            </Grid>
                                                            {data?.hsn ?
                                                                (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <Typography variant='body2'>HSN</Typography>
                                                                            <TextField size='small'
                                                                                value={data?.hsn}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <Typography variant='body2'>TAX</Typography>
                                                                            <TextField size='small'
                                                                                value={data?.applicabletax}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                )
                                                            }
                                                            <Grid item md={12} sx={{ display: 'none' }}>
                                                                <Typography variant='body2'>TAX VALUE</Typography>
                                                                <TextField size='small'
                                                                    value={data?.applicabletaxrate}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12} sx={{ display: 'none' }}>
                                                                <Typography variant='body2'>HSN VALUE</Typography>
                                                                <TextField size='small'
                                                                    value={data?.hsntax}
                                                                >
                                                                </TextField>
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid container>
                                                            <Grid item md={12}>
                                                                <Grid item md={12}>
                                                                    <TextField size='small'
                                                                        value={data?.lotnumber}
                                                                       
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                           
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Purchase Tax</InputLabel>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField
                                                                        labelId="demo-select-small"
                                                                        id="demo-select-small"
                                                                        value={data?.purchasetabletax}
                                                                        fullWidth
                                                                    >
                                                                    </TextField>
                                                                </FormControl>
                                                            </Grid>
                                                            {data?.purchasetabletax == "Inclusive" ? (
                                                                <Grid item md={12}>
                                                                    <InputLabel id="demo-select-small">Purchase Tax</InputLabel>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField
                                                                            labelId="demo-select-small"
                                                                            id="demo-select-small"
                                                                            value={data?.purchasetax}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                            ) : null}
                                                            <Grid item md={12}>
                                                                <Typography variant='body2'>Enter Amt</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField size='small'
                                                                        value={data?.enteramt}
                                                                       
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography variant='body2'>Margin %</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField size='small'
                                                                        value={data?.margin}
                                                                      
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Exc Tax</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    value={data?.purchaseexcludetax}
                                                                   
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Alphaarate</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    value={data?.excalpha}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Inc Tax</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    value={data?.pruchaseincludetax}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Alphaarate</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    value={data?.incalpha}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Quantity</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    value={data?.quantity}
                                                                  
                                                                />
                                                            </Grid>
                                                            <Grid item md={12} style={{ width: "auto !important" }} >
                                                                <InputLabel id="demo-select-small">Return Quantity</InputLabel>
                                                                <TextField size='small'
                                                                    value={data?.returnquantity}
                                                                   />
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Netcost</InputLabel>
                                                                <TextField size='small'
                                                                    value={data?.purchasenetcost}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Discount type</InputLabel>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField
                                                                        labelId="demo-select-small"
                                                                        id="demo-select-small"
                                                                        value={data?.distypemod}
                                                                     
                                                                    >
                                                                    </TextField>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <InputLabel id="demo-select-small">Disc.Val</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    value={data?.disvaluemod}
                                                                />
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <InputLabel id="demo-select-small">Disc.Amt</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    value={data?.differenceamt}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Netcost (After Discount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.ratebydismod}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid item md={12}>
                                                            <InputLabel id="demo-select-small">Selling Price Tax</InputLabel>
                                                            <FormControl size="small" fullWidth >
                                                                <TextField
                                                                    labelId="demo-select-small"
                                                                    id="demo-select-small"
                                                                    value={data?.sellingpricetax}
                                                                    fullWidth
                                                                >
                                                                </TextField>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Selling price unit tax</InputLabel>
                                                                <FormControl size="small" >
                                                                    <TextField size='small'
                                                                        type="text"
                                                                        value={data?.sellingpriceunitcost}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    </StyledTableRow>
                                            </>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer><br />
                    <Grid container spacing={2}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Total Item</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(allProductsList.length)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Total Quantity</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchaseReturn.totalitem}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Net Total Amount:</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                 
                                    value={purchaseReturn.nettotal}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box><br />
                {/* 2nd box */}
                <Box sx={userStyle.container}>
                    <Grid container>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Return Status</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchaseReturn.purchasestatus}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container></Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Link to="/purchase/purchasereturn/list"><Button sx={userStyle.buttoncancel}  >Go Back</Button></Link>
                            </Grid>
                    </Grid>
                </Box><br />
            </form>
        </Box>
    );
}

const Purchasereutrnview = () => {
    return (
        <>
            <Purchasereturneditlist /><br /><br />
                        <Footer />
        </>
    )
}

export default Purchasereutrnview;