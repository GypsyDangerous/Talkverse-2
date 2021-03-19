import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap, take, tap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { merge, Observable, of } from "rxjs";
import { channel } from "utils/types/channel";
import { message } from "utils/types/message";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import firebase from "firebase/app";
import { sanitizeHtml } from "utils/functions/string";
import { ChannelService } from "../services/channel.service";
import { DrawerService } from "../services/drawer.service";
import { MessagingService } from "../services/messaging.service";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";

const defaultMessageForm = {
	message: ["", [Validators.required]],
};

@Component({
	selector: "app-channel",
	templateUrl: "./channel.component.html",
	styleUrls: ["./channel.component.scss"],
})
export class ChannelComponent implements OnInit {
	empty: boolean | undefined;
	isOwner: boolean;
	channel$: Observable<channel | undefined>;
	loading: boolean = true;
	messages$: Observable<message[]>;
	inviteCodes: string[];

	myForm: FormGroup;

	constructor(
		private firestore: AngularFirestore,
		private route: ActivatedRoute,
		private router: Router,
		private builder: FormBuilder,
		private auth: AuthService,
		private channel: ChannelService,
		public drawerManager: DrawerService,
		public messaging: MessagingService
	) {}

	ngOnInit(): void {
		this.channel$ = this.route.paramMap.pipe(
			switchMap(params => {
				const id = params.get("id") as string;
				this.empty = !id;
				return this.firestore
					.collection("conversations")
					.doc<channel>(id || " ")
					.valueChanges({ idField: "id" });
			})
		);
		this.channel$.pipe(take(1)).subscribe(channel => {
			if (channel) {
				console.log("subscribing to ", channel.id);
				this.messaging.sub(channel.id!);
			}
		});
		this.channel.setChannel(this.channel$);
		this.messages$ = this.route.paramMap.pipe(
			switchMap(params => {
				const id = params.get("id") as string;
				return this.firestore
					.collection("conversations")
					.doc<channel>(id || " ")
					.collection<message>("messages", ref => ref.orderBy("created_at", "asc"))
					.valueChanges({ idField: "id" });
			})
		);
		this.channel$.subscribe(data => {
			this.inviteCodes = data?.inviteCodes || [];
			this.loading = false;
			if (!data) {
				this.router.navigate(["/channel"]);
			}
		});

		this.auth.user$.subscribe(user => {
			this.channel$.subscribe(channel => {
				this.isOwner = user.id === channel?.owner.id;
			});
		});

		this.myForm = this.builder.group({ ...defaultMessageForm });
	}

	get InviteCode() {
		return this.inviteCodes[0];
	}

	async deleteChannel() {
		console.log("deleting");
		this.auth.user$.subscribe(user => {
			this.channel$.subscribe(channel => {
				if (user.id !== channel?.owner.id) return;
				
				this.firestore.collection("conversations").doc(channel.id).delete();

				this.router.navigate(["channel"]);
			});
		});
	}

	async leave() {
		console.log("leaving");
		this.auth.user$.subscribe(user => {
			this.channel$.subscribe(async channel => {
				console.log(channel);
				await this.firestore
					.collection("users")
					.doc(user.id)
					.collection("channels")
					.doc(channel?.id)
					.delete();

				this.firestore
					.collection("conversations")
					.doc(channel?.id)
					.collection("members")
					.doc(user.id)
					.delete();
				this.router.navigate(["channel"]);
			});
		});
	}

	get currentMessage() {
		return this.myForm.get("message");
	}

	async editMessage(message: message) {
		console.log(message.id);
	}

	async sendMessage() {
		if (!this.myForm.valid) return;
		console.log("submitted");

		const raw_text = this.myForm.value.message;
		this.auth.user$
			.pipe(
				tap(user => {
					this.channel$
						.pipe(
							tap(channel => {
								console.log(channel);
								//@ts-ignore
								const parsed_text = twemoji.parse(sanitizeHtml(raw_text));
								const channelId = channel?.id;
								const sender = user;
								const read_by: string[] = [];
								const created_at = new Date().getTime();
								return this.firestore
									.collection("conversations")
									.doc(channelId)
									.collection("messages")
									.add({
										raw_text,
										parsed_text,
										channelId,
										sender,
										read_by,
										created_at,
									});
							}),
							take(1)
						)
						.subscribe();
				}),
				take(1)
			)
			.subscribe(() => {
				this.myForm.setValue({ message: "" });
				setTimeout(() => {
					document.getElementById("scroll-to")?.scrollIntoView();
				}, 300);
			});
	}

	enterSubmit(event: any) {
		document.getElementById("message-button")?.click();
		event.preventDefault();
	}

	toggleMembers() {
		this.channel.showMembers = true;
	}
}
