import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { firestore } from "../firebase/firebase";

const useGetMyPastScheduleCount = (currentUserUid, userSchedules) => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScheduleCount = async () => {
            setLoading(true);
            try {
                const q = query(collection(firestore, "schedules"));
                const querySnapshot = await getDocs(q);
                const now = new Date();
                const fetchedSchedulesCount = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(schedule => {
                        const scheduleDateTime = new Date(`${schedule.date}T${schedule.time}`);
                        return scheduleDateTime < now && userSchedules?.includes(schedule.id);
                    }).length;

                setCount(fetchedSchedulesCount);
            } catch (error) {
                console.error("Error fetching schedule count: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUserUid && userSchedules?.length > 0) {
            fetchScheduleCount();
        }
    }, [currentUserUid, userSchedules]);

    return { count, loading };
};

export default useGetMyPastScheduleCount;
