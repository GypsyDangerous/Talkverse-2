import * as functions from "firebase-functions";

import * as admin from "firebase-admin";

const account = require("../serviceaccount.json");
admin.initializeApp({ credential: admin.credential.cert(account) });

export * from "./aggregateChannels";
export * from "./aggregateMessages";
export * from "./onSignUp";
export * from "./users";
export * from "./conversations"
export * from "./messaging"
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
