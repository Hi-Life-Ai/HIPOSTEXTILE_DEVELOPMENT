import { BrowserRouter, Routes, Route } from 'react-router-dom';
// /* screen */
import Signin from '../screen/Signin';
import Signup from '../screen/Signup';
import ForgotPwd from '../screen/ForgotPwd';
import ForgotCaptcha from '../screen/ForgotCaptcha';
import ForgotVerifyPwd from '../screen/ForgotVerifyPwd';
import ForgotOtp from '../screen/ForgotOtp';


function Authstack(){
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Signin />} />
                <Route path="signin" element={<Signin />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgetpwd" element={<ForgotPwd />} />
                <Route path="forgetcaptcha" element={<ForgotCaptcha />} />
                <Route path="forgetverifypwd" element={<ForgotVerifyPwd />} />
                <Route path="forgetotp" element={<ForgotOtp />} />
            </Routes>
        </BrowserRouter>    
        </>
    )
}

export default Authstack;

