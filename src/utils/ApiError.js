// ApiError ek custom Error class hai
// Iska use hum tab karte hain jab API me koi expected / controlled error aaye
// (jaise: invalid input, unauthorized, not found, etc.)
class ApiError extends Error {

    // constructor tab chalega jab new ApiError() banega
    constructor(
        statusCode,                         // HTTP status code (400, 401, 404, 500...)
        message = "Something went wrong",   // Default error message
        errors = [],                        // Extra error details (validation errors etc.)
        stack = ""                          // Optional custom stack trace
    ){
        // parent Error class ka constructor call
        // yahin se Error.message set hota hai
        super(message)

        // HTTP status code store kar rahe hain
        this.statusCode = statusCode

        // Error response me data hamesha null rahega
        this.data = null

        // Error ka main message
        this.message = message

        // Error case me success hamesha false hota hai
        this.success = false

        // Detailed errors (mostly array hota hai)
        // example: validation errors
        this.errors = errors
        
        // Agar stack manually diya gaya hai
        // to usko directly set kar do
        if (stack) {
            this.stack = stack
        } 
        // Nahi to Node.js khud stack trace generate kare
        // Error.captureStackTrace current constructor ko skip karta hai
        // taaki stack clean aur readable ho
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

// ApiError ko export kar rahe hain
// taaki controllers aur services me use ho sake
export { ApiError }
