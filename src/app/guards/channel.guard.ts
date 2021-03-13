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
			map(user => {
				return user.channels.includes(route.params["id"]);
			})
		);
	}
}
