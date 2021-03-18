import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { uid } from "uid";

export const aggregateChannelsCreate = functions.firestore
	.document("conversations/{channelId}/members/{memberId}")
	.onCreate(async (snapshot, context) => {
		const { channelId, memberId } = context.params;

		const docRef = admin.firestore().collection("users").doc(memberId);

		return await docRef.set(
			{ channels: admin.firestore.FieldValue.arrayUnion(channelId) },
			{ merge: true }
		);
	});

export const aggregateChannelsDelete = functions.firestore
	.document("conversations/{channelId}/members/{memberId}")
	.onDelete(async (snapshot, context) => {
		const { channelId, memberId } = context.params;

		const docRef = admin.firestore().collection("users").doc(memberId);

		return await docRef.set(
			{ channels: admin.firestore.FieldValue.arrayRemove(channelId) },
			{ merge: true }
		);
	});

export const generateInviteCodes = functions.firestore
	.document("conversations/{channelId}")
	.onCreate((snapshot, context) => {
		const { channelId } = context.params;

		const docRef = admin.firestore().collection("conversations").doc(channelId);

		const inviteCodes = [...Array(10)].map(() => uid());
		functions.logger.debug(inviteCodes)

		return docRef.update({inviteCodes})
	});
