import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireFunctions } from "@angular/fire/functions";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { tap } from "rxjs/operators";

// import app from "firebase";

@Injectable({
	providedIn: "root",
})
export class MessagingService {
	token: string | null;
	constructor(private messaging: AngularFireMessaging, private functions: AngularFireFunctions) {
		// const _messaging = app.messaging();
		// _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
		// _messaging.onMessage = _messaging.onMessage.bind(_messaging);
	}

	getPermission() {
		console.log("getting permission");
		return this.messaging.requestToken.pipe(
			tap(token => {
				console.log({ token });
				this.token = token;
			})
		);
	}

	sub(topic: string) {
		this.functions.httpsCallable("subscribeToTopic")({ topic, token: this.token });
	}

	unsub(topic: string) {
		this.functions.httpsCallable("unsubscribeFromTopic")({ topic, token: this.token });
	}
}
