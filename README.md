# BaybayinScribe Client

BaybayinScribe is an application for working with the ancient Philippine script called Baybayin. This client application provides a user-friendly interface for interacting with Baybayin.

## Features

- Baybayin character recognition
- Text translation between Latin alphabet and Baybayin script
- User-friendly interface for learning and practicing Baybayin
- Cross-platform support (Web and Mobile)
- Push notifications (Android)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or later

## Installation

### Web Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/baybayinscribe-client.git
   cd baybayinscribe-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Android Development

1. Follow the Web Development steps 1-2 above

2. Install Capacitor CLI if not already installed:
   ```bash
   npm install -g @capacitor/cli
   ```

3. Build the web application:
   ```bash
   npm run build
   ```

4. Sync with Capacitor:
   ```bash
   npx cap sync
   ```

5. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```

6. In Android Studio, click on the "Run" button to build and run the application on an emulator or connected device

## Project Structure

```
baybayinscribe-client/
├── android/               # Android-specific files
├── public/                # Static assets
├── src/                   # Source files
│   ├── components/        # React components
│   ├── pages/             # Next.js pages
│   ├── styles/            # CSS/SCSS files
│   └── utils/             # Utility functions
├── .next/                 # Next.js build output
└── ...                    # Configuration files
```

## Configuration

### Android Configuration

Android-specific configurations can be modified in the following files:
- `android/gradle.properties` - Project-wide Gradle settings
- `android/app/build.gradle` - App-specific build settings
- `android/build.gradle` - Project-level build settings

### Push Notifications

To enable push notifications for Android:

1. Create a Firebase project and download the `google-services.json` file
2. Place the file in the `android/app/` directory
3. The app will automatically configure Firebase if the file is present

## Troubleshooting

### Common Issues

1. **Gradle Sync Failed**
   - Ensure you have the correct JDK version installed
   - Update Gradle to the version specified in `android/gradle/wrapper/gradle-wrapper.properties`

2. **Build Errors**
   - Make sure all dependencies are installed: `npm install`
   - Clear cache: `npm cache clean --force`
   - Rebuild: `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
