import { Component, OnInit } from "@angular/core";
import { fromEvent, merge, Observable, of, Subject } from "rxjs";
import {
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	switchMap,
	take,
	takeLast,
	tap,
} from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { channel } from "utils/types/channel";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app";
import { ChannelService } from "src/app/services/channel.service";
import { user } from "utils/types/user";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NewChannelComponent } from "src/app/new-channel/new-channel.component";
@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
	channels$: Observable<undefined | channel[]>;
	channels: channel[] = [];
	popUpOpen: boolean = false;
	searchText: string = "";
	members$: Observable<user[] | undefined>;

	constructor(
		public auth: AuthService,
		private firestore: AngularFirestore,
		public channel: ChannelService,
		public dialog: MatDialog
	) {
		this.channels$ = this.auth.user$.pipe(
			map(user => user.channels),
			switchMap(async channels => {
				let allChannels = [];
				for (const channelId of channels) {
					const docRef = firebase.firestore().collection("conversations").doc(channelId);
					const doc = await docRef.get();
					const data = { id: doc.id, ...doc.data() } as channel;
					allChannels.push(data);
				}
				return allChannels;
			})
		);
	}

	closePopup() {
		this.popUpOpen = false;
	}

	togglePopup() {
		this.popUpOpen = !this.popUpOpen;
		setTimeout(() => {
			document.getElementById("user-popup")?.focus();
		}, 300);
	}

	ngOnInit(): void {
		this.channels$.subscribe(c => (this.channels = c || []));
		this.channel.channel$.subscribe(console.log);

		this.members$ = this.channel.channel$.pipe(
			switchMap(channel => {
				return this.firestore
					.collection("conversations")
					.doc(channel?.id)
					.collection<user>("members", ref => ref.orderBy("username", "asc"))
					.valueChanges();
			})
		);
	}

	search(event: any) {
		this.searchText = event.target.value;
	}

	get filteredChannels() {
		return this.channels.filter(channel => channel.name.includes(this.searchText));
	}

	closeMembers() {
		this.channel.showMembers = false;
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(NewChannelComponent, {
			width: "40%",
			data: {
				name: "",
				description: "",
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (!result) return;

			this.auth.user$
				.pipe(
					switchMap(async user => {
						const newChannel: channel = {
							last_message: null,
							name: result.name,
							description: result.description,
							message_count: 0,
							owner: user,
							inviteCodes: [],
						};

						const doc = await this.firestore
							.collection("conversations")
							.add(newChannel);
						doc.collection("members").doc(user.id).set(user);
					}),
					take(1)
				)
				.subscribe();

			console.log("The dialog was closed, result: " + result);
		});
	}
}
