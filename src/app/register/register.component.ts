import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss", "../login/login.component.scss"],
})
export class RegisterComponent implements OnInit {
	myForm: FormGroup;

	constructor(
		private auth: AuthService,
		private firestore: AngularFirestore,
		private builder: FormBuilder,
		private snackBar: MatSnackBar,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.myForm = this.builder.group({
			username: ["", [Validators.required]],
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(6)]],
		});
		this.auth.getRedirect(this.route);
	}

	get email() {
		return this.myForm.get("email");
	}

	get password() {
		return this.myForm.get("password");
	}

	get username() {
		return this.myForm.get("username");
	}

	async submitHandler() {
		if (!this.myForm.valid) return false;

		const { email, password, username } = this.myForm.value;

		try {
			await this.auth.register(email, password, username);
			if (this.auth.redirect) {
				this.router.navigate(this.auth.redirect.split("/"));
			} else {
				this.router.navigate(["/"]);
			}
			return true;
		} catch (err) {
			this.snackBar.open(`Error: Invalid email or password`, "dismiss", {
				duration: 5000000,
				horizontalPosition: "start",
				verticalPosition: "top",
				panelClass: ["warn-snackbar"],
			});
			return false;
		}
	}
}
