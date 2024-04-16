import { Box, Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";
import { LuCalendarClock } from "react-icons/lu";
const ProfileTabs = ({ activeTab, setActiveTab }) => {
	return (
		<Flex
			w={"full"}
			justifyContent={"center"}
			gap={{ base: 4, sm: 10 }}
			textTransform={"uppercase"}
			fontWeight={"bold"}
		>

			<Flex borderTop={activeTab === 'schedules' ? "1px solid white" : ""}
				alignItems={"center"} p='3' gap={1} cursor={"pointer"}
				onClick={() => setActiveTab('schedules')}>
				<Box fontSize={20}>
					<LuCalendarClock fontSize={"25px"}/>
				</Box>
				<Text fontSize={12} display={{ base: "none", sm: "block" }}>
					Schedules
				</Text>
			</Flex>
			<Flex borderTop={activeTab === 'posts' ? "1px solid white" : ""}
				alignItems={"center"} p='3' gap={1} cursor={"pointer"}
				onClick={() => setActiveTab('posts')}>
				<Box fontSize={20}>
					<BsGrid3X3 />
				</Box>
				<Text fontSize={12} display={{ base: "none", sm: "block" }}>
					Posts
				</Text>
			</Flex>


		</Flex>
	);
};

export default ProfileTabs;
