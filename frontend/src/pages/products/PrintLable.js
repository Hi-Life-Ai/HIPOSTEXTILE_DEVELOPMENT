import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, FormGroup, FormControlLabel, Select, MenuItem, Dialog, DialogContent, DialogActions, Table, TableBody, TableContainer, TableHead, Typography, Checkbox, IconButton, Tooltip, Paper, Button, } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { AiOutlineSetting } from 'react-icons/ai';
import { userStyle } from '../PageStyle';
import Footer from '../../components/footer/Footer';
import ClearIcon from '@mui/icons-material/Clear';
import Selects from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import Headtitle from '../../components/header/Headtitle';
import axios from 'axios';
import Qrcodegenerate from './Qrcode';
import Qrcodegeneratesize2 from './Qrcodesize2';
import Qrcodegeneratesize3 from './Qrcodesize3';
import Qrcodegeneratesize4 from './Qrcodesize4';
import { useReactToPrint } from "react-to-print";
import { toast } from 'react-toastify';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';

function PrintLabellist() {

    const componentRef = useRef();
    const { auth, setngs } = useContext(AuthContext);
    const { isUserRoleAccess } = useContext(UserRoleAccessContext)
    // search data
    const [productsList, setProductsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    // search addressone
    const [getProductData, setGetProductData] = useState([]);
    const [isQrCodePreview, setIsQrCodePreview] = useState(false);
    const [productLabel, setProductLabel] = useState({ isProductLocation: true, isProductCode: true, isProductCategorySubcategory: true, isProductSizeBrand: true, isProductSellingPrice: true, isProductDiscPrice: true });

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    //   Products
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
            setProductsList(
                res?.data?.products?.map((d) => ({
                    ...d,
                    label: d.productname,
                    value: d.sku,
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

    const fetchDataProd = (e) => {

        setTableData((tableData) => [...tableData, { ...e, labelitem: "" }]);
    };

    // Delete Searched Product
    const deleteRow = (index, e) => {

        setTableData(tableData.filter((e, item) => item !== index));
    }

    const searchAdd = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setGetProductData([...getProductData, res?.data?.sproduct]);
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

    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: "print",
    });

    const multiplyQrlabel = (id, value) => {
        let labelItemTabledata = tableData.map((item, index) => {
            if (index == id) {
                return { ...item, labelitem: value }
            }
            else {
                return item;
            }
        })
        setTableData(labelItemTabledata);

    }
    useEffect(
        () => {
            fetchProducts();
        }, []
    )


    return (
        <Box>
            <Headtitle title={'Print Labels'} />
            <Typography sx={userStyle.HeaderText}>Print Labels&ensp;</Typography>
            {/* label card 1 start */}
            <Box sx={userStyle.container} style={{ minHeight: '300px' }}>
                <Typography sx={userStyle.importheadtext}>Add products to generate Labels</Typography><br /><br />
                <Grid container style={{ justifyContent: "center", }} sx={userStyle.textInput}>
                    <Grid md={8} sx={12} xs={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIcons}>< SearchOutlinedIcon />  </Grid>
                            <FormControl size="small" fullWidth >
                                <Selects
                                    options={productsList}
                                    onChange={(e) => {
                                        fetchDataProd(e)
                                        searchAdd(e._id)
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                <TableContainer component={Paper}>
                    <Table aria-label="customized table" id="">
                        <TableHead >
                            <StyledTableRow >
                                <StyledTableCell >Product name</StyledTableCell>
                                <StyledTableCell >Product code & Rack</StyledTableCell>
                                <StyledTableCell >No. of labels</StyledTableCell>
                                <StyledTableCell >Action</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {tableData && tableData.map((item, index) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell >{item.productname}</StyledTableCell>
                                        <StyledTableCell>{item.sku}</StyledTableCell>
                                        <StyledTableCell>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={item.labelitem}
                                                onChange={(e) => multiplyQrlabel(index, e.target.value)}
                                                type="number"
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell><AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(index, e)} /></StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer><br />
            </Box><br /><br />
            <Box sx={userStyle.container}>
                {/* label informations */}
                <Typography sx={userStyle.importheadtext}>Information to show in Labels</Typography><br /><br />
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIconTax}><AiOutlineSetting /></Grid>
                            <FormControl size="small" fullWidth sx={userStyle.formfield}>
                                <InputLabel id="demo-select-small">Label Size</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    label="Label Size"
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
                </Grid><br />
                <Box>
                    <form action=''>
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
                                                <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code & Rack" />
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
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code & Rack" />
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
                                            </Grid>
                                        </>
                                    ) : productLabel.barcodesetting === "size3" ?
                                        (
                                            <><Grid container>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code & Rack" />
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
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code & Rack" />
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
                        }
                        <br /><hr />
                        <Box sx={{ float: 'right' }}>
                            <Button sx={userStyle.buttonadd} onClick={handleprint}>PRINT</Button>
                            <Button sx={userStyle.buttonadd} onClick={(e) => setIsQrCodePreview(true)}>UPDATE</Button>
                        </Box><br />
                    </form>
                </Box>
            </Box><br /><br />

            <div ref={componentRef} style={{ padding: 0, margin: 0 }}>
                < Grid container columnSpacing={1} sx={{ padding: 0, backgroundColor: 'white', }} width="555px">
                    {isQrCodePreview &&
                        (() => {
                            let rows = [];
                            getProductData.forEach((value, index) => {

                                for (let i = 1; i <= Number(tableData[index]?.labelitem); i++) {
                                    rows.push(
                                        <>
                                            <Grid item md={4} sx={{ margin: 0, padding: 0, width: '170px', height: '123px' }} key={i}>
                                                {productLabel.barcodesetting === "size1" ? (
                                                    <>
                                                        <Qrcodegenerate getProductData={value} productLabel={productLabel} />
                                                    </>
                                                ) : productLabel.barcodesetting === "size2" ? (
                                                    <>
                                                        <Qrcodegeneratesize2 getProductData={value} productLabel={productLabel} />
                                                    </>
                                                ) : productLabel.barcodesetting === "size3" ? (
                                                    <>
                                                        <Qrcodegeneratesize3 getProductData={value} productLabel={productLabel} />
                                                    </>
                                                ) : productLabel.barcodesetting === "size4" ? (
                                                    <>
                                                        <Qrcodegeneratesize4 getProductData={value} productLabel={productLabel} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Qrcodegeneratesize4 getProductData={value} productLabel={productLabel} />
                                                    </>
                                                )}

                                            </Grid>
                                        </>
                                    )
                                }
                            })
                            return rows;
                        })
                            ()}
                </Grid>
            </div>

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

function PrintLabel() {
    return (
      <>
         <PrintLabellist /><br /><br /><br /><br />
                    <Footer />
      </>
    );
}

export default PrintLabel; 