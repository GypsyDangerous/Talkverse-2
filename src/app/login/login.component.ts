import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { subscribeOn } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
	myForm: FormGroup;

	constructor(public auth: AuthService, private builder: FormBuilder) {}

	ngOnInit(): void {
		this.myForm = this.builder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.email, Validators.minLength(6)]],
		});
	}

	get email() {
		return this.myForm.get("email");
	}

	get password() {
		return this.myForm.get("password");
	}

	async submitHandler() {
		alert("submitted")
	}
}
