// ApiResponse ek helper class hai
// Iska kaam hai: API ka response ek fixed / consistent format me bhejna
// Taaki har API ka output same structure follow kare
class ApiResponse {

    // constructor tab chalta hai jab new ApiResponse() call hota hai
    constructor(statusCode, data, message = "Success") {

        // HTTP status code (200, 201, 400, 500 etc.)
        this.statusCode = statusCode

        // Actual data jo API return kar rahi hai
        // (object, array, null — jo bhi ho)
        this.data = data

        // Response ka message
        // Agar message pass nahi kiya to default "Success" hoga
        this.message = message

        // success flag frontend ke liye useful hota hai
        // Rule:
        // statusCode < 400  → success = true
        // statusCode >= 400 → success = false
        this.success = statusCode < 400
    }
}
