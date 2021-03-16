import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

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
	constructor(
		public dialogRef: MatDialogRef<NewChannelData>,
		@Inject(MAT_DIALOG_DATA) public data: NewChannelData
	) {}

	ngOnInit(): void {}
}
