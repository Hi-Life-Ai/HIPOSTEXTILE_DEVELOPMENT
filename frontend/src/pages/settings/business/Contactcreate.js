import React, { useState, useContext } from 'react';
import { Box,Dialog,DialogContent,DialogActions,Typography,Button, Grid, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { userStyle } from '../../PageStyle';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export default function Contactcreate({isSetngs, setIsSetngs}) {

    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()

    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const handleValidationCreditLimit = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,credeitlimit:value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,credeitlimit:value};
            })        
        }
    }
    
    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <InputLabel htmlFor="component-outlined">Default Credit Limit</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="number"
                            name="dcreditimit"
                            sx={userStyle.input}
                            value={isSetngs.credeitlimit}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,credeitlimit:e.target.value};
                            }); handleValidationCreditLimit(e)}}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            {/* ALERT DIALOG */}
            <Dialog
                open={isErrorOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}