const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "astronomia-c2f5d",
    private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
    private_key: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIRESTORE_CLIENT_EMAIL,
    client_id: "104413135440882877790",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CERT,
  }),
});

const db = admin.firestore();

module.exports = { db };
