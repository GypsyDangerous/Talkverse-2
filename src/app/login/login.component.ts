import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { subscribeOn } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss", "../register/register.component.scss"],
})
export class LoginComponent implements OnInit {
	myForm: FormGroup;

	constructor(
		public auth: AuthService,
		private builder: FormBuilder,
		private snackBar: MatSnackBar,
		private router: Router
	) {}

	ngOnInit(): void {
		this.myForm = this.builder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(6)]],
		});
	}

	get email() {
		return this.myForm.get("email");
	}

	get password() {
		return this.myForm.get("password");
	}

	async submitHandler() {
		if (!this.myForm.valid) return false;

		const { email, password } = this.myForm.value;

		try {
			await this.auth.login(email, password);
			this.router.navigate(["/"])
			return true;
		} catch (err) {
			this.snackBar.open(`Error: Invalid email or password`, "dismiss", {
				duration: 5000000,
				horizontalPosition: "start",
				verticalPosition: "top",
				panelClass: ['warn-snackbar']
			});
			return false;
		}
	}
}
