import { Box, Center, Container, Flex } from "@chakra-ui/react";
import React from 'react';
import MapComponent from '../../components/Map/MapComponent';

const FindNearbyPage = () => {
  return (
    <Container maxW={"container.lg"} >
      <Flex  mt={100} >
        <Box flex={1} p={5}>
          <MapComponent />
        </Box>
      </Flex>
    </Container>

  );
};

export default FindNearbyPage;
