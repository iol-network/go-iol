import sha256 from "sha256";
import { getUUID, toHex } from "../utils/hashUtils";
import type { transaction_transfer_amount, transaction_create_nft, transaction_transfer_nft, transaction_create_domain, transaction_update_domain, transaction_create_alias, transaction_award } from './../types'

class MinerationLib {

    async proofOfWork(previous_proof: any, dificulty_level: number) {

        let new_proof: number = 1;
        let check_proof = false;

        while (check_proof === false) {

            let tmp_hash = sha256((new_proof ** 2 - previous_proof ** 2).toString())
            if (tmp_hash.substr(0, dificulty_level).replace(/(0*)/, "") == "") {
                check_proof = true;
            } else {
                new_proof++;
            }

        }

        return new_proof;

    }

    async isProofValid(previous_proof: any, dificulty_level: number, golden_nounce: number) {

        let tmp_hash = sha256((golden_nounce ** 2 - previous_proof ** 2).toString())
        return (tmp_hash.substr(0, dificulty_level).replace(/(0*)/, "") == "") ? true : false;

    }

}

export default new MinerationLib();