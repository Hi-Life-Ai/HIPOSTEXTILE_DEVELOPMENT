import React, { useState, useEffect, useContext, useRef, createRef } from "react";
import { Box, Typography, FormControlLabel, OutlinedInput, DialogTitle, DialogContentText, Grid, DialogActions, Checkbox, DialogContent, Dialog, FormControl, MenuItem, Select, Paper, Table, TableBody, TableHead, TableContainer, Button, TableFooter } from '@mui/material';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { userStyle } from "../../PageStyle";
import axios from 'axios';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import { useReactToPrint } from "react-to-print";
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { AuthContext } from '../../../context/Appcontext';
import { SERVICE } from "../../../services/Baseservice";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { ThreeDots } from 'react-loader-spinner';

function Customerlisttable() {

    const { auth, setngs } = useContext(AuthContext);
    const [custom, setCustom] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [isCustom, setIsCustom] = useState([]);
    const [isAllCustom, setIsAllCustom] = useState([]);
    const [iscustomer, setIsCustomer] = useState({});
    const [exceldata, setExceldata] = useState([]);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // Pdf
    const [isPdfData, setIsPdfData] = useState({
        isContacttype: false, isContactid: false, isBusiName: false, isFirstname: false, isLastname: false, isMobile: false, isWhatsapp: false, isEmail: false,
        isCustomergrp: false, isContactperson: false, isTaxnumber: false, isOpeningbalance: false, isPayterm: false, isPaytermassign: false, isCreditlimit: false,
        isAddressone: false, isAddresstwo: false, isCountry: false, isState: false, isCity: false, isZipcode: false, isShipping: false, isLedgerbalance: false,
    })

    // User Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    // Delete popup
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // Pdf
    const [openPdf, setOpenPdf] = useState(false);
    const handleOpenPdf = () => { setOpenPdf(true); };
    const handleClosePdf = () => { setOpenPdf(false); };

    const Customerlists = async () => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setCustom(res?.data?.customers);
            setIsAllCustom(res?.data?.customers);
            setIsCustom(res?.data?.customers);
            setIsLoader(true)
        } catch (err) {
            setIsLoader(true)
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
            Customerlists();
        }, [isPdfData]
    )

    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.CUSTOMER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setIsCustomer(res?.data?.scustomer);//set function to get particular row
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //alert delete popup
    let cusid = iscustomer._id;

    const deleteSize = async (cusid) => {

        try {
            let res = await axios.delete(`${SERVICE.CUSTOMER_SINGLE}/${cusid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await Customerlists();
            handleClose();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Excel
    const fileName = "Customer";
    const customerexcel = async () => {
        var data = isAllCustom.map((t,index) => ({
            sno: index+1 ,contactid: t.contactid, firstname: t.firstname, lastname: t.lastname, email: t.email, creditlimit: t.creditlimit, payterm: t.payterm,
            paytermassign: t.paytermassign, openbalance: t.openbalance, customergroup: t.customergroup, contactperson: t.contactperson,
            addressone: t.addressone, addresstwo: t.addresstwo, phonenumber: t.phonenumber, whatsappno: t.whatsappno
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            customerexcel();

        }, [custom]
    )

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = custom?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [custom])

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | CUSTOMER LIST',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    // // PDF
    // var nestedArray = [];

    // {
    //   isCustom && (isCustom.map((item, index) => {
    //     var cateData = [
    //       item.contacttype,
    //       item.contactid,
    //       item.businessname,
    //       item.firstname,
    //       item.lastname,
    //       item.phonenumber,
    //       item.whatsappno,
    //       item.email,
    //       item.customergroup,
    //       item.contactperson,
    //       item.taxnumber,
    //       item.openbalance,
    //       item.payterm,
    //       item.paytermassign,
    //       item.creditlimit,
    //       item.addressone,
    //       item.addresstwo,
    //       item.country,
    //       item.state,
    //       item.city,
    //       item.zipcode,
    //       item.shippingadd,
    //       item.ledgerbalance
    //     ]
    //     nestedArray.push(cateData);
    //   })
    //   )
    // }

    // const downloadpdf = () => {
    //   const newData = isCustom.map(row => {
    //     delete row._id;
    //     delete row.createdAt;
    //     delete row.__v;
    //     delete row.assignbusinessid;
    //     delete row.activate;
    //     delete row.individual;
    //     delete row.gstno;

    //     { !isPdfData.isContacttype && delete row.contacttype };
    //     { !isPdfData.isContactid && delete row.contactid };
    //     { !isPdfData.isBusiName && delete row.businessname };
    //     { !isPdfData.isFirstname && delete row.firstname };
    //     { !isPdfData.isLastname && delete row.lastname };
    //     { !isPdfData.isMobile && delete row.phonenumber };
    //     { !isPdfData.isWhatsapp && delete row.whatsappno };
    //     { !isPdfData.isEmail && delete row.email };
    //     { !isPdfData.isCustomergrp && delete row.customergroup };
    //     { !isPdfData.isContactperson && delete row.contactperson };
    //     { !isPdfData.isTaxnumber && delete row.taxnumber };
    //     { !isPdfData.isOpeningbalance && delete row.openbalance };
    //     { !isPdfData.isPayterm && delete row.payterm };
    //     { !isPdfData.isPaytermassign && delete row.paytermassign };
    //     { !isPdfData.isCreditlimit && delete row.creditlimit };
    //     { !isPdfData.isAddressone && delete row.addressone };
    //     { !isPdfData.isAddresstwo && delete row.addresstwo };
    //     { !isPdfData.isCountry && delete row.country };
    //     { !isPdfData.isCity && delete row.city };
    //     { !isPdfData.isState && delete row.state };
    //     { !isPdfData.isZipcode && delete row.zipcode };
    //     { !isPdfData.isShipping && delete row.shippingadd };
    //     { !isPdfData.isLedgerbalance && delete row.ledgerbalance };

    //     setIsPdfData(row);
    //     handleClosePdf();
    //   })

    //   const doc = new jsPDF()
    //   doc.autoTable({
    //     theme: "grid",
    //     body: isCustom,
    //     columnStyles: {
    //       0: { cellWidth: 17 },
    //       1: { cellWidth: 17 },
    //       2: { cellWidth: 17 },
    //       3: { cellWidth: 17 },
    //       4: { cellWidth: 17 },
    //       5: { cellWidth: 17 },
    //       6: { cellWidth: 17 },
    //       7: { cellWidth: 17 },
    //       8: { cellWidth: 17 },
    //       9: { cellWidth: 17 },
    //       10: { cellWidth: 14 },
    //       11: { cellWidth: 16 },
    //       12: { cellWidth: 16 },
    //       13: { cellWidth: 16 },
    //       14: { cellWidth: 16 },
    //       15: { cellWidth: 16 },
    //       16: { cellWidth: 16 },
    //       17: { cellWidth: 14 },
    //       18: { cellWidth: 16 },
    //       19: { cellWidth: 16 },
    //       20: { cellWidth: 16 },
    //       21: { cellWidth: 16 },
    //       22: { cellWidth: 16 },
    //     }
    //   })
    //   doc.save('customers.pdf')
    // }

    const columns = [
        { title: "Contacttype", field: "contacttype" },
        { title: "Contactid", field: "contactid" },
        { title: "Businessname", field: "businessname" },
        { title: "Firstname", field: "firstname" },
        { title: "Lastname", field: "lastname" },
        { title: "Phonenumber", field: "phonenumber" },
        { title: "Whatsappno", field: "whatsappno" },
        { title: "Email", field: "email" },
        { title: "Customergroup", field: "customergroup" },
        { title: "Contactperson", field: "contactperson" },
        { title: "Taxnumber", field: "taxnumber" },
        { title: "Openbalance", field: "openbalance" },
        { title: "Payterm", field: "payterm" },
        { title: "Paytermassign", field: "paytermassign" },
        { title: "Creditlimit", field: "creditlimit" },
        { title: "Addressone", field: "addressone" },
        { title: "Addresstwo", field: "addresstwo" },
        { title: "country", field: "country" },
        { title: "City", field: "city" },
        { title: "State", field: "state" },
        { title: "Zipcode", field: "zipcode" },
        { title: "ShippingAdd", field: "shippingadd" },
        { title: "LedgerBalance", field: "ledgerbalance" },


    ]

    // const downloadPdf = () => { 
    //     const doc = new jsPDF();
    //     doc.autoTable({
    //         theme: "grid",
    //         styles: {
    //             fontSize: 3,
    //         },
    //         columns: columns.map((col) => ({ ...col, dataKey: col.field })),
    //         body: isCustom,
    //     });
    //     doc.save("Customer.pdf");
    // };
    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
            // Add a serial number to each row
            const itemsWithSerial = items.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));
            doc.autoTable({
                theme: "grid",
                styles: {
                    fontSize: 4,
                },
                // columns: columns?.map((col) => ({ ...col, dataKey: col.field })),
                // body: items,
                columns: columnsWithSerial,
                body: itemsWithSerial,
            });
            doc.save("Customer.pdf");
        };


    // Sorting
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
            value?.toString().toLowerCase().startsWith(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
            <Headtitle title={'Customers'} />
            { /* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Customers <Typography sx={userStyle.SubHeaderText} component="span">Manage your Customers</Typography></Typography>
            { /* ****** Filter Start ****** */}

            { /* ****** Table Start ****** */}
            <>
                <Box sx={userStyle.container} >
                    { /* Header Content */}
                    { /* Header Buttons */}
                    <Grid container spacing={2}>
                        <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Typography sx={userStyle.importheadtext}>All your Customers</Typography>
                        </Grid>
                        <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Grid >
                                {isUserRoleCompare[0]?.csvcustomer && (
                                    <>
                                        <ExportCSV csvData={exceldata} fileName={fileName} />
                                    </>
                                )}
                                {isUserRoleCompare[0]?.excelcustomer && (
                                    <>
                                        <ExportXL csvData={exceldata} fileName={fileName} />
                                    </>
                                )}
                                {isUserRoleCompare[0]?.printcustomer && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare[0]?.pdfcustomer && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item sm={12} xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }} >
                            {isUserRoleCompare[0]?.acustomer && (
                                <>
                                    <Link to={'/contact/customer/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button
                                        variant="contained" sx={userStyle.buttonadd}>   ADD   </Button></Link>
                                </>
                            )}
                        </Grid>
                    </Grid><br /><br />
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
                                <MenuItem value={(filteredDatas.length)}>All</MenuItem>
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
                    {isLoader ? (
                        <>
                            { /* Table Start */}
                            <Box>
                                <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="roletable">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell>Actions</StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('contactid')}><Box sx={userStyle.tableheadstyle}><Box>Contact ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('contactid')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('businessname')}><Box sx={userStyle.tableheadstyle}><Box>Business Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businessname')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('firstname')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('firstname')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('email')}><Box sx={userStyle.tableheadstyle}><Box>Email</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('email')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('taxnumber')}><Box sx={userStyle.tableheadstyle}><Box>Tax Number</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('taxnumber')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('creditlimit')}><Box sx={userStyle.tableheadstyle}><Box>Credit Limit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('creditlimit')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('payterm')}><Box sx={userStyle.tableheadstyle}><Box>Pay Term</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('payterm')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('openbalance')}><Box sx={userStyle.tableheadstyle}><Box>Opening Balance</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('openbalance')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('customergroup')}><Box sx={userStyle.tableheadstyle}><Box>Customer Group</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('customergroup')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('contactperson')}><Box sx={userStyle.tableheadstyle}><Box>Contact Person Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('contactperson')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('addressone')}><Box sx={userStyle.tableheadstyle}><Box>Address</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('addressone')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('phonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('phonenumber')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('whatsappno')}><Box sx={userStyle.tableheadstyle}><Box>Whatsapp</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('whatsappno')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('ledgerbalance')}><Box sx={userStyle.tableheadstyle}><Box>Ledger balance</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('ledgerbalance')}</Box></Box></StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody align="left">
                                            {filteredData.length > 0 ?
                                                (filteredData.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell component="th" scope="row" colSpan={1}>
                                                            <Grid sx={{ display: 'flex' }}>
                                                                {isUserRoleCompare[0]?.ecustomer && (<Link to={`/contact/customer/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                                {isUserRoleCompare[0]?.dcustomer && (<Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                                                                {isUserRoleCompare[0]?.vcustomer && (<Link to={`/contact/customer/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                            </Grid>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">{row.serialNumber}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.contactid}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.businessname}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.firstname + '  ' + row.lastname}</StyledTableCell >
                                                        <StyledTableCell align="left">{row.email}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.taxnumber}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.creditlimit}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.payterm + "" + row.paytermassign}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.openbalance}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.customergroup}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.contactperson}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.addressone}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.phonenumber}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.whatsappno}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.ledgerbalance}</StyledTableCell>
                                                    </StyledTableRow>
                                                )))
                                                : <StyledTableRow><StyledTableCell colSpan={17} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer><br /><br />
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                    Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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
                                <br />
                                <br />
                                {pageSize != 1 ? <Grid >
                                    {isUserRoleCompare[0]?.acustomer && (
                                        <>
                                            <Link to={'/contact/customer/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button
                                                variant="contained" sx={userStyle.buttonadd}>   ADD   </Button></Link>
                                        </>
                                    )}<br /><br />
                                </Grid> : null}
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        </>
                    )}

                    { /* ****** Print ****** */}
                    <Box sx={userStyle.printcls} >
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Customers Print</Typography>
                        </Grid>
                        <>
                            <Box>
                                <TableContainer component={Paper} sx={userStyle.printcls}>
                                    <Table aria-label="simple table" id="suppliertable2" ref={componentRef}>
                                        <TableHead sx={{ fontWeight: "600" }} >
                                            <StyledTableRow >
                                            <StyledTableCell>Sno</StyledTableCell>
                                                <StyledTableCell>Contact ID</StyledTableCell>
                                                <StyledTableCell>Business Name</StyledTableCell>
                                                <StyledTableCell>Name</StyledTableCell>
                                                <StyledTableCell>Email</StyledTableCell>
                                                <StyledTableCell>Tax Number</StyledTableCell>
                                                <StyledTableCell>Credit Limit</StyledTableCell>
                                                <StyledTableCell>Pay Term</StyledTableCell>
                                                <StyledTableCell>Opening Balance</StyledTableCell>
                                                <StyledTableCell>Customer Group</StyledTableCell>
                                                <StyledTableCell>Contact person</StyledTableCell>
                                                <StyledTableCell>Address</StyledTableCell>
                                                <StyledTableCell>Mobile</StyledTableCell>
                                                <StyledTableCell>WhatsApp</StyledTableCell>
                                                <StyledTableCell>Ledger balance</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {isAllCustom.length > 0 ? (
                                                isAllCustom.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.contactid}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.businessname}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.firstname + '  ' + row.lastname}</StyledTableCell >
                                                        <StyledTableCell align="left">{row.email}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.taxnumber}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.creditlimit}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.payterm + "" + row.paytermassign}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.openbalance}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.customergroup}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.contactperson}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.addressone}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.phonenumber}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.whatsappno}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.ledgerbalance}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            ) : (<StyledTableCell colSpan={8}><Typography>No data available in table</Typography></StyledTableCell>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </>
                    </Box>

                    {/* Delete */}
                    <Dialog
                        open={isDeleteOpen}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} variant="outlined">Cancel</Button>
                            <Button onClick={(e) => deleteSize(cusid)} autoFocus variant="contained" color='error'> OK </Button>
                        </DialogActions>
                    </Dialog>

                    {/* PDF */}
                    <Box>
                        <Dialog
                            open={openPdf}
                            onClose={handleClosePdf}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            maxWidth="md"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Select Option to Print PDF
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <Typography variant="subtitle1">Choose any 6</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isContacttype} onChange={(e) => { setIsPdfData({ ...isPdfData, isContacttype: !isPdfData.isContacttype }) }} />} label="Contact Type" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isContactid} onChange={(e) => { setIsPdfData({ ...isPdfData, isContactid: !isPdfData.isContactid }) }} />} label="Customer Id" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isBusiName} onChange={(e) => setIsPdfData({ ...isPdfData, isBusiName: !isPdfData.isBusiName })} />} label="Business Name" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isFirstname} onChange={(e) => setIsPdfData({ ...isPdfData, isFirstname: !isPdfData.isFirstname })} />} label="First Name" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isLastname} onChange={(e) => setIsPdfData({ ...isPdfData, isLastname: !isPdfData.isLastname })} />} label="Last Name" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isMobile} onChange={(e) => setIsPdfData({ ...isPdfData, isMobile: !isPdfData.isMobile })} />} label="Mobile" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isWhatsapp} onChange={(e) => setIsPdfData({ ...isPdfData, isWhatsapp: !isPdfData.isWhatsapp })} />} label="Whatsapp" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isEmail} onChange={(e) => setIsPdfData({ ...isPdfData, isEmail: !isPdfData.isEmail })} />} label="Email" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isCustomergrp} onChange={(e) => setIsPdfData({ ...isPdfData, isCustomergrp: !isPdfData.isCustomergrp })} />} label="Customer Group" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isContactperson} onChange={(e) => setIsPdfData({ ...isPdfData, isContactperson: !isPdfData.isContactperson })} />} label="Contact Person" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isTaxnumber} onChange={(e) => setIsPdfData({ ...isPdfData, isTaxnumber: !isPdfData.isTaxnumber })} />} label="Tax Number" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isOpeningbalance} onChange={(e) => setIsPdfData({ ...isPdfData, isOpeningbalance: !isPdfData.isOpeningbalance })} />} label="Opening Balance" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isPayterm} onChange={(e) => setIsPdfData({ ...isPdfData, isPayterm: !isPdfData.isPayterm })} />} label="Payterm" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isPaytermassign} onChange={(e) => setIsPdfData({ ...isPdfData, isPaytermassign: !isPdfData.isPaytermassign })} />} label="Payterm Period" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isCreditlimit} onChange={(e) => setIsPdfData({ ...isPdfData, isCreditlimit: !isPdfData.isCreditlimit })} />} label="Credit Limit" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isAddressone} onChange={(e) => setIsPdfData({ ...isPdfData, isAddressone: !isPdfData.isAddressone })} />} label="Address 1" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isAddresstwo} onChange={(e) => setIsPdfData({ ...isPdfData, isAddresstwo: !isPdfData.isAddresstwo })} />} label="Address 2" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isCountry} onChange={(e) => setIsPdfData({ ...isPdfData, isCountry: !isPdfData.isCountry })} />} label="Country" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isState} onChange={(e) => setIsPdfData({ ...isPdfData, isState: !isPdfData.isState })} />} label="State" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isCity} onChange={(e) => setIsPdfData({ ...isPdfData, isCity: !isPdfData.isCity })} />} label="City" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isZipcode} onChange={(e) => setIsPdfData({ ...isPdfData, isZipcode: !isPdfData.isZipcode })} />} label="Zipcode" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isShipping} onChange={(e) => setIsPdfData({ ...isPdfData, isShipping: !isPdfData.isShipping })} />} label="Shipping Address" />
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControlLabel control={<Checkbox checked={isPdfData.isLedgerbalance} onChange={(e) => setIsPdfData({ ...isPdfData, isLedgerbalance: !isPdfData.isLedgerbalance })} />} label="Ledger Balance" />
                                        </Grid>
                                    </Grid>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button variant='contained' color='primary' onClick={() => downloadPdf()} autoFocus>PDF</Button>
                                <Button variant='contained' color='error' onClick={handleClosePdf}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                    { /* Table End */}
                </Box>
            </>
            { /* ****** Table End ****** */}
        </Box>
    );
}
function Customerlist() {
    return (
       <>
        <Customerlisttable /><br /><br /><br /><br />
        <Footer />
       </>
    );
}
export default Customerlist;  