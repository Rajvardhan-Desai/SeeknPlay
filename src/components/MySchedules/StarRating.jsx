import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

const StarRating = ({ rating, setRating, editable }) => {
  return (
    <Flex direction="row">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <Box
            key={index}
            cursor={editable ? "pointer" : "default"}
            onClick={() => editable && setRating(index)}
            color={index <= rating ? "yellow.500" : "gray.300"}
          >
            ★ {/* Simple way to display filled or empty stars */}
          </Box>
        );
      })}
    </Flex>
  );
};

export default StarRating;