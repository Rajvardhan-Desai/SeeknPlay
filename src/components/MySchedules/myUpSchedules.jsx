import React from 'react';
import { VStack, Spinner, Grid, GridItem, Text } from '@chakra-ui/react';
import useGetMyUpSchedules from "../../hooks/useGetMyUpSchedules";
import SuggestedSchedule from '../SuggestedGames/SuggestedGame';
import useAuthStore from "../../store/authStore";
import useGetUserDoc from '../../hooks/useGetUserDoc';

const MyUpSchedules = () => {
    const authUser = useAuthStore((state) => state.user);
    const { document, loadingd, error } = useGetUserDoc(authUser?.uid);
    
    const { schedules, loading } = useGetMyUpSchedules(authUser?.uid, document?.schedules);
    
    if (loading) {
        return <Spinner color='blue.500' />;
    }
    if (error) {
        return <Text>Failed to load schedules: {error.message}</Text>;
    }

    return (
        <>
            <VStack>
                <Grid templateColumns={{ sm: 'repeat(auto-fit, minmax(250px, 1fr))' }} gap={6}>
                    {schedules.length > 0 ? schedules.map(schedule => (
                        <GridItem key={schedule.id} m={2}>
                            <SuggestedSchedule schedule={schedule} />
                        </GridItem>
                    )) : <Text>No Upcoming schedules available.</Text>}
                </Grid>
            </VStack>
        </>
    );
};

export default MyUpSchedules;