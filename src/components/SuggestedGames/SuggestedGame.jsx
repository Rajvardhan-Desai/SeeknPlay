import React, { useState, useEffect, useContext } from 'react';

import {
    Box, Button, Flex, Text, Card, CardHeader, CardBody, Badge, Tag, VStack, Avatar,
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Center, Icon, Divider, Tooltip, Textarea
} from '@chakra-ui/react';
import { TbVaccine } from "react-icons/tb";
import { MdHomeRepairService } from "react-icons/md";
import { BiBold, BiSolidStar } from "react-icons/bi";
import { db } from '../../firebase/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import useAuthStore from "../../store/authStore";
import useUserDetails from '../../hooks/useUserProfile';
import useUserFullName from '../../hooks/useGetUserFullNamebyUid';
import useShowToast from "../../hooks/useShowToast";
import { MdEvent, MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import { MdSportsVolleyball } from "react-icons/md";
import { outlinedInputClasses } from '@mui/material';
import { TbCalendarTime } from "react-icons/tb";
import { grey } from '@mui/material/colors';
const SuggestedSchedule = ({ schedule }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showToast = useShowToast();
    const participantUIDs = schedule.participants;
    const { users, loading, error } = useUserDetails(participantUIDs);
    const { fullName, isLoading } = useUserFullName(schedule.createdBy);
    const authUser = useAuthStore((state) => state.user);
    const [isParticipant, setIsParticipant] = useState(participantUIDs.includes(authUser?.uid));

    const { BYOE, Vaccinated } = schedule.checkboxValues;
    const { instructions } = schedule.instructions;
    const shouldDisplayBox = BYOE || Vaccinated || instructions;
    const [orderedUsers, setOrderedUsers] = useState([]);

    useEffect(() => {
        if (!loading && users.length) {
            const usersMap = users.reduce((acc, user) => {
                acc[user.uid] = user;
                return acc;
            }, {});

            const ordered = participantUIDs.map(uid => usersMap[uid]).filter(user => user !== undefined);

            setOrderedUsers(ordered);
        }
    }, [users, loading, participantUIDs]);

    const joinSchedule = async () => {
        try {
            const scheduleRef = doc(db, 'schedules', schedule.id);
            await updateDoc(scheduleRef, {
                participants: arrayUnion(authUser.uid),
                participantsCount: increment(1)
            });
            await updateDoc(doc(db, "users", authUser.uid), {
                schedules: arrayUnion(schedule.id)
            });
            setIsParticipant(true);
            window.location.reload();
            showToast("Success", isParticipant ? "You've left the schedule." : "You've joined the schedule.", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }

    };

    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(':');
        const hoursNumeric = parseInt(hours, 10);
        const suffix = hoursNumeric >= 12 ? 'PM' : 'AM';
        const adjustedHours = hoursNumeric % 12 || 12;
        return `${adjustedHours} : ${minutes} ${suffix}`;
    };

    const formatDateToDDMMYYYY = (inputDate) => {
        const [year, month, day] = inputDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const leaveSchedule = async () => {

        try {
            const scheduleRef = doc(db, 'schedules', schedule.id);
            await updateDoc(scheduleRef, {
                participants: arrayRemove(authUser.uid),
                participantsCount: increment(-1)
            });
            await updateDoc(doc(db, "users", authUser.uid), {
                schedules: arrayRemove(schedule.id)
            });
            setIsParticipant(false);
            window.location.reload();
            showToast("", isParticipant ? "You've left the schedule." : "You've joined the schedule.", "info");
        } catch (error) {
            showToast("Error", error.message, "error");
        }

    };

    return (
        <>
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

                        <Flex wrap="nowrap" overflowX="auto" minH="80px" mt={2}>
                            {orderedUsers.map((user, index) => (
                                <Flex
                                    mr={0}
                                    direction="column"
                                    alignItems="left"
                                    justifyContent="center"
                                    minW="80px"
                                    key={user.uid}
                                    className={`avatar ${index === 0 ? 'first-avatar' : ''}`}
                                >
                                    <Link to={`/profile/${user.username}`}>
                                        <Avatar src={user.profilePicURL} size={user.schedules && user.schedules.includes(schedule.id) ? "lg" : "md"} />
                                    </Link>


                                </Flex>
                            ))}
                            <Flex alignItems="center" justifyContent="center" ml={-7} minW="80px" h="80px">
                                <Text fontWeight={"Bold"}>
                                    ·  {schedule.participantsCount} Going
                                </Text>
                            </Flex>

                        </Flex>
                        <Text fontSize="xs" mt="2" fontWeight="bold" >
                            {fullName}
                        </Text>
                    </Box>
                </CardHeader>
                <CardBody>

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

            {/* Modal */}
            {/* <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{schedule.sport}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text><strong>Time:</strong> {schedule.time}</Text>
                        <Text><strong>Date:</strong> {schedule.date}</Text>
                        <Text><strong>Area:</strong> {schedule.area}</Text>
                        <Text><strong>Skill Level:</strong> {schedule.gameSkill}</Text>
                        {loading ? (
                            <Text>Loading participants...</Text>
                        ) : error ? (
                            <Text>{error.message}</Text>
                        ) : (
                            <>
                                <Accordion allowMultiple mt={2}>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    Participants
                                                    <Tag ml={2}>{schedule.participantsCount}</Tag>
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            {orderedUsers.map(user => (
                                                <Flex mb={2} key={user.uid} justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                                                    <Flex alignItems={"center"} gap={2}>
                                                        <Link to={`/profile/${user.username}`}>
                                                            <Avatar src={user.profilePicURL} size={"sm"} />
                                                        </Link>
                                                        <VStack spacing={2} alignItems={"flex-start"}>
                                                            <Link to={`/profile/${user.username}`}>
                                                                <Box fontSize="12px" fontWeight="bold">
                                                                    {user.fullName}
                                                                </Box>
                                                            </Link>
                                                        </VStack>
                                                    </Flex>
                                                    {user.fullName == schedule.author && (
                                                        <Tag>Host</Tag>
                                                    )}
                                                </Flex>
                                            ))}
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>


                            </>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {isParticipant ? (
                            <Button
                                variant="outline" colorScheme="red"
                                onClick={leaveSchedule}
                                aria-label="Leave Schedule"
                                isLoading={isLoading}
                                loadingText="Leaving..."
                            >
                                Leave
                            </Button>
                        ) : (
                            <Button
                                variant="solid"
                                colorScheme="blue"
                                aria-label="Join Schedule"
                                onClick={joinSchedule}
                                isLoading={isLoading}
                                loadingText="Joining..."
                                isDisabled={schedule.participants.length >= schedule.maxParticipants}
                            >
                                Join
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal> */}

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
                <ModalOverlay />
                <ModalContent backgroundColor={'#1c1c1c'} m={3}>
                    <ModalHeader fontWeight={"bold"}>{schedule.sport}</ModalHeader>
                    <ModalBody>
                        <Text mb={3} mt={-5} fontSize="sm" color={"white"}>{formatDateToDDMMYYYY(schedule.date)} • {convertTo12HourFormat(schedule.time)}</Text>
                        <Divider m={3}></Divider>
                        <Flex align="center" backgroundColor={'#262626'} p={1} borderRadius={10}>
                            <Icon m={1} as={MdLocationPin} color="white" mr={2} />
                            <Text my="2" fontSize="lg" fontWeight="bold">
                                {schedule.area}
                            </Text>
                        </Flex>
                        {shouldDisplayBox && (
                            <Box borderWidth="1px" borderRadius="lg" p="4" my="4">
                                <Text fontSize="md" mb="2" fontWeight={"bold"}>Other Instructions</Text>
                                {BYOE && (
                                    <Flex>
                                        <Badge colorScheme="green" mt={2} p={1}>
                                            <Icon as={MdHomeRepairService} fontSize={20} mb={-1} /> BYOE
                                        </Badge>
                                    </Flex>
                                )}
                                {Vaccinated && (
                                    <Flex>
                                        <Badge colorScheme="green" mt={2} p={1}>
                                            <Icon as={TbVaccine} fontSize={20} mb={-1} /> Vaccinated Players Preferred
                                        </Badge>
                                    </Flex>
                                )}
                                {instructions && (
                                    <Flex>
                                        <Textarea mt={3}
                                            value={instructions}
                                            size='sm'
                                            resize={"none"}
                                            isReadOnly={true}
                                            sx={{
                                                _focus: {
                                                    boxShadow: 'none',
                                                    border: '1px solid', // specify the default border you want
                                                    borderColor: 'inherit', // or any other color
                                                },
                                            }}
                                        />
                                    </Flex>
                                )}
                            </Box>
                        )}




                        <Accordion allowMultiple mt={2} p={2}>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Participants
                                            <Tag ml={2}>{schedule.participantsCount}</Tag>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    {orderedUsers.map(user => (
                                        <Flex mt={2} mb={2} key={user.uid} justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                                            <Flex alignItems={"center"} gap={2}>
                                                <Link to={`/profile/${user.username}`}>
                                                    <Avatar src={user.profilePicURL} size={"sm"} />
                                                </Link>
                                                <VStack spacing={2} alignItems={"flex-start"}>
                                                    <Link to={`/profile/${user.username}`}>
                                                        <Box fontSize="12px" fontWeight="bold">
                                                            {user.fullName}
                                                        </Box>
                                                    </Link>
                                                </VStack>
                                            </Flex>
                                            {user.fullName == schedule.author && (
                                                <Tag>Host</Tag>
                                            )}
                                        </Flex>
                                    ))}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {isParticipant ? (
                            <Button
                                variant="outline" colorScheme="red"
                                onClick={leaveSchedule}
                                aria-label="Leave Schedule"
                                isLoading={isLoading}
                                loadingText="Leaving..."
                            >
                                Leave
                            </Button>
                        ) : (
                            <Button
                                variant="solid"
                                colorScheme="blue"
                                aria-label="Join Schedule"
                                onClick={joinSchedule}
                                isLoading={isLoading}
                                loadingText="Joining..."
                                isDisabled={schedule.participants.length >= schedule.maxParticipants}
                            >
                                Join
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SuggestedSchedule;

