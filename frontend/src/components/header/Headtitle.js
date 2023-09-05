import React, {useContext} from 'react';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../context/Appcontext';

const Headtitle = ({ title }) => {

    const { setngs } = useContext(AuthContext);


        let bnname = setngs ? setngs?.businessname: "";

    return (
        <Helmet>
            <title>{`${title} - ${bnname}`}</title>
        </Helmet>
    )
}

export default Headtitle;