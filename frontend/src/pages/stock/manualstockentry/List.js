import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { Box, Table, TableBody, Select, MenuItem, FormControl, OutlinedInput, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { useReactToPrint } from "react-to-print";
import { userStyle } from '../../PageStyle';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import { ThreeDots } from 'react-loader-spinner';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';

function ManualStocktable() {


    const [isLoader, setIsLoader] = useState(false);
    const [exceldata, setExceldata] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const [isLocations, setIsLocations] = useState([]);
    const [manualstockdelete, setManualstockdelete] = useState([]);
    const { isUserRoleCompare, allLocations } = useContext(UserRoleAccessContext);
    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");


    const [manualstocklist, setManualstocklist] = useState([]);


    // Delete model   
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleDeleteOpen = () => { setIsDeleteOpen(true); };
    const handleDeleteClose = () => { setIsDeleteOpen(false); };



    //fetch manualstock...
    const fetchManualstock = async () => {
        try {
            let res = await axios.post(SERVICE.MANUALSTOCKENTRY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setManualstocklist(res?.data?.manualstocks);
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

    useEffect(() => {
        fetchManualstock()
    }, []);

    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.MANUALSTOCKENTRY_SINGLE}/${id}` ,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setManualstockdelete(res?.data?.smanualstock);
            handleDeleteOpen();

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }


    //alert delete popup...
    let manualstockid = manualstockdelete._id;

    const deletestock = async () => {
        try {
            let res = await axios.delete(`${SERVICE.MANUALSTOCKENTRY_SINGLE}/${manualstockid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            handleDeleteClose();
            await fetchManualstock();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Export Excel
    const fileName = 'Manual Stock Entry'
    // get perticular columns for export excel


    const getexcelDatas = async () => {
        var data = manualstocklist.map((t, i) => (
            {
                'Productname' : t.productname,
                'Category': t.category,
                'Subcategory': t.subcategory,
                'Brand': t.brand,
                'SubBrand': t.subbrand,
                'Size':t.size,
                'Color': t.color,
                'Style': t.style,
                'Unit': t.unit,
                'PurchsaeRate': t.purchaserate,
                'AlphaRate': t.alpha,
                'TaxType': t.sellcostwithtax,
                'TaxRate':t.sellcostwithouttax,
                'SellingPrice':t.saletaxamount,


            }));
        setExceldata(data);
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | Manual Stock Entry',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    //  PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#manualstockentryPDF' })
        doc.save('ManualStock.pdf')
    }


    useEffect(() => {
        getexcelDatas();
    }, [manualstocklist]);

    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = manualstocklist.sort((a, b) => {
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
    const filteredDatas = manualstocklist?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
            <Headtitle title={'Manual Stock List'} />
            {/* header text */}
            <Typography sx={userStyle.HeaderText}>Manual Stock List<Typography component="span" sx={userStyle.SubHeaderText}>Manage Manual Stock Entry</Typography></Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Typography sx={userStyle.importheadtext}>Manual Stock List</Typography>
                    </Grid>
                    <Grid item lg={6} md={7} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>

                            <ExportCSV csvData={exceldata} fileName={fileName} />

                            <ExportXL csvData={exceldata} fileName={fileName} />


                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>

                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                        </Grid>
                    </Grid>
                    <Grid item lg={3} md={2} sm={12} xs={12}>

                        <Link to="/stock/manualstockentry/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>

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
                            <MenuItem value={(manualstocklist.length)}>All</MenuItem>
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
                        <TableContainer component={Paper} >
                            <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Actions</StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategory')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('brand')}><Box sx={userStyle.tableheadstyle}><Box>Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('brand')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('subbrand')}><Box sx={userStyle.tableheadstyle}><Box>Sub Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subbrand')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('size')}><Box sx={userStyle.tableheadstyle}><Box>Size</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('size')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('color')}><Box sx={userStyle.tableheadstyle}><Box>Color</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('color')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('style')}><Box sx={userStyle.tableheadstyle}><Box>Style</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('style')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('purchaserate')}><Box sx={userStyle.tableheadstyle}><Box>Purchase Rate</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('purchaserate')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('alpha')}><Box sx={userStyle.tableheadstyle}><Box>AlphaRate</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('alpha')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('sellcostwithtax')}><Box sx={userStyle.tableheadstyle}><Box>TaxType</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sellcostwithtax')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('sellcostwithouttax')}><Box sx={userStyle.tableheadstyle}><Box>TaxRate</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sellcostwithouttax')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('saletaxamount')}><Box sx={userStyle.tableheadstyle}><Box>SellingPrice</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('saletaxamount')}</Box></Box></StyledTableCell>

                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell component="th" scope="row">
                                                    <Grid sx={{ display: 'flex' }}>
                                                        <Button sx={userStyle.buttondelete} onClick={(e) => {rowData(row._id)}} ><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                        <Link to={`/stock/manualstockentry/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                    </Grid>
                                                </StyledTableCell>
                                                <StyledTableCell >{row.productname}</StyledTableCell>
                                                <StyledTableCell >{row.category}</StyledTableCell>
                                                <StyledTableCell >{row.subcategory}</StyledTableCell>
                                                <StyledTableCell >{row.brand}</StyledTableCell>
                                                <StyledTableCell >{row.subbrand}</StyledTableCell>
                                                <StyledTableCell >{row.size}</StyledTableCell>
                                                <StyledTableCell >{row.color}</StyledTableCell>
                                                <StyledTableCell >{row.style}</StyledTableCell>
                                                <StyledTableCell >{row.unit}</StyledTableCell>
                                                <StyledTableCell >{row.purchaserate}</StyledTableCell>
                                                <StyledTableCell >{row.alpha}</StyledTableCell>
                                                <StyledTableCell >{row.sellcostwithtax}</StyledTableCell>
                                                <StyledTableCell >{row.sellcostwithouttax}</StyledTableCell>
                                                <StyledTableCell >{row.saletaxamount}</StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={20} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}
                <br /><br />
                {pageSize != 1 ? <Grid >

                    <Link to="/stock/manualstockentry/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                </Grid> : null}
            </Box>
            {/* content end */}

            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls} >
                <Box>
                    <Typography variant='h5' >Manual Stock Entry</Typography>
                </Box>
                <>
                    <Box>
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="manualstockentryPDF" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell ><b>Product Name</b></StyledTableCell>
                                        <StyledTableCell><b>Category</b></StyledTableCell>
                                        <StyledTableCell ><b>Sub Category</b></StyledTableCell>
                                        <StyledTableCell ><b>Brand</b></StyledTableCell>
                                        <StyledTableCell ><b>Sub Brand</b></StyledTableCell>
                                        <StyledTableCell ><b>Size</b></StyledTableCell>
                                        <StyledTableCell ><b>Color</b></StyledTableCell>
                                        <StyledTableCell ><b>Style</b></StyledTableCell>
                                        <StyledTableCell ><b>Unit</b></StyledTableCell>
                                        <StyledTableCell ><b>Purchase Rate</b></StyledTableCell>
                                        <StyledTableCell ><b>Alpha Rate</b></StyledTableCell>
                                        <StyledTableCell ><b>Tax Type</b></StyledTableCell>
                                        <StyledTableCell ><b>Tax Rate</b></StyledTableCell>
                                        <StyledTableCell ><b>Selling Price</b></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {manualstocklist && (
                                        manualstocklist.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell >{row.productname}</StyledTableCell>
                                                <StyledTableCell >{row.category}</StyledTableCell>
                                                <StyledTableCell >{row.subcategory}</StyledTableCell>
                                                <StyledTableCell >{row.brand}</StyledTableCell>
                                                <StyledTableCell >{row.subbrand}</StyledTableCell>
                                                <StyledTableCell >{row.size}</StyledTableCell>
                                                <StyledTableCell >{row.color}</StyledTableCell>
                                                <StyledTableCell >{row.style}</StyledTableCell>
                                                <StyledTableCell >{row.unit}</StyledTableCell>
                                                <StyledTableCell >{row.purchaserate}</StyledTableCell>
                                                <StyledTableCell >{row.alpha}</StyledTableCell>
                                                <StyledTableCell >{row.sellcostwithtax}</StyledTableCell>
                                                <StyledTableCell >{row.sellcostwithouttax}</StyledTableCell>
                                                <StyledTableCell >{row.saletaxamount}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

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
                                <Button onClick={(e) => deletestock(manualstockid)} autoFocus variant="contained" color='error'> OK </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box>
        </Box >
    );
}

function ManualStockList() {
    return (
        <>
            <ManualStocktable /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default ManualStockList;
