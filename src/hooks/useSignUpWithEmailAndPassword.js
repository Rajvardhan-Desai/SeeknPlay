import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import React, {useState} from "react";

const useSignUpWithEmailAndPassword = () => {
	const [createUserWithEmailAndPassword, , loading, error] = useCreateUserWithEmailAndPassword(auth);
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.login);


	const signup = async (inputs) => {

		if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName || !inputs.sports || !inputs.location || !inputs.aval) {
			showToast("Error", "Please fill all the fields", "error");
			return;
		}

		if (!inputs.latlong) {
			showToast("Error", "Please Enable the Location", "error");
			return;
		}
		

	
		const usersRef = collection(firestore, "users");
		const q = query(usersRef, where("username", "==", inputs.username));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			showToast("Error", "Username already exists", "error");
			return;
		}

		try {
			const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
			if (newUser) {
				const userDoc = {
					uid: newUser.user.uid,
					email: inputs.email,
					username: inputs.username,
					fullName: inputs.fullName,
					dob: inputs.dob,
					gender: inputs.gender,
					location: inputs.location,
					mapplsPin: inputs.mapplsPin,
					sports: inputs.sports,
					aval: inputs.aval,
					bio: "",
					profilePicURL: "",
					followers: [],
					following: [],
					posts: [],
					schedules: [],
					createdAt: Date.now(),
					latlong: inputs.latlong
				};
				await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
				localStorage.setItem("user-info", JSON.stringify(userDoc));
				loginUser(userDoc);
			}
		} catch (signupError) {
			showToast("Error", signupError.message, "error");
		}

	};


	return { loading, error, signup };
};

export default useSignUpWithEmailAndPassword;
