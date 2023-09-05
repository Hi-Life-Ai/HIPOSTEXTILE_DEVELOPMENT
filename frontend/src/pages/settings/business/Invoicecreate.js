import React, { useState } from 'react';
import { Box, Grid, Dialog, DialogContent, DialogActions, Typography, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { userStyle } from '../../PageStyle';

export default function Invoicecreate({ isSetngs, setIsSetngs }) {

    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()

    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const handleValidationCin = (e) => {
        if (e.length > 9) {
            setShowAlert("Please enter only 9 Characters!")
            handleClickOpen();
            let num = e.slice(0, 9);
            setIsSetngs((prevState) => {
                return { ...prevState, ciono: num };
            })
        }

    }

    const handleValidationGst = (e) => {
        if (e.length > 15) {
            setShowAlert("Please enter only 15 Characters!")
            handleClickOpen();
            let num = e.slice(0, 15);
            setIsSetngs((prevState) => {
                return { ...prevState, gstno: num };
            })
        }
    }

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={10} lg={8}>
                    <InputLabel htmlFor="component-outlined">CIN No</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            value={isSetngs.ciono}
                            sx={userStyle.input}
                            onChange={(e) => {
                                setIsSetngs((prevState) => {
                                    return { ...prevState, ciono: e.target.value };
                                }); handleValidationCin(e.target.value)
                            }}
                            type="number"
                            name="ciono"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={10} lg={8}>
                    <InputLabel htmlFor="component-outlined">GST No</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            value={isSetngs.gstno}
                            onChange={(e) => {
                                setIsSetngs((prevState) => {
                                    return { ...prevState, gstno: e.target.value };
                                }); handleValidationGst(e.target.value)
                            }}
                            type="text"
                            name="gstno"
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