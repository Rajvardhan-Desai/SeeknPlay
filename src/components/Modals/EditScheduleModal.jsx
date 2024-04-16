import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    Checkbox,
    VStack,
    Stack,
    RadioGroup,
    Radio,
    Box,
    useDisclosure,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Tag,
    Flex,
    Link,
    Avatar
} from "@chakra-ui/react";

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,

} from "@chakra-ui/react";

import GameSkillSlider from "../InputUi/GameskillSlider";
import useShowToast from "../../hooks/useShowToast";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { deleteDoc,arrayRemove } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useUserDetails from '../../hooks/useUserProfile';
import useAuthStore from "../../store/authStore"

const EditScheduleModal = ({ schedule, scheduleId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();
    const [isEditMode, setIsEditMode] = useState(false);
    // Form fields state
    const [sport, setSport] = useState('');
    const [area, setArea] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [gameSkill, setGameSkill] = useState("All Players");
    const [gameType, setGameType] = useState('Regular');
    const [instructions, setInstructions] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('');
    const [checkboxValues, setCheckboxValues] = useState({
        BYOE: false,
        Vaccinated: false,
    });

    const participantUIDs = schedule.participants;
    const { users, loading, error } = useUserDetails(participantUIDs);

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

    useEffect(() => {
        const fetchScheduleDetails = async () => {
            if (!scheduleId) return;

            const docRef = doc(firestore, "schedules", scheduleId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const schedule = docSnap.data();
                setSport(schedule.sport);
                setArea(schedule.area);
                setDate(schedule.date);
                setTime(schedule.time);
                setGameSkill(schedule.gameSkill);
                setGameType(schedule.gameType);
                setInstructions(schedule.instructions);
                setMaxParticipants(schedule.maxParticipants.toString());
                setCheckboxValues({
                    BYOE: schedule.checkboxValues?.BYOE || false,
                    Vaccinated: schedule.checkboxValues?.Vaccinated || false,
                });
            } else {
                showToast("Error", "No such schedule found.", "error");
            }
        };

        fetchScheduleDetails();
    }, [scheduleId, showToast]);

    const handleScheduleUpdate = async () => {
        if (!sport || !area || !date || !time || !maxParticipants) {
            showToast("Error", "Please fill in all required fields.", "error");
            return;
        }

        const scheduleDetails = {
            sport,
            area,
            date,
            time,
            gameSkill,
            gameType,
            instructions,
            maxParticipants: parseInt(maxParticipants, 10),
            checkboxValues
        };

        try {
            const docRef = doc(firestore, "schedules", scheduleId);
            await updateDoc(docRef, scheduleDetails);
            showToast("Success", "Schedule updated successfully", "success");
            setIsEditMode(false);
            window.location.reload();
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };
    
    const handleScheduleDelete = async () => {
        try {
            const docRef = doc(firestore, "schedules", scheduleId);
            await deleteDoc(docRef);

            await updateDoc(doc(firestore, "users", authUser.uid), {
                schedules: arrayRemove(schedule.id)
            });

            showToast("Success", "Schedule deleted successfully", "success");
            onClose();
            window.location.reload();

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsAlertDialogOpen(false);
        }
    };
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const cancelRef = useRef();

    return (
        <>
            <Button onClick={onOpen}>View Schedule</Button>

            <Modal isOpen={isOpen} onClose={() => { onClose(); setIsEditMode(false); }} size="xl">
                <ModalOverlay />
                <ModalContent margin={5} bg={"black"} border={"1px solid gray"} maxW={"400px"}>
                    <ModalHeader>{isEditMode ? "Edit Schedule" : "Schedule Details"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

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
                                            {user.fullName === schedule.author && (
                                                <Tag>Host</Tag>
                                            )}
                                        </Flex>
                                    ))}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                        <FormControl mt={4}>
                            <FormLabel>Sport</FormLabel>
                            <Input placeholder="E.g., Badminton" value={sport} onChange={(e) => setSport(e.target.value)} isDisabled={!isEditMode} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Area</FormLabel>
                            <Input
                                placeholder="Locality or Venue Name"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                isDisabled={!isEditMode}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Date</FormLabel>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                isDisabled={!isEditMode}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Time</FormLabel>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                isDisabled={!isEditMode}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Max Participants</FormLabel>
                            <Input
                                type='number'
                                placeholder="Enter No. of Maximum Participants"
                                value={maxParticipants}
                                onChange={(e) => setMaxParticipants(e.target.value)}
                                isDisabled={!isEditMode}
                            />
                        </FormControl>

                        
                        <Accordion allowMultiple mt={4}>
                            <AccordionItem isDisabled={!isEditMode}>
                                <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left'>Advanced Options</Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <GameSkillSlider value={gameSkill} onChange={(value) => setGameSkill(value)} disabled={!isEditMode} />

                                    <FormControl mt={4}>
                                        <FormLabel>Game Type</FormLabel>
                                        <RadioGroup onChange={(e) => setGameType(e)} value={gameType}>
                                            <Stack direction="column">
                                                <Radio value="Regular" isDisabled={!isEditMode}>Regular</Radio>
                                                <Radio value="Coaching" isDisabled={!isEditMode}>Coaching</Radio>
                                                <Radio value="Tournament" isDisabled={!isEditMode}>Tournament</Radio>
                                            </Stack>
                                        </RadioGroup>
                                    </FormControl>

                                    <FormControl mt={4}>
                                        <FormLabel>Add Instructions</FormLabel>
                                        <Textarea
                                            placeholder="Use this space to tell others about the format of the game and other details"
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            isDisabled={!isEditMode}
                                        />
                                    </FormControl>

                                    <VStack align="start" spacing={2} mt={4}>
                                        <Checkbox
                                            isChecked={checkboxValues.BYOE}
                                            onChange={(e) => setCheckboxValues({ ...checkboxValues, BYOE: e.target.checked })}
                                            isDisabled={!isEditMode}
                                        >
                                            Bring Your Own Equipment
                                        </Checkbox>

                                        <Checkbox
                                            isChecked={checkboxValues.Vaccinated}
                                            onChange={(e) => setCheckboxValues({ ...checkboxValues, Vaccinated: e.target.checked })}
                                            isDisabled={!isEditMode}
                                        >
                                            Vaccinated Players Preferred
                                        </Checkbox>
                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </ModalBody>

                    <ModalFooter>

                        <Button colorScheme="red" onClick={() => setIsAlertDialogOpen(true)} mr={3}>
                            Delete
                        </Button>
                        {isEditMode ? (
                            <>
                                <Button colorScheme="blue" onClick={handleScheduleUpdate} mr={3}>
                                    Save
                                </Button>
                                <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
                            </>
                        ) : (
                            <Button colorScheme="blue" onClick={() => setIsEditMode(true)}>Edit</Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertDialog
                isOpen={isAlertDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsAlertDialogOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Schedule
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsAlertDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleScheduleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default EditScheduleModal;


