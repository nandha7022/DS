import { Routes } from '@angular/router';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { CompetationDetailsComponent } from './competation-details/competation-details.component';
import { CreateCompetitionComponent } from './create-competition/create-competition.component';
import { FileUploadService } from './services/file-upload.service';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { CompetationDeatilsUpdaterComponent } from './competation-deatils-updater/competation-deatils-updater.component';
import { AddTeaminfoComponent } from './add-teaminfo/add-teaminfo.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { JudgesInfoComponent } from './judges-info/judges-info.component';
import { SpeechtotextComponent } from './speechtotext/speechtotext.component';
import { TextMainComponent } from './text-main/text-main.component';
import { ScorecardConfigComponent } from './scorecard-config/scorecard-config.component';

import { GetAccessTokensComponent } from './get-access-tokens/get-access-tokens.component';
import { ScorecardNavigatorComponent } from './scorecard-navigator/scorecard-navigator.component';
import { LeadBordScreenComponent } from './lead-bord-screen/lead-bord-screen.component';
import { EventOrderingComponent } from './event-ordering/event-ordering.component';
import { AuthGuard } from './auth.guard';
import { HostControllerComponent } from './host-controller/host-controller.component';
import {ConfigScorecardComponent} from "./config-scorecard/config-scorecard.component";




export const routes: Routes = [
    { path: '', component: HomescreenComponent },
    { path: 'details', component: CompetationDetailsComponent },
    { path: 'add', component: CreateCompetitionComponent },
    { path: 'upload', component: ImageUploaderComponent },
    { path: 'update', component: CompetationDeatilsUpdaterComponent },
    { path: 'addTeam', component: AddTeaminfoComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'confJudges', component: JudgesInfoComponent },
    { path: 'speak', component: TextMainComponent },
    { path: 'score', component: ScorecardConfigComponent },
    { path: 'scoreCard', component: ScorecardNavigatorComponent },
    { path: 'getAccessTokens', component: GetAccessTokensComponent },
    { path: 'viewLeadBord', component: LeadBordScreenComponent },
    { path: 'eventOrderConfig', component: EventOrderingComponent},
    { path: 'hostController', component: HostControllerComponent},
    { path: 'ScoreCardConfig', component: ConfigScorecardComponent},


];
