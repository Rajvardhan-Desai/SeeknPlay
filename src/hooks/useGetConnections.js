import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetConnections = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setIsLoading(true);
            try {
                if(authUser.following.length > 0) {
                    const usersRef = collection(firestore, "users");
                    const q = query(
                        usersRef,
                        where("uid", "in", [...authUser.following]),
                        orderBy("uid"),
                    );

                    const querySnapshot = await getDocs(q);
                    const users = [];

                    querySnapshot.forEach((doc) => {
                        users.push({ ...doc.data(), id: doc.id });
                    });
                
                    setSuggestedUsers(users);
                } else {
                    // Explicitly set suggestedUsers to an empty array if not following anyone
                    setSuggestedUsers([]);
                    showToast("", "You don't have any connections!", "info");
                }
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) getSuggestedUsers();
    }, [authUser, authUser?.following.length, showToast]); // Add authUser.following.length as a dependency

    return { isLoading, suggestedUsers };
};

export default useGetConnections;
