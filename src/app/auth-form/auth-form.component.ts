import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
	selector: "auth-form",
	templateUrl: "./auth-form.component.html",
	styleUrls: ["./auth-form.component.scss"],
})
export class AuthFormComponent implements OnInit {
	@Input() title: string;
	@Input() register: boolean;

	constructor(public auth: AuthService) {}

	ngOnInit(): void {}
}
