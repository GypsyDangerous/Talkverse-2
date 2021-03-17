import { Component, Input, OnInit } from "@angular/core";
import { channel } from "utils/types/channel";

@Component({
	selector: "channel-item",
	templateUrl: "./channel-item.component.html",
	styleUrls: ["./channel-item.component.scss"],
})
export class ChannelItemComponent implements OnInit {
	@Input() channel: channel;
	@Input() dontLink: boolean = false;
	constructor() {}

	ngOnInit(): void {}

	get initials() {
		return this.channel.name.split(" ").map(section => section[0]).join("")
	}
}
