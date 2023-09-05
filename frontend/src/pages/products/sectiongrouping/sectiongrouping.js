import React, { useState, useContext, useEffect, useRef, createRef } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Select, Typography, TableHead, TableContainer, TableBody, Table, Paper, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { ExportXL, ExportCSV } from '../../Export';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import Selects, { components } from "react-select";
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from "react-multi-select-component";

function SectionGroupingList() {

    // Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const { auth, setngs } = useContext(AuthContext);

    const [sectionGroupList, setSectionGroupList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sectionGrp, setSectionGrp] = useState({ sectionname: "" });
    const [sectionGrpEdit, setSectionGrpEdit] = useState({ sectionname: "" });
    const [checkDuplicate, setCheckDuplicate] = useState([]);
    const [selectedOptionsAddCate, setSelectedOptionsAddCate] = useState([]);
    const [selectedOptionsEditCate, setSelectedOptionsEditCate] = useState("");
    let [valueCateAdd, setValueCateAdd] = useState("")
    let [valueCateEdit, setValueCateEdit] = useState("")
    const [isLoader, setIsLoader] = useState(false);
    const [sectionGrpDelete, setSectionGrpDelete] = useState({});
    const [exceldata, setExceldata] = useState([]);
    const [checkSection, setCheckSection] = useState([])

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");
    const [items, setItems] = useState([]);

    // delete model
    const [deleteOpen, setDeleteOpen] = useState(false);
    const handleClickOpen = () => { setDeleteOpen(true); };
    const handleClose = () => { setDeleteOpen(false); };

    // check delete
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setIsCheckOpen(true); };
    const handleCloseCheck = () => { setIsCheckOpen(false); };

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenError = () => { setIsErrorOpen(true); };
    const handleCloseError = () => { setIsErrorOpen(false); };

   // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  }; 

    // Edit Modal Popup
    const [groupEditModal, setGroupEditModal] = useState(false);
    const groupEditModOpen = () => { setGroupEditModal(true); };
    const groupEditModClose = () => { setGroupEditModal(false); };

    // check edit
    const [overAllSection, setOverAllSection] = useState("");
    const [getSection, setGetSection] = useState("");
    const [editSectionCount, setEditSectionCount] = useState("");

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    // View Modal Popup
    const [groupViewModal, setGroupViewModal] = useState(false);
    const groupViewModOpen = () => { setGroupViewModal(true); };
    const groupViewModClose = () => { setGroupViewModal(false); };



    const InputOption = ({
        getStyles,
        Icon,
        isDisabled,
        isFocused,
        isSelected,
        children,
        innerProps,
        ...rest
    }) => {
        const [isActive, setIsActive] = useState(false);
        const onMouseDown = () => setIsActive(true);
        const onMouseUp = () => setIsActive(false);
        const onMouseLeave = () => setIsActive(false);

        // styles
        let bg = "transparent";
        if (isFocused) bg = "#eee";
        if (isActive) bg = "#B2D4FF";

        const style = {
            alignItems: "center",
            backgroundColor: bg,
            color: "inherit",
            display: "flex "
        };

        // prop assignment
        const props = {
            ...innerProps,
            onMouseDown,
            onMouseUp,
            onMouseLeave,
            style
        };

        return (
            <components.Option
                {...rest}
                isDisabled={isDisabled}
                isFocused={isFocused}
                isSelected={isSelected}
                getStyles={getStyles}
                innerProps={props}
            >
                <input type="checkbox" checked={isSelected} />
                {children}
            </components.Option>
        );
    };

    const fetchCategory = async () => {
        try {
            let res = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setCategories(res?.data?.categories?.flatMap((d) =>
                d?.subcategories?.map((t) => (
                    {
                        ...t,
                        label: d.categoryname + "_" + t.subcategryname,
                        value: d.categoryname + "_" + t.subcategryname
                    }
                ))
            ));

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);


    // Add
    const handleCategoryChange = (options) => {
        const mergedCategories = options.reduce((accumulator, currentOption) => {

            const categoryName = currentOption.value.split('_')[0];
            const subCategoryName = currentOption.value.split('_')[1];

            const existingCategory = accumulator.find(
                (category) => category.categoryname === categoryName
            );

            if (existingCategory) {
                existingCategory.subcategories.push({ subcategryname: subCategoryName });
            } else {
                accumulator.push({
                    categoryname: categoryName,
                    subcategories: [{ subcategryname: subCategoryName }],
                });
            }

            return accumulator;
        }, []);

        setValueCateAdd(mergedCategories);
        setSelectedOptionsAddCate(options);
    };

    const customValueRendererCate = (valueCateAdd, _categories) => {
        return valueCateAdd.length
            ? valueCateAdd.map(({ label }) => label).join(", ")
            : "Please select category_subcategory";
    };

    const customValueRendererCateEdit = (valueCateEdit, _categories) => {
        return valueCateEdit.length
            ? valueCateEdit.map(({ label }) => label).join(", ")
            : "Please select category_subcategory";
    };
    // clear
    const handleClearSelection = () => {
        setSectionGrp({ sectionname: "" })
        setSelectedOptionsAddCate([]);
    };

    const sendRequest = async () => {
        try {
            let res = await axios.post(SERVICE.SECTION_GROUP_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                sectionname: String(sectionGrp.sectionname),
                categories: [...valueCateAdd],
            });
            setSectionGrp(res.data);
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setSectionGrp({ sectionname: "" })
            await fetchSectionGroup();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const handleSubmit = () => {
        const isNameMatch = checkDuplicate?.some(item => item.toLowerCase() === (sectionGrp.sectionname).toLowerCase());
        if (sectionGrp.sectionname == "") {
            setShowAlert("Please Enter Section!");
            handleClickOpenError();
        } else if (isNameMatch) {
            setShowAlert("Section Already Exists!");
            handleClickOpenError();
        } else if (valueCateAdd.length == "" || 0) {
            setShowAlert("Please Select Category!");
            handleClickOpenError();
        }
        else {
            sendRequest();
        }
    };

    // Section Group
    const fetchSectionGroup = async () => {
        try {
            let res = await axios.post(SERVICE.SECTION_GROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setSectionGroupList(res?.data?.sectiongoups);
            let result = res.data.sectiongoups.map((data, index) => {
                return data.sectionname
            })
            setCheckDuplicate(result);
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
        fetchSectionGroup();
    }, []);

    const rowData = async (id, sectionname) => {
        try {
            const [
                res, req
            ] = await Promise.all([
                axios.get(`${SERVICE.SECTION_GROUP_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                }),
                axios.post(SERVICE.STOCKADJUST_DELETE_SECTION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checksection: String(sectionname)
                }),
            ])
            setSectionGrpDelete(res?.data?.ssectiongroup); //set function to get particular row           
            setSectionGrpEdit(res?.data?.ssectiongroup)
            setValueCateAdd(res?.data?.ssectiongroup?.categories)
            setValueCateEdit(res?.data?.ssectiongroup?.categories)

            // delete
            setCheckSection(req?.data?.stockadjust)
            if ((req?.data?.stockadjust)?.length > 0) {
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
    };


    // edit
    const rowDataEdit = async (id) => {
        try {

            let res = await axios.get(`${SERVICE.SECTION_GROUP_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            setSectionGrpDelete(res?.data?.ssectiongroup); //set function to get particular row           
            setSectionGrpEdit(res?.data?.ssectiongroup)
            setValueCateAdd(res?.data?.ssectiongroup?.categories);
            setValueCateEdit(res?.data?.ssectiongroup?.categories);
            //edit check popup
            getOverallEditSection(res?.data?.ssectiongroup?.sectionname);
            setGetSection(res?.data?.ssectiongroup?.sectionname);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    //alert delete popup
    let catid = sectionGrpDelete._id;

    const deleteCats = async (catid) => {
        try {
            let res = await axios.delete(`${SERVICE.SECTION_GROUP_SINGLE}/${catid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchSectionGroup();
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

    // Edit    
    const getunitvaluesCate = (e) => {

        setSelectedOptionsEditCate(
            Array.isArray(e?.categories)
                ? e?.categories?.flatMap((x) =>
                    x?.subcategories?.map((y) => ({
                        ...y,
                        label: x.categoryname + "_" + y.subcategryname,
                        value: x.categoryname + "_" + y.subcategryname,
                    }))
                )
                : []
        );
    };

    // edit
    const handleChangeCate = (selectedOptions) => {

        const mergedCategories = selectedOptions.reduce((accumulator, currentOption) => {

            const categoryName = currentOption.value.split('_')[0];
            const subCategoryName = currentOption.value.split('_')[1];

            const existingCategory = accumulator.find(
                (category) => category.categoryname === categoryName
            );

            if (existingCategory) {
                existingCategory.subcategories.push({ subcategryname: subCategoryName });
            } else {
                accumulator.push({
                    categoryname: categoryName,
                    subcategories: [{ subcategryname: subCategoryName }],
                });
            }

            return accumulator;
        }, []);
        setValueCateEdit(mergedCategories);
        setSelectedOptionsEditCate(selectedOptions);
    };

    //overall edit section for all pages 
    const getOverallEditSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.SECTION_GROUP_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                sectionname: String(e),
            });
            setEditSectionCount(res?.data?.count);
            setOverAllSection(`The ${e} is linked in 
                ${res?.data?.stockadjusts?.length > 0 ? "Stock Adjust," : ""} whether you want to do changes ..??`
            )
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    //overall edit section for all pages 
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.SECTION_GROUP_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                sectionname: getSection,
            });
            sendEditRequestOverall(res?.data?.stockadjusts)
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    const sendEditRequestOverall = async (stockadjusts) => {
        try {
            if (stockadjusts?.length > 0) {
                let answ = stockadjusts.map((d, i) => {
                    let res = axios.put(`${SERVICE.STOCK_ADJUSTMENT_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        section: sectionGrp.sectionname,
                    });
                })
            }
        } catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something 8 went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    const edit_id = sectionGrpEdit._id;

    const sendUpdateRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.SECTION_GROUP_SINGLE}/${edit_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                sectionname: String(sectionGrpEdit.sectionname),
                categories: [...valueCateEdit],
            });
            await getOverallEditSectionUpdate()
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            groupEditModClose();
            await fetchSectionGroup();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const handleEditSubmit = () => {
        if (sectionGrpEdit.sectionname == "") {
            setShowAlert("Please Enter Section!");
            handleClickOpenError();
        }
        else if (sectionGrpEdit.sectionname != getSection && editSectionCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {overAllSection} </p>
                </>
            );
            handleClickOpenerrpop()
        }
        else if (valueCateEdit.length == "" || 0) {
            setShowAlert("Please Select Category!");
            handleClickOpenError();
        }
        else {
            sendUpdateRequest();
        }
    };

    // Excel
    const fileName = "Section";
    // get perticular columns for export excel
    const sectionexcel = async () => {
        var data = sectionGroupList.map((t, index) => ({ "Sno": index + 1,"Section Name": t.sectionname, "Categories": t.categories?.map((item) => item?.categoryname)?.join(",") }));
        setExceldata(data);
    }

    useEffect(
        () => {
            sectionexcel();
        }, [sectionGroupList]
    )

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Section Grouping',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    // PDF
    const columns = [
        { title: "Section Name", field: "Section Name" },
        { title: "Categories", field: "Categories" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: exceldata,
        });
        doc.save("Section.pdf");
    };

    // Sorting
    const addSerialNumber = () => {
        const itemsWithSerialNumber = sectionGroupList?.map((item, index) => ({ ...item, sno: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [sectionGroupList]);

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

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    };

    return (
        <Box>
            <Headtitle title={'Section Grouping'} />
            <Typography sx={userStyle.HeaderText}>Add Section Grouping</Typography>
            {/* content start */}
            {isUserRoleCompare[0]?.asectiongrp && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={4}></Grid>
                        <form>
                            <Grid container spacing={3} sx={userStyle.textInput}>
                                <Grid item md={4} sm={12} xs={12}>
                                    <InputLabel htmlFor="component-outlined">Section Name <b style={{ color: 'red' }}>*</b></InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            value={sectionGrp.sectionname}
                                            onChange={(e) => { setSectionGrp({ ...sectionGrp, sectionname: e.target.value }); }}
                                            id="component-outlined"
                                            type="text"
                                            name="sectionname"
                                            placeholder='Section Name'
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={7} sm={12} xs={12} >
                                    <InputLabel id="demo-select-small">Category and SubCategory <b style={{ color: 'red' }}>*</b></InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            id="component-outlined"
                                            options={categories}
                                            value={selectedOptionsAddCate}
                                            onChange={(e) => { handleCategoryChange(e); }}
                                            valueRenderer={customValueRendererCate}
                                            name="Category Name"
                                            placeholder="Please select category_subcategory"
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            components={{
                                                Option: InputOption
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid><br /><br />
                            <Grid container sx={userStyle.gridcontainer}>
                                <Grid sx={{ display: 'flex' }}>
                                    <Button sx={userStyle.buttonadd} onClick={handleSubmit}>SAVE</Button>
                                    <Button sx={userStyle.buttoncancel} onClick={handleClearSelection}>CLEAR</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box><br /><br />
                </>
            )}
            <Box sx={userStyle.container} >
                <Typography sx={userStyle.HeaderText}>List Section Grouping</Typography>
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
                            <MenuItem value={(sectionGroupList.length)}>All</MenuItem>
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
                { /* Header Buttons */}
                <Grid container sx={{ justifyContent: "center", }} >
                    <Grid>
                        {isUserRoleCompare[0]?.csvsectiongrp && (
                            <>
                                <ExportCSV csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0]?.excelsectiongrp && (
                            <>
                                <ExportXL csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0]?.printsectiongrp && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                            </>
                        )}
                        {isUserRoleCompare[0]?.pdfsectiongrp && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={downloadPdf}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </>
                        )}
                    </Grid>
                    {/* Table Grid Container */}
                </Grid><br /><br />
                { /* Table Start */}
                {isLoader ? (
                    <Box>
                        <>
                            <TableContainer component={Paper} >
                                <Table aria-label="simple table">
                                    <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
                                        <StyledTableRow >
                                            <StyledTableCell onClick={() => handleSorting('sno')}><Box sx={userStyle.tableheadstyle}><Box> S.No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sno')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('sectionname')}><Box sx={userStyle.tableheadstyle}><Box>Section Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sectionname')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('categoryname')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categoryname')}</Box></Box></StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell >{row.sno}</StyledTableCell>
                                                    <StyledTableCell >{row.sectionname}</StyledTableCell>
                                                    <StyledTableCell >{row?.categories?.map((item) => item?.categoryname)?.join(",")}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row" colSpan={1}>
                                                        <Grid sx={{ display: 'flex' }}>
                                                            {isUserRoleCompare[0]?.esectiongrp && (
                                                                <>
                                                                    <Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }} onClick={(e) => { groupEditModOpen(); rowDataEdit(row._id); getunitvaluesCate(row); }} ><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.dsectiongrp && (
                                                                <>
                                                                    <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.sectionname) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.vsectiongrp && (
                                                                <>
                                                                    <Button sx={userStyle.buttonview} style={{ minWidth: '0px' }} onClick={(e) => { groupViewModOpen(); rowDataEdit(row._id); }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
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
                        </>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}
                { /* Table End */}
            </Box>

            {/* Edit */}
            <Box>
                <Dialog
                    open={groupEditModal}
                    onClose={groupEditModClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #b97df0',
                        },
                    }}
                    maxWidth="md"
                >
                    <form>
                        <DialogTitle id="customized-dialog-title1" onClose={groupEditModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                            Edit Section Grouping
                        </DialogTitle>
                        <DialogContent dividers style={{
                            minWidth: '750px', height: '430px', '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #4a7bf7 !important',
                            },
                        }}
                            sx={userStyle.filtercontentpopup}
                        >
                            <Grid container spacing={3} sx={userStyle.textInput}>
                                <Grid item md={4} sm={12} xs={12}>
                                    <InputLabel htmlFor="component-outlined">Section Name <b style={{ color: 'red' }}>*</b></InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            value={sectionGrpEdit.sectionname}
                                            onChange={(e) => { setSectionGrpEdit({ ...sectionGrpEdit, sectionname: e.target.value }); }}
                                            id="component-outlined"
                                            type="text"
                                            name="sectionname"
                                            placeholder='Section Name'
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={7} sm={12} xs={12} >
                                    <InputLabel id="demo-select-small">Category and SubCategory<b style={{ color: 'red' }}>*</b></InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            id="component-outlined"
                                            options={categories}
                                            isMulti
                                            value={selectedOptionsEditCate}
                                            onChange={(e) => { handleChangeCate(e); }}
                                            valueRenderer={customValueRendererCateEdit}
                                            name="Category Name"
                                            placeholder="Please select category_subcategory"
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            components={{
                                                Option: InputOption
                                            }}


                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={handleEditSubmit}>Update</Button>
                            <Button onClick={groupEditModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>

            {/* View */}
            <Box>
                <Dialog
                    open={groupViewModal}
                    onClose={groupViewModClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #b97df0',
                        },
                    }}
                    maxWidth="md"
                >
                    <form>
                        <DialogTitle id="customized-dialog-title1" onClose={groupViewModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                            View Section Grouping
                        </DialogTitle>
                        <DialogContent dividers style={{
                            minWidth: '750px', height: '300px', '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #4a7bf7 !important',
                            },
                        }}
                            sx={userStyle.filtercontentpopup}
                        >
                            <Grid container spacing={3} sx={userStyle.textInput}>
                                <Grid item md={4} sm={12} xs={12}>
                                    <InputLabel htmlFor="component-outlined">Section Name</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            value={sectionGrpEdit.sectionname}
                                            id="component-outlined"
                                            type="text"
                                            name="sectionname"
                                            placeholder='Section Name'
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={7} sm={12} xs={12} >
                                    <InputLabel id="demo-select-small">Category</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            readOnly
                                            value={sectionGrpEdit.categories?.map((item) => item?.categoryname)?.join(",")}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={groupViewModClose} variant='contained' sx={userStyle.buttoncancel}>Back</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>

            { /* ****** Table End ****** */}
            {/* Print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="producttablepdf" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
                        <StyledTableRow >
                        <StyledTableCell >S.No</StyledTableCell>
                            <StyledTableCell >Section Name</StyledTableCell>
                            <StyledTableCell >Category</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {sectionGroupList?.length > 0 ? (
                            sectionGroupList.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell >{index + 1}</StyledTableCell>
                                    <StyledTableCell >{row.sectionname}</StyledTableCell>
                                    <StyledTableCell >{row.categories?.map((item) => item?.categoryname)?.join(",")}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (<StyledTableCell colSpan={3}><Typography>No data available in table</Typography></StyledTableCell>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            {/* delete */}
            <Box>
                <Dialog
                    open={deleteOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={(e) => deleteCats(catid)}>ok</Button>
                        <Button sx={userStyle.buttoncancel} onClick={handleClose}>CANCEL</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseError}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseError}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                        {checkSection?.length > 0 ? (
                            <>
                                <span style={{ fontWeight: '700', color: '#777' }}>
                                    {`${sectionGrpDelete.sectionname} `}
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

            {/* Check edit popup */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={() => {
                            sendRequest();
                            handleCloseerrpop();
                        }}>
                            ok
                        </Button>
                        <Button
                            sx={userStyle.buttoncancel}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    );
}
function SectionGrouping() {
    return (
        <>
            <SectionGroupingList /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default SectionGrouping;