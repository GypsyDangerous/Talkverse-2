import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const createUserDoc = functions.auth.user().onCreate(async user => {
	return await admin
		.firestore()
		.collection("users")
		.doc(user.uid)
		.set(
			{
				username: user.displayName,
				photoURL: user.photoURL ?? "/avatar.png",
				email: user.email,
				displayName: user.displayName,
				status: "",
				channels: [],
			},
			{ merge: true }
		);
});
