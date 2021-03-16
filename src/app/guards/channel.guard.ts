import { Injectable } from "@angular/core";
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	ActivatedRoute,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "../services/auth.service";
import { map, switchMap, tap } from "rxjs/operators";
import { channel } from "utils/types/channel";
import firebase from "firebase/app";
@Injectable({
	providedIn: "root",
})
export class ChannelGuard implements CanActivate {
	constructor(private firestore: AngularFirestore, private auth: AuthService) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.user$.pipe(
			tap(user => {
				console.log(user.id, route.params.id)
				return user
			}),
			switchMap(user => {
				return this.firestore
					.collection("users")
					.doc(user.id)
					.collection("channels")
					.doc(route.params["id"])
					.valueChanges()
					.pipe(
						tap(doc => {
							console.log(doc);
							return doc;
						}),
						map(doc => !!doc)
					);
			})
		);
	}
}
