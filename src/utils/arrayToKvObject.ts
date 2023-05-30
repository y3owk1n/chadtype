/**
 * Function to convert an array of key-value pairs into an object
 * @param {Object[]} array - An array of objects with key-value pairs
 * @returns {Record<string, string>} - An object with the key-value pairs
 */
export const arrayToKvObject = (
    array: { key: string; value: string }[]
): Record<string, string> => {
    return array.reduce((result, item) => {
        result[item.key] = item.value;
        return result;
    }, {} as Record<string, string>);
};
