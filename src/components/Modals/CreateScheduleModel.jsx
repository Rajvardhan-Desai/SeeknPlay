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
    Tooltip,
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
    AccordionIcon
} from "@chakra-ui/react";

import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import GameSkillSlider from "../InputUi/GameskillSlider";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const CreateSchedule = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showToast = useShowToast();
    const [sport, setSport] = useState('');
    const [area, setArea] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [gameSkill, setGameSkill] = useState("All Players");
    const [gameType, setGameType] = useState('Regular');
    const [instructions, setInstructions] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('');
    const authUser = useAuthStore((state) => state.user);
    const today = new Date().toISOString().split('T')[0];
    const userSports = authUser?.sports;
    const { isLoading, handleCreateSchedule } = useCreateSchedule();

    const handleScheduleCreation = async () => {
        // Simple validation check
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
            checkboxValues,
            maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : null,
        };

        try {
            await handleCreateSchedule(scheduleDetails);
            onClose();
            // Reset form fields after successful submission
            setSport("");
            setArea("");
            setDate("");
            setTime("");
            setGameSkill("All Players");
            setGameType("Regular");
            setInstructions("");
            setMaxParticipants('');
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const handleSkillChange = (newSkill) => {
        setGameSkill(newSkill);

    };
    const [checkboxValues, setCheckboxValues] = useState({
        BYOE: false,
        Vaccinated: false,
    });


    return (
        <>

            <Button backgroundColor={"#002d4c"} onClick={onOpen}>Create Schedule</Button>


            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent margin={5} bg={"black"} border={"1px solid gray"} maxW={"400px"}>
                    <ModalHeader>Create Schedule</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl mt={4}>
                            <AutoComplete openOnFocus>
                                <AutoCompleteInput
                                    placeholder="E.g., Badminton / Football / Cricket..."
                                    value={sport} // Set the value of the input to the selected sport
                                    onChange={(e) => setSport(e.target.value)} // Update the sport state on change
                                />
                                <AutoCompleteList backgroundColor={'black'}>
                                    {userSports.map((sport, sid) => (
                                        <AutoCompleteItem
                                            key={`option-${sid}`}
                                            value={sport}
                                            onClick={() => setSport(sport)} // Update the sport state on item click
                                        >
                                            {sport}
                                        </AutoCompleteItem>
                                    ))}
                                </AutoCompleteList>
                            </AutoComplete>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Required Players</FormLabel>
                            <Input type='number' placeholder="Enter No. of Maximum Participants" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Area</FormLabel>
                            <Input
                                placeholder="Locality or Venue Name"
                                value={area}
                                onChange={(e) => {
                                    setArea(e.target.value);
                                }}
                            />

                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Date</FormLabel>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Time</FormLabel>
                            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                        </FormControl>

                        <Accordion allowMultiple mt={4}>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left'>
                                            Advanced Options
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <GameSkillSlider value={gameSkill} onChange={handleSkillChange} />

                                    <FormControl mt={4} backgroundColor="#2f2f2f" borderRadius={5} p={4}>
                                        <FormLabel>Game Type</FormLabel>
                                        <RadioGroup onChange={setGameType} value={gameType}>
                                            <Stack direction="column">
                                                <Radio value="Regular">Regular</Radio>
                                                <Radio value="Coaching">Coaching</Radio>
                                                <Radio value="Tournament">Tournament</Radio>
                                            </Stack>
                                        </RadioGroup>
                                    </FormControl>

                                    <FormControl mt={4} backgroundColor="#2f2f2f" borderRadius={5} p={4}>
                                        <FormLabel>Add Instructions</FormLabel>
                                        <VStack align="start" spacing={2}>
                                            <Checkbox
                                                value="BYOE"
                                                isChecked={checkboxValues.BYOE}
                                                onChange={(e) => setCheckboxValues({ ...checkboxValues, BYOE: e.target.checked })}
                                            >
                                                Bring Your Own Equipment
                                            </Checkbox>

                                            <Checkbox
                                                value="Vaccinated"
                                                isChecked={checkboxValues.Vaccinated}
                                                onChange={(e) => setCheckboxValues({ ...checkboxValues, Vaccinated: e.target.checked })}
                                            >
                                                Vaccinated Players Preferred
                                            </Checkbox>

                                        </VStack>
                                        <Textarea
                                            mt={4}
                                            placeholder="Use this space to tell others about the format of the game and other details"
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                        />
                                    </FormControl>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleScheduleCreation} isLoading={isLoading}>
                            Create Game
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateSchedule;


function useCreateSchedule() {
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const { addPost, userProfile } = useUserProfileStore();
    const { createPost } = usePostStore();

    const handleCreateSchedule = async (scheduleDetails) => {
        if (isLoading) return;
        setIsLoading(true);
        if (!authUser || !authUser.uid) {
            showToast("Error", "You must be logged in to create a schedule.", "error");
            setIsLoading(false);
            return;
        }

        const newSchedule = {
            ...scheduleDetails,
            createdAt: Date.now(),
            author: authUser.fullName,
            createdBy: authUser.uid,
            participants: [authUser.uid],
            participantsCount: 1
        };

        try {
            const docScheduleRef = await addDoc(collection(firestore, "schedules"), newSchedule);
            const scheduleId = docScheduleRef.id;
            await updateDoc(doc(firestore, "schedules", scheduleId), {
                id: scheduleId
            });

            const updatedSchedule = { ...newSchedule, id: scheduleId };

            await updateDoc(doc(firestore, "users", authUser.uid), {
                schedules: arrayUnion(scheduleId)
            });



            if (authUser.uid === userProfile?.uid) {
                createPost(updatedSchedule);
            }

            showToast("Success", "Schedule created successfully", "success");
            window.location.reload();
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleCreateSchedule };
}