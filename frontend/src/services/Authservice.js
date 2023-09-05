// export const BASE_URL = "http://192.168.1.100:8000";
export const BASE_URL = "http://192.168.85.226:8000";
// export const BASE_URL = "http://starreadymades.in";
// export const BASE_URL = "http://localhost:8000";

export const AUTH = {

    LOGIN: `${BASE_URL}/api/authlog`,
    GETUSER: `${BASE_URL}/api/auth`,
    GETROLE: `${BASE_URL}/api/roles`,
    GETAUTHROLE: `${BASE_URL}/api/authrole`,
    GETSETTING: `${BASE_URL}/api/busisetngs`,
    PRODUCT: `${BASE_URL}/api/products`,
    PURCHASE: `${BASE_URL}/api/purchases`,
    POS: `${BASE_URL}/api/pos`,
    TAXRATEGROUPFALSE: `${BASE_URL}/api/taxratesgroupforgroupfalse`,
    TAXRATEGROUPHSN: `${BASE_URL}/api/taxratesforgrouphsnfalse`,
    BUSINESS_LOCATION: `${BASE_URL}/api/businesslocations`,
    GETSINGLESETTINGS: `${BASE_URL}/api/authbusisetng`,
    LOGOUT: `${BASE_URL}/api/authout`,
    USER_AUTH_SIGNIN: `${BASE_URL}/api/users`,
    REG_AUTH: `${BASE_URL}/api/auth/new`,
    FORGOT_OTP: `${BASE_URL}/api/password/forgot`,
}