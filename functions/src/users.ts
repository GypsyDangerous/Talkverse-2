import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import fetch from "node-fetch";

const functionRef = functions.firestore.document("users/{userId}");

export const downloadAvatar = functionRef.onWrite(async (snapshot, context) => {
	const { userId } = context.params;

	const before = snapshot.before.data();
	const after = snapshot.after.data();
	functions.logger;
	if (before?.avatar === after?.avatar) return functions.logger.debug("no change in avatar");

	const newAvatar = after?.avatar;

	const bucket = admin.storage().bucket("talkverse2.appspot.com");

	const result = await fetch(newAvatar);

	const contentType = result.headers.get("content_type");

	let fileType = ".png";
	let mimeType = "image/png";
	if (contentType) {
		mimeType = contentType;
		fileType = `.${contentType.split("/")[1]}`;
	}

	const fileName = `${userId}${fileType}`;

	const imageBucket = "avatars/";

	const destination = `${imageBucket}${fileName}`;

	const file = bucket.file(destination);

	await file.save(await result.buffer(), { contentType: mimeType });

	const signedUrls = await file.getSignedUrl({
		action: "read",
		expires: "03-09-2491",
	});

	admin.firestore().collection("users").doc(userId).update({ avatar: signedUrls[0] });
});

export const updateMember = functionRef.onWrite(async (snapshot, context) => {
	const { userId } = context.params;

	const channelsRef = admin
		.firestore()
		.collection("conversations")
		.where("memberList", "array-contains", userId);

	const channels = (await channelsRef.get()).docs.map(doc => doc.id);

	const batch = admin.firestore().batch();

	const userData = snapshot.after.data();
	for (const channelId of channels) {
		const channelRef = admin
			.firestore()
			.collection("conversations")
			.doc(channelId)
			.collection("members")
			.doc(userId);
		batch.set(channelRef, userData);
	}

	return await batch.commit()
});
