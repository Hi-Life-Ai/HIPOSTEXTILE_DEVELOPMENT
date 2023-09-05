import React, { useState, useEffect, useContext, useRef } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TableContainer,Paper,Table,Select,TableHead,TableBody, MenuItem, Typography, Button} from '@mui/material';
import { StyledTableRow, StyledTableCell} from '../../../components/Table';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext , UserRoleAccessContext} from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print";

function Alphaeditlist() {

    const [isAlpha, setIsAlpha] = useState({});
    const [alpha, setAlpha] = useState({});
    const { auth } = useContext(AuthContext);

    const id = useParams().id;

    const backPage = useNavigate();

    // User Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };


    // fetch alpharate data
    const fetchAlpha = async () =>{
        try{
            let res = await axios.get(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setIsAlpha(res?.data?.salpharate)
        }catch(err){
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
        backPage('/settings/alpharate/list');
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | ALPHARATE',
        pageStyle: 'print'
    });

    // PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#alpharate' })
        doc.save('Alpharate.pdf')
      }

    // fetch alpharate data
    const fetchAlphapdf = async () =>{
        try{
            let res = await axios.get(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setAlpha(res?.data?.salpharate)
        }catch(err){
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(
        () =>{
            fetchAlpha();
            fetchAlphapdf();
        },[]
    )

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
            <Headtitle title={'Alpharate View'} />
            <form onSubmit={handleSubmit}>
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>View Alpha Rate</Typography>
                    </Grid>
                </Box>
                <Box sx={userStyle.container}>
                <Grid container spacing={2}  sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha.alphaid}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel>Alpha Single Digit <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    value={isAlpha.doubledigit}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel>Alpha Double Digit <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    value={isAlpha.singledigit}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel >Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                fullWidth
                                value={isAlpha.activate == true ? 'true' : 'false'}
                                onClick={(e) => setIsAlpha({ ...isAlpha, status: e.target.value })}
                            >
                                <MenuItem value={'true'}>Activate</MenuItem>
                                <MenuItem value={'false'}>Deactivate</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                <Grid container spacing={2}  sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[0]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    placeholder="0"
                                    value={isAlpha.zero}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{  '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type="text"
                                    value={isAlpha[1]}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isAlpha.one}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}    sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[2]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isAlpha.two}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[3]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isAlpha.three}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[4]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isAlpha.four}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}  sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[5]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isAlpha.five}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[6]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isAlpha.six}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[7]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isAlpha.seven}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}  sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[8]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    placeholder="8"
                                    value={isAlpha.eight}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}  sx={{   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7',  }, }}>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel  >Alpha</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    placeholder=""
                                    value={isAlpha[9]}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    placeholder="9"
                                    value={isAlpha.nine}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                        <Grid sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                            <Button sx={userStyle.buttoncancel} type="submit">Back</Button>
                            {isUserRoleCompare[0]?.valpharate && (
                                <>
                                    <Button sx={userStyle.buttonadd} onClick={handleprint}><PrintIcon /></Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.valpharate && (
                                <>
                                    <Button sx={userStyle.buttonadd} onClick={() => downloadPdf()}><PictureAsPdfIcon /></Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </form>
            <TableContainer component={Paper} sx={userStyle.stylepdf}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table" id="alpharate">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Alpha Rate</StyledTableCell>
                                <StyledTableCell>Alpha No</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                            <TableBody>
                            <StyledTableRow>
                                  <StyledTableCell align="left">Alpha Double Digit</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.doubledigit}</StyledTableCell>
                            </StyledTableRow>  
                            <StyledTableRow>
                                  <StyledTableCell align="left">Alpha Single Digit</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.singledigit}</StyledTableCell>
                            </StyledTableRow>  
                              <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[0]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.zero}</StyledTableCell>
                            </StyledTableRow>  
                              <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[1]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.one}</StyledTableCell>
                                
                            </StyledTableRow> 
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[2]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.two}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[3]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.three}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[4]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.four}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[5]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.five}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[6]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.six}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[7]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.seven}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[8]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.eight}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                  <StyledTableCell align="left">{alpha[9]}</StyledTableCell>
                                  <StyledTableCell align="left">{alpha.nine}</StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                    </Table>
                </TableContainer>
                {/* ***** Print ***** */}
                <Box sx={userStyle.printcls}>
                <Box>
                    <Typography variant='h5' >Alpharate</Typography>
                </Box>
                <>
                    <Box  >
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table sx={{ minWidth: 700, }} aria-label="customized table" id="alpharate"  ref={componentRef}>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Alpha Rate</StyledTableCell>
                                        <StyledTableCell>Alpha No</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                    <TableBody>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">Alpha Single Digit</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.singledigit}</StyledTableCell>
                                    </StyledTableRow>  
                                    <StyledTableRow>
                                        <StyledTableCell align="left">Alpha Double Digit</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.doubledigit}</StyledTableCell>
                                    </StyledTableRow>  
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[0]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.zero}</StyledTableCell>
                                    </StyledTableRow>  
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[1]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.one}</StyledTableCell>
                                    </StyledTableRow> 
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[2]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.two}</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[3]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.three}</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[4]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.four}</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[5]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.five}</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[6]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.six}</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[7]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.seven}</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[8]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.eight}</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">{alpha[9]}</StyledTableCell>
                                        <StyledTableCell align="left">{alpha.nine}</StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            </Box>
        </Box>
    );
}

function Alphaedit() {
    return (
       <>
         <Alphaeditlist /><br /><br /><br />
                    <Footer />
       </>
    );
}

export default Alphaedit;