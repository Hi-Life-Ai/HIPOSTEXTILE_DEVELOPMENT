import React, { useState, useEffect, createRef, useRef, useContext } from 'react';
import { Box, Table, TableBody, TableContainer, TableHead, Paper, Typography } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import {useParams} from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

export default function Print() {

    const [alpha, setAlpha] = useState({});
    const { auth } = useContext(AuthContext);
    
    const id = useParams().id;

    // fetch alpharate data
    const fetchAlpha = async () =>{
        try{
            let res = await axios.get(`${SERVICE.ALPHARATE_SINGLE}/${id}`,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setAlpha(res?.data?.salpharate);
            setTimeout( () => {
                handleprint();
                 }, 3000)
        }catch(err){
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }


    // Printing
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Alpahrate',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    useEffect(() => {
        fetchAlpha()
    }, []);

    return (
        <Box>
            <Headtitle title={'Alpharate Print'} />
            <Box>
                <Typography variant='h5'>Alpharate</Typography>
            </Box><br />
            <Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table"  ref={componentRef} >
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Alpha Rate</StyledTableCell>
                                <StyledTableCell>Alpha No:</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                            <TableBody>
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
        </Box>
    );
}
