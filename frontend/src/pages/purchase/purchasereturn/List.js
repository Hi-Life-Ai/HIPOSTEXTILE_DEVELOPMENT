import React, { useState, useEffect, useRef, useContext } from "react";
import { useReactToPrint } from 'react-to-print';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Typography, DialogContent, Paper, Select, MenuItem, FormControl, OutlinedInput, TableHead, Table, TableContainer, TableBody, Dialog, DialogActions, Grid } from '@mui/material';
import { FaPrint, FaFilePdf } from "react-icons/fa";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { Link } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import "rsuite/dist/rsuite.css";
import Footer from '../../../components/footer/Footer';
import jsPDF from "jspdf";
import { ExportXL, ExportCSV } from '../../Export';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { ThreeDots } from 'react-loader-spinner';
import moment from 'moment';

const Purchasereturntablelist = () => {

    const [purchasesrtn, setpurchasesrtn] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [deletepur, setDeletepur] = useState({});
    const { auth, setngs } = useContext(AuthContext);
    const [isLocations, setIsLocations] = useState([]);
    const [purchaseData, setPurchaseData] = useState([]);

    // Access
    const { isUserRoleCompare, isUserRoleAccess, allLocations } = useContext(UserRoleAccessContext);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // Purchase 
    const fetchHandler = async () => {
        try {
            let response = await axios.post(SERVICE.PURCHASE_RETURN, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

            setIsLocations(allLocations);
            setpurchasesrtn(response?.data?.purchasesrtn);
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

    useEffect(
        () => {
            fetchHandler();
        }, []);

    //set function to get particular row
    const rowDataDel = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PURCHASE_RETURN_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeletepur(res?.data?.spurchsertn);
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
    let supid = deletepur._id;
    const deletePurchase = async () => {
        try {
            await axios.delete(`${SERVICE.PURCHASE_RETURN_SINGLE}/${supid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchHandler();
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
    const fileName = "Purchase Return";
    // get particular columns for export excel
    const getexcelDatas = async () => {

        var data = purchasesrtn?.map((t, index) => ({
            "Sno": index + 1,
            "Date": moment(t.purchasedate).format('DD/MM/YYYY'),
            "Reference No": t.referenceno,
            "Location": t.businesslocation, "Supplier": t.supplier,
            "Invoice No": t.invoiceno,
            "Purchase Return Status": t.purchasestatus,
            "Grand Total": t.grandtotal, "Return Total": t.nettotal,
            "Product Name": t.prodname,
        }));
        setPurchaseData(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [purchasesrtn]);

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | PURCHASE RETURN',
        pageStyle: 'print'
    });

    // //  PDF
    // const downloadPdf = () => { 
    //     const doc = new jsPDF()
    //     doc.autoTable({
    //         theme: "grid",
    //         columns: columns.map(col => ({ ...col, dataKey: col.field })),
    //         body: purchasesrtn
    //     })
    //     doc.save('purchaseReturn.pdf')
    // }
    const columns = [
        { title: "Date", field: "purchasedate" },
        { title: "Reference No", field: "referenceno" },
        { title: "Location", field: "businesslocation" },
        { title: "Supplier", field: 'supplier' },
        { title: "Invoice No", field: 'invoiceno' },
        { title: " Purchase Return Status", field: 'purchasestatus', },
        { title: "Grand Total", field: 'nettotal' },
    ]
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
            doc.save("Purchasereturn.pdf");
        };

    const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = purchasesrtn?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [purchasesrtn])


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
        <>
            <Box>
                <Headtitle title={'Purchase Return List'} />
                <Typography sx={userStyle.HeaderText}>Purchase Return List</Typography>
            </Box>
            <br />
            <>
                <Box sx={userStyle.container}>
                    { /* Table header  */}
                    <Grid container>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>All your purchasesrtn return</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right !important' }}>
                            {isUserRoleCompare[0]?.apurchasereturn && (
                                <>
                                    <Link to="/purchase/purchasereturn/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                                </>
                            )}
                        </Grid>
                    </Grid><br /><br />
                    <Grid lg={12} md={12} sm={12} xs={12} style={userStyle.dataTablestyle}>
                        <Box>
                            <label htmlFor="pageSizeSelect">Show&ensp;</label>
                            <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={(purchasesrtn.length)}>All</MenuItem>
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
                    </Grid><br />
                    { /* Table export btn */}
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            {isUserRoleCompare[0]?.csvpurchasereturn && (
                                <>
                                    <ExportCSV csvData={purchasesrtn} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.excelpurchasereturn && (
                                <>
                                    <ExportXL csvData={purchasesrtn} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printpurchasereturn && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfpurchasereturn && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => { downloadPdf() }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid><br /><br />
                    { /* Table start */}
                    <Box>
                        {isLoader ? (
                            <>
                                <TableContainer component={Paper} >
                                    <Table aria-label="customized table" id="purchasetable">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell> Action </StyledTableCell>
                                                <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('purchasedate')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('purchasedate')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('referenceno')}><Box sx={userStyle.tableheadstyle}><Box>Reference No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('referenceno')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('supplier')}><Box sx={userStyle.tableheadstyle}><Box>Supplier</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('supplier')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('invoiceno')}><Box sx={userStyle.tableheadstyle}><Box>Invoice No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('invoiceno')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('purchasestatus')}><Box sx={userStyle.tableheadstyle}><Box>Purchase Return Status</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('purchasestatus')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('grandtotal')}><Box sx={userStyle.tableheadstyle}><Box> Grand Total</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('grandtotal')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('nettotal')}><Box sx={userStyle.tableheadstyle}><Box>Return Total</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('nettotal')}</Box></Box></StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredData.length > 0 ?
                                                (filteredData.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell>
                                                            {row.purchasestatus == "Transfer" ?
                                                                <Grid sx={{ display: 'flex' }}>
                                                                    {isUserRoleCompare[0]?.vpurchasereturn && (<Link to={`/purchase/purchasereturn/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                                </Grid>
                                                                :
                                                                <Grid sx={{ display: 'flex' }}>
                                                                    {isUserRoleCompare[0]?.epurchasereturn && (<Link to={`/purchase/purchasereturn/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                                    {isUserRoleCompare[0]?.vpurchasereturn && (<Link to={`/purchase/purchasereturn/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                                    {isUserRoleCompare[0]?.dpurchasereturn && (<Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowDataDel(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                                                                </Grid>
                                                            }
                                                        </StyledTableCell>
                                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                        <StyledTableCell>{moment(row.purchasedate).format('DD-MM-YYYY')}</StyledTableCell>
                                                        <StyledTableCell>{row.referenceno}</StyledTableCell>
                                                        <StyledTableCell>{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                        <StyledTableCell>{row.supplier}</StyledTableCell>
                                                        <StyledTableCell>{row.invoiceno}</StyledTableCell>
                                                        <StyledTableCell>{row.purchasestatus}</StyledTableCell>
                                                        <StyledTableCell>₹ {(row.grandtotal) ? row.grandtotal : 0}</StyledTableCell>
                                                        <StyledTableCell>₹ {(row.nettotal) ? row.nettotal : 0}</StyledTableCell>
                                                    </StyledTableRow>
                                                )))
                                                : <StyledTableRow><StyledTableCell colSpan={14} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                            </>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        )}

                    </Box>
                    { /* Table end */}
                </Box>
            </>
            <>
                <Box>
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
                            <Button autoFocus variant="contained" color='error' onClick={(e) => deletePurchase(supid)}> OK </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                <TableContainer component={Paper} sx={userStyle.printcls} >
                    <Table aria-label="customized table" id="purchasetable" ref={componentRef}>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Sno</StyledTableCell>
                                <StyledTableCell> Date</StyledTableCell>
                                <StyledTableCell> Reference No</StyledTableCell>
                                <StyledTableCell> Location </StyledTableCell>
                                <StyledTableCell> Supplier </StyledTableCell>
                                <StyledTableCell> Invoice No</StyledTableCell>
                                <StyledTableCell> Purchase Return Status</StyledTableCell>
                                <StyledTableCell> Grand Total</StyledTableCell>
                                <StyledTableCell> Return Total</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {purchasesrtn && (
                                purchasesrtn.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                        <StyledTableCell>{moment(row.purchasedate).format('DD-MM-YYYY')}</StyledTableCell>
                                        <StyledTableCell>{row.referenceno}</StyledTableCell>
                                        <StyledTableCell>{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                        <StyledTableCell>{row.supplier}</StyledTableCell>
                                        <StyledTableCell>{row.invoiceno}</StyledTableCell>
                                        <StyledTableCell>{row.purchasestatus}</StyledTableCell>
                                        <StyledTableCell>₹ {(row.grandtotal) ? row.grandtotal : 0}</StyledTableCell>
                                        <StyledTableCell>₹ {(row.nettotal) ? row.nettotal : 0}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </>
    )
}

function Purchasereturnlists() {
    return (
        <>
             <Purchasereturntablelist /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default Purchasereturnlists;