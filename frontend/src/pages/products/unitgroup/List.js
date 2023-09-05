import React, { useState, useContext, useEffect, useRef } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Select, Typography, TableHead, TableContainer, TableBody, Table, Paper, MenuItem, TextareaAutosize, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { ExportXL, ExportCSV } from '../../Export';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import Selects from "react-select";
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { ThreeDots } from 'react-loader-spinner';

function UnitGroupingList() {

    const { auth, setngs } = useContext(AuthContext);
    // Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    const [unitgroupcreate, setUnitGroupCreate] = useState({ unit: { value: '', label: '' }, quantity: 0, unitgrouping: { value: '', label: '' } })
    const [groupinglist, setgroupinglist] = useState([]);

    const [exceldata, setExceldata] = useState([]);

    const [units, setUnits] = useState([]);
    const [isUnit, setIsunit] = useState([]);
    const [EditIsunits, setIsEditUnits] = useState([])
    const [isLoader, setIsLoader] = useState(false);
    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };



    //delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [unitdgroupld, setUnitGroupld] = useState({});
    const handleClickOpenD = () => { setIsDeleteOpen(true); };
    const handleCloseD = () => { setIsDeleteOpen(false); };

    // edit modal
    const [editOpen, setEditOpen] = useState(false);
    const handleClickOpenE = () => { setEditOpen(true); };
    const handleCloseE = () => { setEditOpen(false); };

    // view model
    const [viewOpen, setViewOpen] = useState(false);
    const handleClickOpenV = () => { setViewOpen(true); };
    const handleCloseV = () => { setViewOpen(false); };

    const handleClear = () => {
        setUnitGroupCreate({ unit: { value: '', label: '' }, quantity: "", unitgrouping: { value: '', label: '' } })
    }

    const incrementQuantity = (e) => {
        setUnitGroupCreate({ ...unitgroupcreate, quantity: parseInt(unitgroupcreate.quantity) + 1 })
    };

    const decrementQuantity = () => {
        setUnitGroupCreate({ ...unitgroupcreate, quantity: parseInt(unitgroupcreate.quantity) - 1 })
    };





    const incrementQuantityEdit = (e) => {
        setUnitGroupld({ ...unitdgroupld, quantity: parseInt(unitdgroupld.quantity) + 1 })
    };

    const decrementQuantityEdit = () => {

        setUnitGroupld({ ...unitdgroupld, quantity: parseInt(unitdgroupld.quantity) - 1 })
    };

    const rowData = async (id) => {
        try {
            let response = await axios.get(`${SERVICE.UNIT_GROUP_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            setUnitGroupld(response?.data?.sunitgrouping);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Units
    const fetchUnit = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            const unitid = res?.data?.units.map((d) => (
                {
                    ...d,
                    label: d.unit,
                    value: d.unit,
                }
            ));
            setUnits(unitid);

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

    const fetchUnitGroup = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setgroupinglist(res?.data?.unitgroupings);
            setIsunit(res?.data?.unitgroupings);
            setIsLoader(true);
        } catch (err) {
            setIsLoader(true);
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };



    const fetchEditUnitGroup = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setIsEditUnits(res?.data?.unitgroupings?.filter(item => item._id !== unitdgroupld._id));
        } catch (err) {
            setIsLoader(true);
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    useEffect(() => {
        fetchUnit();
    }, [])


    useEffect(() => {
        fetchUnitGroup();
        fetchEditUnitGroup();
    }, [isUnit])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

        

    const sendRequest = async () => {
        try {
            let response = await axios.post(SERVICE.UNIT_GROUP_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                unit: String(unitgroupcreate.unit == "Please Select Unit" ? "ALL" : unitgroupcreate.unit),
                quantity: Number(unitgroupcreate.quantity),
                unitgrouping: String(unitgroupcreate.unitgrouping == "Please Select Unit" ? "ALL" : unitgroupcreate.unitgrouping),
                assignbusinessid: String(setngs.businessid),
            });
            setUnitGroupCreate(response.data)
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setUnitGroupCreate({ unit: unitgroupcreate.unit, quantity: 0, unitgrouping: unitgroupcreate.unitgrouping })
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }

    };


    const deleteUnits = async () => {
        try {
            let response = await axios.delete(`${SERVICE.UNIT_GROUP_SINGLE}/${unitdgroupld._id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchUnitGroup();
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

    const sendRequestUpdate = async () => {
        try {
            let response = await axios.put(`${SERVICE.UNIT_GROUP_SINGLE}/${unitdgroupld._id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                unit: String(unitdgroupld.unit == "Please Select Unit" ? "ALL" : unitdgroupld.unit),
                quantity: Number(unitdgroupld.quantity),
                unitgrouping: String(unitdgroupld.unitgrouping == "Please Select Unit" ? "ALL" : unitdgroupld.unitgrouping),
                assignbusinessid: String(setngs.businessid),
            });
            setUnitGroupCreate(response.data)
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            handleCloseE()
            setUnitGroupCreate({ quantity: "" })
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    };

    const handleSubmit = () => {

        const isNameMatch =     isUnit.some(item => item?.unit?.toLowerCase() === (unitgroupcreate?.unit)?.toLowerCase());
        if (unitgroupcreate.quantity == '') {
            setShowAlert("Please Enter quantity")
            handleClickOpen()
        }
        else if (unitgroupcreate.unit.value == '') {
            setShowAlert("Please Enter Unit")
            handleClickOpen()
        } else if (unitgroupcreate.unitgrouping.value == '') {
            setShowAlert("Please Select UnitGrouping")
            handleClickOpen()
        }
        else if (isNameMatch) {
            setShowAlert("Unit Name already exists")
            handleClickOpen();
        }
        else {
            sendRequest()

        }

    }

    const handleSubmitEdit = () => {
        const isNameMatch = EditIsunits.some(item => item.unit.toLowerCase() === (unitdgroupld.unit).toLowerCase());
        if (unitdgroupld.quantity == '') {
            setShowAlert("Please Select quantity")
            handleClickOpen()
        } else if (unitdgroupld.unit == "") {
            setShowAlert("Please Enter Unit")
            handleClickOpen()
        } else if (unitdgroupld.unitgrouping == '') {
            setShowAlert("Please Select UnitGrouping")
            handleClickOpen()
        }
        else if (isNameMatch) {
            setShowAlert("Unit Name already exists")
            handleClickOpen();
        } else {
            sendRequestUpdate()
        }

    }

    // Excel
    const fileName = "Grouping";
    // get perticular columns for export excel
    const productexcel = async () => {
        var data = items.map(t => ({
            "Unit": t.unit, "UnitGrouping": t.unitgrouping, "Quantity": t.quantity
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            productexcel();
        }, [groupinglist]
    )

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Grouping',
        pageStyle: 'print'
    });

    // PDF
    const downloadPdf = () => {
        const doc = new jsPDF();
        autoTable(doc, { html: '#Groupingtablepdf' });
        doc.save('Grouping.pdf')
    }
    const [items, setItems] = useState([]);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = groupinglist?.map((item, index) => ({ ...item, serialNumber: index + 1, unitgrouping: item.quantity + " " + item.unitgrouping }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [groupinglist])

    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = items?.sort((a, b) => {
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
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.length > 0 && filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
            <Headtitle title={'Unit Grouping'} />
            <Typography sx={userStyle.HeaderText}>Add Unit Grouping</Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                
                <Grid container spacing={3} sx={userStyle.textInput}>
                    <Grid item md={4} sm={12} xs={12}>
                        <InputLabel >Unit <b style={{ color: 'red', }}>*</b></InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                options={units}
                                onChange={(e) => { setUnitGroupCreate({ ...unitgroupcreate, unit: e.value }) }}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12} >
                        <InputLabel id="demo-select-small">Quantity <b style={{ color: 'red', }}>*</b></InputLabel>
                        <Grid sx={{ display: "flex" }}>
                            {unitgroupcreate.quantity == 0 ? "" : <Grid sx={userStyle.spanIcons} >
                                <RemoveCircleOutlineOutlinedIcon onClick={decrementQuantity} disabled />
                            </Grid>}

                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    name="Quantity"
                                    placeholder='Quantity'
                                    value={unitgroupcreate.quantity}
                                    type='number'
                                    onChange={(e) => { setUnitGroupCreate({ ...unitgroupcreate, quantity: e.target.value }); }}
                                />
                            </FormControl>
                            <Grid sx={userStyle.spanIcons}>
                                <AddCircleOutlineOutlinedIcon onClick={(e) => { incrementQuantity(e) }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <InputLabel >Unit Grouping <b style={{ color: 'red', }}>*</b></InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                options={units}
                                onChange={(e) => { setUnitGroupCreate({ ...unitgroupcreate, unitgrouping: e.value }) }}


                            />
                        </FormControl>
                    </Grid>
                </Grid><br /><br />
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid sx={{ display: 'flex' }}>
                        <Button sx={userStyle.buttonadd} onClick={handleSubmit} >SAVE</Button>
                        <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                    </Grid>
                </Grid>
            </Box><br /><br />
            <Box sx={userStyle.container} >

                <Grid container spacing={2}>
                    <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography sx={userStyle.importheadtext}>List Unit Grouping</Typography>
                    </Grid>
                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>
                            {isUserRoleCompare[0]?.csvUnitGroup && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.excelUnitGroup && (
                                <>

                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printUnitGroup && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfUnitGroup && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={downloadPdf}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>

                </Grid>
                <br></br>
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
                { /* Table Start */}
                <Box>

                    <>
                        <TableContainer component={Paper} >
                            <Table aria-label="simple table">
                                <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} ref={componentRef}>
                                    <StyledTableRow >

                                        <StyledTableCell onClick={() => handleSorting('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('unitgrouping')}><Box sx={userStyle.tableheadstyle}><Box>Unit Grouping</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unitgrouping')}</Box></Box></StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell >{row?.unit}</StyledTableCell>
                                                <StyledTableCell >{row?.unitgrouping}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row" colSpan={1}>
                                                    <Grid sx={{ display: 'flex' }}>
                                                        {isUserRoleCompare[0]?.eUnitGroup && (
                                                            <>
                                                                <Button sx={userStyle.buttonedit} onClick={() => { rowData(row._id); handleClickOpenE() }} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                            </>
                                                        )}
                                                        {isUserRoleCompare[0]?.dUnitGroup && (
                                                            <>
                                                                <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id); handleClickOpenD() }}    ><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                            </>
                                                        )}
                                                        {isUserRoleCompare[0]?.vUnitGroup && (
                                                            <>
                                                                <Button sx={userStyle.buttonview} onClick={(e) => { rowData(row._id); handleClickOpenV() }} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={5} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                        <br />  <br />
                    </>
                </Box>
                { /* Table End */}
            </Box>

            {/* edit formate */}
            <Box>
                <Dialog
                    open={editOpen}
                    onClose={handleCloseE}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #b97df0',
                        },
                        overflow: "none", 
                      
                    }}
                    maxWidth="lg"
                
                    fullWidth

                >
                    <DialogTitle id="customized-dialog-title1" onClose={handleCloseE} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Edit Unit Grouping
                    </DialogTitle>
                    <DialogContent dividers 
                    sx={{
                        minWidth: '750px', height: '500px', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                        '&. MuiDialogContent-root':{
                            overflow:'hidden', 
                           }
                    }}
                  
                    >
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel >Unit<b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={units}
                                        placeholder={unitdgroupld.unit}
                                        onChange={(e) => { setUnitGroupld({ ...unitdgroupld, unit: e.value }) }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12} >
                                <InputLabel id="demo-select-small">Quantity<b style={{ color: 'red', }}>*</b></InputLabel>

                                <Grid sx={{ display: "flex" }}>
                                    {unitdgroupld.quantity == 0 ? "" : <Grid sx={userStyle.spanIcons} >
                                        <RemoveCircleOutlineOutlinedIcon onClick={decrementQuantityEdit} />
                                    </Grid>}

                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="component-outlined"
                                            type="number"
                                            name="Quantity"
                                            placeholder='Quantity'
                                            value={unitdgroupld.quantity}
                                            onChange={(e) => { setUnitGroupld({ ...unitdgroupld, quantity: e.target.value }) }}
                                        />
                                    </FormControl>
                                    <Grid sx={userStyle.spanIcons} >
                                        <AddCircleOutlineOutlinedIcon onClick={incrementQuantityEdit} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel >Unit Grouping<b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={units}
                                        placeholder={unitdgroupld.unitgrouping}
                                        onChange={(e) => { setUnitGroupld({ ...unitdgroupld, unitgrouping: e.value }) }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid><br /><br />
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid sx={{ display: 'flex' }}>
                                <Button sx={userStyle.buttonadd} onClick={handleSubmitEdit} >UPDATE</Button>
                                <Button sx={userStyle.buttoncancel} onClick={handleCloseE}>CANCEL</Button>
                            </Grid>
                        </Grid>
                    </DialogContent>

                </Dialog>
            </Box>

            {/* View modal */}
            <Box>
                <Dialog
                    open={viewOpen}
                    onClose={handleCloseV}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #b97df0',
                        },
                    }}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle id="customized-dialog-title1" onClose={handleCloseE} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        View Unit Grouping
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '750px', height: '500px', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel >Unit<b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput value={unitdgroupld.unit} />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12} >
                                <InputLabel id="demo-select-small">Quantity<b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        type="number"
                                        name="Quantity"
                                        placeholder='Quantity'
                                        value={unitdgroupld.quantity}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel >Unit Grouping<b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput value={unitdgroupld.unitgrouping} />
                                </FormControl>
                            </Grid>
                        </Grid><br /><br />
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid sx={{ display: 'flex' }}>
                                <Button sx={userStyle.buttoncancel} onClick={handleCloseV}>BACK</Button>
                            </Grid>
                        </Grid>
                    </DialogContent>

                </Dialog>
            </Box>

            { /* ****** Table End ****** */}
            {/* Print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table aria-label="simple table" id="Groupingtablepdf" ref={componentRef} >
                    <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
                        <StyledTableRow >
                            <StyledTableCell >SI.No</StyledTableCell>
                            <StyledTableCell >Unit</StyledTableCell>
                            <StyledTableCell >Unit Grouping</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {items.length > 0 ? (
                            items.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell >{row?.serialNumber}</StyledTableCell>
                                    <StyledTableCell >{row?.unit}</StyledTableCell>
                                    <StyledTableCell >{row?.unitgrouping}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (<StyledTableCell colSpan={8}><Typography>No data available in table</Typography></StyledTableCell>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>


            <Dialog
                open={isDeleteOpen}
                onClose={handleCloseD}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseD} variant="outlined">Cancel</Button>
                    <Button autoFocus variant="contained" color='error' onClick={() => { deleteUnits(unitdgroupld._id); handleCloseD() }}> OK </Button>
                </DialogActions>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
function UnitGrouping() {
    return (
        <>
             <UnitGroupingList /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}

export default UnitGrouping;