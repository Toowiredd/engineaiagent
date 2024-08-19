import React from 'react';
import { Box, Text, Link, Flex } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" py={4} px={8}>
      <Flex justify="space-between" align="center">
        <Text fontSize="sm">&copy; 2023 AI Agent. All rights reserved.</Text>
        <Flex>
          <Link href="#" mr={4} fontSize="sm">
            Privacy Policy
          </Link>
          <Link href="#" fontSize="sm">
            Terms of Service
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;