# MelodyMarket - Expo React Native

A revolutionary music marketplace where artists can share their music and fans can discover and support their favorite musicians. This is the Expo React Native recreation of the original Flutter application.

## Features

### For Music Lovers
- 🎵 Discover new music from talented artists
- 💰 Purchase albums and individual tracks
- 📱 Stream music with built-in audio player
- 📚 Personal music library with offline downloads
- 🎨 Beautiful, modern UI with dark/light theme support

### For Artists
- 🎤 Upload and sell your music
- 💸 Set pricing for albums and tracks
- 📊 Track your earnings and analytics
- 👥 Build your fanbase
- 🎯 Manage your artist profile

## Tech Stack

- **Framework**: Expo SDK 52
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **Audio**: Expo AV
- **Storage**: AsyncStorage
- **UI**: React Native with custom components
- **Styling**: StyleSheet with dynamic theming

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd melodymarket
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your device

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AlbumCard.tsx   # Album display component
│   └── BottomNavBar.tsx # Navigation component
├── constants/          # App constants
│   └── Colors.ts       # Color scheme definitions
├── screens/            # Screen components
│   ├── HomeScreen.tsx  # Music discovery
│   ├── LibraryScreen.tsx # User's music collection
│   ├── ArtistUploadScreen.tsx # Artist upload interface
│   ├── ProfileScreen.tsx # User profile and settings
│   └── SplashScreen.tsx # App loading screen
├── services/           # Business logic and data
│   ├── StorageService.ts # Local data management
│   └── AudioService.ts # Audio playback management
└── types/              # TypeScript type definitions
    └── index.ts        # Shared interfaces and types
```

## Key Features Implementation

### Audio Playback
- Uses Expo AV for audio streaming
- Supports preview playback (1-minute samples)
- Full track playback for purchased music
- Background audio support

### Data Management
- AsyncStorage for local data persistence
- Sample data generation for demo purposes
- User preferences and purchase history
- Album and track metadata storage

### User Interface
- Dynamic theming (light/dark mode)
- Responsive design for various screen sizes
- Smooth animations and transitions
- Material Design inspired components

### Artist Features
- Album creation and upload workflow
- Track management
- Pricing configuration
- Artist profile management

## Sample Data

The app comes with pre-populated sample data including:
- 5 sample albums across different genres
- Multiple tracks per album
- Sample artist profiles
- Mock purchase history for demonstration

## Customization

### Adding New Genres
Edit the `genres` array in relevant screens:
```typescript
const genres = ['Pop', 'Rock', 'Jazz', 'Electronic', 'Hip Hop', 'R&B'];
```

### Modifying Color Scheme
Update `src/constants/Colors.ts`:
```typescript
export const Colors = {
  light: {
    primary: '#6366F1',
    // ... other colors
  },
  dark: {
    primary: '#818CF8',
    // ... other colors
  },
};
```

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add navigation route in `src/components/BottomNavBar.tsx`
3. Update TypeScript types if needed

## Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Flutter implementation inspiration
- Expo team for the excellent development platform
- React Navigation for seamless navigation
- All the amazing artists who inspire music apps like this

---

**Note**: This is a demo application. For production use, you would need to implement:
- Real backend API integration
- Actual payment processing
- Real audio file storage and streaming
- User authentication system
- Content moderation
- Analytics and reporting