import React from 'react';
import { Button,Typography } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import slide1 from '../assets/images/slide1.png';
import slide2 from '../assets/images/slide2.png';
import slide3 from '../assets/images/slide3.png';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Signin.css";
import { loginSignIn } from './Loginstyle';
function CarouselComponent() {
    return (
        <div className="carousel-wrapper">
            <Carousel infiniteLoop autoPlay stopOnHover interval={2000}>
                <div>
                    <img src={slide3} alt="slide3" className='carouselimg'/>
                        <div className="carousel-content">
                            <Typography variant='h5'>MFA for all accounts</Typography>
                            <Typography sx={loginSignIn.carouseltxt}>Secure online accounts with OneAuth 2FA. Back up OTP secrets and never lose access to your accounts.</Typography><br />
                            <Button sx={loginSignIn.carouselbtn}>show more</Button>
                        </div>
                </div>
                <div>
                    <img src={slide1} alt="slide1" className='carouselimg'/>
                        <div className="carousel-content">
                                <Typography variant='h5'>Easy recovery modes</Typography>
                                <Typography sx={loginSignIn.carouseltxt}>Lost access to OneAuth? Worry not. Set up passphrase and backup number to recover OneAuth easily.</Typography><br />
                                <Button sx={loginSignIn.carouselbtn}>show more</Button>
                        </div>
                </div>
                <div>
                    <img src={slide2} alt="slide2" className='carouselimg'/>
                        <div className="carousel-content">
                                <Typography variant='h5' >Passwordless sign-in</Typography>
                                <Typography sx={loginSignIn.carouseltxt}>Move away from risky passwords and experience one-tap access to Hilife.AI. Download and Install OneAuth.</Typography><br />
                                <Button sx={loginSignIn.carouselbtn}>show more</Button>
                        </div>
                </div>
            </Carousel>
        </div>
    );
}
export default CarouselComponent;