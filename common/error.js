class BaseError extends Error {
    constructor (message) {
        // Calling parent constructor of base Error class.
        super(message);
        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
};

class NotImplementError extends BaseError {
    constructor (fn) {
        let message = `${fn.name} is not implemented`;
        super(message);
    }
}

class ValidateError extends BaseError {}

// 未登录或者登录异常
class UnauthorizedError extends BaseError {}

// 数据库数据不存在的异常
class ObjectNotFound extends BaseError {
    constructor (objId) {
        var message = `${objId} Not Found`;
        super(message);
    }
}

module.exports = {
    ValidateError,
    UnauthorizedError,
    NotImplementError
};
