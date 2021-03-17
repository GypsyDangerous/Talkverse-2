import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { ChannelComponent } from "./channel/channel.component";

import { ChannelGuard } from "./guards/channel.guard";
import { AuthGuard } from "./guards/auth.guard";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { ChannelParentComponent } from "./channel-parent/channel-parent.component";
import { JoinPageComponent } from "./join-page/join-page.component";

const routes: Routes = [
	{ path: "", pathMatch: "full", component: HomeComponent },
	{
		path: "auth",
		component: AuthComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: "login",
				component: LoginComponent,
			},
			{
				path: "register",
				component: RegisterComponent,
			},
		],
	},
	{
		path: "profile",
		component: ProfileComponent,
		canActivate: [AuthenticatedGuard],
	},
	{
		path: "channel",
		component: ChannelParentComponent,
		canActivate: [AuthenticatedGuard],
		children: [
			{
				path: ":id",
				component: ChannelComponent,
				canActivate: [ChannelGuard],
			},
		],
	},
	{
		path: "invite/:code",
		component: JoinPageComponent,
	},
];

@NgModule({
	imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
