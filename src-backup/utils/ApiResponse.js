//Here the objective of utils folder is to have some functions which will be reused allover the project
//In this project, All Responses from api end points should be in same format so,I wrote below code.

class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }
//Here we want the status code to be <400
// Status codes like 404 etc, will have meaning and its good practise to use standerd codes:
// Informational responses (100 – 199)
// Successful responses (200 – 299)
// Redirection messages (300 – 399)
// Client error responses (400 – 499)
// Server error responses (500 – 599)