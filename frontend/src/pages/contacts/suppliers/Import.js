import React, { useState, useContext, useEffect } from 'react';
import { Button, Grid, Paper, Typography, Box, TableContainer, TableHead, Table, TableBody, } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import Footer from '../../../components/footer/Footer';
import { userStyle } from '../../PageStyle';
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { CsvBuilder } from 'filefy';
import SendToServer from '../../Sendtoserver';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ImportSupplierTable() {

    const [items, setItems] = useState([]);
    const [show, setShow] = useState(true);
    const { auth, setngs } = useContext(AuthContext);
    const [suppliers, setSuppliers] = useState();

    // auto id for purchase number
    let newval = setngs ? setngs.suppliersku == undefined ? "SR0001" : setngs.suppliersku + "0001" : "SR0001";

    // Suppliers
    const fetchSuppliers = async () => {
        try {
            let res = await axios.post(SERVICE.SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setSuppliers(res?.data?.suppliers);
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
            fetchSuppliers()
        }, []
    )
 
    // Autogenerate
    {
        suppliers?.map(
            () => {
                let strings = setngs ? setngs.suppliersku : "SR";
                let refNo = suppliers[suppliers.length - 1].autogenerate;
                let digits = (suppliers.length + 1).toString();
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
                    refNOINC = ("000" + refNOINC).substr(-4);
                    newval = strings + refNOINC;
                } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                    refNOINC = ("00" + refLstTwo).substr(-4);
                    newval = strings + refNOINC;
                } else if (digits.length < 4 && getlastThreeChar > 0) {
                    refNOINC = ("0" + refLstThree).substr(-4);
                    newval = strings + refNOINC;
                } else {
                    refNOINC = (refLstDigit).substr(-4);
                    newval = strings + refNOINC;
                }
            })
    }

    const backLPage = useNavigate();
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

                // Get the highest autogenerate value from the database
                let highestAutogenerate = 0;
                suppliers.forEach((supplier) => {
                    const autogenerateNumber = parseInt(supplier.autogenerate.replace(/\D/g, ''));
                    if (autogenerateNumber > highestAutogenerate) {
                        highestAutogenerate = autogenerateNumber;
                    }
                });

                // Map the data and auto generate the id
                const updatedData = data.map((item, index) => {
                    const autogenerateNumber = highestAutogenerate + index + 1;
                    const paddedDigits = autogenerateNumber.toString().padStart(4, '0');
                    let strings = setngs ? setngs.suppliersku : "SR";
                    const newSKU = strings + `${paddedDigits}`;
                    const newSupplierShort = item.suppliername.slice(0, 6).toUpperCase()
                    return {
                        ...item,
                        autogenerate: newSKU,
                        assignbusinessid: String(setngs.businessid),
                        suppshortname: String(newSupplierShort),
                        suppliername: String(item.suppliername == undefined ? "" : item.suppliername),
                        addressone: String(item.addressone == undefined ? "" : item.addressone),
                        addresstwo: String(item.addresstwo == undefined ? "" : item.addresstwo),
                        country: String(item.country == undefined ? "" : item.country),
                        state: String(item.state == undefined ? "" : item.state),
                        city: String(item.city == undefined ? "" : item.city),
                        pincode: String(item.pincode == undefined ? "" : item.pincode),
                        supplieremail: String(item.supplieremail == undefined ? "" : item.supplieremail),
                        gstn: String(item.gstn == undefined ? "" : item.gstn),
                        phoneone: String(item.phoneone == undefined ? "" : item.phoneone),
                        phonetwo: String(item.phonetwo == undefined ? "" : item.phonetwo),
                        phonethree: String(item.phonethree == undefined ? "" : item.phonethree),
                        phonefour: String(item.phonefour == undefined ? "" : item.phonefour),
                        landline: String(item.landline == undefined ? "" : item.landline),
                        whatsapp: String(item.whatsapp == undefined ? "" : item.whatsapp),
                        contactperson: String(item.contactperson == undefined ? "" : item.contactperson),
                        creditdays: String(item.creditdays == undefined ? "" : item.creditdays),
                        
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
        file = "";
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
        }

        try {
            xmlhttp.open("POST", SERVICE.SUPPLIER_CREATE);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.send(JSON.stringify(items));
            toast.success("Uploaded Successfully", {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/contact/supplier/list');
        }
        catch (err) {
            console.log(err?.message)
        }
    }

    const ExportsHead = () => {
        new CsvBuilder("supplier")
            .setColumns(["suppliername", "addressone", "addresstwo", "country", "state", "city", "pincode", "supplieremail", "gstn", "phoneone", "phonetwo", "phonethree", "phonefour", "landline", "whatsapp", "contactperson", "creditdays"])
            .exportFile();
    }

    return (
        <Box>
            <Headtitle title={'Supplier Import'} />
            <Typography sx={userStyle.HeaderText}>Import Supplier</Typography>
            <Box sx={userStyle.container}>
                <Typography variant='h6' >File to import</Typography><br />
                <Grid container spacing={2}>
                    <Grid item md={8}>
                        <Button variant="contained" component="label" sx={userStyle.uploadBtn}>
                            Upload <input hidden
                                type="file"
                                accept=".xlsx, .xls , .csv"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    readExcel(file);
                                    toast.success("File accepted", {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                }}
                            />
                        </Button>
                    </Grid>
                    <Grid item md={4}>
                        {show && <div><div readExcel={readExcel} /><SendToServer sendJSON={sendJSON} /></div>}
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
                                <StyledTableCell align="left">Column Number</StyledTableCell>
                                <StyledTableCell align="left">Column Name</StyledTableCell>
                                <StyledTableCell align="left">Instruction</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Supplier Name  </Typography><Typography style={{ color: "red" }}>*</Typography> <Typography>(required)</Typography></Box>   </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">2</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Address1 </Typography> <Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">3</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Address2</Typography> <Typography>(optional)</Typography></Box>  </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">4</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Country</Typography> <Typography>(optional)</Typography></Box>  </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">5</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>State </Typography> <Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">6</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>City</Typography> <Typography>(optional)</Typography></Box>   </StyledTableCell>
                                <StyledTableCell align="left"><Typography sx={userStyle.importTabledata}></Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">7</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Pincode</Typography> <Typography>(optional)</Typography></Box>  </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>Must be 6 digits (Number)</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">8</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Email</Typography> <Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">9</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>GSTN</Typography> <Typography>(optional)</Typography></Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">10</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Phone One</Typography><Typography style={{ color: "red" }}>*</Typography> <Typography>(required)</Typography></Box> </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>Must be 10 digits (Number)</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">11</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Phone Two</Typography><Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>Must be 10 digits (Number)</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">12</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Phone Three</Typography><Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>Must be 10 digits (Number)</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">13</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Phone Four</Typography><Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}>Must be 10 digits (Number)</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">14</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Land Line</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">15</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Whatsapp</Typography><Typography style={{ color: "red" }}>*</Typography> <Typography>(required)</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Typography sx={userStyle.importTableBoldText}>Must be 10 digits (Number)</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">16</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Contact Person</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">17</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Credit Days</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
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
function ImportContact() {
    return (
       
            <>
                <ImportSupplierTable /><br /><br />
                    <Footer />
            </>
    );
}
export default ImportContact;