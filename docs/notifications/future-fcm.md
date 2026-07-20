# Future FCM Production Guide

Steps to translate FCM mock indicators to live production streams:

1. Create a Firebase Project on Google Cloud Console.
2. Initialize FCM client SDK in `index.html` with correct credential config.
3. Hook browser `service-worker.js` to catch incoming push notifications while in background.
4. Set up an authentication API endpoint to save the generated browser `RegistrationToken` to the Firestore user profile.
5. Trigger pushes from Cloud Run containers using `firebase-admin` Node.js SDK.
