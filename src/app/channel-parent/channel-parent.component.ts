import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";

@Component({
	selector: "app-channel-parent",
	templateUrl: "./channel-parent.component.html",
	styleUrls: ["./channel-parent.component.scss"],
})
export class ChannelParentComponent implements OnInit {
	child: boolean;

	constructor(private route: ActivatedRoute) {
		this.route.paramMap
			.pipe(
				tap(params => {
					this.child = !!params.get("id");
				})
			)
			.subscribe();
	}

	ngOnInit(): void {}
}
