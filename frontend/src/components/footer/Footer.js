import React from 'react';
import { Grid, Container, Box, Typography} from '@mui/material';
import {FaHeart} from 'react-icons/fa';
import { footerStyle }from './FooterStyle';


function Footer() {
    return(
    <Box>
      <Container sx={footerStyle.container}>
        <Grid>
            <Typography variant="subtitle2" sx={{ '@media (maxWidth: 507px)':{fontSize: '10px',}}}>© 2022, HILIFE.AI Pvt. Ltd. All Rights Reserved.</Typography>
        </Grid>
        <Grid style={{'@media (maxWidth: 507px)':{fontSize: '10px !important',}}}>
           <Typography sx={footerStyle.hearts} style={{'@media (maxWidth: 507px)':{fontSize: '10px !important',}}}>Made with &ensp;<FaHeart style={{color:'rgb(193, 32, 32)','@media (maxWidth: 507px)':{fontSize: '10px !important',}}} /> &ensp; in TRICHY  &ensp;
         | &ensp; திருச்சியில் உருவாக்கப்பட்டது &ensp;<FaHeart style={{color:'rgb(193, 32, 32)','@media (maxWidth: 507px)':{fontSize: '10px !important',}}}/> </Typography>  
          </Grid>         
        </Container>
    </Box>
    );
  }
  
export default Footer;