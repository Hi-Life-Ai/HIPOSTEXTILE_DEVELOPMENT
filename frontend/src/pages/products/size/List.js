import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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

function Sizelisttable() {

    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const [size, setSize] = useState({});
    const [checkProdSize, setCheckProdSize] = useState([])
    const [checkStockSize, setCheckStockSize] = useState([])

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    //delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // check delete
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setIsCheckOpen(true); };
    const handleCloseCheck = () => { setIsCheckOpen(false); };

    // size
    const fetchSize = async () => {
        try {
            let res = await axios.post(SERVICE.SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setSizes(res?.data?.sizes);
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

    const rowData = async (id, sizename) => {
        try {
            const [
                res,
                reqprod, reqstock
            ] = await Promise.all([
                axios.get(`${SERVICE.SIZE_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                }),
                axios.post(SERVICE.PRODUCT_DELETE_SIZE_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checksize: String(sizename)
                }),
                axios.post(SERVICE.STOCK_DELETE_SIZE_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checksize: String(sizename)
                })
            ])

            setSize(res?.data?.ssize);//set function to get particular row
            setCheckProdSize(reqprod?.data?.products)
            setCheckStockSize(reqstock?.data?.stock)
            if ((reqprod?.data?.products)?.length > 0 || (reqstock?.data?.stock)?.length > 0) {
                handleClickOpenCheck();
            }
            else {
                handleClickOpen();
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
    let sizeid = size._id;
    const deleteSize = async (sizeid) => {
        try {
            let res = await axios.delete(`${SERVICE.SIZE_SINGLE}/${sizeid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchSize();
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
            fetchSize();
        }, []
    );

    // Export Excel
    const fileName = 'sizes'

    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = sizes.map((t, index) => ({ "Sno": index + 1,'Size Name': t.sizename, }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [sizes]
    );

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Size',
        pageStyle: 'print'
    });

    // PDF
    const downloadPdf = () => {
        const newData = sizes.map(row => {
            delete row._id;
            delete row.createdAt;
            delete row.__v;
            delete row.assignbusinessid;
        })

        const doc = new jsPDF()
        autoTable(doc, { html: '#sizetable' })
        doc.save('Sizes.pdf')
    }

    const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = sizes?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [sizes])

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

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Headtitle title={'sizes'} />
            {/* header text */}
            <Typography sx={userStyle.HeaderText}>Size<Typography component="span" sx={userStyle.SubHeaderText}>Manage your Size</Typography></Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}></Grid>
                    <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>
                            {isUserRoleCompare[0]?.excelsize && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.csvsize && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}

                            {isUserRoleCompare[0]?.printsize && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfsize && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        {isUserRoleCompare[0]?.asize && (
                            <>
                                <Link to="/product/size/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
                    <Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Action</StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('sizename')}><Box sx={userStyle.tableheadstyle}><Box>Size Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sizename')}</Box></Box></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>
                                                    <Grid sx={{ display: 'flex' }}>
                                                        {isUserRoleCompare[0]?.esize && (
                                                            <>
                                                                <Link to={`/product/size/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} ><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                            </>
                                                        )}
                                                        {isUserRoleCompare[0]?.dsize && (
                                                            <>
                                                                <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.sizename) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                            </>
                                                        )}
                                                        {isUserRoleCompare[0]?.vsize && (
                                                            <>
                                                                <Link to={`/product/size/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </StyledTableCell>
                                                <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.sizename}</StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={4} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                        <br /> <br />
                        {pageSize != 1 ? <Grid >
                            {isUserRoleCompare[0]?.asize && (
                                <>
                                    <Link to="/product/size/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
                                </>
                            )}<br /><br />
                        </Grid> : null}
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}
            </Box>
            {/* content end */}
            {/* Print layout */}
            {/* ****** Table Start ****** */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="sizetable" ref={componentRef}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Sno</StyledTableCell>
                            <StyledTableCell>Size Name</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                        {sizes &&
                            (sizes.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">{row.sizename}</StyledTableCell>
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
                    <Button onClick={(e) => deleteSize(sizeid)} autoFocus variant="contained" color='error'> OK </Button>
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
                        {checkProdSize?.length > 0 && checkStockSize?.length > 0 ? (
                            <>
                                <span style={{ fontWeight: '700', color: '#777' }}>
                                    {`${size.sizename} `}
                                </span>
                                was linked in <span style={{ fontWeight: '700' }}>Product, Stock</span>
                            </>
                        ) : checkProdSize?.length > 0 || checkStockSize?.length > 0
                            ? (
                                <>
                                    <span style={{ fontWeight: '700', color: '#777' }}>
                                        {`${size.sizename} `}
                                    </span>
                                    was linked in{' '}
                                    <span style={{ fontWeight: '700' }}>
                                        {checkProdSize?.length ? ' Product' : ''}
                                        {checkStockSize?.length ? ' Stock' : ''}
                                    </span>
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
        </Box>
    );
}

function Sizelist() {
    return (
<>
<Sizelisttable /><br /><br /><br /><br />
                    <Footer />
</>
    );
}
export default Sizelist;