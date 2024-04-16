import {

	Flex,
	GridItem,

} from "@chakra-ui/react";


const ProfileSchedule = ({ schedule }) => {

	return (
		<>
			<GridItem
				cursor={"pointer"}
				borderRadius={4}
				overflow={"hidden"}
				border={"1px solid"}
				borderColor={"whiteAlpha.300"}
				position={"relative"}
				aspectRatio={1 / 1}
				onClick={onOpen}
			>
				<Card maxW="sm" boxShadow="md" onClick={onOpen} cursor="pointer" border={"1px solid gray"} borderRadius={10} backgroundColor={'#00000'}>
					<CardHeader>
						<Box flex="1" >
							<Badge variant='solid' mb={2} p={0.5}>
								<Text color="gray.400">{schedule.gameType}</Text>
							</Badge>

							<Flex align="center" >
								<Tag size="md" p={2} boxShadow="md" mt={2} >
									<Icon as={TbCalendarTime} color="white" fontSize={20} />
									<Text fontWeight="bold" ml="2">{formatDateToDDMMYYYY(schedule.date)}, {convertTo12HourFormat(schedule.time)}</Text>
								</Tag>
							</Flex>


						</Box>
					</CardHeader>
					<CardBody>
						<Box mb={2}>
							<Text fontSize="sm" fontWeight="bold">Average Rating:</Text>
							<StarRating rating={averageRating} editable={false} />
						</Box>
						<Flex align="center">
							<Tag size="md" colorScheme="blue" p={2} boxShadow="md" mb={2}>
								<Icon as={MdSportsVolleyball} color="white" mr={2} />
								<Text color="white" fontWeight="bold">
									{schedule.sport}
								</Text>
							</Tag>
						</Flex>

						<Flex align="center">
							<Tag size="md" colorScheme="blue" p={2} boxShadow="md">
								<Icon as={MdLocationPin} color="white" mr={2} />
								<Text color="white" fontWeight="bold">
									{schedule.area}
								</Text>
							</Tag>
						</Flex>


						<Flex align="center" >
							<Tag size="md" colorScheme="blue" p={2} boxShadow="md" mt={2} >
								<Icon as={BiSolidStar} color="white" mr={2} />
								<Text color="white" fontWeight="bold">
									{schedule.gameSkill}
								</Text>
							</Tag>
						</Flex>
					</CardBody>
				</Card>




			</GridItem>


		</>
	);
};

export default ProfileSchedule;
