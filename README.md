# Capstone

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
