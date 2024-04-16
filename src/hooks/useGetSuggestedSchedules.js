import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { firestore } from "../firebase/firebase";

const useGetSuggestedSchedules = (currentUserUid, authUserSports) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            try {
                const q = query(collection(firestore, "schedules"));
                const querySnapshot = await getDocs(q);
                const now = new Date(); // Current date and time
                const fetchedSchedules = querySnapshot.docs
                  .map(doc => ({ id: doc.id, ...doc.data() }))
                  .filter(schedule => {
                      const scheduleDateTime = new Date(`${schedule.date}T${schedule.time}`);
                      // Check if the schedule is upcoming and if the sport is in the user's interests
                      return schedule.createdBy !== currentUserUid 
                          && scheduleDateTime > now 
                          && authUserSports.includes(schedule.sport);
                  });

                setSchedules(fetchedSchedules);
            } catch (error) {
                console.error("Error fetching schedules: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUserUid && authUserSports.length > 0) {
            fetchSchedules();
        }
    }, [currentUserUid, authUserSports]); 

    return { schedules, loading };
};

export default useGetSuggestedSchedules;