import React from 'react';
import { VStack, Spinner, HStack, Flex, Text , Grid,GridItem} from '@chakra-ui/react';
import useGetMyPastSchedules from '../../hooks/useGetMyPastSchedules';
import SuggestedSchedule from '../SuggestedGames/SuggestedGame';
import useAuthStore from "../../store/authStore";
import useGetUserDoc from '../../hooks/useGetUserDoc';
import MyPastSchedule from './MyPastSchedule';

const myUpSchedules = () => {
	const authUser = useAuthStore((state) => state.user);
	const { document, loadingd, error } = useGetUserDoc(authUser?.uid);
	
	const { schedules, loading } = useGetMyPastSchedules(authUser?.uid,document?.schedules);
	
	if (loading,loadingd) {
		return <Spinner color='blue.500' />;
		
	}

	return (
		<>
			<VStack>
			<Grid templateColumns={{ sm: 'repeat(auto-fit, minmax(250px, 1fr))' }} gap={6}>
				<HStack spacing={4}>
					{schedules.length > 0 ? schedules.map(schedule => (
						 <GridItem key={schedule.id} maxW={"300px"} maxH={"300px"}>
							<MyPastSchedule key={schedule.id} schedule={schedule} />
						 </GridItem>
						
					)) : <p>No Past schedules available.</p>}
				</HStack>
				</Grid>
			</VStack>

			
			
		</>

	);
};

export default myUpSchedules;
