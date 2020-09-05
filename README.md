### About the app
#### Architechture
This application follows a Clean Architecture structure. Although this application has a simple logic, this structure allows to scale the project through a cohesive and decoupled way.

The directory tree and the use of each of them are detailed below:

config: contains global variables used through the project
src: Contains the source project

Inside src directory it can be found:
-core
-infra
-modules

core && infra: are part of the most external layer. Them contain drivers, helpers and interface adapters that are commons in all the application.

modules: This folder contains the different entities (or modules). At that point you can follow a DDD approach or a facade patterns for each module.


### Start server
- Run the service up with typescript files:
```
npm start
```
#### Unit tests
```
npm run unit-tests
```

#### Integration tests
```
npm run integration-tests
```

#### Linter
Check for coding style errors:
```
npm run linter -s
```

### Run the project with docker
#### Docker-compose
To have all the third services up running for development purpose.
To create the basic required volum:
```
make setup
```

To work in local
```
make dev

To run the application
```
make build
```

The `docker-compose.yml` has all the dependencies and set-up. you will find:

##### Access Kibana
```
http://localhost:5601
```

##### Access Elasticsearch
```
http://localhost:9200
```

## Environment variables
- STDOUT_ENVIRONMENTS

### .env
All the variables can be set in a .env local file located in the project's root.

