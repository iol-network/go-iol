import sha256 from "sha256";
import { getUUID, toHex } from "../utils/hashUtils";
import type { transaction_transfer_amount, transaction_create_nft, transaction_transfer_nft, transaction_create_domain, transaction_update_domain, transaction_create_alias, transaction_award, transactions } from './../types'

class TransactionLib {

    #transitions: transactions = [];

    async addTransition(transition: transaction_transfer_amount | transaction_create_nft | transaction_transfer_nft | transaction_create_domain | transaction_update_domain | transaction_create_alias | transaction_award) {
        await this.#transitions.push(transition)
    }

    countOpenedTransitions = async () => this.#transitions.length;

    getTransitions = async () => this.#transitions; // @TODO apenas as X primeiras transacoes... pra respeitar o numero maximo de transacoes por bloco

    async clearTransitions() { // @TODO remover apenas as procesadas
        this.#transitions = [];
    }

    /**
     * @todo
     */
    async getAmountByArrPublicKeysInTransactions(arr_public_keys: Array<any>): Promise<{ [key: string]: number; }> {

        let response: { [key: string]: number; } = {};

        for (let i in arr_public_keys) {
            response[arr_public_keys[i]] = 0;
        }

        /////////////////////
        let transactions: transactions = this.#transitions;

        for (let i2 in transactions) {

            if (transactions[i2].type === "transfer_amount") {

                let transaction = <transaction_transfer_amount>transactions[i2];

                if (typeof response[transaction.sender] !== undefined) {
                    response[transaction.sender] += <number>transaction.amount;
                    response[transaction.sender] += <number>transaction.tip;
                }

            }

            if (transactions[i2].type === "transfer_nft") {

                let transaction = <transaction_transfer_nft>transactions[i2];

                if (typeof response[transaction.sender] !== undefined) {
                    response[transaction.sender] += <number>transaction.tip;
                }

            }

            if (transactions[i2].type === "create_nft") {

                let transaction = <transaction_create_nft>transactions[i2];

                if (typeof response[transaction.reciver] !== undefined) {
                    response[transaction.reciver] += <number>transaction.tip;
                }

            }

            if (transactions[i2].type === "create_domain") {

                let transaction = <transaction_create_domain>transactions[i2];

                if (typeof response[transaction.sender] !== undefined) {
                    response[transaction.sender] += <number>transaction.tip;
                    response[transaction.sender] += <number>transaction.amount;
                }

            }

            if (transactions[i2].type === "update_domain") {

                let transaction = <transaction_update_domain>transactions[i2];

                if (typeof response[transaction.sender] !== undefined) {
                    response[transaction.sender] += <number>transaction.tip;
                }

            }

            if (transactions[i2].type === "award") {

                let transaction = <transaction_award>transactions[i2];

                if (typeof response[transaction.reciver] !== undefined) {
                    response[transaction.reciver] += <number>transaction.amount;
                }

            }

            if (transactions[i2].type === "alias") {

                let transaction = <transaction_create_alias>transactions[i2];

                if (typeof response[transaction.sender] !== undefined) {
                    response[transaction.sender] += <number>transaction.tip;
                }

            }

        }

        return response;

    }

    async createAmountTransaction(sender_public_address: string, sender_transition_key: string, reciver_public_key: string, tip: number, amount: number, observation: string = "") {

        let transaction: transaction_transfer_amount = {
            uid: await toHex(getUUID()),
            sender: sender_public_address,
            reciver: reciver_public_key,
            amount: amount,
            tip: tip,
            transition_key: sender_transition_key,
            observation: observation,
            created_at: Date.now(),
            type: "transfer_amount",
        }

        return transaction;

    }

    async createNFTTransaction(sender_public_address: string, sender_transition_key: string, reciver_public_key: string, reciver_transition_key: string, data: string, tip: number, observation: string = "") {

        let transaction: transaction_create_nft = {
            uid: await toHex(getUUID()),
            creator: sender_public_address,
            reciver: reciver_public_key, // Este vai pagar a criação
            data: data,
            tip: tip,
            creator_transition_key: sender_transition_key,
            reciver_transition_key: reciver_transition_key,
            observation: observation,
            created_at: Date.now(),
            type: 'create_nft',
        }

        return transaction;

    }

    async createTransferNFTTransaction(nft_id: string, sender_public_address: string, sender_transition_key: string, reciver_public_address: string, tip: number, observation: string = "") {

        let transaction: transaction_transfer_nft = {
            uid: await toHex(getUUID()),
            nft_id: nft_id,
            sender: sender_public_address,
            reciver: reciver_public_address,
            tip: tip,
            transition_key: sender_transition_key,
            observation: observation,
            created_at: Date.now(),
            type: 'transfer_nft',
        }

        return transaction;

    }

