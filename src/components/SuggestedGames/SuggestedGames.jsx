// src/components/SuggestedSchedules.js
import React from 'react';
import { VStack, Spinner, HStack, Flex, Text, useDisclosure } from '@chakra-ui/react';
import useGetSuggestedSchedules from '../../hooks/useGetSuggestedSchedules';
import SuggestedSchedule from './SuggestedGame';
import useAuthStore from "../../store/authStore";
import CreateSchedule from '../Modals/CreateScheduleModel';
const SuggestedSchedules = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const authUser = useAuthStore((state) => state.user);
	const { schedules, loading } = useGetSuggestedSchedules(authUser?.uid, authUser?.sports);

	if (loading) {
		return <Spinner color='blue.500' />;
	}

	const renderSchedules = () => {
		if (schedules.length > 0) {
			return schedules.map(schedule => (
				<SuggestedSchedule key={schedule.id} schedule={schedule} />
			));
		} else {
			return (
				<React.Fragment key="no-schedules">
					<Text>No schedules available.</Text>
					<CreateSchedule isOpen={isOpen} onClose={onClose} />
				</React.Fragment>
			);
		}
	};

	return (
		<VStack>
			<HStack spacing={4}>
				{renderSchedules()}
			</HStack>
			{schedules.length === 0 && <Text onClick={onOpen}>Create New Schedule</Text>}
		</VStack>
	);
};

export default SuggestedSchedules;