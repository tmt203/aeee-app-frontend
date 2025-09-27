export const removeEmptyFields = (obj: Record<string, any>): Record<string, any> => {
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] === "") && delete obj[key]);
    return obj;
}