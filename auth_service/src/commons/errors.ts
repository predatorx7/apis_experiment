
export enum ApplicationErrors {
    INVALID_CREDENTIALS,
    UNEXPECTED_ERROR,
    VALIDATION_ERROR,
    NOT_ALLOWED,
}

export const makeError = (error: ApplicationErrors, error_message?: string) => {
    return {
        error_code: ApplicationErrors[error],
        error_message,
    }
}
