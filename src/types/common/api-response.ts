// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
// }

// export class ApiResponseClass<T> implements ApiResponse<T> {
//   success: boolean;
//   data?: T | undefined;
//   message?: string | undefined;

//   constructor({
//     data,
//     success,
//     message,
//   }: {
//     data?: T;
//     success: boolean;
//     message?: string;
//   }) {
//     (this.success = success ?? true), (this.data = data);
//     this.message = message;
//   }
// }
