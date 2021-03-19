import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class DrawerService {
	showHamburger: boolean;
	drawerOpen: boolean;

	constructor(public breakpointObserver: BreakpointObserver, private router: Router) {
		this.breakpointObserver
			.observe(["(min-width: 426px)"])
			.subscribe((state: BreakpointState) => {
				if (state.matches) {
					this.showHamburger = false;
					this.closeDrawer();
				} else {
					this.showHamburger = true;
				}
			});

		this.router.events.subscribe(val => {
			this.closeDrawer();
		});
	}

	openDrawer() {
		this.drawerOpen = true;
	}

	closeDrawer() {
		this.drawerOpen = false;
	}

	toggleDrawer() {
		this.drawerOpen = !this.drawerOpen;
	}
}
