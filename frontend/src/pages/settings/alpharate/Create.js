import React, { useState, useEffect, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Dialog, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Alphacreatelist() {

    const [alphas, setAlphas] = useState();

    const { auth,setngs } = useContext(AuthContext);

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => {
        setIsErrorOpen(true);
    };
    const handleClose = () => {
        setIsErrorOpen(false);
    };

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

    // auto id 
    let newval = "AP0001";

    // Alpha 
    const fetchHandler = async () => {
        try {
            let res = await axios.post(SERVICE.ALPHARATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
            });
            setAlphas(res?.data?.alpharates);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const [alpha, setAlpha] = useState({
        1: "", alphatwo: "", alphathree: "", alphafour: "", alphafive: "", alphasix: "", alphaseven: "", alphaeight: "", alphanine: "",
        alphazero: "", one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, zero: 0, alphaid: newval, activate: false,singledigit: "", doubledigit: ""
    });

    //alpharate

    const handleClear = () => {
        setAlpha({
            1: "",alphaone:"", alphatwo: "", alphathree: "", alphafour: "", alphafive: "", alphasix: "", alphaseven: "", alphaeight: "", alphanine: "",
            alphazero: "", alphaid: newval, activate: "", singledigit: "", doubledigit: ""
        })
    }

    const backPage = useNavigate();

    const handleAlphaZero = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphazero: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphazero: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphazero: num.toUpperCase() })
        }

    }
    const handleAlphaOne = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphaone: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphaone: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphaone: num.toUpperCase() })
        }
    }
    const handleAlphaTwo = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphatwo: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphatwo: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphatwo: num.toUpperCase()})
        }
    }
    const handleAlphaThree = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphathree: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphathree: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphathree: num.toUpperCase() })
        }
    }
    const handleAlphaFour = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphafour: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphafour: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphafour: num.toUpperCase() })
        }
    }
    const handleAlphaFive = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphafive: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphafive: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphafive: num.toUpperCase() })
        }
    }
    const handleAlphaSix = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphasix: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphasix: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphasix: num.toUpperCase() })
        }
    }
    const handleAlphaSeven = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphaseven: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphaseven: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphaseven: num.toUpperCase() })
        }
    }
    const handleAlphaEight = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphaeight: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphaeight: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphaeight: num.toUpperCase() })
        }
    }
    const handleAlphaNine = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphanine: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, alphanine: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, alphanine: num.toUpperCase() })
        }
    }

    const handleDoubledigit = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 2)
            setAlpha({ ...alpha, doubledigit: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 2)
            setAlpha({ ...alpha, doubledigit: value.toUpperCase(),})
        }
        else if(e.length > 2){
            setShowAlert("Alpha Single can't have more than 2 character!")
            handleClickOpen();
            let num = e.slice(0, 2);
            setAlpha({ ...alpha, doubledigit: num.toUpperCase() })
        }
    }

    const handleSingledigit = (e) => {
        let val = e;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (e.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, singledigit: value.toUpperCase(),})
        }
        else if (regExSpecialChar.test(e)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setAlpha({ ...alpha, singledigit: value.toUpperCase(),})
        }
        else if(e.length > 1){
            setShowAlert("Alpha Double can't have more than 1 character!")
            handleClickOpen();
            let num = e.slice(0, 1);
            setAlpha({ ...alpha, singledigit: num.toUpperCase() })
        }
    }

    const addAlpharate = async () => {
        try {
            let res = await axios.post(SERVICE.ALPHARATE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid:String(setngs.businessid),
                1: String(alpha.alphaone),
                2: String(alpha.alphatwo),
                3: String(alpha.alphathree),
                4: String(alpha.alphafour),
                5: String(alpha.alphafive),
                6: String(alpha.alphasix),
                7: String(alpha.alphaseven),
                8: String(alpha.alphaeight),
                9: String(alpha.alphanine),
                0: String(alpha.alphazero),
                one: Number(alpha.one),
                two: Number(alpha.two),
                three: Number(alpha.three),
                four: Number(alpha.four),
                five: Number(alpha.five),
                six: Number(alpha.six),
                seven: Number(alpha.seven),
                eight: Number(alpha.eight),
                nine: Number(alpha.nine),
                zero: Number(alpha.zero),
                activate: Boolean(false),
                alphaid: String(newval),
                singledigit: String(alpha.singledigit.toUpperCase()),
                doubledigit: String(alpha.doubledigit.toUpperCase())
            });
            setAlpha(res.data)
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/settings/alpharate/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                setShowAlert(messages);
                handleClickOpen();
            }else{
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(alpha.alphazero == ""){
            setShowAlert("Please enter Alpha Zero!");
            handleClickOpen();
        }
        else if(alpha.alphaone == ""){
            setShowAlert("Please enter Alpha One!");
            handleClickOpen();
        }
        else if(alpha.alphatwo == ""){
            setShowAlert("Please enter Alpha Two!");
            handleClickOpen();
        }
        else if(alpha.alphathree == ""){
            setShowAlert("Please enter Alpha Three!");
            handleClickOpen();
        }
        else if(alpha.alphafour == ""){
            setShowAlert("Please enter Alpha Four!");
            handleClickOpen();
        }
        else if(alpha.alphafive == ""){
            setShowAlert("Please enter Alpha Five!");
            handleClickOpen();
        }
        else if(alpha.alphasix == ""){
            setShowAlert("Please enter Alpha Six!");
            handleClickOpen();
        }
        else if(alpha.alphaseven == ""){
            setShowAlert("Please enter Alpha Seven!");
            handleClickOpen();
        }
        else if(alpha.alphaeight == ""){
            setShowAlert("Please enter Alpha Eight!");
            handleClickOpen();
        }
        else if(alpha.alphanine == ""){
            setShowAlert("Please enter Alpha Nine!");
            handleClickOpen();
        } else if (alpha.doubledigit.length == 0 || alpha.doubledigit.length >= 3) {
            setShowAlert("Double digit character should be 2")
            handleClickOpen();
        }
        else if (alpha.singledigit.length == 0 || alpha.singledigit.length >= 2) {
            setShowAlert("Single digit character should be 1")
            handleClickOpen();
        }
        else{
            addAlpharate();
        }
    }

    useEffect(() => {
        fetchHandler();
    }, [])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    return (
        <Box>
            <Headtitle title={'Alpharate Create'} />
            <form onSubmit={handleSubmit}>
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>Add Alpharate</Typography>
                    </Grid>
                </Box>
                <Box sx={userStyle.container}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        {alphas && (
                            alphas.map(
                                () => {
                                    let strings = 'AP';
                                    let refNo = alphas[alphas.length - 1].alphaid;
                                    let digits = (alphas.length + 1).toString();
                                        const stringLength = refNo.length;
                                        let lastChar = refNo.charAt(stringLength - 1);
                                        let getlastBeforeChar = refNo.charAt(stringLength - 2);
                                        let getlastThreeChar = refNo.charAt(stringLength - 3);
                                        let lastBeforeChar = refNo.slice(-2);
                                        let lastThreeChar = refNo.slice(-3);
                                        let lastDigit = refNo.slice(-4);
                                        let refNOINC = parseInt(lastChar) + 1
                                        let refLstTwo = parseInt(lastBeforeChar) + 1;
                                        let refLstThree = parseInt(lastThreeChar) + 1;
                                        let refLstDigit = parseInt(lastDigit) + 1;
                                        if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                                            refNOINC = ("000" + refNOINC).substr(-4);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                            refNOINC = ("00" + refLstTwo).substr(-4);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastThreeChar > 0) {
                                            refNOINC = ("0" + refLstThree).substr(-4);
                                            newval = strings + refNOINC;
                                        } else {
                                            refNOINC = (refLstDigit).substr(-4);
                                            newval = strings + refNOINC;
                                        }
                                }))}
                        <input
                            id="outlined-adornment-password"
                            value={newval}
                            hidden
                            onClick={(e) => setAlpha({ ...alpha, alphaid: newval })}
                            name="alphaid"
                        />
                    </FormControl>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphazero}
                                    onChange={(e) => { setAlpha({ ...alpha, alphazero: e.target.value.toUpperCase() }); handleAlphaZero(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.zero}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={6}>
                            <Grid container spacing={2} sx={userStyle.formBorder}>
                                <Grid item md={4} sm={6} xs={12}>
                                    <InputLabel>Alpha Double Digit <b style={{ color: "red" }}>*</b></InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            value={alpha.doubledigit} 
                                            onChange={(e) => { setAlpha({ ...alpha, doubledigit: e.target.value.toUpperCase() }); handleDoubledigit(e.target.value); }}
                                            type="text"
                                            sx={userStyle.input}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <InputLabel>Alpha Single Digit <b style={{ color: "red" }}>*</b></InputLabel>                                    
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            type="text"
                                            value={alpha.singledigit} 
                                            sx={userStyle.input}
                                            onChange={(e) => { setAlpha({ ...alpha, singledigit: e.target.value.toUpperCase() }); handleSingledigit(e.target.value);}}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphaone}
                                    onChange={(e) => { setAlpha({ ...alpha, alphaone: e.target.value }); handleAlphaOne(e.target.value)  }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.one}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphatwo}
                                    onChange={(e) => { setAlpha({ ...alpha, alphatwo: e.target.value.toUpperCase() }); handleAlphaTwo(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.two}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphathree}
                                    onChange={(e) => { setAlpha({ ...alpha, alphathree: e.target.value.toUpperCase() }); handleAlphaThree(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.three}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphafour}
                                    onChange={(e) => { setAlpha({ ...alpha, alphafour: e.target.value.toUpperCase() }); handleAlphaFour(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.four}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphafive}
                                    onChange={(e) => { setAlpha({ ...alpha, alphafive: e.target.value.toUpperCase() }); handleAlphaFive(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.five}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphasix}
                                    onChange={(e) => { setAlpha({ ...alpha, alphasix: e.target.value.toUpperCase() }); handleAlphaSix(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.six}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphaseven}
                                    onChange={(e) => { setAlpha({ ...alpha, alphaseven: e.target.value.toUpperCase() }); handleAlphaSeven(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.seven}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphaeight}
                                    onChange={(e) => { setAlpha({ ...alpha, alphaeight: e.target.value.toUpperCase() }); handleAlphaEight(e.target.value) }}
                                    type="text"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.eight}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={userStyle.formBorder}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha <b style={{color:"red"}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={alpha.alphanine}
                                    onChange={(e) => { setAlpha({ ...alpha, alphanine: e.target.value.toUpperCase() }); handleAlphaNine(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={alpha.nine}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                        <Grid >
                        <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                                <Link to="/settings/alpharate/list"><Button sx={userStyle.buttoncancel} type="button">CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type="submit">SAVE</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            {/* ALERT DIALOG */}
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
    );
}

function Alphacreate() {
    return (
       <>
          <Alphacreatelist /><br /><br /><br />
                    <Footer />
       </>
    );
}

export default Alphacreate;