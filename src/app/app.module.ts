import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { ChannelComponent } from "./channel/channel.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import {environment} from "../environments/environment";
@NgModule({
	declarations: [
		AppComponent,
		AuthComponent,
		HomeComponent,
		LoginComponent,
		RegisterComponent,
		ProfileComponent,
		ChannelComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment),
		AngularFirestoreModule, // firestore
		AngularFireAuthModule, // auth
		AngularFireStorageModule, // storage
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
