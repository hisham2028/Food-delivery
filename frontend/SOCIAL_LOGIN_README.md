# Social Login Integration Setup Guide

## 🚀 Overview

This food delivery app now includes Google and Facebook social login integration using Firebase Authentication. Users can sign up or log in using their existing social media accounts, providing a seamless authentication experience.

## 📋 Prerequisites

1. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. **Google/Facebook Apps**: Configure OAuth applications for social login

## 🔧 Firebase Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Authentication in your Firebase project

### Step 2: Enable Authentication Providers

#### For Google:
1. In Firebase Console, go to Authentication → Sign-in method
2. Enable "Google" provider
3. Configure OAuth consent screen if prompted
4. Add your domain to authorized domains

#### For Facebook:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add "Facebook Login" product
4. Get your App ID and App Secret
5. In Firebase Console, enable Facebook provider
6. Enter your Facebook App ID and Secret

### Step 3: Environment Variables

Create a `.env` file in your frontend root directory:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env
```

Fill in your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

## 🛠️ Backend Integration

The frontend sends social login data to your backend endpoint `/api/user/social-login`. Your backend should:

1. **Receive social login data**:
   ```javascript
   {
     name: "User Name",
     email: "user@example.com",
     firebaseUid: "firebase-user-id",
     provider: "google" | "facebook",
     photoURL: "profile-photo-url"
   }
   ```

2. **Handle user registration/login**:
   - Check if user exists by `firebaseUid` or `email`
   - Create new user if doesn't exist
   - Return JWT token for authentication

3. **Sample backend response**:
   ```javascript
   {
     success: true,
     token: "jwt-token-here",
     user: {
       id: "user-id",
       name: "User Name",
       email: "user@example.com"
     }
   }
   ```

## 🎨 Features

### ✅ Implemented Features
- **Google Sign-In**: One-click login with Google account
- **Facebook Sign-In**: One-click login with Facebook account
- **Loading States**: Visual feedback during authentication
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on all screen sizes
- **Professional UI**: Matches your app's design system

### 🎯 User Experience
- **Seamless Flow**: Social login buttons appear between email/password and terms
- **Visual Feedback**: Loading states and success/error toasts
- **Fallback Support**: Traditional email/password login still available
- **Mobile Optimized**: Touch-friendly buttons with proper spacing

## 📱 UI Components

### Social Login Section
```
┌─────────────────────────────────────┐
│          Email/Password Login       │
├─────────────────────────────────────┤
│          or continue with           │
├─────────────────────────────────────┤
│  [🔍] Continue with Google         │
│  [📘] Continue with Facebook       │
├─────────────────────────────────────┤
│          Terms & Conditions         │
└─────────────────────────────────────┘
```

## 🔐 Security Features

- **Firebase Authentication**: Enterprise-grade security
- **OAuth 2.0**: Industry-standard authentication protocol
- **JWT Tokens**: Secure token-based authentication
- **HTTPS Required**: All social logins require secure connections

## 🐛 Troubleshooting

### Common Issues:

1. **"Auth domain not authorized"**
   - Add your domain to Firebase authorized domains
   - Check Firebase Console → Authentication → Settings

2. **"Invalid OAuth client"**
   - Verify Google/Facebook app configurations
   - Check API keys and secrets

3. **Backend errors**
   - Ensure `/api/user/social-login` endpoint exists
   - Check backend logs for authentication errors

## 🚀 Deployment

### Production Setup:
1. **Update Firebase config** for production project
2. **Configure authorized domains** for your production URL
3. **Update environment variables** on your hosting platform
4. **Enable CORS** on your backend for social login endpoints

### Environment Variables for Production:
```env
# Production Firebase Config
VITE_FIREBASE_API_KEY=prod-api-key
VITE_FIREBASE_AUTH_DOMAIN=yourapp.com
VITE_FIREBASE_PROJECT_ID=your-prod-project
VITE_FIREBASE_STORAGE_BUCKET=your-prod-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

## 📈 Analytics & Monitoring

Monitor social login usage through:
- **Firebase Analytics**: Track sign-in methods
- **Backend logs**: Monitor authentication success/failure
- **User behavior**: Track conversion from social to regular users

## 🔄 Future Enhancements

- **Apple Sign-In**: For iOS users
- **Phone Authentication**: SMS-based verification
- **Social Account Linking**: Connect multiple social accounts
- **Advanced Profile Sync**: Sync profile data from social platforms

## 📞 Support

For issues with social login setup:
1. Check Firebase Console authentication settings
2. Verify OAuth app configurations
3. Review browser console for JavaScript errors
4. Check backend API endpoints and responses

---

## 🎉 Ready to Use!

Your food delivery app now supports Google and Facebook login! Users can enjoy a seamless authentication experience while you benefit from higher conversion rates and reduced friction in the signup process.
