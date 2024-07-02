//Dont be afraid of seeing this code:
//Here the objective of utils folder is to have some functions which will be reused allover the project
//All Errors should be in same format and standerd so,I wrote below code.
//Error is inbuilt class of express, below we are over riding the properties like message etc, with our passes parameters


class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}