import { DIR_BLOCKS, DIR_TMP_BLOCKS } from './../../configs/iol_config';
import { createFile, isFileExist, readFile, countFiles, removeFolder, deleteFile, renameDir, createDir } from './../utils/fileUtils';
import type { transactions, block, transaction_transfer_amount, transaction_create_nft, transaction_transfer_nft, transaction_create_domain, transaction_update_domain, transaction_create_alias, transaction_award, blockchain } from './../types'
import WalletLib from './walletLib'
import { verifySign } from './../utils/signUtil'
import { BLOCKS_TO_HALVING, AWARD } from './../../configs/iol_config'
import sha256 from "sha256";
import moment from "moment";

import { listBlocks as listBlocksAPI } from './../api/blockApi'

class BlockChainLib {

    #is_updateing_chain: boolean = false;

    constructor() {
        this.start()
    }

    async start() {

        let total_blocks = await countFiles(DIR_BLOCKS);
        if (total_blocks === 0) {
            await this.createBlock('1', '0', [
                {
                    uid: '3939656164313430623730623464376138636265333963663133333238376266',
                    reciver: '54637e2a19328ec8d16a86ae2b70fa5b721adb877dd8ba48264eb8c8cc5e7173',
                    amount: 15000000,
                    tip: 0,
                    observation: '',
                    created_at: 1647144539379,
                    type: 'award'
                }
            ]);
        }

    }

    async createBlock(proof_of_work: any, previous_hash: string, transactions: transactions) {

        let total_blocks = await countFiles(DIR_BLOCKS);
        let index = ++total_blocks;

        let block: block = {
            index: index,
            transactions: transactions,
            proof: proof_of_work,
            previous_hash: previous_hash,
            created_at: Date.now(),
        }

        await createFile(`${DIR_BLOCKS}${index}.block`, block);

        return block;

    }

    async getDifficultyLevel(index: number | null = null): Promise<number> {

        let selected_index = index && index > 0
            ? index
            : (await this.getLastBlock()).index;

        if (selected_index < BLOCKS_TO_HALVING) {
            return 1;
        } else if (selected_index < BLOCKS_TO_HALVING * 2) {
            return 2;
        } else if (selected_index < BLOCKS_TO_HALVING * 3) {
            return 3;
        } else if (selected_index < BLOCKS_TO_HALVING * 4) {
            return 4;
        } else {
            return 5;
        }

    }

    async getLastBlock(): Promise<block> {

        let total_blocks = await countFiles(DIR_BLOCKS);

        let block = await readFile(`${DIR_BLOCKS}${total_blocks}.block`);

        return block;

    }

    async getBlockHash(block: any) {

        let json_block = JSON.stringify(block);
        return sha256(json_block);

    }

    async isValidTransition(transition: transaction_transfer_amount | transaction_create_nft | transaction_transfer_nft | transaction_create_domain | transaction_update_domain | transaction_create_alias | transaction_award) {

        try {

            if (transition.type === "award") {
                // @internal have other method checking it
                return true;
            }

            if (transition.type === "create_nft") {


                if (!transition.creator_signature || !transition.reciver_signature) {
                    return false;
                }

                let { creator_signature, reciver_signature } = transition;

                delete (transition.creator_signature);
                delete (transition.reciver_signature);

                if (await verifySign(transition.creator_transition_key, JSON.stringify(transition), creator_signature) !== true) {
                    return false;
                }


                if (await verifySign(transition.reciver_transition_key, JSON.stringify(transition), reciver_signature) !== true) {
                    return false;
                }

                if (await WalletLib.checkTransitionKeyWithPublicKey(transition.creator_transition_key, transition.creator) !== true) {
                    return false;
                }

                if (await WalletLib.checkTransitionKeyWithPublicKey(transition.reciver_transition_key, transition.reciver) !== true) {
                    return false;
                }

                return true;

            } else {

                if (!transition.signature) {
                    return false;
                }

                let { signature, transition_key } = transition;

                delete (transition.signature);

                if (await verifySign(transition_key, JSON.stringify(transition), signature) !== true) {
                    return false;
                }

                if (await WalletLib.checkTransitionKeyWithPublicKey(transition_key, transition.sender) !== true) {
                    return false;
                }

                return true;
            }

        } catch (e: any) {
            console.log(e.message)
            return false;
        }

    }

