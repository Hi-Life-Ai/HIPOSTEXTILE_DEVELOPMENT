import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { TableRow, Box, MenuItem, Select, TableFooter, TableHead, Table, Grid, Paper, TableContainer, FormControl, InputLabel, OutlinedInput, TableBody, Typography, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { ExportXL, ExportCSV } from '../../Export';
import Selects from "react-select";
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const Categoryvicereportlist = () => {

    const [busilocations, setBusilocations] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});

    const { auth, setngs } = useContext(AuthContext);
    const [exceldata, setExceldata] = useState([]);
   
    const { isUserRoleAccess, isUserRoleCompare, allLocations, isActiveLocations } = useContext(UserRoleAccessContext);
    const [stockCategory, setStockCategory] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        brand: "Please Select Brand",
        subbrand: "Please Select Subbrand",
        businesslocation: "",
    });
    // Filter Date
    const [categoryStock, setFilterData] = useState([])

    // Fetch Category
    const [category, setCategory] = useState([]);
    const [subcategory, setSubCategory] = useState([]);
    const [subcategoryOptions, setSubCategoryOptions] = useState([]);
    // Fetch Brand
    const [brand, setBrand] = useState([]);
    const [subbrand, setSubBrand] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [subBrandOptions, setSubBrandOptions] = useState([]);

    // Datatable 
  const [page, setPage] = useState(1);
  const [isLoader, setIsLoader] = useState(true);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  let total = 0;

    useEffect(() => {
        fetchCategory();
        fetchLocations();
        fetchBrand();
    }, []);

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

    //fetch category
    const fetchCategory = async () => {
        try {
            const [
                res,
                ressubcat
            ] = await Promise.all([
                axios.post(SERVICE.CATEGORIES, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                }),
                axios.post(SERVICE.CATEGORIES_SUBCATEGORY, {
                    headers: {
                      'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                }) 
            ])

            const categoryid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.categories.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                }
            ))];

            setCategory(categoryid);

            const subcategoryid = [{ label: 'ALL', value: 'ALL' }, ...ressubcat?.data?.subcatrgories.map((d) => (
                {
                    ...d,
                    label: d.subcategryname,
                    value: d.subcategryname,
                }
            ))];

            setSubCategoryOptions(subcategoryid)

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

                const subcategoryid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.subcategories.map((d) => (
                    {
                        ...d,
                        label: d.subcategryname,
                        value: d.subcategryname,
                    }
                ))];

                setSubCategory(subcategoryid);
    
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }else{

            setSubCategory(subcategoryOptions)
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

                const brandid = [{ label: 'ALL', value: 'ALL' }, ...newarray.map((d) => (
                    {
                        ...d,
                        label: d,
                        value: d,
                    }
                ))];

                setBrandOptions(brandid);
                    
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }else{
            setBrandOptions([])
        }
        
    };

    //fetch brand
    const fetchBrand = async () => {
        try {

            const [
                res,
                ressubbrand
            ] = await Promise.all([
                axios.post(SERVICE.BRAND, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                }),
                axios.post(SERVICE.ALLSUBBRAND, {
                    headers: {
                      'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                }) 
            ])
            
            const brandid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.brands.map((d) => (
                {
                    ...d,
                    label: d.brandname,
                    value: d.brandname,
                }
            ))];

            setBrand(brandid);

            const subbrandid = [{ label: 'ALL', value: 'ALL' }, ...ressubbrand?.data?.subbrands.map((d) => (
                {
                    ...d,
                    label: d.subbrandname,
                    value: d.subbrandname,
                }
            ))];

            setSubBrandOptions(subbrandid)

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

                const subbrandid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.subbrands.map((d) => (
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

            setSubBrand(subBrandOptions);
        }
    };

    // filter condition
    const fetchProductbySBrandandSizeandColorandStyle = async (e) => {
        let location = stockCategory.businesslocation == "" ? isBusilocations.locationid : stockCategory.businesslocation;
        setIsLoader(false)
        if(stockCategory.category == "ALL" || stockCategory.category == "Please Select Category"){
            if(stockCategory.subcategory == "ALL" || stockCategory.subcategory == "Please Select Subcategory"){
                if(stockCategory.brand == "ALL" || stockCategory.brand == "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else if(stockCategory.brand !== "ALL" || stockCategory.brand !== "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            brand: String(stockCategory.brand),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }
               
            }else if(stockCategory.subcategory !== "ALL" || stockCategory.subcategory !== "Please Select Subcategory"){
                if(stockCategory.brand == "ALL" || stockCategory.brand == "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            subcategory: String(stockCategory.subcategory),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else if(stockCategory.brand !== "ALL" || stockCategory.brand !== "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            subcategory: String(stockCategory.subcategory),
                            brand: String(stockCategory.brand),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            subcategory: String(stockCategory.subcategory),
                            businesslocation: String(location),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }
            }
        }else if(stockCategory.category !== "ALL" || stockCategory.category !== "Please Select Category"){
            if(stockCategory.subcategory == "ALL" || stockCategory.subcategory == "Please Select Subcategory"){
                if(stockCategory.brand == "ALL" || stockCategory.brand == "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(stockCategory.category),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else if(stockCategory.brand !== "ALL" || stockCategory.brand !== "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(stockCategory.category),
                            brand: String(stockCategory.brand),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            category: String(stockCategory.category),
                            businesslocation: String(location),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }
               
            }else if(stockCategory.subcategory !== "ALL" || stockCategory.subcategory !== "Please Select Subcategory"){
                if(stockCategory.brand == "ALL" || stockCategory.brand == "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(stockCategory.category),
                            subcategory: String(stockCategory.subcategory),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else if(stockCategory.brand !== "ALL" || stockCategory.brand !== "Please Select Brand"){
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(stockCategory.category),
                            subcategory: String(stockCategory.subcategory),
                            brand: String(stockCategory.brand),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            category: String(stockCategory.category),
                            subcategory: String(stockCategory.subcategory),
                            businesslocation: String(location),
            
                        });
                        setIsLoader(true);
                        setFilterData(res?.data?.products);
            
                    } catch (err) {
                        setIsLoader(true);
                        const messages = err?.response?.data?.message;
                        if (messages) {
                            toast.error(messages);
                        } else {
                            toast.error("Something went wrong!")
                        }
                    }
                }
            }
        }
        // else if(stockCategory.brand == "ALL" || stockCategory.brand == "Please Select Brand"){
        //     try {
        //         let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
        //             headers: {
        //                 'Authorization': `Bearer ${auth.APIToken}`
        //             },
        //             assignbusinessid: String(setngs.businessid),
        //             businesslocation: String(location),
    
        //         });
        //         setIsLoader(true);
        //         setFilterData(res?.data?.products);
    
        //     } catch (err) {
        //         setIsLoader(true);
        //         const messages = err?.response?.data?.message;
        //         if (messages) {
        //             toast.error(messages);
        //         } else {
        //             toast.error("Something went wrong!")
        //         }
        //     }
        // }else if(stockCategory.size == "ALL" || stockCategory.size == "Please Select Size"){
        //     try {
        //         let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
        //             headers: {
        //                 'Authorization': `Bearer ${auth.APIToken}`
        //             },
        //             assignbusinessid: String(setngs.businessid),
        //             businesslocation: String(location),
    
        //         });
        //         setIsLoader(true);
        //         setFilterData(res?.data?.products);
    
        //     } catch (err) {
        //         setIsLoader(true);
        //         const messages = err?.response?.data?.message;
        //         if (messages) {
        //             toast.error(messages);
        //         } else {
        //             toast.error("Something went wrong!")
        //         }
        //     }
        // }else if(stockCategory.clolor == "ALL" || stockCategory.color == "Please Select Color"){
        //     try {
        //         let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
        //             headers: {
        //                 'Authorization': `Bearer ${auth.APIToken}`
        //             },
        //             assignbusinessid: String(setngs.businessid),
        //             businesslocation: String(location),
    
        //         });
        //         setIsLoader(true);
        //         setFilterData(res?.data?.products);
    
        //     } catch (err) {
        //         setIsLoader(true);
        //         const messages = err?.response?.data?.message;
        //         if (messages) {
        //             toast.error(messages);
        //         } else {
        //             toast.error("Something went wrong!")
        //         }
        //     }
        // }else if(stockCategory.style == "ALL" || stockCategory.style == "Please Select Style"){
        //     try {
        //         let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
        //             headers: {
        //                 'Authorization': `Bearer ${auth.APIToken}`
        //             },
        //             assignbusinessid: String(setngs.businessid),
        //             businesslocation: String(location),
    
        //         });
        //         setIsLoader(true);
        //         setFilterData(res?.data?.products);
    
        //     } catch (err) {
        //         setIsLoader(true);
        //         const messages = err?.response?.data?.message;
        //         if (messages) {
        //             toast.error(messages);
        //         } else {
        //             toast.error("Something went wrong!")
        //         }
        //     }
        // }
        else {
            try {
                let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    assignbusinessid: String(setngs.businessid),
                    businesslocation: String(stockCategory.businesslocation == "" ? isBusilocations.locationid : stockCategory.businesslocation),
                    category: String(stockCategory.category == "Please Select Category" ? "" : stockCategory.category),
                    subcategory: String(stockCategory.subcategory == "Please Select Subcategory" ? "" : stockCategory.subcategory),
                    brand: String(stockCategory.brand == "Please Select Brand" ? "" : stockCategory.brand),
                    subbrand: String(stockCategory.subbrand == "Please Select Subbrand" ? "" : stockCategory.subbrand),
    
                });
                setIsLoader(true);
                setFilterData(res?.data?.products);
    
            } catch (err) {
                setIsLoader(true);
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }
       
    }

    // Excel
  const fileName = 'CurrentStockReport'
  // get particular columns for export excel
  const getexcelDatas = async () => {
    var data = categoryStock.map((t, index) => ({ "Sno": index + 1,"Product ID": t.sku,"Product Name": t.productname,"Current Stock": t.currentstock,}));
    
    setExceldata(data);
  }

  useEffect(
    () => {
      getexcelDatas();
    }, [categoryStock]
  )

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | CURRENT STOCK REPORT',
    pageStyle: 'print'
  });

  const ref = createRef();
  const options = {
    orientation: 'portrait',
    unit: 'in'
  };

