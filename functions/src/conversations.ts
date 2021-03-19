import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const aggregateMembers = functions.firestore
	.document("conversations/{channelId}/members/{userId}")
	.onWrite(async (snapshot, context) => {
		const { channelId, userId } = context.params;

		const docRef = admin.firestore().collection("conversations").doc(channelId);

		return docRef.update({ memberList: admin.firestore.FieldValue.arrayUnion(userId) });
	});

export const removeMembers = functions.firestore
	.document("conversations/{channelId}")
	.onDelete(async (snapshot, context) => {
		const { channelId } = context.params;

		const collectionRef = admin
			.firestore()
			.collection("conversations")
			.doc(channelId)
			.collection("members");

		const collection = await collectionRef.get();

		for (const user of collection.docs) {
			const docRef = admin
				.firestore()
				.collection("users")
				.doc(user.id)
				.collection("channels")
				.doc(channelId);
			await docRef.delete();
		}

		return true;
	});
