# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.
It is a private solution called RiskTracer.
Risk Tracer is based on extensive experience and a proven approach in Risk Management. The approach is built on the best standards in the field, such as ISO 31000, COSO, Basel III, etc. Its goal is to:
    -Anticipate risks and have a proactive approach that ensures the reduction of uncertainties, the achievement of objectives, and the increase of the potential for project success.
    -Protect tangible and intangible assets that form the basis of action.
    -Ensure compliance with legal and regulatory requirements.
    -Have reporting and assistance for more informed decision-making.

For security reasons, some parts and functionalities have been deleted. So the project contains the process logic tree: (domain, process, activity, subActivity), the authentication with Ldap and DB, access and action management based on user's role, group or profile and errors management. The part of risks, incidents, RCM and sending demands to be confirmed by the direct superior where deleted. 

## Development server
After cloning an Angular project from GitHub, you need to install the required dependencies by running the following command in the project's root directory:
`npm install`
This will install all the dependencies listed in the package.json file, including the node_modules folder.

Once the dependencies are installed, you can run the project using the following command:
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

However, if you are working with https, the command to run the code changes to `ng serve --ssl true --ssl-cert {path to server.crt in ssl folder} --ssl-key {path to server.key in ssl folder}`
for example:
`ng serve --ssl true --ssl-cert C:\\Users\\missh\\Desktop\\mine\\RiskTracer-Front-end\\ssl\\server.crt --ssl-key C:\\Users\\missh\\Desktop\\mine\\RiskTracer-Front-end\\ssl\\server.key`

The link of the backend in proxy.conf.json file must also be changed. Between https or http, depending on what you are using.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
