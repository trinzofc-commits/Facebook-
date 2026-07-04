# Facebook Clone Android - Design Specification

## Overview

This is a mobile social networking app that replicates Facebook's core functionality, design language, and user experience. The app follows iOS/Android design standards with Facebook's distinctive blue color scheme and modern UI patterns.

## Screen List

| Screen | Purpose | Key Components |
|--------|---------|-----------------|
| **Auth/Login** | User authentication | Email/password input, login button, sign-up link |
| **Auth/Register** | Account creation | Name, email, password, birthday, gender, register button |
| **Auth/Forgot Password** | Password recovery | Email input, reset link button |
| **Home/News Feed** | Main content stream | Posts, stories carousel, compose button, reactions, comments |
| **Stories** | Full-screen story viewer | Story image/video, progress bar, user info, navigation |
| **Post Detail** | Expanded post view | Full post content, all comments, reply functionality |
| **Create Post** | Compose new content | Text input, image/video picker, background colors, post button |
| **Profile** | User profile page | Cover photo, avatar, bio, post list, friend count, edit button |
| **Profile Edit** | Edit user information | Name, bio, avatar, cover photo, save button |
| **Friends** | Friends list/management | Friend list, add friend button, friend requests |
| **Messages** | Chat inbox | Conversation list, unread indicators, delete option |
| **Chat** | Individual conversation | Message history, input field, send button, typing indicator |
| **Notifications** | Activity feed | Likes, comments, friend requests, message previews |
| **Groups** | Communities | Group list, group details, member list, post feed |
| **Marketplace** | Buy/sell items | Item listings, search, filters, item detail, messaging |
| **Watch** | Video content | Video feed, recommendations, full-screen playback |
| **Menu** | Additional options | Settings, help, logout, theme toggle |

## Primary Content and Functionality

### News Feed (Home Screen)
- **Stories Carousel**: Horizontal scrollable list at the top with user story previews
- **Compose Button**: "What's on your mind?" input to create new posts
- **Post Cards**: Display user posts with:
  - User avatar, name, timestamp
  - Post text content
  - Images/videos (grid layout for multiple)
  - Reaction buttons (Like, Love, Haha, Wow, Sad, Angry)
  - Comment count, share count
  - Expandable comments section
- **Pull-to-refresh**: Reload feed from top
- **Infinite scroll**: Load more posts when reaching bottom

### Post Creation
- Text input field with character counter
- Image/video picker from gallery or camera
- Background color selector for text-only posts
- Tag friends functionality
- Post visibility selector (Public, Friends, Private)
- Share button

### Profile Screen
- Cover photo (editable)
- User avatar (editable)
- User name and bio
- Friend count, follower count
- Post history (tab view)
- Photo gallery (tab view)
- Edit profile button

### Messages
- Conversation list with last message preview
- Unread message indicator (blue dot)
- User search to start new conversation
- Message history with timestamps
- Text input with send button
- Typing indicator when other user is typing

### Notifications
- Activity feed showing:
  - Friend requests
  - Likes on posts
  - Comments on posts
  - New messages
  - Group invitations
- Mark as read functionality
- Delete notification option

## Key User Flows

### Flow 1: Create and Share a Post
1. User taps "What's on your mind?" on News Feed
2. Create Post screen opens
3. User enters text and optionally adds image
4. User selects visibility (Public/Friends/Private)
5. User taps "Post" button
6. Post appears at top of News Feed
7. Other users can like, comment, and share

### Flow 2: View and Interact with Feed
1. User opens app → News Feed displays
2. User scrolls through posts
3. User taps Like button → reaction menu appears
4. User selects reaction (Like, Love, etc.)
5. Reaction count updates
6. User taps comment icon → Comment section expands
7. User enters comment and sends
8. Comment appears in thread

### Flow 3: Send a Message
1. User taps Messages tab
2. User taps "+" or searches for friend
3. Chat screen opens
4. User types message in input field
5. User taps send button
6. Message appears in conversation
7. Typing indicator shows when recipient is typing

### Flow 4: View Profile
1. User taps profile tab or clicks on user name
2. Profile screen displays with cover photo, avatar, bio
3. User can view posts, photos, friends
4. User can edit own profile or add/remove friend
5. User can message the profile owner

### Flow 5: Manage Notifications
1. User taps Notifications tab
2. Notification list displays (friend requests, likes, comments)
3. User can tap notification to view related content
4. User can mark as read or delete notification

## Color Choices

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Primary Blue | Facebook Blue | `#1877F2` | Buttons, links, active states, accents |
| Background (Light) | White | `#FFFFFF` | Screen background (light mode) |
| Background (Dark) | Very Dark Gray | `#18191A` | Screen background (dark mode) |
| Surface (Light) | Light Gray | `#F0F2F5` | Cards, sections (light mode) |
| Surface (Dark) | Dark Gray | `#242526` | Cards, sections (dark mode) |
| Text Primary (Light) | Dark Gray | `#050505` | Main text (light mode) |
| Text Primary (Dark) | Light Gray | `#E4E6EB` | Main text (dark mode) |
| Text Secondary (Light) | Medium Gray | `#65676B` | Secondary text (light mode) |
| Text Secondary (Dark) | Light Medium Gray | `#B0B3B8` | Secondary text (dark mode) |
| Border (Light) | Light Border | `#CED0D4` | Dividers, borders (light mode) |
| Border (Dark) | Dark Border | `#3E4042` | Dividers, borders (dark mode) |
| Success | Green | `#31A24C` | Success messages, checkmarks |
| Warning | Orange | `#F59E0B` | Warning messages |
| Error | Red | `#DC2626` | Error messages, delete actions |
| Story Ring | Gradient | Pink→Orange→Blue | Story indicators for unseen stories |

## Typography

- **Font Family**: System fonts (SF Pro Display on iOS, Roboto on Android)
- **Header (H1)**: 28px, bold, primary text color
- **Header (H2)**: 24px, bold, primary text color
- **Header (H3)**: 20px, semibold, primary text color
- **Body**: 16px, regular, primary text color
- **Small**: 14px, regular, secondary text color
- **Tiny**: 12px, regular, secondary text color

## Navigation Structure

- **Bottom Tab Bar** (Android style):
  - Home (house icon)
  - Video/Watch (play icon)
  - Marketplace (shopping bag icon)
  - Profile (person icon)
  - Menu (three dots icon)

- **Nested Navigation**:
  - Home → News Feed, Stories, Create Post
  - Messages → Conversation List, Chat
  - Notifications → Notification List
  - Profile → User Profile, Edit Profile, Friends
  - Menu → Settings, Groups, Marketplace, Watch, Logout

## Animation & Interactions

- **Transitions**: Smooth fade-in/fade-out (200-300ms)
- **Button Press**: Scale down to 0.97 with haptic feedback
- **Pull-to-refresh**: Spinner animation
- **Story Progress**: Linear progress bar at top
- **Reaction Picker**: Popup animation from reaction button
- **Typing Indicator**: Bouncing dots animation
