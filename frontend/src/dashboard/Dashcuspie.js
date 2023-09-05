import React, { useContext, useEffect, useState } from 'react';
import {Box} from '@mui/material';
import CanvasJSReact from './canvasjs.react';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../context/Appcontext';
import { AuthContext } from '../context/Appcontext';
import { SERVICE } from '../services/Baseservice';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const getcmonth = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];
const valnmonth = monthNames[getcmonth.getMonth()];

function Dashpiechart({ isLocationChange, isLocations }) {

	const [dataPoints, setDataPoints] = useState([])
	const { isUserRoleAccess, setAllPos, setIsActiveLocations, setAllLocations, setAllPurchases, isUserRoleCompare, isActiveLocations, allPurchases, allPos } = useContext(UserRoleAccessContext);
	const { auth, setngs } = useContext(AuthContext);
	const [isLoader, setIsLoader] = useState(false);


	const fetchAllSales = async () => {
		try {
			let res = await axios.post(SERVICE.TOPFIVE, {
				businessid: String(setngs.businessid),
				role: String(isUserRoleAccess.role),
				userassignedlocation: [isUserRoleAccess.businesslocation],
				islocation: Boolean(isLocationChange),
				location: String(isLocations)
			});

			let res_data = res.data.sales
			setDataPoints(res_data);
			setIsLoader(true)

		} catch (err) {
			setIsLoader(true)

			const messages = err?.response?.data?.message;
			if (messages) {
				toast.error(messages);
			} else {
				toast.error("Something went wrong!")
			}
		}
	};

	useEffect(() => {
		fetchAllSales();
	}, [isLocations, isLocationChange])

	const options = {
		animationEnabled: true,
		exportEnabled: true,
		theme: "light1",
		title: {
			text: `Top 5 Customers (${valnmonth})`,
			fontSize: 20,
		},
		data: [
			{
				type: "pie",
				startAngle: -90,
				dataPoints: dataPoints,
			},
		],
	};
	return (
		<div >
			{isLoader ? (
				<>
					<CanvasJSChart options={options} />

				</>
			) : (
				<>
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<ThreeDots height="80" width="80" radius="9" color="#1976D2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
					</Box>
				</>
			)}
		</div>
	);
}
export default Dashpiechart;
