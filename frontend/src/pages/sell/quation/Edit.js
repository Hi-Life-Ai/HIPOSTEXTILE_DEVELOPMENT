import React, { useState, useEffect, useRef, useContext, createRef } from "react";
import { userStyle } from "../../PageStyle";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, FormControl, InputLabel, Paper, OutlinedInput, Select, MenuItem, TextField, TableCell, Typography, Drawer, Button, Table, Tooltip, IconButton, TableContainer, TableHead, TableRow, TableBody, DialogActions, DialogTitle, DialogContent, Dialog, Card } from "@mui/material";
import { FaClock, FaMoneyBillAlt, FaRegWindowClose, } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { FcInfo } from "react-icons/fc";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Mainlogo from "../../../assets/images/mainlogo.png";
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from 'prop-types';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { useParams } from 'react-router-dom';
import Headtitle from '../../../components/header/Headtitle';
import noimage from "../../../assets/images/dashboardbg/no-image.png";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

const drawerWidth = 250;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: "flex-start"
    },
    closeicon: {
        textAlign: "left"
    },
}));

// Tabpanel
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


const Quotationedit = () => {

    const { isUserRoleAccess, allProducts,allPos } = useContext(UserRoleAccessContext);
    const { auth,setngs } = useContext(AuthContext);

    const classes = useStyles();

    // pos inside products array data
    const productInputs = {
        businesslocation:"",productid: "", productname: "", quantity: "", sellingpricetax: "", taxtareval: "", subtotal: "", sellingexcludevalue: "", sellingincludevalue: "", applicabletax: "", discountamt: "0",
    }

    // pos db store data 
    const [posAdd, setPosAdd] = useState({
        businesslocation:"",referenceno: "", customer: "Walk-in-customer", date: "", counter: "", location: "", contactnumber: "", contactid: "", creditlimit: "",
        ledgerbalance: "", totalitems: "", totalproducts: 0, grandtotal: 0, shippingtax: "", granddistype: "None", gdiscountvalue: 0, gdiscountamtvalue: 0, aftergranddisctotal: 0,
        totalbillamt: "", ordertax: "", packcharge: "", roundof: "", amountgain: 0, balance: 0, userbyadd: ""

    });

    const [productsList, setProductsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [products, setProducts] = useState([]);
    const [gotDiscount, setgotDiscount] = useState("");
    const [taxrates, setTaxrates] = useState();
    const [pos, setPos] = useState({});
    const [singleprod, setSingleprod] = useState({});
    const [mergeprod, setMergeprod] = useState();
    const [discounts, setDiscounts] = useState("");
    const [allStocks, setAllStocks] = useState([]);
    const [quotations, setQuotations] = useState();

    // Amount gain alter Alert
    const [isAmountgain, setisAmountgain] = useState("")

    // purchase date
    const [purchaseDateTime, setPurchaseDateTime] = useState(dayjs());

    //collapse Navbar drawer open for category
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [category, setCategory] = useState([])
    const [subcategory, setSubCategory] = useState([])
    const [comparecate, setComparecate] = useState()
    const [comparesub, setComparesub] = useState()
    const [comparebrand, setComparebrand] = useState()
    const [businesslocation, setBusinesslocation] = useState([]);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const alertOpen = () => { setIsErrorOpen(true); };
    const alertClose = () => { setIsErrorOpen(false); };

    const id = useParams().id;

    const handleDrawerOpen = () => {
        setOpen1(true);
    };

    const handleDrawerClose = () => {
        setOpen1(false);
    };

    const handleDrawerOpen1 = () => {
        setOpen2(true);
    };

    const handleDrawerClose1 = () => {
        setOpen2(false);
    };

    const handleDrawerOpen2 = () => {
        setOpen3(true);
    };
    const handleDrawerClose2 = () => {
        setOpen3(false);
    };

    //card
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClickClose = () => { setIsDeleteOpen(false); };

    // paynow
    const [isPay, setIsPay] = useState(false);
    const handleClickOpenpay = () => { setIsPay(true); };
    const handleClosepay = () => { setIsPay(false); };

    // Add Expense
    const backLPage = useNavigate();

    let total = 0;
    let qty = 1;

    // Product Onchange to get particular productid
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setSingleprod(res.data.sproduct)
            fetchtable(res.data.sproduct)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    // fetch all products for category/brand/sub category onclick with particular data
    const fetchProd = async (e) => {
        try {
            
            setMergeprod(allProducts);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const taxrateRequest = async () => {
        try {
            let response = await axios.get(SERVICE.TAXRATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let taxRateData = response.data.taxrates.filter((data) => {
                if(data.assignbusinessid == setngs.businessid){
                return (data.taxtype == "taxrate" || 'taxrategroup') && data.fortaxgonly == false
                }
            })

            setTaxrates(taxRateData);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    //fetch QUOTATION id
    const fetchQuotid = async () => {
        try {
            let req = await axios.get(`${SERVICE.QUOTATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setPosAdd(req.data.squotation)
            setTableData(req.data.squotation.goods);
        } catch (err) {
            const messages = err?.response?.data?.message;
            console.log(messages);
        }
    };

    //fetch poslist id
    const fetchPoslistid = async () => {
        try {
            let req = await axios.get(`${SERVICE.POS_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setPosAdd(req.data.spos)
            setTableData(req.data.spos.goods);
        } catch (err) {
            const messages = err?.response?.data?.message;
            console.log(messages);
        }
    };

    const fetchProductsall = async () => {
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
    };

    // Products
    const fetchProducts = async () => {
        try {
            
            setProductsList(
                allProducts?.map((d) => ({
                    ...d,
                    label: d.productname + "-" + d.sku,
                    value: d.productname + "-" + d.sku,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // get all stock data
    const fetchHandleStock = async () => {
        try {
            var response = await axios.get(SERVICE.STOCK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = response.data.stocks.filter((data, index)=>{
                return data.assignbusinessid == setngs.businessid
            })
            let allstockData = result.map((value) => {
                return value.products
            })
            let stockdata = [];
            allstockData.forEach((value) => {
                value.forEach((valueData) => {
                    stockdata.push(valueData);
                })
            })
            setAllStocks(stockdata);
            setProductsList(
                stockdata?.map((d) => ({
                    ...d,
                    label: d.productname + "-" + d.sku,
                    value: d.stockid,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    // fetch categories
    const fetchcategory = async (e) => {
        try {
            let res = await axios.get(SERVICE.CATEGORIES, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.assignbusinessid)
              });
              let reqdata = res?.data?.categories?.filter(item => {
                return item.subcategories
            })
            setSubCategory(reqdata);
            setCategory(res?.data?.categories);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    // fetch product compare with category,subcategory and brand
    const singleId = (id) => {
        let compareitem = products.filter(row => {
            return row.category == id
        })
        setComparecate(compareitem)
    }
    const singlesub = (id) => {
        let compareitem = products.filter(row => {
            return row.subcategory == id
        })
        setComparesub(compareitem)
    }

    const singlebrand = (id) => {
        let compareitem = products.filter(row => {
            return row.brand == id
        })
        setComparebrand(compareitem)
    }

    let tempTotal = 0;
    let clearvalall = [];
    let getsku;
    let discount;
    let subitems = [];
    let branditems = [];

    // get all discount 
    const fetchDiscounts = async () => {
        try {
            let res = await axios.get(SERVICE.DISCOUNT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = res.data.discounts.filter((data, index) => {
                if (isUserRoleAccess.role == 'Admin') {
                  return data.assignbusinessid == setngs.businessid
                } else {
                  if (isUserRoleAccess.businesslocation.includes(data.location)) {
                    return data.assignbusinessid == setngs.businessid
                  }
                }
              })
            setDiscounts(result);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // Core function search quantity
    const fetchDataProd = (e) => {
        let discAmtData = discounts?.filter((item) => {
            if (e.sku == item.productid) {
                return item
            }
        })
        let getTaxRateData = taxrates?.filter((data) => {
            if (e.applicabletax == data.hsn || data.taxname) {
                return data
            }
        })
        let isAlreadyAdded = false;
        let addQuantity = tableData.map((item) => {
            if (e.sku == item.productid) {
                isAlreadyAdded = true
                return { ...item, quantity: item.quantity + 1, subtotal: ((Number(item.sellingincludevalue) - Number(item.discountamt)) * Number(item.quantity + 1)) }
            } else {
                return item
            }

        })

        if (isAlreadyAdded) {
            setTableData(addQuantity)
        } else {
            setTableData((tableData) => {
                return [...tableData, {
                    ...productInputs,
                    businesslocation:e.businesslocation,
                    productid: e.sku,
                    productname: e.productname,
                    quantity: 1,
                    stockid: e.stockid,
                    sellingpricetax: e.sellingpricetax,
                    sellingexcludevalue: e.sellingpricetax == 'Exclusive' ? e.sellingprice : ((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100) - Number(e.sellingprice))),
                    sellingincludevalue: e.sellingpricetax == 'Inclusive' ? e.sellingprice : ((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice)),
                    applicabletax: e.applicabletax,
                    discountamt: discAmtData[0] ? discAmtData[0].discountamt : 0,
                    taxtareval: getTaxRateData[0] ? getTaxRateData[0]?.taxrate : 1,
                    discountvalue: e.sellingpricetax == 'Inclusive' ? ((Number(((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice))) * (Number(getTaxRateData[0]?.taxrate) / 100) - Number(((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice)))) * (Number(getTaxRateData[0]?.taxrate) / 100)) : ((((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100) - Number(e.sellingprice))) * (Number(getTaxRateData[0]?.taxrate) / 100))),
                    subtotal: (Number(1) * (Number(e.sellingpricetax == 'Inclusive' ? Number(e.sellingprice) : ((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice))) - Number(discAmtData[0] ? Number(discAmtData[0].discountamt) : Number(0))))
                }]
            });

        }
    };

    const deleteRow = (i, e) => {
        setTableData(tableData.filter((e, item) => item !== i));
        tableData.splice(i, 1);
        if (tableData.length > 0) {
            tempTotal = 0
        }
    }
    useEffect(
        () => {
            grandtotalCalc();
        }, [tableData, posAdd.gdiscountvalue, posAdd.granddistype]
    )

    // grand total calculation
    const grandtotalCalc = () => {

        let totalgrandValue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totalgrandValue += Number(value.subtotal)
            })
            if (posAdd.granddistype == "Fixed" || posAdd.granddistype == "Amount") {
                setPosAdd(
                    {
                        ...posAdd, gdiscountamtvalue: posAdd.gdiscountvalue, grandtotal: Number(totalgrandValue), aftergranddisctotal: (Number(totalgrandValue) - Number(posAdd.gdiscountvalue))
                    })
            }
            else if (posAdd.granddistype == "Percentage") {
                let percentCalc = Number(totalgrandValue) * (Number(posAdd.gdiscountvalue) / 100);
                setPosAdd(
                    {
                        ...posAdd, gdiscountamtvalue: percentCalc, grandtotal: Number(totalgrandValue), aftergranddisctotal: (Number(totalgrandValue) - percentCalc)
                    });
            }
            else {
                setPosAdd(
                    {
                        ...posAdd, grandtotal: Number(totalgrandValue), aftergranddisctotal: (Number(totalgrandValue))
                    }
                )
            }
        }
    }

    
    const fulscren = document.getElementById("fullScreen")

    function openFullscreen() {
        if (fulscren.requestFullscreen) {
            fulscren.requestFullscreen();
        } else if (fulscren.webkitRequestFullscreen) { /* Safari */
            fulscren.webkitRequestFullscreen();
        } else if (fulscren.msRequestFullscreen) { /* IE11 */
            fulscren.msRequestFullscreen();
        }
    }

    // fetch pos forrecent transction
    const fetchPos = async () => {
        try {
            setPos(allPos);
        } catch (err) {
            const messages = err?.response?.data?.message;
            console.log(messages);
        }
    };

    const fetchQot = async () => {
        try {
            let req = await axios.get(SERVICE.QUOTATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = req.data.quotations.filter((data, index)=>{
                return data.assignbusinessid == setngs.businessid
            })
            setQuotations(result);
        } catch (err) {
            const messages = err?.response?.data?.message;
            console.log(messages);
        }
    };

    //check credit ledger balance
    const cardCustomerLedgerbalance = () => {

        if ((!posAdd.customer == "") || (!posAdd.customer == "Walk-in-customer")) {
            if ((posAdd.creditlimit < posAdd.ledgerbalance)) {
                setShowAlert("Check ledger balance!");
                alertOpen();
            } else {
                handleCreditSubmit();
            }
        } else {
            handleCreditSubmit();
        }
    }

    const handleCreditSubmit = (e) => {
        setPosAdd({ ...posAdd, referenceno: newvalpos })
        // e.preventdefault();
        sendRequestCredit();
    }

    // pos auto id
    let newvalpos = setngs ? setngs.salesku + "0001" : "PO0001";

    // store pos data for credit
    const sendRequestCredit = async () => {
        // reduce Current Stock in product
        tableData.map((item, index) => {
            productsList.forEach((data, i) => {
                if (item.sku == data.sku) {
                    axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        currentstock: Number(data.currentstock) - Number(item.quantity),
                    });
                }
            })
        })

        //pos auto id
    {
        pos && (
            pos.map(
                () => {
                    let strings = setngs ? setngs.salesku : "PO";
                    let refNo = pos[pos.length - 1].referenceno;
                    let digits = (pos.length + 1).toString();
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
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newvalpos = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newvalpos = strings + refNOINC;
                    }
                }))
    }
       
        try {
            let PRODUCT_REQ = await axios.post(SERVICE.POS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                customer: String(posAdd.customer),
                location: String(posAdd.location),
                contactnumber: Number(posAdd.contactnumber),
                date: String(posAdd.date),
                counter: String(posAdd.counter),
                creditlimit: Number(posAdd.creditlimit),
                ledgerbalance: Number(posAdd.ledgerbalance),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                grandtotal: Number(posAdd.grandtotal),
                ordertax: Number(posAdd.ordertax),
                shippingtax: Number(posAdd.shippingtax),
                packcharge: Number(posAdd.packcharge),
                granddistype: String(posAdd.granddistype),
                gdiscountvalue: Number(posAdd.gdiscountvalue),
                gdiscountamtvalue: Number(posAdd.gdiscountamtvalue),
                aftergranddisctotal: Number(posAdd.aftergranddisctotal),
                referenceno: String(newvalpos),
                roundof: Number(posAdd.aftergranddisctotal),
                amountgain: Number(posAdd.amountgain),
                balance: Number(posAdd.balance),
                userbyadd: String(isUserRoleAccess.staffname),
                contactid: String(posAdd.contactid),
                customerledgeid: String(posAdd.customerledgeid),
                assignbusinessid:String(setngs.businessid),
            });
            setPosAdd(PRODUCT_REQ.data);
            handleprint();
            deleteQuot();
            backLPage('/sell/pos/create');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // store pos data for cash
    const sendRequest = async () => {
        // reduce Current Stock in product
        tableData.map((item, index) => {
            productsList.forEach((data, i) => {
                if (item.sku == data.sku) {
                    axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        currentstock: Number(data.currentstock) - Number(item.quantity),
                    });
                }
            })
        })

        //pos auto id
    {
        pos && (
            pos.map(
                () => {
                    let strings = setngs ? setngs.salesku : "PO";
                    let refNo = pos[pos.length - 1].referenceno;
                    let digits = (pos.length + 1).toString();
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
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newvalpos = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newvalpos = strings + refNOINC;
                    }
                }))
    }

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.POS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                customer: String(posAdd.customer),
                location: String(posAdd.location),
                contactnumber: Number(posAdd.contactnumber),
                date: String(posAdd.date),
                counter: String(posAdd.counter),
                creditlimit: Number(posAdd.creditlimit),
                ledgerbalance: Number(posAdd.ledgerbalance),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                grandtotal: Number(posAdd.grandtotal),
                ordertax: Number(posAdd.ordertax),
                shippingtax: Number(posAdd.shippingtax),
                packcharge: Number(posAdd.packcharge),
                granddistype: String(posAdd.granddistype),
                gdiscountvalue: Number(posAdd.gdiscountvalue),
                gdiscountamtvalue: Number(posAdd.gdiscountamtvalue),
                aftergranddisctotal: Number(posAdd.aftergranddisctotal),
                referenceno: String(newvalpos),
                roundof: Number(posAdd.aftergranddisctotal),
                amountgain: Number(posAdd.amountgain),
                balance: Number(posAdd.balance),
                userbyadd: String(isUserRoleAccess.staffname),
                contactid: String(posAdd.contactid),
                customerledgeid: String(posAdd.customerledgeid),
                assignbusinessid:String(setngs.businessid),
            });
            setPosAdd(PRODUCT_REQ.data);
            handleprint();
            deleteQuot();
            toast.success(PRODUCT_REQ.data.message);
            backLPage('/sell/pos/create');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // store quotation data
    const sendQuotation = async () => {

        try {
            let PRODUCT_REQ = await axios.put(`${SERVICE.QUOTATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                customer: String(posAdd.customer),
                location: String(posAdd.location),
                contactnumber: Number(posAdd.contactnumber),
                date: String(posAdd.date),
                counter: String(posAdd.counter),
                creditlimit: Number(posAdd.creditlimit),
                ledgerbalance: Number(posAdd.ledgerbalance),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                grandtotal: Number(posAdd.grandtotal),
                ordertax: Number(posAdd.ordertax),
                shippingtax: Number(posAdd.shippingtax),
                packcharge: Number(posAdd.packcharge),
                granddistype: String(posAdd.granddistype),
                gdiscountvalue: Number(posAdd.gdiscountvalue),
                gdiscountamtvalue: Number(posAdd.gdiscountamtvalue),
                aftergranddisctotal: Number(posAdd.aftergranddisctotal),
                referenceno: String(posAdd.referenceno),
                roundof: Number(posAdd.aftergranddisctotal),
                amountgain: Number(posAdd.amountgain),
                balance: Number(posAdd.balance),
                userbyadd: String(isUserRoleAccess.staffname),
                contactid: String(posAdd.contactid),
                customerledgeid: String(posAdd.customerledgeid)
            });
            setPosAdd(PRODUCT_REQ.data);
            toast.success(PRODUCT_REQ.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/sell/quotation/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const quotid = useParams().id;
    // Delete
    const deleteQuot = async () => {
        try {
            let response = await axios.delete(`${SERVICE.QUOTATION_SINGLE}/${quotid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | INVOICE',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    const handlePosSubmit = (e) => {
        e.preventDefault();
        setPosAdd({ ...posAdd, referenceno: newvalpos })
        if (posAdd.amountgain == "" || posAdd.amountgain == 0) {
            setisAmountgain("please enter amount!");
        }else{
            setisAmountgain("");
            sendRequest();

        }
    }

    const handleSubmitquotation = (e) => {
        e.preventDefault();
        sendQuotation();
    };

    // Fetching datas for image to table
    const fetchtable = (e) => {
        let discAmtData = discounts?.filter((item) => {
            if (e.sku == item.productid) {
                return item
            }
        })
        let getTaxRateData = taxrates?.filter((data) => {
            if (e.hsncode == data.hsn) {
                return data
            } else if (e.applicabletax == data.taxname) {
                return data
            }
        })

        let isAlreadyAdded = false;
        let addQuantity = tableData.map((item) => {
            if (e.sku == item.productid) {
                isAlreadyAdded = true
                return { ...item, quantity: item.quantity + 1, subtotal: ((Number(item.sellingincludevalue) - Number(item.discountamt)) * Number(item.quantity + 1)) }
            } else {
                return item
            }
        })

        if (isAlreadyAdded) {
            setTableData(addQuantity)
        } else {
            setTableData((tableData) => {
                return [...tableData, {
                    ...productInputs,
                    businesslocation:e.businesslocation,
                    productid: e.sku,
                    productname:
                        e.productname,
                    quantity: 1,
                    sellingpricetax: e.sellingpricetax,
                    sellingexcludevalue: e.sellingpricetax == 'Exclusive' ? e.sellingexcludetax : ((Number(e.sellingexcludetax) * (Number(getTaxRateData[0]?.taxrate) / 100) - Number(e.sellingexcludetax))),
                    sellingincludevalue: e.sellingpricetax == 'Inclusive' ? e.sellingexcludetax : ((Number(e.sellingexcludetax) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingexcludetax)),
                    applicabletax: e.hsncode || e.applicabletax,
                    discountamt: discAmtData[0] ? discAmtData[0].discountamt : 0,
                    taxtareval: getTaxRateData[0] ? getTaxRateData[0]?.taxrate : 1,
                    discountvalue: e.sellingpricetax == 'Inclusive' ? ((Number(((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice))) * (Number(getTaxRateData[0]?.taxrate) / 100) - Number(((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice)))) * (Number(getTaxRateData[0]?.taxrate) / 100)) : ((((Number(e.sellingprice) * (Number(getTaxRateData[0]?.taxrate) / 100) - Number(e.sellingprice))) * (Number(getTaxRateData[0]?.taxrate) / 100))),
                    subtotal: (Number(1) * (Number(e.sellingpricetax == 'Inclusive' ? Number(e.sellingexcludetax) : ((Number(e.sellingexcludetax) * (Number(getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingexcludetax))) - Number(discAmtData[0] ? Number(discAmtData[0].discountamt) : Number(0))))
                }]
            });
        }

    };


    let dateTime = Date();

    // total qunatity calculation
    const totalQuantityCalc = () => {
        let totalquanvalue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totalquanvalue += Number(value.quantity)
            })
            return totalquanvalue.toFixed(0);
        }
    }

    //total taxvalue calc for invoice
    const totalTaxValCal = () => {
        let totaltaxvalue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totaltaxvalue += Math.abs(value.discountvalue) * value.quantity
            })
            return totaltaxvalue;
        }
    }

    // get particular discount for particular product
    const getDiscount = async (e) => {
        discounts.map((item) => {
            if (e.sku == item.productid) {
                discount = +item.discountamt;
                setgotDiscount(discount);
            }
        })
    }

    const handleSubmitclear = (e) => {
        setPosAdd({referenceno: "", customer: "Walk-in-customer", date: "", counter: "", location: "", contactnumber: "", contactid: "", creditlimit: "",
            ledgerbalance: "", totalitems: "", totalproducts: 0, grandtotal: 0, shippingtax: "", granddistype: "None", gdiscountvalue: 0, gdiscountamtvalue: 0, aftergranddisctotal: 0,
            totalbillamt: "", ordertax: "", packcharge: "", roundof: "", amountgain: 0, balance: 0, userbyadd: ""
    
            });
        setTableData(clearvalall);
    };

    useEffect(() => {
        fetchProducts();
        fetchProductsall();
        fetchPos();
        fetchQot();
        fetchDiscounts();
        taxrateRequest();
        fetchQuotid();
        fetchPoslistid();
        deleteQuot();
        fetchHandleStock();
    }, []);

    return (
        <Box id="fullScreen"
            sx={{
                backgroundColor: 'white',
                // color: "red",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Headtitle title={'Pos Edit'} />
            <form >
                {/* Navbar Start */}
                <Box sx={{ padding: "5px", backgroundColor: "#f0f2ff" }}>
                    <Grid container spacing={1} sx={{}} >
                        <Grid item lg={1} md={1} sm={2} xs={12}>
                            <Box sx={{ float: "left" }}>
                                <Link to="/dashboard">
                                    <img src={Mainlogo} style={{ width: '50px', height: '50px' }}></img>
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item md={2} sm={8} xs={11} sx={{ marginTop: "6px" }}>
                            <FormControl size="small" fullWidth>
                                <InputLabel id="demo-select-small" sx={{ marginTop: '-5px' }}>
                                    Customer
                                </InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Customer"
                                    value={posAdd.customer}
                                    type="text"
                                    sx={userStyle.posNavbarInput}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1} sx={{ marginTop: "6px" }}>
                            <Button onClick={(e) => { openFullscreen() }}><FullscreenOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "10px", padding: "5px", }}>
                            <FormControl size="small" fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={userStyle.posNavbarInput}>
                                    <DateTimePicker
                                        renderInput={(props) => <TextField {...props} />}
                                        label="Date"
                                        size='small'
                                        value={purchaseDateTime}
                                        onChange={(newValue) => {
                                            setPurchaseDateTime(newValue);
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item md={1} sm={6} xs={12} sx={{ marginTop: "10px" }}>
                            <FormControl
                                size="small"
                                fullWidth
                                sx={{ display: "flex" }}
                            >
                                <InputLabel id="demo-select-small" sx={{ marginTop: '-5px' }}>
                                    Counter
                                </InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Count"
                                    defaultValue={posAdd.counter}
                                    type="text"
                                    sx={userStyle.posNavbarInput}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "10px" }}>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: '29px' }}>
                                    <MoneyOutlinedIcon sx={{ marginTop: '-3px' }} />
                                </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <InputLabel id="demo-select-small" sx={{ marginTop: '-5px' }}>
                                        Credit Limit
                                    </InputLabel>
                                    <OutlinedInput
                                        id="component-outlined"
                                        label="Credit Limit"
                                        value={posAdd.creditlimit}
                                        type="text"
                                        sx={userStyle.posNavbarInput}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "10px" }}>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: '29px' }}>
                                    <PersonOutlineOutlinedIcon sx={{ marginTop: '-3px' }} />
                                </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <InputLabel id="demo-select-small" sx={{ marginTop: '-5px' }}>
                                        Ledger Balance
                                    </InputLabel>
                                    <OutlinedInput
                                        id="component-outlined"
                                        label="Ledger Balance"
                                        type="text"
                                        value={posAdd.ledgerbalance}
                                        sx={userStyle.posNavbarInput}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={1} sm={6} xs={12} sx={{ marginTop: "10px" }}>
                            <Grid sx={{ display: "flex" }}>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <InputLabel id="demo-select-small" sx={{ marginTop: '-5px' }}>
                                        Invoice No
                                    </InputLabel>
                                    <OutlinedInput
                                        id="component-outlined"
                                        label="Invoice No"
                                        type="text"
                                        value={posAdd.referenceno}
                                        sx={userStyle.posNavbarInput}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                {/* Navbar Ends */}
                <Grid container xs={12} sm={12} md={12} lg={12} sx={{ backgroundColor: "#f0f2ff", }} >
                    <Grid item xs={12} sm={12} md={8} lg={8} sx={{ paddingRight: '3px', backgroundColor: '#fff' }} >
                        {/* <br /> */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                {/* Table start */}
                                <TableContainer
                                    sx={{ paddingLeft: 1, height: '478px' }}
                                >
                                    <Table
                                        aria-label="customized table" padding='none'>
                                        <TableHead >
                                            <TableRow>
                                                <TableCell sx={userStyle.tableHead1} style={{ marginLeft: '5px' }}>
                                                    {" "}
                                                    Product Name
                                                    <Tooltip arrow sx={{ zIndex: '1' }}
                                                        title="Click product name to edit price, discount & tax.">
                                                        <IconButton size="small">
                                                            <FcInfo />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Qty</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Unit Cost ( Ex. Tax )</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Tax</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Unit Cost ( Inc. Tax )</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Discount value</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Subtotal </TableCell>
                                                <TableCell sx={userStyle.tableHead1}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tableData &&
                                                tableData?.map((data, i) => {
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
                                                                        {Math.abs(data?.sellingexcludevalue)}
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
                                                                    <Grid container lg={12} md={12} sm={12} xs={12}>
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
                                                                <TableCell sx={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: '15px !important' }}><AiOutlineClose onClick={(e) => { deleteRow(i, e); }} /></TableCell>
                                                            </TableRow>
                                                        </>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* Table Ends */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: '-24px' }}>
                                <Grid container xs={12} sm={12} md={12} lg={12} spacing={1}>
                                    <Grid item md={3} sm={4} xs={12}>
                                        <Typography sx={{ marginLeft: '15px' }}>
                                            <b> Total Items :</b>{tableData.length}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}
                                        sx={{ display: 'flex' }}
                                    >
                                        <FormControl size="small" fullWidth>
                                            <InputLabel> Discount Type </InputLabel>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                fullWidth
                                                label="Discount Type"
                                                value={posAdd.granddistype}
                                                onChange={(e) => {
                                                    setPosAdd({ ...posAdd, granddistype: e.target.value })
                                                }}
                                            >
                                                <MenuItem value="None">None</MenuItem>
                                                <MenuItem value="Fixed">Fixed</MenuItem>
                                                <MenuItem value="Amount">Amount</MenuItem>
                                                <MenuItem value="Percentage">Percentage</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <TextField
                                            size="small"
                                            value={posAdd.gdiscountvalue}
                                            onChange={(e) => {
                                                setPosAdd({ ...posAdd, gdiscountvalue: e.target.value });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={5} sm={4} xs={12} sx={{ paddingLeft: '4px', paddingRight: '1px', marginTop: '-4px' }}>
                                        <Button fullWidth variant="contained" sx={{ marginTop: "5px", }}>
                                            <b>GRAND TOTAL :</b>&ensp;{posAdd.grandtotal}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container xs={12} sm={12} md={12} lg={12}>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Discount:</b>{posAdd.gdiscountamtvalue}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} sx={{ p: 1, backgroundColor: '#fff', }}>
                        <Grid container  >
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button fullWidth sx={userStyle.paynowbtn}
                                    onClick={(e) => { fetchProd(e); }}
                                >
                                    All
                                </Button>
                            </Grid>
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.paynowbtn}
                                    onClick={(e) => { handleDrawerOpen(); fetchcategory() }}
                                >
                                    Category
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open1}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar sub-category */}
                                    <div className={classes.closeicon}>
                                        <IconButton sx={userStyle.closeicon} onClick={handleDrawerClose}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '20px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#7009ab', fontWeight: 'bolder' }}>List of Category</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e); }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{}}><b>All Category</b></Typography>
                                            </Grid>
                                            {category && (
                                                category.map((row, index) => (
                                                    <>
                                                        <br />
                                                        <div key={index} style={{ curser: 'pointer' }}>
                                                            <img src={noimage} alt="image" onClick={(e) => { singleId(row.categoryname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{row.categoryname}</Typography>
                                                        </div>
                                                    </>
                                                ))
                                            )}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.paynowbtn}
                                    style={{ p: '5px' }}
                                    onClick={(e) => { handleDrawerOpen1(); fetchcategory(); }}
                                >
                                    SubCategory
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open2}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar sub-category */}

                                    <div className={classes.closeicon}>
                                        <IconButton onClick={handleDrawerClose1}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '16px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#7009ab', fontWeight: 'bolder' }}>List of Sub-Category</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e) }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{}}><b>All Subcategory</b></Typography>
                                            </Grid>
                                            {subcategory && (
                                                subcategory?.map((row, index) => (
                                                    row.subcategories.map(((meta, i) => {
                                                        subitems.push(meta);
                                                    }))
                                                ))
                                            )}
                                            {subitems.map((item, i) => {
                                                return (
                                                    <>
                                                        <br />
                                                        <div key={i} style={{ curser: 'pointer' }}>
                                                            <img src={noimage} alt="image" onClick={(e) => { singlesub(item.subcategryname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{item.subcategryname}</Typography>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.paynowbtn}
                                    onClick={(e) => { handleDrawerOpen2(); fetchcategory(); }}
                                >
                                    Brand
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open3}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar brand */}
                                    <div className={classes.closeicon}>
                                        <IconButton onClick={handleDrawerClose2}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '20px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#7009ab', fontWeight: 'bolder' }}>List of Brand</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e) }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{ marginLeft: '1.3em' }}><b>All Brand</b></Typography>
                                            </Grid>
                                            {category && (
                                                category?.map((row, index) => (
                                                    row.brands.map(((meta, i) => {
                                                        branditems.push(meta);
                                                    }))
                                                ))
                                            )}
                                            {branditems.map((item, i) => {
                                                return (
                                                    <>
                                                        <br />
                                                        <div key={i} style={{ curser: 'pointer' }}>
                                                            <img src={noimage} alt="image" onClick={(e) => { singlebrand(item.brandname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{item.brandname}</Typography>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                            <br /><br /><br />
                            <Grid item md={12} sm={12} xs={12} sx={{ marginLeft: '25px' }}>
                                <Grid sx={{ display: "flex" }}>
                                    <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                        <SearchOutlinedIcon />
                                    </Grid>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={productsList}
                                            onChange={(e) => {
                                                fetchDataProd(e);
                                                getDiscount(e);
                                                totalQuantityCalc();
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} sx={{}}>
                                <br />
                                <Grid container lg={12} md={12} sm={12} xs={12} spacing={2} sx={{ display: 'flex' }}>
                                    <br />
                                    <>
                                        <Grid container>
                                            {comparecate && (
                                                comparecate.map((row, index) => (
                                                    <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150 }}>
                                                        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <p style={{ fontSize: '10px' }}>{row.currentstock}</p>
                                                            <img src={row.productimage} onClick={(e) => { rowData(row._id); }} width="50px" height="70px" />
                                                        </Grid>
                                                        <p>{row.sellingexcludetax}</p>
                                                    </Grid>
                                                )))}
                                        </Grid>
                                    </>

                                    <>
                                        <Grid container>
                                            {comparesub && (
                                                comparesub.map((row, index) => (
                                                    <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150 }}>
                                                        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <p style={{ fontSize: '10px' }}>{row.currentstock}</p>
                                                            <img src={row.productimage} onClick={(e) => { rowData(row._id); }} width="50px" height="70px" />
                                                        </Grid>
                                                        <p>{row.sellingexcludetax}</p>
                                                    </Grid>
                                                )))}
                                        </Grid>
                                    </>

                                    <>
                                        <Grid container>
                                            {comparebrand && (
                                                comparebrand.map((row, index) => (
                                                    <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150 }}>
                                                        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <p style={{ fontSize: '10px' }}>{row.currentstock}</p>
                                                            <img src={row.productimage} onClick={(e) => { rowData(row._id); }} width="50px" height="70px" />
                                                        </Grid>
                                                        <p>{row.sellingexcludetax}</p>
                                                    </Grid>
                                                )))}
                                        </Grid>
                                    </>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container sx={userStyle.btnGrid}>
                    <Grid item md={8} sm={8} xs={12} sx={{ display: "flex", color: 'black' }}>
                        <Button disableRipple sx={userStyle.btnPause} type="submit" onClick={handleSubmitquotation}>
                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                            &ensp;Quotation
                        </Button>
                        <Button disableRipple sx={userStyle.btnCash} onClick={handleClickOpenpay}>
                            <FaMoneyBillAlt />
                            &ensp;Cash
                        </Button>
                        <Button disableRipple sx={userStyle.btnCancel} onClick={handleSubmitclear}>
                            <FaRegWindowClose />
                            &ensp;Cancel
                        </Button>
                        <Button disableRipple sx={userStyle.btnCard} onClick={cardCustomerLedgerbalance}>
                            <FaRegWindowClose />
                            &ensp;Credit
                        </Button>
                        <Typography value={posAdd.totalbillamt}
                            sx={{ marginLeft: '15px', color: 'grey', fontSize: "20px" }}>
                            <b>Total:</b> <span style={{ color: 'green' }}>{posAdd.aftergranddisctotal}</span>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
            {/*  card details*/}
            <Dialog
                open={isDeleteOpen}
                onClose={handleClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '610px', height: '300px' }}>
                    <Typography sx={userStyle.HeaderText}>Enter Card  Details</Typography>
                    <Grid container spacing={1} sx={{ paddingTop: '2em' }}>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <InputLabel htmlFor="component-outlined">Card Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <InputLabel htmlFor="component-outlined">Card Holder Name</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Card Transaction Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} >
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Card Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                >
                                    <MenuItem value="Visa" > Visa</MenuItem>
                                    <MenuItem value="Master Card" > Master Card</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Month</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">year</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Security Code</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} variant="outlined">Cancel</Button>
                    <Button autoFocus variant="contained" color='error'> OK </Button>
                </DialogActions>
            </Dialog>
            {/* Cash dialog box */}
            <Dialog
                open={isPay}
                onClose={handleClosepay}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle>
                    <Typography sx={userStyle.HeaderText}>Enter Cash Details</Typography>
                </DialogTitle>
                <DialogContent sx={{ padding: '0px' }}>
                    <Grid container xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px' }} spacing={3}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Grid container spacing={3}  >
                                <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <Grid container xs={12} sm={12} md={12} lg={12}>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <InputLabel id="demo-select-small"> Amount </InputLabel>
                                            <Grid sx={{ display: "flex" }}>
                                                <Grid sx={userStyle.spanIcons}>
                                                    <MoneyOutlinedIcon />
                                                </Grid>
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                    sx={{ display: "flex" }}
                                                >
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={posAdd.aftergranddisctotal.toFixed(0)}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <br />
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                        <p style={{color:'red'}}>{isAmountgain}</p>
                                            <InputLabel id="demo-select-small">
                                                Amount Gain
                                            </InputLabel>
                                            <Grid sx={{ display: "flex" }}>
                                                <Grid sx={userStyle.spanIcons}>
                                                    <MoneyOutlinedIcon />
                                                </Grid>
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                    sx={{ display: "flex" }}
                                                >
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={posAdd.amountgain}
                                                        onChange={(e) => { setPosAdd({ ...posAdd, amountgain: e.target.value, balance: (Number(posAdd.aftergranddisctotal.toFixed(0)) - Number(e.target.value)) }) }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <br />
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <InputLabel id="demo-select-small">
                                            Balance
                                        </InputLabel>
                                        <Grid sx={{ display: "flex" }}>
                                            <Grid sx={userStyle.spanIcons}>
                                                <MoneyOutlinedIcon />
                                            </Grid>
                                            <FormControl
                                                size="small"
                                                fullWidth
                                                sx={{ display: "flex" }}
                                            >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={Math.abs(posAdd.balance)}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingLeft: '20px' }}>
                            <Card sx={{ padding: '30px' }}>
                                <TableContainer sx={{ boxShadow: '0 0 15px -2px #444444' }}>
                                    <Table>
                                        <TableBody>
                                            <StyledTableRow>
                                                <StyledTableCell><b>Total Products :</b></StyledTableCell>
                                                <StyledTableCell>{totalQuantityCalc()}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell><b>OrderTax :</b></StyledTableCell>
                                                <StyledTableCell>Rs.0.00</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell> <b>Shipping :</b></StyledTableCell>
                                                <StyledTableCell>Rs.0.00</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell><b>Discount :</b></StyledTableCell>
                                                <StyledTableCell>{posAdd.gdiscountamtvalue}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell> <b>Packing Charge :</b></StyledTableCell>
                                                <StyledTableCell>Rs.0.00</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell> <b>Round off :</b></StyledTableCell>
                                                <StyledTableCell>{posAdd.aftergranddisctotal.toFixed(0)}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell><b>Grand Total :</b></StyledTableCell>
                                                <StyledTableCell>{posAdd.aftergranddisctotal.toFixed(0)}</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosepay} variant="outlined">Cancel</Button>
                    <Button autoFocus variant="contained" color='primary' type="submit" onClick={(e) => { handlePosSubmit(e) }}> Print </Button>
                </DialogActions>
            </Dialog>
            {/* Cash Dialog Ends */}
            {/* Error model */}
            <Dialog
                open={isErrorOpen}
                onClose={alertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={alertClose}>ok</Button>
                </DialogActions>
            </Dialog>
            {/* invoice print layout     */}
            <>
                <Box sx={userStyle.printcls} ref={componentRef}>
                    <Box sx={{ textAlign: 'center', width: '400px' }}>
                        <Typography>{setngs?.businessname}</Typography>
                        <Typography>No 2 Zee towers Trichy</Typography>
                        <Typography>{businesslocation[0]?.zipcde}</Typography>
                        <Typography>CIN : {setngs ? setngs.ciono : ""}</Typography>
                        <Typography>GST NO :{setngs ? setngs.gstno : ""}</Typography>
                        <Typography variant="h6">INVOICE</Typography>
                        <Box sx={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography name="print" align='left'><b>Invoice No :</b>{newvalpos}</Typography>
                                <Typography name="print" align='left'><b>Counter :</b> {posAdd.counter}</Typography>
                                <Typography name="print" align='left'><b>Customer ID :</b> {posAdd.contactid}</Typography>
                                <Typography name="print" align='left'><b>Mail ID :</b> {businesslocation[0]?.email}</Typography>
                            </Grid>
                            <Grid item xs={6} align="right" >
                                <Typography name="print" ><b>Cashier :</b>{isUserRoleAccess.userid}</Typography>
                                <Typography name="print" ><b>Name : </b>{isUserRoleAccess.staffname}</Typography>
                                <Typography name="print" ><b>Phone : </b>{businesslocation[0]?.phonenumber}</Typography>
                            </Grid>
                        </Grid>
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
                            <Table aria-label="simple table" >
                                <TableHead >
                                    <TableRow sx={{ borderBottom: 'none' }}>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>ITEM</TableCell>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>QUANTITY</TableCell>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>PRICE</TableCell>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.length > 0 &&
                                        tableData.map((data, i) => {
                                            return (
                                                <>
                                                    <TableRow>
                                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: "1000", padding: '5px', borderBottom: "none" }} key={i}>{data?.productid} <br />

                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '12px', fontWeight: "1000", padding: '5px', borderBottom: "none" }}>
                                                            <Typography>
                                                                {data?.quantity}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '12px', fontWeight: "1000", padding: '5px', borderBottom: "none" }}>
                                                            <Typography>
                                                                {Math.abs(data?.sellingexcludevalue)}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell align="center" sx={{ fontSize: '12px', fontWeight: "1000", padding: '5px', borderBottom: "none" }}>
                                                            <Typography variant='subtitle1'>{Number(data?.subtotal).toFixed(2)}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ fontSize: '14px', fontWeight: "1000", padding: '0px', borderBottom: "none" }} colSpan={4}>{data?.productname}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ fontSize: '14px', fontWeight: "1000", padding: '0px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }} colSpan={2}> {"HSN CODE :"}{data?.applicabletax}</TableCell>
                                                        <TableCell sx={{ fontSize: '14px', fontWeight: "1000", padding: '0px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }} colSpan={2}> {"Taxable value : "}{Math.abs(((data?.sellingexcludevalue * data?.taxtareval / 100) - +data?.sellingexcludevalue) + +data?.discountamt) * data?.quantity}</TableCell>
                                                    </TableRow>
                                                </>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>GRAND TOTAL :</b></Typography>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={3}>
                                <Typography name="print" ><b>{Number(posAdd.aftergranddisctotal).toFixed(2)}</b> </Typography>
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>NET TOTAL :</b></Typography>
                                <Typography name="print" ><b>NET TAX :</b></Typography>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={3}>
                                <Typography name="print" ><b>{Number(posAdd.aftergranddisctotal).toFixed(2)}</b> </Typography>
                                <Typography name="print" ><b>{ Number(totalTaxValCal()).toFixed(2) }</b> </Typography>
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <Typography variant="h6">TAX DETAILS</Typography>
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
                            <Table aria-label="simple table" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>HSN/Tax</TableCell>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>TAX DESC</TableCell>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>Taxable VALUE</TableCell>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>TAX</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.length > 0 &&
                                        tableData.map((data, i) => {
                                            return (
                                                <>
                                                    <TableRow>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{data?.applicabletax}</TableCell>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{data?.applicabletax}</TableCell>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{Math.abs((((data?.sellingexcludevalue * data?.taxtareval / 100) - +data?.sellingexcludevalue) + +data?.discountamt)).toFixed(2)}</TableCell>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{Math.abs((data?.sellingexcludevalue * data?.taxtareval / 100) * data?.quantity).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                </>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>TOTAL :</b></Typography>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={3}>
                                {/* <Typography name="print" ><b>{ Number(totalTaxValCal()).toFixed(2) }</b> </Typography> */}
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />

                        <Grid container>
                            <Grid item xs={7}>
                                <Typography name="print" ><b></b></Typography>
                                <Typography name="print" ><b>TOTAL RECEIVED AMOUNT</b></Typography>
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={3}>
                                <Typography name="print" ><b></b> </Typography>
                                <Typography name="print" ><b>{posAdd.amountgain}</b> </Typography>
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>NO. OF ITEMS:  </b>{totalQuantityCalc()}</Typography>
                                <Typography name="print" ><b>TOTAL ITEMS: </b>{totalQuantityCalc()}</Typography>
                            </Grid>
                        </Grid><br />
                        <Grid container>
                            <Grid>
                                <Typography variatnt="subtitle2" align="left">* All Offers are subject to applicable T&C.</Typography>
                                <Typography variatnt="subtitle2" align="left">* No return / Exchange / Refund on Innerwear, Dresses, Cloths and Chudidhar.</Typography>
                                <Typography variatnt="subtitle2" align="left">* This is computer generated invoice and hence does not require any signature.</Typography>
                            </Grid>
                        </Grid>
                    </Box><br /><br /><br /><br />
                </Box><br /><br />
            </>
        </Box>
    );
};
export default Quotationedit;

