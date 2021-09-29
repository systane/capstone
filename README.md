# Capstone
This is a Pokemon CRUD created for the Capstone Project.

To construct the base of this project is from the serverless [start code project](https://github.com/udacity/cloud-developer/tree/master/course-04/project/c4-final-project-starter-code).

# Directory structure
The directory structure of this project was refactored as shown in the below image
![Alt text](images/directory_structure.png?raw=true "Image 6")

```
backend
|-- src
    |
    |--- UseCase --> Contains all files related to business logic
    |--- Gateway --> Contains all files related to external services
    |--- Repository --> Contains all files related to database
    |--- Lambda --> Contains all lambda handlers 
    |--- Models --> Contains all application models 
    |--- Utils --> Contains utils files (log and jwt decode)
    |--- Requests --> DTOs recevied in the handlers
```


## Backend deployment
To deploy the backend stack to AWS, run:

`cd backend`

`sls deploy -v`


## Frontend deployment
After finished the backend deployed, configure the `àpiId` url in the `client --> src --> config.ts` file. This id can be found  in the console output of the `sls deploy -v` command as `AwsDocApiId`.

To deploy a local frontend client, run:

`cd client`

`npm install`

`npm run start`