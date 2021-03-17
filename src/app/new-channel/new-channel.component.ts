import { Component, Inject, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import { take, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

export interface NewChannelData {
	name: string;
	description: string;
	inviteCode?: string;
}

@Component({
	selector: "app-new-channel",
	templateUrl: "./new-channel.component.html",
	styleUrls: ["./new-channel.component.scss"],
})
export class NewChannelComponent implements OnInit {
	joinError: string = "";

	constructor(
		public dialogRef: MatDialogRef<NewChannelData>,
		@Inject(MAT_DIALOG_DATA) public data: NewChannelData,
		private firestore: AngularFirestore,
		private auth: AuthService,
		private router: Router
	) {}

	ngOnInit(): void {}

	cancel() {
		this.dialogRef.close(null);
	}

	async join() {
		const collectionRef = firebase.firestore().collection("conversations");
		const filteredCollection = collectionRef
			.where("inviteCodes", "array-contains", this.data.inviteCode)
			.limit(1);
		const collection = await filteredCollection.get();
		const channel = collection.docs[0];
		console.log({channel});
		this.auth.user$
			.pipe(
				tap(async user => {
					console.log(user)
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
				this.cancel();
			});
	}
}
