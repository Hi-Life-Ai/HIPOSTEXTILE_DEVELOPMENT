import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, FormControl, InputLabel, Paper, Typography, Box, TableContainer, TableHead, Table, TableBody, } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { userStyle, colourStyles } from '../PageStyle';
import Selects from "react-select";
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { CsvBuilder } from 'filefy';
import SendToServer from '../Sendtoserver';
import Headtitle from '../../components/header/Headtitle';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Importproduct() {

    const [isProducts, setIsProducts] = useState();
    const [isBusilocations, setIsBusilocations] = useState({});
    const [busilocations, setBusilocations] = useState([]);
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(true)
    const { auth, setngs } = useContext(AuthContext);
    const backLPage = useNavigate();

    // Text field
    const [product, setProduct] = useState({ businesslocation: "", })

    // Access
    const { isActiveLocations, allLocations } = useContext(UserRoleAccessContext);

    let newval = setngs ? setngs.skuprefix == undefined ? "SK0001" : setngs.skuprefix + "0001" : "SK0001";

    // Products
    const fetchProducts = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT_LASTINDEXID, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            })
            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == setngs.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setBusilocations(isActiveLocations.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.locationid,
                }
            )));
            setIsProducts(res?.data?.products);
            return res?.data?.products;
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(
        () => {
            fetchProducts();
        }, []
    )

    // Autogenerate
    {
        isProducts?.map(
            () => {
                let strings = setngs ? setngs.skuprefix : "SK";
                let refNo = isProducts[isProducts.length - 1].sku;
                let digits = (isProducts.length + 1).toString();
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
            });
    }

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                // Convert the sheet to JSON
                const data = XLSX.utils.sheet_to_json(ws);

                // Get the highest SKU value from the database
                let highestSKU = 0;
                isProducts.forEach((product) => {
                    const skuNumber = parseInt(product.sku.replace(/\D/g, ''));
                    if (skuNumber > highestSKU) {
                        highestSKU = skuNumber;
                    }
                });

                // Map the data and concatenate the product_category_size_color_brand
                const updatedData = data.map((item, index) => {
                    const skuNumber = highestSKU + index + 1;
                    const paddedDigits = skuNumber.toString().padStart(4, '0');
                    let strings = setngs ? setngs?.skuprefix : "SK";
                    const newSKU = strings + `${paddedDigits}`;

                    const cat = item.category == undefined ? "ALL" : item.category;
                    const sub = item.subcategory == undefined ? "ALL" : item.subcategory;
                    const brand = item.brand == undefined ? "ALL" : item.brand;
                    const subbrand = item.subbrand == undefined ? "ALL" : item.subbrand;
                    const sty = item.style == undefined ? "ALL" : item.style;
                    const size = item.size == undefined ? "ALL" : item.size;
                    const color = item.color == undefined ? "ALL" : item.color;
                    const newCateShort = cat?.slice(0, 6).toUpperCase()
                    const newSubCateShort = sub?.slice(0, 6).toUpperCase()
                    const newBrandShort = brand?.slice(0, 6).toUpperCase()
                    const newSubBrandShort = subbrand?.slice(0, 6).toUpperCase()
                    return {
                        ...item,
                        productname: `${cat}_${sub}_${brand}_${subbrand}_${sty}_${size}_${color}`,
                        sku: newSKU,
                        businesslocation: String(product.businesslocation),
                        assignbusinessid: String(setngs.businessid),
                        categoryshotname: String(newCateShort),
                        subcategryshotname: String(newSubCateShort),
                        brandshotname: String(newBrandShort),
                        subbrandshotname: String(newSubBrandShort),
                        currentstock: Number(0),
                        pruchaseincludetax: Number(0),
                        purchaseexcludetax: Number(0),
                        sellingexcludetax: Number(0),
                        sellunitcostwithouttax: Number(0),
                        reorderlevel: Number(0),
                        category: String(cat),
                        subcategory: String(sub),
                        brand: String(brand),
                        subbrand: String(subbrand),
                        size: String(size),
                        color: String(color),
                        style: String(sty),
                        hsnenable: String(item.hsnenable == undefined ? false : item.hsnenable),
                        hsncode: String(item.hsncode == undefined ? "" : item.hsncode),
                        hsn: String(item.hsn == undefined ? "" : item.hsn),
                        barcodetype: String(item.barcodetype == undefined ? setngs?.barcodetype : item.barcodetype),
                        unit: String(item.unit == undefined ? setngs?.defaultunit : item.unit),
                        managestock: String(item.managestock == undefined ? false : item.managestock),
                        minquantity: String(item.minquantity == undefined ? setngs?.minquantity : item.minquantity),
                        maxquantity: String(item.maxquantity == undefined ? setngs?.maxquantity : item.maxquantity),
                        rack: String(item.rack == undefined ? "ALL" : item.rack),
                        productdescription: String(item.productdescription == undefined ? "" : item.productdescription),
                        applicabletax: String(item.applicabletax == undefined ? setngs?.applicabletax : item.applicabletax),
                        producttype: String(item.producttype == undefined ? setngs?.producttype : item.producttype),
                        sellingpricetax: String(item.sellingpricetax == undefined ? setngs?.sellingpricetax : item.sellingpricetax),
                    };
                });

                resolve(updatedData);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            setItems(d);
        });
    };

    function sendJSON() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
            }
        };

        // Ensure that items is an array of objects before sending
        if (!Array.isArray(items) || items.length === 0) {
            toast.warning("No data to upload!");
            return;
        } else if (product.businesslocation == "") {
            toast.warning("Please select Businesslocation");
            return;
        }

        try {
            xmlhttp.open("POST", SERVICE.PRODUCT_CREATE);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.send(JSON.stringify(items));
            toast.success("Uploaded Successfully", {
                position: toast.POSITION.TOP_CENTER
            });
            setItems("")
            backLPage('/product/product/list');
        }
        catch (err) {
            console.log(err?.message)
        }
    }


    //     const ExportsHead = () => {
    //         new CsvBuilder("products")
    //             .setColumns(["category", "subcategory", "brand", "subbrand", "hsnenable", "hsn", "hsncode", "barcodetype", "size", "color", "unit", "style", "managestock", "minquantity", "maxquantity", "rack", "productdescription", "applicabletax", "producttype", "sellingpricetax",])
    //             .exportFile();
    //     }

    //     const capitalizedColumns = columns.map(column => {
    //         // Capitalize the first letter of each word in the column name
    //         const words = column.split(' ');
    //         const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    //         return capitalizedWords.join(' ');
    //     });

    //     new CsvBuilder("products")
    //         .setColumns(capitalizedColumns)
    //         .exportFile();
    // };

    const ExportsHead = () => {
        const columns = [
            "Category",
            "Subcategory",
            "Brand",
            "Subbrand",
            "HSN Enable",
            "HSN",
            "HSN Code",
            "Barcode Type",
            "Size",
            "Color",
            "Unit",
            "Style",
            "Manage Stock",
            "Min Quantity",
            "Max Quantity",
            "Rack",
            "Product Description",
            "Applicable Tax",
            "Product Type",
            "Selling Price Tax"
        ];

        const capitalizedColumns = columns.map(column => {
            // Capitalize the first letter of each word in the column name
            const words = column.split(' ');
            const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            return capitalizedWords.join(' ');
        });


        const dataRow = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            setngs?.barcodetype,
            "",
            "",
            "",
            "",
            "",
            setngs?.minquantity,
            setngs?.maxquantity,
            "",
            "",
            setngs?.applicabletax,
            setngs?.producttype,
            setngs?.sellingpricetax
        ];


        new CsvBuilder("products")
            .setColumns(capitalizedColumns)
            .addRow(dataRow)
            .exportFile();
    };


    const handleCheck = () => {
        toast.warning("Upload files!");
    }

    return (
        <Box>
            <Headtitle title={'Import Products'} />
            <Typography sx={userStyle.HeaderText}>Import Products</Typography>
            <Box sx={userStyle.container}>
                <Grid container>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <InputLabel id="demo-select-small">Business Location</InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                options={busilocations}
                                styles={colourStyles}
                                placeholder={'Select Location'}
                                onChange={(e) => { setProduct({ ...product, businesslocation: e.value }) }}
                            />
                        </FormControl>
                    </Grid>
                </Grid><br />
                <Typography variant='h6' >File to import</Typography><br />
                <Grid container spacing={2}>
                    <Grid item md={8}>
                        <Button variant="contained" component="label" sx={userStyle.uploadBtn}>
                            Upload
                            <input
                                hidden
                                type="file"
                                accept=".xlsx, .xls , .csv"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    readExcel(file);
                                    toast.success("File Accepted", {
                                        position: toast.POSITION.TOP_CENTER,
                                    });
                                }}
                            />
                        </Button>
                    </Grid>
                    <Grid item md={4}>
                        {show && <><div><div readExcel={readExcel} /><SendToServer sendJSON={sendJSON} /></div></>}
                    </Grid>
                </Grid>
                <br /><br />
                <Button variant="contained" color="success" sx={{ textTransform: 'Capitalize' }} onClick={(e) => ExportsHead()} ><FaDownload />&ensp;Download template file</Button>
            </Box>
            <br />
            {/* ****** Instructions Box ****** */}
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.importheadtext}>Instructions</Typography>
                <br />
                <Typography sx={userStyle.importsubheadtex}>Follow the instructions carefully before importing the file</Typography>
                <Typography sx={userStyle.importsubheadtext}>The columns of the file should be in the following order.</Typography>
                <br /><br />
                <TableContainer component={Paper} sx={{
                    padding: 1, width: '100%', margin: 'auto', overflow: 'auto',
                    "&::-webkit-scrollbar": { width: 20 },
                    "&::-webkit-scrollbar-track": { backgroundColor: 'pink' },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: 'blue' }
                }} >
                    {/* ****** Table ****** */}
                    <Table md={{ minWidth: 200, maxHeight: '5px', overflow: 'auto' }} aria-label="customized table">
                        <TableHead >
                            <StyledTableRow>
                                <StyledTableCell >Column#</StyledTableCell>
                                <StyledTableCell align="left">Column Name</StyledTableCell>
                                <StyledTableCell align="left">Type</StyledTableCell>
                                <StyledTableCell align="left">Instruction</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Category</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Any one value must be given. Should not be BLANK.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">2</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Sub category</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, "ALL" will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">3</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Brand</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, "ALL" will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">4</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Sub Brand</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, "ALL" will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">5</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>HSN (TRUE/FALSE)</Typography> </Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Enable/Disable</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>FALSE/Disable - by Default</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">6</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>HSN</Typography> </Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}></Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">7</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>HSN Code</Typography> </Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required-If Enabled</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Give the right HSN code</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">8</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Barcode Type </Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Typography sx={userStyle.importTabledata}>If BLANK, Values from Settings will be added</Typography></StyledTableCell></StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">9</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Size</Typography></Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, "ALL" will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">10</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Colour</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, "ALL" will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">11</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Unit</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, Values from Settings will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">12</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Style</Typography></Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, "ALL" will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">13</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Manage Stock(TRUE/FALSE) </Typography></Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Manage Stock(TRUE/FALSE)	Enable/Disable</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>TRUE/Enable - by Default</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">14</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Minimum quantity</Typography></Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required-If Enabled</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Typography sx={userStyle.importTabledata}>If BLANK, Values from Settings will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">15</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Maximum quantity</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required-If Enabled</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Typography sx={userStyle.importTabledata}>If BLANK, Values from Settings will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">16</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Rack</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>If BLANK, "ALL" will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">17</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Product Description</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography>Optional</Typography></Box>  </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>Enter the Production Details</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">18</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Applicable Tax/HSN Code</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>  </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>If BLANK, Values from Settings will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">19</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Product Type </Typography></Box>   </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, Values from Settings will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">20</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Selling Price Tax</Typography></Box></StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>  </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If BLANK, Values from Settings will be added</Typography></StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                    {/* ****** Table Ends ****** */}
                </TableContainer>
                <br />
            </Box>
            {/* ****** Instructions Box Ends ****** */}
        </Box>
    );
}
function ImportProducts() {
    return (
       <>
         <Importproduct /><br /><br />
                    <Footer />
       </>
    );
}
export default ImportProducts;