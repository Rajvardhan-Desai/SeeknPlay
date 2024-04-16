import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const useUserFullName = (uid) => {
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uid) {
            setIsLoading(false);
            setFullName(null);
            return;
        }

        const getUserFullName = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFullName(docSnap.data().fullName);
                } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document!');
                    setFullName(null);
                }
            } catch (error) {
                console.error("Error getting document:", error);
                setError(error);
            }
            setIsLoading(false);
        };

        getUserFullName();
    }, [uid]);

    return { fullName, isLoading, error };
};

export default useUserFullName;