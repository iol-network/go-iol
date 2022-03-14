import { promises as fs_promises } from 'fs';
import fs from 'fs';

import { encrypt, decrypt } from './hashUtils';

export const createFile = async (filename: string, data: any): Promise<boolean> => {

    try {
        await fs_promises.writeFile(`${filename}`, await encrypt(JSON.stringify(data)), 'utf8');
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }

}

export const isFileExist = async (filename: string): Promise<boolean> => {

    try {
        if (fs.existsSync(filename)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
        console.error(err)
    }

}

export const readFile = async (filename: string): Promise<any> => {

    try {

        let data: any = await fs_promises.readFile(filename);
        return JSON.parse(await decrypt(data.toString('utf8')));

    } catch (error) {
        return false;
    }

}

export const deleteFile = async (filename: string): Promise<boolean> => {

    try {
        await fs.unlinkSync(filename);
        return true;
    } catch (error) {
        console.log('erro ao deletar', error)
        return false;
    }

}

export const countFiles = async (path: string) => {

    let count = await fs.readdirSync(path).length

    return count;

}

export const removeFolder = async (path: string) => {
    await fs.rmSync(path, { recursive: true, force: true });
    return true;
}

export const renameDir = async (old_path: string, new_path: string) => {
    await fs.renameSync(old_path, new_path);
    return true;
}

export const createDir = async (path: string) => {
    await fs.mkdirSync(path);
    return true;
}