export function assertExists(
    assertion: any,
    message: string,
): asserts assertion {
    if (!assertion) {
        throw new Error(message);
    }
}
