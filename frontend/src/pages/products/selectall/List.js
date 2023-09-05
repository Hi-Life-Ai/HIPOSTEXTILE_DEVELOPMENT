import React, { useState, useContext, useEffect, useRef, createRef } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Select, Typography, TableHead, TableContainer, TableBody, Table, Paper, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
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
// import Selects from "react-select";

function SectionGroupingList() {

    // Access
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
    const [isPoints, setIsPonits] = useState({project:"", pointvalue:0})

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

 
  const accounttypes = [
    { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
    { value: "ANDHRA BANK", label: "ANDHRA BANK" },
    { value: "AXIS BANK", label: "AXIS BANK" },
    { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
    { value: "BANK OF BARODA", label: "BANK OF BARODA" },
    { value: "CITY UNION BANK", label: "CITY UNION BANK" },
    { value: "UCO BANK", label: "UCO BANK" },
    { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
    { value: "BANK OF INDIA", label: "BANK OF INDIA" },
    { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
    { value: "CANARA BANK", label: "CANARA BANK" },
    { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
    { value: "CORPORATION BANK", label: "CORPORATION BANK" },
    { value: "INDIAN BANK", label: "INDIAN BANK" },
    { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
    { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
    { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
    { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
    { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
    { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
    { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
    { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
    { value: "VIJAYA BANK", label: "VIJAYA BANK" },
    { value: "DENA BANK", label: "DENA BANK" },
    { value: "BHARATIYA MAHILA BANK LIMITED", label: "BHARATIYA MAHILA BANK LIMITED" },
    { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
    { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
    { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
    { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
    { value: "PAYTM BANK", label: "PAYTM BANK" },
    { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
    { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
    { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
    { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
    { value: "YES BANK LTD", label: "YES BANK LTD" },
    { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
    { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
    { value: "DCB BANK", label: "DCB BANK" },
    { value: "IDFC BANK", label: "IDFC BANK" },
    { value: "JAMMU AND KASHMIR BANK BANK", label: "JAMMU AND KASHMIR BANK BANK" },
    { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
    { value: "RBL BANK", label: "RBL BANK" },
    { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
    { value: "CSB BANK", label: "CSB BANK" }

];



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

    return (
        <Box>
            <Headtitle title={'Add Pontis'} />
            <Typography sx={userStyle.HeaderText}>Add POINTS</Typography>
            <>
                <Box sx={userStyle.container}>
                    <Grid item xs={4}></Grid>
                    <form>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={7} sm={12} xs={12} >
                                <InputLabel id="demo-select-small">Project <b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={accounttypes}
                                        styles={colourStyles}
                                        onChange={(e) => { setIsPonits({...isPoints, project: e.value}) }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={7} sm={12} xs={12} >
                                <InputLabel id="demo-select-small">Category<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <MultiSelect
                                        id="component-outlined"
                                        options={categories}
                                        value={selectedOptionsAddCate}
                                        onChange={(e) => { handleCategoryChange(e); }}
                                        valueRenderer={customValueRendererCate}
                                        name="Category Name"
                                        placeholder="Please select category"
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        components={{
                                            Option: InputOption
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Points <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        value={isPoints.pointvalue}
                                        onChange={(e) => { setIsPonits({ ...isPoints, pointvalue: e.target.value }) }}
                                        type="text"
                                        name="sizename"
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
        </Box>

    );
}
function SelectAllGrouping() {
    return (
        <>
            <SectionGroupingList /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default SelectAllGrouping;