    async isValidAwardTransaction(transitions: transactions, block_index: number): Promise<boolean> {

        let sum_tips: number = 0;
        let sum_award: number = 0;
        let award_transactions: Array<transaction_award> = [];

        let current_award = await this.getAwardValue(block_index);

        for (let i in transitions) {

            if (transitions[i].type == "award") {
                let award_transaction = <transaction_award>transitions[i];
                await award_transactions.push(award_transaction);
                sum_award += award_transaction.amount;
            } else if (transitions[i].type == "create_domain") {
                let create_domain_transaction = <transaction_create_domain>transitions[i];
                sum_tips += create_domain_transaction.tip;
                sum_tips += create_domain_transaction.amount;
            } else {
                sum_tips += transitions[i].tip;
            }

        }

        if ((current_award + sum_tips) != sum_award) {
            return false;
        }

        if (award_transactions.length != 1) {
            return false;
        }

        return true;

    }

    async checkAreBalanceTransitionsValid(transitions: transactions) {

        let arr: any = [];
        let arr_addresses: Array<string> = [];
        for (let i in transitions) {

            if (transitions[i].type == "alias") {

                let transaction = <transaction_create_alias>transitions[i];
                if (!arr[transaction.sender]) {
                    arr[transaction.sender] = 0;
                    await arr_addresses.push(transaction.sender);
                }
                arr[transaction.sender] += transaction.tip;

            }

            if (transitions[i].type == "create_domain") {

                let transaction = <transaction_create_domain>transitions[i];
                if (!arr[transaction.sender]) {
                    arr[transaction.sender] = 0;
                    await arr_addresses.push(transaction.sender);
                }
                arr[transaction.sender] += transaction.tip
                arr[transaction.sender] += transaction.amount

            }

            if (transitions[i].type == "update_domain") {

                let transaction = <transaction_update_domain>transitions[i];
                if (!arr[transaction.sender]) {
                    arr[transaction.sender] = 0;
                    await arr_addresses.push(transaction.sender);
                }
                arr[transaction.sender] += transaction.tip;

            }

            if (transitions[i].type == "create_nft") {

                let transaction = <transaction_create_nft>transitions[i];
                if (!arr[transaction.reciver]) {
                    arr[transaction.reciver] = 0;
                    await arr_addresses.push(transaction.reciver);
                }
                arr[transaction.reciver] += transaction.tip;

            }

            if (transitions[i].type == "transfer_nft") {

                let transaction = <transaction_transfer_nft>transitions[i];
                if (!arr[transaction.sender]) {
                    arr[transaction.sender] = 0;
                    await arr_addresses.push(transaction.sender);
                }
                arr[transaction.sender] += transaction.tip;

            }

            if (transitions[i].type == "transfer_amount") {

                let transaction = <transaction_transfer_amount>transitions[i];
                if (!arr[transaction.sender]) {
                    arr[transaction.sender] = 0;
                    await arr_addresses.push(transaction.sender);
                }
                arr[transaction.sender] += transaction.tip;
                arr[transaction.sender] += transaction.amount;

            }

        }

        let balances = await this.getAmountByArrPublicAddresses(arr_addresses);

        for (let i in arr) {

            let total: number = arr[i];

            if (balances[i] < total) {
                return false;
            }

        }

        return true;

    }

