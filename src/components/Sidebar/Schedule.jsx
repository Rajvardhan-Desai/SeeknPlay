import { Box, Link, Tooltip } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
import { LuCalendarClock } from "react-icons/lu";

const Schedule = () => {
	return (
		<Tooltip
			hasArrow
			label={"Schedule"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
		>
			<Link
				display={"flex"}
				to={"/Schedule"}
				as={RouterLink}
				alignItems={"center"}
				gap={4}
				_hover={{ bg: "whiteAlpha.400" }}
				borderRadius={6}
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}
			>
				<LuCalendarClock size={25} />
				<Box display={{ base: "none", md: "block" }}>Schedule</Box>
			</Link>
		</Tooltip>
	);
};

export default Schedule;
