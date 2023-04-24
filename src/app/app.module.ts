import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { HttpClientModule,HTTP_INTERCEPTORS,HttpClient} from "@angular/common/http";
import { AuthInterceptorService } from "./auth/auth-inteceptor.service";
import { HeaderComponent } from "./header/header.component";
import { ProcessComponent } from "./processes/process/process.component";
import { ProcessesListComponent } from "./processes/process/processes-cartography/processes-list/processes-list.component";
import { ProcessesMapComponent } from "./processes/process/processes-cartography/processes-map/processes-map.component";
import { CreateProcessComponent } from "./processes/process/processes-cartography/processes-list/create-process/create-process.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSliderModule } from "@angular/material/slider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTreeModule } from "@angular/material/tree";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRadioModule } from "@angular/material/radio";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCardModule } from "@angular/material/card";
import {MatSidenavModule} from '@angular/material/sidenav';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { DragDropModule } from "@angular/cdk/drag-drop";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MultiSelectModule} from 'primeng/multiselect';

import { ContextMenuModule } from "ngx-contextmenu";

import { DeleteProcessComponent } from "./processes/process/processes-cartography/processes-list/delete-process/delete-process.component";
import { EditProcessComponent } from "./processes/process/processes-cartography/processes-list/edit-process/edit-process.component";
import { ProcessesCartographyComponent } from "./processes/process/processes-cartography/processes-cartography.component";
import { ProcessesIdentityComponent } from "./processes/process/processes-identity/processes-identity.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MergeProcessesComponent } from "./processes/process/generic-element-map/merge-processes/merge-processes.component";
import { PlayersManagementComponent } from "./processes/players/players-management/players-management.component";
import { PlayersComponent } from "./processes/players/players.component";
import { EditPlayerComponent } from "./processes/players/edit-player/edit-player.component";
import { DeletePlayerComponent } from "./processes/players/delete-player/delete-player.component";
import { AssignCustomerComponent } from "./processes/process/processes-cartography/processes-list/modals/assign-customer/assign-customer.component";
import { AssignSupplierComponent } from "./processes/process/processes-cartography/processes-list/modals/assign-supplier/assign-supplier.component";
import { AssignInputComponent } from "./processes/process/processes-cartography/processes-list/modals/assign-input/assign-input.component";
import { AssignOutputComponent } from "./processes/process/processes-cartography/processes-list/modals/assign-output/assign-output.component";
import { InputsOutputsComponent } from "./processes/inputs-outputs/inputs-outputs.component";
import { IoManagementComponent } from "./processes/inputs-outputs/io-management/io-management.component";
import { EditIoComponent } from "./processes/inputs-outputs/edit-io/edit-io.component";
import { DeleteIoComponent } from "./processes/inputs-outputs/delete-io/delete-io.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AssignPilotComponent } from "./processes/process/processes-cartography/processes-list/modals/assign-pilot/assign-pilot/assign-pilot.component";
import { GenericElementMapComponent } from "./processes/process/generic-element-map/generic-element-map.component";
import { CompanySitesComponent } from "./processes/company-sites/company-sites.component";
import { EditCompanySiteComponent } from "./processes/company-sites/edit-company-site/edit-company-site.component";
import { DeleteCompanySiteComponent } from "./processes/company-sites/delete-company-site/delete-company-site.component";
import { RenameElementComponent } from "./processes/process/generic-element-map/rename-element/rename-element.component";
import { ChangeElementStatusComponent } from "./processes/process/generic-element-map/change-element-status/change-element-status.component";
import { GenericSipocComponent } from "./processes/process/generic-sipoc/generic-sipoc.component";
import { ProcessTypesComponent } from "./processes/process-types/process-types.component";
import { ProcessTypesManagementComponent } from "./processes/process-types/process-types-management/process-types-management.component";
import { DeleteProcessTypeComponent } from "./processes/process-types/process-types-management/delete-process-type/delete-process-type.component";
import { EditProcessTypeComponent } from "./processes/process-types/process-types-management/edit-process-type/edit-process-type.component";
import { EditGenericProcessComponent } from "./processes/process/generic-element-map/edit-generic-process/edit-generic-process.component";
import { EditSipocComponent } from "./processes/process/generic-sipoc/edit-sipoc/edit-sipoc.component";
import { MatNativeDateModule } from "@angular/material/core";
/*
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashchartsComponent } from './dashboard/dashcharts/dashcharts.component';
import { DashbodyComponent } from './dashboard/dashbody/dashbody.component';

import { RisksComponent } from "./risks/risks.component";
import { RiskIdentificationComponent } from "./risks/risk-identification/risk-identification.component";
import { EditRiskIdentificationComponent } from "./risks/risk-identification/edit-risk-identification/edit-risk-identification.component";
import { RiskCharacterizationComponent } from "./risks/risk-characterization/risk-characterization.component";
import { EditRiskCharacterizationComponent } from "./risks/risk-characterization/edit-risk-characterization/edit-risk-characterization.component";
import { ProductsManagementComponent } from "./risks/products-management/products-management.component";
import { EditProductComponent } from "./risks/products-management/edit-product/edit-product.component";
import { DeleteProductComponent } from "./risks/products-management/delete-product/delete-product.component";
import { FactorsManagementComponent } from "./risks/factors-management/factors-management.component";
import { DeleteFactorComponent } from "./risks/factors-management/delete-factor/delete-factor.component";
import { EditFactorComponent } from "./risks/factors-management/edit-factor/edit-factor.component";
import { RiskAssessmentComponent } from "./risks/risk-assessment/risk-assessment.component";
import { EditRiskAssessmentComponent } from "./risks/risk-assessment/edit-risk-assessment/edit-risk-assessment.component";
import { RiskImpactManagementComponent } from "./risks/risk-assessment/risk-impact-management/risk-impact-management.component";
import { ImpactManagementComponent } from "./risks/impact-management/impact-management.component";
import { EditImpactComponent } from "./risks/impact-management/edit-impact/edit-impact.component";
import { DeleteImpactComponent } from "./risks/impact-management/delete-impact/delete-impact.component";
import { FinancialImpactComponent } from "./risks/risk-assessment/financial-impact/financial-impact.component";
import { FinancialLevelsChartComponent } from "./risks/risk-assessment/financial-levels-chart/financial-levels-chart.component";
import { ProcessRiskMapComponent } from "./risks/process-risk-map/process-risk-map.component";
import { RCMComponent } from "./risks/rcm/rcm.component";
import { EditRcmComponent } from "./risks/rcm/edit-rcm/edit-rcm.component";
import { EditLevelComponent } from './risks/risk-assessment/edit-level/edit-level.component';
import { FilterNameActionPipe } from './risks/action-plan-management/filter-name-action.pipe';

import { IncidentManagementComponent } from "./risks/incident-management/incident-management.component";
import { EditIncidentComponent } from "./risks/incident-management/edit-incident/edit-incident.component";
import { DeleteIncidentComponent } from "./risks/incident-management/delete-incident/delete-incident.component";
import { ActionPlanManagementComponent } from "./risks/action-plan-management/action-plan-management.component";
import { DeleteActionPlanComponent } from "./risks/action-plan-management/delete-action-plan/delete-action-plan.component";
import {  EditActionPlanComponent } from "./risks/action-plan-management/edit-action-plan/edit-action-plan.component";
import { DictionaryComponent } from './risks/dictionary/dictionary.component';
import { BaselCategoryComponent } from './risks/dictionary/basel-category/basel-category.component';
import { EditBaselComponent } from './risks/dictionary/basel-category/edit-basel/edit-basel.component';
import { DeleteBaselComponent } from './risks/dictionary/basel-category/delete-basel/delete-basel.component';
import { CategoryActionpComponent } from './risks/dictionary/category_actionp/category-actionp.component';
import { EditCategoryComponent } from './risks/dictionary/category_actionp/edit-category/edit-category.component';
import { DeleteCategoryComponent } from './risks/dictionary/category_actionp/delete-category/delete-category.component';
import { StatusActionpComponent } from './risks/dictionary/status-actionp/status-actionp.component';
import { EditStatusComponent } from './risks/dictionary/status-actionp/edit-status/edit-status.component';
import { DeleteStatusComponent } from './risks/dictionary/status-actionp/delete-status/delete-status.component';
import { EffortActionpComponent } from './risks/dictionary/effort-actionp/effort-actionp.component';
import { EditEffortComponent } from './risks/dictionary/effort-actionp/edit-effort/edit-effort.component';
import { DeleteEffortComponent } from './risks/dictionary/effort-actionp/delete-effort/delete-effort.component';
import { CriticalityIncidentComponent } from './risks/dictionary/criticality-incident/criticality-incident.component';
import {EditCriticalityComponent} from './risks/dictionary/criticality-incident/edit-criticality/edit-criticality.component';
import {DeleteCriticalityComponent} from './risks/dictionary/criticality-incident/delete-criticality/delete-criticality.component';
import { PriorityIncidentComponent } from "./risks/dictionary/priority-incident/priority-incident.component";
import { EditPriorityComponent } from "./risks/dictionary/priority-incident/edit-priority/edit-priority.component";
import { DeletePriorityComponent } from "./risks/dictionary/priority-incident/delete-priority/delete-priority.component";
import { FrequencyRiskComponent } from './risks/dictionary/frequency-risk/frequency-risk.component';
import { EditFrequencyComponent } from './risks/dictionary/frequency-risk/edit-frequency/edit-frequency.component';
import { DeleteFrequencyComponent } from './risks/dictionary/frequency-risk/delete-frequency/delete-frequency.component';

import { NotificationComponent } from './permissions/notification/notification.component';
import { CriticalityRisksComponent } from './risks/dictionary/criticality-risks/criticality-risks.component';
import { EditCriticalityRiskComponent } from './risks/dictionary/criticality-risks/edit-criticality-risk/edit-criticality-risk.component';
import { DeleteCriticalityRiskComponent } from './risks/dictionary/criticality-risks/delete-criticality-risk/delete-criticality-risk.component'
*/
//prime ng
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

 //toastr
