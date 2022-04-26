import {HttpException, HttpStatus} from "@nestjs/common";

export class ApiException extends HttpException {

    constructor(response, status: number = HttpStatus.OK) {
        super(response, status);
    }

    static warning(message: string) {
        return new ApiException(message);
    }

    static forbidden(message: string) {
        return new ApiException(message, HttpStatus.FORBIDDEN);
    }

    static unauthorize() {
        return new ApiException('Пользователь не авторизован', HttpStatus.UNAUTHORIZED);
    }

    static badRequest() {
        return new ApiException('Неправильный, некорректный запрос', HttpStatus.BAD_REQUEST);
    }

    // static internal(message, errors=[]) {
    //     return new ApiError(500, message, errors);
    // }
    //
    // static rollbackTransact(message, errors=[]) {
    //     return new ApiError(1024, message, errors);
    // }
}