import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { agents, messages } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AgentProfile = () => {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [persona, setPersona] = useState('');
  const [abilities, setAbilities] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.800');

  useEffect(() => {
    fetchAgentData();
    fetchConversationHistory();
  }, [agentId]);

  const fetchAgentData = async () => {
    try {
      const agentData = await agents.getAgent(agentId);
      setAgent(agentData);
      setName(agentData.name || '');
      setDescription(agentData.description || '');
      setPersona(agentData.persona || '');
      setAbilities(agentData.abilities || '');
    } catch (error) {
      toast({
        title: 'Error fetching agent data',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchConversationHistory = async () => {
    try {
      const history = await messages.getMessagesByAgent(user.id, agentId);
      setConversationHistory(history);
    } catch (error) {
      toast({
        title: 'Error fetching conversation history',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedAgent = await agents.updateAgent(agentId, {
        name,
        description,
        persona,
        abilities,
      });
      setAgent(updatedAgent);
      toast({
        title: 'Agent profile updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating agent profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  if (!agent) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box w="full" maxW="container.xl" mx="auto" p={8} bg={bgColor} borderRadius="lg">
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl">
          Agent Profile: {agent.name}
        </Heading>
        <Tabs>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Conversation History</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
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
                  <FormControl id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="persona">
                    <FormLabel>Persona</FormLabel>
                    <Textarea
                      value={persona}
                      onChange={(e) => setPersona(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="abilities">
                    <FormLabel>Abilities</FormLabel>
                    <Textarea
                      value={abilities}
                      onChange={(e) => setAbilities(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    isLoading={isLoading}
                  >
                    Update Agent Profile
                  </Button>
                </VStack>
              </form>
            </TabPanel>
            <TabPanel>
              <List spacing={3}>
                {conversationHistory.map((message) => (
                  <ListItem key={message.id} p={2} bg={message.sender === 'user' ? 'brand.100' : 'gray.100'} borderRadius="md">
                    <Text><strong>{message.sender === 'user' ? 'User' : 'Agent'}:</strong> {message.content}</Text>
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default AgentProfile;