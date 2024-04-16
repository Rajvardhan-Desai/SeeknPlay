import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; 

const useGetUserDoc = (uid) => {
  const [document, setDocument] = useState(null);
  const [loadingd, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'users', uid); 
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setDocument({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('No such document!');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchData();
  }, [uid]);

  return { document, loadingd, error };
};

export default useGetUserDoc;