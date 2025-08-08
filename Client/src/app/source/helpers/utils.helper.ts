export class Utils {
    static getErrorsResponse(response: any): string {
        let error: string;
        if (response === null) {
            error = "Internal server error. Please try again later.";
        } else {
            error = response.error;            
        }

        return error;
    }

    static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }   

    static generateShortId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}