    async createDomainTransaction(sender_public_address: string, sender_transition_key: string, domain_name: string, domain_extension: string, servers: Array<string> = [], tip: number, amount: number, days: number, observation: string = "") {

        let transaction: transaction_create_domain = {
            uid: await toHex(getUUID()),
            sender: sender_public_address,
            domain_name: domain_name,
            extension: domain_extension,
            days: days,
            amount: amount,
            server_addresses: servers,
            tip: tip,
            transition_key: sender_transition_key,
            observation: observation,
            created_at: Date.now(),
            type: 'create_domain',
        }

        return transaction;

    }

    async createUpdateDomainTransaction(sender_public_address: string, sender_transition_key: string, domain_name: string, domain_extension: string, servers: Array<string> = [], tip: number, observation: string = "") {

        let transaction: transaction_update_domain = {
            uid: await toHex(getUUID()),
            sender: sender_public_address,
            domain_name: domain_name,
            extension: domain_extension,
            server_addresses: servers,
            tip: tip,
            transition_key: sender_transition_key,
            observation: observation,
            created_at: Date.now(),
            type: 'update_domain',
        }

        return transaction;

    }

    async createAliasTransaction(sender_public_address: string, sender_transition_key: string, alias: string, tip: number, observation: string = "") {

        let transaction: transaction_create_alias = {
            uid: await toHex(getUUID()),
            sender: sender_public_address,
            alias: alias,
            tip: tip,
            transition_key: sender_transition_key,
            observation: observation,
            created_at: Date.now(),
            type: 'alias',
        }

        return transaction;

    }

    async createAwardTransition(sender_public_address: string, amount: number, observation: string = "") {

        let transaction: transaction_award = {
            uid: await toHex(getUUID()),
            reciver: sender_public_address,
            amount: amount,
            tip: 0,
            observation: observation,
            created_at: Date.now(),
            type: 'award',
        }

        return transaction;

    }

    /**
     * 
     * iol or iol.*
     */
    async isValisDomain(domain: string, extension: string) {

        let check_domain_upper_case = domain.match(/([A-Z][A-Z]+|[A-Z])/g);
        let check_extension_upper_case = extension.match(/([A-Z][A-Z]+|[A-Z])/g);

        let check_domain_numbers = domain.match(/(\d+)/g);
        let check_extension_numbers = extension.match(/(\d+)/g);

        let check_domain_special_letter = domain.match(/(\W+)/g);
        let check_extension_special_letter = extension.match(/(\W+)/g);

        // Domain 

        if (check_domain_upper_case && check_domain_upper_case.length > 0) {
            return false;
        }

        if (check_domain_numbers && check_domain_numbers.length > 0) {
            return false;
        }

        if (check_domain_special_letter && check_domain_special_letter.length > 0) {
            return false;
        }

        if (domain.length < 1 || domain.length > 60) {
            return false;
        }
        // Extension

        if (check_extension_upper_case && check_extension_upper_case.length > 0) {
            return false;
        }

        if (check_extension_numbers && check_extension_numbers.length > 0) {
            return false;
        }

        if (extension.substring(0, 3) !== "iol") {
            return false;
        }

        let arr_extension = extension.split(".");
        if (arr_extension.length > 2) {
            return false;
        }

        if (arr_extension.length === 2) {

            let sub_ext = arr_extension[1];

            if (sub_ext.length < 1 || sub_ext.length > 3) {
                return false;
            }

            let special_extension = sub_ext[0].match(/(\W+)/g);
            let special_subextension = sub_ext[1].match(/(\W+)/g);
            if (special_extension && special_extension.length > 0) {
                return false;
            }

            if (special_subextension && special_subextension.length > 0) {
                return false;
            }

        } else {

            if (check_extension_special_letter && check_extension_special_letter.length > 0) {
                return false;
            }

            if (extension.length !== 3) {
                return false;
            }

        }

        return true;

    }

    async sumTransitionsTips(transactions: transactions): Promise<number> {

        let sum: number = 0;

        for (let i in transactions) {

            sum += transactions[i].tip;
            if (transactions[i].type === "create_domain") {
                let transition_domain = <transaction_create_domain>transactions[i];
                sum += transition_domain.amount;
            }

        }

        return sum;

    }

}

export default new TransactionLib();