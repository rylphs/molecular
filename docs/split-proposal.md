## Split Idea
Split the project into separate modules:
* molecular: Main project, allows integration between angular and native environments. Contains all the code shared with other modules.
* electron-molecule: Code to angular and electron integration:
    * Injection of services running in main process.
    * Menu Generation
    * Angular route and BrowserWindow integration
    * Event bus, allow communication (windows-windows, windows-services)
* express-molecule: Code to angular and express integration
    * Treat webservices like they were simple angular services.
        * Create (or use) some jwt module to deal with security
    * Event bus, allow communication (service-service, service-angular)
        * Use websockets to generate event from services to angular 
* java-molecular: Code to integrate some java webservice framework and angular. Change name later:
    * Treat webservices like they were simple angular services.
        * Create (or use) some jwt module to deal with security
    * Generate service interfaces from java classes to typescript
        * Use websockets to generate event from services to angular

## Idea: Molecular controlling all development environment
The idea is to have a central module, the molecular-app controling other ecosystems called molecules:
* angular-molecule: An angular ecosystem
* electron-molecule: An electron ecosystem
* express-molecule: An node express ecosystem
* angularjs-molecule: Old angular js ecosystem
* react-molecule: Reactjs ecosystem
* javaws-environment: JavaWs ecosystem
* etc...
Each module can have:
    * His own tools (e.g.: Extract typescript interfaces from java services)
    * His aditional modules (e.g.: electron-window form manage windows)
    * A bus mecanism to inject services and control events
    * molecular-app is responsable for abstract the details from each ecosystem and integrate them/
    
Usefull for partial migration

