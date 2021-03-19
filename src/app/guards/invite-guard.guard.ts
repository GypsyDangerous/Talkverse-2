import { Injectable } from "@angular/core";
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
	providedIn: "root",
})
export class InviteGuardGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.user$.pipe(
			map(user => {
				if (user) return true;
				this.router.navigate(["auth", "login"], { queryParams: { redirect: `invite/${route.params.code}` } });
				return false;
			})
		);
	}
}
