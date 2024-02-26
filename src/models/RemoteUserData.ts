import UserData from './UserData';

export default class RemoteUserdata implements UserData {
    put(fieldName: string, data: unknown): boolean {
        throw new Error('Method not implemented.');
    }
    get(fieldName: string): unknown {
        throw new Error('Method not implemented.');
    }

}
