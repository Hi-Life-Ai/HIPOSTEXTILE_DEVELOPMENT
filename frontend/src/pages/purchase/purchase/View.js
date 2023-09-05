import React, { useEffect, useState, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Paper, TableCell, TextareaAutosize, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import moment from 'moment';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const Purchaseviewlist = () => {
    const { auth, setngs } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext)
    const [purchase, setPurchase] = useState({ supplier: "", referenceno: "",freightamount:"0.00",totalamount:"0.00",expenseamount:"0.00", billamount: "0.00",suppliershrtname:"", purchasedate: "", purchasetaxmode: "None", purchasetaxlabmode: "None", purchasestatus: "Pending", discounttypemode:"None", discountvaluemode:'0.00', discountamountmode:'0.00', addressone: "", balance: 0,
    totaltaxamount:"",businesslocation: "", invoiceno: "", nettotal: 0.0, totalitem: 0,
    purchasetax: "", additionalnotes: [], paydue: 0, payamount: 0.0, advancebalance: "", paidon: "", paymentmethod: "None"});
    const [purchaseProduct, setPurchaseProduct] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});

    //  File Upload
    const [files, setFiles] = useState([]);

    const id = useParams().id;

    const fetchHandlers = async () => {
        try {
            let req = await axios.get(`${SERVICE.PURCHASE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == setngs.businesslocation
            })

            setIsBusilocations(selectlocation[0]);
            setPurchase(req?.data?.spurchse)
            setPurchaseProduct(req?.data?.spurchse?.products);
            setFiles(req?.data?.spurchse?.files);
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
        fetchHandlers()
    }, [id]);

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    return (
        <Box>
            <Headtitle title={'View Purchase'} />
            <form>
                <Typography sx={userStyle.HeaderText}>View Purchase</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Supplier</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.supplier}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Reference No:</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.referenceno}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Date</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={moment(purchase.purchasedate).format('DD-MM-YYYY')}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Invoice No:</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.invoiceno}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={isBusilocations ? isBusilocations.name : ""}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Status</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.purchasestatus}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Bill Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.billamount)?.toFixed(2)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.purchasetaxmode}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Tax Slab</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.purchasetaxlabmode}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Disc. Type</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.discounttypemode}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Disc Value</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.discountvaluemode)?.toFixed(2)}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Disc. Amt</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.discountamountmode)?.toFixed(2)}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Balance Amount</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.balance)?.toFixed(2)}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Tax Amount</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.totaltaxamount)?.toFixed(2)}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Frieght Amount</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.freightamount)?.toFixed(2)}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Expense Amount</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.expenseamount)?.toFixed(2)}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Total Amount</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(purchase.totalamount)?.toFixed(2)}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography variant='subtitle1'>
                                <b>Address:</b> <br />
                                {purchase.addressone}
                            </Typography>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: '10px' }}>
                        <InputLabel id="demo-select-small">Documents</InputLabel>
                            <br/>
                            {files?.length > 0 &&
                                (files.map((file, index) => (
                                    <>
                                        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                                <Typography>{file?.name}</Typography>

                                            </Grid>
                                            {/* <br /> */}
                                            <Grid item lg={4} md={4} sm={4} xs={4}>
                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                            </Grid>
                                        </Grid>
                                    </>
                                )))}
                        </Grid>
                        {/* <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Documents</InputLabel>
                            {files?.length > 0 &&
                                (files.map((file, index) => (
                                    <>
                                        <Button variant='contained' onClick={() => renderFilePreview(file)} style={{ textTranform: 'capitalize' }}><SearchIcon />Preview</Button>

                                        <Grid sx={{ display: 'flex', justifyContent: "center", padding: '10px' }}>

                                            {/* <Typography><a style={{ color: "#357ae8" }}
                                                href={`data:application/octet-stream;base64,${file.data}`}
                                                download={file.name}
                                            >
                                                {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                    ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                        ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                            ((file.name).split(".")[1] === "docx" || "txt" || "doc") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                <img src={`data:application/octet-stream;base64,${file.data}`} alt="edit" style={{ width: '80px', height: '80px' }} />}
                                            </a></Typography> <br></br> */}
                                            {/* <Typography>{file.name}</Typography>
                                        </Grid>
                                    </>
                                )))}
                        </Grid>  */}
                    </Grid>
                </Box><br />
                <Box sx={userStyle.container} style={{ minHeight: '300px', }}>
                    <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                        <Table aria-label="customized table">
                            <TableHead >
                                <StyledTableRow>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Tax</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Rate/Quantity</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Discount Unit Cost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Unit Tax</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Rate</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Cost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>SalePrice Cost(Unit)</TableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseProduct.length > 0 &&
                                    purchaseProduct.map((data, i) => {
                                        return (
                                            <>
                                                <StyledTableRow key={i} >
                                                    <TableCell colSpan={4} sx={{ padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12} sx={{ marginTop: '-58px' }}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                                                <FormControl fullWidth>
                                                                    <TextField size='small' value={data?.prodname} />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={2.5}>
                                                                <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                                <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Lot Number</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField value={data?.lotnumber} />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField value={data?.purchasetabletax} />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField value={data?.purchasetax} />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item md={4}>
                                                                <Grid container spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <Grid container>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Enter Rate</Typography>
                                                                            <FormControl size="small" fullWidth>
                                                                                <TextField value={data?.enteramt} />
                                                                            </FormControl>
                                                                        </Grid>
                                                                            <Grid item md={4}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small' value={data?.quantity} />
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={8}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small' value={data?.quantityunit} />
                                                                                </FormControl>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Pcs.</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField value={data?.quantitytotalpieces} />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Grid container>
                                                                            <Grid item md={4}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Free</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small'
                                                                                        style={{
                                                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                                width: '150px !important'
                                                                                            }
                                                                                        }}
                                                                                        value={data?.freeitem}
                                                                                    />
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={8}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField value={data?.freeitemunit} />
                                                                                </FormControl>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item md={3.5}>
                                                                <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Discount type</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField value={data?.distypemod} />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Grid container>
                                                                            <Grid item md={6} >
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Val</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField value={data?.disvaluemod} />
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={6}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Amt</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField value={data?.differenceamt} />
                                                                                </FormControl>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost (After Discount)</Typography>
                                                                        <OutlinedInput value={data?.netcostafterdiscount} />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item md={2}>
                                                                <Grid container spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Exc Tax</Typography>
                                                                        <OutlinedInput size='small'
                                                                            value={data?.purchaseexcludetax}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                        <OutlinedInput size='small'
                                                                            value={data?.excalpha}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Inc Tax</Typography>
                                                                        <OutlinedInput size='small'
                                                                            value={data?.pruchaseincludetax}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                        <OutlinedInput size='small'
                                                                            value={data?.incalpha}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>SKU</Typography>
                                                                <OutlinedInput size='small'
                                                                    value={data?.sku}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(Before Discount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostbeforediscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br /> (Before Discount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostbeforediscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(After Discount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostafterdiscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(After Discount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostafterdiscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            {data?.hsn ?
                                                                (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                value={data?.hsn}
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        width: '80px'
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                value={data?.applicabletax}
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        width: '80px'
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                )
                                                            }

                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit  <br /> (Tax Amount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcosttaxamount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Tax <br />(Tax Amount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcosttaxamount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br /> (With Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostwithtax}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(With Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostwithtax}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12} sx={{ marginTop: '-38px' }}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Margin%</Typography>
                                                                <OutlinedInput size='small'
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px !important'
                                                                        },
                                                                        '& input[type=number]': {
                                                                            'MozAppearance': 'textfield' //#8b5cf6
                                                                        },
                                                                        '& input[type=number]::-webkit-outer-spin-button': {
                                                                            'WebkitAppearance': 'none',
                                                                            margin: 0
                                                                        },
                                                                        '& input[type=number]::-webkit-inner-spin-button': {
                                                                            'WebkitAppearance': 'none',
                                                                            margin: 0
                                                                        }
                                                                    }}
                                                                    value={data?.margin}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(Without Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpriceunitwithoutcost}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Type</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpricetax}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Amount</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.saletaxamount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                           
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(With Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpriceunitcost}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                </StyledTableRow>
                                            </>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer><br />
                    <Grid container>
                        <Grid item xs={6} sm={6} md={8} lg={8}>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={4}>
                            <Typography variant="subtitle1"
                            ><b>Total items:{purchase.totalitem}</b></Typography>
                            <Typography variant="subtitle1"
                            ><b> Net Total Amount:</b> ₹ {Number(purchase.nettotal)?.toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
                </Box><br />
                {/* 2nd box */}
                <Box sx={userStyle.container}>
                    {purchase.purchasestatus == "Received" ?
                        (
                            <>
                                <br />
                                <Typography variant="h6" >Add payment</Typography>
                                <Grid container spacing={3} sx={userStyle.textInput}>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel htmlFor="component-outlined">Amount</InputLabel>
                                        <Grid sx={{ display: 'flex' }}  >
                                            <Grid sx={userStyle.spanIconTax}><MoneyOutlinedIcon style={{ fontSize: 'large' }} /></Grid>
                                            <FormControl size="small" fullWidth >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={Number(purchase.payamount)?.toFixed(2)}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Paid Date</InputLabel>
                                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                            <OutlinedInput
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={moment(purchase.paidon).utc().format('DD-MM-YYYY')}
                                                fullWidth
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Payment Method</InputLabel>
                                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                            <OutlinedInput
                                                size="small"
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={purchase.paymentmethod}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <InputLabel id="demo-select-small" sx={{ m: 1 }}>Payment Note</InputLabel>
                                        <FormControl size="small" fullWidth >
                                            <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                                value={purchase.additionalnotes}
                                            />
                                        </FormControl><br /><br />
                                        <hr />
                                    </Grid>
                                    <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                                        <Grid>
                                            <Typography variant='subtitle1'
                                            ><b>Payment due:</b> ₹{Number(purchase.paydue)?.toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        ) : null
                    }
                    
                    <Grid container sx={userStyle.gridcontainer}  style={{display:'flex' , justifyContent:"center"}}>
                        <Link to="/purchase/purchase/list"><Button sx={userStyle.buttoncancel} type="button">BACK</Button></Link><br />
                    </Grid>
                </Box>
            </form>
        </Box>

    );
}

const Purchaseview = () => {
    return (
        <>
           <Purchaseviewlist /><br /><br />
                        <Footer />
        </>
    )
}

export default Purchaseview;