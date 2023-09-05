import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Paper, Button, Grid, Typography, Dialog, DialogActions, DialogContent, Table, TableBody, TableContainer, TableHead, } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import jsPDF from "jspdf";
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function Expcategorylist() {

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [excategorys, setExcategorys] = useState([]);
    const [expcat, setExpcat] = useState("");
    const [exceldata, setExceldata] = useState([]);
    const [checkExpCategory, setCheckExpCategory] = useState([])

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    //delete model
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    // check delete
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setIsCheckOpen(true); };
    const handleCloseCheck = () => { setIsCheckOpen(false); };

    // Expense Category 
    const fetchExpenseCategory = async () => {
        try {
            let res = await axios.post(SERVICE.EXPENSE_CATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setExcategorys(res?.data?.excategorys);
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
            fetchExpenseCategory();
        }, []
    );

    const rowData = async (id, categoryname) => {
        try {
            const [
                res, req
            ] = await Promise.all([
                axios.get(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                }),
                axios.post(SERVICE.EXPENSE_DELETE_EXPCATEGORY_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    role: String(isUserRoleAccess.role),
                    userassignedlocation: [isUserRoleAccess.businesslocation],
                    checkexpcategory: String(categoryname)
                })
            ])

            setExpcat(res?.data?.sexcategory);
            setCheckExpCategory(req?.data?.expenses)
            if ((req?.data?.expenses).length > 0) {
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
    let expcatid = expcat._id;

    // delete 
    const deleteExpenseCat = async (id) => {
        try {
            let response = await axios.delete(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchExpenseCategory();
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

    // get particular columns for export excel
    const excelDatas = async () => {
        var data = excategorys.map((t, index) => ({ "Sno": index + 1,'Category Name': t.categoryname, 'Category Code': t.categorycode }));
        setExceldata(data);
    }

    useEffect(
        () => {
            excelDatas();
        }, [excategorys]
    );

    // Export Excel
    const fileName = 'Expense Category'

    //  PDF
    const columns = [
        { title: "Category Name", field: "categoryname" },
        { title: "Category Code", field: "categorycode" },
    ]
    // const downloadpdf = () => {
    //     const doc = new jsPDF()
    //     doc.autoTable({
    //         theme: "grid",
    //         columns: columns.map(col => ({ ...col, dataKey: col.field })),
    //         body: excategorys
    //     })
    //     doc.save('Expense Category.pdf')
    // }
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
            doc.save("Expensecategory.pdf");
        };
    const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = excategorys?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [excategorys])

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | EXPENSE CATEGORY',
        pageStyle: 'print'
    });


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

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Typography sx={userStyle.HeaderText}>Expense Categories <Typography sx={userStyle.SubHeaderText}>Manage your expense categories</Typography></Typography>
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Typography sx={userStyle.importheadtext}>All your expense categories</Typography>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>
                            {isUserRoleCompare[0]?.excelexpensecategory && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.csvexpensecategory && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printexpensecategory && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>                        </>
                            )}
                            {isUserRoleCompare[0]?.pdfexpensecategory && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        {isUserRoleCompare[0]?.aexpensecategory && (
                            <>
                                <Link to='/expense/expensecategory/create' style={{ textDecoration: 'none', color: 'black' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
                            <MenuItem value={(excategorys.length)}>All</MenuItem>
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
                                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="expcattable" >
                                    <TableHead>
                                        <StyledTableRow>
                                        <StyledTableCell  onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('categoryname')}><Box sx={userStyle.tableheadstyle}><Box>Category Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categoryname')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('categorycode')}><Box sx={userStyle.tableheadstyle}><Box>Category Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categorycode')}</Box></Box></StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">{row.categoryname} </StyledTableCell>
                                                    <StyledTableCell align="left">{row.categorycode}</StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {isUserRoleCompare[0]?.eexpensecategory && (
                                                            <>
                                                                <Link to={`/expense/expensecategory/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                                                            </>
                                                        )}
                                                        {isUserRoleCompare[0]?.dexpensecategory && (
                                                            <>
                                                                <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.categoryname) }}><DeleteOutlineOutlinedIcon style={{ fontSize: "large" }} /></Button>
                                                            </>
                                                        )}
                                                        {isUserRoleCompare[0]?.vexpensecategory && (
                                                            <>
                                                                <Link to={`/expense/expensecategory/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                                                            </>
                                                        )}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow><StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer><br></br>
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
                    {isUserRoleCompare[0]?.aexpensecategory && (
                        <>
                            <Link to='/expense/expensecategory/create' style={{ textDecoration: 'none', color: 'black' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
                        </>
                    )}
                </Grid> : null}
                <br />
            </Box>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="expcattable" ref={componentRef}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Sno</StyledTableCell>
                            <StyledTableCell>Category Name</StyledTableCell>
                            <StyledTableCell align="left">Category Code</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {excategorys && (
                            excategorys.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">{row.categoryname} </StyledTableCell>
                                    <StyledTableCell align="left">{row.categorycode}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* printlayout ends */}
            {/* ALERT DIALOG */}
            <Dialog
                open={open}
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
                    <Button onClick={(e) => deleteExpenseCat(expcatid)} autoFocus variant="contained" color='error'> OK  </Button>
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
                        {checkExpCategory?.length > 0 ? (
                            <>
                                <span style={{ fontWeight: '700', color: '#777' }}>
                                    {`${expcat.categoryname} `}
                                </span>
                                was linked in <span style={{ fontWeight: '700' }}>Expense</span>
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
const Expensecategorylist = () => {
    return (
        <>
            <Expcategorylist /><br /><br /><br />
                        <Footer />
        </>
    );
}
export default Expensecategorylist;