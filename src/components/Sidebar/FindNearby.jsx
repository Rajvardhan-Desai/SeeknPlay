import { Box, Link, Tooltip } from "@chakra-ui/react";
import { TbMapSearch } from "react-icons/tb";
import { Link as RouterLink } from "react-router-dom";

const FindNearBy = () => {
	return (
		<Tooltip
			hasArrow
			label={"FindNearBy"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
		>
			<Link
				display={"flex"}
				to={"/FindNearBy"}
				as={RouterLink}
				alignItems={"center"}
				gap={4}
				_hover={{ bg: "whiteAlpha.400" }}
				borderRadius={6}
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}
				
			>
				<TbMapSearch size={25} />
				<Box display={{ base: "none", md: "block" }}>Find Near By</Box>
			</Link>
		</Tooltip>
	);
};

export default FindNearBy;