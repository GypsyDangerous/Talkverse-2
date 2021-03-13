import { Injectable } from "@angular/core";

import { Router } from "@angular/router";
import firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";

import { switchMap } from "rxjs/operators";
import { user as User } from "../../../utils/types/user";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	user$: Observable<User>;
	constructor(
		private afAuth: AngularFireAuth,
		private firestore: AngularFirestore,
		private router: Router
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
	}

	async googleSignin() {
		const provider = new firebase.auth.GoogleAuthProvider();
		const credential = await this.afAuth.signInWithPopup(provider);
		return this.router.navigate(["/"]);
	}

	async signOut() {
		await this.afAuth.signOut();
		return this.router.navigate(["/"]);
	}

	async register(email: string, password: string, username: string) {
		const user = await firebase.auth().signInWithEmailAndPassword(email, password);
		await user.user?.updateProfile({ displayName: username });
		return await this.firestore.doc(`users/${user.user?.uid}`).set({ username: username }, { merge: true });
	}
}
