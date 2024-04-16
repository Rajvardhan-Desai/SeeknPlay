import {
	Avatar,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	HStack,
	Radio,
	RadioGroup,
	InputGroup,
	InputRightElement,
	IconButton,
	Tooltip
} from "@chakra-ui/react";


import { useRef, useState } from "react";
import useAuthStore from "../../store/authStore";
import usePreviewImg from "../../hooks/usePreviewImg";
import useEditProfile from "../../hooks/useEditProfile";
import useShowToast from "../../hooks/useShowToast";
import SportsInput from '../InputUi/CustomInput';
import { IoMdInformationCircle } from "react-icons/io";
const EditProfile = ({ isOpen, onClose }) => {
	const authUser = useAuthStore((state) => state.user);
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		bio: "",
		dob: "",
		gender: "",
		sports: authUser.sports || [],
		location: "",
		mapplsPin: "",
		aval: ""
	});

	

	const fileRef = useRef(null);
	const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
	const { isUpdating, editProfile } = useEditProfile();
	const showToast = useShowToast();
	const handleInputChange = (name, value) => {
		setInputs(prev => ({ ...prev, [name]: value }));
	};

	const handleIconClick = () => {
        window.open('https://plus.codes/map', '_blank');
    };


	const handleEditProfile = async () => {
		try {
			await editProfile(inputs, selectedFile);
			setSelectedFile(null);
			onClose();
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const countries = [
		'Soccer',
		'Basketball',
		'Baseball',
		'Football',
		'Tennis',
		'Golf',
		'Running',
		'Volleyball',
		'Swimming',
		'Cycling',
	];

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg={"black"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
					<ModalHeader />
					<ModalCloseButton />
					<ModalBody>
						{/* Container Flex */}
						<Flex bg={"black"}>
							<Stack spacing={4} w={"full"} maxW={"md"} bg={"black"} p={6} my={0}>
								<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
									Edit Profile
								</Heading>
								<FormControl>
									<Stack direction={["column", "row"]} spacing={6}>
										<Center>
											<Avatar
												size='xl'
												src={selectedFile || authUser.profilePicURL}
												border={"2px solid white "}
											/>
										</Center>
										<Center w='full'>
											<Button w='full' onClick={() => fileRef.current.click()}>
												Edit Profile Picture
											</Button>
										</Center>
										<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
									</Stack>
								</FormControl>



								<FormControl>
									<FormLabel fontSize={"sm"}>Username</FormLabel>
									<Input
										placeholder={"Username"}
										type={"text"}
										value={inputs.username || authUser.username}
										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
									/>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Full Name</FormLabel>
									<Input
										placeholder={"Full Name"}
										type={"text"}
										value={inputs.fullName || authUser.fullName}
										onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
									/>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Bio</FormLabel>
									<Input
										placeholder={"Bio"}
										type={"text"}
										value={inputs.bio || authUser.bio}
										onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
									/>
								</FormControl>


								<FormControl>
									<FormLabel fontSize={"sm"}>Date of Birth</FormLabel>
									<Input
										name="dob"
										type="date"
										value={inputs.dob || authUser.dob}
										onChange={(e) => setInputs(...inputs, e.target.value)}

									/>
								</FormControl>
								<FormControl >
									<FormLabel fontSize={"sm"}>Gender</FormLabel>
									<RadioGroup
										name="gender"
										value={inputs.gender || authUser.gender}
										onChange={(e) => handleInputChange(e.target.name, e.target.value)}
									>
										<HStack>
											<Radio value="Male">Male</Radio>
											<Radio value="Female">Female</Radio>
										</HStack>
									</RadioGroup>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Location</FormLabel>
									<Input
										placeholder={"Location"}
										type={"text"}
										value={inputs.location || authUser.location}
										onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
									/>
								</FormControl>


								{/* <FormControl>
									<FormLabel fontSize={"sm"}>Google Plus Code</FormLabel>
									<InputGroup>
										<Input
											name="mapplsPin"
											value={inputs.mapplsPin || authUser.mapplsPin}
											onChange={(e) => handleInputChange(e.target.name, e.target.value)}
											placeholder="Enter your Mappls Pin"
										/>
										<InputRightElement>
											<Tooltip label='Info' fontSize='md'>
												<IconButton
													icon={<IoMdInformationCircle />}
													variant="unstyled"
													onClick={handleIconClick}
													aria-label="Information"
													isRound={true}
												/>
											</Tooltip>
										</InputRightElement>
									</InputGroup>
								</FormControl> */}

					
								<FormControl>
									<FormLabel fontSize={"sm"}>Sports</FormLabel>
									<SportsInput
										value={inputs.sports || authUser.sports}
										onChange={(sports) => handleInputChange('sports', sports)}
									>
									</SportsInput>
								</FormControl>

								<FormControl >
									<FormLabel fontSize={"sm"}>Availability</FormLabel>
									<RadioGroup
										name="aval"
										value={inputs.aval || authUser.aval }
										onChange={(value) => handleInputChange("aval", value)}
									>
										<HStack>
											<Radio value="Daily">Daily</Radio>
											<Radio value="Weekend">Weekend</Radio>
										</HStack>
									</RadioGroup>
								</FormControl>

							
								<Stack spacing={6} direction={["column", "row"]}>
									<Button
										bg={"red.400"}
										color={"white"}
										w='full'
										size='sm'
										_hover={{ bg: "red.500" }}
										onClick={onClose}
									>
										Cancel
									</Button>
									<Button
										bg={"blue.400"}
										color={"white"}
										size='sm'
										w='full'
										_hover={{ bg: "blue.500" }}
										onClick={handleEditProfile}
										isLoading={isUpdating}
									>
										Submit
									</Button>
								</Stack>
							</Stack>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditProfile;

// COPY AND PASTE IT AS THE STARTED EDIT PROFILE MODAL
// import {
// 	Avatar,
// 	Button,
// 	Center,
// 	Flex,
// 	FormControl,
// 	FormLabel,
// 	Heading,
// 	Input,
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalHeader,
// 	ModalOverlay,
// 	Stack,
// } from "@chakra-ui/react";

// const EditProfile = ({ isOpen, onClose }) => {
// 	return (
// 		<>
// 			<Modal isOpen={isOpen} onClose={onClose}>
// 				<ModalOverlay />
// 				<ModalContent bg={"black"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
// 					<ModalHeader />
// 					<ModalCloseButton />
// 					<ModalBody>
// 						{/* Container Flex */}
// 						<Flex bg={"black"}>
// 							<Stack spacing={4} w={"full"} maxW={"md"} bg={"black"} p={6} my={0}>
// 								<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
// 									Edit Profile
// 								</Heading>
// 								<FormControl>
// 									<Stack direction={["column", "row"]} spacing={6}>
// 										<Center>
// 											<Avatar size='xl' src={""} border={"2px solid white "} />
// 										</Center>
// 										<Center w='full'>
// 											<Button w='full'>Edit Profile Picture</Button>
// 										</Center>
// 									</Stack>
// 								</FormControl>

// 								<FormControl>
// 									<FormLabel fontSize={"sm"}>Full Name</FormLabel>
// 									<Input placeholder={"Full Name"} size={"sm"} type={"text"} />
// 								</FormControl>

// 								<FormControl>
// 									<FormLabel fontSize={"sm"}>Username</FormLabel>
// 									<Input placeholder={"Username"} size={"sm"} type={"text"} />
// 								</FormControl>

// 								<FormControl>
// 									<FormLabel fontSize={"sm"}>Bio</FormLabel>
// 									<Input placeholder={"Bio"} size={"sm"} type={"text"} />
// 								</FormControl>

// 								<Stack spacing={6} direction={["column", "row"]}>
// 									<Button
// 										bg={"red.400"}
// 										color={"white"}
// 										w='full'
// 										size='sm'
// 										_hover={{ bg: "red.500" }}
// 									>
// 										Cancel
// 									</Button>
// 									<Button
// 										bg={"blue.400"}
// 										color={"white"}
// 										size='sm'
// 										w='full'
// 										_hover={{ bg: "blue.500" }}
// 									>
// 										Submit
// 									</Button>
// 								</Stack>
// 							</Stack>
// 						</Flex>
// 					</ModalBody>
// 				</ModalContent>
// 			</Modal>
// 		</>
// 	);
// };

// export default EditProfile;
