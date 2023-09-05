import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, MenuItem, Select, Dialog, Checkbox, FormGroup, FormControl, InputLabel, FormControlLabel, DialogActions, DialogContent, DialogContentText, Button, Grid, Typography, Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { useParams } from 'react-router-dom';
import { AiOutlineSetting } from 'react-icons/ai';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from "react-to-print";
import Qrcodegenerate from './Qrcode';
import Qrcodegeneratesize2 from './Qrcodesize2';
import Qrcodegeneratesize3 from './Qrcodesize3';
import Qrcodegeneratesize4 from './Qrcodesize4';
import ClearIcon from '@mui/icons-material/Clear';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Stockcreatetable() {

    const { auth, setngs } = useContext(AuthContext);
    //checkbox select single qr section
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isQrCodePreview, setIsQrCodePreview] = useState(false);
    const [productLabel, setProductLabel] = useState({ isProductLocation: true, isProductCode: true, isProductCategorySubcategory: true, isProductSizeBrand: true, isProductNumberAlpha: true, isProductSellingPrice: true, isProductDiscPrice: true });
    const componentRef = useRef();
    const [openModal, setOpenModal] = useState(false)
    const [pursData, setPursData] = useState([]);
    // check all checkbox selected
    const [checkAll, setCheckAll] = useState(false)
    const [currectqtydata, setcurrectqtydata] = useState({});
    const [checkAllData, setCheckAllData] = useState([]);
    const [trail, setTrail] = useState([]);
    const [addStock, setAddStock] = useState();
    const [isStockId, setIsStockId] = useState();
    // Access
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);

    let sno = 1;
    let autono = 1;
    const id = useParams().id;
    const qty = useParams().qty;
    // print label modal
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    //get products
    const fetchHandler = async () => {
        try {

            var res = await axios.post(SERVICE.PURCHASEPRODUCTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation],
                productid: String(id)
            });
            setPursData(res?.data?.purchasesproducts.reverse());
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

    const fetchProduct = async () => {
        try {
            var res = await axios.post(SERVICE.PRODUCTSINGLESTOCK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation],
                productid: String(id)
            });

            setcurrectqtydata(res?.data?.productssinglestocks[0])
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
            let addCateItems = []
            let counter = 0
            pursData &&
                (pursData?.map((row, index) => {

                    let totalqty = +row.quantity + +row.freeitem;
                    for (let i = 1; i <= totalqty; i++) {
                        if (counter == qty) {
                            counter = 1
                        } else {
                            counter++;
                        }
                        addCateItems.push({ sn: sno++, no: counter, id: row.id, sku: row.sku, productname: row.prodname, stockid: row.prodname?.slice(0, 3).toUpperCase() + "_" + row.supplier?.slice(0, 3).toUpperCase() + "_" + moment(row.purchasedate).format('DDMMYYYY') + (autono < 10 ? '0' + autono++ : autono++), cost: row.purchaseexcludetax, sellingprice: row.sellingpriceunitcost, date: row.date, alpharate: row.excalpha, supplier: row.supplier, applicabletax: row.hsn ? row.hsn : row.applicabletax, sellingpricetax: row.sellingpricetax, labelstatus: 'Yet to print', sellstatus: 'Available', category: currectqtydata?.category, subcategory: currectqtydata?.subcategory, rack: currectqtydata?.rack, brand: currectqtydata?.brand, size: currectqtydata?.size, businessname: setngs?.businessname })
                    }
                }
                ));
            setCheckAllData(addCateItems);
        }, [pursData]
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
                return addCateItems.push({ ...item, category: currectqtydata?.category, subcategory: currectqtydata?.subcategory, rack: currectqtydata?.rack, brand: currectqtydata?.brand, size: currectqtydata?.size, businesslocation: currectqtydata?.businesslocation, businessname: setngs?.businessname, })
            }
        })
        setTrail(addCateItems);
    }, [selectedItems]);

    // single checkbox value in qr section
    const checkValue = (id, sku, name, alpharate, sellprice, stockid, no, applicabletax, sellingpricetax, labelstatus, salestatus) => {
        if (selectedIds.includes(id)) { //this used to unchecked the checkbox
            let removeUnchekedId = selectedIds.filter((checkedId) => {
                return id != checkedId;
            });
            let removeUncheckedItem = selectedItems.filter((checkedItems) => {
                return id != checkedItems.id;
            })
            setSelectedIds(removeUnchekedId);
            setSelectedItems(removeUncheckedItem);
        }
        else { //this used to make checked the checkbox
            setSelectedIds((ids) => {
                return [...ids, id];
            });
            setSelectedItems((checkedItems) => {
                return [...checkedItems, { id: id, sku: sku, productname: name, alpharate: alpharate, sellingprice: sellprice, stockid: stockid, no: no, applicabletax: applicabletax, sellingpricetax: sellingpricetax, labelstatus: labelstatus, salestatus: salestatus }];
            })
        }
    }

    // store product data
    const sendRequest = async () => {

        let changecheckedlabel = checkAll ? [...checkAllData] : [...trail]
        let getallcheckdata = changecheckedlabel.map((value) => {
            return { labelstatus: 'Printed', alpharate: value.alpharate, applicabletax: value.applicabletax, brand: value.brand, businesslocation: value.businesslocation, businessname: value.businessname, category: value.category, id: value.id, no: value.no, productname: value.productname, salestatus: value.salestatus, sellingprice: value.sellingprice, sellingpricetax: value.sellingpricetax, size: value.size, sku: value.sku, stockid: value.stockid, subcategory: value.subcategory }
        })

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.STOCK_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                products: [...getallcheckdata],
                assignbusinessid: String(setngs.businessid),
            });
            setAddStock(PRODUCT_REQ.data);
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
        if(isStockId.length > 0){
            if (isStockId.includes(stockIdvalue)) {
                return 'Printed'
            } else {
                return 'Yet to Print'
            }
        }else {
            return 'Yet to Print'
        }
        
    }

    //label status set printed and fetch from db
    const checkAllSellStatus = (stockIdvalue) => {
        let printLabel;
        if(isStockId.length > 0){
            if (isStockId.includes(stockIdvalue)) {
                return 'Available'
            } else {
                return 'Available'
            }
        }else {
            return 'Available'
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
    }, [openModal]);

    return (
        <Box>
            <Headtitle title={'Add stock'} />
            {/* Table */}
            <Box sx={userStyle.container}>
                <Grid container >
                    <Grid >
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
                                            onChange={() => setCheckAll(!checkAll)}
                                            checked={checkAll}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>No</StyledTableCell>
                                    <StyledTableCell>Stock #</StyledTableCell>
                                    <StyledTableCell>Product Id</StyledTableCell>
                                    <StyledTableCell>Product Name</StyledTableCell>
                                    <StyledTableCell>Cost</StyledTableCell>
                                    <StyledTableCell>Selling Price</StyledTableCell>
                                    <StyledTableCell>Stock Product Id</StyledTableCell>
                                    <StyledTableCell>Alpha Rate</StyledTableCell>
                                    <StyledTableCell>Supplier</StyledTableCell>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Label Status</StyledTableCell>
                                    <StyledTableCell>Sell Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {checkAllData &&
                                    (checkAllData.map((row, index) => (
                                        <>
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">
                                                    <input
                                                        type="checkbox"
                                                        name="nr1"
                                                        onChange={() => checkValue(index, row.sku, row.productname, row.alpharate, row.sellingprice, row.stockid, row.sn, row.applicabletax, row.sellingpricetax, row.labelstatus, row.sellstatus)}
                                                        checked={checkAll ? true : selectedIds.includes(index)}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{(row.no < 10 ? '0' + row.no : row.no)}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sn}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sku}</StyledTableCell>
                                                <StyledTableCell align="left">{row.productname}</StyledTableCell>
                                                <StyledTableCell align="left">{row.cost}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sellingprice}</StyledTableCell>
                                                <StyledTableCell align="left">{row.stockid}</StyledTableCell>
                                                <StyledTableCell align="left">{row.alpharate}</StyledTableCell>
                                                <StyledTableCell align="left">{row.supplier}</StyledTableCell>
                                                <StyledTableCell align="left">{moment(row.date).utc().format('DD-MM-YYYY')}</StyledTableCell>
                                                <StyledTableCell align="left"><Button size="small" variant='contained' sx={{ padding: '0px 2px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9' }} color={checkAllLabelStatus(row.stockid) == "Yet to Print" ? "error" : "success"}>{checkAllLabelStatus(row.stockid)}</Button></StyledTableCell>
                                                <StyledTableCell align="left"><Button size="small" variant='contained' sx={{ padding: '0px 2px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9' }} color={checkAllSellStatus(row.stockid) == "Available" ? "info" : "warning"}>{checkAllSellStatus(row.stockid)}</Button></StyledTableCell>
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
                maxWidth="md"
            >
                <DialogContent>
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
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Rack & Product code" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductCategorySubcategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategorySubcategory: !productLabel.isProductCategorySubcategory })} />} label="Category & Subcategory" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductSizeBrand} onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: !productLabel.isProductSizeBrand })} />} label="Size & Brand" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductNumberAlpha} onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha: !productLabel.isProductNumberAlpha })} />} label="Number & Alpha Rate" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductSellingPrice} onClick={(e) => setProductLabel({ ...productLabel, isProductSellingPrice: !productLabel.isProductSellingPrice })} />} label="Selling Price" />
                                                        </FormGroup>
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
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Rack & Product code" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductCategorySubcategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategorySubcategory: !productLabel.isProductCategorySubcategory })} />} label="Category & Subcategory" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductSizeBrand} onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: !productLabel.isProductSizeBrand })} />} label="Size & Brand" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductNumberAlpha} onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha: !productLabel.isProductNumberAlpha })} />} label="Number & Alpha Rate" />
                                                                </FormGroup>
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
                                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Rack & Product code" />
                                                                    </FormGroup>
                                                                </Grid>
                                                                {/* <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                    <FormGroup>
                                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCategorySubcategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategorySubcategory: !productLabel.isProductCategorySubcategory })} />} label="Category & Subcategory" />
                                                                    </FormGroup>
                                                                </Grid> */}
                                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                    <FormGroup>
                                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductSizeBrand} onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: !productLabel.isProductSizeBrand })} />} label="Size & Brand" />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                    <FormGroup>
                                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductNumberAlpha} onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha: !productLabel.isProductNumberAlpha })} />} label="Number & Alpha Rate" />
                                                                    </FormGroup>
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
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Rack & Product code" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductCategorySubcategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategorySubcategory: !productLabel.isProductCategorySubcategory })} />} label="Category & Subcategory" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductSizeBrand} onClick={(e) => setProductLabel({ ...productLabel, isProductSizeBrand: !productLabel.isProductSizeBrand })} />} label="Size & Brand" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductNumberAlpha} onClick={(e) => setProductLabel({ ...productLabel, isProductNumberAlpha: !productLabel.isProductNumberAlpha })} />} label="Number & Alpha Rate" />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox checked={productLabel.isProductSellingPrice} onClick={(e) => setProductLabel({ ...productLabel, isProductSellingPrice: !productLabel.isProductSellingPrice })} />} label="Selling Price" />
                                                                </FormGroup>
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
                                    < Grid container columnSpacing={1} sx={{ display:'flex',padding: '10px 10px 10px -50px', backgroundColor: 'white', }} width="640px">
                                        {productLabel.barcodesetting === "size1" ?
                                            (
                                                isQrCodePreview &&
                                                (() => {
                                                    let rows = [];
                                                    checkAll ? (
                                                        checkAllData.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid md={3.5} sx={{ margin: 0, padding: '3px 0 0 0', width: '165px', height: '123px' }}>
                                                                        <Box sx={{display:'flex', justifyContent:'center'}}><Qrcodegenerate getProductData={value} productLabel={productLabel} /></Box>
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    ) : (
                                                        trail.forEach((value, index) => {
                                                            rows.push(
                                                                <>
                                                                    <Grid item md={4} sx={{ margin: 0, padding: '3px 0 0 0', width: '195px', height: '123px' }}>
                                                                        <Box sx={{display:'flex', justifyContent:'center'}}><Qrcodegenerate getProductData={value} productLabel={productLabel} /></Box>
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
            <Box>
                <Navbar /><br /><br /><br /><br />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" className='content'>
                        <Stockcreatetable /><br /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Stockcreate;