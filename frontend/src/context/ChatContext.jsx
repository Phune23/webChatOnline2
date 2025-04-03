import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch chats when user logs in
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Fetch user's chats from the API
  const fetchChats = async () => {
    if (!user) return;
    
    try {
      setChatLoading(true);
      const response = await api.get('/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setChatLoading(false);
    }
  };

  // Fetch messages for a selected chat
  const fetchMessages = async (chatId, page = 1, limit = 20) => {
    if (!chatId) return;
    
    try {
      setMessagesLoading(true);
      const response = await api.get(`/messages/${chatId}?page=${page}&limit=${limit}`);
      setMessages(response.data.messages || []);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Select a chat and load its messages
  const selectChat = async (chat) => {
    setSelectedChat(chat);
    if (chat) {
      await fetchMessages(chat._id);
      // Mark messages as read
      try {
        await api.put(`/messages/read/${chat._id}`);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  // Send a message
  const sendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;
    
    try {
      setLoading(true);
      const response = await api.post('/messages', {
        content,
        chatId: selectedChat._id
      });
      
      // Add the new message to the messages array
      setMessages([...messages, response.data.message]);
      
      // Update the latest message in the chat list
      setChats(chats.map(chat => 
        chat._id === selectedChat._id
          ? { ...chat, latestMessage: response.data.message }
          : chat
      ));
      
      return response.data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat or access existing one
  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const response = await api.post('/chats', { userId });
      
      // If the chat is not already in the list, add it
      if (!chats.find(c => c._id === response.data._id)) {
        setChats([response.data, ...chats]);
      }
      
      setSelectedChat(response.data);
      return response.data;
    } catch (error) {
      console.error('Error accessing chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a group chat
  const createGroupChat = async (users, name) => {
    try {
      setLoading(true);
      const response = await api.post('/chats/group', {
        participants: JSON.stringify(users),
        groupName: name
      });
      
      setChats([response.data, ...chats]);
      return response.data;
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    chats,
    selectedChat,
    messages,
    loading,
    chatLoading,
    messagesLoading,
    fetchChats,
    fetchMessages,
    selectChat,
    sendMessage,
    accessChat,
    createGroupChat
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};