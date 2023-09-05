import React, { useState, useEffect, useContext } from 'react';
import { Button, Fab, Typography, Grid, Dialog, DialogContent, DialogActions, InputLabel, FormControl, Box, OutlinedInput, TextareaAutosize } from '@mui/material';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import AddLinkIcon from '@mui/icons-material/AddLink';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import KeyIcon from '@mui/icons-material/Key';
import { userStyle } from '../../PageStyle';
import Password from '@mui/icons-material/Password';
import Dns from '@mui/icons-material/Dns';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../../context/Appcontext';
import { Link, useNavigate } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Passwordcreatelist() {

    const { auth, setngs } = useContext(AuthContext);

    const [password, setPassword] = useState({
        passwordcode: "", name: "", username: "", password: "", totpkey: "", curtotpkey: "", notes: "", url: "", logo: "",
    });
    const backPage = useNavigate();
    const [file, setFile] = useState();
    const [passwords, setPasswords] = useState();
    const [ispassword, setIspassword] = useState(false)
    const [passwordName, setPasswordName] = useState([]);
    const [passwordCode, setPasswordCode] = useState([]);
    const [passwordUsername, setPasswordUsername] = useState([]);

    // Alert Pop up
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // Image Upload
    function handleChange(e) {
        let profileimage = document.getElementById("logo")
        var path = (window.URL || window.webkitURL).createObjectURL(profileimage.files[0]);
        toDataURL(path, function (dataUrl) {
            profileimage.setAttribute('value', String(dataUrl));
            setPassword({ ...password, logo: String(dataUrl) })
            return dataUrl;
        })
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    var regex = /[`+!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;

    const handleValidationName = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        if (e.target.value.match(numbers)) {
            setShowAlert("Please Enter Letter only! (a-z)")
            handleOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setPassword({ ...password, name: value })
        }
        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setPassword({ ...password, name: value })
        }
    }
    const handleValidationUName = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        if (e.target.value.match(numbers)) {
            setShowAlert("Please Enter Letter only! (a-z)")
            handleOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setPassword({ ...password, name: value })
        }
        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setPassword({ ...password, name: value })
        }
    }

    let autoid = setngs ? setngs.passwordsku == undefined ? "SK0000" : setngs.passwordsku + "0001" : "SK0000";
   

    // Password
    const fetchAllPassword = async () => {
        try {
            let res = await axios.post(SERVICE.PASSWORD, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
              });
            let resultcode = res.data.passwords.map((data, index)=>{
                   return data.passwordcode
            })
            let resultusername =res.data.passwords.map((data, index)=>{
                return data.username
            })
            let resultname = res.data.passwords.map((data, index)=>{
                return data.name
            })
            setPasswordCode(resultcode);
            setPasswordUsername(resultusername);
            setPasswordName(resultname);
            setPasswords(res?.data?.passwords);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                if(messages == "request entity too large"){
                    toast.error("Image Size Can't more than 3MB!")
                }else{
                    toast.error(messages);
                }
            }else{
                toast.error("Something went wrong!")
            }
        }
    }
    useEffect(
        () => {
            fetchAllPassword();
        }, []
    )

    // Password add to database
    const sendPassword = async () => {

        try {

            let req = await axios.post(`${SERVICE.PASSWORD_CREATE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                passwordcode: String(autoid),
                name: String(password.name),
                username: String(password.username),
                password: String(password.password),
                totpkey: String(password.totpkey),
                curtotpkey: String(password.curtotpkey),
                notes: String(password.notes),
                url: String(password.url),
                logo: String(password.logo),
                assignbusinessid: String(setngs.businessid),
            });
            setPassword(req.data);
            backPage('/passwords/password/list');
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    // Password addanother to database
    const sendAnotherPassword = async () => {
        try {

            let req = await axios.post(`${SERVICE.PASSWORD_CREATE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                passwordcode: String(autoid),
                name: String(password.name),
                username: String(password.username),
                password: String(password.password),
                totpkey: String(password.totpkey),
                curtotpkey: String(password.curtotpkey),
                notes: String(password.notes),
                url: String(password.url),
                logo: String(password.logo),
                assignbusinessid:String(setngs.businessid),
            });
            await fetchAllPassword()
            setPassword(req.data);
            setFile("");
            setPassword({
                passwordcode: "", name: "", username: "", password: "", totpkey: "", curtotpkey: "", notes: "", url: "", logo: "",
            });
            setFile(null);
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.name == "") {
            setShowAlert("Please enter name!");
            handleOpen();
        } else if (password.username == "") {
            setShowAlert("Please enter user name!");
            handleOpen();
        } else if (password.password == "") {
            setShowAlert("Please enter password!");
            handleOpen();
        }else if(passwordName.includes(password.name)){
            setShowAlert("Name Already Exists");
            handleOpen();
        }
        else if(passwordCode.includes(password.passwordcode)){
            setShowAlert("Code Already Exists");
            handleOpen();
        }
        else if(passwordUsername.includes(password.username)){
            setShowAlert("Username Already Exists");
            handleOpen();
        }
        else {
            sendPassword();
        }
    }
    const handleAddother = (e) => {
        e.preventDefault();
        if (password.name == "") {
            setShowAlert("Please enter name!");
            handleOpen();
        } else if (password.username == "") {
            setShowAlert("Please enter user name!");
            handleOpen();
        } else if (password.password == "") {
            setShowAlert("Please enter password!");
            handleOpen();
        }else if(passwordName.includes(password.name)){
            setShowAlert("Name Already Exists");
            handleOpen();
        }
        else if(passwordCode.includes(password.passwordcode)){
            setShowAlert("Code Already Exists");
            handleOpen();
        }
        else if(passwordUsername.includes(password.username)){
            setShowAlert("Username Already Exists");
            handleOpen();
        } else {
            sendAnotherPassword();
        }
    }

    return (
        <Box>
            <Headtitle title={'Passwords Create'} />
            <Typography sx={userStyle.HeaderText}>Add New Password</Typography>
            <Box sx={userStyle.container}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ justifyContent: 'center' }}>Password Details</Typography>
                        </Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Fields</Typography>
                        </Grid>
                        <Grid item md={8} sm={6} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>1.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Password Code</Typography>
                        </Grid>
                        {passwords && (
                            passwords.map(
                                () => {
                                    let strings = setngs ? setngs.passwordsku : 'PW';
                                    let refNo = passwords[passwords.length - 1].passwordcode;
                                    let digits = (passwords.length + 1).toString();
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
                                        autoid = strings + refNOINC;
                                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                        refNOINC = ("00" + refLstTwo).substr(-4);
                                        autoid = strings + refNOINC;
                                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                                        refNOINC = ("0" + refLstThree).substr(-4);
                                        autoid = strings + refNOINC;
                                    } else {
                                        refNOINC = (refLstDigit).substr(-4);
                                        autoid = strings + refNOINC;
                                    }
                                }))}
                        <Grid item md={6} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Auto Generate</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><ContactPageOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        name="autogenerate"
                                        value={autoid}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>2.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ display: "flex" }}>Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><Dns /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="name"
                                        value={password.name}
                                        onChange={(e) => { setPassword({ ...password, name: e.target.value }); handleValidationName(e) }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>3.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ display: "flex" }}>User Name<b style={{ color: "red", marginLeft: "2px" }}>*</b></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><AssignmentIndIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="username"
                                        value={password.username}
                                        onChange={(e) => { setPassword({ ...password, username: e.target.value }); handleValidationUName(e) }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>4.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1' sx={{ display: "flex" }}>Password<b style={{ color: "red", marginLeft: "2px" }}>*</b></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><Password /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type={ispassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    edge="end"
                                                    onClick={() => { setIspassword(!ispassword); }}
                                                >
                                                    {ispassword ? (<VisibilityOffIcon  />) :  (<VisibilityIcon  />)}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        name="password"
                                        value={password.password}
                                        onChange={(e) => { setPassword({ ...password, password: e.target.value }) }}
                                        inputProps={{
                                            autoComplete: 'new-password',
                                            form: {
                                              autoComplete: 'off',
                                            },
                                          }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>5.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>TOTP Key</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><KeyIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="totpkey"
                                        value={password.totpkey}
                                        onChange={(e) => { setPassword({ ...password, totpkey: e.target.value }) }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>6.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Current TOTP Key</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><KeyIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="currenttotpkey"
                                        value={password.curtotpkey}
                                        onChange={(e) => { setPassword({ ...password, curtotpkey: e.target.value }) }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>7.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Notes</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={password.notes}
                                    onChange={(e) => { setPassword({ ...password, notes: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>8.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Url</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><AddLinkIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        name="url"
                                        value={password.url}
                                        onChange={(e) => { setPassword({ ...password, url: e.target.value }) }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='subtitle1' sx={{ marginLeft: '50px' }}>9.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='subtitle1'>Logo</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12} sx={{ marginTop: '0px' }}>
                            <FormControl size="small" fullWidth>
                                <p id='attachdocdetail'></p>
                                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>{file ? <img src={file} style={{ width: '50%' }} height="80px" /> : ""}</Grid><br />
                                <Grid sx={{ display: 'flex', justifyContent: "center" }}>
                                    <Button component="label" sx={userStyle.buttonadd} size={"small"}>
                                        Upload
                                        <input type='file' id="logo" accept="image/*" name='file' hidden onChange={handleChange} />
                                    </Button>
                                    <Button component="label" sx={userStyle.buttoncancel} size={"small"} onClick={(e) => setFile(null)}>
                                        Reset
                                    </Button>
                                </Grid> <br />
                                <Typography variant='body2'>Max File size: 5MB <br />Allowed File: .jpeg, .jpg, .png</Typography>
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/passwords/password/list"><Button sx={userStyle.buttoncancel} >CANCEL</Button></Link>
                                <Button sx={userStyle.buttonadd} onClick={handleAddother} >Save and Add Another</Button>
                                <Button sx={userStyle.buttonadd} type="submit" >SAVE</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
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
                        <Button variant="contained" color="error" onClick={handleClose} >ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

function Passwordcreate() {
    return (
       <>
         <Passwordcreatelist /><br /><br /><br />
        <Footer /><br /><br />
       </>
    );
}
export default Passwordcreate;