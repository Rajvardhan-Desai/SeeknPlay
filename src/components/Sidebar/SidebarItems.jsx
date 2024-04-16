import FindNearBy from "./FindNearby";
import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import Connections from "./Connections";
import Schedule from "./Schedule";

const SidebarItems = () => {
	return (
		<>
			<Home />
			<Schedule/>
			<FindNearBy />
			<CreatePost />
			<Search />
			{/* <Notifications /> */}
			<Connections />
			<ProfileLink />
		</>
	);
};

export default SidebarItems;
