import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import useGetMyPastSchedules from "../../hooks/useGetMyPastSchedules";
import useAuthStore from "../../store/authStore";
import useGetUserDoc from '../../hooks/useGetUserDoc';
import MyPastSchedule from "../MySchedules/MyPastSchedule";
const ProfileSchedules = () => {
	const authUser = useAuthStore((state) => state.user);
	const { isLoading, posts } = useGetUserPosts();
	const { document, loadingd, error } = useGetUserDoc(authUser?.uid);
	const { schedules, loading } = useGetMyPastSchedules(authUser?.uid,document?.schedules);
	const noPostsFound = !isLoading && posts.length === 0;
	if (noPostsFound) return <NoPostsFound />;

	return (
		<Grid
			templateColumns={{
				sm: "repeat(1, 1fr)",
				md: "repeat(3, 1fr)",
			}}
			gap={1}
			columnGap={1}
		>
			{isLoading &&
				[0, 1, 2].map((_, idx) => (
					<VStack key={idx} alignItems={"flex-start"} gap={4}>
						<Skeleton w={"full"}>
							<Box h='300px'>contents wrapped</Box>
						</Skeleton>
					</VStack>
				))}

			{!isLoading && (
				<>
					{schedules.length > 0 ? schedules.map(schedule => (
						<MyPastSchedule key={schedule.id} schedule={schedule} />
					)) : <p>No Past schedules available.</p>}
				</>
			)}
		</Grid>
	);
};

export default ProfileSchedules;

const NoPostsFound = () => {
	return (
		<Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
			<Text fontSize={"2xl"}>No Posts Found🤔</Text>
		</Flex>
	);
};
