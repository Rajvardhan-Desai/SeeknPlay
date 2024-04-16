import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import FindNearByPage from "./pages/FindNearByPage/FindNearByPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import ConnectionsPage from "./pages/ConnectionsPage/ConnectionPage";
import SchedulePage from "./pages/SchedulePage/SchedulePage"


function App() {
	const [authUser] = useAuthState(auth);

	return (
		<PageLayout>
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/auth' />} />
				<Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
				<Route path='/FindNearBy' element={authUser ? <FindNearByPage /> : <Navigate to='/auth' />} />
				<Route path='/Connections' element={authUser ? <ConnectionsPage /> : <Navigate to='/auth' />} />
				<Route path='/Schedule' element={authUser ? <SchedulePage /> : <Navigate to='/auth' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/auth' />} />
			</Routes>
		</PageLayout>
	);
}

export default App;
