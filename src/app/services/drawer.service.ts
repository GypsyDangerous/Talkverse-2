import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class DrawerService {
	showHamburger: boolean;
	drawerOpen: boolean;

	constructor(public breakpointObserver: BreakpointObserver) {
		this.breakpointObserver
			.observe(["(min-width: 426px)"])
			.subscribe((state: BreakpointState) => {
				if (state.matches) {
					this.showHamburger = false;
					this.closeDrawer()
				} else {
					this.showHamburger = true;
				}
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
