import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { channel } from "utils/types/channel";
import { AuthService } from "./auth.service";

@Injectable({
	providedIn: "root",
})
export class ChannelService {
	channel$: Observable<channel | undefined>;
	showMembers: boolean
	constructor(
		private route: ActivatedRoute,
		private auth: AuthService,
		private router: Router,
		private firestore: AngularFirestore
	) {}

	setChannel(channel: Observable<channel | undefined>){
		this.channel$ = channel
	}
}
