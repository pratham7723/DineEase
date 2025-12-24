import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChefHat, TrendingUp, DollarSign, MapPin, Clock, Phone, Mail, Info, Heart, CheckCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Restaurant Information
const RESTAURANT_INFO = {
  name: "DineEase",
  tagline: "Your Premium Dining Experience",
  location: "123 Gourmet Street, Food District, Mumbai 400001",
  phone: "+91 98765 43210",
  email: "hello@dineease.com",
  hours: {
    weekday: "11:00 AM - 11:00 PM",
    weekend: "10:00 AM - 12:00 AM"
  },
  features: [
    "🎯 AR 3D Menu Experience",
    "📱 QR Code Ordering",
    "🍽️ Dine-in & Takeaway",
    "🚀 Fast Service"
  ]
};

const MenuChatbot = ({ menuItems, onAddToCart, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `👋 Welcome to ${RESTAURANT_INFO.name}! I'm your personal dining assistant. I can help you with:\n\n• Menu recommendations\n• Restaurant information\n• Location & hours\n• Special requests\n\nWhat would you like to know?`,
      timestamp: new Date(),
      suggestions: ["Show me popular items", "What's your location?", "Vegetarian options", "Tell me about DineEase"]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    lastCategory: null,
    itemsAdded: [],
    askedAbout: []
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced recommendation logic with restaurant info
  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let recommendations = [];
    let responseText = '';
    let suggestions = [];
    let restaurantInfo = null;

    // Restaurant Information Queries
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
      responseText = `📍 **Our Location**\n\n${RESTAURANT_INFO.location}\n\nWe're easy to find in the heart of the Food District!`;
      suggestions = ["Show me the menu", "What are your hours?", "Contact information"];
      restaurantInfo = { type: 'location', icon: <MapPin className="h-4 w-4" /> };
    }
    else if (message.includes('hour') || message.includes('timing') || message.includes('open') || message.includes('close')) {
      responseText = `🕐 **Opening Hours**\n\n**Monday - Friday:** ${RESTAURANT_INFO.hours.weekday}\n**Saturday - Sunday:** ${RESTAURANT_INFO.hours.weekend}\n\nWe're open 7 days a week!`;
      suggestions = ["Show me popular items", "What's your location?", "Contact details"];
      restaurantInfo = { type: 'hours', icon: <Clock className="h-4 w-4" /> };
    }
    else if (message.includes('contact') || message.includes('phone') || message.includes('call') || message.includes('email')) {
      responseText = `📞 **Contact Us**\n\n**Phone:** ${RESTAURANT_INFO.phone}\n**Email:** ${RESTAURANT_INFO.email}\n\nFeel free to reach out anytime!`;
      suggestions = ["View menu", "What are your hours?", "Tell me about DineEase"];
      restaurantInfo = { type: 'contact', icon: <Phone className="h-4 w-4" /> };
    }
    else if (message.includes('about') || message.includes('dineease') || message.includes('restaurant') || message.includes('tell me')) {
      responseText = `🍽️ **About ${RESTAURANT_INFO.name}**\n\n${RESTAURANT_INFO.tagline}\n\n**What makes us special:**\n${RESTAURANT_INFO.features.join('\n')}\n\nWe're committed to providing an exceptional dining experience with cutting-edge technology!`;
      suggestions = ["Show me the menu", "What's your location?", "Popular items"];
      restaurantInfo = { type: 'about', icon: <Info className="h-4 w-4" /> };
    }
    // Tag-based filtering (MUST come before general menu queries)
    else if (message.includes('jain')) {
      recommendations = menuItems.filter(item =>
        item.tags?.includes('Jain') && item.status === 'Available'
      ).slice(0, 3);
      responseText = recommendations.length > 0
        ? '🙏 Our Jain-friendly options:'
        : '🙏 We currently don\'t have Jain-specific items, but here are some vegetarian options:';
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item =>
          item.category?.toLowerCase().includes('veg') && item.status === 'Available'
        ).slice(0, 3);
      }
      suggestions = ["Show me desserts", "What about drinks?", "Chef's special"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'jain' }));
    }
    else if (message.includes('chef') && (message.includes('special') || message.includes('signature'))) {
      recommendations = menuItems.filter(item =>
        item.tags?.includes("Chef's Special") && item.status === 'Available'
      ).slice(0, 3);
      responseText = recommendations.length > 0
        ? '👨‍🍳 Our Chef\'s Special creations:'
        : '👨‍🍳 Here are our premium selections:';
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item => item.price > 300 && item.status === 'Available').slice(0, 3);
      }
      suggestions = ["Show me desserts", "Jain options", "Popular items"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'chef-special' }));
    }
    else if (message.includes('bestseller') || message.includes('best seller')) {
      recommendations = menuItems.filter(item =>
        item.tags?.includes('Bestseller') && item.status === 'Available'
      ).slice(0, 3);
      responseText = recommendations.length > 0
        ? '🏆 Our bestselling items:'
        : '🔥 Our most popular items:';
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item => item.status === 'Available').slice(0, 3);
      }
      suggestions = ["Chef's special", "Jain options", "Desserts"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'bestseller' }));
    }
    else if (message.includes('new') && !message.includes('menu')) {
      recommendations = menuItems.filter(item =>
        item.tags?.includes('New') && item.status === 'Available'
      ).slice(0, 3);
      responseText = recommendations.length > 0
        ? '✨ Our newest additions:'
        : '✨ Here are some fresh recommendations:';
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item => item.status === 'Available').slice(0, 3);
      }
      suggestions = ["Bestsellers", "Chef's special", "Popular items"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'new' }));
    }
    else if (message.includes('vegan')) {
      recommendations = menuItems.filter(item =>
        item.tags?.includes('Vegan') && item.status === 'Available'
      ).slice(0, 3);
      responseText = recommendations.length > 0
        ? '🌱 Our vegan options:'
        : '🌱 Here are some plant-based options:';
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item =>
          item.category?.toLowerCase().includes('veg') && item.status === 'Available'
        ).slice(0, 3);
      }
      suggestions = ["Jain options", "Healthy items", "Desserts"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'vegan' }));
    }
    else if (message.includes('healthy') || message.includes('health')) {
      recommendations = menuItems.filter(item =>
        item.tags?.includes('Healthy') && item.status === 'Available'
      ).slice(0, 3);
      responseText = recommendations.length > 0
        ? '💪 Our healthy choices:'
        : '💪 Here are some nutritious options:';
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item => item.status === 'Available').slice(0, 3);
      }
      suggestions = ["Vegan options", "Drinks", "Desserts"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'healthy' }));
    }
    else if (message.includes('gluten') || message.includes('gluten-free')) {
      recommendations = menuItems.filter(item =>
        item.tags?.includes('Gluten-Free') && item.status === 'Available'
      ).slice(0, 3);
      responseText = recommendations.length > 0
        ? '🌾 Our gluten-free options:'
        : '🌾 Here are some options (please confirm with staff):';
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item => item.status === 'Available').slice(0, 3);
      }
      suggestions = ["Healthy items", "Vegan options", "Desserts"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'gluten-free' }));
    }
    // Menu Recommendations
    else if (message.includes('veg') || message.includes('vegetarian')) {
      recommendations = menuItems.filter(item =>
        item.category?.toLowerCase().includes('veg') ||
        item.name?.toLowerCase().includes('veg')
      ).slice(0, 3);
      responseText = '🥗 Here are our delicious vegetarian options:';
      suggestions = ["Show me desserts", "What about drinks?", "Budget options"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'vegetarian' }));
    }
    else if (message.includes('cheap') || message.includes('budget') || message.includes('affordable')) {
      recommendations = menuItems
        .filter(item => item.price < 200)
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
      responseText = '💰 Our budget-friendly options:';
      suggestions = ["Show me premium items", "Vegetarian options", "Popular items"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'budget' }));
    }
    else if (message.includes('expensive') || message.includes('premium') || message.includes('special')) {
      recommendations = menuItems
        .filter(item => item.price > 300)
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);
      responseText = '⭐ Our premium selections:';
      suggestions = ["Show me desserts", "What about drinks?", "Budget options"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'premium' }));
    }
    else if (message.includes('pizza')) {
      recommendations = menuItems.filter(item =>
        item.category?.toLowerCase().includes('pizza') ||
        item.name?.toLowerCase().includes('pizza')
      ).slice(0, 3);
      responseText = '🍕 Our amazing pizzas:';
      suggestions = ["Show me burgers", "What about drinks?", "Desserts"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'pizza' }));
    }
    else if (message.includes('burger')) {
      recommendations = menuItems.filter(item =>
        item.category?.toLowerCase().includes('burger') ||
        item.name?.toLowerCase().includes('burger')
      ).slice(0, 3);
      responseText = '🍔 Check out our burgers:';
      suggestions = ["Show me pizzas", "What about drinks?", "Desserts"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'burger' }));
    }
    else if (message.includes('drink') || message.includes('beverage') || message.includes('coffee')) {
      recommendations = menuItems.filter(item =>
        item.category?.toLowerCase().includes('beverage') ||
        item.category?.toLowerCase().includes('drink') ||
        item.name?.toLowerCase().includes('coffee') ||
        item.name?.toLowerCase().includes('cola')
      ).slice(0, 3);
      responseText = '🥤 Refreshing beverages:';
      suggestions = ["Show me desserts", "Food options", "Popular items"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'drinks' }));
    }
    else if (message.includes('dessert') || message.includes('sweet')) {
      recommendations = menuItems.filter(item =>
        item.category?.toLowerCase().includes('dessert') ||
        item.name?.toLowerCase().includes('pastry') ||
        item.name?.toLowerCase().includes('donut') ||
        item.name?.toLowerCase().includes('ice')
      ).slice(0, 3);
      responseText = '🍰 Sweet treats for you:';
      suggestions = ["Show me drinks", "Main course", "Popular items"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'desserts' }));
    }
    else if (message.includes('popular') || message.includes('trending') || message.includes('best') || message.includes('recommend')) {
      recommendations = menuItems
        .filter(item => item.status === 'Available')
        .slice(0, 3);
      responseText = '🔥 Our most popular items:';
      suggestions = ["Vegetarian options", "Desserts", "Drinks"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'popular' }));
    }
    else if (message.includes('spicy') || message.includes('hot')) {
      // First try to find items with Spicy tag
      recommendations = menuItems.filter(item =>
        item.tags?.includes('Spicy') && item.status === 'Available'
      ).slice(0, 3);

      // Fallback to name-based search
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item =>
          (item.name?.toLowerCase().includes('pepper') ||
            item.name?.toLowerCase().includes('spicy')) &&
          item.status === 'Available'
        ).slice(0, 3);
      }

      // Final fallback
      if (recommendations.length === 0) {
        recommendations = menuItems.filter(item => item.status === 'Available').slice(0, 3);
        responseText = '🌶️ These are our top picks (ask staff about spice level):';
      } else {
        responseText = '🌶️ Spicy selections:';
      }
      suggestions = ["Show me mild options", "Desserts", "Drinks"];
      setConversationContext(prev => ({ ...prev, lastCategory: 'spicy' }));
    }
    else if (message.includes('quick') || message.includes('fast')) {
      recommendations = menuItems
        .filter(item =>
          item.category?.toLowerCase().includes('snack') ||
          item.name?.toLowerCase().includes('sandwich')
        )
        .slice(0, 3);
      if (recommendations.length === 0) {
        recommendations = menuItems.slice(0, 3);
      }
      responseText = '⚡ Quick bites:';
      suggestions = ["Show me full meals", "Drinks", "Desserts"];
    }
    // Conversation endings and thank you
    else if (message.includes("that's all") || message.includes("thats all") || message.includes("that is all")) {
      responseText = '🙏 **Thank you for your order!**\n\nYour items have been added to the cart. When you\'re ready, you can:\n\n✅ Review your cart\n✅ Place your order\n✅ Continue browsing\n\nEnjoy your meal at DineEase!';
      suggestions = ["Browse more", "What's your location?", "Contact info"];
      restaurantInfo = { type: 'thankyou', icon: <CheckCircle className="h-4 w-4" />, hasCartButton: true };
    }
    else if (message.includes('thank') || message.includes('thanks')) {
      responseText = '😊 **You\'re welcome!**\n\nIt was my pleasure helping you today. If you need anything else, just ask!\n\nHave a wonderful dining experience!';
      suggestions = ["Show me more", "What's your location?", "Contact info"];
      restaurantInfo = { type: 'thanks', icon: <Heart className="h-4 w-4" /> };
    }
    else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      responseText = '👋 **Goodbye!**\n\nThank you for choosing DineEase. We look forward to serving you again!\n\nHave a great day!';
      suggestions = ["Browse menu", "What's your location?", "About us"];
      restaurantInfo = { type: 'goodbye', icon: <Heart className="h-4 w-4" /> };
    }
    else if (message.includes('help') || message.includes('what can you do')) {
      responseText = '🤖 **I\'m your AI dining assistant!**\n\nI can help you with:\n\n🍽️ Menu recommendations (Jain, Vegan, Spicy, etc.)\n📍 Restaurant location & hours\n👨‍🍳 Chef\'s specials & bestsellers\n💰 Budget-friendly options\n📞 Contact information\n\nJust ask me anything!';
      suggestions = ["Show me popular items", "What's your location?", "Chef's special"];
    }
    // Default - show variety
    else {
      const categories = [...new Set(menuItems.map(item => item.category))];
      recommendations = categories.slice(0, 3).map(category =>
        menuItems.find(item => item.category === category)
      ).filter(Boolean);
      responseText = '✨ Here are some recommendations from different categories:';
      suggestions = ["Show me popular items", "Vegetarian options", "What's your location?"];
    }

    return { recommendations, responseText, suggestions, restaurantInfo };
  };

  // Enhanced quick action suggestions
  const quickActions = [
    { icon: <ChefHat className="h-4 w-4" />, text: "Popular items", query: "Show me popular items" },
    { icon: <MapPin className="h-4 w-4" />, text: "Location", query: "What's your location?" },
    { icon: <Sparkles className="h-4 w-4" />, text: "Vegetarian", query: "vegetarian options" },
    { icon: <Info className="h-4 w-4" />, text: "About us", query: "Tell me about DineEase" },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const { recommendations, responseText, suggestions, restaurantInfo } = getResponse(currentInput);

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: responseText,
        recommendations: recommendations,
        suggestions: suggestions,
        restaurantInfo: restaurantInfo,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickAction = (query) => {
    setInputMessage(query);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleSuggestionClick = (suggestion) => {
    // Immediately add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: suggestion,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Get AI response
    setTimeout(() => {
      const { recommendations, responseText, suggestions: newSuggestions, restaurantInfo } = getResponse(suggestion);

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: responseText,
        recommendations: recommendations,
        suggestions: newSuggestions,
        restaurantInfo: restaurantInfo,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleAddToCart = (item) => {
    onAddToCart(item);

    // Update conversation context
    setConversationContext(prev => ({
      ...prev,
      itemsAdded: [...prev.itemsAdded, item.name]
    }));

    // Smart follow-up based on what was added
    let followUpSuggestions = [];
    const category = item.category?.toLowerCase();

    if (category?.includes('pizza') || category?.includes('burger')) {
      followUpSuggestions = ["Show me drinks", "Any desserts?", "That's all"];
    } else if (category?.includes('drink') || category?.includes('beverage')) {
      followUpSuggestions = ["Show me desserts", "Main course", "That's all"];
    } else if (category?.includes('dessert')) {
      followUpSuggestions = ["Show me drinks", "Anything else?", "That's all"];
    } else {
      followUpSuggestions = ["Show me drinks", "Desserts", "That's all"];
    }

    const confirmMessage = {
      id: messages.length + 1,
      type: 'bot',
      text: `✅ Excellent choice! **${item.name}** has been added to your cart for ₹${item.price}.\n\nWould you like to add anything else?`,
      suggestions: followUpSuggestions,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full h-16 w-16 shadow-2xl bg-gradient-to-r from-[#123499] to-[#1e4fd6] hover:from-[#0f2a7a] hover:to-[#123499] relative overflow-hidden group"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="h-7 w-7" />
              </motion.div>
              <motion.div
                className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-50 w-[380px] md:w-[420px]"
          >
            <Card className="shadow-2xl border-2 border-[#123499]/20 overflow-hidden">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-[#123499] to-[#1e4fd6] text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Bot className="h-6 w-6" />
                      </div>
                      <motion.div
                        className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">DineEase Assistant</CardTitle>
                      <p className="text-xs text-white/80">Always here to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages Area */}
                <div className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                            ? 'bg-[#123499]'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                            }`}>
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>

                          {/* Message Content */}
                          <div>
                            {/* Only show regular message bubble if no restaurantInfo */}
                            {!message.restaurantInfo && (
                              <div className={`rounded-2xl px-4 py-2 ${message.type === 'user'
                                ? 'bg-[#123499] text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                                }`}>
                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                              </div>
                            )}

                            {/* Recommendations */}
                            {message.recommendations && message.recommendations.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.recommendations.map((item) => (
                                  <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex gap-3">
                                      <img
                                        src={item.photo}
                                        alt={item.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                                        <div className="flex gap-1 mt-1">
                                          <Badge variant="secondary" className="text-xs">
                                            {item.category}
                                          </Badge>
                                          <Badge
                                            variant={item.status === 'Available' ? 'default' : 'destructive'}
                                            className="text-xs"
                                          >
                                            {item.status}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="font-bold text-[#123499]">₹{item.price}</span>
                                          <Button
                                            size="sm"
                                            onClick={() => handleAddToCart(item)}
                                            disabled={item.status !== 'Available'}
                                            className="h-7 text-xs"
                                          >
                                            Add to Cart
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Suggestion Chips */}
                            {message.suggestions && message.suggestions.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="text-xs h-7 rounded-full border-[#123499] text-[#123499] hover:bg-[#123499] hover:text-white transition-colors"
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}

                            {/* Restaurant Info Card */}
                            {message.restaurantInfo && (
                              <div className="mt-3 bg-gradient-to-br from-[#123499]/10 to-[#1e4fd6]/10 border border-[#123499]/20 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 rounded-full bg-[#123499] flex items-center justify-center flex-shrink-0">
                                    {message.restaurantInfo.icon}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                      {message.text}
                                    </p>

                                    {/* View Cart Button for Thank You message */}
                                    {message.restaurantInfo.hasCartButton && onOpenCart && (
                                      <Button
                                        onClick={() => {
                                          onOpenCart();
                                          setIsOpen(false);
                                        }}
                                        className="mt-4 w-full bg-gradient-to-r from-[#123499] to-[#1e4fd6] hover:from-[#0f2a7a] hover:to-[#123499] text-white font-semibold shadow-lg"
                                        size="sm"
                                      >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        View Cart & Place Order
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <p className="text-xs text-gray-400 mt-1 px-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Quick Actions */}
                {messages.length <= 2 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Quick suggestions:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action.query)}
                          className="justify-start gap-2 text-xs h-8"
                        >
                          {action.icon}
                          {action.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything about the menu..."
                      className="flex-1 rounded-full border-gray-300 focus:border-[#123499] focus:ring-[#123499]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      size="icon"
                      className="rounded-full bg-[#123499] hover:bg-[#0f2a7a]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence >
    </>
  );
};

export default MenuChatbot;
