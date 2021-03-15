import { Component, OnInit } from "@angular/core";
import { merge, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { channel } from "utils/types/channel";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app";
@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
	channels$: Observable<undefined | channel[]>;

	showMembers: boolean = false;
	popUpOpen: boolean = false;

	constructor(public auth: AuthService, private firestore: AngularFirestore) {
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
		this.channels$.subscribe(console.log);
	}
}
