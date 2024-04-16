// // src/components/SuggestedSchedules.js
// import React from 'react';
// import { VStack, Spinner, HStack, Flex, Text } from '@chakra-ui/react';
// import useGetSuggestedSchedules from '../../hooks/useGetMySchedules';
// import MySchedule from './MySchedule';
// import useAuthStore from "../../store/authStore";

// const MySchedules = () => {
// 	const authUser = useAuthStore((state) => state.user);
// 	const { schedules, loading } = useGetSuggestedSchedules(authUser?.uid);

// 	if (loading) {
// 		return <Spinner color='blue.500' />;
// 	}

// 	return (
// 		<>
// 			<VStack>

// 				<HStack spacing={4}>

// 					{schedules.length > 0 ? schedules.map(schedule => (
// 						<MySchedule key={schedule.id} schedule={schedule} />
// 					)) : <p>No schedules available.</p>}
// 				</HStack>
// 			</VStack>

// 		</>

// 	);
// };

// export default MySchedules;


import React from 'react';
import { VStack, Spinner, Grid, GridItem, Text } from '@chakra-ui/react';
import useGetSuggestedSchedules from '../../hooks/useGetMySchedules';
import MySchedule from './MySchedule';
import useAuthStore from "../../store/authStore";
import { VscAccount } from 'react-icons/vsc';

const MySchedules = () => {
	const authUser = useAuthStore((state) => state.user);
	const { schedules, loading } = useGetSuggestedSchedules(authUser?.uid);

	if (loading) {
		return <Spinner color='blue.500' />;
	}

	return (
		<>
			<VStack>
			<Grid templateColumns={{ sm: 'repeat(auto-fit, minmax(250px, 1fr))' }} gap={6}>
                {schedules.length > 0 ? schedules.map(schedule => (
                    <GridItem key={schedule.id} maxW={"300px"}>
                        <MySchedule schedule={schedule} />
                    </GridItem>
                )) : <Text>No schedules available... Create Now!</Text>}
            </Grid>
        </VStack>

		
		</>
	);
};

export default MySchedules;