import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetSuggestedUsers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setIsLoading(true);
            try {
                const usersRef = collection(firestore, "users");
                // Note: Adjusted query for sportName comparison
                const q = query(
                    usersRef,
                    where("sports", "array-contains-any", authUser.sports),
                    orderBy("uid"),
                    limit(10)
                );

                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs
                    .map(doc => ({ ...doc.data(), id: doc.id }))
                    .filter(user => user.uid !== authUser.uid && !authUser.following.includes(user.uid))
                    .slice(0, 5); // Client-side filtering and limiting

                setSuggestedUsers(users);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) getSuggestedUsers();
    }, [authUser, showToast]);

    return { isLoading, suggestedUsers };
};

export default useGetSuggestedUsers;
