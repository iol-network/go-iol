import { v4 as uuidv4 } from 'uuid';

export const toHex = async (string: string): Promise<string> => {

  let result = '';
  for (let i = 0; i < string.length; i++) {
    result += string.charCodeAt(i).toString(16);
  }
  return result;

}

export const getUUID = (): string => uuidv4().split('-').join('');

export const encrypt = async (text: string) => await (text);

export const decrypt = async (encrypted_text: string) => await (encrypted_text)