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
import { environment } from "../environments/environment";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AuthFormComponent } from "./auth-form/auth-form.component";
import { HeaderComponent } from "./ui/header/header.component";
import { SidebarComponent } from "./ui/sidebar/sidebar.component";
import { ChannelParentComponent } from "./channel-parent/channel-parent.component";
import { LoadingSpinnerComponent } from "./ui/loading-spinner/loading-spinner.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { MessageComponent } from "./message/message.component";
import { MatIconModule } from "@angular/material/icon";
import { AutosizeModule } from "ngx-autosize";
import { ChannelItemComponent } from './ui/channel-item/channel-item.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { NewChannelComponent } from './new-channel/new-channel.component';
import {MatDialogModule} from "@angular/material/dialog";
import { JoinPageComponent } from './join-page/join-page.component';
import { UserSettingsComponent } from './user-settings/user-settings.component'

import { LayoutModule } from '@angular/cdk/layout';
import { ServiceWorkerModule } from '@angular/service-worker';




@NgModule({
	declarations: [
		AppComponent,
		AuthComponent,
		HomeComponent,
		LoginComponent,
		RegisterComponent,
		ProfileComponent,
		ChannelComponent,
		AuthFormComponent,
		HeaderComponent,
		SidebarComponent,
		ChannelParentComponent,
		LoadingSpinnerComponent,
		MessageComponent,
		ChannelItemComponent,
		NewChannelComponent,
		JoinPageComponent,
		UserSettingsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment),
		AngularFirestoreModule, // firestore
		AngularFireAuthModule, // auth
		AngularFireStorageModule, // storage
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatCheckboxModule,
		MatChipsModule,
		MatSnackBarModule,
		NgxSkeletonLoaderModule,
		MatIconModule,
		AutosizeModule,
		ClickOutsideModule,
		MatDialogModule,
		FormsModule,
		LayoutModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
