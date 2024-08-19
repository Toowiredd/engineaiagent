import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  useToast,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { FaRedo, FaChevronDown, FaTrash } from 'react-icons/fa';
import { messages, branches } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Conversation = () => {
  const [messageList, setMessageList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [input, setInput] = useState('');
  const [currentBranch, setCurrentBranch] = useState('main');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const { user } = useAuth();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const messageBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    fetchMessages();
    fetchBranches();
  }, [currentBranch]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const fetchedMessages = await messages.getMessages(user.id, currentBranch);
      setMessageList(fetchedMessages);
    } catch (error) {
      toast({
        title: 'Error fetching messages',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const fetchBranches = async () => {
    try {
      const fetchedBranches = await branches.getBranches(user.id);
      setBranchList(fetchedBranches);
    } catch (error) {
      toast({
        title: 'Error fetching branches',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setIsTyping(true);
      try {
        const newMessage = await messages.sendMessage({
          userId: user.id,
          agentId: 'default-agent', // You may want to make this dynamic
          content: input,
          branchName: currentBranch,
        });
        setMessageList([...messageList, newMessage]);
        setInput('');
        // Simulate AI response (replace with actual AI response logic)
        setTimeout(async () => {
          const aiResponse = await messages.sendMessage({
            userId: user.id,
            agentId: 'default-agent',
            content: 'AI response',
            branchName: currentBranch,
            sender: 'ai',
          });
          setMessageList(prev => [...prev, aiResponse]);
          setIsTyping(false);
        }, 1000);
      } catch (error) {
        toast({
          title: 'Error sending message',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsTyping(false);
      }
    }
  };

  const handleCreateBranch = async () => {
    const newBranch = `branch-${Date.now()}`;
    try {
      await branches.createBranch({
        userId: user.id,
        parentMessageId: messageList[messageList.length - 1].id,
        name: newBranch,
      });
      setCurrentBranch(newBranch);
      toast({
        title: 'New branch created',
        description: `Switched to ${newBranch}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating branch',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messages.deleteMessage(messageId);
      setMessageList(messageList.filter(msg => msg.id !== messageId));
      toast({
        title: 'Message deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting message',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="full" maxW="container.xl" mx="auto" p={8} bg={bgColor} borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <HStack>
          <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown />}>
              Branch: {currentBranch}
            </MenuButton>
            <MenuList>
              {branchList.map((branch) => (
                <MenuItem key={branch.id} onClick={() => setCurrentBranch(branch.name)}>
                  {branch.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button leftIcon={<FaRedo />} onClick={handleCreateBranch} size="sm">
            New Branch
          </Button>
        </HStack>
        <Box 
          bg={messageBgColor} 
          p={4} 
          borderRadius="md" 
          boxShadow="md" 
          h="60vh" 
          overflowY="auto"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            messageList.map((message) => (
              <HStack key={message.id} 
                bg={message.sender === 'user' ? 'brand.100' : 'gray.100'} 
                p={2} 
                borderRadius="md" 
                mb={2}
                justify="space-between"
              >
                <Text>{message.content}</Text>
                <IconButton
                  icon={<FaTrash />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteMessage(message.id)}
                />
              </HStack>
            ))
          )}
          {isTyping && (
            <Box bg="gray.100" p={2} borderRadius="md" mb={2}>
              <Text>AI is typing...</Text>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <HStack>
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type your message..." 
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} colorScheme="brand" isLoading={isTyping}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Conversation;