import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Import your firebase config setup
import { collection, query, where, getDocs } from 'firebase/firestore';

const useUserDetails = (userIds) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {

                if (!userIds.length) {
                    throw new Error('No user IDs provided');
                }

                // Prepare query
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('uid', 'in', userIds));

                // Execute query
                const querySnapshot = await getDocs(q);
                const userDetails = [];
                querySnapshot.forEach((doc) => {
                    userDetails.push({ uid: doc.id, ...doc.data() });
                });

                setUsers(userDetails);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userIds]);

    return { users, loading, error };
};

export default useUserDetails;
