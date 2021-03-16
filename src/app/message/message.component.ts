import { Component, Input, OnInit } from "@angular/core";
import { formatTimestamp } from "utils/functions/time";
import { isOnlyEmojis } from "utils/functions/string";
import { message as Message } from "utils/types/message";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app"
@Component({
	selector: "app-message",
	templateUrl: "./message.component.html",
	styleUrls: ["./message.component.scss"],
})
export class MessageComponent implements OnInit {
	@Input() message: Message 
	
	optionsOpen: boolean = false;

	constructor(private firestore: AngularFirestore) {}

	ngOnInit(): void {}

	get timestamp(){
		return formatTimestamp(this.message.created_at)
	}

	get emojiOnly(){
		return isOnlyEmojis(this.message.raw_text)
	}

	async deleteMessage(){
		console.log(`deleting ${this.message.id} from ${this.message.channelId}`)
		await firebase.firestore().collection("conversations").doc(this.message.channelId).collection("messages").doc(this.message.id).delete()
	}

	openOptions(){
		this.optionsOpen = true
	}

	closeOptions(){
		this.optionsOpen = false
	}

}
