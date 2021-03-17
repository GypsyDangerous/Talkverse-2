import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap, take, tap } from "rxjs/operators";
import { channel } from "utils/types/channel";
import { AuthService } from "./auth.service";
import firebase from "firebase/app";
@Injectable({
	providedIn: "root",
})
export class ChannelService {
	channel$: Observable<channel | undefined>;
	showMembers: boolean;
	constructor(
		private route: ActivatedRoute,
		private auth: AuthService,
		private router: Router,
		private firestore: AngularFirestore
	) {}

	setChannel(channel: Observable<channel | undefined>) {
		this.channel$ = channel;
	}

	async join(inviteCode: string, cancel: () => void) {
		const collectionRef = firebase.firestore().collection("conversations");
		const filteredCollection = collectionRef
			.where("inviteCodes", "array-contains", inviteCode)
			.limit(1);
		const collection = await filteredCollection.get();
		const channel = collection.docs[0];
		this.auth.user$
			.pipe(
				tap(async user => {
					console.log(user);
					await firebase
						.firestore()
						.collection("users")
						.doc(user.id)
						.collection("channels")
						.doc(channel.id)
						.set(channel.data());
					await collectionRef
						.doc(channel.id)
						.collection("members")
						.doc(user.id)
						.set(user);
					return true;
				}),
				take(1)
			)
			.subscribe(() => {
				this.router.navigate(["channel", channel.id]);
				cancel();
			});
	}
}
