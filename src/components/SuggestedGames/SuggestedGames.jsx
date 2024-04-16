// src/components/SuggestedSchedules.js
import React from 'react';
import { VStack, Spinner, HStack, Flex, Text,useDisclosure } from '@chakra-ui/react';
import useGetSuggestedSchedules from '../../hooks/useGetSuggestedSchedules';
import SuggestedSchedule from './SuggestedGame';
import useAuthStore from "../../store/authStore";
import CreateSchedule from '../Modals/CreateScheduleModel';
const SuggestedSchedules = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const authUser = useAuthStore((state) => state.user);
	const { schedules, loading } = useGetSuggestedSchedules(authUser?.uid,authUser?.sports);

	if (loading) {
		return <Spinner color='blue.500' />;
	}

	return (
		<>
			<VStack>
				

				<HStack spacing={4}>
					{schedules.length > 0 ? schedules.map(schedule => (
						<>
						<SuggestedSchedule key={schedule.id} schedule={schedule} />
						
						</>
						
					)) : <> <p>No schedules available.</p>
						<CreateSchedule isOpen={isOpen} onClose={onClose} />
					</> }
				</HStack>
			</VStack>

		</>

	);
};

export default SuggestedSchedules;
