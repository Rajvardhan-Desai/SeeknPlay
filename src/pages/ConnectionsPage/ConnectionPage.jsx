import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";

import SuggestedUser from "../../components/SuggestedUsers/SuggestedUser";
import useGetConnections from "../../hooks/useGetConnections";

const SuggestedUsers = () => {
	const { isLoading, suggestedUsers } = useGetConnections();

	// optional: render loading skeleton
	if (isLoading) return null;

	return (
		<VStack py={8} px={6} gap={4}>
			{/* <SuggestedHeader /> */}
			
			{suggestedUsers.length !== 0 && (
				<Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
					<Text fontSize={16} fontWeight={"bold"} _hover={{ color: "gray.400"}}>
                        Manage Connection
					</Text>
					{/* <Text fontSize={14} fontWeight={"bold"} _hover={{ color: "gray.400" }} cursor={"pointer"}>
						See All
					</Text> */}
				</Flex>
			)}

			{suggestedUsers.map((user) => (
				<SuggestedUser user={user} key={user.id} />
			))}

			
		</VStack>
	);
};

export default SuggestedUsers;
