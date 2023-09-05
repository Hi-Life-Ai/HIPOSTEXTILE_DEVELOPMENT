import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { Box, Table, TableBody, TableContainer, Select, MenuItem, FormControl, OutlinedInput, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaFilePdf, FaPrint } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import autoTable from 'jspdf-autotable';
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function Paymentintegrationlisttable() {

    const [payments, setPayments] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [pay, setPay] = useState({});
    const [exceldata, setExceldata] = useState([]);
    const { auth, setngs } = useContext(AuthContext);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");
    const [isLocations, setIsLocations] = useState([]);

    // User Access
    const { isUserRoleCompare, isUserRoleAccess, allLocations } = useContext(UserRoleAccessContext);

    // Payments
    const fetchPayments = async () => {
        try {
            let res = await axios.post(SERVICE.PAYMENTINTEGRATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

            setIsLocations(allLocations);
            setPayments(res?.data?.paymentintegrations);
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
    };

    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = payments.map((t,index) => ({
            'SNo':index+1,'Business Location': t.businesslocation, Cash: t.cash,
            Card: t.card, Cheque: t.cheque, Bank: t.bank, Other: t.other, 'Card Number': t.cardnum, 'Card Holder Name': t.cardhname,
            'Card Transaction Number': t.cardtransnum, 'Card Type': t.cardtype, Month: t.month, Year: t.year, 'Security Code': t.securitycode, 'Cheque No': t.checkno,
            'Bank Account Number': t.baccno, UPI: t.upi, 'UPI Number': t.upino
        }));
        setExceldata(data);
    }

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let response = await axios.get(`${SERVICE.PAYMENTINTEGRATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setPay(response?.data?.spaymentintegration);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Alert delete popup
    let payid = pay._id;
    const deletePayment = async (payid) => {
        try {
            let response = await axios.delete(`${SERVICE.PAYMENTINTEGRATION_SINGLE}/${payid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchPayments();
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

    useEffect(
        () => {
            fetchPayments();
        }, []
    );

    useEffect(
        () => {
            getexcelDatas();
        }, [payments]
    );


    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | PAYMENT',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };
    // Export Excel
    const fileName = 'PaymentIntegration'

    // PDF
    const downloadPdf = () => {

        const newData = payments.map(row => {
            delete row._id
            delete row.createdAt;
            delete row.assignbusinessid;
            return row
        })
        const doc = new jsPDF();
        autoTable(doc, { html: '#paymentIntegrationTable' });
        doc.save('Payment Integration.pdf')
    }
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
      const itemsWithSerialNumber = payments?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
      setItems(itemsWithSerialNumber);
    }
  
    useEffect(() => {
      addSerialNumber();
    }, [payments])
    // sorting
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
    //Datatable
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

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Headtitle title={'Payment Integrations'} />
            {/* header text */}
            <Typography sx={userStyle.HeaderText}>Payment Integrations<Typography sx={userStyle.SubHeaderText}></Typography></Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item xs={8}><Typography sx={userStyle.importheadtext}>All your Payment Integrations</Typography></Grid>
                    <Grid item xs={4}>
                        {isUserRoleCompare[0]?.apaymentintegration && (
                            <>
                                <Link to='/settings/paymentintegration/create' style={{ textDecoration: 'none', color: 'black' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                            </>
                        )}
                    </Grid>
                </Grid><br></br><br></br>
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
                            <MenuItem value={(payments.length)}>All</MenuItem>
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
                </Grid>
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid >
                        {isUserRoleCompare[0]?.csvpaymentintegration && (
                            <>
                                <ExportCSV csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0]?.excelpaymentintegration && (
                            <>
                                <ExportXL csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0]?.printpaymentintegration && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                            </>
                        )}
                        {isUserRoleCompare[0]?.pdfpaymentintegration && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </>
                        )}
                    </Grid>
                </Grid><br /><br />
                {isLoader ? (
                    <>
                        <Box>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell >Actions</StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Business Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('cash')}><Box sx={userStyle.tableheadstyle}><Box>Cash</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('cash')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('card')}><Box sx={userStyle.tableheadstyle}><Box>Card</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('card')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('cheque')}><Box sx={userStyle.tableheadstyle}><Box>Cheque</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('cheque')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('bank')}><Box sx={userStyle.tableheadstyle}><Box>Bank</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('bank')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('upi')}><Box sx={userStyle.tableheadstyle}><Box>UPI</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('upi')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>
                                                        <Grid sx={{ display: 'flex' }}>
                                                            {isUserRoleCompare[0]?.epaymentintegration && (
                                                                <>
                                                                    <Link to={`/settings/paymentintegration/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.dpaymentintegration && (
                                                                <>
                                                                    <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.vpaymentintegration && (
                                                                <>
                                                                    <Link to={`/settings/paymentintegration/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell>{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                    <StyledTableCell>{row.cash ? "Enable" : "Disable"}</StyledTableCell>
                                                    <StyledTableCell>{row.card ? "Enable" : "Disable"}</StyledTableCell>
                                                    <StyledTableCell>{row.cheque ? "Enable" : "Disable"}</StyledTableCell>
                                                    <StyledTableCell>{row.bank ? "Enable" : "Disable"}</StyledTableCell>
                                                    <StyledTableCell>{row.upi ? "Enable" : "Disable"}</StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow><StyledTableCell colSpan={9} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br /><br />
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
                                {isUserRoleCompare[0]?.apaymentintegration && (
                                    <>
                                        <Link to='/settings/paymentintegration/create' style={{ textDecoration: 'none', color: 'black' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                                    </>
                                )}
                                <br />
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


            </Box>
            {/* Delete Modal */}
            {/* ALERT DIALOG */}
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
                    <Button autoFocus variant="contained" color='error' onClick={(e) => deletePayment(payid)}> OK </Button>
                </DialogActions>
            </Dialog>
            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls}>
                <Box>
                    <Typography variant='h5' >Payment Integration </Typography>
                </Box>
                <>
                    <Box  >
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRef} id="paymentIntegrationTable" >
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Sno</StyledTableCell>
                                        <StyledTableCell>Business Location</StyledTableCell>
                                        <StyledTableCell>Cash</StyledTableCell>
                                        <StyledTableCell>Card</StyledTableCell>
                                        <StyledTableCell>Cheque</StyledTableCell>
                                        <StyledTableCell>Bank</StyledTableCell>
                                        <StyledTableCell>UPI</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {payments &&
                                        (payments.map((item, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>{isLocations?.map((data, i) => data.locationid.includes(item.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                <StyledTableCell>{item.cash ? "Enable" : "Disable"}</StyledTableCell>
                                                <StyledTableCell>{item.card ? "Enable" : "Disable"}</StyledTableCell>
                                                <StyledTableCell>{item.cheque ? "Enable" : "Disable"}</StyledTableCell>
                                                <StyledTableCell>{item.bank ? "Enable" : "Disable"}</StyledTableCell>
                                                <StyledTableCell>{item.upi ? "Enable" : "Disable"}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            </Box>
        </Box>
    );
}
function Paymentintegrationlist() {
    return (
        <>
             <Paymentintegrationlisttable /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default Paymentintegrationlist;