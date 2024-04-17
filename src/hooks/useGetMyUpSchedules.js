import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from "../firebase/firebase";

const useGetSuggestedSchedules = (currentUserUid, userSchedules) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            setError(null);
            try {
                const now = new Date();
                let q = query(
                    collection(firestore, "schedules"),
                    where("createdBy", "!=", currentUserUid),
                    where("date", ">=", now.toISOString().split('T')[0]) // assuming 'date' is stored in YYYY-MM-DD format
                );
                if (userSchedules && userSchedules.length > 0) {
                    q = query(q, where("id", "in", userSchedules));
                }
                const querySnapshot = await getDocs(q);
                const fetchedSchedules = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    scheduleDateTime: new Date(`${doc.data().date}T${doc.data().time}`)
                })).filter(schedule => schedule.scheduleDateTime > now);

                setSchedules(fetchedSchedules);
            } catch (error) {
                console.error("Error fetching schedules: ", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUserUid && userSchedules?.length > 0) {
            fetchSchedules();
        }
    }, [currentUserUid, userSchedules]);

    return { schedules, loading, error };
};

export default useGetSuggestedSchedules;