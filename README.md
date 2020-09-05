### About the app
#### Architecture
This application follows a Clean Architecture structure. Although this application has a simple logic, this structure allows to scale the project through a cohesive and decoupled way.

It must be taken into account that for small applications this structure is not the most suitable since it adds complexity

The directory tree and the use of each of them are detailed below:

config: contains global variables used through the project
src: Contains the source project

Inside src directory it can be found:
-core
-infra
-modules

core && infra: are part of the most external layer. Them contain drivers, helpers and interface adapters that are commons in all the application.

modules: This folder contains the different entities (or modules). At that point you can follow a DDD approach or a facade patterns for each module.

#### Logic
##### Storing Endpoint
The storing endpoint needs to securely store the provided data, it should accept
three parameters:

-id {string} The unique id to store the data on. If the same key already exists,
the data value should be overwritten.

-encryption_key {string} The key to encrypt the data with.

-value {*} Can be any JSON type, which should be retrieved as the original type.

API-Rest:

```
POST /{host}/secure-data

Content-type: application/json
Accept: application/json

{
    "id": "xxxx",
    "encryption_id": "xxxx",
    value: "{ \"field1\": \"1\", \"field2\": \"2\", \"field3\": \"3\" }",
}
```

Graphql:

```
{host}/secure-data

mutation Create {
  setSecureData(
    encryption_key: "my_key1",
    value: "{ \"field1\": \"1\", \"field2\": \"2\" }",
    id: "my_id"
  ) {
    id, value
  }
}
```

##### Retrieval Endpoint

The retrieval endpoint performs a query on the stored data, decrypts and returns the
results. As multiple records might be requested the endpoint should always return
an array of records. The required parameters are:

-id {string} The exact id to query with or using the special wildcard ‘*’ query for
a set of records (e.g. id: “engineering-jobs-*”).

-decryption_key {string} The key to decrypt the data with.

Retrieval Requirements:

If the encryption key is wrong, make a system log and do not return the item. That is,
return an empty array instead of an error message.

API-Rest:

```
GET /{host}/secure-data

Content-type: application/json
Accept: application/json

Params: 

filterId: "xxx"
encryption_id: "xxxx"
```

Graphql:

```
{host}/secure-data

query Read {
  getSecureData(filterId: "my_filter", encryption_key: "my_key") {
    id
    value
  }
}
```

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

##### local host

API-Rest
```
http://localhost:8000
```

Graphql
```
http://localhost:3000
```

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

