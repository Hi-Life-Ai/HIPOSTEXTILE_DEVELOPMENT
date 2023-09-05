import React, { useEffect, useState, useContext , useRef} from 'react';
import { userStyle, colourStyles } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Select, MenuItem, Paper, TextareaAutosize, TableCell, Dialog, DialogContent, DialogActions, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FaSearch } from "react-icons/fa";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import Purchasesupplieradd from './Purchasesupplieradd';
import Purchaseproductadd from './Purchaseproductadd';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { AiOutlineClose } from "react-icons/ai";
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Selects from "react-select";
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import 'react-quill/dist/quill.snow.css';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

const Purchaseeditlist = () => {
    const [purchase, setPurchase] = useState({
        supplier: "", purchasetaxmode: "", discounttypemode: "None", purchasetaxlabmode: "", purchasestatus: "", paymentmethod: "", businesslocation: "", nattotal: 0.0, expenseamount: "", freightamount: "", totalamount: "",
    });
    const { auth, setngs } = useContext(AuthContext);

    const [suppliers, setSuppliers] = useState([]);
    const [busilocations, setBusilocations] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});
    const [fetchsaveproduct, setFetchsaveproduct] = useState("");
    const [taxrates, setTaxrates] = useState([]);
    const [taxRate, setTaxRate] = useState(0);
    const [productsList, setProductsList] = useState([]);
    const [alpha, setAlpha] = useState("");
    const [isSupplierFetch, setIsSupplierFetch] = useState("");
    const [allUnits, setAllUnits] = useState([])
    const [groupUnit, setGroupUnit] = useState({ quantity: 0, unitgrouping: "", subquantity: 0 })
    const [isQuantity, setIsQuantity] = useState(false);
    //role access
    const { isUserRoleAccess, allLocations, isActiveLocations, allProducts, allTaxratesGroup, allTaxrates } = useContext(UserRoleAccessContext);

    // paid date
    const [paidDateTime, setPaidDateTime] = useState(dayjs());

    let purchaseStatusPending = "Pending";
    let purchaseStatusReceived = "Received";

    // produts list for add purchase data into db
    const productInputs = {
        produniqid: "", prodname: "", supplier: "", suppliershortname: "", date: "", sku: "", hsn: "", hsntax: "", applicabletax: "",
        applicabletaxrate: "", lotnumber: "", purchasetabletax: "None", purchasetax: "None", purchasetaxrate: "", sellingpricetax: "", enteramt: 0, margin: "",
        purchaseexcludetax: "", pruchaseincludetax: "", excalpha: "", incalpha: "", quantity: 1,
        quantityunit: "None", quantitynitpiece: "", quantitysubunitpieces: 1, quantitytotalpieces: 1, quantityunitstatus: false, freeitem: 0, freeitemunit: "None", freeitemtotalpieces: 0,
        freeitemunitstatus: false, freeitemnitpiece: "", freeitemsubunitpieces: 1, netcostafterdiscount: "", netcostbeforediscount: "", netcosttaxamount: 0, netcostwithtax: 0, unitcostbeforediscount: "",
        unitcostafterdiscount: "", unitcosttaxamount: "", unitcostwithtax: "", purchasenetcost: "", purchasenetcosttax: "", purchasenetcostaftertax: "",
        distypemod: "None", disvaluemod: "", differenceamt: "", subtaxs: [], ratebydismod: "", sellingpriceunitcost: "", sellingpriceunitwithoutcost: "", saletaxamount: ""
    }
    const [allProductsList, setAllProductsList] = useState([]);
    const targetTextFieldRef = useRef(null);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => {
        setIsErrorOpen(true);
    };
    const handleClose = () => {
        setIsErrorOpen(false);
    };

    let totalalltaxamt = 0;
    let totalvalue = Number(0);
    let totalitem = 0.00;
    let totalvalues = 0.00;

    //Quantity popup model
    const [isQuantityOpen, setIsQuantityOpen] = useState(false);

    const handleQuantityOpen = () => {
        setIsQuantityOpen(true);
    };
    const handleQuantityClose = () => {
        setIsQuantityOpen(false);
    };

    //product already added view popup
    const [isAlreadyAddedProducts, setIsAlreadyAddedProducts] = useState({ applicabletaxrate: "", taxratevalue: 0, prodname: "", hsn: "", applicabletax: "", hsncode: "", sku: "", produniqid: "", sellingpricetax: "" })
    const [isProductAddedOpen, setIsProductAddedOpen] = useState(false);
    const handleProductAddedOpen = () => { setIsProductAddedOpen(true); };
    const handleProductAddedClose = () => { setIsProductAddedOpen(false); };


    //Store popup model
    const [isStoreOpen, setIsStoreOpen] = useState(false);

    const handleStoreOpen = () => {
        setIsStoreOpen(true);
    };
    const handleStoreClose = () => {
        setIsStoreOpen(false);
    };

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const id = useParams().id;
   
    //calculation view popup
    const [show, setShow] = useState([]);
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRowDetails = (rowIndex) => {
        if (expandedRow === rowIndex) {
            setExpandedRow(null);
        } else {
            setExpandedRow(rowIndex);
        }
    };

    //  File Upload
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event, index) => {
        const filesname = event.target.files;
        let newSelectedFiles = [...files];
        for (let i = 0; i < filesname.length; i++) {
            const file = filesname[i];
            // Check if the file is an image
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(',')[1]
                        // index: indexData
                    });
                    setFiles(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            }
            else {
                // Display an error message or take appropriate action for unsupported file types
                toast.error('Unsupported file type. Only images and PDFs are allowed.');
            }
        }
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const handleFileDelete = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

    //  Fetch Single Purchase by id
    const fetchHandlers = async () => {
        try {
            let req = await axios.get(`${SERVICE.PURCHASE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setPurchase(req?.data?.spurchse)
            setAllProductsList(req?.data?.spurchse?.products?.reverse());
            setFiles(req?.data?.spurchse?.files);
            setTaxRate(req?.data?.spurchse?.overalltaxrate)
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

    useEffect(
        () => {
            getAllTax();
            fetchUnits();
        }, []
    )

    const getAllTax = async () => {
        try {

            setTaxrates(allTaxratesGroup);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // funtion for autofocus
    const handleInputChange = () => {
        setTimeout(() => {
          targetTextFieldRef.current?.focus();
        }, 0);
      };

    // add hsn to the product list data
    const gethsncode = async (e) => {
        setIsAlreadyAddedProducts({ applicabletaxrate: "", taxratevalue: 0, prodname: "", hsn: "", applicabletax: "", hsncode: "", sku: "", produniqid: "", sellingpricetax: "" });
        try {
            let taxRateData = allTaxrates?.filter((data) => {
                if (data.hsn + '@' + data.taxrate == e.hsncode) {
                    return data
                } else if (data.taxname + '@' + data.taxrate == e.applicabletax) {
                    return data
                }
            });
            setIsAlreadyAddedProducts({ ...productInputs, produniqid: e._id, applicabletax: e.applicabletax == "" || e.applicabletax == undefined || e.applicabletax == "None" ? "" : e.applicabletax, applicabletaxrate: e.applicabletax == "" || e.applicabletax == undefined || e.applicabletax == "None" ? 0 : taxRateData[0]?.taxrate, hsntax: e.hsn == "" || e.hsn == undefined || e.hsn == "None" ? 0 : taxRateData[0]?.taxrate, prodname: e.productname, sku: e.sku, hsn: e.hsn == "" || e.hsn == undefined || e.hsn == "None" ? "" : e.hsn, sellingpricetax: e.sellingpricetax})
            let isAlreadyAdded = false;
            let addedproductId = allProductsList.map((item) => {
                if (e.sku == item.sku) {
                    isAlreadyAdded = true
                    handleProductAddedOpen();
                    return { ...item }
                } else {
                    return item
                }
            })
            if (isAlreadyAdded) {
                setAllProductsList(addedproductId)
            } else {
                setAllProductsList((productslistdata) => {
                    return [{ ...productInputs, produniqid: e._id, quantityunit: "Pieces", freeitemunit: "Pieces", distypemod: purchase.discounttypemode, disvaluemod: Number(purchase.discountvaluemode)?.toFixed(2), differenceamt: Number(purchase.discountamountmode)?.toFixed(2), suppliershortname: purchase.suppliershrtname, purchasetabletax: purchase.purchasetaxmode == "Inclusive" ? "Inclusive" : purchase.purchasetaxmode == "Exclusive" ? "Exclusive" : "None", purchasetaxrate: taxRate, purchasetax: purchase.purchasetaxlabmode, supplier: purchase.supplier, date: purchase.purchasedate, margin: setngs.dprofitpercent, applicabletax: e.applicabletax == "" || e.applicabletax == undefined || e.applicabletax == "None" ? "" : e.applicabletax, applicabletaxrate: e.applicabletax == "" || e.applicabletax == undefined || e.applicabletax == "None" ? 0 : taxRateData[0]?.taxrate, hsntax: e.hsn == "" || e.hsn == undefined || e.hsn == "None" ? 0 : taxRateData[0]?.taxrate, prodname: e.productname, sku: e.sku, hsn: e.hsn == "" || e.hsn == undefined || e.hsn == "None" ? "" : e.hsn, sellingpricetax: e.sellingpricetax }, ...productslistdata]
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

    const isAlreadyAddedProduct = () => {

        try {

            setAllProductsList((productslistdata) => {
                return [{ ...productInputs, produniqid: isAlreadyAddedProducts.produniqid, quantityunit: "Pieces", freeitemunit: "Pieces", distypemod: purchase.discounttypemode, disvaluemod: Number(purchase.discountvaluemode)?.toFixed(2), differenceamt: Number(purchase.discountamountmode)?.toFixed(2), suppliershortname: purchase.suppliershrtname, purchasetabletax: purchase.purchasetaxmode == "Inclusive" ? "Inclusive" : purchase.purchasetaxmode == "Exclusive" ? "Exclusive" : "None", purchasetaxrate: taxRate, purchasetax: purchase.purchasetaxlabmode, supplier: purchase.supplier, date: purchase.purchasedate, margin: setngs.dprofitpercent, applicabletax: isAlreadyAddedProducts.applicabletax, applicabletaxrate: isAlreadyAddedProducts.applicabletaxrate, hsntax: isAlreadyAddedProducts.hsntax, prodname: isAlreadyAddedProducts.prodname, sku: isAlreadyAddedProducts.sku, hsn: isAlreadyAddedProducts.hsn, sellingpricetax: isAlreadyAddedProducts.sellingpricetax }, ...productslistdata]
            });

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

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

    const fetchUnits = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setAllUnits(
                res.data.units.map((d) => ({
                    ...d,
                    label: d.unit,
                    value: d.unit,
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

    const fetchProducts = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            const productsListData = res?.data?.products?.map((d) => ({
                ...d,
                label: d.productname,
                value: d.productname,
            }));
            setProductsList(productsListData);
            return productsListData;
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Products
    const fetchLocations = async () => {
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

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // alpha
    const fetchAlpha = async () => {
        let res = await axios.post(SERVICE.ALPHARATEACTIVE, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            businessid: String(setngs.businessid)
        });

        setAlpha(res?.data?.alpharates);
    }

    // alpharate for exclude tax
    let gotalpha = "";
    const getAlphaRate = (inputValue) => {

        let a = String(inputValue);

        if (a.length == 1) {
            let alldata = { doubledigit: "" };
            let getalpha = alpha.slice(0).filter((data) => {
                alldata = data;
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
            return alldata.doubledigit + gotalpha

        } else if (a.length == 2) {
            let alldata = { singledigit: "" };
            let getalpha = alpha.slice(0).filter((data) => {
                alldata = data;
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
            return alldata.singledigit + gotalpha
        } else {
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
    }

    //alpharate include tax
    const getAlphaRateInc = (taxValue) => {
        let alphaValue = ""

        let a = String(taxValue);

        if (a.length == 1) {
            let alldata = { doubledigit: "" };
            let getalpha = alpha.slice(0).filter((data) => {
                alldata = data;
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
            return alldata.doubledigit + alphaValue;

        } else if (a.length == 2) {
            let alldata = { singledigit: "" };
            let getalpha = alpha.slice(0).filter((data) => {
                alldata = data;
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
            return alldata.singledigit + alphaValue;
        } else {
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
    }

    // Search Addressone
    const searchAdd = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.SUPPLIER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setPurchase({
                ...purchase, addressone: res?.data?.ssupplier?.addressone == null || res?.data?.ssupplier?.addressone == undefined ? "" : res?.data?.ssupplier?.addressone + "," + res?.data?.ssupplier?.addresstwo == null || res?.data?.ssupplier?.addresstwo == undefined ? "" : " " + res?.data?.ssupplier?.addresstwo + "," + res?.data?.ssupplier?.country == null || res?.data?.ssupplier?.country == undefined ? "" : " " + res?.data?.ssupplier?.country + "," + res?.data?.ssupplier?.state == null || res?.data?.ssupplier?.state == undefined ? "" : " " + res?.data?.ssupplier?.state + "," + res?.data?.ssupplier?.city == null || res?.data?.ssupplier?.city == undefined ? "" : " " + res?.data?.ssupplier?.city + " " + "-" + res?.data?.ssupplier?.pincode == null || res?.data?.ssupplier?.pincode == undefined ? "" : " " + res?.data?.ssupplier?.pincode + "," + res?.data?.ssupplier?.phoneone == null || res?.data?.ssupplier?.phoneone == undefined ? "" : " " + "Ph" + " " + ": " + " " + + res?.data?.ssupplier?.phoneone
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

    useEffect(
        () => {
            fetchSuppliers();
        }, [isSupplierFetch, suppliers]);

    useEffect(
        () => {
            fetchAlpha();
            fetchLocations();
        }, []);

    useEffect(
        () => {
            fetchProducts();
        }, [fetchsaveproduct, productsList]
    );

    const backPage = useNavigate();

    // compare bill amount net total then only purchase status changed and update currentstock
    const purchaseStatusInput = (value) => {
        if (value == "Received") {
            if (purchase.billamount == Number(totalNetValue())) {
                setPurchase({
                    ...purchase, purchasestatus: "Received"
                });
            } else {
                setPurchase({
                    ...purchase, purchasestatus: "Pending"
                });
                purchaseStatusReceived = "Pending";
                setShowAlert("Bill Amount and Net total didn't match");
                handleClickOpen();
            }
        }
    }

    const handleChangeTaxvalue = (taxvalue) => {
        setTaxRate(taxvalue);
    }

    const handleChangeTax = async (index, taxname, taxvalue, taxsubarray) => {

        await productUserInput(index, "purchasetax", taxname, "taxchange", 0, "", 0, taxvalue, taxsubarray);
    }

    const updatePurchase = async () => {

        // current stock when the user submit
        if (purchase.purchasestatus == "Received") {
            allProductsList.map((item, index) => {
                productsList.forEach((data, i) => {
                    if ((item.sku == data.sku)) {
                        axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                            currentstock: Number(data.currentstock) + Number(item.quantitytotalpieces) + Number(item.freeitemtotalpieces),
                            purchaseexcludetax: Number(item.purchaseexcludetax),
                            pruchaseincludetax: Number(item.pruchaseincludetax),
                            sellingexcludetax: Number(item.sellingpriceunitcost),
                            sellunitcostwithouttax: Number(item.sellingpriceunitwithoutcost)
                        });

                    }

                })

                fetchProducts();
            })
        }
        let allproductreverse = [...allProductsList.reverse()];
        try {
            let req = await axios.put(`${SERVICE.PURCHASE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                supplier: String(purchase.supplier),
                referenceno: String(purchase.referenceno),
                today: String(today),
                purchasedate: String(purchase.purchasedate),
                purchasestatus: String(purchase.purchasestatus),
                addressone: String(purchase.addressone),
                businesslocation: String(purchase.businesslocation),
                billamount: String(Number(purchase.billamount)?.toFixed(2)),
                freightamount: String(Number(purchase.freightamount)?.toFixed(2)),
                totalamount: String(Number(purchase.totalamount)?.toFixed(2)),
                expenseamount: String(Number(purchase.expenseamount)?.toFixed(2)),
                totaltaxamount: String(totalalltaxamt == NaN || totalalltaxamt == undefined ? '0.00' : Number(totalalltaxamt)?.toFixed(2)),
                invoiceno: String(purchase.invoiceno),
                purchasetaxmode: String(purchase.purchasetaxmode),
                purchasetaxlabmode: String(purchase.purchasetaxlabmode),
                discounttypemode: String(purchase.discounttypemode),
                discountvaluemode: String(Number(purchase.discountvaluemode)?.toFixed(2)),
                discountamountmode: String(Number(purchase.discountamountmode)?.toFixed(2)),
                overalltaxrate: String(taxRate),
                products: [...allproductreverse],
                additionalnotes: String(purchase.additionalnotes == undefined ? "" : purchase.additionalnotes),
                totalitem: String(totalitem),
                nettotal: String(Number(totalvalues)?.toFixed(2)),
                advancebalance: String(purchase.advancebalance),
                payamount: String(Number(purchase.payamount)?.toFixed(2)),
                paidon: String(paidDateTime),
                paymentmethod: String(purchase.paymentmethod),
                paydue: String(Number(Number(totalvalues) - Number(purchase.payamount))?.toFixed(2)),
                balance: String(Number(balanceamt)?.toFixed(2)),
                userbyadd: String(isUserRoleAccess.staffname),
                files: [...files]
            });
            setPurchase(req.data);
            toast.success(req.data.message, {
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
                } else if (messages == "The value of offset is out of range. It must be >= 0 && <= 17825792. Received 17825794") {
                    setShowAlert("Document Size Can't more than 5MB!");
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

    // Delete Searched Product
    const deleteRow = (i, e) => {
        setAllProductsList(allProductsList.filter((v, item) => item !== i));
    }

    // all tabel product tax calculation
    function productUserInput(indexInput, productInputName, inputValue, reference = "", unituantityvalue, unitstatus, unitsubquantity, taxratevalue, taxsubarray) {
        let userInputs = allProductsList.map((value, indexList) => {
            if (indexInput == indexList) {
                if (reference == "purchasetablechange") {
                    if (inputValue == "None") {
                        //quantity
                        let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                        let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                        let unitcostdisc = value.enteramt;

                        //selling price exclusive purchase price exclusive unit cost
                        let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                        let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                        let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                        let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                        let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                        let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                        let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                        let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                        let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                        let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                        //discount
                        if (value.distypemod == "None") {
                            return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                            let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amoount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Percentage") {
                            let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                            // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                            let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                            let differenceValue = Number(value.enteramt) + Number(disamt);

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                    }
                    else if (inputValue == "Inclusive") {
                        if (value.purchasetax == "None") {


                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Number(value.enteramt) + Number(disamt);

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = (Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);


                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseIn) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseIn) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftTax)?.toFixed(2), netcostbeforediscount: Number(netCostAftTax)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftTax)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseIn)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterdisc)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                    else if (inputValue == "Exclusive") {
                        if (value.purchasetax == "None") {


                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Number(value.enteramt) + Number(disamt);

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let purchaseincamtfix = Number(value.enteramt);
                            //selling
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn = Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);

                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);


                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostAftTax) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcostAftTax) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftDisc)?.toFixed(2), netcostbeforediscount: Number(netCostBefrDisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitcostAftTax)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));

                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);


                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "taxchange") {

                    if (value.purchasetabletax == "None") {
                        //quantity
                        let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                        let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                        let unitcostdisc = value.enteramt;

                        //selling price exclusive purchase price exclusive unit cost
                        let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                        let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                        let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                        let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                        let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                        let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                        let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                        let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                        let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                        let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                        //discount
                        if (value.distypemod == "None") {
                            return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                            let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amoount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Percentage") {
                            let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                            // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                            let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                            let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                            return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if (inputValue == "None") {


                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = (Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);


                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseIn) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseIn) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftTax)?.toFixed(2), netcostbeforediscount: Number(netCostAftTax)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftTax)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseIn)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterdisc)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if (inputValue == "None") {

                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        } else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                            let purchaseIn = Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);


                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostAftTax) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcostAftTax) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftDisc)?.toFixed(2), netcostbeforediscount: Number(netCostBefrDisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitcostAftTax)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));

                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);


                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, purchasetaxrate: taxratevalue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Enteramt") {
                    if (value.purchasetabletax == "None") {
                        //quantity
                        let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                        let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                        //selling price exclusive purchase price exclusive unit cost
                        let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                        let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                        let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                        let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                        let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                        let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                        let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                        let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                        let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                        let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                        let unitcostdisc = inputValue;
                        //discount
                        if (value.distypemod == "None") {
                            return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                            let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amoount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Percentage") {
                            let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                            // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                            let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                            let differenceValue = Math.abs(Number(inputValue) + Number(disamt));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                            return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if (value.purchasetax == "None") {

                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                                let differenceValue = Math.abs(Number(inputValue) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let purchaseincamtfix = Number(inputValue);
                            //selling
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(purchaseincamtfix) / Number(taxvalue);
                            // let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(inputValue);

                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);


                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseIn) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseIn) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftTax)?.toFixed(2), netcostbeforediscount: Number(netCostAftTax)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftTax)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseIn)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(inputValue) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                let netdis = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitdis = Number(netdis) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterdisc)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(inputValue) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if (value.purchasetax == "None") {


                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                                let differenceValue = Math.abs(Number(inputValue) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let purchaseincamtfix = Number(inputValue);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;

                            let purchaseIn = Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(inputValue);


                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostAftTax) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcostAftTax) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftDisc)?.toFixed(2), netcostbeforediscount: Number(netCostBefrDisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitcostAftTax)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number((discountValue)) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);
                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));

                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);


                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Quantity") {
                    if (value.purchasetabletax == "None") {
                        let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                        let resquantity = Number(inputValue) * Number(res1);

                        //quantity
                        let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                        let unitcost = (Number(netCost) / Number(resquantity));
                        let unitcostdisc = value.enteramt == 0 ? 1 : value.enteramt;

                        //selling price exclusive purchase price exclusive unit cost
                        let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                        let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                        let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                        let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                        let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                        let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                        let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                        let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                        let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                        let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                        //discount
                        if (value.distypemod == "None") {
                            return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                            let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(resquantity)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amoount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Percentage") {
                            let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                            // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                            let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                            let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(resquantity)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                            return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if (value.purchasetax == "None") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);


                            //quantity
                            let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcost = (Number(netCost) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        } else {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = (Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(resquantity));

                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseIn) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseIn) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftTax)?.toFixed(2), netcostbeforediscount: Number(netCostAftTax)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftTax)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseIn)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterdisc)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if (value.purchasetax == "None") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);


                            //quantity
                            let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcost = (Number(netCost) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn = Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt == 0 ? 1 : value.enteramt);


                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrDisc = (Number(netCostBefrDisc) / Number(resquantity));
                            let netCostAftDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostAftdisc = (Number(netCostAftDisc) / Number(resquantity));

                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(resquantity));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostAftTax) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcostAftTax) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftDisc)?.toFixed(2), netcostbeforediscount: Number(netCostBefrDisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitcostAftTax)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));

                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);


                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Quantityunit") {

                    if (value.purchasetabletax == "None") {
                        let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                        let resquantity = Number(value.quantity) * Number(res1)


                        //quantity
                        let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                        let unitcost = (Number(netCost) / Number(resquantity));
                        let unitcostdisc = value.enteramt == 0 ? 1 : value.enteramt;
                        //selling price exclusive purchase price exclusive unit cost
                        let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                        let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                        let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                        let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                        let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                        let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                        let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                        let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                        let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                        let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                        //discount
                        if (value.distypemod == "None") {
                            return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                            let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(resquantity)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amoount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Percentage") {
                            let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                            // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                            let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                            let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(resquantity)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if (value.purchasetax == "None") {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1)


                            //quantity
                            let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcost = (Number(netCost) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1)
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = (Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(resquantity));

                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseIn) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseIn) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftTax)?.toFixed(2), netcostbeforediscount: Number(netCostAftTax)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftTax)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseIn)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterdisc)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if (value.purchasetax == "None") {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1)


                            //quantity
                            let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcost = (Number(netCost) / Number(resquantity));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(resquantity));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1)
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn = Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt == 0 ? 1 : value.enteramt);


                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrDisc = (Number(netCostBefrDisc) / Number(resquantity));
                            let netCostAftDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostAftdisc = (Number(netCostAftDisc) / Number(resquantity));

                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(resquantity));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostAftTax) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcostAftTax) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftDisc)?.toFixed(2), netcostbeforediscount: Number(netCostBefrDisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitcostAftTax)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(resquantity));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(resquantity));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(resquantity));

                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);


                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces: resquantity, quantitynitpiece: unituantityvalue, quantityunitstatus: unitstatus, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Discountmode") {
                    if (value.purchasetabletax == "None") {
                        //quantity
                        let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                        let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                        let unitcostdisc = value.enteramt;

                        //selling price exclusive purchase price exclusive unit cost
                        let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                        let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                        let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                        let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                        let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                        let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                        let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                        let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                        let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                        let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                        //discount
                        if (inputValue == "None") {
                            return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (inputValue == "Fixed" || inputValue == "Amount") {
                            let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amoount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (inputValue == "Percentage") {
                            let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                            // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                            let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                            let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if (value.purchasetax == "None") {


                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        } else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = (Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);


                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseIn) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseIn) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftTax)?.toFixed(2), netcostbeforediscount: Number(netCostAftTax)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftTax)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseIn)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterdisc)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if (value.purchasetax == "None") {


                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn = Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);

                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostAftTax) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcostAftTax) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftDisc)?.toFixed(2), netcostbeforediscount: Number(netCostBefrDisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitcostAftTax)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));

                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);


                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Discountvalue") {
                    if (value.purchasetabletax == "None") {
                        //quantity
                        let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                        let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                        let unitcostdisc = value.enteramt;

                        //selling price exclusive purchase price exclusive unit cost
                        let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                        let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                        let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                        let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                        let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                        let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                        let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                        let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                        let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                        let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                        //discount
                        if (value.distypemod == "None") {
                            return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                            let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amoount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                            let diffval = inputValue;

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                        else if (value.distypemod == "Percentage") {
                            let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                            // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                            let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                            let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                            //before disc netcost && unit 
                            let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                            //after disc netcost
                            let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                            //sell bef tax
                            let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            //sell aft tax
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            //sell tax amount
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                            return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if (value.purchasetax == "None") {


                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                let diffval = inputValue;

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        } else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = (Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);


                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseIn) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseIn) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftTax)?.toFixed(2), netcostbeforediscount: Number(netCostAftTax)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftTax)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseIn)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                let diffval = inputValue;

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterdisc)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Math.abs(Number(value.enteramt) * (Number(inputValue) / 100)));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx = (Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = (Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftIn) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftIn) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(purchaseDiscAftIn)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if (value.purchasetax == "None") {


                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcost) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcost) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCost)?.toFixed(2), netcostbeforediscount: Number(netCost)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCost)?.toFixed(2), unitcostbeforediscount: Number(unitcost)?.toFixed(2), unitcostafterdiscount: Number(unitcost)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcost)?.toFixed(2), purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                let diffval = inputValue;

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));

                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc) / Number(value.quantitytotalpieces));

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);


                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAftdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: "0.00", netcostwithtax: Number(netCostAftdisc)?.toFixed(2), unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostaftdisc)?.toFixed(2), unitcosttaxamount: "0.00", unitcostwithtax: Number(unitcostaftdisc)?.toFixed(2), purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                        }
                        else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn = Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);

                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));

                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax) / Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(unitcostAftTax) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(unitcostAftTax) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                            let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                            let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, disvaluemod: "0.00", differenceamt: "0.00", netcostafterdiscount: Number(netCostAftDisc)?.toFixed(2), netcostbeforediscount: Number(netCostBefrDisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAftTax)?.toFixed(2), unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2), unitcostafterdiscount: Number(unitcostAftdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitcostAftTax)?.toFixed(2), purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                let diffval = inputValue;

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn = (Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc) / Number(value.quantitytotalpieces));

                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc) / Number(value.quantitytotalpieces));

                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax) / Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax) / Number(value.quantitytotalpieces));

                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);


                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitCostAfterDisTax) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitCostAfterDisTax) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                                let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                                let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount: Number(netCostAfterdisc)?.toFixed(2), netcostbeforediscount: Number(netCostBeforedisc)?.toFixed(2), netcosttaxamount: Number(netatxamt)?.toFixed(2), netcostwithtax: Number(netCostAfterDisTax)?.toFixed(2), unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2), unitcostafterdiscount: Number(unitCostAfterdisc)?.toFixed(2), unitcosttaxamount: Number(unittaxamt)?.toFixed(2), unitcostwithtax: Number(unitCostAfterDisTax)?.toFixed(2), purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)), sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltaxamt)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Free") {
                    let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                    let resquantity = Number(inputValue) * Number(res1);

                    return { ...value, [productInputName]: inputValue, freeitemtotalpieces: inputValue };
                }
                else if (reference == "Free Unit") {

                    let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                    let resquantity = Number(value.quantity) * Number(res1)

                    return { ...value, [productInputName]: inputValue, freeitemtotalpieces: resquantity, freeitemunitstatus: false, freeitemnitpiece: unituantityvalue, freeitemsubunitpieces: unitsubquantity, };

                }
                else if (reference == "Margin data") {
                    //selling price exclusive purchase price exclusive unit cost
                    let sellingvaluemargin = (Number(value.unitcostwithtax) * (Number(inputValue) / 100));
                    //sell bef tax
                    let sellingExmargin = Number(value.unitcostwithtax) + Number(sellingvaluemargin);
                    let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                    let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                    let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                    let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                    //sell aft tax
                    let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                    //sell tax amoount
                    let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                    let selltaxamt = Number(sellingExmargin) * Number(sellingtaxamt);
                    let sellunitwithtax = Number(sellingExmargin) + Number(selltaxamt);

                    return { ...value, [productInputName]: inputValue, sellingpriceunitcost: Number(sellunitwithtax)?.toFixed(2), sellingpriceunitwithoutcost: Number(sellingExmargin)?.toFixed(2), saletaxamount: (selltax)?.toFixed(2) }
                }
                else if (reference == "Lotnumber") {

                    return { ...value, [productInputName]: inputValue };
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
    // total quantity and free item calculation

    {
        allProductsList.length > 0 && (
            allProductsList?.forEach(
                (item => {
                    totalitem += +item?.quantity
                    totalalltaxamt += +item?.netcosttaxamount
                    totalvalues += +item?.netcostwithtax
                })
            ))
    }

    // nettotal calculation and include previous value
    function totalNetCostCalc() {
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalvalue += Number(value?.netcostwithtax)
            })
            return Number(totalvalue)?.toFixed(0);
        }
    }

    const handleDiscount = (e) => {

        //Regular expression to match only positive numeric values
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        //Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            if (purchase.discounttypemode == "None") {
                setPurchase({ ...purchase, discountvaluemode: '0.00', discountamountmode: '0.00' });
            }
            else if (purchase.discounttypemode == "Fixed" || purchase.discounttypemode == "Amount") {
                let inputdata = inputValue;
                setPurchase({ ...purchase, discountvaluemode: inputValue, discountamountmode: Number(inputdata)?.toFixed(2) });
            }
            else if (purchase.discounttypemode == "Percentage") {
                let disamt = (Number(inputValue) / 100);

                setPurchase({ ...purchase, discountvaluemode: inputValue, discountamountmode: Number(disamt)?.toFixed(2) });
            }
        }
    }

    const handleChangeDiscountMode = (value) => {
        if (value == "None") {
            setPurchase({ ...purchase, discounttypemode: value, discountvaluemode: '0.00', discountamountmode: '0.00' });
        } else if (value == "Fixed" || value == "Amount") {
            setPurchase({ ...purchase, discounttypemode: value, discountvaluemode: Number(purchase.discountvaluemode)?.toFixed(2), discountamountmode: Number(purchase.discountvaluemode)?.toFixed(2) });
        } else if (value == "Percentage") {
            let disamt = (Number(purchase.discountvaluemode) / 100);

            setPurchase({ ...purchase, discounttypemode: value, discountvaluemode: Number(purchase.discountvaluemode)?.toFixed(2), discountamountmode: Number(disamt)?.toFixed(2) });
        }
    }

    let totalvalueCost = (Number(totalNetCostCalc()));

    const totalNetValue = () => {
        return totalNetCostCalc() == undefined ? Number(purchase.nettotal) : totalvalueCost
    }

    let balanceamt = purchase.balance;
    balanceamt = (purchase.billamount - Number(totalNetValue()))

    useEffect(
        () => {
            totalNetCostCalc();
        }, [allProductsList, purchase]
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        if (purchase.supplier == "") {
            setShowAlert("Please enter supplier name!");
            handleClickOpen();
        } else if (purchase.billamount == 0 || purchase.billamount == "") {
            setShowAlert("Please enter bill amount!");
            handleClickOpen();
        } else {
            handleStoreOpen();
        }
    }

    //quantity unit change compare with unit group
    const handleChangeUnit = async (unitindex, valueunitname) => {
        let resdata = [];
        let resunidata = [];
        let unitcompare = [];
        let unitpiececompare = [];
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            unitcompare = res?.data?.unitgroupings.filter((data, index) => {
                if (valueunitname == data.unit) {
                    resunidata.push({ ...data, subquantity: 1 });
                    return data;
                }
            });

            // if(valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece"){
            //     return {quantity:0, unitgrouping:valueunitname}
            // }else if(valueunitname == data.unit){
            //     return data
            // }

            unitpiececompare = res?.data?.unitgroupings.filter((data, index) => {
                if (unitcompare[0]?.unitgrouping != "Pieces" || unitcompare[0]?.unitgrouping != "Piece" || unitcompare[0]?.unitgrouping != "pieces" || unitcompare[0]?.unitgrouping != "piece") {
                    if (unitcompare[0]?.unitgrouping == data.unit) {
                        resdata.push({ ...data, subquantity: unitcompare[0]?.quantity })
                        return { ...data, subquantity: unitcompare[0]?.quantity }
                    }
                }
            })

            let result = unitcompare.length == 0 ? [{ quantity: 1, unitgrouping: valueunitname, subquantity: 1 }] : unitpiececompare.length == 0 ? resunidata : resdata;

            setGroupUnit(result[0]);
            await productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit", result[0]?.quantity, false, result[0]?.subquantity);

            // if(unitcompare.length == 0){
            //     // setShowAlert("Unit name didn't present unit group! Quantity calulate as single piece!");
            //     // handleQuantityOpen();
            //     let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
            //     setGroupUnit(result[0]);
            //     await  productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit","",result[0]?.quantity,result[0]?.subquantity);
            // }else{
            //     let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;

            // setGroupUnit(result[0]);
            // await  productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit", result[0]?.quantity, false,result[0]?.subquantity);
            // }


        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //free quantity unit change compare with unit group
    const handleChangeFreeUnit = async (unitindex, valueunitname) => {
        let resdata = [];
        let resunidata = [];
        let unitcompare = [];
        let unitpiececompare = [];
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            unitcompare = res?.data?.unitgroupings.filter((data, index) => {
                if (valueunitname == data.unit) {
                    resunidata.push({ ...data, subquantity: 1 });
                    return data;
                }
            });

            // if(valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece"){
            //     return {quantity:0, unitgrouping:valueunitname}
            // }else if(valueunitname == data.unit){
            //     return data
            // }

            unitpiececompare = res?.data?.unitgroupings.filter((data, index) => {
                if (unitcompare[0]?.unitgrouping != "Pieces" || unitcompare[0]?.unitgrouping != "Piece" || unitcompare[0]?.unitgrouping != "pieces" || unitcompare[0]?.unitgrouping != "piece") {
                    if (unitcompare[0]?.unitgrouping == data.unit) {
                        resdata.push({ ...data, subquantity: unitcompare[0]?.quantity })
                        return { ...data, subquantity: unitcompare[0]?.quantity }
                    }
                }
            })

            // if(unitcompare.length == 0){
            //     let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
            //     setGroupUnit(result[0]);
            //     await  productUserInput(unitindex, "freeitemunit", valueunitname, "Free Unit","",true,result[0]?.subquantity);
            // }else{
            let result = unitcompare.length == 0 ? [{ quantity: 1, unitgrouping: valueunitname, subquantity: 1 }] : unitpiececompare.length == 0 ? resunidata : resdata;

            setGroupUnit(result[0]);
            await productUserInput(unitindex, "freeitemunit", valueunitname, "Free Unit", result[0]?.quantity, false, result[0]?.subquantity);
            // }


        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //change form
    const handleBillAmt = (e) => {
        // Regular expression to match only positive numeric values
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setPurchase({ ...purchase, billamount: inputValue, businesslocation: setngs?.businesslocation, totalamount: Number(Number(inputValue) + Number(purchase.expenseamount) + Number(purchase.freightamount))?.toFixed(2) });
        }
    };

    const handleFreightAmt = (e) => {
        // Regular expression to match only positive numeric values
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setPurchase({ ...purchase, freightamount: inputValue, totalamount: Number(Number(purchase.billamount) + Number(purchase.expenseamount) + Number(inputValue))?.toFixed(2) });
        }
    };

    const handleExpenseAmt = (e) => {
        // Regular expression to match only positive numeric values
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setPurchase({ ...purchase, expenseamount: inputValue, totalamount: Number(Number(purchase.billamount) + Number(inputValue) + Number(purchase.freightamount))?.toFixed(2) });
        }
    };

    const handlePayAmt = (e) => {
        // Regular expression to match only positive numeric values
        //    const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setPurchase({ ...purchase, payamount: inputValue, paydue: Number(Number(totalNetValue()) - Number(inputValue))?.toFixed(2) });
        }
    };

    return (
        <Box>
            <Headtitle title={'Edit Purchase'} />
            <Typography sx={userStyle.HeaderText}>Edit Purchase</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Supplier <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><PersonOutlineOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth >
                                    <Selects
                                        options={suppliers}
                                        styles={colourStyles}
                                        placeholder={purchase.supplier}
                                        onChange={(e) => {
                                            setPurchase({
                                                ...purchase, supplier: e.value
                                            }); searchAdd(e._id)
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIconsAddPopup} style={{ paddingRight: '5px' }}>
                                    <Purchasesupplieradd setIsSupplierFetch={setIsSupplierFetch} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Reference No:</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    type="text"
                                    value={purchase.referenceno}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Date</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={purchase.purchasedate}
                                    type="date"
                                    onChange={(e) => { setPurchase({ ...purchase, purchasedate: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Invoice No:</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    type="text"
                                    value={purchase.invoiceno}
                                    onChange={(e) => { setPurchase({ ...purchase, invoiceno: e.target.value }) }}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    placeholder={isBusilocations ? isBusilocations.name : ""}
                                    onChange={(e) => { setPurchase({ ...purchase, businesslocation: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Bill Amount<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={purchase.billamount}
                                    type="number"
                                    onChange={(e) => { handleBillAmt(e) }}
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Purchase Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={purchase.purchasetaxmode}
                                    onChange={(e) => { setPurchase({ ...purchase, purchasetaxmode: e.target.value }) }}
                                    fullWidth
                                >
                                    <MenuItem value="None" >None</MenuItem>
                                    <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                    <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Tax Slab</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200
                                            },
                                        },
                                    }}
                                    value={purchase.purchasetaxlabmode}
                                    onChange={(e) => { setPurchase({ ...purchase, purchasetaxlabmode: e.target.value }); }}
                                    fullWidth
                                >
                                    <MenuItem value="None" onClick={(e) => handleChangeTaxvalue(0)}>None</MenuItem>
                                    {taxrates && (
                                        taxrates.map((row, index) => (
                                            <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTaxvalue(row?.taxrate)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Disc. type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200
                                            },
                                        },
                                    }}
                                    value={purchase.discounttypemode}
                                    onChange={(e) => { handleChangeDiscountMode(e.target.value) }}
                                    fullWidth
                                >
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="Fixed">Fixed</MenuItem>
                                    <MenuItem value="Amount" >Amount</MenuItem>
                                    <MenuItem value="Percentage">Percentage</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Disc. value</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={purchase.discountvaluemode}
                                    type="number"
                                    onChange={(e) => { handleDiscount(e); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Disc. Amt</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchase.discountamountmode}
                                />
                                <br />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel >Upload Documents</InputLabel>
                            <> <Button variant="outlined" component="label" sx={{ justifyContent: "center !important", height: '50px' }}>
                                <div> <CloudUploadIcon sx={{ paddingTop: '5px' }} /></div>
                                <input hidden type="file" multiple onChange={handleFileUpload} accept=" application/pdf, image/*" />
                            </Button>
                            </>
                        </Grid>
                        <br /><br />
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: '10px' }}>
                            <br />
                            {files?.length > 0 &&
                                (files.map((file, index) => (
                                    <>
                                        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <Typography>{file.name}</Typography>

                                            </Grid>
                                            {/* <br /> */}
                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                            </Grid>
                                            {/* <br/> */}
                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                <a
                                                    style={{ color: "#357AE8", marginLeft: "60px", marginTop: "-20px" }}
                                                    href={`data:application/octet-stream;base64,${file.data}`}
                                                    download={file.name}
                                                >
                                                    <FileDownloadIcon />
                                                </a>
                                            </Grid>
                                            {/* <br/> */}
                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                <Button sx={{ marginLeft: "60px", marginTop: "-20px" }} onClick={() => handleFileDelete(index)} size="small"  ><DeleteIcon /></Button>
                                            </Grid>
                                        </Grid>
                                    </>
                                )))}
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
                        <Grid item md={2} sm={2} xs={12}>
                            <InputLabel id="demo-select-small">Balance:-</InputLabel>
                            <Typography value={purchase.balance}
                                style={{ color: 'red', fontSize: '20px' }}
                            > {balanceamt}</Typography>
                        </Grid>
                        <Grid item md={2} sm={6} xs={6}>
                            <InputLabel >Tax Amount:-</InputLabel>
                            <Typography
                                style={{ color: 'red', fontSize: '20px' }}
                            >{totalalltaxamt == NaN || totalalltaxamt == undefined ? 0 : Number(totalalltaxamt)?.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Expense Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchase.expenseamount}
                                    type="number"
                                    onChange={(e) => { handleExpenseAmt(e); }}
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Freight Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchase.freightamount}
                                    type="number"
                                    onChange={(e) => { handleFreightAmt(e); }}
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Total Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchase.totalamount}
                                />
                            </FormControl>
                        </Grid>
                    </Grid><br />
                    <Grid container spacing={3}>
                        <Grid item md={6} sm={6} xs={12}>
                            <Typography variant='subtitle1'>
                                <b>Address:</b> <br />
                                {purchase.addressone}
                                <br />
                            </Typography>
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
                                            gethsncode(e);
                                            setPurchase({ ...purchase, product: e.value });
                                             handleInputChange()
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIconsAddPopup}>
                                    <Purchaseproductadd setFetchsaveproduct={setFetchsaveproduct} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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
                                    <TableCell sx={userStyle.tableHead1}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></TableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {allProductsList.length > 0 &&
                                    allProductsList.map((data, i) => {
                                        return (
                                            <>
                                                {i === 0 ?
                                                    (<StyledTableRow key={i} >
                                                        <TableCell colSpan={4} sx={{ padding: '5px' }}>
                                                            <Grid container spacing={1}>
                                                                <Grid item md={12} sx={{ marginTop: '-67px' }}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                                                    <FormControl fullWidth>
                                                                        <TextField size='small' value={data?.prodname} />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={2.5}>
                                                                    <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Lot No:</Typography>
                                                                            <FormControl size="small" fullWidth>
                                                                                <TextField size='small'
                                                                                    sx={userStyle.input}
                                                                                    type='text'
                                                                                    value={data?.lotnumber}
                                                                                    onChange={(e) => {
                                                                                        productUserInput(i, "lotnumber", e.target.value, "Lotnumber");
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
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
                                                                                    <MenuItem value="None" >None</MenuItem>
                                                                                    <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                                    <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                                </Select>
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
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
                                                                                >
                                                                                    <MenuItem value="None" onClick={(e) => handleChangeTax(i, "None", 0, [])}>None</MenuItem>
                                                                                    {taxrates && (
                                                                                        taxrates.map((row, index) => (
                                                                                            <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                                                                        ))
                                                                                    )}
                                                                                </Select>
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
                                                                                        <TextField size='small'
                                                                                            sx={userStyle.input}
                                                                                            type='number'
                                                                                            value={data?.enteramt}
                                                                                            onChange={(e) => {
                                                                                                productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                                            }}
                                                                                            inputRef={targetTextFieldRef}

                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={4}>

                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <TextField size='small'
                                                                                            sx={userStyle.input}
                                                                                            type='number'
                                                                                            value={data?.quantity}
                                                                                            onChange={(e) => {
                                                                                                productUserInput(i, "quantity", e.target.value, "Quantity");
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={8}>
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <Select
                                                                                            // value={data?.quantityunit}
                                                                                            value={data?.quantityunit}
                                                                                            MenuProps={{
                                                                                                PaperProps: {
                                                                                                    style: {
                                                                                                        maxHeight: 200
                                                                                                    },
                                                                                                },
                                                                                            }}
                                                                                            fullWidth
                                                                                        >
                                                                                            {allUnits && (
                                                                                                allUnits.map((row, index) => (
                                                                                                    <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                                ))
                                                                                            )}
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Pcs.</Typography>
                                                                            <FormControl size="small" fullWidth>
                                                                                <TextField size='small'
                                                                                    value={data?.quantitytotalpieces}
                                                                                />
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
                                                                                            sx={userStyle.input}
                                                                                            type='number'
                                                                                            value={data?.freeitem}
                                                                                            onChange={(e) => {
                                                                                                productUserInput(i, "freeitem", e.target.value, "Free");
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={8}>
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <Select
                                                                                            value={data?.freeitemunit}
                                                                                            MenuProps={{
                                                                                                PaperProps: {
                                                                                                    style: {
                                                                                                        maxHeight: 200
                                                                                                    },
                                                                                                },
                                                                                            }}
                                                                                            fullWidth
                                                                                            sx={{
                                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                                    width: '150px !important'
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            {allUnits && (
                                                                                                allUnits.map((row, index) => (
                                                                                                    <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeFreeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                                ))
                                                                                            )}
                                                                                        </Select>
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
                                                                        <Grid item md={12}>
                                                                            <Grid container>
                                                                                <Grid item md={6} >
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Val</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <TextField size='small'
                                                                                            type="number"
                                                                                            sx={userStyle.input}
                                                                                            value={data?.disvaluemod}
                                                                                            onChange={(e) => productUserInput(i, "disvaluemod", e.target.value, "Discountvalue")}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={6}>
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Amt</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <TextField size='small'
                                                                                            type="text"
                                                                                            value={data?.differenceamt}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost (After Discount)</Typography>
                                                                            <OutlinedInput
                                                                                size="small"
                                                                                id="component-outlined"
                                                                                value={data?.netcostafterdiscount}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item md={2}>
                                                                    <Grid container spacing={1}>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Exc Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
                                                                                value={data?.purchaseexcludetax}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
                                                                                value={data?.excalpha}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Inc Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
                                                                                value={data?.pruchaseincludetax}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
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
                                                                    <InputLabel sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(Before Discount)</InputLabel>
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
                                                                <Grid item md={12} sx={{ marginTop: '-45px' }}>
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
                                                                        type='number'
                                                                        value={data?.margin}
                                                                        onChange={(e) => {
                                                                            productUserInput(i, "margin", e.target.value, "Margin data")
                                                                        }}
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
                                                        <TableCell>
                                                            <AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(i, e)} />
                                                        </TableCell>
                                                    </StyledTableRow>)
                                                    :
                                                    <StyledTableRow key={i} >
                                                        <TableCell colSpan={8} sx={{ padding: '5px' }}>
                                                            <Grid container spacing={1}>
                                                                <Grid item md={6} >
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                                                    <FormControl fullWidth>
                                                                        <TextField size='small' value={data?.prodname} />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={1.5}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
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
                                                                            <MenuItem value="None" >None</MenuItem>
                                                                            <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                            <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={1.5}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
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
                                                                        >
                                                                            <MenuItem value="None" onClick={(e) => handleChangeTax(i, "None", 0, [])}>None</MenuItem>
                                                                            {taxrates && (
                                                                                taxrates.map((row, index) => (
                                                                                    <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                                                                ))
                                                                            )}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={1}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Enter Rate</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField size='small'
                                                                            sx={userStyle.input}
                                                                            type='number'
                                                                            value={data?.enteramt}
                                                                            onChange={(e) => {
                                                                                productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={1}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField size='small'
                                                                            sx={userStyle.input}
                                                                            type='number'
                                                                            value={data?.quantity}
                                                                            onChange={(e) => {
                                                                                productUserInput(i, "quantity", e.target.value, "Quantity");
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={1} sx={{ marginTop: "30px", display: "flex", justifyContent: "space-evenly" }} onClick={() => toggleRowDetails(i)}>
                                                                    {expandedRow === i ?
                                                                        <ExpandLessOutlinedIcon style={{ fontSize: '25px', cursor: 'pointer', color: "#357AE8", marginTop: '-3px ' }} onClick={(e) => setExpandedRow(null)} />
                                                                        :
                                                                        <ExpandMoreOutlinedIcon style={{ fontSize: '25px', cursor: 'pointer', color: "#357AE8", marginTop: '-3px ' }} />
                                                                    }
                                                                    <VisibilityOutlinedIcon style={{ fontSize: 'large', cursor: 'pointer', color: "#357AE8" }} onClick={(e) => { handleClickOpenview(); setShow(data) }} />
                                                                    <AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(i, e)} />
                                                                </Grid>
                                                            </Grid>
                                                        </TableCell>
                                                    </StyledTableRow >
                                                }
                                                {expandedRow === i && (
                                                    <StyledTableRow  >
                                                        <TableCell colSpan={4} sx={{ padding: '5px' }}>
                                                            <Grid container spacing={1}>
                                                                <Grid item md={12} sx={{ marginTop: '-67px' }}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                                                    <FormControl fullWidth>
                                                                        <TextField size='small' value={data?.prodname} />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={2.5}>
                                                                    <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Lot No:</Typography>
                                                                            <FormControl size="small" fullWidth>
                                                                                <TextField size='small'
                                                                                    sx={userStyle.input}
                                                                                    type='text'
                                                                                    value={data?.lotnumber}
                                                                                    onChange={(e) => {
                                                                                        productUserInput(i, "lotnumber", e.target.value, "Lotnumber");
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
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
                                                                                    <MenuItem value="None" >None</MenuItem>
                                                                                    <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                                    <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                                </Select>
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
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
                                                                                >
                                                                                    <MenuItem value="None" onClick={(e) => handleChangeTax(i, "None", 0, [])}>None</MenuItem>
                                                                                    {taxrates && (
                                                                                        taxrates.map((row, index) => (
                                                                                            <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                                                                        ))
                                                                                    )}
                                                                                </Select>
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
                                                                                        <TextField size='small'
                                                                                            sx={userStyle.input}
                                                                                            type='number'
                                                                                            value={data?.enteramt}
                                                                                            onChange={(e) => {
                                                                                                productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={4}>

                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <TextField size='small'
                                                                                            sx={userStyle.input}
                                                                                            type='number'
                                                                                            value={data?.quantity}
                                                                                            onChange={(e) => {
                                                                                                productUserInput(i, "quantity", e.target.value, "Quantity");
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={8}>
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <Select
                                                                                            // value={data?.quantityunit}
                                                                                            value={data?.quantityunit}
                                                                                            MenuProps={{
                                                                                                PaperProps: {
                                                                                                    style: {
                                                                                                        maxHeight: 200
                                                                                                    },
                                                                                                },
                                                                                            }}
                                                                                            fullWidth
                                                                                        >
                                                                                            {allUnits && (
                                                                                                allUnits.map((row, index) => (
                                                                                                    <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                                ))
                                                                                            )}
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Pcs.</Typography>
                                                                            <FormControl size="small" fullWidth>
                                                                                <TextField size='small'
                                                                                    value={data?.quantitytotalpieces}
                                                                                />
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
                                                                                            sx={userStyle.input}
                                                                                            type='number'
                                                                                            value={data?.freeitem}
                                                                                            onChange={(e) => {
                                                                                                productUserInput(i, "freeitem", e.target.value, "Free");
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={8}>
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <Select
                                                                                            value={data?.freeitemunit}
                                                                                            MenuProps={{
                                                                                                PaperProps: {
                                                                                                    style: {
                                                                                                        maxHeight: 200
                                                                                                    },
                                                                                                },
                                                                                            }}
                                                                                            fullWidth
                                                                                            sx={{
                                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                                    width: '150px !important'
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            {allUnits && (
                                                                                                allUnits.map((row, index) => (
                                                                                                    <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeFreeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                                ))
                                                                                            )}
                                                                                        </Select>
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
                                                                        <Grid item md={12}>
                                                                            <Grid container>
                                                                                <Grid item md={6} >
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Val</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <TextField size='small'
                                                                                            type="number"
                                                                                            sx={userStyle.input}
                                                                                            value={data?.disvaluemod}
                                                                                            onChange={(e) => productUserInput(i, "disvaluemod", e.target.value, "Discountvalue")}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={6}>
                                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Amt</Typography>
                                                                                    <FormControl size="small" fullWidth>
                                                                                        <TextField size='small'
                                                                                            type="text"
                                                                                            value={data?.differenceamt}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost (After Discount)</Typography>
                                                                            <OutlinedInput
                                                                                size="small"
                                                                                id="component-outlined"
                                                                                value={data?.netcostafterdiscount}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item md={2}>
                                                                    <Grid container spacing={1}>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Exc Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
                                                                                value={data?.purchaseexcludetax}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
                                                                                value={data?.excalpha}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Inc Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
                                                                                value={data?.pruchaseincludetax}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                            <OutlinedInput size='small'
                                                                                type="text"
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
                                                                    <InputLabel sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(Before Discount)</InputLabel>
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
                                                                <Grid item md={12} sx={{ marginTop: '-45px' }}>
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
                                                                        type='number'
                                                                        value={data?.margin}
                                                                        onChange={(e) => {
                                                                            productUserInput(i, "margin", e.target.value, "Margin data")
                                                                        }}
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
                                                        <TableCell></TableCell>
                                                    </StyledTableRow>
                                                )}

                                            </>
                                        );
                                    }
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer><br />
                    <Grid container>
                        <Grid item xs={6} sm={6} md={8} lg={8}>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={4}>
                            <Typography variant="subtitle1"
                            ><b>Total items:{totalitem}</b></Typography>
                            <Typography variant="subtitle1"
                            ><b> Net Total Amount:</b> ₹ {Number(totalNetValue())?.toFixed(2)}</Typography>
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
                                    value={purchase.purchasestatus}
                                    onChange={(e) => {
                                        setPurchase({ ...purchase, purchasestatus: e.target.value });
                                        purchaseStatusInput(e.target.value);
                                    }}
                                >
                                    <MenuItem value={purchaseStatusPending}>{purchaseStatusPending}</MenuItem>
                                    <MenuItem value={purchaseStatusReceived}>{purchaseStatusReceived}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid><br />
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
                                                    value={purchase.payamount}
                                                    onChange={(e) => {
                                                        handlePayAmt(e);

                                                    }}
                                                    type='number'
                                                    sx={userStyle.input}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Paid Date</InputLabel>
                                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
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
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Payment Method</InputLabel>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={purchase.paymentmethod}
                                                onChange={(e) => {
                                                    setPurchase({ ...purchase, paymentmethod: e.target.value });
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
                                                value={purchase.additionalnotes}
                                                onChange={(e) => { setPurchase({ ...purchase, additionalnotes: e.target.value, }) }}
                                            />
                                        </FormControl><br /><br />
                                        <hr />
                                    </Grid>
                                    <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                                        <Grid>
                                            <Typography variant='subtitle1'
                                                value={purchase.paydue}
                                            ><b>Payment due:</b> ₹{Number(totalNetValue()) - Number(purchase.payamount)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </>
                        ) : null

                    }<br />
                    <Grid container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button><br />
                        <Link to="/purchase/purchase/list"><Button sx={userStyle.buttoncancel} type="button">CANCEL</Button></Link>

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
            {/* Quantity Modal */}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isQuantityOpen}
                    onClose={handleQuantityClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={(e) => { setIsQuantity(true); handleQuantityClose(); }}>OK</Button>
                        <Button variant="contained" color="error" onClick={(e) => { setIsQuantity(false); handleQuantityClose(); }}>CANCEL</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Save before Model */}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isStoreOpen}
                    onClose={handleStoreClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '600px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant='h6' ><b>Total GST:</b>{totalalltaxamt == NaN || totalalltaxamt == undefined ? '0.00' : Number(totalalltaxamt)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b>Frieght Amt:</b>{Number(purchase.freightamount)?.toFixed(2)} <b>Expense Amt:</b>{Number(purchase.expenseamount)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b>Added Amt:</b>{totalvalues == NaN || totalvalues == undefined ? '0.00' : Number(totalvalues)?.toFixed(2)} <b>Round off Amt:</b>{totalvalues == NaN || totalvalues == undefined ? 0 : Number(totalvalues)?.toFixed(0)}</Typography>
                        <Typography variant='h6' ><b>Balance Amt:</b>{Number(balanceamt)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b >Status:<p style={{ color: 'red' }}>{purchase.purchasestatus == "Received" ? "Completed" : purchase.purchasestatus}</p></b></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={() => { updatePurchase(); handleStoreClose(); }}>OK</Button>
                        {/* <Button variant="contained" color="error" onClick={handleStoreClose}>CANCEL</Button> */}
                    </DialogActions>
                </Dialog>
            </Box>
            {/* table view popup open */}
            <Dialog open={openview} fullWidth maxWidth={'xl'} onClose={handleCloseview} >
                <DialogContent sx={{ maxWidth: "100%", alignItems: "center" }}>
                    <StyledTableRow>
                        <TableCell colSpan={4} sx={{ padding: '5px' }}>
                            <Grid container spacing={1}>
                                <Grid item md={12} sx={{ marginTop: '-67px' }}>
                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                    <FormControl fullWidth>
                                        <TextField size='small' value={show?.prodname} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.5}>
                                    <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Lot No:</Typography>
                                            <FormControl size="small" fullWidth>
                                                <TextField size='small'
                                                    sx={userStyle.input}
                                                    value={show?.lotnumber}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput size='small'
                                                    value={show?.purchasetabletax}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput size='small'
                                                    value={show?.purchasetax}
                                                />
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
                                                        <TextField size='small'
                                                            sx={userStyle.input}
                                                            value={show?.enteramt}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4}>

                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                    <FormControl size="small" fullWidth>
                                                        <TextField size='small'
                                                            sx={userStyle.input}
                                                            value={show?.quantity}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={8}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput size='small'
                                                            value={show?.quantityunit}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Pcs.</Typography>
                                            <FormControl size="small" fullWidth>
                                                <TextField size='small'
                                                    value={show?.quantitytotalpieces}
                                                />
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
                                                            sx={userStyle.input}
                                                            value={show?.freeitem}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={8}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput size='small'
                                                            value={show?.freeitemunit}
                                                        />
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
                                                <OutlinedInput size='small'
                                                    value={show?.distypemod}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Grid container>
                                                <Grid item md={6} >
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Val</Typography>
                                                    <FormControl size="small" fullWidth>
                                                        <TextField size='small'
                                                            sx={userStyle.input}
                                                            value={show?.disvaluemod}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Amt</Typography>
                                                    <FormControl size="small" fullWidth>
                                                        <TextField size='small'
                                                            value={show?.differenceamt}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost (After Discount)</Typography>
                                            <OutlinedInput
                                                size="small"
                                                id="component-outlined"
                                                value={show?.netcostafterdiscount}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={2}>
                                    <Grid container spacing={1}>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Exc Tax</Typography>
                                            <OutlinedInput size='small'
                                                value={show?.purchaseexcludetax}
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                            <OutlinedInput size='small'
                                                value={show?.excalpha}
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Inc Tax</Typography>
                                            <OutlinedInput size='small'
                                                value={show?.pruchaseincludetax}
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                            <OutlinedInput size='small'
                                                value={show?.incalpha}
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
                                        value={show?.sku}
                                        sx={{
                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                width: '80px'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <InputLabel sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(Before Discount)</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        id="component-outlined"
                                        value={show?.unitcostbeforediscount}
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
                                        value={show?.netcostbeforediscount}
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
                                        value={show?.unitcostafterdiscount}
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
                                        value={show?.netcostafterdiscount}
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
                                {show?.hsn ?
                                    (
                                        <>
                                            <Grid item md={12}>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                                <OutlinedInput size='small'
                                                    value={show?.hsn}
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
                                                    value={show?.applicabletax}
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
                                        value={show?.unitcosttaxamount}
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
                                        value={show?.netcosttaxamount}
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
                                        value={show?.unitcostwithtax}
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
                                        value={show?.netcostwithtax}
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
                                <Grid item md={12} sx={{ marginTop: '-45px' }}>
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
                                        value={show?.margin}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(Without Tax)</Typography>
                                    <OutlinedInput
                                        size="small"
                                        id="component-outlined"
                                        value={show?.sellingpriceunitwithoutcost}
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
                                        value={show?.sellingpricetax}
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
                                        value={show?.saletaxamount}
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
                                        value={show?.sellingpriceunitcost}
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
                    <Grid container>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button variant="contained" color='error' sx={{ float: "right" }} onClick={() => { handleCloseview() }}>
                                close
                            </Button>

                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Already added product popup */}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isProductAddedOpen}
                    onClose={handleProductAddedClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '500px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >This Product Already Exist! Again Add?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={() => { isAlreadyAddedProduct(); handleProductAddedClose(); }}>OK</Button>
                        <Button variant="contained" sx={userStyle.buttoncancel} onClick={handleProductAddedClose}>CANCEL</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>

    );
}

const Purchaseedit = () => {
    return (
        <>
            <Purchaseeditlist /><br /><br />
            <Footer />
        </>
    )
}

export default Purchaseedit;