import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import jsPDF from "jspdf";
import { useReactToPrint } from 'react-to-print';
import autoTable from 'jspdf-autotable';
import { ExportXL, ExportCSV } from '../../Export';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';


function AdjustmentTypelist({saveType}) {

    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [adjustments, setAdjustments] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const [delAdjust, setDelAdjust] = useState({});
    const [checkAdjType, setCheckAdjType] = useState([])

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // Delete model   
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleDeleteOpen = () => { setIsDeleteOpen(true); };
    const handleDeleteClose = () => { setIsDeleteOpen(false); };

    // check delete
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setIsCheckOpen(true); };
    const handleCloseCheck = () => { setIsCheckOpen(false); };

    // Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    // adjustment
    const fetchAdjustment = async () => {
        try {
            let res = await axios.post(SERVICE.ADJUSTMENTTYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setAdjustments(res?.data?.adjustments);
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
        fetchAdjustment();
    },[saveType])

    const rowData = async (id, adjustmentitem) => {
    
        try {
            const [
                res,
                req
            ] = await Promise.all([
                axios.get(`${SERVICE.ADJUSTMENTTYPE_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }),
                axios.post(SERVICE.STOCKADJUST_DELETE_ADJUSTTYPE_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checkadjusttype: String(adjustmentitem)
                })
            ])
            setDelAdjust(res?.data?.sadjustment);
            setCheckAdjType(req?.data?.stockadjust)
            if ((req?.data?.stockadjust).length > 0) {
                handleClickOpenCheck();
            }
            else {
                handleDeleteOpen();
            }
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
    let userid = delAdjust._id;

    const deleteUser = async (cusid) => {
        try {
            let res = await axios.delete(`${SERVICE.ADJUSTMENTTYPE_SINGLE}/${cusid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            handleDeleteClose();
            await fetchAdjustment();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };


    // Export Excel
    const fileName = 'Adjustments'
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = adjustments.map((t, index) => ({
            "Sno": index + 1,
            'Adjustment Type': t.adjustmentitem,
            'Mode': t.mode,
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [adjustments]
    );

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Adjustment Type ',
        pageStyle: 'print'
    });

    // Pdf
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#Adjustmenttable' })
        doc.save('Stock_Adjustment.pdf')
    }
    const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = adjustments?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [adjustments])

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
                        <ArrowDropUpOutlinedIcon adjustment={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon adjustment={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon adjustment={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon adjustment={{ color: 'black', fontSize: '1.6rem' }} />
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

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

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
            <Headtitle title={'List Adjustment Type'} />
            {/* header text */}
            <Typography sx={userStyle.HeaderText}>List Adjustment Type<Typography component="span" sx={userStyle.SubHeaderText}>Manage List Adjustment</Typography></Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>
                            {isUserRoleCompare[0]?.csvstockadjustmenttype && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.excelstockadjustmenttype && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printstockadjustmenttype && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfstockadjustmenttype && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
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
                            <MenuItem value={(adjustments.length)}>All</MenuItem>
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
                <Box>
                    {isLoader ? (
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <StyledTableRow >
                                            <StyledTableCell>Action</StyledTableCell>
                                            <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('adjustmentitem')}><Box sx={userStyle.tableheadstyle}><Box>Adjustment Master</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('adjustmentitem')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('mode')}><Box sx={userStyle.tableheadstyle}><Box>Mode</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mode')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>
                                                        <Grid sx={{ display: 'flex' }}>
                                                            {isUserRoleCompare[0]?.estockadjustmenttype && (
                                                                <>
                                                                    <Link to={`/stock/adjustmenttype/edit/${row._id}`} adjustment={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit} ><EditOutlinedIcon adjustment={{ fontSize: 'large' }} /></Button></Link>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.vstockadjustmenttype && (
                                                                <>

                                                                    <Link to={`/stock/adjustmenttype/view/${row._id}`} adjustment={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} adjustment={{ minWidth: '0px' }}><VisibilityOutlinedIcon adjustment={{ fontSize: 'large' }} /></Button></Link>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.dstockadjustmenttype && (
                                                                <>

                                                                    <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.adjustmentitem) }}><DeleteOutlineOutlinedIcon adjustment={{ fontsize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">{row.adjustmentitem}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">{row.mode}</StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow><StyledTableCell colSpan={5} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer><br /><br /></>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        </>
                    )}
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
            </Box>
            {/* Print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="Adjustmenttable" ref={componentRef}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Sno</StyledTableCell>
                            <StyledTableCell>Adjustment Master</StyledTableCell>
                            <StyledTableCell>Mode</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                        {adjustments &&
                            (adjustments.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">{row.adjustmentitem}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">{row.mode}</StyledTableCell>
                                </StyledTableRow>
                            ))
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* printlayout ends */}
            {/* ALERT DIALOG */}
            <Dialog
                open={isDeleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} variant="outlined">Cancel</Button>
                    <Button onClick={(e) => deleteUser(userid)} autoFocus variant="contained" color='error'> OK </Button>
                </DialogActions>
            </Dialog>

            {/* check delete */}
            <Dialog
                open={isCheckOpen}
                onClose={handleCloseCheck}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
                        {checkAdjType?.length > 0 ? (
                            <>
                                <span style={{ fontWeight: '700', color: '#777' }}>
                                    {`${delAdjust.adjustmentitem} `}
                                </span>
                                was linked in <span style={{ fontWeight: '700' }}>Stock Adjust</span>
                            </>
                        ) : (
                            ''
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCheck} autoFocus variant="contained" color='error'> OK </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}

export default AdjustmentTypelist;