import { Component, Inject, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import { take, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { ChannelService } from "../services/channel.service";

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
		private router: Router,
		private channelManager: ChannelService
	) {}

	ngOnInit(): void {}

	cancel() {
		this.dialogRef.close(null);
	}

	async join() {
		this.channelManager.join(this.data.inviteCode!, this.cancel);
	}
}
