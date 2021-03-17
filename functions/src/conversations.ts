import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const aggregateMembers = functions.firestore
	.document("conversations/${channelId}/members/{userId}")
	.onWrite(async (snapshot, context) => {
		const { channelId, userId } = context.params;

		const docRef = admin.firestore().collection("conversations").doc(channelId);

		return docRef.update({ memberList: admin.firestore.FieldValue.arrayUnion(userId) });
	});
