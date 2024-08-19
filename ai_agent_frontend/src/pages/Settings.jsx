import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { users } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.800');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await users.updateUser(user.id, { name, email });
      updateUser(updatedUser);
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Box w="full" maxW="container.md" mx="auto" p={8} bg={bgColor} borderRadius="lg">
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl">
          User Settings
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isLoading}
            >
              Update Profile
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Settings;