    async checkIsTransitionsRulesValid(transitions: transactions) {

        // Rule
        // - Não pode haver 2 transações pro msm dns no msm bloco ... create ou update
        // - Não pode haver 2 operações pro msm NFT no msm bloco
        // - Não pode haver 2 operações pro msm alias referenciado ao msm public address 

        let arr_nft = [];
        let arr_domain = [];
        let arr_sender_alias = [];

        for (let i in transitions) {

            if (transitions[i].type == "transfer_nft" || transitions[i].type == "create_nft") {

                if (transitions[i].type == "transfer_nft") {

                    let transaction = <transaction_transfer_nft>transitions[i];

                    if (await arr_nft.indexOf(transaction.nft_id) > -1) {
                        return false;
                    } else {
                        await arr_nft.push(transaction.nft_id);
                    }

                } else {

                    let transaction = <transaction_create_nft>transitions[i];

                    if (await arr_nft.indexOf(transaction.uid) > -1) {
                        return false;
                    } else {
                        await arr_nft.push(transaction.uid);
                    }

                }

            }

            if (transitions[i].type == "create_domain" || transitions[i].type == "update_domain") {

                let transaction = <transaction_create_domain | transaction_update_domain>transitions[i];
                let check = await arr_domain.filter((obj: any) => obj == `${transaction.domain_name}${transaction.extension}`);
                if (check && check.length > 0) {
                    return false;
                } else {
                    await arr_domain.push(`${transaction.domain_name}${transaction.extension}`);
                }

            }

            if (transitions[i].type == "alias") {

                let transaction = <transaction_create_alias>transitions[i];

                let check = await arr_sender_alias.filter((obj: any) => obj == transaction.sender);
                if (check && check.length > 0) {
                    return false;
                } else {
                    await arr_sender_alias.push(transaction.sender);
                }

            }

        }

        return true;

    }

    async checkIsValidChain(path: string = DIR_BLOCKS) {

        const checkTransitions = async (transitions: transactions): Promise<boolean> => { // true ok, false problems

            for (let i in transitions) {

                let response = await this.isValidTransition({ ...transitions[i] });
                if (response === false) {
                    return false;
                }

            }

            return true;

        }

        let total_blocks = await countFiles(path);
        if (total_blocks > 1) {

            let previous_block = await readFile(`${path}1.block`);
            for (let i = 2; i <= total_blocks; i++) {

                let current_block = await readFile(`${path}${i}.block`);
                let dificulty_level = await this.getDifficultyLevel(i);


                if (await this.checkIsTransitionsRulesValid(current_block.transactions) === false) {
                    return false;
                }

                if (current_block.previous_hash != await this.getBlockHash(previous_block)) {
                    return false;
                }

                let tmp_hash = sha256((current_block.proof ** 2 - previous_block.proof ** 2).toString())
                if (tmp_hash.substr(0, dificulty_level).replace(/(0*)/, "") != "") {
                    return false;
                }

                // Transitions
                if (await checkTransitions(current_block.transactions) === false) {
                    return false;
                }

                // Check Award
                if (await this.isValidAwardTransaction(current_block.transactions, current_block.index) === false) {
                    return false;
                }

                if (await this.checkAreBalanceTransitionsValid(current_block.transactions) === false) {
                    return false;
                }

                previous_block = current_block;

            }

        }

        return true;

    }

    /**
     * Reciver public key can be public address or alias
     * @TODO
     */
    async getReciverPublicKey(obj_revicer: {
        type: 'alias' | 'public_address',
        value: string
    }): Promise<string | null> {

        if (obj_revicer.type == 'public_address') {
            return obj_revicer.value.toString().length === 64 ? obj_revicer.value : null
        }

        if (obj_revicer.type == 'alias') {
            return await this.getPublicAddressByAlias(obj_revicer.value);
        }

        return null;

    }

    /**
     * 
     * @todo
     */
    async getAmountByArrPublicAddresses(arr_public_addresses: Array<string>): Promise<{ [key: string]: number; }> {

        let response: { [key: string]: number; } = {};

        for (let i in arr_public_addresses) {
            response[arr_public_addresses[i]] = 0;
        }

        let files = await countFiles(DIR_BLOCKS);

        for (let i = 1; i <= files; i++) {
            let block = await readFile(`${DIR_BLOCKS}${i}.block`);
            let transactions: transactions = block.transactions;

            for (let i2 in transactions) {

                if (transactions[i2].type === "transfer_amount") {

                    let transaction = <transaction_transfer_amount>transactions[i2];

                    if (typeof response[transaction.sender] !== undefined) {
                        response[transaction.sender] -= <number>transaction.amount;
                        response[transaction.sender] -= <number>transaction.tip;
                    }

                    if (typeof response[transaction.reciver] !== undefined) {
                        response[transaction.reciver] += <number>transaction.amount;
                    }

                }

                if (transactions[i2].type === "transfer_nft") {

                    let transaction = <transaction_transfer_nft>transactions[i2];

                    if (typeof response[transaction.sender] !== undefined) {
                        response[transaction.sender] -= <number>transaction.tip;
                    }

                }

                if (transactions[i2].type === "create_nft") {

                    let transaction = <transaction_create_nft>transactions[i2];

                    if (typeof response[transaction.reciver] !== undefined) {
                        response[transaction.reciver] -= <number>transaction.tip;
                    }

                }

                if (transactions[i2].type === "create_domain") {

                    let transaction = <transaction_create_domain>transactions[i2];

                    if (typeof response[transaction.sender] !== undefined) {
                        response[transaction.sender] -= <number>transaction.tip;
                        response[transaction.sender] -= <number>transaction.amount;
                    }

                }

                if (transactions[i2].type === "update_domain") {

                    let transaction = <transaction_update_domain>transactions[i2];
                    if (typeof response[transaction.sender] !== undefined) {
                        response[transaction.sender] -= <number>transaction.tip;
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
                        response[transaction.sender] -= <number>transaction.tip;
                    }

                }

            }

        }

        return response;

    }

