export const userStyle = {
  
    container: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(0 0 0 / 60%)',
        boxShadow: '0px 0px 20px #00000029',
        borderRadius: '12px',
        fontWeight: '400 !important',
        fontSize: '16px',
        height: 'max-content',
        padding: '30px',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '16px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #4a7bf7 !important',
        },
        '& .MuiOutlinedInput-root': {
            border: 'none !important',
            height: '40px',
        },
        '& .MuiFormControl-root': {
            margin: '1px !important'
        },
        '& .MuiIconButton-root': {
            margin: '-2px'
        },
        '&. MuiTypography-root': {
            color: 'rgb(0 0 0 / 60%)'
        }

    },
    alertOutline: {
        '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #4a7bf7 !important',
        },
    },
    filtercontent: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: '#4747ff',
        boxShadow: '0px 0px 20px #00000029',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        fontWeight: '400 !important',
        fontSize: '16px',
        height: 'max-content',
        padding: '30px',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '16px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #4a7bf7 !important',
        },
    },
    root: {
        display: 'flex'
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: 'drawerWidth'
    },
    drawerPaper: {
        width: 'drawerWidth'
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    closeicon: {
        textAlign: 'right',
        fontSize: '25px !important',
    },

    inputdisable:{
        color:'black',
        '& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
            opacity: 1,
            webkitTextFillColor: 'black',
        },
    },

    buttonadd: {
        backgroundColor: '#4a7bf7 !important',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '40px !important',
        padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#d8970d !important',
        }
    },
    buttoncancel: {
        backgroundColor: '#878080 !important',
        color: 'white',
        textTransform: 'UpperCase',
        marginRight: '5px !important',
        height: '40px !important',
        padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#5a5656 !important',
        }
    },
    gridcontainer: {
        marginTop: '50px',
        marginBottom: '20px',
        justifyContent: 'center',
    },
    buttongrp: {
        backgroundColor: 'rgb(245 243 246) !important',
        color: '#4a7bf7 !important',
        borderColor: '#ddd !important',
        margin: '1px !important',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: '12px !important',
    },
    HeaderText: {
        fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontSize: "23px",
        fontWeight: "600",
        margin: "10px 0px 10px 0px",
        color: '#4747ff !important',
    },
    SubHeaderText: {
        fontSize: "15px",
        display: "inline-block",
        paddingLeft: "4px",
        fontWeight: "300",
        lineHeight: "1",
        color: '#4747ff !important',
    },
    buttonedit: {
        backgroundColor: '#1572e8 !important',
        borderColor: '#1367d1 !important',
        color: '#fff !important',
        margin: '1px !important',
        marginRight: '5px !important',
        alignItems: 'center !important',
        textAlign: 'center !important',
        justifyContent: 'center !important',
        height: '30px !important',
        fontSize: '12px !important',
        fontWeight: '750 !important',
        minWidth: '0px'
    },
    buttonview: {
        background: '#11cdef !important',
        borderColor: '#0fb9d8 !important',
        color: '#fff !important',
        margin: '1px !important',
        marginRight: '5px !important',
        alignItems: 'center !important',
        textAlign: 'center !important',
        justifyContent: 'center !important',
        height: '30px !important',
        fontSize: '12px !important',
        fontWeight: '750 !important',
        minWidth: '0px'
    },
    buttondelete: {
        background: '#f5365c !important',
        borderColor: '#f41e48 !important',
        color: '#fff !important',
        margin: '1px !important',
        marginRight: '5px !important',
        alignItems: 'center !important',
        textAlign: 'center !important',
        justifyContent: 'center !important',
        height: '30px !important',
        fontSize: '12px !important',
        fontWeight: '750 !important',
        minWidth: '0px'
    },
    buttonpay: {
        background: 'orange !important',
        borderColor: '#0fb9d8 !important',
        color: '#fff !important',
        margin: '1px !important',
        marginRight: '5px !important',
        alignItems: 'center !important',
        textAlign: 'center !important',
        justifyContent: 'center !important',
        height: '30px !important',
        fontSize: '12px !important',
        fontWeight: '750 !important',
        minWidth: '0px'
    },
    buttonactivate: {
        background: 'yellow !important',
        borderColor: '#4a7bf7 !important',
        color: '#fff !important',
        margin: '1px !important',
        marginRight: '5px !important',
        alignItems: 'center !important',
        textAlign: 'center !important',
        justifyContent: 'center !important',
        height: '30px !important',
        fontSize: '12px !important',
        fontWeight: '750 !important',
        minWidth: '0px'
    },
    buttonmore: {
        marginTop: '20px',
        marginBottom: '20px',
        justifyContent: 'center'
    },
    spanIconsAddPopup: {
        fontSize: '16px',
        paddingTop: '5px !important',
        paddingLeft: '7px',
        paddingRight: '1px',
        margin: 'auto',
        border: '1px solid #4A7BF7',
        width: '45px !important',
        height: '40px',
        borderRadius: '2px',
        backgroundColor: 'white',
        color: '#4A7BF7',
        cursor: 'pointer',
    },
    filtercontentpopup: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: '#4747ff',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '400 !important',
        fontSize: '16px',
        height: 'max-content',
        padding: '30px',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '16px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #4a7bf7 !important',
        },
    },
    spanIcons: {
        fontSize: '16px',
        paddingTop: '5px !important',
        paddingLeft: '7px',
        paddingRight: '1px',
        margin: 'auto',
        border: '1px solid #4a7bf7',
        width: '45px !important',
        height: '40px',
        borderRadius: '2px',
        backgroundColor: 'white',
        color: '#4a7bf7',
        cursor: 'pointer',
    },
    spanIconTax: {
        fontSize: '16px',
        paddingTop: '8px !important',
        paddingLeft: '11px',
        paddingRight: '1px',
        margin: 'auto',
        border: '1px solid #4a7bf7',
        width: '45px !important',
        height: '40px',
        borderRadius: '2px',
        backgroundColor: 'white',
        color: '#4a7bf7',
    },
    spanText: {
        paddingTop: '6px !important',
        paddingLeft: '11px',
        paddingRight: '11px',
        fontSize: '20px',
        border: '1px solid #4a7bf7',
        width: 'maxcontent',
        height: '40px',
        borderRadius: '2px',
        backgroundColor: 'white',
        color: '#7009AB',
    },
    spanTextRadio: {
        paddingTop: '0px !important',
        paddingLeft: '11px',
        paddingRight: '11px',
        fontSize: '20px',
        border: '1px solid #4a7bf7',
        width: 'maxcontent',
        height: '40px',
        borderRadius: '2px',
        backgroundColor: 'white',
        color: '#7009AB',
    },
    uploadBtn: {
        color: 'white',
        border: '1px solid #4a7bf7 !important',
        borderRadius: '7px !important',
        backgroundColor: '#4a7bf7 ',
        width: '159px !important',
        fontSize: '13px !important',
        fontWeight: '600 !important',
        '&:hover': {
            backgroundColor: 'white ',
            color: '#7009ab ',
        },
    },
    reportTableBoldtxt: {
        display: 'flex',
        fontWeight: 'bolder',
    },
    reportTabletxt: {
        color: '##777',
    },
    footerStyle: {
        fontSize: '16px !important',
        fontWeight: '600 !important',
        textAlign: 'center !important'
    },
    footerSmlTxtStyle: {
        fontSize: '16  !important',
        fontWeight: '400 !important',
    },

    // create page table style(green)
    tableHead1: {
        // fontWeight:'bold !important',
        fontSize: '15px',
        background: '#5CB85C !important',
        color: 'black !important',
    },

    // Import 
    importheadtext: {
        fontSize: '20px !important',
        color: '#4a7bf7 !important',
    },
    importsubheadtext: {
        margin: '0',
    },

    // business settings
    formBorder: {
        '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #4a7bf7',
        },
    },

    // pos create
    buttonpaid: {
        backgroundColor: '#98D973 !important',
        color: '#fff !important',
        height: '25px !important',
    },
    btnExpress: {
        backgroundColor: ' #605ca8',
        color: 'white',
        fontSize: '11px',
        fontWeight: 'bold',
        margin: '5px',
    },
    btnMax: {
        backgroundColor: '#337ab7',
        color: 'white',
        margin: '5px',
    },
    btnCal: {
        backgroundColor: '#5cb85c',
        color: 'white',
        margin: '5px',
    },
    btnClose: {
        backgroundColor: '#d9534f',
        color: 'white',
        marginLeft: '5px',
    },
    btnBack: {
        backgroundColor: '#31b0d5',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        marginTop: '2px',
        height: '30px !important',
        // padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        width: '115px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        },
        '@media only screen and (maxWidth: 600px)': {
            fontSize: '10px',
            padding: '1px',
            width: '65px',
        },
        '@media only screen and (maxWidth: 983px)': {
            fontSize: '10px',
            padding: '1px',
            width: '55px',
        },
        '@media only screen and (maxWidth: 1102px)': {
            fontSize: '10px',
            width: '85px !important',

            // padding: '1px',
        },
    },

    btnPause: {
        backgroundColor: '#ffad46',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '30px !important',
        marginTop: '2px',
        padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        width: '115px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        },
        '@media only screen and (maxWidth: 600px)': {
            fontSize: '9px',
            padding: '1px',
            width: '65px',
        },
        '@media only screen and (maxWidth: 983px)': {
            fontSize: '10px',
            padding: '1px',
            width: '55px',
        },
        '@media only screen and (maxWidth: 1102px)': {
            fontSize: '9px',
            width: '85px !important',

            // padding: '1px',
        },
    },
    btnCred: {
        backgroundColor: '#605ca8',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '30px !important',
        marginTop: '2px',
        // padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        width: '115px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        },
        '@media only screen and (maxWidth: 600px)': {
            fontSize: '12px',
            padding: '1px',
            width: '65px',
        },
        '@media only screen and (maxWidth: 983px)': {
            fontSize: '10px',
            padding: '1px',
            width: '55px',
        },
        '@media only screen and (maxWidth: 1102px)': {
            fontSize: '12px',
            width: '85px !important',

            // padding: '1px',
        },
    },
    btnCard: {
        backgroundColor: '#d81b60',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '30px !important',
        marginTop: '2px',
        // padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        width: '115px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        },
        '@media only screen and (maxWidth: 600px)': {
            fontSize: '10px',
            padding: '1px',
            width: '65px',
        },
        '@media only screen and (maxWidth: 983px)': {
            fontSize: '10px',
            padding: '1px',
            width: '55px',
        },
        '@media only screen and (maxWidth: 1102px)': {
            fontSize: '10px',
            width: '85px !important',

            // padding: '1px',
        },
    },
    btnCash: {
        backgroundColor: '#2dce89',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '30px !important',
        marginTop: '2px',
        // padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        width: '115px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        },
        '@media only screen and (maxWidth: 600px)': {
            fontSize: '10px',
            padding: '1px',
            width: '65px',
        },
        '@media only screen and (maxWidth: 983px)': {
            fontSize: '10px',
            padding: '1px',
            width: '55px',
        },
        '@media only screen and (maxWidth: 1102px)': {
            fontSize: '10px',
            width: '85px !important',
            // padding: '1px',
        },
    },
    btnCancel: {
        backgroundColor: '#f5365c',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '30px !important',
        marginTop: '2px',
        // padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        width: '115px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        },
        '@media only screen and (maxWidth: 600px)': {
            fontSize: '10px',
            padding: '1px',
            width: '65px',
        },
        '@media only screen and (maxWidth: 983px)': {
            fontSize: '10px',
            padding: '1px',
            width: '55px',
        },
        '@media only screen and (maxWidth: 1102px)': {
            fontSize: '10px',
            width: '85px !important',
            // padding: '1px',
        },
    },
    btnRec: {
        backgroundColor: '#1572e8',
        color: 'white',
        height: '30px !important',
        marginTop: '2px',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        },
        '@media only screen and (maxWidth: 600px)': {
            fontSize: '10px',
            padding: '1px',
            width: '65px',
        },
        '@media only screen and (maxWidth: 983px)': {
            fontSize: '10px',
            padding: '1px',
            width: '75px',
        },
        '@media only screen and (maxWidth: 1102px)': {
            fontSize: '10px',
            width: '85px !important',
            // padding: '1px',
        },
        // margin:'5px',
    },
    imgBox: {
        backgroundColor: 'white',
        width: '150px',
        height: '125px',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5px',
    },
    btnSus: {
        backgroundColor: '#f5365c',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '30px !important',
        marginTop: '2px',
        padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        }
    },
    btnMulti: {
        backgroundColor: '#001f3f',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        height: '30px !important',
        marginTop: '2px',
        padding: '10px !important',
        fontWeight: '600 !important',
        borderRadius: '7px !important',
        float: 'right !important',
        border: '0px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9f3ed7 !important',
        }
    },
    posNavbarInput: {
        '& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
            height: '17px'
        }
    },
    posDateTime: {
        '& .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root': {
            height: '34px !important',
            paddingRight: '5px !important'
        }
    },
    posbutons: {
        backgroundColor: '#7009AB !important',
        color: 'white',
        textTransform: 'uppercase',
        marginRight: '5px !important',
        width: '10em',
        padding: '0.5em 0.5em',
        height: '40px !important',
        fontWeight: '400 !important',
        fontSize: '13px',
        borderRadius: '8px !important',
        float: 'right !important',
        border: '0px !important',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9F3ED7 !important',
        }
    },
    card: {
        background: '#fff',
        width: '24em',
        borderRadius: '0.6em',
        margin: '1e,',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all ease 200ms',
        '&:hover': {
            transform: 'scale(1.03)',
        }
    },
    discountselect: {
        '& .css-1ualgfl-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root': {
            height: '34px !important',
            marginTop: '5px'
        },
        '& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
            marginTop: '5px'
        }
    },
    // discountselectlabel: {
    //     '& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
    //         marginTop: '5px'
    //     }
    // },
    footer: {
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        color: 'white',
        textAlign: 'center',
    },
    btnGrid: {
        position: 'fixed',
        bottom: '0px',
        width: '100%',
        background: '#f0f2ff',
        padding: '5px',
        // height:'40px !important',
        height: 'max-content',
    },
    btnDeactive: {
        backgroundColor: '#FFAD46',
        color: 'white',
        width: '150px',
        height: '30px !important',
        fontSize: '10px',
        padding: '5px'
    },
    printcls: {
        display: 'none',
        '@media print': {
            display: 'block',
        },
    },
    printalign: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // alparate print align
    stylepdf: {
        display: 'none'
    },

    // category dd
    categoryadd: {
        height: '30px',
        minWidth: '30px',
        padding: '6px 10px',
        marginTop: '28px',
        '@media only screen and (maxWidth: 600px)': {
            marginTop: '6px',
        },
    },
    ressetbtn: {
        padding: "0.5rem 1.25rem",
        width: "20em",
        color: "white !important",
        background: "#ef4444 !important ",
        borderRadius: "40px 40px 40px 40px",
        '@media only screen and (maxWidth: 600px)': {
            marginTop: '6px',
        }
    },
    paynowbtn: {
        padding: "0.5rem 1rem",
        // width:"10em",
        // marginLeft:"24px",
        background: "white !important",
        fontSize: '11px',
        fontWeight: '900 !important',
        cursor: 'pointer',
        color: "#8b5cf6!important ",
        borderRadius: "40px 40px 40px 40px",
        border: " 1px solid #8b5cf6!important ",
        '&:hover': {
            backgroundColor: '#f0f2ff !important',
            color: 'black !important'
        },
        '@media only screen and (maxWidth: 600px)': {
            marginTop: '6px',
        }
    },

    // supplier 
    input: {
        '& input[type=number]': {
            'MozAppearance': 'textfield' //#8b5cf6
        },
        '& input[type=number]::-webkit-outer-spin-button': {
            'WebkitAppearance': 'none',
            margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
            'WebkitAppearance': 'none',
            margin: 0
        }
    },
    uploadFileBtn: {
        color: 'white',
        border: '1px solid #4A7BF7 !important',
        borderRadius: '7px !important',
        backgroundColor: '#4A7BF7 ',
        width: 'maxcontent',
	textAlign:'center',
        fontSize: '13px !important',
        fontWeight: '600 !important',
        //padding: "5px !important",
        '&:hover': {
            backgroundColor: 'white ',
            color: '#7009AB ',
        },
    },
    //datatable
    btnPagination: {
        color: "rgb(97, 97, 97)"
    },
    dataTablestyle: {
        display: "flex",
        justifyContent: 'space-between',
        '@media (maxWidth: 800px)': {
            display: "block",
            textAlign: 'center'
        },
        color: 'rgb(0 0 0 / 60%)',
    },
    tableheadstyle: {
        display: 'flex',
        gap: '10px',
        height: 'max-content',
        width: 'max-content',
    },
    paginationbtn: {
        color: "inherit",
        textTransform: "capitalize",
        '&:hover': {
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
            background: 'linear-gradient(to bottom, #333 0%, rgb(0 0 0 / 66%) 100%)',
            color: "white",
        },
        '&.active': {
            backgroundColor: '#F4F4F4',
            color: '#444',
            boxShadow: 'none',
            borderRadius: '3px',
            border: '1px solid #0000006b',
        }
    },

}

// SELECT DROPDOWN STYLES
export const colourStyles = {
    placeholder: (defaultStyles) => {
        return {
            ...defaultStyles,
            color: 'black',
            // fontWeight:900
        }
    },
    menuList: styles => ({
        ...styles,
        background: 'white'
    }),
    option: (styles, { isFocused, isSelected }) => ({
        ...styles,

        // color:'black',
        color: isFocused
            ? 'rgb(255 255 255, 0.5)'
            : isSelected
                ? 'white'
                : 'black',
        background: isFocused
            ? 'rgb(25 118 210, 0.7)'
            : isSelected
                ? 'rgb(25 118 210, 0.5)'
                : null,
        zIndex: 1
    }),
    menu: base => ({
        ...base,
        zIndex: 100
    }),
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? "1px solid #4a7bf7" : "1px solid #4a7bf7",
        boxShadow: state.isFocused ? "1px solid rgb(185,125,240)" : "1px solid rgb(185,125,240)",
        "&:hover": {
            border: state.isFocused ? "1px solid #4a7bf7" : "1px solid #4a7bf7"
        }
    })
}
