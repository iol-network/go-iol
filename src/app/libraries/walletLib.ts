let forge = require('node-forge');
import sha256 from "sha256";

class walletLib {

    async getPublicKey(private_key: string): Promise<string> {

        let forgePrivateKey = forge.pki.privateKeyFromPem(`-----BEGIN RSA PRIVATE KEY-----${private_key}-----END RSA PRIVATE KEY-----`);
        let forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

        let publicKey = forge.pki.publicKeyToPem(forgePublicKey);

        let arr_lines_publick_key = publicKey.split('\r\n')
        arr_lines_publick_key = await arr_lines_publick_key.filter((line: string) => line != '-----END PUBLIC KEY-----' && line != '-----BEGIN PUBLIC KEY-----')

        return sha256(arr_lines_publick_key.join(''));

    }

    async getTransitionKey(private_key: string): Promise<string> {

        let forgePrivateKey = forge.pki.privateKeyFromPem(`-----BEGIN RSA PRIVATE KEY-----${private_key}-----END RSA PRIVATE KEY-----`);
        let forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

        let publicKey = forge.pki.publicKeyToPem(forgePublicKey);

        let arr_lines_publick_key = publicKey.split('\r\n')
        arr_lines_publick_key = await arr_lines_publick_key.filter((line: string) => line != '-----END PUBLIC KEY-----' && line != '-----BEGIN PUBLIC KEY-----')

        return arr_lines_publick_key.join('');

    }

    checkTransitionKeyWithPublicKey = async (transition_key: string, public_key: string): Promise<boolean> => sha256(transition_key) === public_key;

    convertTransitionKeyToPublicKey = async (transition_key: string) => sha256(transition_key);

}

export default new walletLib();