    async getDomainBalance(domain: string, extension: string) {

        let response: any = {
            domain: domain,
            extension: extension,
            contracts: [],
        }

        let files = await countFiles(DIR_BLOCKS);
        for (let i = 1; i <= files; i++) {
            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "create_domain") {

                    if (transaction.domain_name !== domain || transaction.extension !== extension) {
                        continue;
                    }

                    var until_date = await moment(block.created_at, "x").add(transaction.days, 'days');

                    if (parseFloat(until_date.format('x')) > Date.now()) {

                        let obj_contract: any = {
                            uid: transaction.uid,
                            sender: transaction.sender,
                            days: transaction.days,
                        };

                        if (response.contracts.length < 1) {
                            obj_contract.until = until_date.format('x');
                        }

                        await response.contracts.push(obj_contract);

                    }

                }

            }

        }

        return response;

    }

    /**
     * return alias
     */
    async getAliasByPublicAddress(public_address: string) {

        let alias: string | null = null;

        let files = await countFiles(DIR_BLOCKS);
        for (let i = 1; i <= files; i++) {
            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "alias") {

                    if (alias && alias.length > 0 && alias == transaction.sender) {
                        if (transaction.sender != public_address) {
                            alias = null;
                        }
                    } else {

                        if (transaction.sender == public_address) {
                            alias = transaction.alias
                        }

                    }

                }

            }

        }

        return alias;

    }


    /**
     * return public address
     */
    async getPublicAddressByAlias(alias: string) {

        let public_address: string | null = null;

        let files = await countFiles(DIR_BLOCKS);
        for (let i = 1; i <= files; i++) {
            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "alias") {

                    if (public_address && public_address.length > 0 && public_address == transaction.sender) {
                        if (transaction.alias != alias) {
                            public_address = null;
                        }
                    } else {

                        if (transaction.alias == alias) {
                            public_address = transaction.sender
                        }

                    }

                }

            }

        }

        return public_address;

    }

    async getNFTData(nft_id: string): Promise<null | transaction_create_nft> {

        let files = await countFiles(DIR_BLOCKS);
        for (let i = 1; i <= files; i++) {
            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "create_nft") {

                    if (nft_id == transaction.uid) {
                        return transaction;
                    }

                }

            }

        }

        return null;

    }

    async getNFTOwner(nft_id: string): Promise<null | string> {

        let response: null | string = null;

        let files = await countFiles(DIR_BLOCKS);
        for (let i = files; i > 0; i--) {
            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "create_nft") {

                    if (nft_id == transaction.uid) {
                        return transaction.reciver;
                    }

                } else if (transaction.type == "transfer_nft") {

                    if (transaction.nft_id == nft_id) {
                        return transaction.reciver;
                    }

                }

            }

        }

        return response;

    }

    async getBlockChainLength() {
        let total_blocks = await countFiles(DIR_BLOCKS);
        return total_blocks;
    }

    async getAwardValue(block_index: number | null = null): Promise<number> {

        let cahin_length = block_index && block_index > 0
            ? block_index
            : await this.getBlockChainLength()

        if (cahin_length < BLOCKS_TO_HALVING) {
            return AWARD;
        } else if (cahin_length < BLOCKS_TO_HALVING * 2) {
            return AWARD / 2;
        } else if (cahin_length < BLOCKS_TO_HALVING * 3) {
            return AWARD / 3;
        } else if (cahin_length < BLOCKS_TO_HALVING * 4) {
            return AWARD / 4;
        } else if (cahin_length < BLOCKS_TO_HALVING * 5) {
            return AWARD / 5;
        } else if (cahin_length < BLOCKS_TO_HALVING * 6) {
            return AWARD / 6;
        }

        return 0;

    }

    async getDNS(domain: string, extension: string) {

        let response: any = {
            domain: domain,
            extension: extension,
            snerder: null,
            server_addresses: [],
        };

        let files = await countFiles(DIR_BLOCKS);

        for (let i = files; i > 0; i--) {

            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "create_domain") {

                    if (transaction.domain_name == domain && transaction.extension == extension) {
                        response.server_addresses = transaction.server_addresses;
                        response.sender = transaction.sender;

                        return response;
                    }

                } else if (transaction.type == "update_domain") {

                    if (transaction.domain_name == domain && transaction.extension == extension) {
                        response.server_addresses = transaction.server_addresses;
                        response.sender = transaction.sender;

                        return response;
                    }

                }

            }

        }

        return response;

    }

    async getNftData(nft_id: string) {

        let response: null | transaction_create_nft = null;

        let files = await countFiles(DIR_BLOCKS);

        for (let i = 1; i <= files; i++) {

            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "create_nft") {

                    if (transaction.uid == nft_id) {
                        return response;
                    }

                }

            }

        }

        return null;

    }

    async listNftsByCreator(public_address: string, index_start: number = 1, limit: number = 10) {

        let response: {
            index: number,
            nfts: transactions,
        } = {
            index: index_start,
            nfts: [],
        };

        let files = await countFiles(DIR_BLOCKS);

        for (let i = index_start; i < files; i++) {

            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];
                if (transaction.type == "create_nft") {

                    if (transaction.creator == public_address) {

                        response.index = i;
                        await response.nfts.push(transaction);

                        if (response.nfts.length > limit) {
                            return response;
                        }

                    }

                }

            }

        }

        return response;

    }

    async getTransitionByUid(uid: string) {

        let files = await countFiles(DIR_BLOCKS);

        for (let i = 0; i < files; i++) {

            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            for (let index in block.transactions) {

                let transaction = block.transactions[index];

                if (transaction.uid == uid) {

                    return {
                        transaction: transaction,
                        block: block
                    }

                }

            }

        }

        return null;

    }

    async getBlockByField(field: string, value: string) {

        let files = await countFiles(DIR_BLOCKS);

        for (let i = 1; i <= files; i++) {

            let block = await readFile(`${DIR_BLOCKS}${i}.block`);

            if (block[field]) {

                if (block[field] == value) {
                    return block
                }

            }

        }

        return null;

    }

    async listBlocks(order: string = 'desc', last_index: number | null = null, limit: number = 5) {


        let files = await countFiles(DIR_BLOCKS);

        let blocks: blockchain = [];
        let founded_index = true;
        if (last_index && last_index > 0) {
            founded_index = false;
        }

        if (order == "desc") {

            for (let i = files; i > 0; i--) {

                let block = await readFile(`${DIR_BLOCKS}${i}.block`);

                if (founded_index) {

                    await blocks.push(block);

                    if (blocks.length >= limit) {
                        return blocks;
                    }

                } else {
                    if (last_index == block.index) {
                        founded_index = true;
                    }
                }

            }

        } else {

            for (let i = 1; i <= files; i++) {

                let block = await readFile(`${DIR_BLOCKS}${i}.block`);

                if (founded_index) {

                    await blocks.push(block);

                    if (blocks.length >= limit) {
                        return blocks;
                    }

                } else {
                    if (last_index == block.index) {
                        founded_index = true;
                    }
                }

            }

        }

        return blocks;

    }

    // Não precisa substituir toda a blockchain, antes vejo se só não tem 1 ou 2 blocos novos... aí adicionar
    async _updateWhithRemoteChainOnlyLastBlocks(external_ip: string, index: number) {

        let response = await listBlocksAPI(external_ip, index);
        console.log('começa pelo IP index', index);

        if (response.success === true && response.length && response.length > 0 && response.metadata) {

            for (let i in response.metadata) {

                let block = response.metadata[i];

                console.log('cria', block.index)
                await createFile(`${DIR_BLOCKS}${block.index}.block`, block);

            }

        }

        console.log('chain valida', await this.checkIsValidChain(DIR_BLOCKS))
        if (await this.checkIsValidChain(DIR_BLOCKS) == false) { // Se a blockchain for invalida, remove os blocos que foram inseridos

            let total_current_blocks = await countFiles(DIR_BLOCKS);
            if (total_current_blocks > index) {
                for (let i = index; i <= total_current_blocks; i++) {
                    console.log('deleta o arquivo pq a blockcahin não é balida');
                    await deleteFile(`${DIR_BLOCKS}${i}.block`);
                }
            }

            this.#is_updateing_chain = false;
            return false;
        }

        this.#is_updateing_chain = false;
        return true;

    }

    async updateWithRemoteChain(external_ip: string) {

        if (this.#is_updateing_chain == true) {
            return false;
        }

        this.#is_updateing_chain = true;

        console.log('valida o external Ip', external_ip)

        let local_chain_length = await this.getBlockChainLength();

        let response = await listBlocksAPI(external_ip);

        if (response) {

            if (response.success === true && response.length && response.length > 0 && response.metadata) {

                if (response.length > local_chain_length) { // Remote block have more blocks

                    // Remover todos os arquivos da pasta
                    await removeFolder(DIR_TMP_BLOCKS);
                    await createDir(DIR_TMP_BLOCKS);

                    // @TODO antes de fazer o update, valida se não foram só os ultimos 15 blocos... pq aí eu só substituo os ultimos blocos e naõ baixo o blockchain desde o inicio

                    // Se houver mais q 15 blocos, verifica se 
                    if (response.length > 15 && local_chain_length > 15) {

                        let response_desc = await listBlocksAPI(external_ip, response.length, "desc");

                        if (response_desc.success && response_desc.success === true && response.length > 0 && response.metadata) {

                            for (let i in response_desc.metadata) {

                                if (response_desc.metadata[i].index <= local_chain_length) {

                                    let local_block = await readFile(`${DIR_BLOCKS}${response_desc.metadata[i].index}.block`);

                                    if (local_block.index === response_desc.metadata[i].index &&
                                        local_block.previous_hash == response_desc.metadata[i].previous_hash &&
                                        local_block.proof === response_desc.metadata[i].proof) {

                                        // response.metadata[i].index
                                        let response_add_last_blocks = await this._updateWhithRemoteChainOnlyLastBlocks(external_ip, response_desc.metadata[i].index);
                                        this.#is_updateing_chain = false;
                                        return response_add_last_blocks;


                                    }

                                }

                            }

                        }

                    }

                    //////////////////////

                    let sync = true;
                    let pagination = response;
                    while (sync) {

                        let last_index: number = 0;
                        for (let i in pagination.metadata) {

                            last_index = pagination.metadata[i].index;
                            await createFile(`${DIR_TMP_BLOCKS}${last_index}.block`, pagination.metadata[i]);

                        }

                        if (await this.checkIsValidChain(DIR_TMP_BLOCKS) == false) {
                            this.#is_updateing_chain = false;
                            return false;
                        }

                        if (!(pagination.metadata.length > 0)) {
                            sync = false;
                            break;
                        }

                        pagination = await listBlocksAPI(external_ip, last_index);

                        // Check success

                    }

                }

            }

            let total_current_blocks = await countFiles(DIR_BLOCKS);
            let total_tmp_blocks = await countFiles(DIR_TMP_BLOCKS);

            if (total_tmp_blocks > total_current_blocks) {

                if (await this.checkIsValidChain(DIR_TMP_BLOCKS) == false) {
                    this.#is_updateing_chain = false;
                    return false;
                }

                await removeFolder(DIR_BLOCKS);
                await renameDir(DIR_TMP_BLOCKS, DIR_BLOCKS);

                await removeFolder(DIR_TMP_BLOCKS);

            }

        }

        this.#is_updateing_chain = false;
        return true;

    }

}

export default new BlockChainLib();