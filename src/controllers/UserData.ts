/*
 * Storage interface for user data retrieval and storage
 * i.e., Guest users' user data is stored in LocalStorage,
 * registered users' stored in Firebase, retrieved via LocalStorage.
 *
 * In general, fields of the user data should NEVER be deleted (i.e., set to undefined).
 * Instead, set to null, make empty for containers, etc.
 */
interface StorageInterface {
    put(fieldName: string, data: unknown): boolean;
    get(fieldName: string): unknown;
}

export default StorageInterface;
