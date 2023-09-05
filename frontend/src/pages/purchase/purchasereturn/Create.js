import React, { useEffect, useState, useContext } from 'react';
import { userStyle, colourStyles } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Select, MenuItem, Paper, TableCell, Dialog, DialogContent, DialogActions, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FaSearch } from "react-icons/fa";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { AiOutlineClose } from "react-icons/ai";
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import Selects from "react-select";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice'
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';

const Purchasereturncreatelist = () => {

    const [purchaseReturns, setPurchaseReturns] = useState();
    const [supplier, setSupplier] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [allBillsWithSupplier, setAllBillsWithSupplier] = useState([]);
    const [purchasesLocation, setPurchasesLocation] = useState({ businesslocation: "" });
    const [productsList, setProductsList] = useState([]);
    const [allTotalItems, setAlltotalItems] = useState([]);
    const [allProductsList, setAllProductsList] = useState([]);
    const totalItem = { quantity: 0, returnquantity: 0 };
    const [products, setProducts] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const [allPurchasereturn, setAllPurchasereturn] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState();

    //role access
    const { isUserRoleAccess, isActiveLocations, allProducts,allPurchases, setAllProducts } = useContext(UserRoleAccessContext);

    // purchase return date
    const [purchaseDateTime, setPurchaseDateTime] = useState(dayjs());
    const [locationData, setLocationData] = useState([])

    let balanceamt = 0;
    let purchaseStatusPending = "Pending";
    let purchaseStatusReceived = "Transfer";

    // produts list for add purchase data into db
    const productInputs = {
        produniqid: "", prodname: "", sku: "", hsn: "", hsntax: "", applicabletax: "", applicabletaxrate: "", purchasetabletax: "", purchasetax: "", sellingpricetax: "", enteramt: "", margin: "", purchaseexcludetax: "",
        pruchaseincludetax: "", excalpha: "", incalpha: "", quantity: "", returnquantity: "", purchasenetcost: "", distypemod: "None", disvaluemod: "", ratebydismod: "",
        differenceamt: "", sellingpriceunitcost: "", expirydate: "", batch: "", currentstock: "",
    }

    // purchase list og data only in add purchase
    const [purchaseReturn, setPurchaseReturn] = useState({
        supplier: "", referenceno: "", billamount: "", purchasedate: "", purchasestatus: "Pending", addressone: "", balance: 0,
        businesslocation: "", invoiceno: "", nettotal: 0.00, grandtotal: 0.00, totalitem: "", batch: "", packingcharge: "", expirydate: "",
    });

    // auto id for purchase number
    let newval = setngs ? setngs.purchasereturnsku == undefined ? "PR0001" : setngs.purchasereturnsku + "0001" : "PR0001";
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
                    ...productInputs, produniqid: e.produniqid, supplier: purchaseReturn.supplier, date: purchaseDateTime,
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

    // Purchase Return
    const fetchPurchaseReturn = async () => {
        try {
            let response = await axios.post(SERVICE.PURCHASE_RETURN, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });

            let locresult = response.data.purchasesrtn.map((data, index) => {
                return data.referenceno
            })
            setIsBusilocations(isActiveLocations);
            setLocationData(locresult);
            setPurchaseReturn(response?.data?.purchasesrtn);
            setPurchaseReturns(response?.data?.purchasesrtn);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Search Addressone
    const searchAdd = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.SUPPLIER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSupplier(res?.data?.ssupplier);
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Purchase 
    const fetchPurchaseInvoice = async (suppliername) => {
        try {

            let resultspplier = allPurchases?.filter((data) => {
                if (data.supplier == suppliername) {
                    return data
                }
            })
            setPurchasesLocation(resultspplier)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Suppliers
    const fetchSuppliers = async () => {
        try {
            let res = await axios.post(SERVICE.SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
            });
            setSuppliers(
                res.data.suppliers.length > 0 && res.data.suppliers.map((d) => ({
                    ...d,
                    label: d.suppliername,
                    value: d.suppliername,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    //fetching product names list in dropdown
    const fetchProdList = async (supinvoiceno) => {
        try {

            let prodDrp = allPurchases?.filter((data) => {
                if (supinvoiceno == data.invoiceno) {
                    setAllPurchasereturn(data)
                    let selectlocation = data.businesslocation == setngs.businesslocation;

                    setProductsList(
                        data?.products?.map((data) => ({
                            ...data,
                            label: data.prodname,
                            value: data.prodname
                        })))
                }
                return data
            })


        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const fetchPurchase = async () => {
        try {
          
            setPurchases(allPurchases)
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Get supplier invoice based on supplier name
    const getSupplierInvoice = (supname) => {
        let getcustomerallbill = purchases?.filter((item) => {

            if (supname == item.supplier) {
                return item
            }
        })
        setAllBillsWithSupplier(getcustomerallbill);
    }


    // get all product to update current stock
    const fetchProducts = async () => {
        try {

            setProducts(allProducts);
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
        fetchSuppliers();
    }, [])

    useEffect(() => {
        fetchPurchase()
        fetchPurchaseReturn();
        totalNetCostCalc();
        totalNetCostCalcgrand();
        fetchProducts();
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

    // purchase data add to database
    const addPurchase = async () => {

        // current stock reduce when the user submit
        allProductsList.map((item, index) => {
            products.forEach((data, i) => {
                if (item.sku == data.sku) {
                    if (purchaseReturn.purchasestatus == "Transfer") {
                        axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                            currentstock: Number(data.currentstock) - Number(item.returnquantity),
                        });
                    }
                }
            })
        })

        let allproductreverse = [...allProductsList.reverse()]
        try {

            let purchase = await axios.post(SERVICE.PURCHASE_RETURN_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                supplier: String(purchaseReturn.supplier),
                today:String(today),
                referenceno: String(newval),
                purchasedate: String(purchaseDateTime),
                purchasestatus: String(purchaseReturn.purchasestatus),
                addressone: String(supplier.addressone + ' ' + supplier.addresstwo + ' ' + supplier.phoneone + '/' + supplier.phonetwo + supplier.whatsapp),
                businesslocation: String(allPurchasereturn.businesslocation),
                billamount: Number(purchaseReturn.billamount),
                invoiceno: String(purchaseReturn.invoiceno),
                returnquantity: String(purchaseReturn.returnquantity),
                products: [...allproductreverse],
                returnproducts: [...productsList],
                totalcnt: Number(allProductsList.length),
                totalitem: Number(totalitem),
                nettotal: Number(totalNetCostCalc()),
                grandtotal: Number(allPurchasereturn.nettotal),
                paymentmethod: String(allPurchasereturn.paymentmethod),
                balance: Number(balanceamt),
                subcost: Number(totalNetCostCalcSub()),
                totaldiscount: Number(totalNetCostCalcDisc()),
                userbyadd: String(isUserRoleAccess.staffname),
                assignbusinessid: String(setngs.businessid),

            });


            setPurchaseReturn(purchase.data);
            backPage('/purchase/purchasereturn/list');
            toast.success(purchase.data.message, {
                position: toast.POSITION.TOP_CENTER
            });

            await fetchProducts();

        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    }

    // cancel button
    const handleBack = (e) => {
        backPage('/purchase/purchasereturn/list');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (locationData.includes(purchaseReturn.referenceno)) {
            setShowAlert("ID Already Exists");
            handleClickOpen();
        } else if (purchaseReturn.supplier == "") {
            setShowAlert("Please select Supplier");
            handleClickOpen();
        } else if (allProductsList.invoiceno == "") {
            setShowAlert("Please choose invoice no!")
            handleClickOpen();
        }
        else if (allProductsList.length == 0) {
            setShowAlert("Please select any one of product!")
            handleClickOpen();
        }
        else if (totalitem == 0 || totalitem == "" || totalitem == NaN) {
            setShowAlert("Please enter return quantity!!")
            handleClickOpen();
        }
        else {
            addPurchase();
        }
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


    function totalNetCostCalc() {
        let totalvalue = 0;
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalvalue += Number(value.ratebydismod)
            })
            return Number(totalvalue.toFixed(0));
        }
    }

    function totalNetCostCalcgrand() {
        let totalvalue1 = 0;
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalvalue1 = Number(value.purchasenetcost) * Number(value.quantity)
            })
            return Number(totalvalue1.toFixed(0));
        }
    }

    let balanceamtval = Number(purchaseReturn.billamount) ? Number(purchaseReturn.billamount) : 0;
    balanceamt = (balanceamtval ? balanceamtval : 0) - (Number(totalNetCostCalc()) ? Number(totalNetCostCalc()) : 0)

    // total quantity and free item calculation
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


    function payDueCalc() {
        setPurchaseReturn(
            { ...purchaseReturn, paydue: Number(totalNetCostCalc()) - Number(purchaseReturn.payamount) }
        )
    }

    useEffect(
        () => {
            payDueCalc();
        }, [purchaseReturn.payamount, purchaseReturn.nettotal]
    )

    // Delete Searched Product
    const deleteRow = (i, e) => {
        setAllProductsList(allProductsList.filter((v, item) => item !== i));
    }


    return (
        <Box>
            <Headtitle title={'Purchae Return Create'} />
            <form onSubmit={handleSubmit}>
                <Typography sx={userStyle.HeaderText}>Add Purchase Return</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Supplier <b style={{ color: "red", marginLeft: "2px" }}> *</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><PersonOutlineOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Selects
                                        onChange={(e) => {
                                            setPurchaseReturn({ ...purchaseReturn, supplier: e.value, referenceno: newval });
                                            setPurchasesLocation({ ...purchasesLocation, businesslocation: purchasesLocation.businesslocation });
                                            getSupplierInvoice(e.value);
                                            fetchPurchaseInvoice(e.value);
                                            searchAdd(e._id);
                                        }}
                                        styles={colourStyles}
                                        options={suppliers}
                                        placeholder="SELECT"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {purchaseReturns && (
                                purchaseReturns.map(
                                    () => {
                                        let strings = setngs ? setngs.purchasereturnsku : "PR";
                                        let refNo = purchaseReturns[purchaseReturns.length - 1].referenceno;
                                        let digits = (purchaseReturns.length + 1).toString();
                                        const stringLength = refNo.length;
                                        let lastChar = refNo.charAt(stringLength - 1);
                                        let getlastBeforeChar = refNo.charAt(stringLength - 2);
                                        let getlastThreeChar = refNo.charAt(stringLength - 3);
                                        let lastBeforeChar = refNo.slice(-2);
                                        let lastThreeChar = refNo.slice(-3);
                                        let lastDigit = refNo.slice(-4);
                                        let refNOINC = parseInt(lastChar) + 1
                                        let refLstTwo = parseInt(lastBeforeChar) + 1;
                                        let refLstThree = parseInt(lastThreeChar) + 1;
                                        let refLstDigit = parseInt(lastDigit) + 1;
                                        if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                                            refNOINC = ("000" + refNOINC);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                            refNOINC = ("00" + refLstTwo);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastThreeChar > 0) {
                                            refNOINC = ("0" + refLstThree);
                                            newval = strings + refNOINC;
                                        } else {
                                            refNOINC = (refLstDigit);
                                            newval = strings + refNOINC;
                                        }
                                    }))}
                            <InputLabel id="demo-select-small">Reference No</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={newval}
                                    name="referenceno"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Return Date</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
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
                                {supplier.addressone}<br />
                                {supplier.addresstwo}<br />
                                {supplier.phoneone}
                                {supplier.whatsapp ? 'Whatsapp: ' + supplier.whatsapp : null}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={isBusilocations?.map((data, index) => data.locationid.includes(allPurchasereturn ? allPurchasereturn.businesslocation : "") ? data.name : "")}
                                    name="buisnessLocation"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Invoice No<b style={{ color: "red", marginLeft: "2px" }}> *</b></InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchaseReturn.invoiceno}
                                    onChange={e => {
                                        setPurchaseReturn({ ...purchaseReturn, invoiceno: e.target.value, });
                                    }}
                                >
                                    {allBillsWithSupplier && (
                                        allBillsWithSupplier.map((row, index) => (
                                            <MenuItem value={row.invoiceno} key={index} onClick={(e) => { fetchProdList(row.invoiceno) }} >{row.invoiceno}</MenuItem>
                                        )))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                </Box><br />
                <Box sx={userStyle.container} style={{ minHeight: '300px', }}>
                    <Grid container style={{ justifyContent: "center", padding: '10px' }} sx={userStyle.textInput} >
                        <Grid md={8} sm={12} xs={12}>
                            <Grid sx={{ display: 'flex' }} >
                                <Grid sx={userStyle.spanIconTax}>< FaSearch /></Grid>
                                <FormControl size="small" fullWidth >
                                    <Selects
                                        styles={colourStyles}
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
                    <br />
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
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <TextField size='small'
                                                                    id="batch"
                                                                    value={data?.lotnumber}

                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                            </Grid>
                                                            <Grid item md={12} sx={{ visibility: 'hidden' }}>
                                                                <input type="text"
                                                                    value={data?.supplier}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12} sx={{ visibility: 'hidden' }}>
                                                                <input type="text"
                                                                    value={data?.date}
                                                                />
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
                                                                    type="number"
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        },
                                                                        '& input[type=number]': {
                                                                            '-moz-appearance': 'textfield' //#8b5cf6
                                                                        },
                                                                        '& input[type=number]::-webkit-outer-spin-button': {
                                                                            '-webkit-appearance': 'none',
                                                                            margin: 0
                                                                        },
                                                                        '& input[type=number]::-webkit-inner-spin-button': {
                                                                            '-webkit-appearance': 'none',
                                                                            margin: 0
                                                                        }
                                                                    }}
                                                                    value={data?.quantity}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12} style={{ width: "auto !important" }} >
                                                                <InputLabel id="demo-select-small">Return Quantity<b style={{ color: "red", marginLeft: "2px" }}> *</b></InputLabel>
                                                                <TextField size='small'
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        },
                                                                        '& input[type=number]': {
                                                                            '-moz-appearance': 'textfield' //#8b5cf6
                                                                        },
                                                                        '& input[type=number]::-webkit-outer-spin-button': {
                                                                            '-webkit-appearance': 'none',
                                                                            margin: 0
                                                                        },
                                                                        '& input[type=number]::-webkit-inner-spin-button': {
                                                                            '-webkit-appearance': 'none',
                                                                            margin: 0
                                                                        }
                                                                    }}
                                                                    type="number"
                                                                    style={userStyle.input}
                                                                    value={data?.returnquantity}
                                                                    onChange={(e) => {
                                                                        returnCheck(e.target.value);
                                                                        productUserInput(i, "returnquantity", e.target.value, "Return")
                                                                        setPurchaseReturn({ ...purchaseReturn, nettotal: Number(totalNetCostCalc()) })
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
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
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
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.disvaluemod}
                                                                />
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <InputLabel id="demo-select-small">Disc.Amt</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
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
                                                                <OutlinedInput
                                                                    labelId="demo-select-small"
                                                                    id="demo-select-small"
                                                                    value={data?.sellingpricetax}

                                                                    fullWidth
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12}>
                                                                <InputLabel id="demo-select-small">Selling price unit tax</InputLabel>
                                                                <FormControl size="small" >
                                                                    <TextField size='small'
                                                                        type="text"
                                                                        sx={{
                                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            }
                                                                        }}
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
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Net Total Amount:</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={Number(totalNetCostCalc()) ? Number(totalNetCostCalc()) : 0}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>

                </Box><br />
                {/* purchasestatus section start */}
                <Box sx={userStyle.container}>
                    <Grid container>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Return Status</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    placeholder='Pending'
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
                        <Button sx={userStyle.buttonadd} type="submit">SAVE</Button>
                    </Grid><br />
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

const Purchasereturncreate = () => {
    return (
        <>
            <Purchasereturncreatelist /><br /><br />
                        <Footer />
        </>
    )
}

export default Purchasereturncreate;