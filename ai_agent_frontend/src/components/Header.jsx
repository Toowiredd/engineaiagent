import React from 'react';
import { Box, Flex, Heading, Button, useColorMode } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box as="header" bg="brand.500" py={4} px={8}>
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg" color="white">
          AI Agent
        </Heading>
        <Flex>
          {isAuthenticated ? (
            <>
              <Button as={Link} to="/" variant="ghost" color="white" mr={4}>
                Dashboard
              </Button>
              <Button as={Link} to="/conversation" variant="ghost" color="white" mr={4}>
                Conversation
              </Button>
              <Button as={Link} to="/settings" variant="ghost" color="white" mr={4}>
                Settings
              </Button>
              <Button onClick={logout} variant="outline" color="white" mr={4}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" color="white" mr={4}>
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline" color="white" mr={4}>
                Register
              </Button>
            </>
          )}
          <Button onClick={toggleColorMode} variant="solid" colorScheme="brand">
            {colorMode === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;