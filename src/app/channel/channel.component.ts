import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { channel } from "utils/types/channel";

@Component({
	selector: "app-channel",
	templateUrl: "./channel.component.html",
	styleUrls: ["./channel.component.scss"],
})
export class ChannelComponent implements OnInit {
	channel$: Observable<channel | undefined>;
	id: string = "";
	loading: boolean = true;
	constructor(
		private firestore: AngularFirestore,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.channel$ = this.route.paramMap.pipe(
			switchMap(params => {
				const id = params.get("id") as string;
				this.id = id;
				return this.firestore
					.collection("conversations")
					.doc<channel>(id || " ")
					.valueChanges();
			})
		);
	}

	ngOnInit(): void {
		this.channel$.subscribe(data => {
			this.loading = false;
			console.log(data);
			if (!data) {
				this.router.navigate(["/"]);
			}
		});
	}
}
