
// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Checkbox, Input, List, ListItem, Tag, TagLabel, TagCloseButton, VStack, Flex } from '@chakra-ui/react';

// const sportsList = [
//     { name: 'Soccer' },
//     { name: 'Basketball' },
//     { name: 'Baseball' },
//     { name: 'Football' },
//     { name: 'Tennis' },
//     { name: 'Golf' },
//     { name: 'Running' },
//     { name: 'Volleyball' },
//     { name: 'Swimming' },
//     { name: 'Cycling' },

// ];

// export default function SportsInput() {
//   const [inputValue, setInputValue] = useState('');
//   const [selectedSports, setSelectedSports] = useState([]);
//   const [showList, setShowList] = useState(false);
//   const wrapperRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setShowList(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [wrapperRef]);

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//     setShowList(true);
//   };

//   const handleSelectSport = (sport) => {
//     const isSportSelected = selectedSports.find((selectedSport) => selectedSport.name === sport.name);
//     if (isSportSelected) {
//       setSelectedSports(selectedSports.filter((selectedSport) => selectedSport.name !== sport.name));
//     } else {
//       setSelectedSports([...selectedSports, sport]);
//     }
//     setInputValue('');
//     inputRef.current.focus();
//   };

//   const removeTag = (name) => {
//     setSelectedSports(selectedSports.filter((sport) => sport.name !== name));
//     inputRef.current.focus();
//   };

//   const filteredSports = sportsList.filter((sport) =>
//     sport.name.toLowerCase().includes(inputValue.toLowerCase())
//   );

//   return (
//     <VStack spacing={4} align="stretch" position="relative" ref={wrapperRef}>
//       <Box>
//         <Flex maxWidth={250} flexWrap="wrap" alignItems="center" padding="2" border="1px"  borderRadius="md">
//           {selectedSports.map((sport) => (
//             <Tag
//               size="md"
//               key={sport.name}
//               borderRadius="full"
//               colorScheme="blue"
//               marginRight="2"
//               marginBottom="2"
//             >
//               <TagLabel>{sport.name}</TagLabel>
//               <TagCloseButton onClick={() => removeTag(sport.name)} />
//             </Tag>
//           ))}
//           <Input
//             placeholder={selectedSports.length === 0 ? "Favorite Sports" : ""}
//             value={inputValue}
//             onChange={handleInputChange}
//             onFocus={() => setShowList(true)}
//             variant="unstyled"

//             minW="250px"
//             ref={inputRef}
//           />
//         </Flex>
//       </Box>
//       {showList && (
//         <List spacing={2} style={{ marginTop:"1px", paddingLeft: '10px', maxHeight: '300px', overflowY: 'auto', position: 'absolute', zIndex: 1, backgroundColor: 'black', width: '100%', top: '100%', border: '1px', borderColor: 'gray.200', borderRadius: 'md' }}>
//           {filteredSports.map((sport) => (
//             <ListItem key={sport.name} display="flex" alignItems="center">
//               <Checkbox
//                 isChecked={selectedSports.find((selectedSport) => selectedSport.name === sport.name) !== undefined}
//                 onChange={() => handleSelectSport(sport)}
//                 marginRight={2}
//               />
//               {sport.name}
//             </ListItem>
//           ))}
//         </List>
//       )}
//     </VStack>
//   );
// }

// In SportsInput.jsx or wherever your SportsInput component is defined
// import React, { useEffect } from 'react';
// import { Box, Input, List, ListItem, Tag, TagLabel, TagCloseButton, VStack, Flex } from '@chakra-ui/react';

// // Updated sportsList to an array of strings
// const sportsList = [
//   'Soccer',
//   'Basketball',
//   'Baseball',
//   'Football',
//   'Tennis',
//   'Golf',
//   'Running',
//   'Volleyball',
//   'Swimming',
//   'Cycling',
// ];

// export default function SportsInput({ value = [], onChange }) {
//   const [inputValue, setInputValue] = React.useState('');
//   const [showList, setShowList] = React.useState(false);
//   const inputRef = React.useRef(null);
//   const componentRef = React.useRef(null);

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//     setShowList(true);
//   };

//   const handleSelectSport = (sport) => {
//     const isSportSelected = value.includes(sport);
//     let newValue;
//     if (isSportSelected) {
//       newValue = value.filter(selectedSport => selectedSport !== sport);
//     } else {
//       newValue = [...value, sport];
//     }
//     onChange(newValue);
//     setInputValue('');
//     // List remains open for further selections
//   };

