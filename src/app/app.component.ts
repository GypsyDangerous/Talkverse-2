import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { MessagingService } from "./services/messaging.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	constructor(public auth: AuthService, public messaging: MessagingService) {}

	ngOnInit(): void {
		this.messaging.getPermission().subscribe(
			token => {
				console.log(`got token: ${token}`);
				this.messaging.showMessages().subscribe();
			},
			err => console.log(err.message)
		);
	}
}
