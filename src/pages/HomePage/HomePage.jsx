import { Input, Box, Container, Flex, HStack, Divider,Text } from "@chakra-ui/react";
import FeedPosts from "../../components/FeedPosts/FeedPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";
import SuggestedSchedules from "../../components/SuggestedGames/SuggestedGames"
import SuggestedHeader from "../../components/SuggestedUsers/SuggestedHeader";
const HomePage = () => {
	return (
		<Container maxW={"container.lg"}>
			<Flex gap={20}>

				<Box flex={2} py={10} p={2} >
				<Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}  mb={5} mt={2}>
					<Text fontSize={16} fontWeight={"bold"} >
						Join a Game!
					</Text>
				</Flex>
					<HStack
						overflowX="auto"
						maxW="600px"
						sx={{

							overflowY: 'hidden',

							'&::-webkit-scrollbar': {
								width: '5px',
							},
							'&::-webkit-scrollbar-track': {
								background: '#1e1e24',
							},
							'&::-webkit-scrollbar-thumb': {
								background: '#3f3f40',
								borderRadius: '10px',
							},
							'&::-webkit-scrollbar-thumb:hover': {
								background: '#555',
							},

							scrollbarWidth: 'thin',
							scrollbarColor: '#3f3f40 #1e1e24',

							msOverflowStyle: 'none',
						}}
					>
						<SuggestedSchedules />
					</HStack>

					<FeedPosts />
				</Box>
				<Box flex={3} mr={20} display={{ base: "none", lg: "block" }} maxW={"300px"}>
					<SuggestedHeader />

					<SuggestedUsers />
				</Box>
			</Flex>
		</Container>
	);
};

export default HomePage;
