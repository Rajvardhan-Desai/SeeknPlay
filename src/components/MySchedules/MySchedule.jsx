import React, { useState, useEffect, useContext } from 'react';

import {
    Box, Button, Flex, Text, Card, CardHeader, CardBody, Badge, Tag, Avatar, Icon

} from '@chakra-ui/react';
import { MdSportsVolleyball } from "react-icons/md";
import { useDisclosure } from "@chakra-ui/react";
import { BiBold, BiSolidStar } from "react-icons/bi";
import EditScheduleModal from '../Modals/EditScheduleModal';
import { db } from '../../firebase/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';

import useAuthStore from "../../store/authStore";
import useUserDetails from '../../hooks/useUserProfile';
import useUserFullName from '../../hooks/useGetUserFullNamebyUid';
import useShowToast from "../../hooks/useShowToast";
import { MdEvent, MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
const MySchedule = ({ schedule }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showToast = useShowToast();
    const participantUIDs = schedule.participants;
    const { users, loading, error } = useUserDetails(participantUIDs);
    const { fullName, isLoading } = useUserFullName(schedule.createdBy);
    const authUser = useAuthStore((state) => state.user);


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


    return (
        <>
            <Card maxW="sm" backgroundColor={"black"}  boxShadow="md" border={"1px solid gray"} borderRadius={10} cursor="pointer" onClick={onOpen}>
                <CardHeader>
                    <Box flex="1" >
                        <Badge variant='subtle' mb={2} colorScheme='green'>
                            <Text color="gray.400">{schedule.gameType}</Text>
                        </Badge>

                        <Flex align="center">
                            <MdEvent />
                            <Text fontWeight="bold" ml="2">{formatDateToDDMMYYYY(schedule.date)}, {convertTo12HourFormat(schedule.time)}</Text>
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
                <EditScheduleModal isOpen={isOpen} onClose={onClose} scheduleId={schedule.id} schedule={schedule} />
            </Card>

        </>
    );
};

export default MySchedule;

