import { Component, Input, OnInit } from "@angular/core";
import { formatTimestamp } from "utils/functions/time";
import { isOnlyEmojis } from "utils/functions/string";
import { message as Message } from "utils/types/message";

@Component({
	selector: "app-message",
	templateUrl: "./message.component.html",
	styleUrls: ["./message.component.scss"],
})
export class MessageComponent implements OnInit {
	@Input() message: Message 
	
	constructor() {}

	ngOnInit(): void {}

	get timestamp(){
		return formatTimestamp(this.message.created_at)
	}

	get emojiOnly(){
		return isOnlyEmojis(this.message.raw_text)
	}
}
