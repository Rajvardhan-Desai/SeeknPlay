import { Box, Flex, Link, Text, VStack, HStack, Button, IconButton, Container } from "@chakra-ui/react";

import MyUpSchedules from "../../components/MySchedules/myUpSchedules";
import MySchedules from "../../components/MySchedules/MySchedules";
import MyPastSchedules from "../../components/MySchedules/MyPastSchedules"
import CreateSchedule from "../../components/Modals/CreateScheduleModel";
import { IoMdCreate } from "react-icons/io";
import { useDisclosure } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const Schedules = () => {

	const { isOpen, onOpen, onClose } = useDisclosure();


	return (
		<>

			<VStack py={8} px={6} gap={4}>
				<Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
					<Text fontSize={16} fontWeight={"bold"} _hover={{ color: "gray.400" }}>
						Manage Schedule
					</Text>
					<CreateSchedule isOpen={isOpen} onClose={onClose} />

				</Flex>

			</VStack>
			<Flex direction="column" width="full" mt={10}>
				<Tabs isFitted variant='enclosed' width="full">
					<TabList mb="1em">
						<Tab>My Schedules</Tab>
						<Tab>Upcoming</Tab>
						<Tab>Past</Tab>
					</TabList>

					<TabPanels>
						<TabPanel>
							<MySchedules />
							
						</TabPanel>
						<TabPanel>
							<MyUpSchedules />
						</TabPanel>
						<TabPanel>
							<MyPastSchedules />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Flex>


		</>


	);
};

export default Schedules;
