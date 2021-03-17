import { Component, Input, OnInit } from "@angular/core";
import { formatTimestamp } from "utils/functions/time";
import { isOnlyEmojis } from "utils/functions/string";
import { message as Message } from "utils/types/message";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app";
import { Observable } from "rxjs";
import { user } from "utils/types/user";
import { ChannelService } from "../services/channel.service";
import { map, switchMap } from "rxjs/operators";
@Component({
	selector: "app-message",
	templateUrl: "./message.component.html",
	styleUrls: ["./message.component.scss"],
})
export class MessageComponent implements OnInit {
	@Input() message: Message;
	sender$: Observable<user | undefined>;
	optionsOpen: boolean = false;

	constructor(private firestore: AngularFirestore, private channelManager: ChannelService) {
		this.sender$ = this.channelManager.members$.pipe(
			map(members => {
				return members?.find(member => member.id === this.message.sender.id);
			})
		);
	}

	ngOnInit(): void {}

	get timestamp() {
		return formatTimestamp(this.message.created_at);
	}

	get emojiOnly() {
		return isOnlyEmojis(this.message.raw_text);
	}

	async deleteMessage() {
		console.log(`deleting ${this.message.id} from ${this.message.channelId}`);
		await firebase
			.firestore()
			.collection("conversations")
			.doc(this.message.channelId)
			.collection("messages")
			.doc(this.message.id)
			.delete();
	}

	openOptions() {
		this.optionsOpen = true;
	}

	closeOptions() {
		this.optionsOpen = false;
	}
}
