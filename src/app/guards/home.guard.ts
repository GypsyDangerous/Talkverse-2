import { Injectable } from "@angular/core";
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
	providedIn: "root",
})
export class HomeGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.user$.pipe(
			map(user => {
				if (user) {
					this.router.navigate(["channel"]);
					return false;
				} else {
					this.router.navigate(["auth", "login"]);
					return false;
				}
			})
		);
	}
}
