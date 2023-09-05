import React, { useState, useEffect, useContext, useRef, } from 'react';
import { Box, Button, OutlinedInput, FormControl, Select, MenuItem, Table, TableBody, TableContainer, TableHead, Paper, Grid, Typography, } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { userStyle } from '../../PageStyle';
import { toast } from "react-toastify";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { ThreeDots } from 'react-loader-spinner';
import autoTable from 'jspdf-autotable';
import jsPDF from "jspdf";
import { ExportXL, ExportCSV } from '../../Export';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Passwordlistuser() {

    const [folder, setFolder] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [exceldata, setExceldata] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    //  Access
    const { auth, setngs } = useContext(AuthContext);

    const [resultdata, setResultdata] = useState([]);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAssignments = async () => {
        try {
            let res = await axios.post(SERVICE.ASSIGNPASSWORDS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userloginid: String(isUserRoleAccess.userid),
            })
            setResultdata(res?.data?.assigneds)

            await fetchFolder(res?.data?.assigneds);
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

    const fetchFolder = async (userslist) => {
        try {
            let res = await axios.post(SERVICE.FOLDER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            })
            let resdata = res.data.folders.filter((data) => {
                return userslist.includes(data?._id)
            })
            setFolder(resdata)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Excel
    const fileName = 'Passwords List'
    // get particular columns for export excel

    const getexcelDatas = async () => {
        var data = folder?.map(t => ({
            'Folder': t.foldername,
            'Passwords': t.passwordnames.join(" ,")
        }));
        setExceldata(data);
    }

    useEffect(() => {
        getexcelDatas();
    }, [folder])

    //  Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'PASSWORDS LIST',
        pageStyle: 'print'
    });

    //  PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#passwordtable' })
        doc.save('Passwords List.pdf')
    }

    useEffect(() => {
        fetchAssignments();
    }, [])

    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = folder.sort((a, b) => {
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
    const filteredDatas = folder?.filter((item) =>
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
            <Headtitle title={'Passwords List'} />
            {/* header text */}
            <Typography sx={userStyle.HeaderText}>Shared Passwords<Typography sx={userStyle.SubHeaderText} component="span">Manage your passwords</Typography></Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                <br /><br />
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
                            <MenuItem value={(folder.length)}>All</MenuItem>
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
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid>
                        {isUserRoleCompare[0]?.csvassignpassword && (
                            <>
                                <ExportCSV fileName={fileName} csvData={exceldata} />
                            </>
                        )}
                        {isUserRoleCompare[0]?.excelassignpassword && (
                            <>
                                <ExportXL fileName={fileName} csvData={exceldata} />
                            </>
                        )}
                        {isUserRoleCompare[0]?.printassignpassword && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                            </>
                        )}
                        {isUserRoleCompare[0]?.pdfassignpassword && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </>
                        )}
                    </Grid>
                </Grid>
                <br /><br />
                {isLoader ? (
                    <>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell onClick={() => handleSorting('foldername')}><Box sx={userStyle.tableheadstyle}><Box>Folder</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('foldername')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('passwordnames')}><Box sx={userStyle.tableheadstyle}><Box>Passwords</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('passwordnames')}</Box></Box></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.foldername}</StyledTableCell>
                                                <StyledTableCell>{row.passwordnames.join(" ,")}</StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={2} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer><br /><br />
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                            </Box>
                            <Box>
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
                            </Box>
                        </Box>
                        {/* Table End */}
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}

            </Box>
            <br /><br />
            {/* PRINT START */}
            <Box sx={userStyle.printcls}>
                <>
                    <Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table" id="passwordtable" ref={componentRef}>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Folder</StyledTableCell>
                                        <StyledTableCell>Passwords</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {folder && (
                                        folder.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.foldername}</StyledTableCell>
                                                <StyledTableCell>{row.passwordnames.join(" ,")}</StyledTableCell>
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

function Passworduser() {
    return (
        <>
            <Passwordlistuser /><br /><br /><br />
            <Footer /><br />
        </>
    )
}



export default Passworduser;