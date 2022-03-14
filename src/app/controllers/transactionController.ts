import BlockChainLib from './../libraries/blockChainLib'
import WalletLib from '../libraries/walletLib';
import TransactionLib from '../libraries/transactionLib';
import MineService from './../services/mineService'
import { MIN_TRANSACTION_TIP, MAX_TRANSITIONS, DOMAIN_PRICE_PER_YEAR, YEAR_DAYS } from './../../configs/iol_config'
import { IS_MINER } from './../../configs/server_config'
import { signData } from './../utils/signUtil'
import blockChainLib from './../libraries/blockChainLib';

class TransactionController {

    async addAmountTransfer(req: any, res: any) {

        try {

            let {
                private_key,
                reciver_address, reciver_alias,
                amount,
                description,
                tip
            } = req.body.private_key
                    ? req.body
                    : req.query;

            let award_transaction = await TransactionLib.createAwardTransition("54637e2a19328ec8d16a86ae2b70fa5b721adb877dd8ba48264eb8c8cc5e7173", 15000000)
            console.log('------------------------')
            console.log(award_transaction)
            console.log('------------------------')

            if (tip < MIN_TRANSACTION_TIP) {
                res.send({ success: false, error: "LITTLE_TIP" });
                return;
            }

            let reciver = await BlockChainLib.getReciverPublicKey({
                type: reciver_alias && reciver_alias.length > 2 ? "alias" : "public_address",
                value: reciver_alias && reciver_alias.length > 2 ? reciver_alias : reciver_address
            });

            if (!reciver) {
                res.send({ success: false, error: "INVALID_RECIVER" });
                return;
            }

            let sender_public_address = await WalletLib.getPublicKey(private_key);
            let sender_transition_key = await WalletLib.getTransitionKey(private_key);

            let balances = await BlockChainLib.getAmountByArrPublicAddresses([sender_public_address]);
            let amount_in_transactions = await TransactionLib.getAmountByArrPublicKeysInTransactions([sender_public_address]);

            if (balances[sender_public_address] >= (amount + tip + amount_in_transactions[sender_public_address])) { // Have balance and create transaction

                // Create Transaction
                let transaction = await TransactionLib.createAmountTransaction(sender_public_address, sender_transition_key, reciver, tip, amount, description);
                transaction.signature = await signData(private_key, JSON.stringify(transaction))

                await TransactionLib.addTransition(transaction);



                if ((await TransactionLib.countOpenedTransitions() + 1) >= MAX_TRANSITIONS) {
                    if (IS_MINER === true) {
                        await MineService.mineBlock();
                    }
                }

                res.send({ success: true, metadata: transaction });
                return;

            } else {

                res.send({
                    success: false,
                    error: "WITHDRAW_BALANCE",
                    metadata: {
                        balance: balances[sender_public_address],
                        amount_in_transaction: amount_in_transactions[sender_public_address],
                    }
                });
                return;

            }

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async createNFT(req: any, res: any) {

        try {

            let {
                private_key,
                reciver_private_key,
                data,
                description,
                tip
            } = req.body.private_key
                    ? req.body
                    : req.query;

            if (tip < MIN_TRANSACTION_TIP) {
                res.send({ success: false, error: "LITTLE_TIP" });
                return;
            }

            let creator_public_address = await WalletLib.getPublicKey(private_key);
            let creator_transition_key = await WalletLib.getTransitionKey(private_key);

            let reciver_public_address = await WalletLib.getPublicKey(reciver_private_key);
            let reciver_transition_key = await WalletLib.getTransitionKey(reciver_private_key);

            let balances = await BlockChainLib.getAmountByArrPublicAddresses([reciver_private_key]);
            let amount_in_transactions = await TransactionLib.getAmountByArrPublicKeysInTransactions([reciver_private_key]);

            if (balances[reciver_private_key] >= (tip + amount_in_transactions[reciver_private_key])) { // Have balance and create transaction

                // Create Transaction
                let transaction = await TransactionLib.createNFTTransaction(creator_public_address, creator_transition_key, reciver_public_address, reciver_transition_key, data, tip, description);

                let string_transaction = JSON.stringify(transaction);

                transaction.creator_signature = await signData(private_key, string_transaction)
                transaction.reciver_signature = await signData(reciver_private_key, string_transaction)

                let added_transaction = await TransactionLib.getTransitions();
                if (await BlockChainLib.checkIsTransitionsRulesValid([...added_transaction, transaction]) === false) {
                    res.send({ success: false, error: "THERE_IS_A_OPENED_TRANSACTION_TO_THIS_NFT_ALREADY" });
                    return;
                }

                await TransactionLib.addTransition(transaction);

                // Max transactoin
                if ((await TransactionLib.countOpenedTransitions() + 1) >= MAX_TRANSITIONS) {
                    if (IS_MINER === true) {
                        await MineService.mineBlock();
                    }
                }

                res.send({ success: true, metadata: transaction });
                return;

            } else {

                res.send({
                    success: false,
                    error: "WITHDRAW_BALANCE",
                    metadata: {
                        balance: balances[reciver_private_key],
                        amount_in_transaction: amount_in_transactions[reciver_private_key],
                    }
                });
                return;

            }

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async transferNFT(req: any, res: any) {

        try {

            let {
                private_key,
                reciver_address, reciver_alias,
                nft_id,
                description,
                tip
            } = req.body.private_key
                    ? req.body
                    : req.query;

            if (tip < MIN_TRANSACTION_TIP) {
                res.send({ success: false, error: "LITTLE_TIP" });
                return;
            }

            let nft_data = await BlockChainLib.getNFTData(nft_id);
            if (!nft_data) {
                res.send({ success: false, error: "NFT_NOT_FOUND" });
                return;
            }

            let reciver = await BlockChainLib.getReciverPublicKey({
                type: reciver_alias && reciver_alias.length > 2 ? "alias" : "public_address",
                value: reciver_alias && reciver_alias.length > 2 ? reciver_alias : reciver_address
            });

            if (!reciver) {
                res.send({ success: false, error: "INVALID_RECIVER" });
                return;
            }

            let sender_public_address = await WalletLib.getPublicKey(private_key);
            let sender_transition_key = await WalletLib.getTransitionKey(private_key);

            let nft_owner = await BlockChainLib.getNFTOwner(nft_id);
            if (nft_owner) {

                if (sender_public_address != nft_owner) {
                    res.send({ success: false, error: "INVALID_OWNER", owner: nft_owner });
                    return;
                }

            }

            let balances = await BlockChainLib.getAmountByArrPublicAddresses([sender_public_address]);
            let amount_in_transactions = await TransactionLib.getAmountByArrPublicKeysInTransactions([sender_public_address]);

            if (balances[sender_public_address] >= (tip + amount_in_transactions[sender_public_address])) { // Have balance and create transaction

                let transaction = await TransactionLib.createTransferNFTTransaction(nft_id, sender_public_address, sender_transition_key, reciver, tip, description);

                transaction.signature = await signData(private_key, JSON.stringify(transaction))

                let added_transaction = await TransactionLib.getTransitions();
                if (await BlockChainLib.checkIsTransitionsRulesValid([...added_transaction, transaction]) === false) {
                    res.send({ success: false, error: "THERE_IS_A_OPENED_TRANSACTION_TO_THIS_NFT_ALREADY" });
                    return;
                }

                await TransactionLib.addTransition(transaction);

                // Max transactoin
                if ((await TransactionLib.countOpenedTransitions() + 1) >= MAX_TRANSITIONS) {
                    if (IS_MINER === true) {
                        await MineService.mineBlock();
                    }
                }

                res.send({ success: true, metadata: transaction });
                return;

            } else {

                res.send({
                    success: false,
                    error: "WITHDRAW_BALANCE",
                    metadata: {
                        balance: balances[sender_public_address],
                        amount_in_transaction: amount_in_transactions[sender_public_address],
                    }
                });
                return;

            }

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async createDomain(req: any, res: any) {

        try {

            let {
                private_key,
                domain,
                extension,
                servers,
                description,
                amount, // Amount vai definir o tempo
                tip
            } = req.body.private_key
                    ? req.body
                    : req.query;

            if (tip < MIN_TRANSACTION_TIP) {
                res.send({ success: false, error: "LITTLE_TIP" });
                return;
            }

            if (amount > DOMAIN_PRICE_PER_YEAR * 5 || amount < DOMAIN_PRICE_PER_YEAR) {
                res.send({ success: false, error: "MIN DOMAIN YEAR IS 1 YEAR AND MAX IS 5 YEARS" });
                return;
            }

            if (await TransactionLib.isValisDomain(domain, extension) === false) {
                res.send({ success: false, error: "INVALID_DOMAIN" });
                return;
            }

            let sender_public_address = await WalletLib.getPublicKey(private_key);
            let sender_transition_key = await WalletLib.getTransitionKey(private_key);

            let domain_contracts = await BlockChainLib.getDomainBalance(domain, extension);

            let days: number = amount * YEAR_DAYS;

            if (domain_contracts.contracts.length > 0) {

                if (sender_public_address == domain_contracts.contracts[0].sender) {

                    let sum_days: number = 0;
                    for (let i in domain_contracts.contracts) {
                        sum_days += domain_contracts.contracts[i].days;
                    }

                    if ((sum_days + days) > YEAR_DAYS * 6) {
                        res.send({ success: false, error: "MANY_DAYS_ACTIVE_IN_CONTACTS", contracts: domain_contracts });
                        return;
                    }

                } else {

                    res.send({ success: false, error: "DOMAIN_NOT_ALLOWED", owner: domain_contracts.contracts[0].sender });
                    return;

                }

            }

            let balances = await BlockChainLib.getAmountByArrPublicAddresses([sender_public_address]);
            let amount_in_transactions = await TransactionLib.getAmountByArrPublicKeysInTransactions([sender_public_address]);

            if (balances[sender_public_address] >= (tip + amount + amount_in_transactions[sender_public_address])) { // Have balance and create transaction

                let transaction = await TransactionLib.createDomainTransaction(sender_public_address, sender_transition_key, domain, extension, servers, tip, amount, days, description);

                transaction.signature = await signData(private_key, JSON.stringify(transaction))

                let added_transaction = await TransactionLib.getTransitions();
                if (await BlockChainLib.checkIsTransitionsRulesValid([...added_transaction, transaction]) === false) {
                    res.send({ success: false, error: "THERE_IS_A_OPENED_TRANSACTION_TO_THIS_DOMAIN_ALREADY" });
                    return;
                }

                await TransactionLib.addTransition(transaction);

                // Max transactoin
                if ((await TransactionLib.countOpenedTransitions() + 1) >= MAX_TRANSITIONS) {
                    if (IS_MINER === true) {
                        await MineService.mineBlock();
                    }
                }

                res.send({ success: true, metadata: transaction });
                return;

            } else {

                res.send({
                    success: false,
                    error: "WITHDRAW_BALANCE",
                    metadata: {
                        balance: balances[sender_public_address],
                        amount_in_transaction: amount_in_transactions[sender_public_address],
                    }
                });
                return;

            }

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async updateUpdateDomain(req: any, res: any) {

        try {

            let {
                private_key,
                domain,
                extension,
                servers,
                description,
                tip
            } = req.body.private_key
                    ? req.body
                    : req.query;

            if (tip < MIN_TRANSACTION_TIP) {
                res.send({ success: false, error: "LITTLE_TIP" });
                return;
            }

            let sender_public_address = await WalletLib.getPublicKey(private_key);
            let sender_transition_key = await WalletLib.getTransitionKey(private_key);

            let domain_contracts = await BlockChainLib.getDomainBalance(domain, extension);

            if (domain_contracts.contracts.length > 0) {

                if (sender_public_address == domain_contracts.contracts[0].sender) { } else {

                    res.send({ success: false, error: "DOMAIN_ISENT_YOUR", owner: domain_contracts.contracts[0].sender });
                    return;

                }

            }

            let balances = await BlockChainLib.getAmountByArrPublicAddresses([sender_public_address]);
            let amount_in_transactions = await TransactionLib.getAmountByArrPublicKeysInTransactions([sender_public_address]);

            if (balances[sender_public_address] >= (tip + amount_in_transactions[sender_public_address])) { // Have balance and create transaction

                // Adiciona a mudança de server
                let transaction = await TransactionLib.createUpdateDomainTransaction(sender_public_address, sender_transition_key, domain, extension, servers, tip, description);
                transaction.signature = await signData(private_key, JSON.stringify(transaction))

                let added_transaction = await TransactionLib.getTransitions();
                if (await BlockChainLib.checkIsTransitionsRulesValid([...added_transaction, transaction]) === false) {
                    res.send({ success: false, error: "THERE_IS_A_OPENED_TRANSACTION_TO_THIS_DOMAIN_ALREADY" });
                    return;
                }

                await TransactionLib.addTransition(transaction);

                // Max transactoin
                if ((await TransactionLib.countOpenedTransitions() + 1) >= MAX_TRANSITIONS) {
                    if (IS_MINER === true) {
                        await MineService.mineBlock();
                    }
                }

                res.send({ success: true, metadata: transaction });
                return;

            } else {

                res.send({
                    success: false,
                    error: "WITHDRAW_BALANCE",
                    metadata: {
                        balance: balances[sender_public_address],
                        amount_in_transaction: amount_in_transactions[sender_public_address],
                    }
                });
                return;

            }

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async addAlias(req: any, res: any) {

        try {

            let {
                private_key,
                alias,
                tip,
                description,
            } = req.body.private_key
                    ? req.body
                    : req.query;

            if (tip < MIN_TRANSACTION_TIP) {
                res.send({ success: false, error: "LITTLE_TIP" });
                return;
            }

            let sender_public_address = await WalletLib.getPublicKey(private_key);
            let sender_transition_key = await WalletLib.getTransitionKey(private_key);

            // @valida se esse alias esta sendo usada por outra conta
            let public_address = await BlockChainLib.getPublicAddressByAlias(alias);
            if (public_address && public_address.length > 3) {

                let message: string = "THIS_DOMAIN_IS_RESERVED";
                if (public_address === sender_public_address) {
                    message = "THIS_DOMAIN_IS_YOUR_ALREADY";
                }

                res.send({ success: false, error: message });
                return;

            }

            let address = await blockChainLib.getPublicAddressByAlias(alias);
            if (address && address.length > 0) {

                if (address == sender_public_address) {
                    res.send({ success: false, error: "ALIAS_IS_YOUR_ALREADY", metadata: { address: address } });
                    return;
                } else {
                    res.send({ success: false, error: "ALIAS_IS_SELECTED_ALREADY", metadata: { address: address } });
                    return;
                }

            }

            let balances = await BlockChainLib.getAmountByArrPublicAddresses([sender_public_address]);
            let amount_in_transactions = await TransactionLib.getAmountByArrPublicKeysInTransactions([sender_public_address]);

            if (balances[sender_public_address] >= (tip + amount_in_transactions[sender_public_address])) { // Have balance and create transaction

                // Add Alias
                let transaction = await TransactionLib.createAliasTransaction(sender_public_address, sender_transition_key, alias, tip, description);

                transaction.signature = await signData(private_key, JSON.stringify(transaction))

                let added_transaction = await TransactionLib.getTransitions();
                if (await BlockChainLib.checkIsTransitionsRulesValid([...added_transaction, transaction]) === false) {
                    res.send({ success: false, error: "THERE_IS_A_OPENED_ALIAS_TRANSACTION_TO_THIS_PUBLIC_ADDRESS_ALREADY" });
                    return;
                }

                await TransactionLib.addTransition(transaction);

                // Max transactoin
                if ((await TransactionLib.countOpenedTransitions() + 1) >= MAX_TRANSITIONS) {
                    if (IS_MINER === true) {
                        await MineService.mineBlock();
                    }
                }

                res.send({ success: true, metadata: transaction });
                return;

            } else {

                res.send({
                    success: false,
                    error: "WITHDRAW_BALANCE",
                    metadata: {
                        balance: balances[sender_public_address],
                        amount_in_transaction: amount_in_transactions[sender_public_address],
                    }
                });
                return;

            }

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async getTransitionById(req: any, res: any) {

        try {

            let { transaction_id } = req.body.transaction_id
                ? req.body
                : req.query;

            let response = await BlockChainLib.getTransitionByUid(transaction_id);

            res.send({ success: true, metadata: response });
            return;

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async getOpenedTransactionById(req: any, res: any) {

        try {

            let { transaction_id } = req.body.transaction_id
                ? req.body
                : req.query;

            let response = await TransactionLib.getTransitions();

            let arr_transaction = response.filter((obj: any) => obj.uid == transaction_id);

            let metadata: any = null;
            if (arr_transaction && arr_transaction[0]) {
                metadata = arr_transaction[0]
            }

            res.send({ success: true, metadata: metadata });
            return;

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

}

export default new TransactionController();