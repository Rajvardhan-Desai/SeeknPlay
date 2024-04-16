

// import React, { useState } from "react";
// import {
//     Box, Button, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement,
//     Alert, AlertIcon, VStack, Text, Tooltip, IconButton, RadioGroup, Radio, HStack
// } from "@chakra-ui/react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import GameskillSlider from "../../components/InputUi/GameskillSlider"
// import SportsInput from '../InputUi/CustomInput'; // Make sure this component is properly implemented
// import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword"; // Assuming this is a custom hook for your auth
// import { IoMdInformationCircle } from "react-icons/io";
// const steps = [
//     { title: 'Credentials', description: 'Create your account' },
//     { title: 'Personal Information', description: 'Tell us more about you' },
//     { title: 'Sport Details', description: 'Your sports preferences' },
// ];

// const Signup = () => {
//     const [activeStep, setActiveStep] = useState(0);
//     const [inputs, setInputs] = useState({
//         email: "",
//         username: "",
//         password: "",
//         fullName: "",
//         dob: "",
//         gender: "",
//         location: "",
//         mapplsPin: "",
//         sports: [],
//         aval: ""
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const { loading, error, signup } = useSignUpWithEmailAndPassword(); // Adapt according to your hook


//     const handleInputChange = (name, value) => {
//         setInputs((prev) => ({ ...prev, [name]: value }));
//     };

//     const nextStep = () => setActiveStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
//     const prevStep = () => setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
//     const isLastStep = () => activeStep === steps.length - 1;

//     const handleSubmit = async () => {
//         if (!isLastStep()) {
//             nextStep();
//         } else {
//             await signup(inputs);
//         }
//     };
//     const handleIconClick = () => {

//         window.open('https://www.mappls.com/get-pin', '_blank');
//     };

//     const renderStepContent = (step) => {
//         switch (step) {
//             case 0: // Credentials
//                 return (
//                     <>
//                         <FormControl>
//                             <FormLabel>Email</FormLabel>
//                             <Input
//                                 name="email"
//                                 value={inputs.email}
//                                 onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                                 placeholder="Enter your email"
//                             />
//                         </FormControl>
//                         <FormControl mt={4}>
//                             <FormLabel>Username</FormLabel>
//                             <Input
//                                 name="username"
//                                 value={inputs.username}
//                                 onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                                 placeholder="Enter your username"
//                             />
//                         </FormControl>
//                         <FormControl mt={4}>
//                             <FormLabel>Password</FormLabel>
//                             <InputGroup>
//                                 <Input
//                                     name="password"
//                                     type={showPassword ? 'text' : 'password'}
//                                     value={inputs.password}
//                                     onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                                     placeholder="Enter your password"
//                                 />
//                                 <InputRightElement width="4.5rem">
//                                     <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
//                                         {showPassword ? "Hide" : "Show"}
//                                     </Button>
//                                 </InputRightElement>
//                             </InputGroup>
//                         </FormControl>
//                     </>
//                 );
//             case 1: // Personal Information
//                 return (
//                     <>
//                         <FormControl>
//                             <FormLabel>Full Name</FormLabel>
//                             <Input
//                                 name="fullName"
//                                 value={inputs.fullName}
//                                 onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                                 placeholder="Enter your full name"
//                             />
//                         </FormControl>
//                         <FormControl mt={4}>
//                             <FormLabel>Date of Birth</FormLabel>
//                             <Input
//                                 name="dob"
//                                 type="date"
//                                 value={inputs.dob}
//                                 onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                                 placeholder="Enter your Date of Birth"
//                             />
//                         </FormControl>
//                         <FormControl mt={4}>
//                             <FormLabel>Gender</FormLabel>
//                             <RadioGroup
//                                 name="gender"
//                                 value={inputs.gender}
//                                 onChange={(value) => handleInputChange("gender", value)}
//                             >
//                                 <HStack>
//                                     <Radio value="Male">Male</Radio>
//                                     <Radio value="Female">Female</Radio>
//                                 </HStack>
//                             </RadioGroup>
//                         </FormControl>
//                         <FormControl mt={4}>
//                             <FormLabel>Location</FormLabel>
//                             <Input
//                                 name="location"
//                                 value={inputs.location}
//                                 onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                                 placeholder="Enter your location"
//                             />
//                         </FormControl>

//                         <FormControl mt={4}>
//                             <FormLabel>Mappls Pin</FormLabel>
//                             <InputGroup>
//                                 <Input
//                                     name="mapplsPin"
//                                     value={inputs.mapplsPin}
//                                     onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                                     placeholder="Enter your Mappls Pin"
//                                 />
//                                 <InputRightElement>
//                                     <Tooltip label='Info' fontSize='md'>
//                                         <IconButton
//                                             icon={<IoMdInformationCircle />}
//                                             variant="unstyled"
//                                             onClick={handleIconClick}
//                                             aria-label="Information"
//                                             isRound={true}
//                                         />
//                                     </Tooltip>
//                                 </InputRightElement>
//                             </InputGroup>

//                         </FormControl>
//                     </>
//                 );
//             case 2: // Sport Details
//                 return (
//                     <>
//                         <FormControl>
//                             <FormLabel>Favorite Sports</FormLabel>
//                             <SportsInput
//                                 name="sports"
//                                 value={inputs.sports}
//                                 onChange={(value) => handleInputChange('sports', value)}
//                             />
//                         </FormControl>

//                         <FormControl mt={4}>
//                             <FormLabel>Availability</FormLabel>
//                             <RadioGroup
//                                 name="aval"
//                                 value={inputs.aval}
//                                 onChange={(value) => handleInputChange("aval", value)}
//                             >
//                                 <HStack>
//                                     <Radio value="Daily">Daily</Radio>
//                                     <Radio value="Weekend">Weekend</Radio>
//                                 </HStack>
//                             </RadioGroup>