import { ToastrModule } from 'ngx-toastr';
//pagination

import { NgxPaginationModule } from 'ngx-pagination';
//
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';

//charts
import { ChartsModule } from 'ng2-charts';



import { AdministrationSettingsComponent } from './administration-settings/administration-settings.component';
import { ResetpasswordComponent } from './auth/reset-pswd/resetpassword/resetpassword.component';
import { ForgotPasswordComponent } from './auth/reset-pswd/forgot-password/forgot-password.component';
import { VerifyTokenComponent } from './auth/reset-pswd/verify-token/verify-token.component';
import { AssignmentsComponent } from './permissions/assignments/assignments.component';
import { EditAssignmentComponent } from './permissions/assignments/edit-assignment/edit-assignment.component';
import { DeleteAssignmentComponent } from './permissions/assignments/delete-assignment/delete-assignment.component';
import { UserAssignmentComponent } from './permissions/user-assignment/user-assignment.component';
import { EditUserComponent } from './permissions/user-assignment/edit-user/edit-user.component';
import { DeleteUserComponent } from './permissions/user-assignment/delete-user/delete-user.component';
import { PermissionsComponent } from './permissions/permissions/permissions.component';

import { AccessControlDirective } from './general-services/access-control.directive';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AssignUsersComponent } from './permissions/assignments/assign-users/assign-users.component';
import { DictionaryPComponent } from './processes/dictionary-p/dictionary-p.component';
import { StatusProcessComponent } from './processes/dictionary-p/status-process/status-process.component';
import { EditStatusProcessComponent } from './processes/dictionary-p/status-process/edit-status-process/edit-status-process.component';
import { DeleteStatusProcessComponent } from './processes/dictionary-p/status-process/delete-status-process/delete-status-process.component';
import { AuthGuardService } from "./shared/auth-guard.service";
// errors
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './general-services/basic-error-handler'
import { GlobalHttpInterceptorService } from './general-services/global-http-interceptor.service';
import { ErrorDialogComponent } from './general-services/shared/errors/error-dialog/error-dialog.component';
import { LoadingDialogComponent } from './general-services/shared/loading/loading-dialog/loading-dialog.component';