//   const removeTag = (name) => {
//     const newValue = value.filter(sport => sport !== name);
//     onChange(newValue);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showList && componentRef.current && !componentRef.current.contains(event.target)) {
//         setShowList(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showList]);

//   const filteredSports = sportsList.filter(sport =>
//     sport.toLowerCase().includes(inputValue.toLowerCase())
//   );

//   return (
//     <VStack spacing={4} align="stretch" position="relative" ref={componentRef}>
//       <Box>
//         <Flex maxWidth="250px" flexWrap="wrap" alignItems="center" padding="2" border="1px" borderRadius="md">
//           {value.map((sport, index) => (
//             <Tag
//               size="md"
//               key={index} // Since sport names are unique, using the sport name as a key is also an option
//               borderRadius="full"
//               colorScheme="blue"
//               marginRight="2"
//               marginBottom="2"
//             >
//               <TagLabel>{sport}</TagLabel>
//               <TagCloseButton onClick={() => removeTag(sport)} />
//             </Tag>
//           ))}
//           <Input
//             placeholder="Favorite Sports"
//             value={inputValue}
//             onChange={handleInputChange}
//             onFocus={() => setShowList(true)}
//             variant="unstyled"
//             minW="60px"
//             ref={inputRef}
//           />
//         </Flex>
//       </Box>
//       {showList && (
//         <List spacing={2} style={{ paddingLeft: "10px", position: 'absolute', zIndex: 1, backgroundColor: 'black', width: '100%', top: '100%', border: '1px solid gray', borderRadius: 'md' }}>
//           {filteredSports.map((sport, index) => (
//             <ListItem key={index} onClick={() => handleSelectSport(sport)} style={{ cursor: 'pointer' }}>
//               {sport}
//             </ListItem>
//           ))}
//         </List>
//       )}
//     </VStack>
//   );
// }


import React, { useEffect, useState } from 'react';
import { Box, Input, List, ListItem, Tag, TagLabel, TagCloseButton, VStack, Flex } from '@chakra-ui/react';
import { grey } from '@mui/material/colors';

// Initial sports list
const initialSportsList = [
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

export default function SportsInput({ value = [], onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [showList, setShowList] = useState(false);
  const [availableSports, setAvailableSports] = useState(initialSportsList); // State to manage available sports
  const inputRef = React.useRef(null);
  const componentRef = React.useRef(null);

  useEffect(() => {
    // Filter out selected sports from the availableSports list
    setAvailableSports(initialSportsList.filter(sport => !value.includes(sport)));
  }, [value]); // Depend on value to update available sports

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowList(true);
  };

  const handleSelectSport = (sport) => {
    const newValue = [...value, sport];
    onChange(newValue);
    setInputValue('');
  };

  const removeTag = (sport) => {
    const newValue = value.filter(selectedSport => selectedSport !== sport);
    onChange(newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showList && componentRef.current && !componentRef.current.contains(event.target)) {
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showList]);

  const filteredSports = availableSports.filter(sport =>
    sport.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <VStack spacing={4} align="stretch" position="relative" ref={componentRef}>
      <Box>
        <Flex maxWidth="250px" flexWrap="wrap" alignItems="center" padding="2" border="1px" borderColor={'#3d3d3d'} borderRadius="md">
          
          {value.map((sport, index) => (
            <Tag
              size="md"
              key={sport} // Using sport as key since it's unique
              borderRadius="full"
              colorScheme="blue"
              marginRight="2"
              marginBottom="2"
              
            >
              <TagLabel>{sport}</TagLabel>
              <TagCloseButton onClick={() => removeTag(sport)} />
            </Tag>
          ))}
          <Input
            
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowList(true)}
            variant="unstyled"
            minW="250px"
            focusBorderColor="blue.500" // 
            ref={inputRef}
          />
        </Flex>
      </Box>
      {showList && (
        <List spacing={2} style={{marginTop:"1px", position: 'absolute', zIndex: 1, backgroundColor: '#000000', width: '100%', top: '100%', borderRadius: 'md', maxHeight:"210px" ,overflowX:"auto"}}>
          {filteredSports.map(sport => (
            <ListItem key={sport}  textColor={'#90cdf4'} onClick={() => handleSelectSport(sport)} style={{borderRadius:"5px", padding:"2px", backgroundColor:"#172127", paddingLeft:"10px", cursor: 'pointer' }}>
              {sport}
            </ListItem>
          ))}
        </List>
      )}
    </VStack>
  );
}
