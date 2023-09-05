import React, { useContext, useEffect, useState } from 'react';
import {Box} from '@mui/material';
import CanvasJSReact from './canvasjs.react';
import { toast } from 'react-toastify';
import { AuthContext, UserRoleAccessContext } from '../context/Appcontext';
import axios from 'axios';
import { SERVICE } from '../services/Baseservice';
import { ThreeDots } from 'react-loader-spinner';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const getcmonth = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];
const valnmonth = monthNames[getcmonth.getMonth()];

function Dashpiechart({ isLocations, isLocationChange }) {
	const { isUserRoleAccess } = useContext(UserRoleAccessContext);

	const [dataPoints, setDataPoints] = useState([]);
	const { setngs } = useContext(AuthContext);

	const [isLoader, setIsLoader] = useState(false);


	const fetchAllSales = async () => {
		try {
			let res = await axios.post(SERVICE.CURRENTMONTHTOPFIVEPRODUCTS, {
				businessid: String(setngs.businessid),
				businesslocation: [isUserRoleAccess.businesslocation],
				islocation: Boolean(isLocationChange),
				location: String(isLocations),
				role: String(isUserRoleAccess.role),
			});

			let result = res.data.sales
			setDataPoints(result)
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



	useEffect(
		() => {
			fetchAllSales();
		}, [isLocations, isLocationChange])

	const options = {
		animationEnabled: true,
		exportEnabled: true,
		theme: "light1",
		title: {
			text: `Top Selling Products (${valnmonth})`,
			fontSize: 20,
		},
		data: [
			{
				startAngle: -90,
				type: "pie",
				dataPoints: dataPoints,
			},
		],
	};
	return (
		<div>
			{isLoader ? (
				<>
					<CanvasJSChart sx={{ width: '100%' }} options={options} />
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
