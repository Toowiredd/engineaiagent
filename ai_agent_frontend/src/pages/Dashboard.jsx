import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { agents } from '../services/api';

const Dashboard = () => {
  const [userAgents, setUserAgents] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  useEffect(() => {
    fetchUserAgents();
  }, []);

  const fetchUserAgents = async () => {
    try {
      const fetchedAgents = await agents.getUserAgents(user.id);
      setUserAgents(fetchedAgents);
    } catch (error) {
      toast({
        title: 'Error fetching agents',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateAgent = async () => {
    try {
      const newAgent = await agents.createAgent({
        name: newAgentName,
        description: newAgentDescription,
        userId: user.id,
      });
      setUserAgents([...userAgents, newAgent]);
      setIsCreateModalOpen(false);
      setNewAgentName('');
      setNewAgentDescription('');
      toast({
        title: 'Agent created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating agent',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="full" maxW="container.xl" mx="auto" p={8} bg={bgColor} borderRadius="lg">
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl">
          Welcome, {user.name}!
        </Heading>
        <Text fontSize="lg">Here are your AI agents:</Text>
        <Button colorScheme="brand" onClick={() => setIsCreateModalOpen(true)}>
          Create New Agent
        </Button>
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {userAgents.map((agent) => (
            <Box key={agent.id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Heading fontSize="xl">{agent.name}</Heading>
              <Text mt={4}>{agent.description}</Text>
              <Button
                as={Link}
                to={`/agent/${agent.id}`}
                mt={4}
                colorScheme="brand"
              >
                View Profile
              </Button>
            </Box>
          ))}
        </SimpleGrid>
        <Button as={Link} to="/conversation" colorScheme="brand" size="lg">
          Start New Conversation
        </Button>
      </VStack>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Agent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={newAgentName} onChange={(e) => setNewAgentName(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={newAgentDescription} onChange={(e) => setNewAgentDescription(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleCreateAgent}>
              Create
            </Button>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;