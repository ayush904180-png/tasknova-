# Future Cloud Functions Integration

Steps to convert automated rule mock evaluations into full Google Cloud Functions:

1. Create a `functions` folder containing triggers matching Pub/Sub events.
2. Deploy endpoints using Google Cloud SDK: `gcloud functions deploy ...`
3. Link Pub/Sub topic triggers to automatically fire Cloud Functions.
4. Call cloud functions from the React UI using HTTPS callable adapters:
   ```ts
   import { getFunctions, httpsCallable } from 'firebase/functions';
   const sendAlert = httpsCallable(getFunctions(), 'dispatchEmailAlert');
   await sendAlert({ email: 'test@example.com', body: '...' });
   ```
