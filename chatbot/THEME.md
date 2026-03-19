# 🎨 Worker-App Theme Applied

## Design System Match

The chatbot now uses the **exact same design system** as the worker-app:

### Color Palette

**Primary (Indigo):**
```
from-indigo-600  #4f46e5
via-indigo-700   #4338ca
to-indigo-800    #3730a3
```

**Backgrounds:**
```
bg-gray-50       #f9fafb (page background)
bg-white         #ffffff (cards)
bg-gray-100      #f3f4f6 (input fields)
```

**Text:**
```
text-gray-900    #111827 (primary)
text-gray-600    #4b5563 (secondary)
text-gray-500    #6b7280 (tertiary)
```

**Accents:**
```
bg-indigo-50     #eef2ff (quick replies)
text-indigo-700  #4338ca (quick reply text)
border-indigo-100 #e0e7ff (borders)
```

### Typography

**Font Family:**
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif
```

**Font Sizes:**
- Header: text-lg (18px), font-bold
- Messages: text-sm (14px)
- Timestamps: text-xs (12px)
- Quick replies: text-xs (12px), font-medium

### Spacing

**Padding:**
- Container: px-4 py-4 (16px)
- Cards: px-4 py-3 (16px 12px)
- Buttons: px-4 py-2 (16px 8px)

**Gaps:**
- Message spacing: space-y-4 (16px)
- Button gaps: gap-2 (8px)

**Rounded Corners:**
- Cards: rounded-2xl (16px)
- Buttons: rounded-xl (12px)
- Chat bubbles: rounded-2xl (16px)
- Input: rounded-2xl (16px)

### Components

#### Header
```jsx
bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800
```
- White logo icon in rounded square
- Title: text-white text-lg font-bold
- Status: green dot + text-indigo-200

#### Chat Bubbles

**User (Right):**
```jsx
bg-gradient-to-br from-indigo-600 to-indigo-700
text-white
rounded-br-md (sharp bottom-right)
```

**Bot (Left):**
```jsx
bg-white
text-gray-900
border border-gray-100
rounded-bl-md (sharp bottom-left)
```

#### Quick Replies
```jsx
bg-indigo-50
text-indigo-700
border border-indigo-100
rounded-xl
hover:bg-indigo-100
```

#### Input Field
```jsx
bg-gray-100
rounded-2xl
focus:ring-2 focus:ring-indigo-600
focus:bg-white
```

#### Send Button
```jsx
bg-gradient-to-br from-indigo-600 to-indigo-700
rounded-2xl
shadow-lg hover:shadow-xl
```

### Animations

**Loading Dots:**
```jsx
animate-bounce
animationDelay: '0ms', '150ms', '300ms'
```

**Splash Screen:**
```jsx
animate-bounce (logo)
bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800
```

### Layout

**Mobile-First:**
- Full width on mobile
- max-w-md (448px) on desktop
- Centered with flex
- h-screen on mobile
- h-[800px] on desktop
- rounded-3xl on desktop only

**Responsive:**
```jsx
<div className="w-full max-w-md h-screen md:h-[800px] md:rounded-3xl">
```

### Shadows

**Cards:**
```jsx
shadow-sm (subtle)
md:shadow-2xl (desktop container)
```

**Buttons:**
```jsx
shadow-lg (default)
hover:shadow-xl (hover)
```

### Borders

**Subtle:**
```jsx
border border-gray-100
```

**Dividers:**
```jsx
border-t border-gray-100
```

## Consistency with Worker-App

✅ **Same color scheme** - Indigo gradients
✅ **Same spacing** - 4px base unit
✅ **Same typography** - System fonts
✅ **Same rounded corners** - 2xl standard
✅ **Same shadows** - Subtle elevation
✅ **Same animations** - Bounce, fade
✅ **Same mobile-first** - Responsive breakpoints

## Tailwind Classes Used

**Most Common:**
- `bg-gradient-to-br from-indigo-600 to-indigo-700`
- `rounded-2xl`
- `px-4 py-3`
- `text-sm`
- `shadow-sm`
- `border border-gray-100`
- `hover:bg-indigo-100`
- `focus:ring-2 focus:ring-indigo-600`
- `animate-bounce`
- `transition`

## No Custom CSS

Everything uses **Tailwind utility classes** - no custom CSS files needed!
