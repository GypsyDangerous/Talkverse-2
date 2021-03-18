import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const sendMessage = functions.firestore
	.document("conversations/{channelId}/messages/{messageId}")
	.onCreate(async (snapshot, context) => {
		const { channelId, messageId } = context.params;
		const message = snapshot.data();

		const channelRef = admin.firestore().collection("conversations").doc(channelId);

		const channel = await channelRef.get();
		const channelData = channel.data();

		const notification: admin.messaging.Notification = {
			title: `New Message in ${channelData?.name}`,
			body: message.parsed_text,
		};

		const payload: admin.messaging.Message = {
			notification,
			topic: channelId,
			webpush: {
				notification: {
					vibrate: [200, 100, 200],
					url:
						"https://media.discordapp.net/attachments/727356806552092675/822250956997525584/flatgalaxy-1320109748393704983_512.png",
				},
			},
		};

		admin.messaging().send(payload);
	});
