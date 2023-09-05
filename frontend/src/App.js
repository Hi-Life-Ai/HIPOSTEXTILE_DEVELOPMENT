import React, { useState, useMemo, useEffect, } from 'react';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import Applicationstack from './routes/Applicationstack';
import { AUTH } from './services/Authservice';
import Authstack from './routes/Authstack';
import { toast } from 'react-toastify';
import { AuthContext, UserRoleAccessContext } from './context/Appcontext';

function App() {

  // Auth login state for access user to dashboard
  const [auth, setAuth] = useState({ loader: true, loginState: false, APIToken:"", loginuserid:"", loginuseruniqid:"", loginuserlocation:[], loginusersettings:"", })
  const [forgotAuth, setForgotAuth] = useState({ email: "", password: "", cpassword: "" })
  const [setngs, setSetngs] = useState();
  const [allProducts, setAllProducts] = useState([]);
  const [allTaxrates, setAllTaxrates] = useState([]);
  const [allTaxratesGroup, setAllTaxratesGroup] = useState([]);
  const [allPurchases, setAllPurchases] = useState([]);
  const [allPos, setAllPos] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [isActiveLocations, setIsActiveLocations] = useState([]);
  const [isUserRoleAccess, setIsUserRoleAccess] = useState({});
  const [isUserRoleCompare, setIsUserRoleCompare] = useState([]);

  const authContextData = useMemo(() => {
    return { auth, setAuth, forgotAuth, setForgotAuth, setngs, setSetngs}
  },[auth,forgotAuth,setngs])
  const applicationContextData = useMemo(() => {
    return {isUserRoleAccess, setIsUserRoleAccess, isUserRoleCompare, setIsUserRoleCompare, allProducts, setAllProducts, allLocations, setAllLocations, isActiveLocations, setIsActiveLocations, allPurchases, setAllPurchases, allPos, setAllPos, allTaxrates, setAllTaxrates,allTaxratesGroup, setAllTaxratesGroup}
  },[isUserRoleAccess,isUserRoleCompare,allTaxrates,allTaxratesGroup,allPurchases,allPos,allProducts,allLocations,isActiveLocations])

  useEffect(()=> {
    isCheckUserLogin();
  },[]);
  const isCheckUserLogin = async () => {
    let getApiToken = localStorage.getItem('APIToken');
    let getLoginUserid = localStorage.getItem('LoginUserId');
    let getLoginUseruniqid = localStorage.getItem('LoginUseruniqid');
    let getLoginUserlocation = localStorage.getItem('LoginUserlocation');
    let getLoginUserSettings = localStorage.getItem('LoginUsersettings');
    let getLoginUserRole = localStorage.getItem('LoginUserrole');

    if(getApiToken){
      
        try{
          const [
            loginuserdata,
            userrole,
            usersettings,
            location,
            taxgroup,
            alltax
          ] = await Promise.all([
            axios.get(`${AUTH.GETUSER}/${getLoginUserid}`),
            axios.post(AUTH.GETAUTHROLE,{
              userloginbusinessid:String(getLoginUserSettings),
              userrole:String(getLoginUserRole)
            }),
            axios.post(AUTH.GETSINGLESETTINGS,{
              userloginbusinessid:String(getLoginUserSettings)
            }),
            axios.post(AUTH.BUSINESS_LOCATION, {
              businessid:String(getLoginUserSettings),
              role:String(getLoginUserRole),
              userassignedlocation:[getLoginUserlocation]
            }),
            axios.post(AUTH.TAXRATEGROUPHSN, {
              businessid:String(getLoginUserSettings),
            }),
            axios.post(AUTH.TAXRATEGROUPFALSE, {
              businessid:String(getLoginUserSettings),
            })
          ]);

          setSetngs(usersettings?.data?.result[0]);
          setIsUserRoleAccess(loginuserdata?.data?.suser);
          setIsUserRoleCompare(userrole?.data?.result);
          setAllLocations(location?.data?.businesslocations);
          setIsActiveLocations(location?.data?.businesslocationsactive);
          setAllTaxrates(taxgroup?.data?.taxratesforgrouphsnfalse);
          setAllTaxratesGroup(alltax?.data?.taxratesgroupforgroupfalse)

          setAuth((prevAuth)=> {
            return {...prevAuth,loginState : true, APIToken : getApiToken, loginuserid: getLoginUserid, loginuseruniqid:getLoginUseruniqid, loginuserlocation: getLoginUserlocation, loginusersettings: getLoginUserSettings, loginuserrole: getLoginUserRole}
        });

          //products
          axios.post(AUTH.PRODUCT, {
            businessid:String(getLoginUserSettings),
            role:String(getLoginUserRole),
            userassignedlocation:[getLoginUserlocation]
          }).then((response) => setAllProducts(response?.data?.products))
          
           //purchases
           axios.post(AUTH.PURCHASE, {
            businessid:String(getLoginUserSettings),
            role:String(getLoginUserRole),
            userassignedlocation:[getLoginUserlocation]
          }).then((response) => setAllPurchases(response?.data?.purchases))
          
          //sales
          axios.post(AUTH.POS, {
            businessid:String(getLoginUserSettings),
            role:String(getLoginUserRole),
            userassignedlocation:[getLoginUserlocation]
          }).then((response)=> setAllPos(response?.data?.pos1))

          //all tax
          // axios.post(AUTH.TAXRATEGROUPHSN, {
          //   businessid:String(getLoginUserSettings),
          // }).then((response)=> setAllTaxrates(response?.data?.taxratesforgrouphsnfalse))
          
          //taxrate and taxrate group
          // axios.post(AUTH.TAXRATEGROUPFALSE, {
          //   businessid:String(getLoginUserSettings),
          // }).then((response) => setAllTaxratesGroup(response?.data?.taxratesgroupforgroupfalse))
        
        }catch(err){
          const messages = err?.response?.data?.message;
            if(messages) {
              if(messages == "User not found"){
              }else{
                toast.error(messages);
              }
            }else{
              toast.error("Something went wrong, check connection!");
            }
        }
    }else{
      setAuth({...auth,loginState: false})
    }  
}

  return (
    <>
      <div>
        <AuthContext.Provider value={authContextData}>
          <UserRoleAccessContext.Provider value={applicationContextData}>
            {!auth.loginState ? <Authstack /> : <Applicationstack /> }
          </UserRoleAccessContext.Provider>
        </AuthContext.Provider>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
