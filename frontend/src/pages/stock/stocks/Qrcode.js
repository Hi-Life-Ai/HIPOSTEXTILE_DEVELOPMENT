import React, {useState,useEffect} from 'react';
import {Grid, Box,Typography, getScopedCssBaselineUtilityClass} from '@mui/material';
import QRCode from 'qrcode';
import { Scale } from '@mui/icons-material';

function Qrcodegenerate({getProductData, productLabel, id}) { 

  const [imageUrl, setImageUrl] = useState('');

  useEffect(()=> {
    generateQrCode();
  },[])

  const generateQrCode = async () => {
    try {
          const response = await QRCode.toDataURL(`${getProductData.stockid}`);
          setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }

  let bnname = getProductData.businessname.slice(0, 15);
  let catspace = getProductData.category.replace(/[^a-zA-Z0-9]/g, '');
  let subcatspace = getProductData.subcategory.replace(/[^a-zA-Z0-9]/g, '');
  let catslice12 = catspace.slice(0, 12);
  let subcatslice12 = subcatspace.slice(0,12);
  let catslice = catspace.slice(0, 6);
  let subcatslice = subcatspace.slice(0, 6);
  let category = catslice == "ALL" ? "**" : catslice;
  let subcategory = subcatslice == "ALL" ? "**" : subcatslice;
  let rescat = category + '/' + subcategory;
  let suppspace = getProductData.suppliershortname.replace(/[^a-zA-Z0-9]/g, '');
  let suppslice = suppspace.slice(0, 4);
  let catslicesup = catspace.slice(0, 4);
  let subcatslicesup = subcatspace.slice(0, 4);
  let categorys = catslicesup == "ALL" ? "**" : catslicesup;
  let subcategorys = subcatslicesup == "ALL" ? "**" : subcatslicesup;
  let rescatsubsup = suppslice + '/' + categorys + '/' + subcategorys;
  let supnamecate = suppslice + '/' + category;
  let supnamesubcate = suppslice + '/' + subcategory;
  let sizespace = getProductData.size.replace(/[^a-zA-Z0-9]/g, '');
  let subbrandspace = getProductData.subbrand.replace(/[^a-zA-Z0-9]/g, '');
  let brandspace = getProductData.brand.replace(/[^a-zA-Z0-9]/g, '');
  let brand =  brandspace == "ALL" ? "**" : brandspace;
  let size = sizespace == "ALL" ? "***" : sizespace;
  let subbrand = subbrandspace == "ALL" ? "***" : subbrandspace;
  let size12 = size.slice(0, 12);
  let size6 = size.slice(0, 6);
  let brandslice12 = brand.slice(0, 12);
  let subbrandslice12 = subbrand.slice(0, 12);
  let sizecatslice = size.slice(0, 3);
  let brandslice = brand.slice(0, 4);
  let subbrandslice = subbrand.slice(0, 4);
  let ressizebrandsub = sizecatslice + '/' + brandslice + '/'+subbrandslice;
  let sizecatslicesup = size.slice(0, 3);
  let brandslicesup = brand.slice(0, 6);
  let subbrandslicesup = subbrand.slice(0, 6);
  let ressize = sizecatslicesup + '/' + brandslicesup;
  let skuid = getProductData?.rack?.length == 2 ? getProductData.sku.slice(-4) : getProductData?.rack?.length == 3 ? getProductData.sku.slice(-3) : getProductData?.rack?.length == 4 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 5 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 6 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 7 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 8 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 9 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 10 ? getProductData.sku.slice(-2):getProductData.sku;
  let respricedatastring = Number(getProductData?.sellingprice)?.toFixed(0);
  let respricedatasplit = getProductData?.sellingprice?.split('.');
  let respricesuffix = respricedatasplit[1] == undefined ? ".00" : '.'+respricedatasplit[1];
  let respricedata = String(respricedatastring)?.length;
  let resnodata = String(getProductData?.snno)?.length;
  let rackspace = getProductData.rack.replace(/[^a-zA-Z0-9]/g, '');
  let rackdata = rackspace.slice(0, 4);
  let rackslice = rackdata == "ALL" ? "**" : rackdata;
  let categorycountno = String(getProductData?.categorycount)?.length == 4 ? 
  getProductData?.categorycount >= 3000 ? '3K' : 
  getProductData?.categorycount >= 2000 ? '2K' : 
  getProductData?.categorycount >= 1000 ? '1K' : getProductData?.categorycount : getProductData?.categorycount; 

  return (
    <>
    {/* label size 35mm*22mm */}
      <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
      <Grid xs={12} md={12} lg={12} sx={12}>
        {productLabel.isProductLocation ? <p className="BusinessLocation" style={{fontSize:'17px',color:"black" ,fontWeight:1250,textAlign:'center'}}><b>{bnname}</b></p> : <p className="BusinessLocation" style={{fontSize:'18px',color:"black" ,fontWeight:1250,textAlign:'center', visibility:'hidden'}}><b>{bnname}</b></p>}
      </Grid>
   
      <Grid container>
            <Grid xs={2} md={2} lg={2} sm={2} sx={{textAlign:'center'}}>
           {productLabel.isProductNumberAlpha ? <p style = {{marginTop:'18px',fontSize:resnodata == 2 ? '17px': resnodata == 3 ? '16px' : resnodata == 4 ? '15px' : resnodata == 5 ? '14px' : '18px',marginLeft:'-16px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}><b>{getProductData.snno + "#" + getProductData.alpharate}</b></p> : 
           productLabel.isNumber ? <p style = {{marginTop:'18px',fontSize:'18px',marginLeft:'10px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}><b>{getProductData.snno}</b></p> : 
           productLabel.isAlpha ? <p style = {{marginTop:'18px',fontSize:'18px',marginLeft:'-8px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}><b>{getProductData.alpharate}</b></p> : <p style = {{marginTop:'18px',fontSize:resnodata == 2 ? '17px': resnodata == 3 ? '16px' : resnodata == 4 ? '15px' : resnodata == 5 ? '14px' : '18px',marginLeft:'-16px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}><b>{getProductData.alpharate}</b></p>} 

            </Grid>
            <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center'}}>
            <Typography>{productLabel.isRrackProductCode ? <p style = {{fontSize:'16px',marginTop:'42px',marginLeft:'-5px', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase'}}><b>{ rackslice + '/' + skuid }</b></p> : productLabel.isRack ? <p style = {{fontSize:'16px',marginTop:'42px',marginLeft:'-5px', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase'}}><b>{rackspace == "ALL" ? "**" : rackspace}</b></p> : <p style = {{fontSize:'16px',marginTop:'42px',marginLeft:'-5px', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase'}}><b>{ getProductData.sku }</b></p>}</Typography>

            </Grid>
              <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
                <Typography>{productLabel.isProductShortnameCategorySubcategory ? <p style={{fontSize:'15px',fontWeight:1200,color:'black', marginTop:'-6px',textAlign:'center'}}><b style={{textTransform:'uppercase'}}>{rescatsubsup}</b></p> : productLabel.isProductCategory ? <p style={{fontSize:'15px',fontWeight:1200,color:'black', marginTop:'-6px',textAlign:'center'}}><b style={{textTransform:'uppercase'}}>{catslice12 == "ALL" ? "**" : catslice12}</b></p> : productLabel.isProductSubcategory ? <p style={{fontSize:'15px',fontWeight:1200,color:'black', marginTop:'-6px',textAlign:'center'}}><b style={{textTransform:'uppercase'}}>{subcatslice12 == "ALL" ? "**" : subcatslice12}</b></p> : productLabel.isProductSupplierShortname ? <p style={{fontSize:'15px',fontWeight:1200,color:'black', marginTop:'-6px',textAlign:'center'}}><b style={{textTransform:'uppercase'}}>{suppslice}</b></p> : productLabel.isProductCategorySubcategory ? <p style={{fontSize:'15px',fontWeight:1200,color:'black', marginTop:'-6px',textAlign:'center'}}><b style={{textTransform:'uppercase'}}>{rescat}</b></p> : productLabel.isProductShortnameCategory ? <p style={{fontSize:'15px',fontWeight:1200,color:'black', marginTop:'-6px',textAlign:'center'}}><b style={{textTransform:'uppercase'}}>{supnamecate}</b></p> : <p style={{fontSize:'15px',fontWeight:1200,color:'black', marginTop:'-6px',textAlign:'center'}}><b style={{textTransform:'uppercase'}}>{supnamesubcate}</b></p>}</Typography>
              <Typography> {productLabel.isProductSizeBrandSubbrand ? <p className="Alpharate" style={{fontSize:'16px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{ressizebrandsub}</b></p> : productLabel.isProductSize ? <p className="Alpharate" style={{fontSize:'16px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{size12}</b></p> : productLabel.isProductBrand ? <p className="Alpharate" style={{fontSize:'16px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{brandslice12}</b></p> : productLabel.isProductSubBrand ? <p className="Alpharate" style={{fontSize:'16px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{subbrandslice12}</b></p> : productLabel.isProductSizeBrand ? <p className="Alpharate" style={{fontSize:'16px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{size6 + '/' + brandslicesup}</b></p> : productLabel.isProductSizeSubbrand ? <p className="Alpharate" style={{fontSize:'16px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{size6 + '/' + subbrandslicesup}</b></p> : <p className="Alpharate" style={{fontSize:'16px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{brandslicesup + '/' + subbrandslicesup}</b></p> }</Typography>
              <Grid container>
              <Grid xs={7} md={7} lg={7} sm={7} sx={{textAlign:'center'}}>
               <Typography> {productLabel.isProductSellingPrice ? <p className="productSellingPrice" style={{fontSize:respricedata == 3 ? '29px' : respricedata == 4 ? '23px': respricedata == 5 ? '18px': respricedata == 6 ? '16px': respricedata == 7 ? '14px' : respricedata == 8 ? '21px' : '36px',color:'black', fontWeight:1200,textAlign:'center', marginTop: respricedata == 3 ? '-14px' : '-12px', transformOrigin:'top', transform: respricedata == 3 ? 'scaleY(1.5)' : respricedata == 4 ? 'scaleY(1.5)' : respricedata == 5 ? 'scaleY(2)' : respricedata == 6 ? 'scaleY(2.4)' : respricedata == 7 ? 'scaleY(3)' : 'none'}}><b>{'₹' + respricedatastring}<sub style={{fontSize:'8px', transform:'none', transformOrigin:'none'}}>{respricesuffix}</sub></b></p> : <p className="productSellingPrice" style={{fontSize:respricedata == 3 ? '29px' : respricedata == 4 ? '23px': respricedata == 5 ? '18px': respricedata == 6 ? '16px': respricedata == 7 ? '14px' : respricedata == 8 ? '21px' : '36px',color:'black', fontWeight:1200,textAlign:'center', marginTop: respricedata == 3 ? '-14px' : '-12px', transformOrigin:'top', transform: respricedata == 3 ? 'scaleY(1.5)' : respricedata == 4 ? 'scaleY(1.5)' : respricedata == 5 ? 'scaleY(2)' : respricedata == 6 ? 'scaleY(2.4)' : respricedata == 7 ? 'scaleY(3)' : 'none', visibility:'hidden'}}><b>{'₹' + respricedatastring}<sub style={{fontSize:'8px', transform:'none', transformOrigin:'none'}}>{respricesuffix}</sub></b></p>} </Typography>
               {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' + getProductData.}  </Typography> */}
              </Grid>
              <Grid xs={4} md={4} lg={4} sm={4}>
                <Box sx={{marginLeft:'10px'}}>
                  {imageUrl ? (
                    <a href={imageUrl} download>
                        <img src={imageUrl} alt="img" width={49} height={49} style={{marginTop:'-8px'}} />
                    </a>) : null  
                  }
                  </Box>
                </Grid>
              </Grid>
            </Grid>
      </Grid>
    </Box>
      
    </>
    
  );
}


export default Qrcodegenerate;