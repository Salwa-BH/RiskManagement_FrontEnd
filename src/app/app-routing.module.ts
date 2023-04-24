import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { ProcessComponent } from "./processes/process/process.component";
import { CreateProcessComponent } from "./processes/process/processes-cartography/processes-list/create-process/create-process.component";
import { ProcessesCartographyComponent } from "./processes/process/processes-cartography/processes-cartography.component";
import { ProcessesIdentityComponent } from "./processes/process/processes-identity/processes-identity.component";
import { PlayersComponent } from "./processes/players/players.component";
import { PlayersManagementComponent } from "./processes/players/players-management/players-management.component";
import { InputsOutputsComponent } from "./processes/inputs-outputs/inputs-outputs.component";
import { IoManagementComponent } from "./processes/inputs-outputs/io-management/io-management.component";
import { GenericElementMapComponent } from "./processes/process/generic-element-map/generic-element-map.component";
import { CompanySitesComponent } from "./processes/company-sites/company-sites.component";
import { GenericSipocComponent } from "./processes/process/generic-sipoc/generic-sipoc.component";
import { ProcessTypesComponent } from "./processes/process-types/process-types.component";
import { ProcessTypesManagementComponent } from "./processes/process-types/process-types-management/process-types-management.component";
/*
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RisksComponent } from "./risks/risks.component";
import { RiskIdentificationComponent } from "./risks/risk-identification/risk-identification.component";
import { RiskCharacterizationComponent } from "./risks/risk-characterization/risk-characterization.component";
import { ProductsManagementComponent } from "./risks/products-management/products-management.component";
import { FactorsManagementComponent } from "./risks/factors-management/factors-management.component";
import { RiskAssessmentComponent } from "./risks/risk-assessment/risk-assessment.component";
import { RiskImpactManagementComponent } from "./risks/risk-assessment/risk-impact-management/risk-impact-management.component";
import { ImpactManagementComponent } from "./risks/impact-management/impact-management.component";
import { ProcessRiskMapComponent } from "./risks/process-risk-map/process-risk-map.component";
import { FinancialLevelsChartComponent } from "./risks/risk-assessment/financial-levels-chart/financial-levels-chart.component";
import { RCMComponent } from "./risks/rcm/rcm.component";
import { IncidentManagementComponent } from "./risks/incident-management/incident-management.component";
import { ActionPlanManagementComponent } from "./risks/action-plan-management/action-plan-management.component";
import { DictionaryComponent } from './risks/dictionary/dictionary.component';
import { NotificationComponent } from "./permissions/notification/notification.component";
*/
import { ForgotPasswordComponent } from "./auth/reset-pswd/forgot-password/forgot-password.component"
import {VerifyTokenComponent } from "./auth/reset-pswd/verify-token/verify-token.component"
import {ResetpasswordComponent } from "./auth/reset-pswd/resetpassword/resetpassword.component"
import { AdministrationSettingsComponent } from "./administration-settings/administration-settings.component"
import { AssignmentsComponent } from "./permissions/assignments/assignments.component"
import { UserAssignmentComponent } from "./permissions/user-assignment/user-assignment.component"
import { PermissionsComponent } from "./permissions/permissions/permissions.component"
import { UnauthorizedComponent } from './unauthorized/unauthorized.component'
import { DictionaryPComponent } from "./processes/dictionary-p/dictionary-p.component";
import { UserProfileComponent } from "./shared/user-profile/user-profile.component";
import { AuthGuardService } from "./shared/auth-guard.service";

const routes: Routes = [
  //{ path: "", component: DashboardComponent, pathMatch: "full", canActivate:[AuthGuardService] },
  //{ path: "dashboard", component: DashboardComponent, canActivate:[AuthGuardService]},
  //{ path: "notifications" , component: NotificationComponent , canActivate:[AuthGuardService]},

  { path: "unauthorized", component: UnauthorizedComponent, canActivate:[AuthGuardService] },  
  { path: "profile",component: UserProfileComponent, canActivate:[AuthGuardService]},
  {
    path: "processes",
    component: ProcessComponent, 
    canActivate:[AuthGuardService],
    children: [
      { path: "create", component: CreateProcessComponent },
      { path: ":id/edit", component: CreateProcessComponent },
      { path: "identity/:id", component: ProcessesIdentityComponent },
      { path: "old/mapping", component: ProcessesCartographyComponent },
      { path: "map", component: GenericElementMapComponent },
      { path: "map/:id", component: GenericElementMapComponent },
      {path:  "dictionary-processes",component: DictionaryPComponent},
      { path: "sipoc", component: GenericSipocComponent },
      { path: "sipoc/:id", component: GenericSipocComponent },
      ],
  },
  /*{
    path: "risks",
    component: RisksComponent, 
    canActivate:[AuthGuardService],
    children: [
      { path: "map", component: ProcessRiskMapComponent },
      { path: "map/:id", component: ProcessRiskMapComponent },
      { path: "financial-impact-chart/:id",component: FinancialLevelsChartComponent,},
      { path: "identification", component: RiskIdentificationComponent },
      { path: "characterization", component: RiskCharacterizationComponent },
      { path: "assessment", component: RiskAssessmentComponent },
      { path: "risk-control", component: RCMComponent },
      { path: "action-plan", component: ActionPlanManagementComponent },
      { path: "incidents", component: IncidentManagementComponent },
      {path:"dictionary-risks", component:DictionaryComponent},
      
  {
    path: "impacts",
    component: ImpactManagementComponent, 
    canActivate:[AuthGuardService],
    children: [{ path: "manage", component: ImpactManagementComponent }],
  },
  {
    path: "factors",
    component: FactorsManagementComponent,
    canActivate:[AuthGuardService],
    children: [{ path: "manage", component: FactorsManagementComponent }],
  },
    ],
  },
  {
    path: "products",
    component: ProductsManagementComponent,
    canActivate:[AuthGuardService],
    children: [{ path: "manage", component: ProductsManagementComponent }],
  },*/
  {
    path: "company-sites",
    component: CompanySitesComponent,
    canActivate:[AuthGuardService],
    children: [{ path: "manage", component: CompanySitesComponent }],
  },
  { path: "auth", component: AuthComponent },
  { path: "forgot-password", component: ForgotPasswordComponent},
  { path: "verify-token", component: VerifyTokenComponent},
  { path: "reset-password/:token", component: ResetpasswordComponent},

  { path: "administration-settings", component: AdministrationSettingsComponent },

  //Settings of Profiles and Roles
  { path: "assignments", component: AssignmentsComponent},
  { path: "assign-users", component: UserAssignmentComponent},
  { path: "permissions", component: PermissionsComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    onSameUrlNavigation: "reload",
    relativeLinkResolution: 'legacy'
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
