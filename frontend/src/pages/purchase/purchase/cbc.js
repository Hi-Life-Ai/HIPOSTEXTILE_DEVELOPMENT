import React, { useEffect, useState, useContext } from 'react';
import { userStyle, colourStyles } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Select, MenuItem, Paper, TableCell, Dialog, DialogContent, DialogActions, TextareaAutosize, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FaSearch } from "react-icons/fa";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import Purchasesupplieradd from './Purchasesupplieradd';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { AiOutlineClose } from "react-icons/ai";
import Headtitle from '../../../components/header/Headtitle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Purchaseproductadd from './Purchaseproductadd';
import Selects from "react-select";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';

const Purchasecreatelist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [supplier, setSupplier] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [busilocations, setBusilocations] = useState();
    const [isBusilocations, setIsBusilocations] = useState();
    const [taxrates, setTaxrates] = useState();
    const [fetchsaveproduct, setFetchsaveproduct] = useState();
    const [taxRate, setTaxRate] = useState({});
    const [productsList, setProductsList] = useState([]);
    const [alpha, setAlpha] = useState("");
    const [isSupplierFetch, setIsSupplierFetch] = useState();
    const [allTotalItems, setAlltotalItems] = useState([]);
    const totalItem = { quantity: 0, freeitem: 0 };
    const [locationData, setLocationData] = useState([])

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    //role access
    const { isUserRoleAccess, allLocations, allTaxratesGroup, isActiveLocations, allProducts, allPurchases, allTaxrates } = useContext(UserRoleAccessContext);

    // paid date
    const [paidDateTime, setPaidDateTime] = useState(dayjs());
    let purchaseStatusPending = "Pending";
    let purchaseStatusReceived = "Received";
    let balanceamt = 0;
    // produts list for add purchase data into db
    const productInputs = {
        produniqid: "", prodname: "", sku: "", hsn: "", hsntax: "", applicabletax: "", applicabletaxrate: "", lotnumber: "", purchasetabletax: "", purchasetax: "None", sellingpricetax: "", enteramt: "", margin: "", purchaseexcludetax: "",
        pruchaseincludetax: "", excalpha: "", incalpha: "", quantity: "", freeitem: "", purchasenetcost: "", distypemod: "None", disvaluemod: "", ratebydismod: "",
        differenceamt: "", sellingpriceunitcost: "",
    }
    const [allProductsList, setAllProductsList] = useState([]);
    // purchase list og data only in add purchase
    const [purchaseAdd, setPurchaseAdd] = useState({
        supplier: "", referenceno: "", billamount: "", purchasedate: today,purchasetaxmode:"None", purchasestatus: "Pending", addressone: "", balance: 0,
        businesslocation: "", invoiceno: "", nettotal: 0.0, totalitem: 0,
        purchasetax: "", additionalnotes: [], paydue: 0, payamount: 0.0, advancebalance: "", paidon: "", paymentmethod: "None"
    });

    // auto id for purchase number
    let newval = setngs ? setngs.purchasesku == undefined ? "PU0001" : setngs.purchasesku + "0001" : "PU0001";
    //auto id
    const [purchases, setPurchases] = useState(newval);
    //  File Upload
    const [files, setFiles] = useState([]);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const handleClickOpen = () => {
        setIsErrorOpen(true);
    };
    const handleClose = () => {
        setIsErrorOpen(false);
    };

    // add hsn to the product list data
    const gethsncode = async (e) => {

        try {

            setTaxrates(allTaxratesGroup);
            let taxRateData = allTaxrates?.filter((data) => {
                if (data.hsn == e.hsncode) {
                    return data
                } else if (data.taxname == e.applicabletax) {
                    return data
                }
            });
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
                    return [{ ...productInputs, produniqid: e._id,purchasetabletax: purchaseAdd.purchasetaxmode == "Inclusive" ? "Inclusive" : purchaseAdd.purchasetaxmode == "Exclusive" ? "Exclusive" : "",supplier: purchaseAdd.supplier, date: purchaseAdd.purchasedate, margin: setngs.dprofitpercent, applicabletax: e.applicabletax == "" || e.applicabletax == "None" ? "" : e.applicabletax, applicabletaxrate: e.applicabletax == "" || e.applicabletax == "None" ? 0 : taxRateData[0]?.taxrate, hsntax: e.hsn == "" || e.hsn == "None" ? 0 : taxRateData[0]?.taxrate, prodname: e.productname, sku: e.sku, hsn: e.hsn == "" || e.hsn == "None" ? "" : e.hsn, sellingpricetax: e.sellingpricetax }, ...productslistdata]
                });
            }

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }

    }

    // Purchase 
    const fetchPurchases = async () => {
        try {
            
      let refNo = allPurchases[allPurchases?.length - 1].referenceno;
      let codenum = refNo.slice(-4);
      let prefixLength = Number(codenum) + 1;
      let prefixString = String(prefixLength);
      let strings = setngs ? setngs.purchasesku : "PU";
      let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
      setPurchases(strings+postfixLength)
      //setCategoryForm({ ...categoryForm, categorycode: strings+postfixLength })

        let locresult = allPurchases?.map((data, index) => {
            return data.referenceno
        })
        setLocationData(locresult);
           
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } 
            // else {
            //     toast.error("Something went wrong!")
            // }
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

    // Suppliers
    const fetchSuppliers = async () => {
        try {
            let res = await axios.post(SERVICE.SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setSuppliers(
                res.data.suppliers.map((d) => ({
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


    // Products
    const fetchProducts = async () => {
        try {

            let selectlocation = allLocations?.filter((data, index) => {
                return data.locationid == setngs.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setBusilocations(isActiveLocations?.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.locationid,
                }
            )));

            setProductsList(
                allProducts?.map((d) => ({
                    ...d,
                    label: d.productname,
                    value: d.productname,
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

    // Get GST FROM TAX
    const searchTax = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.TAXRATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setTaxRate(res?.data?.staxrate)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //  File Upload
    const handleFileUpload = (event) => {
        const files = event.target.files[0];

        const reader = new FileReader()
        const file = files;
        reader.readAsDataURL(files)
        reader.onloadend = (event) => {
            setFiles((prevFiles) => [
                ...prevFiles,
                { name: file.name, data: reader.result.split(',')[1] },
            ]);
        };
    };

    const handleFileDelete = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // alpha
    const fetchAlpha = async () => {
        try {
            let res = await axios.post(SERVICE.ALPHARATEACTIVE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setAlpha(res?.data?.alpharates);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }

    }

    // alpharate for exclude tax
    let gotalpha = "";
    const getAlphaRate = (inputValue) => {
        let getalpha = alpha.slice(0).filter((data) => {
            var num = inputValue;
            var digits = num.toString().split('');
            var realDigits = digits.map((item) => {
                if (item == '.') {
                    gotalpha += '.'
                }
                else {
                    gotalpha += data[item]
                }
            });
        });
        return gotalpha
    }

    //alpharate include tax
    const getAlphaRateInc = (taxValue) => {
        let alphaValue = ""
        let getalpha = alpha.slice(0).filter((data) => {
            var num = taxValue;
            var digits = num.toString().split('');
            var realDigits = digits.map((item) => {
                if (item == '.') {
                    alphaValue += '.'
                }
                else {
                    alphaValue += data[item]
                }
            })
        });
        return alphaValue;
    }

    useEffect(() => {
        fetchPurchases();
        fetchProducts();
        fetchSuppliers();
        fetchAlpha();
        totalNetCostCalc();
    }, [isSupplierFetch, fetchsaveproduct]);

    const backPage = useNavigate();

    // compare bill amount net total then only purchase status changed and update currentstock
    const purchaseStatusInput = (value) => {
        if (value == "Received") {
            if (purchaseAdd.billamount == Number(totalNetCostCalc())) {
                setPurchaseAdd({
                    ...purchaseAdd, purchasestatus: "Received"
                });
            } else {
                setPurchaseAdd({
                    ...purchaseAdd, purchasestatus: "Pending"
                });
                purchaseStatusReceived = "Pending";
                setShowAlert("Bill Amount and Net total didn't match");
                handleClickOpen();
            }
        }
    }

    // purchase data add to database
    const addPurchase = async () => {

        // current stock when the user submit
        if (purchaseAdd.purchasestatus == "Received") {
            allProductsList.map((item, index) => {
                productsList.forEach((data, i) => {
                    if ((item.sku == data.sku)) {
                        axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                            currentstock: Number(data.currentstock) + Number(item.quantity) + Number(item.freeitem),
                            purchaseexcludetax: Number(item.purchaseexcludetax), pruchaseincludetax: Number(item.pruchaseincludetax),
                            sellingexcludetax: Number(item.sellingpriceunitcost)
                        });
                    }
                })
            })
        }

        let allproductreverse = [...allProductsList.reverse()];
        // let supplieraddress =  supplier.addressone == null || supplier.addressone == undefined ? "" : supplier.addressone + "," + supplier.addresstwo == null || supplier.addresstwo == undefined ? "" : " " + supplier.addresstwo + "," + supplier.country == null || supplier.country == undefined ? "" : " " + supplier.country + "," + supplier.state == null || supplier.state == undefined ? "" : " " + supplier.state + "," + supplier.city == null || supplier.city == undefined ? "" : " " + supplier.city + " " + "-" + supplier.pincode == null || supplier.pincode == undefined ? "" : " " + supplier.pincode + ","+supplier.phoneone == null || supplier.phoneone == undefined ? "" : " " + "Ph" + " " + ": " +" " + +supplier.phoneone;
        let supplieraddress =  supplier.addressone + "," + supplier.addresstwo + "," + supplier.country + "," + supplier.state + "," + supplier.city + " " + "-" + " " + supplier.pincode + "," + "Ph" + " " + ":" + " " + supplier.phoneone;

        try {
            let purchase = await axios.post(SERVICE.PURCHASE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                supplier: String(purchaseAdd.supplier),
                today:String(today),
                referenceno: String(purchaseAdd.referenceno),
                purchasedate: String(purchaseAdd.purchasedate),
                purchasestatus: String(purchaseAdd.purchasestatus),
                addressone: String(supplieraddress),
                businesslocation: String(purchaseAdd.businesslocation),
                billamount: Number(purchaseAdd.billamount),
                invoiceno: String(purchaseAdd.invoiceno),
                purchasetaxmode: String(purchaseAdd.purchasetaxmode),
                products: [...allproductreverse],
                purchasetax: String(purchaseAdd.purchasetax),
                additionalnotes: String(purchaseAdd.additionalnotes == undefined ? "" : purchaseAdd.additionalnotes),
                totalitem: Number(totalitem),
                nettotal: Number(totalNetCostCalc()),
                advancebalance: Number(purchaseAdd.advancebalance),
                payamount: Number(purchaseAdd.payamount),
                paidon: String(paidDateTime),
                paymentmethod: String(purchaseAdd.paymentmethod),
                paydue: Number(purchaseAdd.paydue),
                balance: Number(balanceamt),
                userbyadd: String(isUserRoleAccess.staffname),
                files: [...files],
                assignbusinessid: String(setngs.businessid),
            });
            setPurchaseAdd(purchase.data);
            toast.success(purchase.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/purchase/purchase/list');
            await fetchProducts();
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                if (messages == "request entity too large") {
                    setShowAlert("Document Size Can't more than 3MB!");
                    handleClickOpen();
                } else {
                    setShowAlert(messages);
                    handleClickOpen();
                }
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (locationData.includes(purchaseAdd.referenceno)) {
            setShowAlert("ID Already Exists");
            handleClickOpen();
        }
        else if (purchaseAdd.supplier == "") {
            setShowAlert("Please enter supplier name!");
            handleClickOpen();
        } else if (purchaseAdd.billamount == 0 || purchaseAdd.billamount == "") {
            setShowAlert("Please enter bill amount!");
            handleClickOpen();
        } 
        // else if (allProductsList.length == 0) {
        //     setShowAlert("Please select any one of product!");
        //     handleClickOpen();
        // } else if (totalNetCostCalc() == 0 || totalNetCostCalc() == undefined) {
        //     setShowAlert("Please enter any one of product detail!");
        //     handleClickOpen();
        // }
        else {
            addPurchase();
        }
    }

    // all tabel product tax calculation
    function productUserInput(indexInput, productInputName, inputValue, reference = "") {
        let userInputs = allProductsList.map((value, indexList) => {

            if (indexInput == indexList) {
                if (reference == "purchasetablechange") {
                    //purchase inclusive
                    if (inputValue == "Exclusive") {
                        if (value.sellingpricetax == "Exclusive") {
                            let purchaseExtAmt = Number(value.enteramt);
                            let purchaseextamtfixed = purchaseExtAmt?.toFixed(0);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvalue = (Number(purchaseextamtfixed) * (Number(value.margin) / 100));
                            let sellingExcludevalue = Number(purchaseextamtfixed) + Number(sellingvalue);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: value.enteramt };
                                return allItems;
                            });
                            return { ...value, [productInputName]: inputValue, enteramt: value.enteramt, purchaseexcludetax: value.enteramt, purchasetax: "None", pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(value.enteramt), sellingpriceunitcost: Number(sellingExcludevalue?.toFixed(0)) };
                        } else if (value.sellingpricetax == "Inclusive") {
                            if(value.enteramt){
                                let purchaseExtAmt = Number(value.enteramt);
                            let purchaseextamtfixed = purchaseExtAmt?.toFixed(0);
                            //selling price inclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseextamtfixed) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseextamtfixed) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined ? 0 : value?.hsntax == "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined ? 0 : value?.applicabletaxrate == "" ? 0 : value?.applicabletaxrate;
                            let sellingvaluetax = (Number(sellingExmargin) * Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: value.enteramt };
                                return allItems;
                            });
                            return { ...value, [productInputName]: inputValue, enteramt: value.enteramt, purchasetax: "None", purchaseexcludetax: purchaseextamtfixed, pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(purchaseextamtfixed), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) };
                            }
                            return { ...value, [productInputName]: inputValue };
                        }
                    }
                    //purchase exclusive
                    else if (inputValue == "Inclusive") {
                        if (value.sellingpricetax == "Exclusive") {
                            let purchaseIncAmt = Number(value.enteramt);
                            let purchaseincamtfix = purchaseIncAmt?.toFixed(0);
                            let tax = taxRate ? taxRate.taxrate == undefined ? 0 : taxRate?.taxrate == "" ? 0 : taxRate?.taxrate : taxRate?.taxrate;
                            let purchaseExcamtBasedInc = (Number(purchaseIncAmt) / (1 + (Number(tax)) / Number(100)));
                            let purchaseExcamtBasedIncfix = purchaseExcamtBasedInc?.toFixed(0);
                            //selling price exclusive purchase price inclusive unit cost
                            let sellingvalue = (Number(purchaseincamtfix) * (Number(value.margin) / 100));
                            let sellingIncludevalue = Number(purchaseincamtfix) + sellingvalue;
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: value.enteramt };
                                return allItems;
                            });
                            return { ...value, [productInputName]: inputValue, purchasetax: value.purchasetax, pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingIncludevalue?.toFixed(0)) };
                        } else if (value.sellingpricetax == "Inclusive") {
                            if(value.enteramt){
                                let purchaseIncAmt = Number(value.enteramt == "" || undefined ? 0 : value.enteramt);
                            let purchaseincamtfix = purchaseIncAmt?.toFixed(0);
                            let tax = taxRate ? taxRate.taxrate == undefined ? 0 : taxRate?.taxrate == "" ? 0 : taxRate?.taxrate : taxRate?.taxrate;
                            let purchaseExcamtBasedInc = Number(purchaseIncAmt) / Number(1 + (Number(tax) / 100));
                            let purchaseExcamtBasedIncfix = purchaseExcamtBasedInc?.toFixed(0);
                            //selling price inclusive purchase price inclusive unit cost
                            let sellingvaluemargin = (Number(purchaseExcamtBasedIncfix) * (Number(value.margin == "" || undefined ? 0 : value.margin) / 100));
                            let sellingExmargin = Number(purchaseExcamtBasedIncfix) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined ? 0 : value?.hsntax == "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined ? 0 : value?.applicabletaxrate == "" ? 0 : value?.applicabletaxrate;
                            let sellingvaluetax = (Number(sellingExmargin) * ((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: value.enteramt };
                                return allItems;
                            });
                            return { ...value, [productInputName]: inputValue, purchasetax: value.purchasetax, pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) };
                            }
                            return { ...value, [productInputName]: inputValue};
                        }
                    }
                }
                else if (reference == "taxchange") {
                    if (value.purchasetabletax == "Inclusive") {
                        if (value.sellingpricetax == "Exclusive") {
                            let purchaseIncAmt = Number(value.enteramt == "" || 0 ? 0 : value.enteramt);
                            let purchaseincamtfix = purchaseIncAmt?.toFixed(0);
                            let tax = taxRate ? taxRate.taxrate == undefined ? 0 : taxRate?.taxrate == "" ? 0 : taxRate?.taxrate : taxRate?.taxrate;
                            let purchaseExcamtBasedInc = (Number(purchaseIncAmt) / (1 + (Number(tax)) / Number(100)));
                            let purchaseExcamtBasedIncfix = purchaseExcamtBasedInc?.toFixed(0);
                            //selling price exclusive purchase price inclusive unit cost
                            let sellingvalue = (Number(purchaseincamtfix) * (Number(value.margin) / 100));
                            let sellingIncludevalue = Number(purchaseincamtfix) + Number(sellingvalue);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: value.enteramt };
                                return allItems;
                            });
                            return { ...value, [productInputName]: inputValue, pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingIncludevalue?.toFixed(0)) };
                        } else if (value.sellingpricetax == "Inclusive") {
                            let purchaseIncAmt = Number(value.enteramt == "" || 0 ? 0 : value.enteramt);
                            let purchaseincamtfix = purchaseIncAmt?.toFixed(0);
                            let tax = taxRate ? taxRate.taxrate == undefined ? 0 : taxRate?.taxrate == "" ? 0 : taxRate?.taxrate : taxRate?.taxrate;
                            let purchaseExcamtBasedInc = Number(purchaseIncAmt) / Number(1 + (Number(tax) / 100));
                            let purchaseExcamtBasedIncfix = purchaseExcamtBasedInc?.toFixed(0);
                            //selling price inclusive purchase price inclusive unit cost
                            let sellingvaluemargin = (Number(purchaseExcamtBasedIncfix) * (Number(value.margin == "" || 0 ? 0 : value.margin) / 100));
                            let sellingExmargin = Number(purchaseExcamtBasedIncfix) + Number(sellingvaluemargin);
                             let taxhsn = value?.hsntax == undefined ? 0 : value?.hsntax == "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined ? 0 : value?.applicabletaxrate == "" ? 0 : value?.applicabletaxrate;
                            let taxvalue = Number(sellingExmargin) * Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100);
                            let sellingvaluetax = (Number(sellingExmargin) * Number(taxvalue));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: value.enteramt };
                                return allItems;
                            });
                            return { ...value, [productInputName]: inputValue, pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) };
                        }
                    }
                }
                else if (reference == "Enteramt") {
                    if (value.purchasetabletax == "Exclusive") {
                        if (value.sellingpricetax == "Exclusive") {
                            let purchaseExtAmt = Number(inputValue);
                            let purchaseextamtfixed = purchaseExtAmt?.toFixed(0);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvalue = (Number(purchaseextamtfixed) * (Number(value.margin) / 100));
                            let sellingExcludevalue = Number(purchaseextamtfixed) + Number(sellingvalue);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: inputValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity };
                                return allItems;
                            });

                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantity == "" || 0 ? 1 : value.quantity)

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: 0, differenceamt: 0, ratebydismod: netCost?.toFixed(0), quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), purchaseexcludetax: purchaseextamtfixed, pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(purchaseextamtfixed), sellingpriceunitcost: Number(sellingExcludevalue?.toFixed(0)) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(netCost) - Number(value.disvaluemod);
                                let differenceValue = Number(netCost) - discountValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), purchaseexcludetax: purchaseextamtfixed, pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(purchaseextamtfixed), sellingpriceunitcost: Number(sellingExcludevalue.toFixed(0)) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let differenceValue = Number(netCost) * (Number(value.disvaluemod) / 100);
                                let discountValue = Number(netCost) - differenceValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), purchaseexcludetax: purchaseextamtfixed, pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(purchaseextamtfixed), sellingpriceunitcost: Number(sellingExcludevalue.toFixed(0)) }
                            }

                        } else if (value.sellingpricetax == "Inclusive") {
                            let purchaseExtAmt = Number(inputValue);
                            let purchaseextamtfixed = purchaseExtAmt?.toFixed(0);
                            //selling price inclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseextamtfixed) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseextamtfixed) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined ? 0 : value?.hsntax == "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined ? 0 : value?.applicabletaxrate == "" ? 0 : value?.applicabletaxrate;
                            let sellingvaluetax = (Number(sellingExmargin) * Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: inputValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity };
                                return allItems;
                            });
                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantity == "" || 0 ? 1 : value.quantity)

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: 0, differenceamt: 0, ratebydismod: netCost?.toFixed(0), quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), purchaseexcludetax: purchaseextamtfixed, pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(purchaseextamtfixed), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(netCost) - Number(value.disvaluemod);
                                let differenceValue = Number(netCost) - discountValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantityy, purchasenetcost: netCost?.toFixed(0), purchaseexcludetax: purchaseextamtfixed, pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(purchaseextamtfixed), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let differenceValue = Number(netCost) * (Number(value.disvaluemod) / 100);
                                let discountValue = Number(netCost) - differenceValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), purchaseexcludetax: purchaseextamtfixed, pruchaseincludetax: "", incalpha: "", excalpha: getAlphaRate(purchaseextamtfixed), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) }
                            }
                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if (value.sellingpricetax == "Exclusive") {
                            let purchaseIncAmt = Number(inputValue);
                            let purchaseincamtfix = purchaseIncAmt.toFixed(0);
                            let tax = taxRate ? taxRate.taxrate == undefined ? 0 : taxRate?.taxrate == "" ? 0 : taxRate?.taxrate : taxRate?.taxrate;
                            let purchaseExcamtBasedInc = Number(purchaseIncAmt) / Number(1 + (Number(tax) / 100));
                            let purchaseExcamtBasedIncfix = purchaseExcamtBasedInc?.toFixed(0);
                            //selling price exclusive purchase price inclusive unit cost
                            let sellingvalue = (Number(purchaseincamtfix) * (Number(value.margin) / 100));
                            let sellingIncludevalue = Number(purchaseincamtfix) + sellingvalue;
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: inputValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity };
                                return allItems;
                            });

                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantity == "" || 0 ? 1 : value.quantity)

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: 0, differenceamt: 0, ratebydismod: netCost?.toFixed(0), quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingIncludevalue?.toFixed(0)) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(netCost) - Number(value.disvaluemod);
                                let differenceValue = Number(netCost) - discountValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingIncludevalue?.toFixed(0)) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let differenceValue = Number(netCost) * (Number(value.disvaluemod) / 100);
                                let discountValue = Number(netCost) - differenceValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingIncludevalue?.toFixed(0)) }
                            }

                        } else if (value.sellingpricetax == "Inclusive") {
                            let purchaseIncAmt = Number(inputValue);
                            let purchaseincamtfix = Number(purchaseIncAmt)?.toFixed(0);
                            let tax = taxRate ? taxRate.taxrate == undefined ? 0 : taxRate?.taxrate == "" ? 0 : taxRate?.taxrate : taxRate?.taxrate;
                            let purchaseExcamtBasedInc = Number(purchaseIncAmt) / (1 + (Number(tax) / 100));
                            let purchaseExcamtBasedIncfix = Number(purchaseExcamtBasedInc)?.toFixed(0);
                            //selling price inclusive purchase price inclusive unit cost
                            let sellingvaluemargin = (Number(purchaseExcamtBasedIncfix) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseExcamtBasedIncfix) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined ? 0 : value?.hsntax == "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined ? 0 : value?.applicabletaxrate == "" ? 0 : value?.applicabletaxrate;
                            let taxvalue = Number(sellingExmargin) * Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100);
                            let sellingvaluetax = (Number(sellingExmargin) * Number(taxvalue));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            setAlltotalItems((alltotalitems) => {
                                let allItems = [...alltotalitems];
                                allItems[indexInput] = { ...totalItem, enteramt: inputValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity };
                                return allItems;
                            });
                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantity == "" || 0 ? 1 : value.quantity)

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: 0, differenceamt: 0, ratebydismod: netCost?.toFixed(0), quantit: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(netCost) - Number(value.disvaluemod);
                                let differenceValue = Number(netCost) - discountValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let differenceValue = Number(netCost) * (Number(value.disvaluemod) / 100);
                                let discountValue = Number(netCost) - differenceValue;
                                return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue, quantity: value.quantity == "" || 0 ? 1 : value.quantity, purchasenetcost: netCost?.toFixed(0), pruchaseincludetax: purchaseincamtfix, purchaseexcludetax: purchaseExcamtBasedIncfix, excalpha: getAlphaRate(purchaseExcamtBasedIncfix), incalpha: getAlphaRateInc(purchaseincamtfix), sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) }
                            }

                        }
                    }
                }
                else if (reference == "Quantity") {

                    if (value.purchasetabletax == "Exclusive" && value.purchaseexcludetax) {
                        let netCost = Number(value.purchaseexcludetax) * Number(inputValue)
                        setAlltotalItems((alltotalitems) => {
                            let allItems = [...alltotalitems];
                            allItems[indexInput] = { ...totalItem, quantity: inputValue };
                            return allItems;
                        });
                        return { ...value, [productInputName]: inputValue, purchasenetcost: netCost?.toFixed(0), ratebydismod: netCost?.toFixed(0) };
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        let netCost = Number(value.pruchaseincludetax) * Number(inputValue)
                        setAlltotalItems((alltotalitems) => {
                            let allItems = [...alltotalitems];
                            allItems[indexInput] = { ...totalItem, quantity: inputValue };
                            return allItems;

                        })
                        return { ...value, [productInputName]: inputValue, purchasenetcost: netCost?.toFixed(0), ratebydismod: netCost?.toFixed(0) };
                    }
                }
                else if (reference == "Discountmode") {
                    if (inputValue == "None") {
                        return { ...value, [productInputName]: inputValue, disvaluemod: 0, differenceamt: 0, ratebydismod: value.purchasenetcost, }
                    }
                    else if ((inputValue == "Fixed" || inputValue == "Amount") && value.purchasenetcost) {
                        let discountValue = Number(value.purchasenetcost) - Number(value.disvaluemod);
                        let differenceValue = Number(value.purchasenetcost) - discountValue;
                        return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue }
                    }
                    else if (inputValue == "Percentage" && value.purchasenetcost) {
                        let differenceValue = Number(value.purchasenetcost) * (Number(value.disvaluemod) / 100);
                        let discountValue = Number(value.purchasenetcost) - differenceValue;
                        return { ...value, [productInputName]: inputValue, disvaluemod: value.disvaluemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue }
                    }
                }
                else if (reference == "Discountvalue") {
                    if (value.distypemod == "None") {
                        return { ...value, [productInputName]: inputValue, distypemod: value.distypemod, differenceamt: 0, ratebydismod: value.purchasenetcost }
                    }
                    else if ((value.distypemod == "Fixed" || value.distypemod == "Amount") && value.purchasenetcost) {
                        let discountValue = Number(value.purchasenetcost) - Number(inputValue);
                        let differenceValue = Number(value.purchasenetcost) - discountValue;
                        return { ...value, [productInputName]: inputValue, distypemod: value.distypemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue }
                    }
                    else if (value.distypemod == "Percentage" && value.purchasenetcost) {
                        let differenceValue = Number(value.purchasenetcost) * (Number(inputValue) / 100);
                        let discountValue = Number(value.purchasenetcost) - differenceValue;
                        return { ...value, [productInputName]: inputValue, distypemod: value.distypemod, ratebydismod: discountValue?.toFixed(0), differenceamt: differenceValue }
                    }
                }
                else if (reference == "Free") {
                    setAlltotalItems((alltotalitems) => {
                        let allItems = [...alltotalitems];
                        allItems[indexInput] = { ...totalItem, freeitem: inputValue };
                        return allItems;

                    });
                }
                else if (reference == "Margin data") {
                    //purchase inclusive
                    if (value.purchasetabletax == "Exclusive") {
                        if (value.sellingpricetax == "Exclusive") {
                            let purchaseExtAmt = Number(value?.enteramt == 0 || "" ? 0 : value.enteramt);
                            let purchaseextamtfixed = purchaseExtAmt?.toFixed(0);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvalue = (Number(purchaseextamtfixed) * (Number(inputValue) / 100));
                            let sellingExcludevalue = Number(purchaseextamtfixed) + Number(sellingvalue);

                            return { ...value, [productInputName]: inputValue, sellingpriceunitcost: Number(sellingExcludevalue?.toFixed(0)) };
                        } else if (value.sellingpricetax == "Inclusive") {
                            let purchaseExtAmt = Number(value.enteramt == 0 || "" ? 0 : value.enteramt);
                            let purchaseextamtfixed = purchaseExtAmt?.toFixed(0);
                            //selling price inclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseextamtfixed) * (Number(inputValue) / 100));
                            let sellingExmargin = Number(purchaseextamtfixed) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined ? 0 : value?.hsntax == "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined ? 0 : value?.applicabletaxrate == "" ? 0 : value?.applicabletaxrate;
                            let sellingvaluetax = (Number(sellingExmargin) * Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);

                            return { ...value, [productInputName]: inputValue, sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) };
                        }
                    }
                    //purchase exclusive
                    else if (value.purchasetabletax == "Inclusive") {
                        if (value.sellingpricetax == "Exclusive") {
                            let purchaseIncAmt = Number(value.enteramt == 0 || "" ? 0 : value.enteramt);
                            let purchaseincamtfix = purchaseIncAmt?.toFixed(0);
                            //selling price exclusive purchase price inclusive unit cost
                            let sellingvalue = (Number(purchaseincamtfix) * (Number(value.margin) / 100));
                            let sellingIncludevalue = Number(purchaseincamtfix) + sellingvalue;

                            return { ...value, [productInputName]: inputValue, sellingpriceunitcost: Number(sellingIncludevalue?.toFixed(0)) };
                        } else if (value.sellingpricetax == "Inclusive") {
                            let purchaseIncAmt = Number(value.enteramt);
                            let purchaseincamtfix = purchaseIncAmt?.toFixed(0);
                            let tax = taxRate ? taxRate.taxrate == undefined ? 0 : taxRate?.taxrate == "" ? 0 : taxRate?.taxrate : taxRate?.taxrate;
                            let purchaseExcamtBasedInc = purchaseIncAmt / Number(1 + (Number(tax) / 100));
                            let purchaseExcamtBasedIncfix = purchaseExcamtBasedInc?.toFixed(0);
                            //selling price inclusive purchase price inclusive unit cost
                            let sellingvaluemargin = (Number(purchaseExcamtBasedIncfix) * (Number(inputValue) / 100));
                            let sellingExmargin = Number(purchaseExcamtBasedIncfix) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined ? 0 : value?.hsntax == "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined ? 0 : value?.applicabletaxrate == "" ? 0 : value?.applicabletaxrate;
                            let sellingvaluetax = (Number(sellingExmargin) * ((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);

                            return { ...value, [productInputName]: inputValue, sellingpriceunitcost: Number(sellingExcludevaluetax?.toFixed(0)) };
                        }
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
            return Number(totalvalue?.toFixed(0));
        }
    }

    let balanceamtval = Number(purchaseAdd.billamount) ? Number(purchaseAdd.billamount) : 0;
    balanceamt = (balanceamtval ? balanceamtval : 0) - (Number(totalNetCostCalc()) ? Number(totalNetCostCalc()) : 0)

    // total quantity and free item calculation
    let totalitem = 0.00;
    {
        allProductsList && (
            allProductsList.forEach(
                (item => {
                    totalitem += +item.quantity + +item.freeitem
                })
            ))
    }

    function payDueCalc() {
        setPurchaseAdd(
            { ...purchaseAdd, paydue: totalNetCostCalc() == undefined ? 0 : Number(totalNetCostCalc()) - Number(purchaseAdd.payamount) }
        )
    }

    useEffect(
        () => {
            payDueCalc();
        }, [purchaseAdd]
    )

    // Delete Searched Product
    const deleteRow = (i, e) => {
        setAllProductsList(allProductsList.filter((v, item) => item !== i));
    }

    return (
        <Box>
            <Headtitle title={'Purchase Add'} />
            <form onSubmit={handleSubmit}>
                <Typography sx={userStyle.HeaderText}>Add Purchase</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Supplier <b style={{ color: "red" }}> *</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><PersonOutlineOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Selects
                                        options={suppliers}
                                        styles={colourStyles}
                                        onChange={(e) => {
                                            setPurchaseAdd({
                                                ...purchaseAdd, supplier: e.value, referenceno: purchases,
                                            }); searchAdd(e._id)
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons} style={{ paddingRight: '5px' }}>
                                    <Purchasesupplieradd setIsSupplierFetch={setIsSupplierFetch} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Reference No</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={purchases}
                                    name="referenceno"
                                />
                            </FormControl>
                            <Typography variant='body2' sx={{ opacity: '0.9', marginTop: '5px' }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Purchase Date</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.purchasedate}
                                    type="date"
                                    onChange={(e) => { setPurchaseAdd({...purchaseAdd, purchasedate:e.target.value}) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Bill Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.billamount}
                                    type="number"
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, billamount: e.target.value, businesslocation: setngs?.businesslocation }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    placeholder={isBusilocations ? isBusilocations.name : ""}
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, businesslocation: e.value });  }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Purchase Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={purchaseAdd.purchasetaxmode}
                                    onChange={(e) => {setPurchaseAdd({ ...purchaseAdd, purchasetaxmode: e.target.value })}}
                                    fullWidth
                                >
                                    <MenuItem value="None" >None</MenuItem>
                                    <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                    <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Invoice No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.invoiceno}
                                    placeholder='Enter invoice number'
                                    type="text"
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, invoiceno: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        {files.length < 1 ? (
                            <Grid item md={3} sm={6} xs={12}>
                                <InputLabel >Upload Documents</InputLabel>
                                {!files.length > 0 && <> <Button variant="outlined" component="label" sx={userStyle.uploadFileBtn} style={{ justifyContent: "center !important" }}>
                                    {!files.length > 0 && <div> <CloudUploadIcon sx={{ paddingTop: '5px' }} /> &ensp;<span style={{ paddingBottom: '14px' }}>Upload Documents</span></div>}
                                    <input hidden type="file" onChange={handleFileUpload} />
                                </Button>
                                </>}
                            </Grid>
                        ):
                            (
                                <>
                                    <br />
                                    <Grid item md={3} sm={6} xs={12} sx={{ padding: '10px', display: "flex", justifyContent: "center" }}>
                                        {files &&
                                            (files.map((file, index) => (
                                                <>
                                                    <Grid item md={1} xs={11} sm={11}>
                                                        <Typography><a style={{ color: "#357ae8" }}
                                                            href={`data:application/octet-stream;base64,${file.data}`}
                                                            download={file.name}
                                                        >
                                                            {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                                ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                                    ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                        ((file.name).split(".")[1] === "docx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                            <img src={`data:application/octet-stream;base64,${file.data}`} style={{ width: '80px', height: '80px' }} />}
                                                        </a></Typography>
                                                    </Grid>
                                                    <Grid item md={1} xs={1} sm={1} >
                                                        <Typography><Button onClick={() => handleFileDelete(index)} size="small" sx={{ marginLeft: "40px", marginTop: "-12px" }} ><DeleteIcon /></Button>  </Typography>
                                                    </Grid>
                                                </>
                                            )))}
                                    </Grid>
                                </>
                            )}
                    </Grid><br />
                    <Grid container spacing={3}>
                        <Grid item md={8} sm={8} xs={12}>
                            <Typography variant='subtitle1'>
                                <b>Address:</b> <br />
                                {supplier.addressone == null || supplier.addressone == undefined ? "" : supplier.addressone + ","}
                                {supplier.addresstwo == null || supplier.addresstwo == undefined ? "" : " " + supplier.addresstwo + ","}
                                {supplier.country == null || supplier.country == undefined ? "" : " " + supplier.country + ","}
                                {supplier.state == null || supplier.state == undefined ? "" : " " + supplier.state + ","}
                                {supplier.city == null || supplier.city == undefined ? "" : " " + supplier.city + " " + "-"}
                                {supplier.pincode == null || supplier.pincode == undefined ? "" : " " + supplier.pincode + ","}<br />
                                {supplier.phoneone == null || supplier.phoneone == undefined ? "" : " " + "Ph" + " " + ": " +" " + +supplier.phoneone}
                                <br />
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel >Balance:-</InputLabel>
                            <Typography value={purchaseAdd.balance}
                                style={{ color: 'red', fontSize: '20px' }}
                            > {balanceamt == NaN ? 0 : balanceamt}</Typography>
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
                                        styles={colourStyles}
                                        placeholder="Enter Product Name / SKU "
                                        options={productsList}
                                        onChange={(e) => {
                                            gethsncode(e)
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Purchaseproductadd setFetchsaveproduct={setFetchsaveproduct} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                        <Table aria-label="customized table">
                            <TableHead >
                                <StyledTableRow >
                                    <TableCell sx={userStyle.tableHead1}>Product</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Lot Number</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Tax</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Unit Cost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Quantity</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Netcost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Selling Price Unit Cost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></TableCell>
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
                                                                <Typography variant='body2'>Product Name <b style={{ color: "red" }}> *</b></Typography>
                                                                <TextField size='small' value={data?.prodname} />
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
                                                                <TextField size='small'
                                                                    value={data?.lotnumber}
                                                                    onChange={(e) => {
                                                                        productUserInput(i, "lotnumber", e.target.value, "Lotnumber")
                                                                    }}
                                                                />
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
                                                                <InputLabel >Purchase Tax</InputLabel>
                                                                <FormControl size="small" fullWidth>
                                                                    <Select
                                                                        value={data?.purchasetabletax}
                                                                        onChange={(e) => productUserInput(i, "purchasetabletax", e.target.value, "purchasetablechange")}
                                                                        MenuProps={{
                                                                            PaperProps: {
                                                                                style: {
                                                                                    maxHeight: 200
                                                                                },
                                                                            },
                                                                        }}
                                                                        fullWidth
                                                                    >
                                                                        <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                        <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            {data?.purchasetabletax == "Inclusive" ? (
                                                                <Grid item md={12}>
                                                                    <InputLabel >Purchase Tax</InputLabel>
                                                                    <FormControl size="small" fullWidth>
                                                                        <Select
                                                                            MenuProps={{
                                                                                PaperProps: {
                                                                                    style: {
                                                                                        maxHeight: 200
                                                                                    },
                                                                                },
                                                                            }}

                                                                            value={data?.purchasetax}
                                                                            onChange={(e) => {
                                                                                productUserInput(i, "purchasetax", e.target.value, "taxchange")
                                                                            }}
                                                                        >
                                                                            <MenuItem value="None">None</MenuItem>
                                                                            {taxrates && (
                                                                                taxrates.map((row, index) => (
                                                                                    <MenuItem value={row.taxname || row.hsn} key={index} onClick={(e) => {
                                                                                        searchTax(row._id);
                                                                                    }
                                                                                    }
                                                                                    >{row.taxname || row.hsn}</MenuItem>
                                                                                ))
                                                                            )}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                            ) : null}
                                                            <Grid item md={12}>
                                                                <Typography variant='body2'>Enter Amt</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField size='small'
                                                                        sx={{
                                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                // width: '80px'
                                                                            }
                                                                        }}
                                                                        type='number'
                                                                        value={data?.enteramt}
                                                                        onChange={(e) => {
                                                                            productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography variant='body2'>Margin %</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField size='small'
                                                                        sx={{
                                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                // width: '80px'
                                                                            }
                                                                        }}
                                                                        type='number'
                                                                        value={data?.margin}
                                                                        onChange={(e) => {
                                                                            productUserInput(i, "margin", e.target.value, "Margin data")
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <InputLabel >Exc Tax</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.purchaseexcludetax}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Alphaarate</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.excalpha}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Inc Tax</InputLabel>
                                                                <TextField size='small'
                                                                    type="text"
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.pruchaseincludetax}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Alphaarate</InputLabel>
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
                                                                <InputLabel >Quantity</InputLabel>
                                                                <TextField size='small'
                                                                    type="number"
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.quantity}
                                                                    onChange={(e) => {
                                                                        productUserInput(i, "quantity", e.target.value, "Quantity"); setPurchaseAdd({ ...purchaseAdd, nettotal: Number(totalNetCostCalc()) })
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12} style={{ width: "auto !important" }} >
                                                                <InputLabel >Free Item</InputLabel>
                                                                <TextField size='small'
                                                                    type='number'
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.freeitem}
                                                                    onChange={(e) => productUserInput(i, "freeitem", e.target.value, "Free")}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <InputLabel >Netcost</InputLabel>
                                                                <TextField size='small'
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.purchasenetcost}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Discount type</InputLabel>
                                                                <FormControl size="small" fullWidth>
                                                                    <Select


                                                                        value={data?.distypemod}
                                                                        onChange={(e) => productUserInput(i, "distypemod", e.target.value, "Discountmode")}
                                                                    >
                                                                        <MenuItem value="None">None</MenuItem>
                                                                        <MenuItem value="Fixed">Fixed</MenuItem>
                                                                        <MenuItem value="Amount" >Amount</MenuItem>
                                                                        <MenuItem value="Percentage">Percentage</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <InputLabel >Disc.Val</InputLabel>
                                                                <TextField size='small'
                                                                    type="number"
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                        }
                                                                    }}
                                                                    value={data?.disvaluemod}
                                                                    onChange={(e) => productUserInput(i, "disvaluemod", e.target.value, "Discountvalue")}
                                                                />
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <InputLabel >Disc.Amt</InputLabel>
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
                                                                <InputLabel >Netcost (After Discount)</InputLabel>
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
                                                            <InputLabel >Selling Price Tax</InputLabel>
                                                            <FormControl size="small" fullWidth >
                                                                <OutlinedInput
                                                                    value={data?.sellingpricetax}
                                                                    fullWidth
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12}>
                                                                <InputLabel >Selling price unit tax</InputLabel>
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
                    <Grid container>
                        <Grid item xs={6} sm={6} md={8} lg={8}>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={4}>
                            <Typography variant="subtitle1"><b>Total items:</b>{totalitem}</Typography>
                            <Typography variant="subtitle1"
                                value={purchaseAdd.nettotal}
                                onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, nettotal: totalNetCostCalc() }) }}
                            ><b> Net Total Amount:</b> ₹ {totalNetCostCalc()}</Typography>
                        </Grid>
                    </Grid>
                </Box><br />
                <Box sx={userStyle.container}>
                    {/* purchasestatus section start */}
                    <Grid container>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Purchase Status</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={purchaseAdd.purchasestatus}
                                    onChange={(e) => {
                                        setPurchaseAdd({ ...purchaseAdd, purchasestatus: e.target.value });
                                        purchaseStatusInput(e.target.value);
                                    }}
                                >
                                    <MenuItem value={purchaseStatusPending}>{purchaseStatusPending}</MenuItem>
                                    <MenuItem value={purchaseStatusReceived}>{purchaseStatusReceived}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid><br />
                {/* purchase status section end */}
                    {purchaseAdd.purchasestatus == "Received" ?
                        (
                            <>
                                <Typography variant="h6" >Add payment</Typography>
                                <Grid container spacing={3} sx={userStyle.textInput}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography variant="body2" ><b>Advance Balance:</b> ₹ {purchaseAdd.advancebalance}</Typography>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel htmlFor="component-outlined">Amount <b style={{ color: "red" }}> *</b></InputLabel>
                                        <Grid sx={{ display: 'flex' }}  >
                                            <Grid sx={userStyle.spanIconTax}><MoneyOutlinedIcon style={{ fontSize: 'large' }} /></Grid>
                                            <FormControl size="small" fullWidth >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={purchaseAdd.payamount}
                                                    onChange={(e) => {
                                                        setPurchaseAdd({
                                                            ...purchaseAdd, payamount: e.target.value
                                                        })
                                                    }}
                                                    type='number'
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12} >
                                        <InputLabel htmlFor="component-outlined">Paid Date:<b style={{ color: "red" }}> *</b></InputLabel>
                                        <Grid sx={{ display: 'flex' }}  >
                                            <FormControl size="small" fullWidth >
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        renderInput={(props) => <TextField {...props} />}
                                                        value={paidDateTime}
                                                        onChange={(newValue) => {
                                                            setPaidDateTime(newValue);
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel >Payment Method</InputLabel>
                                        <FormControl size="small" fullWidth>
                                            <Select


                                                value={purchaseAdd.paymentmethod}
                                                onChange={(e) => {
                                                    setPurchaseAdd({ ...purchaseAdd, paymentmethod: e.target.value });
                                                }}
                                            >
                                                <MenuItem value="None">None</MenuItem>
                                                <MenuItem value="Cash">Cash</MenuItem>
                                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                                <MenuItem value="UPI">UPI</MenuItem>
                                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                <MenuItem value="Net Banking">Net Banking</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <InputLabel id="demo-select-small" sx={{ m: 1 }}>Payment Note</InputLabel>
                                        <FormControl size="small" fullWidth >
                                            <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                                value={purchaseAdd.additionalnotes}
                                                onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, additionalnotes: e.target.value, }) }}
                                            />
                                        </FormControl><br /><br />
                                        <hr />
                                    </Grid>
                                    <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                                        <Grid>
                                            <Typography variant='subtitle1'
                                                value={purchaseAdd.paydue}
                                            ><b>Payment due:</b> ₹ {purchaseAdd.paydue}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        ) : null
                    }
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid sx={{display:'flex'}}>
                            <Button sx={userStyle.buttonadd} type="submit">SAVE</Button>
                            <Link to="/purchase/purchase/list"><Button sx={userStyle.buttoncancel} type="button">CANCEL</Button></Link>
                        </Grid>
                    </Grid>
                    <br />
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

const Purchasecreate = () => {
    return (
        <>
            <Box>
                <Navbar /><br /><br /><br /><br />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" className='content'>
                        <Purchasecreatelist /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Purchasecreate;
