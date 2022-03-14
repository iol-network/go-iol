import crypto from 'crypto'

// Sign the content
export const signData = async (private_key: string, data: string): Promise<string> => {

    // Treat private key
    let string_privatekey = crypto.createPrivateKey({
        key: Buffer.from(private_key, 'base64'),
        type: 'pkcs8',
        format: 'der',
    })

    // Create signature with data + private_key
    let sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();

    let signature = await sign.sign(string_privatekey);

    return signature.toString('base64')

}

// Check if signature is valid
export const verifySign = async (transition_key: string, data: string, signature: string): Promise<boolean> => {

    // Treat transition_key(public key of RSA)
    let string_publickey = crypto.createPublicKey({
        key: Buffer.from(transition_key, 'base64'),
        type: 'spki',
        format: 'der',
    })

    // Check if is valid with data + transition key
    let verify = await crypto.createVerify("SHA256");
    verify.update(data);
    verify.end();

    return verify.verify(string_publickey, Buffer.from(signature, 'base64'));

}