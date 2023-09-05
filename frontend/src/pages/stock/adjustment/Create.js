import React, { useState, useEffect, useContext } from 'react';
import { TableCell, TableRow, Box, MenuItem, FormGroup, Select, Checkbox, TableHead, FormControlLabel, Table, Grid, Paper, TableContainer, FormControl, InputLabel, OutlinedInput, TableBody, Typography, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Selects from "react-select";
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

const StockAdjustmentlist = () => {

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const [busilocations, setBusilocations] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});

    const { auth, setngs } = useContext(AuthContext);
    const [isProductPurchase, setIsProductsPurchase] = useState([]);
    const [isFinalProduct, setIsFinalProduct] = useState({ productname: "", sku: "", currentstock: "" });
    const [isFinalPopupProduct, setIsFinalPopupProduct] = useState({ indexvalue:"", productname: "", sku: "", quantity: 0, remainingstockquantity:0, supplier:"", date:"", purchasequantity:0, adjustmentcount: 0, adjustmentmode: "", adjustmenttype: "Please Select AdjustmentType", balancecount: 0, isarraysave:false });
    const [isSaveProdcuts, setIsSaveProducts] = useState([]);
    const { isUserRoleAccess, allLocations, isActiveLocations, allProducts } = useContext(UserRoleAccessContext);
    const [StockAdd, setStockAdd] = useState({
        section: "Please Select Section",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        brand: "Please Select Brand",
        subbrand: "Please Select Subbrand",
        size: "Please Select Size",
        color: "Please Select Color",
        style: "Please Select Style",
        unit: "Please Select Unit",
        productname: "",
        count: "",
        adjustmentcount: "",
        adjustmenttype: "",
        balancecount: "",
        remark: "",
        businesslocation: "",
    });
    // Filter Date
    const [filterData, setFilterData] = useState([])
    const [checkboxState, setCheckboxState] = useState({});

    // product Datatable 
    const [pagePro, setPagePro] = useState(1);
    const [pageSizePro, setPageSizePro] = useState(1);
    const [sortingPro, setSortingPro] = useState({ column: '', direction: '' });
    const [searchQueryPro, setSearchQueryPro] = useState("");

    // Supplier  Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch Category
    const [category, setCategory] = useState([]);
    const [subcategory, setSubCategory] = useState([]);
    // Fetch Brand
    const [brand, setBrand] = useState([]);
    const [subbrand, setSubBrand] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);

    //section
    const [section, setSection] = useState([])
    //size
    const [size, setSize] = useState([]);
    //color
    const [color, setColor] = useState([]);
    //Style
    const [style, setStyle] = useState([]);
    //unit
    const [unit, setUnit] = useState([]);
    //adjustment type
    const [adjustment, setAdjustment] = useState([]);

    const [selectedSKUs, setSelectedSKUs] = useState([]);
    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };


    // ADD Popup model
    const [isaddOpen, setIsAddOpen] = useState(false);
    const handleAddOpen = () => { setIsAddOpen(true); };
    const handleAddClose = () => { setIsAddOpen(false); };
    let newarray = [];

    const backLPage = useNavigate();

    // Sorting
    const handleSortingPro = (column) => {
        const direction = sortingPro.column === column && sortingPro.direction === 'asc' ? 'desc' : 'asc';
        setSortingPro({ column, direction });
    };

    const sortedDataPro = filterData.sort((a, b) => {
        if (sortingPro.direction === 'asc') {
            return a[sortingPro.column] > b[sortingPro.column] ? 1 : -1;
        } else if (sortingPro.direction === 'desc') {
            return a[sortingPro.column] < b[sortingPro.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconPro = (column) => {
        if (sortingPro.column !== column) {
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
        } else if (sortingPro.direction === 'asc') {
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

    // Datatable
    const handlePageChangePro = (newPage) => {
        setPagePro(newPage);
    };

    const handlePageSizeChangePro = (event) => {
        setPageSizePro(Number(event.target.value));
        setPagePro(1);
    };


    const handleSearchChangePro = (event) => {
        setSearchQueryPro(event.target.value);
    };
    const filteredDatasPro = filterData?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQueryPro.toLowerCase())
        )
    );

    var handleCheckboxChange = (sku, isChecked, index) => {
        setCheckboxState(prevState => ({
            ...prevState,
            [sku]: isChecked,
        }));

        if (isChecked) {
            setSelectedSKUs(prevSelectedSKUs => [...prevSelectedSKUs, sku]);
        } else {
            setSelectedSKUs(prevSelectedSKUs => prevSelectedSKUs.filter(selectedSKU => selectedSKU !== sku));
        }
        setPageSizePro(1)
    };


    var sortedArray = filteredDatasPro.slice().sort((a, b) => {
        const isASkuSelected = selectedSKUs.includes(a?.sku);
        const isBSkuSelected = selectedSKUs.includes(b?.sku);

        if (isASkuSelected && !isBSkuSelected) return -1;
        if (!isASkuSelected && isBSkuSelected) return 1;
        return 0;

    });

    let newSort = sortedArray.slice((pagePro - 1) * pageSizePro, pagePro * pageSizePro);

    const totalPagesPro = Math.ceil(filteredDatasPro.length / pageSizePro);

    const visiblePagesPro = Math.min(totalPagesPro, 3);

    const firstVisiblePagePro = Math.max(1, pagePro - 1);
    const lastVisiblePagePro = Math.min(firstVisiblePagePro + visiblePagesPro - 1, totalPagesPro);

    const pageNumbersPro = [];

    const indexOfLastItemPro = pagePro * pageSizePro;
    const indexOfFirstItemPro = indexOfLastItemPro - pageSizePro;

    for (let i = firstVisiblePagePro; i <= lastVisiblePagePro; i++) {
        pageNumbersPro.push(i);
    }

    // End

    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = isProductPurchase.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === 'desc') {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });

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

    // Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredDatas = isProductPurchase?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    // fetch Location
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

    // filter condition
    const fetchProductbySBrandandSizeandColorandStyle = async (e) => {
        try {
            let res = await axios.post(SERVICE.PRODUCT_CSC_BSB_SIZE_COLOR_STYLE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                businesslocation: String(StockAdd.businesslocation == "" ? isBusilocations.locationid : StockAdd.businesslocation),
                category: String(StockAdd.category == "Please Select Category" ? "" : StockAdd.category),
                subcategory: String(StockAdd.subcategory == "Please Select Subcategory" ? "" : StockAdd.subcategory),
                brand: String(StockAdd.brand == "Please Select Brand" ? "" : StockAdd.brand),
                subbrand: String(StockAdd.subbrand == "Please Select Subbrand" ? "" : StockAdd.subbrand),
                size: String(StockAdd.size == "Please Select Size" ? "" : StockAdd.size),
                color: String(StockAdd.color == "Please Select Color" ? "" : StockAdd.color),
                style: String(StockAdd.style == "Please Select Style" ? "" : StockAdd.style),
                unit: String(StockAdd.unit == "Please Select Unit" ? "" : StockAdd.unit),

            });
           
            setFilterData(res?.data?.products);

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
        fetchCategory();
        fetchLocations();
        fetchBrand();
        fetchSection();
        fetchSize();
        fetchColor();
        fetchStyle();
        fetchUnit();
        fetchAdjustment();
    }, []);
    
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);
    //fetch category
    const fetchCategory = async () => {
        try {
            let res = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const categoryid = [{ label: 'Please Select Category', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.categories.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                }
            ))];

            setCategory(categoryid);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    //fetch Sub Category from category
    const fetchSubCate = async (value) => {
        
        if(value != "ALL"){
            try {
                let res = await axios.post(SERVICE.SUB_CATEGORIES, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    categoryname: String(value)
                });
    
                const subcategoryid = [{ label: 'Please Select Subcategory', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.subcategories.map((d) => (
                    {
                        ...d,
                        label: d.subcategryname,
                        value: d.subcategryname,
                    }
                ))];
    
                setSubCategory(subcategoryid)
    
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }else{
            const subcategoryid = [{ label: 'Please Select Subcategory', value: 'ALL' }, { label: 'ALL', value: 'ALL' }];

            setSubCategory(subcategoryid)
        }
    };

    //fetch category from section
    const fetchCategoryName = async (sectionvalue) => {
        let sectarray = [];
        let secoptarray = []

        if(sectionvalue !== "ALL"){
            try {
                let res = await axios.post(SERVICE.SECTION_GROUP, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                });
    
                let result = res?.data?.sectiongoups.map((data, index) => {
                    let iscatearray = data?.categories.forEach((item, i) => {
    
                        if (data.sectionname == sectionvalue) {
                            sectarray.push(item?.categoryname);
                        }
                    });
                    return iscatearray
                });
    
                secoptarray = [...new Set(sectarray)]
    
                const categoryid = [{ label: 'Please Select Category', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...secoptarray.map((d) => (
                    {
                        ...d,
                        label: d,
                        value: d,
                    }
                ))];
    
                setCategoryOptions(categoryid);
    
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }

    };

    //fetch category vice brand
    const fetchBrandName = async (valucategoryname) => {
        let catearray = [];
        let newarray = [];
        let allbransarray = [];
        if(valucategoryname != "ALL"){
            try {
                let res = await axios.post(SERVICE.GROUPS, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                });
                let result = res?.data?.groups.map((data, index) => {
                    let iscatearray = data?.categoryname.forEach((item, i) => {
                        if (item == valucategoryname) {
                            catearray.push(data?.brandname);
                        }
                    });
                    return iscatearray
                });

                //individual products
                catearray.forEach((value)=>{
                    value.forEach((valueData)=>{
                        allbransarray.push(valueData);
                    })
                    })

                newarray = [...new Set(allbransarray)];
                const brandall = [{ label: 'Please Select Brand', value: 'ALL' }, 
                { label: 'ALL', value: 'ALL' },...newarray.map((d) => (
                    {
                        ...d,
                        label: d,
                        value: d
                    }
                ))];
               
                setBrandOptions(brandall);
    
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }
        
    };

    //fetch brand
    const fetchBrand = async () => {
        try {
            let res = await axios.post(SERVICE.BRAND, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });


            const brandid = [{ label: 'Please Select Brand', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.brands.map((d) => (
                {
                    ...d,
                    label: d.brandname,
                    value: d.brandname,
                }
            ))];

            setBrand(brandid);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };
    // Sub sub brand
    const fetchSubBrand = async (value) => {
        if(value != 'ALL'){
            try {
                let res = await axios.post(SERVICE.SUB_BRANDS, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    brandname: String(value)
                });
                
                const subbrandid = [{ label: 'Please Select Subbrand', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.subbrands.map((d) => (
                    {
                        ...d,
                        label: d.subbrandname,
                        value: d.subbrandname,
                    }
                ))];
    
                setSubBrand(subbrandid);
    
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }else{
            const subbrandid = [{ label: 'Please Select Subbrand', value: 'ALL' }, { label: 'ALL', value: 'ALL' }];

            setSubBrand(subbrandid);
        }
    };
    //section
    const fetchSection = async () => {
        try {
            let res = await axios.post(SERVICE.SECTION_GROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const sectionid = [{ label: 'Please Select Section', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.sectiongoups.map((d) => (
                {
                    ...d,
                    label: d.sectionname,
                    value: d.sectionname,
                }
            ))];
            setSection(sectionid);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Fetch Size
    const fetchSize = async () => {
        try {
            let res = await axios.post(SERVICE.SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const sizeid = [{ label: 'Please Select Size', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.sizes.map((d) => (
                {
                    ...d,
                    label: d.sizename,
                    value: d.sizename,
                }
            ))];

            setSize(sizeid);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Color
    const fetchColor = async () => {
        try {
            let res = await axios.post(SERVICE.COLOR, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const colorid = [{ label: 'Please Select Color', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.colors.map((d) => (
                {
                    ...d,
                    label: d.colorname,
                    value: d.colorname,
                }
            ))];

            setColor(colorid);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };
    //style
    const fetchStyle = async () => {
        try {
            let res = await axios.post(SERVICE.STYLE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const styleid = [{ label: 'Please Select Style', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.styles.map((d) => (
                {
                    ...d,
                    label: d.stylename,
                    value: d.stylename,
                }
            ))];

            setStyle(styleid);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };
    //unit
    const fetchUnit = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const unitid = [{ label: 'Please Select Unit', value: 'ALL' }, { label: 'ALL', value: 'ALL' }, ...res?.data?.units.map((d) => (
                {
                    ...d,
                    label: d.unit,
                    value: d.unit,
                }
            ))];

            setUnit(unitid);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Adjustment type
    const fetchAdjustment = async () => {
        try {
            let res = await axios.post(SERVICE.ADJUSTMENTTYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setAdjustment(res?.data?.adjustments.map((d) => (
                {
                    ...d,
                    label: d.adjustmentitem,
                    value: d.adjustmentitem
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

    //get supplier details
    const handleChangeProductPurchase = async (skuid, productnamevalue, currentstockvalue, checkedvalue) =>{
        
        if(checkedvalue){
            setIsFinalProduct({...isFinalProduct, productname:productnamevalue, sku:skuid, currentstock:currentstockvalue})
            try {
                const [
                    respurchase,
                    resstock
                ] = await Promise.all([
                    axios.post(SERVICE.ADJUSTMENTPRODUCTPURCHASE, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        businessid: String(setngs.businessid),
                        role: String(isUserRoleAccess.role),
                        userassignedlocation: [isUserRoleAccess.businesslocation],
                        productid: String(skuid)
                    }),
                    axios.post(SERVICE.ADJUSTMENTPRODUCT_SOLD_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        businessid: String(setngs.businessid),
                        // role: String(isUserRoleAccess.role),
                        // userassignedlocation: [isUserRoleAccess.businesslocation],
                        productid: String(skuid)
                    })
                ])
                let resultsalescount = respurchase?.data?.purchasesproducts.map((data, index)=>{
                    let prodnameslice = data.prodname.slice(0, 3).toUpperCase();
                    let suppliernamwslice = data.supplier.slice(0, 3).toUpperCase()
                    let dateslice = moment(data.date).format('DDMMYYYY');
                    let resstockid = prodnameslice + '_' + suppliernamwslice + '_' + dateslice;
                    let balancecountarray = [];
                    let resdata = {...data, solditemscount:balancecountarray, adjustmentcount:0, adjustmentmode:"", adjustmenttype: "Please Select AdjustmentType", balancecount: 0, isarraysave:false}

                    resstock?.data?.stockproducts.forEach((item, indexvalue)=>{

                    let parts = item.stockid.split('_', 3);
                    let result = parts[0] + '_' + parts[1] + '_' + parts[2].slice(0,8);
                        if(resstockid == result){
                            balancecountarray.push(item)
                            resdata = {...data, solditemscount:balancecountarray, adjustmentcount:0, adjustmentmode:"", adjustmenttype: "Please Select AdjustmentType", balancecount: 0, isarraysave:false}
                        }
                    })

                    return resdata;
                })
                setIsProductsPurchase(resultsalescount);
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }else{
            setIsFinalProduct({...isFinalProduct, productname:"", sku:"", currentstock:""})
            setIsProductsPurchase([]);
        }
    }

    //stock adjustmenttype change
    const handleAdjustment = (e) => {
        if (e.mode == "Sub") {
            let rescount = Number(isFinalPopupProduct.remainingstockquantity) - Number(isFinalPopupProduct.adjustmentcount);

            setIsFinalPopupProduct({ ...isFinalPopupProduct, adjustmenttype: e.value, balancecount: rescount, adjustmentmode: e.mode })

        } else if (e.mode == "Add") {
            let rescount = Number(isFinalPopupProduct.remainingstockquantity) + Number(isFinalPopupProduct.adjustmentcount);

            setIsFinalPopupProduct({ ...isFinalPopupProduct, adjustmenttype: e.value, balancecount: rescount, adjustmentmode: e.mode })
        }

    }

    //stock adjustment field change
    const handleAdjustmentCount = (value) => {
        if (isFinalPopupProduct.adjustmentmode == "Sub") {
            let rescount = Number(isFinalPopupProduct.remainingstockquantity) - Number(value);

            setIsFinalPopupProduct({ ...isFinalPopupProduct, adjustmentcount: value, balancecount: rescount })

        } else if (isFinalPopupProduct.adjustmentmode == "Add") {
            let rescount = Number(isFinalPopupProduct.remainingstockquantity) + Number(value);

            setIsFinalPopupProduct({ ...isFinalPopupProduct, adjustmentcount: value, balancecount: rescount })

        } else {
            setIsFinalPopupProduct({ ...isFinalPopupProduct, adjustmentcount: value })
        }
    }

    //post api
    const AddStockAdjust = async () => {
        isSaveProdcuts.map((item, index) => {
            allProducts.forEach((data, i) => {
                if ((item.sku == data.sku)) {
                    axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        currentstock: item.adjustmentmode == "Sub" ? Number(data.currentstock) - Number(item.adjustmentcount) : Number(data.currentstock) + Number(item.adjustmentcount),
                    });
                }
            })
        })
        try {
            let req = await axios.post(SERVICE.STOCK_ADJUSTMENT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                businesslocation: String(StockAdd.businesslocation == "" ? isBusilocations.locationid : StockAdd.businesslocation),
                section: String(StockAdd.section == "Please Select Section" ? "" : StockAdd.section),
                category: String(StockAdd.category == "Please Select Category" ? "" : StockAdd.category),
                subcategory: String(StockAdd.subcategory == "Please Select Subcategory" ? "" : StockAdd.subcategory),
                brand: String(StockAdd.brand == "Please Select Brand" ? "" : StockAdd.brand),
                subbrand: String(StockAdd.subbrand == "Please Select Subbrand" ? "" : StockAdd.subbrand),
                size: String(StockAdd.size == "Please Select Size" ? "" : StockAdd.size),
                color: String(StockAdd.color == "Please Select Color" ? "" : StockAdd.color),
                style: String(StockAdd.style == "Please Select Style" ? "" : StockAdd.style),
                unit: String(StockAdd.unit == "Please Select Unit" ? "" : StockAdd.unit),
                today: String(today),
                transferproducts: [...isSaveProdcuts]

            });
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage("/stock/adjustment/list")
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();

        if(isSaveProdcuts.length == 0){
            setShowAlert("Please Enter Any one of product Adjustment Details!!");
            handleClickOpen();

        }else{
            AddStockAdjust();
        }

    }

    const handleSaveProduct = async  () =>{
        let result = isProductPurchase.map((data, index)=>{
            if(index == isFinalPopupProduct.indexvalue){

                return {...data, adjustmentcount:isFinalPopupProduct.adjustmentcount, adjustmentmode:isFinalPopupProduct.adjustmentmode, adjustmenttype: isFinalPopupProduct.adjustmenttype, balancecount:isFinalPopupProduct.balancecount, isarraysave: true}
            
            }else{

                return data
            }
        })

        await setIsProductsPurchase(result)

        await setIsSaveProducts((isSaveProdcuts)=>{
            return [...isSaveProdcuts, {productname:isFinalPopupProduct.productname, sku:isFinalPopupProduct.sku, supplier:isFinalPopupProduct.supplier, currentstock:isFinalProduct.currentstock, purchasequantity:isFinalPopupProduct.purchasequantity, remainingstockquantity:isFinalPopupProduct.remainingstockquantity, date:isFinalPopupProduct.date, adjustmentmode:isFinalPopupProduct.adjustmentmode, adjustmenttype:isFinalPopupProduct.adjustmenttype, adjustmentcount:isFinalPopupProduct.adjustmentcount, balancecount:isFinalPopupProduct.balancecount}]
        })

        setIsFinalPopupProduct({indexvalue:"", productname: "", sku: "", quantity: 0, remainingstockquantity:0, supplier:"", date:"", purchasequantity:0, adjustmentcount: 0, adjustmentmode: "", adjustmenttype: "Please Select AdjustmentType", balancecount: 0, isarraysave:false})
    }

    return (
        <Box>
            <Headtitle title={'Add Stock Adjustment'} />
            {/* Filter condition start */}
            <Grid container spacing={3} >
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText}>Add Stock Adjustment</Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                    <InputLabel >Business Location<b style={{ color: "red" }}> *</b></InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            options={busilocations}
                            styles={colourStyles}
                            placeholder={isBusilocations ? isBusilocations.name : ""}
                            onChange={(e) => { setStockAdd({ ...StockAdd, businesslocation: e.value }); }}
                        />
                    </FormControl>
                </Grid>
            </Grid><br /><br />
            <Box sx={userStyle.container}>
                <Grid container spacing={3} >
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Section Group</InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                isClearable={true}
                                options={section}
                                value={{ label: StockAdd.section, value: StockAdd.section }}
                                onChange={(e) => {
                                    setStockAdd({ ...StockAdd, section: e.value, category:"Please Select Category", subcategory: "Please Select Subcategory", brand: "Please Select Brand", subbrand:"Please Select Subbrand"}); fetchCategoryName(e.value)
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Category</InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                isClearable={true}
                                options={StockAdd.section == "Please Select Section" || StockAdd.section == "ALL" ? category : categoryOptions}
                                value={{ label: StockAdd.category, value: StockAdd.category }}
                                onChange={(e) => {
                                    fetchSubCate(e.value);
                                    fetchBrandName(e.value)
                                    setStockAdd({ ...StockAdd, category: e.value, subcategory: "Please Select Subcategory", brand: "Please Select Brand", subbrand:"Please Select Subbrand"});
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">SubCategory</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={subcategory}
                                    value={{ label: StockAdd.subcategory, value: StockAdd.subcategory }}
                                    onChange={(e) => {
                                        setStockAdd({ ...StockAdd, subcategory: e.value, });
                                    }}

                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Brand</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={StockAdd.category == "Please Select Category" || StockAdd.category == "ALL" ? brand : brandOptions}
                                    value={{ label: StockAdd.brand, value: StockAdd.brand }}
                                    onChange={(e) => {
                                        fetchSubBrand(e.value);
                                        setStockAdd({ ...StockAdd, brand: e.value, subbrand:"Please Select Subbrand"});
                                    }}

                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">SubBrand</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={subbrand}
                                    value={{ label: StockAdd.subbrand, value: StockAdd.subbrand }}
                                    onChange={(e) => {
                                        setStockAdd({ ...StockAdd, subbrand: e.value, });
                                    }}

                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Size</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={size}
                                    value={{ label: StockAdd.size, value: StockAdd.size }}
                                    onChange={(e) => {
                                        setStockAdd({ ...StockAdd, size: e.value, });
                                    }}
                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Color</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={color}
                                    value={{ label: StockAdd.color, value: StockAdd.color }}
                                    onChange={(e) => {
                                        setStockAdd({ ...StockAdd, color: e.value, });
                                    }}
                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Style</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    options={style}
                                    value={{ label: StockAdd.style, value: StockAdd.style }}
                                    onChange={(e) => {
                                        setStockAdd({
                                            ...StockAdd, style: e.value,
                                        });
                                    }}
                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Units</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={unit}
                                    value={{ label: StockAdd.unit, value: StockAdd.unit }}
                                    onChange={(e) => {
                                        setStockAdd({
                                            ...StockAdd, unit: e.value,
                                        });
                                    }}
                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid>
                        <Button sx={userStyle.buttonadd} onClick={() => { fetchProductbySBrandandSizeandColorandStyle() }}>filter</Button>
                    </Grid>
                </Grid>
            </Box><br />
            {/* Filter condition end */}
            {/* Filtered product start */}
            <Box sx={userStyle.container}>
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show&ensp;</label>
                        <Select id="pageSizeSelect" value={pageSizePro} onChange={handlePageSizeChangePro} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(filteredDatasPro.length)}>All</MenuItem>
                        </Select>
                        <label htmlFor="pageSizeSelect">&ensp;entries</label>
                    </Box>
                    <Box>
                        <Grid sx={{ display: 'flex' }}>
                            <Grid><Typography sx={{ marginTop: '6px' }}>Search:&ensp;</Typography></Grid>
                            <FormControl fullWidth size="small" >
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={searchQueryPro}
                                    onChange={handleSearchChangePro}
                                />
                            </FormControl>
                        </Grid>
                    </Box>
                </Grid><br /><br />
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" id="stockadjustmentPDF">
                        <TableHead sx={{ fontWeight: '600' }}>
                            <StyledTableRow>
                                <StyledTableCell>Actions</StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Product Sku</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('currentstock')}><Box sx={userStyle.tableheadstyle}><Box>Current Stock</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('currentstock')}</Box></Box></StyledTableCell>

                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {newSort.length > 0 ? (
                                newSort.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell sx={{ paddingLeft: '20px' }}>
                                            <Grid>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={!!checkboxState[row?.sku]}
                                                                onChange={(e) => {
                                                                    handleCheckboxChange(row?.sku, e.target.checked, index);
                                                                    handleChangeProductPurchase(
                                                                        row?.sku,
                                                                        row?.productname,
                                                                        row?.currentstock,
                                                                        e.target.checked
                                                                    );
                                                                }}
                                                                disabled={
                                                                    Object.values(checkboxState).some(
                                                                        (value) => value && !checkboxState[row?.sku]
                                                                    )
                                                                }
                                                            />
                                                        }
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        </StyledTableCell>
                                        <StyledTableCell>{row.productname}</StyledTableCell>
                                        <StyledTableCell>{row.sku}</StyledTableCell>
                                        <StyledTableCell>{row.currentstock}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                                        No data Available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
                <br /><br />
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing {((pagePro - 1) * pageSizePro) + 1} to {Math.min(pagePro * pageSizePro, sortedArray.length)} of {sortedArray.length} entries
                    </Box>
                    <Box>
                        <Button onClick={() => handlePageChangePro(pagePro - 1)} disabled={pagePro === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                            Prev
                        </Button>
                        {pageNumbersPro?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangePro(pageNumber)} className={((pagePro)) === pageNumber ? 'active' : ''} disabled={pagePro === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblePagePro < totalPagesPro && <span>...</span>}
                        <Button onClick={() => handlePageChangePro(pagePro + 1)} disabled={pagePro === totalPagesPro} sx={{ textTransform: 'capitalize', color: 'black' }}>
                            Next
                        </Button>
                    </Box>
                </Box>
            </Box >
            {/* Filtered Product end */}
            <br />
            {/* Product Name and supplier table start */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <InputLabel htmlFor="component-outlined" >Product Name</InputLabel>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                type="text"
                                value={isFinalProduct.productname}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={6} xs={12}>
                        <InputLabel htmlFor="component-outlined" >Total Quantity</InputLabel>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                value={isFinalProduct.currentstock}
                                sx={userStyle.input}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <br /><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show&ensp;</label>
                        <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(isProductPurchase.length)}>All</MenuItem>
                        </Select>
                        <label htmlFor="pageSizeSelect">&ensp;entries</label>
                    </Box>
                    <Box>
                        <Grid sx={{ display: 'flex' }}>
                            <Grid><Typography sx={{ marginTop: '6px' }}>Search:&ensp;</Typography></Grid>
                            <FormControl fullWidth size="small" >
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </FormControl>
                        </Grid>
                    </Box>
                </Grid><br /><br />
                <TableContainer component={Paper} >
                    <Table aria-label="simple table" id="stockadjustmentPDF">
                        <TableHead sx={{ fontWeight: "600" }} >
                            <StyledTableRow >
                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('supplier')}><Box sx={userStyle.tableheadstyle}><Box>Supplier Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('supplier')}</Box></Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('date')}><Box sx={userStyle.tableheadstyle}><Box>Purchase Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('date')}</Box></Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('quantitytotalpieces')}><Box sx={userStyle.tableheadstyle}><Box>Quantity Purchased</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('quantitytotalpieces')}</Box></Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('quantitytotalpieces')}><Box sx={userStyle.tableheadstyle}><Box>Current Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('quantitytotalpieces')}</Box></Box></StyledTableCell>
                                <StyledTableCell sx={{ width: '600px !important' }} ><Box>Action</Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length > 0 ?
                                (filteredData.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.supplier}</StyledTableCell>
                                        <StyledTableCell>{row.date}</StyledTableCell>
                                        <StyledTableCell>{Number(row.quantitytotalpieces) + Number(row.freeitemtotalpieces)}</StyledTableCell>
                                        <StyledTableCell>{(Number(row.quantitytotalpieces) + Number(row.freeitemtotalpieces)) - Number(row.solditemscount.length)}</StyledTableCell>
                                        <StyledTableCell > <Button variant='outlined' onClick={() => { setIsFinalPopupProduct({ ...isFinalPopupProduct, indexvalue:index, sku:row?.sku, supplier: row?.supplier, date:row?.date, purchasequantity: Number(row.quantitytotalpieces) + Number(row.freeitemtotalpieces), productname:  row?.prodname, remainingstockquantity: (Number(row?.quantitytotalpieces) + Number(row?.freeitemtotalpieces)) - Number(row?.solditemscount.length), adjustmentcount:row?.adjustmentcount, adjustmentmode:row?.adjustmentmode, adjustmenttype:row?.adjustmenttype, balancecount:row?.balancecount, isarraysave:row?.isarraysave }); handleAddOpen(); }}><AddIcon style={{ color: "#1976d2", cursor: "pointer" }} /></Button></StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow><StyledTableCell colSpan={18} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                            }
                        </TableBody>
                    </Table >
                </TableContainer ><br /><br />
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                    </Box>
                    <Box>
                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                            Prev
                        </Button>
                        {pageNumbers?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblePage < totalPages && <span>...</span>}
                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={{ textTransform: 'capitalize', color: 'black' }}>
                            Next
                        </Button>
                    </Box>
                </Box>
                {/* Store Button */}
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid sx={{display:'flex'}}>
                        <Button sx={userStyle.buttonadd} onClick={handleSubmit}>SAVE</Button>
                        <Link to="/stock/adjustment/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                    </Grid>
                </Grid>
            </Box >
            {/* Product Name and supplier table end */}            
            {/* Error ALERT DIALOG */}
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
             {/* Adjustment popup Product Name and supplier table start */}
            <Box>
                <Dialog
                    maxWidth="md"
                    fullWidth
                    open={isaddOpen}
                    onClose={handleAddClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={userStyle.filtercontentpopup} style={{height:'550px'}}>
                        <Grid container spacing={3} sx={{ padding: '20px' }}>
                            <Grid item lg={11} md={11} sm={11} xs={11} ><Typography variant='h5'><b>Stock Adjustment</b> <b style={{fontSize:'15px', color:'red'}}>There is no update option for this action!!</b></Typography></Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1} sx={{ display: "flex", justifyContent: 'end', cursor: "pointer" }}><CloseIcon onClick={handleAddClose} style={{ color: "tomato" }} /></Grid>
                            <br />
                            <Grid item lg={5} md={5} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined">Product Name</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={isFinalPopupProduct.productname}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined">Count</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={isFinalPopupProduct.remainingstockquantity}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined" >Adjustment Count</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={isFinalPopupProduct.adjustmentcount}
                                        onChange={(e) => handleAdjustmentCount(e.target.value)}
                                        type="number"
                                        sx={userStyle.input}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={5} md={5} sm={6} xs={12} >
                                <InputLabel id="demo-select-small">Adjustment Type</InputLabel>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Grid sx={{ display: 'flex' }}>
                                        <Selects
                                            options={adjustment}
                                            placeholder='Select Type'
                                            value={{ label: isFinalPopupProduct.adjustmenttype, value: isFinalPopupProduct.adjustmenttype }}
                                            onChange={(e) => { handleAdjustment(e) }}
                                        />
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <InputLabel htmlFor="component-outlined" >Balance Count</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        style={colourStyles}
                                        id="component-outlined"
                                        value={isFinalPopupProduct.balancecount}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <br /><br />
                    <Grid container sx={{ display: "flex", justifyContent: 'center' }}>
                        <Grid item lg={2} md={2} sm={2} xs={2}>
                            <Button variant="contained" sx={userStyle.buttoncancel} color="error" onClick={handleAddClose}>close</Button>
                            {!isFinalPopupProduct.isarraysave && <Button variant="contained" sx={userStyle.buttonadd} color="error" onClick={()=>{handleSaveProduct(); handleAddClose();}}>Save</Button>}                            
                        </Grid>
                    </Grid>
                    <br /><br />
                </Dialog>
                <br />
            </Box>
            {/* Adjustment popup Product Name and supplier table end */}
        </Box >
    );
}
const StockAdjustmentcreate = () => {
    return (
        <>
             <StockAdjustmentlist /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default StockAdjustmentcreate;  