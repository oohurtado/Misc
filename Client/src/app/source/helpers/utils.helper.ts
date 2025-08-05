export class Utils {
    static getErrorsResponse(response: any): string {
        let error: string;
        if (response === null) {
            error = "Ha ocurrido un error desconocido, contacte al administrador";
        } else {
            error = response.error;            
        }

        return error;
    }

    static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }   
}