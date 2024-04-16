import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { firestore } from "../firebase/firebase";

const useGetSuggestedSchedules = (currentUserUid, userSchedules) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            try {
                const q = query(collection(firestore, "schedules"));
                const querySnapshot = await getDocs(q);
                const now = new Date();
                const fetchedSchedules = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(schedule => {
                        const scheduleDateTime = new Date(`${schedule.date}T${schedule.time}`);
                        return schedule.createdBy !== currentUserUid
                            && scheduleDateTime > now
                            && userSchedules?.includes(schedule.id);
                    });

                setSchedules(fetchedSchedules);
            } catch (error) {
                console.error("Error fetching schedules: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUserUid && userSchedules?.length > 0) {
            fetchSchedules();
        }
    }, [currentUserUid, userSchedules]);

    return { schedules, loading };
};

export default useGetSuggestedSchedules;