import { UserProfileComponent } from './shared/user-profile/user-profile.component';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        HeaderComponent,
        ProcessComponent,
        ProcessesListComponent,
        ProcessesMapComponent,
        CreateProcessComponent,
        DeleteProcessComponent,
        EditProcessComponent,
        ProcessesCartographyComponent,
        ProcessesIdentityComponent,
        MergeProcessesComponent,
        PlayersManagementComponent,
        PlayersComponent,
        EditPlayerComponent,
        DeletePlayerComponent,
        AssignCustomerComponent,
        AssignSupplierComponent,
        AssignInputComponent,
        AssignOutputComponent,
        InputsOutputsComponent,
        IoManagementComponent,
        EditIoComponent,
        DeleteIoComponent,
        SidebarComponent,
        AssignPilotComponent,
        GenericElementMapComponent,
        RenameElementComponent,
        ChangeElementStatusComponent,
        CompanySitesComponent,
        EditCompanySiteComponent,
        DeleteCompanySiteComponent,
        GenericSipocComponent,
        ProcessTypesComponent,
        ProcessTypesManagementComponent,
        DeleteProcessTypeComponent,
        EditProcessTypeComponent,
        EditGenericProcessComponent,
        EditSipocComponent,
        /*DashboardComponent,
        RisksComponent,
        RiskIdentificationComponent,
        EditRiskIdentificationComponent,
        RiskCharacterizationComponent,
        EditRiskCharacterizationComponent,
        ProductsManagementComponent,
        EditProductComponent,
        DeleteProductComponent,
        FactorsManagementComponent,
        DeleteFactorComponent,
        EditFactorComponent,
        RiskAssessmentComponent,
        EditRiskAssessmentComponent,
        RiskImpactManagementComponent,
        ImpactManagementComponent,
        EditImpactComponent,
        DeleteImpactComponent,
        FinancialImpactComponent,
        FinancialLevelsChartComponent,
        ProcessRiskMapComponent,
        RCMComponent,
        EditRcmComponent,
        IncidentManagementComponent,
        EditIncidentComponent,
        DeleteIncidentComponent,
        ActionPlanManagementComponent,
        DeleteActionPlanComponent,
        EditActionPlanComponent,
        FilterNameActionPipe,
        DictionaryComponent,
        BaselCategoryComponent,
        EditBaselComponent,
        DeleteBaselComponent,
        CategoryActionpComponent,
        EditCategoryComponent,
        DeleteCategoryComponent,
        StatusActionpComponent,
        EditStatusComponent,
        DeleteStatusComponent,
        EffortActionpComponent,
        EditEffortComponent,
        DeleteEffortComponent,
        CriticalityIncidentComponent,
        EditCriticalityComponent,
        DeleteCriticalityComponent,
        PriorityIncidentComponent,
        EditPriorityComponent,
        DeletePriorityComponent,
        FrequencyRiskComponent,
        EditFrequencyComponent,
        DeleteFrequencyComponent,
        EditLevelComponent,
        DashchartsComponent,
        DashbodyComponent,
        NotificationComponent,
        CriticalityRisksComponent,
        EditCriticalityRiskComponent,
        DeleteCriticalityRiskComponent,
        */
        AdministrationSettingsComponent,
        ResetpasswordComponent,
        ForgotPasswordComponent,
        VerifyTokenComponent,
        AssignmentsComponent,
        EditAssignmentComponent,
        DeleteAssignmentComponent,
        UserAssignmentComponent,
        EditUserComponent,
        DeleteUserComponent,
        PermissionsComponent,
        AccessControlDirective,
        UnauthorizedComponent,
        AssignUsersComponent,
        DictionaryPComponent,
        StatusProcessComponent,
        EditStatusProcessComponent,
        DeleteStatusProcessComponent,
        ErrorDialogComponent,
        LoadingDialogComponent,
        UserProfileComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatTreeModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatListModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ScrollingModule,
        DragDropModule,
        MatCardModule,
        FontAwesomeModule,
        AccordionModule,
        MessageModule,
        MessagesModule,
        NgxPaginationModule,
        MatSidenavModule,
        MatButtonModule,
        MatExpansionModule,
        MatGridListModule,
        MatStepperModule,
        MatTabsModule,
        ChartsModule,
        MultiSelectModule,
        ToastrModule.forRoot({
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing'
        }),
        ContextMenuModule.forRoot({
            useBootstrap4: true,
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            defaultLanguage: "en",
        }),
    ],
    providers: [
        DatePipe,
        MatDatepickerModule,
        AuthGuardService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
