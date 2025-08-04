export class ApiResponse<T> {
    data!: T;
    grandTotal!: number;
    timestampAt!: Date;
    success!: boolean;
    errorMessage!: string;
}