import { Component, Inject, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NewChannelData } from "../new-channel/new-channel.component";
import { AuthService } from "../services/auth.service";
import { ChannelService } from "../services/channel.service";
import firebase from "firebase/app"
import { take } from "rxjs/operators";
export interface UserProfileData {
	username: string;
	avatar: string;
}

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
	fileToUpload: File | null;
	uploadTask: firebase.storage.UploadTask
	basePath: string = "/uploads"

	constructor(
		public dialogRef: MatDialogRef<UserProfileData>,
		@Inject(MAT_DIALOG_DATA) public data: UserProfileData,
		private firestore: AngularFirestore,
		private auth: AuthService,
		private router: Router,
		private channelManager: ChannelService
	) {}

	cancel(){
		this.dialogRef.close()
	}

	ngOnInit(): void {}

	openFile() {
		document.getElementById("pfp-selector")?.click();
	}

	handleFileInput(event: any) {
		const files = event.target.files;
		if (!files) return;
		this.fileToUpload = files.item(0);

		const reader = new FileReader();

		reader.readAsDataURL(this.fileToUpload as Blob);

		reader.addEventListener("load", async _event => {
			this.data.avatar = reader.result as string;
			const storageRef = firebase.storage().ref()

			this.auth.user$.pipe(take(1)).subscribe(user => {
				this.uploadTask = storageRef.child(`${this.basePath}/${user.id}`).put(this.fileToUpload as Blob)

				this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, null, null, async () => {

					this.data.avatar = await this.uploadTask.snapshot.ref.getDownloadURL()
				})
				
			})
		});
	}
}
