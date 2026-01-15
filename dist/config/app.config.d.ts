declare const _default: (() => {
    name: string;
    version: string;
    port: number;
    env: string;
    corsOrigin: string[];
    pagination: {
        defaultPageSize: number;
        maxPageSize: number;
    };
    upload: {
        maxFileSize: number;
        dest: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    name: string;
    version: string;
    port: number;
    env: string;
    corsOrigin: string[];
    pagination: {
        defaultPageSize: number;
        maxPageSize: number;
    };
    upload: {
        maxFileSize: number;
        dest: string;
    };
}>;
export default _default;
