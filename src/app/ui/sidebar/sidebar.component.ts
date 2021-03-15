import { Component, OnInit } from "@angular/core";
import { fromEvent, merge, Observable, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { channel } from "utils/types/channel";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app";
import { ChannelService } from "src/app/services/channel.service";
import { user } from "utils/types/user";
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
		public channel: ChannelService
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

	closeMembers(){
		this.channel.showMembers = false
	}
}