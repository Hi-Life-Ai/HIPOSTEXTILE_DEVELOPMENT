import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, MenuItem, Select, Dialog, Checkbox, FormGroup, Radio, RadioGroup,FormControl, InputLabel, FormControlLabel, DialogActions, DialogContent, DialogContentText, Button, Grid, Typography, Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { useParams } from 'react-router-dom';
import { AiOutlineSetting } from 'react-icons/ai';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from "react-to-print";
import { Link } from 'react-router-dom';
import Qrcodegenerate from './Qrcode';
import Qrcodegeneratesize2 from './Qrcodesize2';
import Qrcodegeneratesize3 from './Qrcodesize3';
import Qrcodegeneratesize4 from './Qrcodesize4';
import ClearIcon from '@mui/icons-material/Clear';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function Stockcreatetable() {

    const { auth, setngs } = useContext(AuthContext);
    //checkbox select single qr section
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isQrCodePreview, setIsQrCodePreview] = useState(false);
    const [productLabel, setProductLabel] = useState({ isProductLocation: true, isRrack: false, isRrackProductCode:true, isProductCode: false,isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false,isProductShortnameCategorySubcategory:true, isProductSize:false, isProductBrand:false, isProductSubBrand:false, isProductSizeSubbrand:false, isProductBrandSubbrand:false, isProductSizeBrand: false, isProductSizeBrandSubbrand:true, isProductNumberAlpha:true, isNumber: false, isAlpha:false, isProductSellingPrice: true, isProductDiscPrice: true });
    const componentRef = useRef();
    const [openModal, setOpenModal] = useState(false)
    const [pursData, setPursData] = useState([]);
    const [categoriesCount, setCategoriesCount] = useState(0);
    // check all checkbox selected
    const [checkAll, setCheckAll] = useState(false)
    const [currectqtydata, setcurrectqtydata] = useState({currentstock:0});
    const [checkAllData, setCheckAllData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [trail, setTrail] = useState([]);
    const [isStockId, setIsStockId] = useState([]);
    // Access
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    //sorting
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    const id = useParams().id;
    const qty = useParams().qty;

    // print label modal
    const handleOpenModal = () => { setOpenModal(true); };
    const handleCloseModal = () => { setOpenModal(false); };

    //get products
    const fetchHandler = async () => {
        try {
            const [
                respurchase,
                resadjustment
            ] = await Promise.all([
                axios.post(SERVICE.PURCHASEPRODUCTS, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    role: String(isUserRoleAccess.role),
                    userassignedlocation: [isUserRoleAccess.businesslocation],
                    productid: String(id)
                }),
                axios.post(SERVICE.STOCKADJUSTPRODUCTS, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    role: String(isUserRoleAccess.role),
                    userassignedlocation: [isUserRoleAccess.businesslocation],
                    productid: String(id)            
                })
            ])

            let result = respurchase?.data?.purchasesproducts.map((data, index)=>{
                let resdata = data;
                let adjustmentarr = [];
                let resadjust = resadjustment?.data?.stockproducts.forEach((value, indexvalue)=>{
                    if(data.sku == value.sku && data.supplier == value.supplier){
                        adjustmentarr.push(value.adjustmentcount)
                    }
                })
                let sum = 0;
                if(adjustmentarr.length > 0){
                    for(let i = 0; i < adjustmentarr.length; i++)
                    {
                        sum = +sum + +adjustmentarr[i];
                    }
                    return resdata = {...data, adjustquantity:Number(sum)}
                }else{
                    return resdata = {...data, adjustquantity:Number(sum)}
                }
            })
            
            setPursData(result);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    // get all stock data
    const fetchHandleStock = async () => {
        try {
            var res = await axios.post(SERVICE.STOCKPRODUCTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation],
                productid: String(id)
            });
            await getAllStockId(res?.data?.stockproducts);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const fetchCategory = async (productcategories) => {
        try {
          let res = await axios.post(SERVICE.STOCKPRODUCTCATEGORIES, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            businessid: String(setngs.businessid),
            productcategory:String(productcategories.category),
            productlocation:String(productcategories.businesslocation),
            productsubcategory:String(productcategories.subcategory)
          });

          console.log(productcategories.category,'cat')
          console.log(productcategories.subcategory,'sub')
    
          let result = res?.data?.products;
    
          let satisfyingArray = [];
          let remainingArray = [];
          
          for (let i = 0; i < result.length; i++) {
            if (result[i].sku === productcategories.sku) {
              satisfyingArray = result.slice(0, i + 1); 
              remainingArray = result.slice(i + 1);    
              break; 
            }
          }
          
          if (satisfyingArray.length === 0) {
            remainingArray = result;
          }

          let sumOfCurrentStock = satisfyingArray
      .filter(data => data.sku !== id)
      .reduce((accumulator, data) => accumulator + data.currentstock, 0);
        
        console.log(result,'result')
        console.log(sumOfCurrentStock,'sumOfCurrentStock')
        console.log(remainingArray,'remainingArray')
        console.log(satisfyingArray,'satisfyingArray')
        setCategoriesCount(sumOfCurrentStock);
        } catch (err) {
          const messages = err?.response?.data?.message;
          if (messages) {
            toast.error(messages);
          } else {
            toast.error("Something went wrong!")
          }
        }
      };

    const fetchProduct = async () => {
        try {
            var res = await axios.post(SERVICE.PRODUCTSINGLESTOCK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation],
                productid: String(id),
            });
            setcurrectqtydata(res?.data?.productssinglestocks[0])
            await fetchCategory(res?.data?.productssinglestocks[0]);
        } catch (err) {
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
            let addCateItems = [];
            let counter = 0
            console.log(currectqtydata.currentstock,'currectqtydata')
            let currentcatcount = Number(categoriesCount);
            let finalcurrentstock = Number(currectqtydata.currentstock) + Number(categoriesCount)
            console.log(finalcurrentstock,'finalcurrentstock')
            console.log(finalcurrentstock,'finalcurrentstock')
            pursData &&
                (pursData?.map((row, index) => {
                    let totalqty = Number(Number(row.quantitytotalpieces) - Number(row.adjustquantity)) + +row.freeitemtotalpieces;
                    for (let i = 0; i <= totalqty; i++) {
                        if (counter == qty) {
                            counter = 1
                        } else {
                            counter++;
                        }
                        addCateItems.push({ 
                            sn: sno++, 
                            no: counter, 
                            snno:newsno++,
                            id: row?.id, 
                            sku: row?.sku, 
                            currentcategorystock: currentcatcount <= finalcurrentstock ? currentcatcount++ : currentcatcount++,
                            productname: row?.prodname, 
                            stockid: row?.prodname?.slice(0, 3).toUpperCase() + "_" + row?.supplier?.slice(0, 3).toUpperCase() + "_" + moment(row?.date).format('DDMMYYYY') + (autono < 10 ? '0' + autono++ : autono++), 
                            cost: row?.purchaseexcludetax, 
                            sellingprice: currectqtydata?.sellingpricetax == "None" ? row?.sellingpriceunitwithoutcost : row?.sellingpriceunitcost, 
                            date: row?.date, 
                            alpharate: row?.excalpha, 
                            supplier: row?.supplier, 
                            suppliershortname: row?.suppliershortname, 
                            applicabletax: row?.hsn ? row?.hsn : row?.applicabletax, 
                            sellingpricetax: row?.sellingpricetax, 
                            labelstatus: 'Yet to Print', 
                            salestatus: 'Available', 
                            category: currectqtydata?.categoryshotname, 
                            subcategory: currectqtydata?.subcategryshotname, 
                            rack: currectqtydata?.rack, 
                            brand: currectqtydata?.brandshotname, 
                            subbrand: currectqtydata?.subbrandshotname, 
                            size: currectqtydata?.size, 
                            businesslocation: currectqtydata?.businesslocation,
                            businessname: setngs?.businessname,
                        })
                    }
                }
                ));
             
                setAllData(addCateItems);
            setCheckAllData(addCateItems);
        }, [pursData,categoriesCount]
    )

    // print function
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: "print",
    });

    useEffect(() => {
        let addCateItems = []
        selectedItems.forEach((item) => {
            if (item.sku == currectqtydata?.sku) {
                return addCateItems.push({ ...item, 
                    category: currectqtydata?.categoryshotname, 
                    subcategory: currectqtydata?.subcategryshotname, 
                    rack: currectqtydata?.rack, 
                    brand: currectqtydata?.brandshotname,
                    subbrand: currectqtydata?.subbrandshotname, 
                    size: currectqtydata?.size, 
                    businesslocation: currectqtydata?.businesslocation, 
                    businessname: setngs?.businessname, 
                })
            }
        })
     
        setTrail(addCateItems);
    }, [selectedItems]);

    // single checkbox value in qr section
    const checkValue = (id, sku, name, alpharate, sellprice, stockid, sn, applicabletax, sellingpricetax, labelstatus, salestatus, supplier, suppliershortname) => {
        if (selectedIds.includes(id)) { //this used to unchecked the checkbox
            let removeUnchekedId = selectedIds.filter((checkedId)=> {
                return id != checkedId;
            });
            let removeUncheckedItem = selectedItems.filter((checkedItems)=> {
                return id != checkedItems.id;
            })
            setSelectedIds(removeUnchekedId);
            setSelectedItems(removeUncheckedItem);    
        }
        else { //this used to make checked the checkbox
            setSelectedIds((ids)=> {
                return [...ids,id];
            });
            setSelectedItems((checkedItems) => {
                return [
                    ...checkedItems,
                    {
                        id: id, 
                        sku: sku, 
                        productname: name, 
                        supplier: supplier,
                        suppliershortname: suppliershortname,
                        alpharate: alpharate, 
                        sellingprice: sellprice, 
                        stockid: stockid, 
                        snno: sn, 
                        applicabletax: applicabletax, 
                        sellingpricetax: sellingpricetax, 
                        labelstatus: labelstatus, 
                        salestatus: salestatus,
                    },
                ]
            });

        }
        let result = checkAllData.filter((data, index)=>{
            return id != index;
        })

        setCheckAllData(result)
    };

    // store product data
    const sendRequest = async () => {
        let changecheckedlabel = checkAll ? [...checkAllData] : [...trail]
        let getallcheckdata = changecheckedlabel.map((value) => {
            return { ...value, labelstatus: 'Printed'}
        })

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.STOCK_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                products: [...getallcheckdata],
                assignbusinessid: String(setngs.businessid),
            });
            handleprint();
            handleCloseModal();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const getAllStockId = (stockdata) => {
        let getid = stockdata.map((data) => {
            return data.stockid
        })
        setIsStockId(getid)
    }

    //label status set printed and fetch from db
    const checkAllLabelStatus = (stockIdvalue) => {
        let printLabel;
        if (isStockId) {
            if (isStockId.includes(stockIdvalue)) {
                return 'Printed'
            } else {
                return 'Yet to Print'
            }
        } else {
            return 'Yet to Print'
        }
    }

    const handleChange = (checkvalue) =>{
        if(checkvalue){
            let result = allData.map((data, index)=>{
                return index
            })
            setSelectedIds(result)
        }else{
            setSelectedIds([]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest();
    };

    useEffect(() => {
        fetchHandler();
        fetchHandleStock();
        fetchProduct();
    }, []);

    let sno = 1;
    let newsno = 1;
    let autono = 1;

    //table sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = allData.sort((a, b) => {
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

    const filteredDatas = allData.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <Box>
            <Headtitle title={'Add stock'} />
            {/* Table */}
            <Box sx={userStyle.container}>
                <Grid container >
                    <Grid>
                        <Link to="/product/stock/list"><Button sx={userStyle.buttoncancel} type='button'>BACK</Button></Link>
                        <Button sx={userStyle.buttonadd} onClick={(e) => handleOpenModal(true)} disableRipple >Print Label</Button>
                    </Grid>
                </Grid><br />
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>View Stock Logs</Typography>
                    </Grid>
                </Grid><br /><br />
                <Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="stocktable">
                            <TableHead>
                                <TableRow align="left">
                                    <StyledTableCell>
                                        <input
                                            type="checkbox"
                                            onChange={(e)=> {handleChange(e.target.checked);setCheckAll(!checkAll);}}
                                            checked={checkAll}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('sn')}><Box sx={userStyle.tableheadstyle}><Box>No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sn')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('no')}><Box sx={userStyle.tableheadstyle}><Box>Stock #</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('no')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Product Id</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('cost')}><Box sx={userStyle.tableheadstyle}><Box>Cost</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('cost')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('sellingprice')}><Box sx={userStyle.tableheadstyle}><Box>Selling Price</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sellingprice')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('stockid')}><Box sx={userStyle.tableheadstyle}><Box>Stock Product Id</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('stockid')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('alpharate')}><Box sx={userStyle.tableheadstyle}><Box>Alpha Rate</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('alpharate')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('supplier')}><Box sx={userStyle.tableheadstyle}><Box>Supplier</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('supplier')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('date')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('date')}</Box></Box></StyledTableCell>
                                    <StyledTableCell>Label Status</StyledTableCell>
                                    <StyledTableCell>Sell Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDatas &&
                                    (filteredDatas.map((row, index) => (
                                        <>
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">
                                                    <input
                                                        type="checkbox"
                                                        name="nr1"
                                                        onChange ={() => checkValue(index, row.sku, row.productname, row.alpharate, row.sellingprice, row.stockid, row.sn, row.applicabletax, row.sellingpricetax, row.labelstatus, row.salestatus, row.supplier, row.suppliershortname)}
                                                        checked={checkAll ? selectedIds.includes(index) : selectedIds.includes(index)  }
                                                    />

                                                </StyledTableCell>
                                                <StyledTableCell align="left">{(row.no < 10 ? '0' + row.no : row.no)}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sn}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sku}</StyledTableCell>
                                                <StyledTableCell align="left">{row.currentcategorystock}</StyledTableCell>
                                                <StyledTableCell align="left">{row.productname}</StyledTableCell>
                                                <StyledTableCell align="left">{row.cost}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sellingprice}</StyledTableCell>
                                                <StyledTableCell align="left">{row.stockid}</StyledTableCell>
                                                <StyledTableCell align="left">{row.alpharate}</StyledTableCell>
                                                <StyledTableCell align="left">{row.supplier}</StyledTableCell>
                                                <StyledTableCell align="left">{moment(row?.date).format('DD-MM-YYYY')}</StyledTableCell>
                                                <StyledTableCell align="left"><Button size="small" variant='contained' sx={{ padding: '0px 2px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9' }} color={checkAllLabelStatus(row?.stockid) == "Yet to Print" ? "error" : "success"}>{checkAllLabelStatus(row?.stockid)}</Button></StyledTableCell>
                                                <StyledTableCell align="left"><Button size="small" variant='contained' sx={{ padding: '0px 2px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9' }} color={row?.salestatus == "Available" ? "info" : "warning"}>{row?.salestatus}</Button></StyledTableCell>
                                            </StyledTableRow>
                                        </>
                                    ))
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            {/* Print label Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogContent sx={userStyle.filtercontentpopup}>
                    <DialogContentText id="printLabel">
                        <Box >
                            {/* label informations */}
                            <Typography sx={userStyle.importheadtext}>Information to show in Labels</Typography><br /><br />
                            <Box>
                                <form action=''>
                                    <Grid container>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <Grid sx={{ display: 'flex' }}  >
                                                <Grid sx={userStyle.spanIconTax}><AiOutlineSetting /></Grid>
                                                <FormControl size="small" fullWidth sx={userStyle.formfield}>
                                                    <InputLabel id="demo-select-small">Paper Size</InputLabel>
                                                    <Select
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        label="Paper Size"
                                                        value={productLabel.barcodesetting}
                                                        onChange={(event) => { setProductLabel({ ...productLabel, barcodesetting: event.target.value }) }}
                                                        fullWidth
                                                    >
                                                        <MenuItem value="size1">Label Size: 35mm<ClearIcon sx={{ fontSize: '12px' }} />22mm</MenuItem>
                                                        <MenuItem value="size2">label Size: 25mm<ClearIcon sx={{ fontSize: '12px' }} />25mm</MenuItem>
                                                        <MenuItem value="size3">label Size: 25mm<ClearIcon sx={{ fontSize: '12px' }} />20mm</MenuItem>
                                                        <MenuItem value="size4">label Size: 50mm<ClearIcon sx={{ fontSize: '12px' }} />20mm</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid><br /><br />
                                    {productLabel.barcodesetting === "size1" ?
                                        (
                                            <>
                                                <Grid container>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductSellingPrice} onClick={(e) => setProductLabel({ ...productLabel, isProductSellingPrice: !productLabel.isProductSellingPrice })} />} label="Selling Price" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="rackprodcode"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="rackprodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrackProductCode: true, isRrack:false, isProductCode:false })}/>} label="Rack & Product Code" />
                                                                <FormControlLabel value="rack" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrack: true, isProductCode:false, isRrackProductCode:false})}/>} label="Rack" />
                                                                <FormControlLabel value="prodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCode: true, isRrack:false, isRrackProductCode:false })}/>} label="Product Code" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="numberalpha"
                                                                name="radio-buttons-group"
                                                            >
                                                               <FormControlLabel value="numberalpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:true, isNumber: false, isAlpha:false})}/>} label="Number & Alpharate" /> 
                                                                <FormControlLabel value="number" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: true, isAlpha:false})}/>} label="Number" />
                                                                <FormControlLabel value="alpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: false, isAlpha:true})}/>} label="Alpharate" />
                                                                
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="sizebrandsub"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="sizebrandsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrandSubbrand: true, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false,})}/>} label="Size & Brand & Subbrand" />
                                                                <FormControlLabel value="size" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSize: true, isProductSizeBrandSubbrand: false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size" />
                                                                <FormControlLabel value="brand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand" />
                                                                <FormControlLabel value="subbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSubBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSizeBrand:false, })}/>} label="Subbrand" />
                                                                <FormControlLabel value="sizebrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false, })}/>} label="Size & Brand" />
                                                                <FormControlLabel value="sizesubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size & Subbrand" />
                                                                <FormControlLabel value="brandsubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrandSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand & Subbrand" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="supcatsub"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="supcatsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameCategorySubcategory: true, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false,})}/>} label="Supplier Shortname & Category & Subcategory" />
                                                                <FormControlLabel value="cat" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Category" />
                                                                <FormControlLabel value="sub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Subcategory" />
                                                                <FormControlLabel value="sup" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSupplierShortname: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname" />
                                                                <FormControlLabel value="catsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCategorySubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Category & Subcategory" />
                                                                <FormControlLabel value="supcat" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameCategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname & Category" />
                                                                <FormControlLabel value="supsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameSubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname & Subcategory" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                    {/* <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductDiscPrice} onClick={(e) => setProductLabel({...productLabel, isProductDiscPrice:!productLabel.isProductDiscPrice})}  />} label="Discounted Price" />
                                                    </FormGroup>
                                                </Grid> */}
                                                </Grid>
                                            </>
                                        ) :
                                        (
                                            productLabel.barcodesetting === "size2" ?
                                                (
                                                    <>
                                                        <Grid container>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductSellingPrice} onClick={(e) => setProductLabel({ ...productLabel, isProductSellingPrice: !productLabel.isProductSellingPrice })} />} label="Selling Price" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormControl>
                                                                        <RadioGroup
                                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                                        defaultValue="rackprodcode"
                                                                        name="radio-buttons-group"
                                                                    >
                                                                        <FormControlLabel value="rackprodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrackProductCode: true, isRrack:false, isProductCode:false })}/>} label="Rack & Product Code" />
                                                                        <FormControlLabel value="rack" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrack: true, isProductCode:false, isRrackProductCode:false})}/>} label="Rack" />
                                                                        <FormControlLabel value="prodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCode: true, isRrack:false, isRrackProductCode:false })}/>} label="Product Code" />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                            <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="numberalpha"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="numberalpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:true, isNumber: false, isAlpha:false})}/>} label="Number & Alpharate" /> 
                                                                <FormControlLabel value="number" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: true, isAlpha:false})}/>} label="Number" />
                                                                <FormControlLabel value="alpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: false, isAlpha:true})}/>} label="Alpharate" />
                                                                                                                               
                                                            </RadioGroup>
                                                        </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                            <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="sizebrandsub"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="sizebrandsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrandSubbrand: true, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false,})}/>} label="Size & Brand & Subbrand" />
                                                                <FormControlLabel value="size" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSize: true, isProductSizeBrandSubbrand: false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size" />
                                                                <FormControlLabel value="brand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand" />
                                                                <FormControlLabel value="subbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSubBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSizeBrand:false, })}/>} label="Subbrand" />
                                                                <FormControlLabel value="sizebrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false, })}/>} label="Size & Brand" />
                                                                <FormControlLabel value="sizesubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size & Subbrand" />
                                                                <FormControlLabel value="brandsubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrandSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand & Subbrand" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                            <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="supcatsub"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="supcatsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameCategorySubcategory: true, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false,})}/>} label="Supplier Shortname & Category & Subcategory" />
                                                                <FormControlLabel value="cat" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Category" />
                                                                <FormControlLabel value="sub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Subcategory" />
                                                                <FormControlLabel value="sup" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSupplierShortname: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname" />
                                                                <FormControlLabel value="catsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCategorySubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Category & Subcategory" />
                                                                <FormControlLabel value="supcat" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameCategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname & Category" />
                                                                <FormControlLabel value="supsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameSubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname & Subcategory" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ) : productLabel.barcodesetting === "size3" ?
                                                    (
                                                        <>
                                                            <Grid container>
                                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                    <FormGroup>
                                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                    <FormGroup>
                                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductSellingPrice} onClick={(e) => setProductLabel({ ...productLabel, isProductSellingPrice: !productLabel.isProductSellingPrice })} />} label="Selling Price" />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                    <FormControl>
                                                                    <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="rackprodcode"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="rackprodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrackProductCode: true, isRrack:false, isProductCode:false })}/>} label="Rack & Product Code" />
                                                                <FormControlLabel value="rack" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrack: true, isProductCode:false, isRrackProductCode:false})}/>} label="Rack" />
                                                                <FormControlLabel value="prodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCode: true, isRrack:false, isRrackProductCode:false })}/>} label="Product Code" />
                                                            </RadioGroup>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="numberalpha"
                                                                name="radio-buttons-group"
                                                            >
                                                               <FormControlLabel value="numberalpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:true, isNumber: false, isAlpha:false})}/>} label="Number & Alpharate" /> 
                                                                <FormControlLabel value="number" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: true, isAlpha:false})}/>} label="Number" />
                                                                <FormControlLabel value="alpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: false, isAlpha:true})}/>} label="Alpharate" />
                                                                
                                                            </RadioGroup>
                                                        </FormControl>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="sizebrandsub"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="sizebrandsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrandSubbrand: true, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false,})}/>} label="Size & Brand & Subbrand" />
                                                                <FormControlLabel value="size" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSize: true, isProductSizeBrandSubbrand: false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size" />
                                                                <FormControlLabel value="brand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand" />
                                                                <FormControlLabel value="subbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSubBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSizeBrand:false, })}/>} label="Subbrand" />
                                                                <FormControlLabel value="sizebrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false, })}/>} label="Size & Brand" />
                                                                <FormControlLabel value="sizesubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size & Subbrand" />
                                                                <FormControlLabel value="brandsubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrandSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand & Subbrand" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ) : <>
                                                        <Grid container>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductSellingPrice} onClick={(e) => setProductLabel({ ...productLabel, isProductSellingPrice: !productLabel.isProductSellingPrice })} />} label="Selling Price" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormControl>
                                                                <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="rackprodcode"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="rackprodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrackProductCode: true, isRrack:false, isProductCode:false })}/>} label="Rack & Product Code" />
                                                                <FormControlLabel value="rack" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isRrack: true, isProductCode:false, isRrackProductCode:false})}/>} label="Rack" />
                                                                <FormControlLabel value="prodcode" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCode: true, isRrack:false, isRrackProductCode:false })}/>} label="Product Code" />
                                                            </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                            <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="numberalpha"
                                                                name="radio-buttons-group"
                                                            >
                                                               <FormControlLabel value="numberalpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:true, isNumber: false, isAlpha:false})}/>} label="Number & Alpharate" /> 
                                                                <FormControlLabel value="number" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: true, isAlpha:false})}/>} label="Number" />
                                                                <FormControlLabel value="alpha" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha:false, isNumber: false, isAlpha:true})}/>} label="Alpharate" />
                                                                
                                                            </RadioGroup>
                                                        </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                            <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="sizebrandsub"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="sizebrandsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrandSubbrand: true, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false,})}/>} label="Size & Brand & Subbrand" />
                                                                <FormControlLabel value="size" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSize: true, isProductSizeBrandSubbrand: false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size" />
                                                                <FormControlLabel value="brand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand" />
                                                                <FormControlLabel value="subbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSubBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSizeBrand:false, })}/>} label="Subbrand" />
                                                                <FormControlLabel value="sizebrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false, })}/>} label="Size & Brand" />
                                                                <FormControlLabel value="sizesubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSizeSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductBrandSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Size & Subbrand" />
                                                                <FormControlLabel value="brandsubbrand" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductBrandSubbrand: true, isProductSizeBrandSubbrand: false, isProductSize:false, isProductSizeSubbrand:false, isProductBrand:false, isProductSubBrand:false,isProductSizeBrand:false, })}/>} label="Brand & Subbrand" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                            <FormControl>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue="supcatsub"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel value="supcatsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameCategorySubcategory: true, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false,})}/>} label="Supplier Shortname & Category & Subcategory" />
                                                                <FormControlLabel value="cat" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Category" />
                                                                <FormControlLabel value="sub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Subcategory" />
                                                                <FormControlLabel value="sup" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductSupplierShortname: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname" />
                                                                <FormControlLabel value="catsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductCategorySubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Category & Subcategory" />
                                                                <FormControlLabel value="supcat" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameCategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameSubcategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname & Category" />
                                                                <FormControlLabel value="supsub" control={<Radio onClick={(e) => setProductLabel({ ...productLabel, isProductShortnameSubcategory: true, isProductShortnameCategorySubcategory: false, isProductShortnameCategory:false, isProductCategory:false, isProductSubcategory:false, isProductSupplierShortname:false, isProductCategorySubcategory:false, })}/>} label="Supplier Shortname & Subcategory" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                            </Grid>
                                                            {/* <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductDiscPrice} onClick={(e) => setProductLabel({...productLabel, isProductDiscPrice:!productLabel.isProductDiscPrice})} />} label="Discounted Price" />
                                                                </FormGroup>
                                                            </Grid> */}
                                                        </Grid>
                                                    </>
                                        )
                                    }<br /><br />
                                    <Grid container sx={{ marginTop: '20px', justifyContent: 'center' }}>
                                        <Grid>
                                            <Button sx={userStyle.buttonadd} onClick={(e) => { handleSubmit(e) }}>PRINT</Button>
                                            <Button sx={userStyle.buttonadd} onClick={(e) => setIsQrCodePreview(true)}>PREVIEW</Button>
                                        </Grid>
                                    </Grid>
                                </form><br /><br />
                                {/* print label qr section start */}
                                <div ref={componentRef} style={{ padding: 0, margin: 0, }}>
                                    < Grid container columnSpacing={1} sx={{ display: 'flex', padding: 0, backgroundColor: 'white', }} width="645px">
                                        {productLabel.barcodesetting === "size1" ?
                                            (
                                                isQrCodePreview &&
                                                (() => {
                                                    let rows = [];
                                                    checkAll ? (
                                                        checkAllData.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid md={3.5} sx={{ margin: 0, padding: '0 0 0 2px', width: '200px', height: '110px' }}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}><Qrcodegenerate getProductData={value} productLabel={productLabel} /></Box>
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    ) : (
                                                        trail.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={3.5} sx={{ margin: 0, padding: '0 0 0 2px', width: '200px', height: '110px' }}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}><Qrcodegenerate getProductData={value} productLabel={productLabel} /></Box>
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    )

                                                    return rows;
                                                })()
                                            ) : productLabel.barcodesetting === "size2" ? (
                                                isQrCodePreview &&
                                                (() => {
                                                    let rows = [];
                                                    checkAll ? (
                                                        checkAllData.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={3} sx={{ margin: 0, padding: 0, width: '137px', height: '124px' }}>
                                                                        <Qrcodegeneratesize2 getProductData={value} productLabel={productLabel} />
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    ) : (
                                                        trail.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={3} sx={{ margin: 0, padding: 0, width: '137px', height: '124px' }}>
                                                                        <Qrcodegeneratesize2 getProductData={value} productLabel={productLabel} />
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    )

                                                    return rows;
                                                })()
                                            ) : productLabel.barcodesetting === "size3" ? (
                                                isQrCodePreview &&
                                                (() => {
                                                    let rows = [];
                                                    checkAll ? (
                                                        checkAllData.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={3} sx={{ marginTop: '0', paddingTop: '0', width: '137px', height: '130px' }}>
                                                                        <Qrcodegeneratesize3 getProductData={value} productLabel={productLabel} />
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    ) : (
                                                        trail.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={3} sx={{ marginTop: '0', paddingTop: '-0', width: '137px', height: '130px' }}>
                                                                        <Qrcodegeneratesize3 getProductData={value} productLabel={productLabel} />
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    )

                                                    return rows;
                                                })()
                                            ) : productLabel.barcodesetting === "size4" ? (
                                                isQrCodePreview &&
                                                (() => {
                                                    let rows = [];
                                                    checkAll ? (
                                                        checkAllData.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={6} sx={{ marginTop: '0', paddingTop: '0', width: '275px', height: '130px' }}>
                                                                        <Qrcodegeneratesize4 getProductData={value} productLabel={productLabel} />
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    ) : (
                                                        trail.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={6} sx={{ marginTop: '0', paddingTop: '0', width: '275px', height: '130px' }}>
                                                                        <Qrcodegeneratesize4 getProductData={value} productLabel={productLabel} />
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    )

                                                    return rows;
                                                })()) : null
                                        }
                                    </Grid>
                                </div>
                                {/* print label qr section end */}
                            </Box>
                        </Box><br /><br />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseModal}>CLOSE</Button>
                </DialogActions>
            </Dialog>
            {/* Print label Modal Ends */}
        </Box>
    );
}

const Stockcreate = () => {
    return (
        <>
            <Stockcreatetable /><br /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default Stockcreate;