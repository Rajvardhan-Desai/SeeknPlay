import {
    Box, FormControl, FormLabel, Slider, SliderTrack, SliderFilledTrack,
    SliderThumb, Switch, Checkbox, Text, VStack, Flex, Icon, Divider
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

const GameSkillSlider = ({ value, onChange }) => {
    const skillLabels = ["Beginner", "Amateur", "Competent", "Proficient", "Expert"];
    const skillDescriptions = [
        "Just starting out",
        "Some experience",
        "Good game understanding",
        "Very skilled",
        "Top level player",
    ];

   
    const valueIndex = skillLabels.indexOf(value);
    const [gameSkill, setGameSkill] = useState(valueIndex >= 0 ? valueIndex : 0);
    const [isSkillEnabled, setIsSkillEnabled] = useState(false);

    
    useEffect(() => {
        setGameSkill(valueIndex);
    }, [valueIndex]);

    const handleSliderChange = (val) => {
        setGameSkill(val); 
        onChange(skillLabels[val]); 
    };

    return (
        <FormControl mt={4} backgroundColor="#2f2f2f" borderRadius={5} p={4}>
            <Flex justifyContent="space-between" alignItems="center">
                <FormLabel htmlFor="game-skill" mb="0">
                    Game Skill
                </FormLabel>
                <Switch
                    id="skill-switch"
                    isChecked={isSkillEnabled}
                    onChange={() => setIsSkillEnabled(!isSkillEnabled)}
                />
            </Flex>

            {isSkillEnabled ? (
                <>
                    <Slider
                        id="game-skill"
                        value={gameSkill}
                        onChange={(val) => handleSliderChange(val)}
                        min={0}
                        max={skillLabels.length - 1}
                        step={1}
                        mt={2}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={4} />
                    </Slider>
                    <Flex justifyContent="space-between" px={2} mt={2}>
                        {skillLabels.map((label, index) => (
                            <Text key={index} fontSize="xs" color="gray.400">
                                {label}
                            </Text>
                        ))}
                    </Flex>

                    <Box textAlign="center" mt={2}>
                        <Text fontSize="lg" fontWeight="bold">
                            {skillLabels[gameSkill]}
                        </Text>
                        <Text fontSize="sm">{skillDescriptions[gameSkill]}</Text>
                    </Box>

                </>
            ) : (
                <Flex mt={4} align="center">
                    <Icon as={InfoIcon} color="gray.500" w={5} h={5} />
                    <Text ml={2} color="gray.200" fontSize="sm">
                        By default, your overall rating skill for the sport will be taken as game skill.
                    </Text>
                </Flex>
            )
            }
        </FormControl>
    );
};

export default GameSkillSlider;




