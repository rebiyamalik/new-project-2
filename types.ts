export enum EncryptionMethod {
  AES = 'AES',
  BASE64 = 'BASE64',
}

export interface CryptoState {
  text: string;
  password: string;
  method: EncryptionMethod;
}
