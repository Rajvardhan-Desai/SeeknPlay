import { Box, Link, Tooltip } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";

const Connections = () => {
	return (
		<Tooltip
			hasArrow
			label={"Connections"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
		>
			<Link
				display={"flex"}
				to={"/connections"}
				as={RouterLink}
				alignItems={"center"}
				gap={4}
				_hover={{ bg: "whiteAlpha.400" }}
				borderRadius={6}
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}
			>
				<FaUserGroup size={25} />
				<Box display={{ base: "none", md: "block" }}>Connections</Box>
			</Link>
		</Tooltip>
	);
};

export default Connections;