//  PDF
const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#currentstocktablepdf' })
    doc.save('CurrentStockReport.pdf')
  }

  const addSerialNumber = () => {
    const itemsWithSerialNumber = categoryStock?.map((item, index) => ({ ...item, sno: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [categoryStock])

  //table sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = items.sort((a, b) => {
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
  const filteredDatas = items?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }


    return (
        <Box>
            <Headtitle title={'Current Stock Report'} />
            {/* Filter condition start */}
            <Grid container spacing={3} >
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText}>Current Stock Report</Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                    <InputLabel >Business Location<b style={{ color: "red" }}> *</b></InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            options={busilocations}
                            styles={colourStyles}
                            placeholder={isBusilocations ? isBusilocations.name : ""}
                            onChange={(e) => { setStockCategory({ ...stockCategory, businesslocation: e.value }); }}
                        />
                    </FormControl>
                </Grid>
            </Grid><br />
            <Box sx={userStyle.container}>
                <Grid container spacing={3}>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Category</InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                isClearable={true}
                                options={category}
                                value={{ label: stockCategory.category, value: stockCategory.category }}
                                onChange={(e) => {
                                    fetchSubCate(e.value);
                                    fetchBrandName(e.value)
                                    setStockCategory({ ...stockCategory, category: e.value, subcategory: "Please Select Subcategory", brand: "Please Select Brand", subbrand:"Please Select Subbrand"});
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
                                    value={{ label: stockCategory.subcategory, value: stockCategory.subcategory }}
                                    onChange={(e) => {
                                        setStockCategory({ ...stockCategory, subcategory: e.value, });
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
                                    options={stockCategory.category == "Please Select Category" || stockCategory.category == "ALL" ? brand : brandOptions}
                                    value={{ label: stockCategory.brand, value: stockCategory.brand }}
                                    onChange={(e) => {
                                        fetchSubBrand(e.value);
                                        setStockCategory({ ...stockCategory, brand: e.value, subbrand:"Please Select Subbrand"});
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
                                    value={{ label: stockCategory.subbrand, value: stockCategory.subbrand }}
                                    onChange={(e) => {
                                        setStockCategory({ ...stockCategory, subbrand: e.value, });
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
                    <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={(categoryStock?.length)}>All</MenuItem>
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
                <Grid container sx={{ justifyContent: "center" }} >
                <Grid>
                    {isUserRoleCompare[0]?.csvstock && (
                    <>
                        <ExportCSV csvData={exceldata} fileName={fileName} />
                    </>
                    )}
                    {isUserRoleCompare[0]?.excelstock && (
                    <>
                        <ExportXL csvData={exceldata} fileName={fileName} />
                    </>
                    )}
                    {isUserRoleCompare[0]?.printstock && (
                    <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                    </>
                    )}
                    {isUserRoleCompare[0]?.pdfstock && (
                    <>
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                    )}
                </Grid>
                </Grid><br /><br />
                {isLoader ? (
                <Box>
                    <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow align="left">
                            <StyledTableCell onClick={() => handleSorting('sno')}><Box sx={userStyle.tableheadstyle}><Box>S.No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sno')}</Box></Box></StyledTableCell>
                            <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Product ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                            <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                            <StyledTableCell onClick={() => handleSorting('currentstock')}><Box sx={userStyle.tableheadstyle}><Box>Current Stock</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('currentstock')}</Box></Box></StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {filteredData.length > 0 ?
                            (filteredData.map((row, index) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell align="left">{row.sno}</StyledTableCell>
                                <StyledTableCell align="left">{row.sku}</StyledTableCell>
                                <StyledTableCell align="left">{row.productname}</StyledTableCell>
                                <StyledTableCell align="left">{row.currentstock}</StyledTableCell>
                            </StyledTableRow>
                            )))
                            : <StyledTableRow><StyledTableCell colSpan={4} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                        }
                        </TableBody>
                        <TableFooter sx={{ backgroundColor: '#9591914f', height: '75px' }}>
                            <StyledTableRow className="table2_total" >
                                {categoryStock && (
                                    categoryStock.forEach(
                                        (item => {
                                            total += +item.currentstock;
                                        })
                                    ))}
                                <StyledTableCell colSpan={3} sx={userStyle.footerStyle}>Total</StyledTableCell>
                                <StyledTableCell align="left">{total}</StyledTableCell>
                            </StyledTableRow>
                        </TableFooter>
                    </Table>
                    </TableContainer><br /><br />
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                        </Box>
                        <Box>
                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                            First
                            </Button>
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
                            <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={{ textTransform: 'capitalize', color: 'black' }}>
                            Last
                            </Button>
                        </Box>
                    </Box>
                </Box>
                ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </>
                )}
            </Box>
            {/* Filtered Product end */}
            { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Stock</Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="currentstocktablepdf" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow>
                    <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>Product ID</StyledTableCell>
                    <StyledTableCell>Product Name</StyledTableCell>
                    <StyledTableCell>Current Stock</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {categoryStock.length > 0 && (
                    categoryStock.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="left">{index + 1}</StyledTableCell>
                        <StyledTableCell align="left">{row.sku}</StyledTableCell>
                        <StyledTableCell align="left">{row.productname}</StyledTableCell>
                        <StyledTableCell align="left">{row.currentstock}</StyledTableCell >
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter sx={{ backgroundColor: '#9591914f', height: '75px' }}>
                    <StyledTableRow className="table2_total" >
                        {categoryStock && (
                            categoryStock.forEach(
                                (item => {
                                    total += +item.currentstock;
                                })
                            ))}
                        <StyledTableCell colSpan={3} sx={userStyle.footerStyle}>Total</StyledTableCell>
                        <StyledTableCell align="left">{total}</StyledTableCell>
                    </StyledTableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </>
      </Box>
    
        </Box >
    );
}
const Categoryvicereport = () => {
    return (
        <>
             <Categoryvicereportlist /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default Categoryvicereport;  