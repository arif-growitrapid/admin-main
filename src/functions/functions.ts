
export type ServerFunctionResponse<T> = {
    type: "success" | "error";
    data: T | null;
    error?: string;
    status: number;
    message?: string;
    timestamp: number;
};

export function Response<T>(
    type: "success" | "error",
    data: T | null,
    status: number = 200,
    message?: string
): ServerFunctionResponse<T> {
    return {
        type,
        data,
        status,
        message,
        timestamp: Date.now(),
    };
}
