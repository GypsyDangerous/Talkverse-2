import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const subscribeToTopic = functions.https.onCall(
	async (data, context) => {
		await admin.messaging().subscribeToTopic(data.token, data.topic)

		return `subscribed to ${data.topic}`
	}
)

export const unsubscribeFromTopic = functions.https.onCall(
	async (data, context) => {
		admin.messaging().unsubscribeFromTopic(data.token, data.topic);

		return `unsubscribed from ${data.topic}`
	}
)