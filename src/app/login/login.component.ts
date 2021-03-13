import { Component, OnInit } from "@angular/core";
import { subscribeOn } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
	constructor(public auth: AuthService) {}

	ngOnInit(): void {
		this.auth.user$.subscribe(console.log)
	}
}
