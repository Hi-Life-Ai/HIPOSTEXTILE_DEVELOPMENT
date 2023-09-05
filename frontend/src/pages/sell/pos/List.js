import React, { useState, useEffect, createRef, useRef, useContext } from 'react';
import { Box, Button, Select, MenuItem, FormControl, OutlinedInput, Dialog, DialogContent, DialogActions, Grid, Typography, Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import Headtitle from '../../../components/header/Headtitle';
import { Link } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import moment from 'moment';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import jsPDF from "jspdf";
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import { ExportXL, ExportCSV } from '../../Export';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print";

function Poslisttable() {

    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [pos, setPos] = useState([]);
    const [deletePoss, setDeletePoss] = useState({});
    const [exceldata, setExceldata] = useState([]);
    const [isLocations, setIsLocations] = useState([]);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // User Access
    const { isUserRoleCompare, isActiveLocations, isUserRoleAccess, setAllPos } = useContext(UserRoleAccessContext);

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    // Pos
    const fetchPos = async () => {
        try {
            let res = await axios.post(SERVICE.ALLPOS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            setIsLocations(isActiveLocations);
            setPos(res?.data?.pos1);
            setIsLoader(true)
            await fetchAllSales();
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

    const fetchAllSales = async () => {
        try {
            let res = await axios.post(SERVICE.POS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            setAllPos(res?.data?.pos1);
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
            fetchPos();
        }, []
    );

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.POS_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeletePoss(res?.data?.spos);
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
    let supid = deletePoss._id;
    const deletePos = async () => {
        try {
            let res = await axios.delete(`${SERVICE.POS_SINGLE}/${supid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchPos();
            handleCloseMod();
        } catch (err) {
        }
    };

    // Excel
    const fileName = "POS";
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = pos.map((t, index) => ({
            "Sno": index + 1, Date: moment(t.date).utc().format('DD-MM-YYYY'), 'Invoice No': t.referenceno, 'Location': t.businesslocation,
            'Customer Name': t.customer, 'Contact Number': t.contactnumber,
            'Total Amount': t.aftergranddisctotal, 'Total Items': t.totalitems, 'Added By': t.userbyadd
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [pos]
    );

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | POS',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    // Pdf
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#postablepdf' })
        doc.save('POS.pdf')
    }
    const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = pos?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [pos])

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

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Headtitle title={'POS'} />
            <Typography sx={userStyle.HeaderText}>POS</Typography>
            {/* Table */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center", }}>
                        <Grid>
                            {isUserRoleCompare[0]?.csvpos && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.excelpos && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printpos && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfpos && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        {isUserRoleCompare[0]?.apos && (
                            <>
                                <Link to="/sell/pos/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
                            <MenuItem value={(pos.length)}>All</MenuItem>
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
                        <Box>
                            <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="postable" >
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell>Action</StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('date')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('date')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('referenceno')}><Box sx={userStyle.tableheadstyle}><Box>Invoice No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('referenceno')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('customer')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('contactnumber')}><Box sx={userStyle.tableheadstyle}><Box>Contact Number</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('contactnumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('aftergranddisctotal')}><Box sx={userStyle.tableheadstyle}><Box>Total Amount</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('aftergranddisctotal')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('totalitems')}><Box sx={userStyle.tableheadstyle}><Box>Total Items</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('totalitems')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('userbyadd')}><Box sx={userStyle.tableheadstyle}><Box>Added By</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('userbyadd')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component="th" scope="row">
                                                        <Grid sx={{ display: 'flex' }}>
                                                            {isUserRoleCompare[0]?.vpos && (
                                                                <>
                                                                    <Link to={`/sell/pos/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                                </>)}
                                                            {isUserRoleCompare[0]?.dpos && (
                                                                <>
                                                                    <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell align="left">{moment(row.date).utc().format('DD-MM-YYYY')}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.referenceno}</StyledTableCell>
                                                    <StyledTableCell align="left">{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.customer}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.contactnumber}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.aftergranddisctotal}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.totalitems}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.userbyadd}</StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow><StyledTableCell colSpan={11} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}
                <br /><br />
                {pageSize != 1 ? <Grid >
                    {isUserRoleCompare[0]?.apos && (
                        <>
                            <Link to="/sell/pos/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                        </>
                    )}
                </Grid> : null}

            </Box>
            <>
                <Box>
                    {/* ALERT DIALOG */}
                    <Dialog
                        open={isDeleteOpen}
                        onClose={handleCloseMod}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMod} variant="outlined">Cancel</Button>
                            <Button autoFocus variant="contained" color='error'
                                onClick={(e) => deletePos(supid)}
                            > OK </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </>

            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls} >
                <Box>
                    <Typography variant='h5' >Pos</Typography>
                </Box>
                <>
                    <Box  >
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="postablepdf" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell>Sno</StyledTableCell>
                                        <StyledTableCell align="left">Date</StyledTableCell>
                                        <StyledTableCell align="left">Invoice No.</StyledTableCell>
                                        <StyledTableCell align="left">Location</StyledTableCell>
                                        <StyledTableCell align="left">Customer Name</StyledTableCell>
                                        <StyledTableCell align="left">Contact Number</StyledTableCell>
                                        <StyledTableCell align="left">Total Amount</StyledTableCell>
                                        <StyledTableCell align="left">Total Items</StyledTableCell>
                                        <StyledTableCell align="left">Added By</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {pos && (
                                        pos.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell align="left">{moment(row.date).utc().format('DD-MM-YYYY')}</StyledTableCell>
                                                <StyledTableCell align="left">{row.referenceno}</StyledTableCell>
                                                <StyledTableCell align="left">{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                <StyledTableCell align="left">{row.customer}</StyledTableCell>
                                                <StyledTableCell align="left">{row.contactnumber}</StyledTableCell>
                                                <StyledTableCell align="left">{row.aftergranddisctotal}</StyledTableCell>
                                                <StyledTableCell align="left">{row.totalitems}</StyledTableCell>
                                                <StyledTableCell align="left">{row.userbyadd}</StyledTableCell>
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
const Poslist = () => {
    return (
        <>
            <Poslisttable /><br /><br /><br /><br />
                        <Footer />
        </>
    );
}
export default Poslist;