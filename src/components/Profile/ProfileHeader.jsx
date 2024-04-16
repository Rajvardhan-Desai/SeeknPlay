import { Avatar, AvatarGroup, Button, Flex, Text, VStack, useDisclosure, HStack, Badge, Wrap, WrapItem } from "@chakra-ui/react";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";
import { BiBoltCircle } from "react-icons/bi";

const ProfileHeader = () => {
	const { userProfile } = useUserProfileStore();
	const authUser = useAuthStore((state) => state.user);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
	const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
	const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;
	const sportsArray = userProfile.sports;
	return (
		<Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
			<AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
				<Avatar src={userProfile.profilePicURL} alt='As a programmer logo' />
			</AvatarGroup>

			<VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
				<Flex
					gap={4}
					direction={{ base: "column", sm: "row" }}
					justifyContent={{ base: "center", sm: "flex-start" }}
					alignItems={"center"}
					w={"full"}
				>

					<Text fontSize={{ base: "sm", md: "lg" }} fontWeight={"bold"}>{userProfile.fullName}</Text>
					{visitingOwnProfileAndAuth && (
						<Flex gap={4} alignItems={"center"} justifyContent={"center"}>
							<Button
								bg={"#007acc"}
								color={"black"}
								_hover={{ bg: "whiteAlpha.800" }}
								size={{ base: "xs", md: "sm" }}
								onClick={onOpen}
							>
								Edit Profile
							</Button>
						</Flex>
					)}
					{visitingAnotherProfileAndAuth && (
						<Flex gap={4} alignItems={"center"} justifyContent={"center"}>
							<Button
								bg={"blue.500"}
								color={"white"}
								_hover={{ bg: "blue.600" }}
								size={{ base: "xs", md: "sm" }}
								onClick={handleFollowUser}
								isLoading={isUpdating}
							>
								{isFollowing ? "Unfollow" : "Follow"}
							</Button>
						</Flex>
					)}
				</Flex>

				<Text fontSize={"sm"}>{userProfile.bio}</Text>

				<HStack spacing={10} justify="center" mt={2}>
					<VStack>
						<Text fontWeight="bold">{userProfile.schedules.length}</Text>
						<Text fontSize="sm">Games</Text>
					</VStack>
					<VStack>
						<Text fontWeight="bold">{userProfile.followers.length + userProfile.following.length} </Text>
						<Text fontSize="sm">Followers</Text>
					</VStack>
					<VStack>
						<Text fontWeight="bold">{userProfile.following.length}</Text>
						<Text fontSize="sm">Following</Text>
					</VStack>
				</HStack>


				<Flex alignItems={"center"} gap={4} mt={3} mb={2}>

					<HStack>
						<BiBoltCircle fontSize={20} />
						<Badge colorScheme='green' p={1}>{userProfile.aval}</Badge>
					</HStack>
				</Flex>

				<VStack align="start" border="1px solid gray" borderRadius={4} p={3}>
					<Text fontSize="md" fontWeight="bold" pb={2}>Sports</Text>
					<Wrap maxW={"300px"}>
						{sportsArray.map((sport, index) => (
							<WrapItem key={index}>
								<Badge variant='solid'
      								colorScheme='blue' borderRadius={20} px={2} py={1} color={"white"}>
									{sport}
								</Badge>
							</WrapItem>
						))}
					</Wrap>
				</VStack>

			</VStack>
			{isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
		</Flex>
	);
};

export default ProfileHeader;
