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

