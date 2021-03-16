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
import { Router } from "@angular/router";
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
		public dialog: MatDialog,
		private router: Router
	) {
		this.channels$ = this.auth.user$.pipe(
			switchMap(user => {
				return this.firestore
					.collection("users")
					.doc(user.id)
					.collection<channel>("channels", ref => ref.orderBy("name", "asc"))
					.valueChanges({ idField: "id" });
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
		this.channels$.subscribe(c => {
			this.channels = c || [];
			console.log(c);
		});
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
		return this.channels.filter(channel => channel.name?.includes(this.searchText));
	}

	closeMembers() {
		this.channel.showMembers = false;
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(NewChannelComponent, {
			width: "40%",
			data: {
				name: "test server",
				description: "for testing",
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(result);
			if (!result) return;

			const ref$ = this.auth.user$
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
							.collection<channel>("conversations")
							.add(newChannel);
						await doc.collection("members").doc(user.id).set(user);

						return { user, doc, channel: newChannel };
					}),
					take(1)
				)
				.subscribe(async ({ channel, user, doc }) => {
					console.log(user.id, doc.id, channel);

					await firebase
						.firestore()
						.collection("users")
						.doc(user.id)
						.collection("channels")
						.doc(doc.id)
						.set(channel);
					this.router.navigate(["channel", doc.id]);
				});

			console.log("The dialog was closed, result: " + result);
		});
	}
}
