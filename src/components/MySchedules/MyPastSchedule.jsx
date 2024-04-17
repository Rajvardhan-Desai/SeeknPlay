import React, { useState, useEffect, useContext } from 'react';

import {
    Box, Button, Flex, Text, Card, CardHeader, CardBody, Badge, Tag, VStack, Avatar,
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Icon, Divider, InputRightElement, InputGroup, Input, Stack, HStack
} from '@chakra-ui/react';
import { timeAgo } from "../../utils/timeAgo";
import { BiSolidStar } from "react-icons/bi";
import { db } from '../../firebase/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, getDoc } from 'firebase/firestore';
import useAuthStore from "../../store/authStore";
import useUserDetails from '../../hooks/useUserProfile';
import useUserFullName from '../../hooks/useGetUserFullNamebyUid';
import useShowToast from "../../hooks/useShowToast";
import { MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import { MdSportsVolleyball } from "react-icons/md";
import { TbCalendarTime } from "react-icons/tb";
import StarRating from './StarRating';

const MyPastSchedule = ({ schedule }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showToast = useShowToast();
    const participantUIDs = schedule.participants;
    const { users, loading, error } = useUserDetails(participantUIDs);
    const { fullName, isLoading } = useUserFullName(schedule.createdBy);
    const authUser = useAuthStore((state) => state.user);
    const [isParticipant, setIsParticipant] = useState(participantUIDs.includes(authUser.uid));

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

    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [currentRating, setCurrentRating] = useState(0); // New state for handling current rating
    const [averageRating, setAverageRating] = useState(0); // New state for the average rating

    useEffect(() => {
        fetchReviews();
    }, []);

    const calculateAverageRating = (reviews) => {
        const totalRating = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        const average = reviews.length > 0 ? totalRating / reviews.length : 0;
        return parseFloat(average.toFixed(1));
    };

    const fetchReviews = async () => {
        const scheduleRef = doc(db, "schedules", schedule.id);
        try {
            const docSnap = await getDoc(scheduleRef);
            if (docSnap.exists()) {
                const fetchedReviews = docSnap.data().reviews || [];
                setReviews(fetchedReviews);
                const avgRating = calculateAverageRating(fetchedReviews);
                setAverageRating(avgRating);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching reviews: ", error);
        }
    };

    const addReview = async () => {
        if (!reviewText.trim() || currentRating === 0) return; // Check if the review is not just empty spaces and rating is not zero

        const newReview = {
            review: reviewText,
            rating: currentRating, // Include the rating in the new review
            createdAt: Date.now(),
            createdBy: authUser.fullName,
            uid: authUser.username,
            profilePic: authUser.profilePicURL
        };

        const scheduleRef = doc(db, "schedules", schedule.id);

        try {
            await updateDoc(scheduleRef, {
                reviews: arrayUnion(newReview)
            });
            setReviewText('');
            setCurrentRating(0); // Reset the current rating after submitting
            fetchReviews(); // Refetch reviews to update the UI and average rating
        } catch (error) {
            console.error("Error adding review: ", error);
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

                        <VStack align={"start"} mt={5} m={5}>
                            <Text fontWeight={"bold"} mb={2}>Reviews</Text>
                            <VStack borderRadius={5} align={"center"}>
                                {reviews.map((review, index) => (
                                    <Flex gap={4} key={index}> {/* It's better to use unique IDs instead of index if available */}
                                        <Link to={`/${review.uid}`}>
                                            <Avatar src={review.profilePic} size={"sm"} />
                                        </Link>
                                        <Flex direction={"column"}>
                                            <Flex gap={2} alignItems={"center"}>
                                                <Link to={`/profile/${review.uid}`}>
                                                    <Text fontWeight={"bold"} fontSize={12} style={{ whiteSpace: 'pre-line' }}>
                                                        {review.createdBy}
                                                    </Text>
                                                </Link>
                                                <Text fontSize={12} color={"gray"}>
                                                    {timeAgo(review.createdAt)}
                                                </Text>
                                            </Flex>
                                            <StarRating rating={review.rating} editable={false} />
                                            <Text fontSize={14}>{review.review}</Text>
                                        </Flex>
                                    </Flex>
                                ))}
                            </VStack>

                        </VStack>



                    </ModalBody>

                    <ModalFooter>
                        <VStack align="stretch" w="full">
                            <Text>Rate your experience:</Text>
                            <StarRating rating={currentRating} setRating={setCurrentRating} editable={true} />
                            <InputGroup size="md">
                                <Input
                                    pr="4.5rem"
                                    type="text"
                                    placeholder="Add a review..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={addReview}>
                                        Post
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </VStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default MyPastSchedule;