//                         </FormControl>
//                     </>



//                 );
//             default:
//                 return <div>Not Found</div>;
//         }
//     };

//     return (
//         <>
//             <Heading mb={4}>Sign Up</Heading>
//             <VStack align="stretch" spacing={4}>
//                 {steps.map((step, index) => (
//                     <Box key={index} p={5} shadow="md" borderWidth="2px" borderRadius="md" bg={activeStep === index ? "black.50" : "#0082ad"}>
//                         <Text fontWeight="bold">{step.title}</Text>
//                         <Text fontSize="sm" marginBottom={5}>{step.description}</Text>
//                         {activeStep === index && renderStepContent(index)}
//                     </Box>
//                 ))}
//             </VStack>
//             {error && (
//                 <Alert status="error" mt={4}>
//                     <AlertIcon />
//                     {error.message}
//                 </Alert>
//             )}
//             <Box mt={4} display="flex" justifyContent="space-between">
//                 <Button
//                     marginRight={5}
//                     variant="outline"
//                     isDisabled={activeStep === 0}
//                     onClick={prevStep}
//                 >
//                     Previous
//                 </Button>
//                 <Button
//                     color="#0082ad"
//                     isLoading={loading}
//                     onClick={handleSubmit}
//                 >
//                     {isLastStep() ? 'Submit' : 'Next'}
//                 </Button>
//             </Box>
//         </>
//     );
// };

// export default Signup;


import React, { useState } from "react";
import {
    Box, Button, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement,
    Alert, AlertIcon, VStack, Text, Tooltip, IconButton, RadioGroup, Radio, HStack
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import GameskillSlider from "../../components/InputUi/GameskillSlider"
import SportsInput from '../InputUi/CustomInput'; // Make sure this component is properly implemented
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword"; // Assuming this is a custom hook for your auth
import { IoMdInformationCircle } from "react-icons/io";
import useShowToast from "../../hooks/useShowToast";
const steps = [
    { title: 'Personal Information & Credentials', description: 'Create your account' },
    { title: 'Sport Details', description: 'Your sports preferences' },
];

const Signup = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [inputs, setInputs] = useState({
        email: "",
        username: "",
        password: "",
        fullName: "",
        dob: "",
        gender: "",
        location: "",
        mapplsPin: "",
        sports: [],
        aval: "",
        latlong: []
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error, signup } = useSignUpWithEmailAndPassword(); // Adapt according to your hook
    const [locationError, setLocationError] = useState(''); // State for location errors
    const showToast = useShowToast();

    const handleInputChange = (name, value) => {
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setActiveStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
    const prevStep = () => setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
    const isLastStep = () => activeStep === steps.length - 1;

    const handleSubmit = async () => {
        if (!isLastStep()) {
            nextStep();
            if (activeStep === 0) {
                getLocation();
            }
        } else {
            await signup(inputs);

        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setInputs((prevInputs) => ({
                        ...prevInputs,
                        latlong: [position.coords.latitude, position.coords.longitude]

                    }));
                },
                (error) => {
                    setLocationError(error.message);
                }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
            );
        } else {
            setLocationError('Geolocation is not supported by this browser.');
            showToast("Error", "Geolocation is not supported by this browser.", "error");
        }
    };

    getLocation();

    const handleIconClick = () => {

        window.open('https://plus.codes/map', '_blank');
    };

    const renderStepContent = (step) => {
        switch (step) {

            case 0: // Personal Information
                return (
                    <>
                        <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                name="email"
                                value={inputs.email}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                placeholder="Enter your email"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                name="username"
                                value={inputs.username}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                placeholder="Enter your username"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={inputs.password}
                                    onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                    placeholder="Enter your password"
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel mt={4}>Full Name</FormLabel>
                            <Input
                                name="fullName"
                                value={inputs.fullName}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Location</FormLabel>
                            <Input
                                name="location"
                                value={inputs.location}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                placeholder="Enter your location"
                            />
                        </FormControl>


                    </>
                );
            case 1: // Sport Details
                return (
                    <>
                        <FormControl>
                            <FormLabel>Favorite Sports</FormLabel>
                            <SportsInput
                                name="sports"
                                value={inputs.sports}
                                onChange={(value) => handleInputChange('sports', value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Availability</FormLabel>
                            <RadioGroup
                                name="aval"
                                value={inputs.aval}
                                onChange={(value) => handleInputChange("aval", value)}
                            >
                                <HStack>
                                    <Radio value="Daily">Daily</Radio>
                                    <Radio value="Weekend">Weekend</Radio>
                                </HStack>
                            </RadioGroup>

                        </FormControl>
                    </>



                );
            default:
                return <div>Not Found</div>;
        }
    };

    return (
        <>
            <Heading mb={4}>Sign Up</Heading>
            <VStack align="stretch" spacing={4}>
                {steps.map((step, index) => (
                    <Box key={index} p={5} shadow="md" borderWidth="2px" borderRadius="md" bg={activeStep === index ? "black.50" : "#0082ad"}>
                        <Text fontWeight="bold">{step.title}</Text>
                        <Text fontSize="sm" marginBottom={5}>{step.description}</Text>
                        {activeStep === index && renderStepContent(index)}
                    </Box>
                ))}
            </VStack>
            {error && (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    {error.message}
                </Alert>
            )}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                    marginRight={5}
                    variant="outline"
                    isDisabled={activeStep === 0}
                    onClick={prevStep}
                >
                    Previous
                </Button>
                <Button
                    color="#0082ad"
                    isLoading={loading}
                    onClick={handleSubmit}
                >
                    {isLastStep() ? 'Submit' : 'Next'}
                </Button>
            </Box>
        </>
    );
};

export default Signup;


