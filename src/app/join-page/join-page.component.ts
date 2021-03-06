import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { channel } from "utils/types/channel";
import { AuthService } from "../services/auth.service";
import { ChannelService } from "../services/channel.service";

@Component({
	selector: "app-join-page",
	templateUrl: "./join-page.component.html",
	styleUrls: ["./join-page.component.scss"],
})
export class JoinPageComponent implements OnInit {
	channels$: Observable<channel[]>;
	channel: channel;
	code: string;

	constructor(
		private route: ActivatedRoute,
		private firestore: AngularFirestore,
		private router: Router,
		public channelManager: ChannelService,
	) {
		this.channels$ = this.route.paramMap.pipe(
			switchMap(params => {
				const code = params.get("code");
				this.code = code as string;
				return this.firestore
					.collection<channel>("conversations", ref =>
						ref.where("inviteCodes", "array-contains", code).limit(1)
					)
					.valueChanges();
			})
		);
	}

	ngOnInit(): void {
		this.channels$.subscribe(channels => (this.channel = channels[0]));
	}

	async join() {
		this.channelManager.join(this.code, () => {});
	}
}
