import React from 'react';
import { VStack, Spinner, HStack, Flex, Text, Grid, GridItem } from '@chakra-ui/react';
import useGetMyPastSchedules from '../../hooks/useGetMyPastSchedules';
import SuggestedSchedule from '../SuggestedGames/SuggestedGame';
import useAuthStore from "../../store/authStore";
import useGetUserDoc from '../../hooks/useGetUserDoc';
import MyProfilePastSchedule from "../Profile/MyProfilePastSchedule"
import useGetMyPastScheduleCount from '../../hooks/useGetPastSchedulesCount';

const MyProfilePastSchedules = () => {
	const authUser = useAuthStore((state) => state.user);
	const { document, loadingd, error } = useGetUserDoc(authUser?.uid);
	const { count, loading1 } = useGetMyPastScheduleCount(authUser?.uid, document?.schedules);
	
	
	const noPostsFound = !loading1 && count === 0;

	const { schedules, loading } = useGetMyPastSchedules(authUser?.uid, document?.schedules);

	
	if (noPostsFound) return <NoPostsFound />;

	return (
		<>
			<Grid
				templateColumns={{
					sm: "repeat(1, 1fr)",
					md: "repeat(3, 1fr)",
				}}
				gap={1}
				columnGap={1}
			>
				{loading || loadingd &&
				[0, 1, 2].map((_, idx) => (
					<VStack key={idx} alignItems={"flex-start"} gap={4}>
						<Skeleton w={"full"}>
							<Box h='300px'>contents wrapped</Box>
						</Skeleton>
					</VStack>
				))}

				{schedules.length > 0 ? schedules.map(schedule => (

					<MyProfilePastSchedule key={schedule.id} schedule={schedule} />


				)) : <Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
					<Text fontSize={"2xl"}>No Posts Found🤔</Text>
				</Flex>}

			</Grid>



		</>

	);
};

export default MyProfilePastSchedules;


const NoPostsFound = () => {
	return (
		<Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
			<Text fontSize={"2xl"}>No Past Schedules Found</Text>
		</Flex>
	);
};