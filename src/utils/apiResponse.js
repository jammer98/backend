class ApiResponse {
    constructor(statuscode, message = "success", data) {
        this.statuscode = statuscode < 400
        this.message = message
        this.data = data || null
    }
}