import { FormControl, FormLabel, Heading, Alert, AlertIcon, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import TextField from '@mui/material/TextField';

const Login = () => {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});
	const { loading, error, login } = useLogin();
	return (
		<>
			<Heading size='lg'>Login</Heading>
			<FormControl>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder='Email'
					fontSize={16}
					variant='outline'
					type='email'
					size={"lg"}
					value={inputs.email}
					onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				/>
			</FormControl>

			<FormControl>
				<FormLabel>Password</FormLabel>
				<Input
					placeholder='Password'
					fontSize={16}

					size={"lg"}
					type='password'
					value={inputs.password}
					onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
				/>
			</FormControl>


			{error && (
				<Alert status='error' fontSize={13} p={2} borderRadius={4}>
					<AlertIcon fontSize={12} />
					{error.message}
				</Alert>
			)}
			<Button
				w={"full"}
				colorScheme='blue'
				size={"lg"}
				fontSize={16}
				isLoading={loading}
				onClick={() => login(inputs)}
			>
				Log in
			</Button>
		</>
	);
};

export default Login;

