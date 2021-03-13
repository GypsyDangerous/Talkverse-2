import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const messagesDocFunctionRef = functions.firestore.document(
	"conversations/{conversationId}/messages/{messageId}"
);

export const aggregateMessagesCreate = messagesDocFunctionRef.onCreate(
	async (snapshot, context) => {
		const { conversationId, messageId } = context.params;

		const docRef = admin.firestore().collection("conversations").doc(conversationId);

		const message = snapshot.data();
		return await docRef.update({
			last_message: message,
			message_count: admin.firestore.FieldValue.increment(1),
		});
	}
);

export const aggregateMessagesDelete = messagesDocFunctionRef.onDelete(
	async (snapshot, context) => {
		const { conversationId, messageId } = context.params;

		const docRef = admin.firestore().collection("conversations").doc(conversationId);

		const messagesRef = docRef.collection("messages");
		const lastMessageRef = messagesRef.orderBy("created_at", "asc").limit(1);

		const lastMessage = (await lastMessageRef.get()).docs[0]?.data?.();

		return await docRef.update({
			last_message: lastMessage || null,
			message_count: admin.firestore.FieldValue.increment(-1),
		});
	}
);
