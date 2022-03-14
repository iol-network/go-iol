import { SERVER_PRIVATE_REQUESTS_KEY } from './../../configs/server_config'

// Check if public hey is valid @TODO
export const checkIsValidWallet = (value: any) => value.length === 64;

export const checkIsValidPrivateKey = (value: any) => value.length > 500 && value.length < 2500;

export const checkIsValidBlockHash = (value: any) => value.length === 64;

// Check id block ID is valid @TODO
export const checkIsValidBlock = (value: any) => value.length === 64;

// Optional, if filled, hceck if block id is valid
export const optionalBlockId = (value: any) => {

    if (value) {
        return checkIsValidBlockHash(value)
    } else {
        return true;
    }

}

export const serverPrivateRequestKey = (value: string) => value === SERVER_PRIVATE_REQUESTS_KEY;