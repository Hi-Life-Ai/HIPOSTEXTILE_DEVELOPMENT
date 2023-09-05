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

function ImportCustomerTable() {

    const { auth, setngs } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(true);
    const [customers, setCustomers] = useState();
    const backLPage = useNavigate();

    // auto id for purchase number
    let newval = setngs ? setngs.customersku == undefined ? "CU0001" : setngs.customersku + "0001" : "CU0001";

    // Customers
    const fetchCustomers = async () => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setCustomers(res?.data?.customers);
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
            fetchCustomers();
        }, []
    )

    {
        customers?.map(
            () => {
                let strings = setngs ? setngs.customersku : 'CU';
                let refNo = customers[customers.length - 1].contactid;
                let digits = (customers.length + 1).toString();
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
            })
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

                // Get the highest contactid value from the database
                let highestcontactid = 0;
                customers.forEach((customer) => {
                    const contactidNumber = parseInt(customer.contactid.replace(/\D/g, ''));
                    if (contactidNumber > highestcontactid) {
                        highestcontactid = contactidNumber;
                    }
                });

                // Map the data and auto generate the id
                const updatedData = data.map((item, index) => {
                    const contactidNumber = highestcontactid + index + 1;
                    const paddedDigits = contactidNumber.toString().padStart(4, '0');
                    let strings = setngs ? setngs.customersku : 'CU';
                    const newSKU = strings + `${paddedDigits}`;
                    return {
                        ...item,
                        contactid: newSKU,
                        assignbusinessid: String(setngs.businessid),
                        contacttype: String(item.contacttype == undefined ? "" : item.contacttype),
                        businessname: String(item.businessname == undefined ? "" : item.businessname),
                        firstname: String(item.firstname == undefined ? "" : item.firstname),
                        lastname: String(item.lastname == undefined ? "" : item.lastname),
                        phonenumber: Number(item.phonenumber == undefined ? "" : item.phonenumber),
                        email: String(item.email == undefined ? "" : item.email),
                        taxnumber: String(item.taxnumber == undefined ? "" : item.taxnumber),
                        openbalance: Number(item.openbalance == undefined ? "" : item.openbalance),
                        payterm: String(item.payterm == undefined ? "" : item.payterm),
                        paytermassign: String(item.paytermassign == undefined ? "" : item.paytermassign),
                        creditlimit: Number(item.creditlimit == undefined ? "" : item.creditlimit),
                        addressone: String(item.addressone == undefined ? "" : item.addressone),
                        addresstwo: String(item.addresstwo == undefined ? "" : item.addresstwo),
                        city: String(item.city == undefined ? "" : item.city),
                        state: String(item.state == undefined ? "" : item.state),
                        country: String(item.country == undefined ? "" : item.country),
                        zipcode: String(item.zipcode == undefined ? "" : item.zipcode),
                        shippingadd: String(item.shippingadd == undefined ? "" : item.shippingadd),
                        whatsappno: Number(item.whatsappno == undefined ? "" : item.whatsappno),
                        contactperson: String(item.contactperson == undefined ? "" : item.contactperson),
                        gstno: String(item.gstno == undefined ? "" : item.gstno),
                        ledgerbalance: Number(0)
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
        }

        try {
            xmlhttp.open("POST", SERVICE.CUSTOMER_CREATE);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.send(JSON.stringify(items));
            toast.success("Uploaded Successfully", {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/contact/customer/list')
        }
        catch (err) {
            console.log(err?.message)
        }
    }

    const ExportsHead = () => {
        new CsvBuilder("Customer")
            .setColumns(["contacttype", "businessname", "firstname", "lastname", "phonenumber", "email", "taxnumber", "openbalance",
                "payterm", "paytermassign", "creditlimit", "addressone", "addresstwo", "city", "state", "country", "zipcode", "shippingadd",
                "whatsappno", "contactperson", "gstno", "ledgerbalance",
            ])
            .exportFile();
    }
    return (
        <Box>
            <Headtitle title={'Customer Import'} />
            <Typography sx={userStyle.HeaderText}>Import Customer</Typography>
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
                                <StyledTableCell >Column Number</StyledTableCell>
                                <StyledTableCell align="left">Column Name</StyledTableCell>
                                <StyledTableCell align="left">Instruction</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Contact type </Typography> <Typography style={{ color: "red" }}>*</Typography><Typography>(required)</Typography></Box>    </StyledTableCell>
                                <StyledTableCell><br /><Typography sx={userStyle.importTableBoldText}>Indvidual  or Bussiness</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">2</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Business Name</Typography><Typography style={{ color: "red" }}>*</Typography><Typography>(required)</Typography></Box> </StyledTableCell>
                                <StyledTableCell><br /><Typography sx={userStyle.importTableBoldText}>Contact type is Bussiness or optional</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">3</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>First Name</Typography><Typography style={{ color: "red" }}>*</Typography><Typography>(required)</Typography></Box>  </StyledTableCell>
                                <StyledTableCell><br /><Typography sx={userStyle.importTableBoldText}>Contact type is Individual or optional</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">4</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Last Name</Typography> <Typography>(optional)</Typography></Box>  </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">5</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Phone Number </Typography> <Typography style={{ color: "red" }}>*</Typography><Typography>(required)</Typography></Box>    </StyledTableCell>
                                <StyledTableCell><br /><Typography sx={userStyle.importTableBoldText}>Must be in 10 characters</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">6</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Email</Typography> <Typography>(optional)</Typography></Box>   </StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">7</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Tax Number </Typography> <Typography>(optional)</Typography></Box>  </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">8</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Open Balance</Typography> <Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">9</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Pay Term </Typography> <Typography>(optional)</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">10</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Pay Term Assign</Typography> <Typography>(optional)</Typography></Box> </StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTableBoldText}></Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">11</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Credit Limit</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">12</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Address1</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">13</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Address2</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">14</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>City</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">15</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>State</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">16</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Zipcode</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">17</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Shipping Address</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">18</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Whatsapp No</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">19</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Contact Person</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">20</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>GST no</Typography> <Typography>(optional)</Typography>  </Box></StyledTableCell>
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
function Customerimport() {
    return (
        <>
            <ImportCustomerTable /><br /><br />
                    <Footer />
        </>
    );
}
export default Customerimport;