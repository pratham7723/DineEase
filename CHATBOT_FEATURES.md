# 🤖 AI Menu Chatbot Feature

## Overview
An intelligent chatbot assistant has been added to the Customer Menu page to help customers discover and order menu items through natural conversation.

## 🎯 Features

### 1. **Smart Recommendations**
The chatbot provides intelligent menu recommendations based on:
- **Dietary Preferences**: Vegetarian, vegan options
- **Budget**: Affordable vs premium items
- **Categories**: Pizza, burgers, beverages, desserts, etc.
- **Preferences**: Spicy, quick bites, popular items
- **Special Requests**: Trending items, chef's specials

### 2. **Natural Language Understanding**
Customers can ask questions like:
- "What's popular?"
- "Show me vegetarian options"
- "I want something cheap"
- "What desserts do you have?"
- "I'm in the mood for pizza"
- "Show me your premium items"
- "I want something spicy"
- "Quick bites please"

### 3. **Interactive Features**
- ✅ **Quick Action Buttons**: Pre-defined queries for common requests
- ✅ **Visual Recommendations**: Shows item images, prices, and categories
- ✅ **One-Click Add to Cart**: Add recommended items directly from chat
- ✅ **Real-time Availability**: Only shows available items
- ✅ **Typing Indicators**: Shows when bot is "thinking"
- ✅ **Smooth Animations**: Beautiful transitions and effects

### 4. **Beautiful UI/UX**
- 🎨 Gradient backgrounds with brand colors (#123499)
- 💬 Chat bubbles with user/bot avatars
- 🌟 Animated floating button with notification pulse
- 📱 Fully responsive design
- ⚡ Smooth animations using Framer Motion

## 🎨 Design Elements

### Color Scheme
- **Primary**: Navy Blue (#123499)
- **Gradient**: From #123499 to #1e4fd6
- **Bot Avatar**: Purple to Pink gradient
- **User Avatar**: Navy Blue

### Animations
- Floating button with rotation animation
- Pulsing notification dot
- Smooth slide-in chat window
- Typing indicator with bouncing dots
- Fade-in message animations

## 💡 How It Works

### 1. **Recommendation Engine**
The chatbot analyzes user messages and matches them against:
- Menu item names
- Categories
- Price ranges
- Availability status

### 2. **Smart Filtering**
```javascript
// Example: Budget-based filtering
if (message.includes('cheap') || message.includes('budget')) {
  recommendations = menuItems
    .filter(item => item.price < 200)
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
}
```

### 3. **Context Awareness**
- Remembers conversation history
- Provides relevant follow-up suggestions
- Confirms when items are added to cart

## 🚀 Usage

### For Customers
1. Click the floating chat button (bottom-right corner)
2. Type your question or use quick action buttons
3. Browse recommendations
4. Click "Add to Cart" on any recommended item
5. Continue shopping or place order

### For Developers
```jsx
import MenuChatbot from '@/components/MenuChatbot';

// In your component
<MenuChatbot 
  menuItems={menuItems} 
  onAddToCart={addToCart} 
/>
```

## 🎯 Supported Queries

| Query Type | Example Keywords | Response |
|------------|-----------------|----------|
| Dietary | "veg", "vegetarian" | Vegetarian items |
| Budget | "cheap", "budget", "affordable" | Items under ₹200 |
| Premium | "expensive", "premium", "special" | Items over ₹300 |
| Category | "pizza", "burger", "drink" | Category-specific items |
| Popular | "popular", "trending", "best" | Top menu items |
| Spicy | "spicy", "hot" | Spicy options |
| Quick | "quick", "fast" | Quick bites |

## 🔧 Technical Details

### Dependencies
- **framer-motion**: For animations (already installed)
- **lucide-react**: For icons (already installed)
- **shadcn/ui**: For UI components (already installed)

### File Location
- Component: `/client/src/components/MenuChatbot.jsx`
- Integration: `/client/src/pages/CustomerMenu.jsx`

### Props
```typescript
interface MenuChatbotProps {
  menuItems: MenuItem[];      // Array of menu items
  onAddToCart: (item) => void; // Callback to add item to cart
}
```

## 🎨 Customization

### Modify Recommendation Logic
Edit the `getRecommendations()` function in `MenuChatbot.jsx`:
```javascript
const getRecommendations = (userMessage) => {
  // Add your custom logic here
};
```

### Change Quick Actions
Modify the `quickActions` array:
```javascript
const quickActions = [
  { icon: <Icon />, text: "Label", query: "search query" },
  // Add more...
];
```

### Adjust Styling
All styles use Tailwind CSS and can be customized:
- Button colors: `bg-[#123499]`
- Gradients: `from-[#123499] to-[#1e4fd6]`
- Animations: Framer Motion variants

## 📊 Future Enhancements

Potential improvements:
- [ ] Integration with real AI (OpenAI, Gemini)
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Order history context
- [ ] Personalized recommendations based on past orders
- [ ] Nutritional information queries
- [ ] Allergen warnings
- [ ] Combo meal suggestions

## 🐛 Troubleshooting

### Chatbot not appearing
- Check if MenuChatbot is imported correctly
- Verify menuItems prop is passed
- Check browser console for errors

### Recommendations not working
- Ensure menuItems array has proper structure
- Check category and name fields exist
- Verify price field is a number

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check if framer-motion is installed
- Verify all shadcn/ui components are available

## 📝 Notes

- The chatbot uses client-side logic (no backend AI required)
- Recommendations are based on keyword matching
- Can be easily extended to use real AI APIs
- Fully accessible and keyboard-navigable
- Works on all screen sizes (mobile, tablet, desktop)

---

**Created**: December 24, 2024
**Version**: 1.0.0
**Status**: ✅ Active and Working
