import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import fetch from "node-fetch";

export const createUserDoc = functions.auth.user().onCreate(async user => {
	const userDoc: any = {
		photoURL: user.photoURL ?? "/avatar.png",
		email: user.email,
		status: "",
		channels: [],
	};

	if (user.displayName) {
		userDoc.username = user.displayName;
		userDoc.displayName = user.displayName;
	}

	return await admin.firestore().collection("users").doc(user.uid).set(userDoc, { merge: true });
});
