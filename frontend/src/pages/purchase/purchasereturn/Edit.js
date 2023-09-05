import React, { useEffect, useState, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Select, MenuItem, Paper, TableCell, Dialog, DialogContent, DialogActions, TextareaAutosize, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FaSearch } from "react-icons/fa";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { AiOutlineClose } from "react-icons/ai";
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Selects from "react-select";
import { SERVICE } from '../../../services/Baseservice';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

const Purchasereturneditlist = () => {

    const [productsList, setProductsList] = useState([]);
    const [products, setProducts] = useState([]);
    const [allProductsList, setAllProductsList] = useState([]);
    const [allTotalItems, setAlltotalItems] = useState([]);
    const totalItem = { quantity: 0, returnquantity: 0 };
    const { auth, setngs } = useContext(AuthContext);
    //role access
    const {isUserRoleAccess,allProducts, setAllProducts} = useContext(UserRoleAccessContext);
        // purchase return date
        const [purchaseDateTime, setPurchaseDateTime] = useState(dayjs());

    let purchaseStatusPending = "Pending";
    let purchaseStatusReceived = "Transfer";

    // produts list for add purchase data into db
    const productInputs = {
        prodname: "", sku: "", hsn: "", hsntax: "", applicabletax: "", applicabletaxrate: "", purchasetabletax: "", purchasetax: "", sellingpricetax: "", enteramt: "", margin: "", purchaseexcludetax: "",
        pruchaseincludetax: "", excalpha: "", incalpha: "", quantity: "", returnquantity: "", purchasenetcost: "", distypemod: "None", disvaluemod: "", ratebydismod: "",
        differenceamt: "", sellingpriceunitcost: "", expirydate: "", batch: "", currentstock: "",
    }

    // purchase list og data only in add purchase
    const [purchaseReturn, setPurchaseReturn] = useState({purchasestatus: ""});

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const id = useParams().id;

    const fetchHandlers = async () => {
        try {
            let req = await axios.get(`${SERVICE.PURCHASE_RETURN_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setPurchaseReturn(req?.data?.spurchsertn)
            setAllProductsList(req?.data?.spurchsertn?.products);
            
            setProductsList(
                req.data.spurchsertn.returnproducts.length > 0 && req.data.spurchsertn.returnproducts.map((data) => ({
                    ...data,
                    label: data.prodname,
                    value: data.prodname
                })))
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

    // add hsn to the product list data
    const gethsncode = async (e) => {

        let isAlreadyAdded = false;
        let addedproductId = allProductsList.map((item) => {
            if (e.sku == item.sku) {
                isAlreadyAdded = true
                setShowAlert("This product already added!")
                handleClickOpen();
                return { ...item }
            } else {
                return item
            }
        })
        if (isAlreadyAdded) {
            setAllProductsList(addedproductId)
        } else {
            setAllProductsList((productslistdata) => {
                return [{
                    ...productInputs, supplier: purchaseReturn.supplier, date: purchaseDateTime,
                    applicabletax: e.applicabletax, applicabletaxrate: e.applicabletaxrate, hsntax: e.hsntax,
                    prodname: e.prodname, sku: e.sku, hsn: e.hsn, sellingpricetax: e.sellingpricetax, packingcharge: e.packingcharge,
                    enteramt: e.enteramt, margin: e.margin, purchaseexcludetax: e.purchaseexcludetax,
                    pruchaseincludetax: e.pruchaseincludetax, quantity: e.quantity,
                    sellingpricetax: e.sellingpricetax, purchasetabletax: e.purchasetabletax,
                    excalpha: e.excalpha, incalpha: e.incalpha, purchasenetcost: e.purchasenetcost,
                    distypemod: e.distypemod, disvaluemod: e.disvaluemod, sellingpriceunitcost: e.sellingpriceunitcost,
                    differenceamt: e.differenceamt, batch: e.batch, ratebydismod: e.ratebydismod, expirydate: e.expirydate,
                    businesslocation: e.businesslocation, nettotal: e.nettotal, grandtotal: e.nettotal,
                }, ...productslistdata]
            });
        }
    }

    // get all product to update current stock
    const fetchAllProduct = async () => {
        try {
           
            setProducts(allProducts);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }


    useEffect(() => {
        fetchAllProduct();
    }, []);

    const backPage = useNavigate();

    // Quantity popup
    const returnCheck = (value) => {
        allProductsList.map((data) => {
            if (Number(value) > Number(data.quantity)) {
                setShowAlert("Please Enter Value Less Than Quantity")
                handleClickOpen();
            }
        })
    }

    // Transfer popup
    const checkTransfer = (value) => {
        if (value == "Transfer") {
            if (allProductsList.length == 0) {
                setPurchaseReturn({ ...purchaseReturn, purchasestatus: "Pending" });
                purchaseStatusReceived = "Pending";
                setShowAlert("Please select any one of product details!")
                handleClickOpen();
            } else if (totalitem == 0 || totalitem == "" || totalitem == NaN) {
                setPurchaseReturn({ ...purchaseReturn, purchasestatus: "Pending" });
                purchaseStatusReceived = "Pending";
                setShowAlert("Please Enter Return Quantity")
                handleClickOpen();
            } else {
                setPurchaseReturn({
                    ...purchaseReturn, purchasestatus: "Transfer"
                });
            }
        }
    }

    const fetchProduct = async () => {
        try {
          let res = await axios.post(SERVICE.PRODUCT, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            businessid:String(setngs.businessid),
            role:String(isUserRoleAccess.role),
            userassignedlocation:[isUserRoleAccess.businesslocation]
          });
          setAllProducts(res?.data?.products)
    
        } catch (err) {
          const messages = err?.response?.data?.message;
          if(messages) {
              toast.error(messages);
          }else{
              toast.error("Something went wrong!")
          }
        }
      }

    const updatePurchase = async () => {

        if (purchaseReturn.purchasestatus == "Transfer") {
            allProductsList.map((item, index) => {
                products.forEach((data, i) => {
                    if ((item.sku == data.sku)) {
                        axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                            currentstock: Number(data.currentstock) - Number(item.returnquantity),
                        });
                    }
                })
            })
        }

        try {
            let req = await axios.put(`${SERVICE.PURCHASE_RETURN_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                supplier: String(purchaseReturn.supplier),
                today:String(today),
                referenceno: String(purchaseReturn.referenceno),
                purchasedate: String(purchaseDateTime),
                purchasestatus: String(purchaseReturn.purchasestatus),
                addressone: String(purchaseReturn.addressone),
                businesslocation: String(purchaseReturn.businesslocation),
                billamount: Number(purchaseReturn.billamount),
                invoiceno: String(purchaseReturn.invoiceno),
                returnquantity: String(purchaseReturn.returnquantity),
                products: [...allProductsList],
                returnproducts:[...productsList],
                totalcnt: Number(allProductsList.length),
                totalitem: Number(totalItenQuantityValue()),
                nettotal: Number(totalNetValue()),
                grandtotal: Number(purchaseReturn.grandtotal),
                paymentmethod: String(purchaseReturn.paymentmethod),
                balance: Number(balanceamt),
                subcost: Number(totalNetCostCalcSub()),
                totaldiscount: Number(totalNetCostCalcDisc()),
                userbyadd:String(isUserRoleAccess.staffname),
            });
            setPurchaseReturn(req.data);
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/purchase/purchasereturn/list');
            await fetchProduct();
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                setShowAlert(messages);
                handleClickOpen();
            }else{
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    }

    // cancel button
    const handleBack = (e) => {
        backPage('/purchase/purchasereturn/list');
    }

    // Delete Searched Product
    const deleteRow = (i, e) => {
        setAllProductsList(allProductsList.filter((v, item) => item !== i));
    }

    // all tabel product tax calculation
    function productUserInput(indexInput, productInputName, inputValue, reference = "") {
        let userInputs = allProductsList.map((value, indexList) => {

            if (indexInput == indexList) {
                if (reference == "Return") {

                    if (value.purchasetabletax == "Exclusive" && value.purchaseexcludetax) {
                        let netCost = (Number(value.quantity) >= Number(inputValue)) ? Number(value.purchaseexcludetax) * (Number(value.quantity) - Number(inputValue)) : Number(value.purchaseexcludetax) * Number(value.quantity)
                        setAlltotalItems((alltotalitems) => {
                            let allItems = [...alltotalitems];
                            allItems[indexInput] = { ...totalItem, quantity: inputValue };
                            return allItems;
                        });
                        return { ...value, [productInputName]: inputValue, purchasenetcost: netCost.toFixed(0), ratebydismod: netCost.toFixed(0) };
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        let netCost = (Number(value.quantity) >= Number(inputValue)) ? Number(value.purchaseexcludetax) * (Number(value.quantity) - Number(inputValue)) : Number(value.purchaseexcludetax) * Number(value.quantity)
                        setAlltotalItems((alltotalitems) => {
                            let allItems = [...alltotalitems];
                            allItems[indexInput] = { ...totalItem, quantity: inputValue };
                            return allItems;

                        })
                        return { ...value, [productInputName]: inputValue, purchasenetcost: netCost.toFixed(0), ratebydismod: netCost.toFixed(0) };
                    }
                }
                return { ...value, [productInputName]: inputValue }
            }
            else {
                return value;
            }
        });
        setAllProductsList(userInputs);
    }

    // total quantity calculation
    // total quantity and returnquantity item calculation
    let totalitem = 0.00;
    {
        allProductsList && (
            allProductsList.forEach(
                (item => {
                    totalitem += +item.returnquantity
                })
            ))
    }

    // Discount Amount
    function totalNetCostCalcDisc() {
        let totalvalue = 0;
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalvalue += +Number(value.differenceamt)
            })
            return totalvalue.toFixed(0);
        }
    }

    //subtotal
    function totalNetCostCalcSub() {
        let totalvalue = 0;
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalvalue += +Number(value.purchasenetcost)
            })
            return totalvalue.toFixed(0);
        }
    }

    // nettotal calculation and include previous value
    let totalvalue = Number(0);
    function totalNetCostCalc() {
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalvalue += Number(value.ratebydismod)
            })
            return totalvalue.toFixed(0);
        }
    }

    let totalvalueCost = (Number(totalNetCostCalc()));
    let totalvalueItem = (Number(totalitem));
    const totalNetValue = () => {
        return totalvalue == Number(purchaseReturn.nettotal) ? Number(purchaseReturn.nettotal) : totalvalueCost
    }
    const totalItenQuantityValue = () => {
        return totalitem == Number(purchaseReturn.totalitem) ? Number(purchaseReturn.totalitem) : totalvalueItem;
    }

    let balanceamt = purchaseReturn.balance;

    useEffect(
        () => {

            totalNetCostCalc();

        }, [allProductsList, purchaseReturn]
    )
    balanceamt = (purchaseReturn.billamount - Number(totalNetValue()))

    const handleSubmit = (e) => {
        e.preventDefault();
        if (purchaseReturn.supplier == "") {
            setShowAlert("Please select Supplier");
            handleClickOpen();
        } else if (allProductsList.length == 0) {
            setShowAlert("Please select any one of product!")
            handleClickOpen();
        }
        else if (allProductsList.invoiceno == "") {
            setShowAlert("Please choose invoice no!")
            handleClickOpen();
        }
        else if ((allProductsList.map((data) => {
            if (data.returnquantity == "") {
                setShowAlert("Return Quantity Required!")
                handleClickOpen();
            }
            else if (data.returnquantity > data.quantity) {
                setShowAlert("Return Quantity Must be less than quantiy!")
                handleClickOpen();

            }
            else {
                updatePurchase();
            }
        }))) {
        }
        else {
            updatePurchase();
        }
    }

    return (
        <Box>
            <Headtitle title={'Purchase Return Edit'} />
            <form onSubmit={handleSubmit}>
                <Typography sx={userStyle.HeaderText}>Edit Purchase Return</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Supplier <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
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
                            <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                                    <DateTimePicker
                                        renderInput={(props) => <TextField size="small" {...props} />}
                                        value={purchaseDateTime}
                                        onChange={(newValue) => {
                                            setPurchaseDateTime(newValue);
                                        }}
                                    />
                                </LocalizationProvider>
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
                                    value={purchaseReturn.businesslocation}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Invoice No<b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
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
                    <Grid container style={{ justifyContent: "center", padding: '10px' }} sx={userStyle.textInput} >
                        <Grid md={8} sx={12} xs={12}>
                            <Grid sx={{ display: 'flex' }} >
                                <Grid sx={userStyle.spanIconTax}>< FaSearch /></Grid>
                                <FormControl size="small" fullWidth >
                                    <Selects
                                        sx={userStyle.textInput}
                                        placeholder="Enter Product Name / SKU "
                                        options={productsList}
                                        onChange={(e) => {
                                            gethsncode(e)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
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
                                    <TableCell sx={userStyle.tableHead1}>
                                        <AiOutlineClose style={{ color: 'black', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} />
                                    </TableCell>
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
                                                                    sx={userStyle.input}
                                                                    type="number"
                                                                    value={data?.quantity}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12} style={{ width: "auto !important" }} >
                                                                <InputLabel id="demo-select-small">Return Quantity <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                                                                <TextField size='small'
                                                                    sx={userStyle.input}
                                                                    type="number"
                                                                    value={data?.returnquantity}
                                                                    onChange={(e) => {
                                                                        returnCheck(e.target.value);
                                                                        productUserInput(i, "returnquantity", e.target.value, "Return")
                                                                    }}
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
                                                    <StyledTableCell><AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(i, e)} /></StyledTableCell>
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
                                    onChange={(e) => { setPurchaseReturn({ ...purchaseReturn, totalcnt: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Total Quantity</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={totalitem}
                                    onChange={(e) => { setPurchaseReturn({ ...purchaseReturn, totalitem: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Net Total Amount:</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    // 
                                    value={totalvalue}
                                    onChange={(e) => { setPurchaseReturn({ ...purchaseReturn, nettotal: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box><br />
                {/* 2nd box */}
                <Box sx={userStyle.container}>
                    <Grid container>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Status</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    // placeholder={purchaseReturn.purchasestatus}
                                    value={purchaseReturn.purchasestatus}
                                    onChange={(e) => {
                                        setPurchaseReturn({ ...purchaseReturn, purchasestatus: e.target.value });
                                        checkTransfer(e.target.value)
                                    }}
                                >
                                    <MenuItem value={purchaseStatusPending}>{purchaseStatusPending}</MenuItem>
                                    <MenuItem value={purchaseStatusReceived}>{purchaseStatusReceived}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Button sx={userStyle.buttoncancel} onClick={handleBack} >CANCEL</Button>
                        <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button><br />
                    </Grid>
                </Box>
            </form>
            {/* Alert Modal */}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

const Purchasereturnedit = () => {
    return (
        <>
             <Purchasereturneditlist /><br /><br />
                        <Footer />
        </>
    )
}

export default Purchasereturnedit;