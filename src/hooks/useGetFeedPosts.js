// import { useEffect, useState } from "react";
// import usePostStore from "../store/postStore";
// import useAuthStore from "../store/authStore";
// import useShowToast from "./useShowToast";
// import useUserProfileStore from "../store/userProfileStore";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { firestore } from "../firebase/firebase";

// const useGetFeedPosts = () => {
// 	const [isLoading, setIsLoading] = useState(true);
// 	const { posts, setPosts } = usePostStore();
// 	const authUser = useAuthStore((state) => state.user);
// 	const showToast = useShowToast();
// 	const { setUserProfile } = useUserProfileStore();

// 	useEffect(() => {
// 		const getFeedPosts = async () => {
// 			setIsLoading(true);
// 			if (authUser.following.length === 0) {
// 				setIsLoading(false);
// 				setPosts([]);
// 				return;
// 			}
// 			const q = query(collection(firestore, "posts"), where("createdBy", "in", authUser.following));
// 			// const q = query(collection(firestore, "posts"));
// 			try {
// 				const querySnapshot = await getDocs(q);
// 				const feedPosts = [];

// 				querySnapshot.forEach((doc) => {
// 					feedPosts.push({ id: doc.id, ...doc.data() });
// 				});

// 				feedPosts.sort((a, b) => b.createdAt - a.createdAt);
// 				setPosts(feedPosts);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		if (authUser) getFeedPosts();
// 	}, [authUser, showToast, setPosts, setUserProfile]);

// 	return { isLoading, posts };
// };

// export default useGetFeedPosts;

import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { posts, setPosts } = usePostStore();
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();
    const { setUserProfile } = useUserProfileStore();

    useEffect(() => {
        const getFeedPosts = async () => {
            setIsLoading(true);

            if (!authUser) {
                setIsLoading(false);
                setPosts([]);
                return;
            }

            const feedPosts = [];

            // Only query following posts if the user is following others
            if (authUser.following && authUser.following.length > 0) {
                const followingPostsQuery = query(collection(firestore, "posts"), 
                    where("createdBy", "in", authUser.following),
                    orderBy("createdAt", "desc")
                );

                try {
                    const followingPostsSnapshot = await getDocs(followingPostsQuery);
                    followingPostsSnapshot.forEach((doc) => {
                        feedPosts.push({ id: doc.id, ...doc.data() });
                    });
                } catch (error) {
                    showToast("Error", error.message, "error");
                }
            }

            // Query for user's own posts
            const userPostsQuery = query(collection(firestore, "posts"), 
                where("createdBy", "==", authUser.uid),
                orderBy("createdAt", "desc")
            );

            try {
                const userPostsSnapshot = await getDocs(userPostsQuery);
                userPostsSnapshot.forEach((doc) => {
                    feedPosts.push({ id: doc.id, ...doc.data() });
                });
            } catch (error) {
                showToast("Error", error.message, "error");
            }

            // Sort posts by createdAt if any posts were fetched
            if (feedPosts.length > 0) {
                feedPosts.sort((a, b) => b.createdAt - a.createdAt);
            }

            setPosts(feedPosts);
            setIsLoading(false);
        };

        getFeedPosts();
    }, [authUser, showToast, setPosts, setUserProfile]);

    return { isLoading, posts };
};

export default useGetFeedPosts;
