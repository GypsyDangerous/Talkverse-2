import { Injectable } from "@angular/core";

import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";

import { filter, map, switchMap, take } from "rxjs/operators";
import { user as User } from "../../../utils/types/user";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	user$: Observable<User>;
	userId: string = "";

	redirect: string | null;
	constructor(
		private afAuth: AngularFireAuth,
		private firestore: AngularFirestore,
		private router: Router,
		private route: ActivatedRoute
	) {
		//@ts-ignore
		this.user$ = this.afAuth.authState.pipe(
			switchMap(user => {
				if (!user) return of(null);
				return this.firestore
					.doc<User>(`users/${user.uid}`)
					.valueChanges({ idField: "id" });
			})
		);

		this.user$.subscribe(user => {
			this.userId = user.id;
		});
	}

	getRedirect(route: ActivatedRoute): void {
		route.queryParamMap.subscribe(params => {
			this.redirect = params.get("redirect");
		});
	}

	async googleSignin() {
		const provider = new firebase.auth.GoogleAuthProvider();
		const credential = await this.afAuth.signInWithPopup(provider);
		console.log(this.redirect?.split("/"))
		if (this.redirect) return this.redirectTo(this.redirect.split("/"));
		return this.router.navigate(["/"]);
	}

	redirectTo(path: string[]){
		this.user$.pipe(take(1)).subscribe(() => {
			console.log("redirecting to", path)
			this.router.navigate(path)
		})
	}

	async signOut() {
		await this.afAuth.signOut();
		return this.router.navigate(["/auth/login"]);
	}

	async logout() {
		this.signOut();
	}

	async register(email: string, password: string, username: string) {
		const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
		await user.user?.updateProfile({ displayName: username });
		return await this.firestore
			.doc(`users/${user.user?.uid}`)
			.set({ username: username }, { merge: true });
	}

	async login(email: string, password: string) {
		const user = await firebase.auth().signInWithEmailAndPassword(email, password);
		return user;
	}
}
