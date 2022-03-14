// import blockchainService from './../app/services/blockChainService'
// import walletService from './../app/services/walletService'

// import p2pLib from "../app/libraries/p2pLib";
// import walletLib from "../app/libraries/walletLib";
// import transactionsLib from '../app/libraries/transactionsLib';
// import blockChainLib from "../app/libraries/blockChainFileLib";
// import punishmentLib from "../app/libraries/punishmentLib";

// import { getParams } from "./../app/utils/cliUtils"
// import { verifySign } from './../app/utils/signUtil'

// import { MIN_TIP_TO_TRANSACTIONS, MAX_OBSERVATION_LENGTH, MAX_TRANSACTIONS_PER_BLOCK } from '../configs/iol_config';
// import { holder_transaction, nft, nft_transaction, transfer_transaction } from '../app/types';

// import transactionsLib from "../app/libraries/transactionsLib";
// import type { transactions, transfer_transaction, holder_transaction, award_transaction } from './../app/types'
// import { MAX_TRANSACTIONS_PER_BLOCK } from './../configs/iol_config'
// import BlockchainController from './../app/controllers/blockchainController'
// import logLib from "../app/libraries/logLib";

class Socket {

    io: any;

    constructor(io: any) {
        this.io = io;
        // this.upSocketRequests()
    }

    // async upSocketRequests(): Promise<void> {

    //     // Start p2p
    //     let cli_params = getParams();
    //     await p2pLib.setLocalNode(cli_params.private_key, await walletLib.getPublicKey(cli_params.private_key));

    //     // Read Socket Events
    //     this.io.on('connection', (socket: any) => {

    //         // Connect with other node
    //         socket.on('connected', async (remote_node: any) => {

    //             // Servidor ainda esta se conectando ao socket
    //             if (await p2pLib.checkAuthenticity(remote_node) !== true) {
    //                 return false;
    //             }

    //             let connected_nodes = await p2pLib.listNodes();
    //             if (connected_nodes.indexOf(remote_node.remote_ip) < 0) {
    //                 p2pLib.addNode(remote_node.address);
    //                 p2pLib.refreshRemoteNode(remote_node);
    //             }

    //         });

    //         // Request to see other nodes connected with p2p
    //         socket.on('discover', async (params: any) => {

    //             if (await p2pLib.checkAuthenticity(params) !== true) {
    //                 return false;
    //             }

    //             await p2pLib.sendEventToIp(params.authenticity.url, "discover_response", { nodes: await p2pLib.listNodes() });

    //         });

    //         socket.on('discover_response', async (arr_remote_nodes: any) => {

    //             if (await p2pLib.checkAuthenticity(arr_remote_nodes) !== true) {
    //                 return false;
    //             }

    //             for (let i in arr_remote_nodes.nodes) {
    //                 p2pLib.addNode(arr_remote_nodes.nodes[i].address);

    //                 // Aproveitar e atualizar dados como chain_hash
    //                 await p2pLib.refreshRemoteNode(arr_remote_nodes.nodes[i], false);

    //             }

    //         });

    //         // Add remote transaction to process, the transaction can be Create NFT/Transfer NFT or Crypto Transfer
    //         socket.on('transaction', async (params: any) => {

    //             if (await p2pLib.checkAuthenticity(params) !== true) {
    //                 return false;
    //             }

    //             let type_of_transaction = await this._getTypeOfTransaction(params);

    //             if (type_of_transaction === "create_nft") {

    //                 let is_authenticated_transaction = await this._validateCreateNFT(params);
    //                 if (is_authenticated_transaction === false) {
    //                     return false;
    //                 }

    //                 let transaction = <nft>params.transaction;

    //                 let has_balance = await blockchainService.hasWalletBalance(transaction.reciver, transaction.tip);
    //                 if (has_balance === false) {
    //                     return false;
    //                 }

    //                 // @TODO SUCCESS! Adicionar transação
    //                 console.log('SUCESSO! ' + type_of_transaction)

    //             }

    //             if (type_of_transaction === "transfer_nft") {

    //                 let is_authenticated_transaction = await this._validateTransferNFT(params);
    //                 if (is_authenticated_transaction === false) {
    //                     return false;
    //                 }

    //                 let transaction = <nft_transaction>params.transaction;

    //                 let has_balance = await blockchainService.hasWalletBalance(transaction.sender, transaction.tip);
    //                 if (has_balance === false) {
    //                     return false;
    //                 }

    //                 // @TODO SUCCESS! Adicionar transação
    //                 console.log('SUCESSO! ' + type_of_transaction)

    //             }

    //             if (type_of_transaction === "holder") {

    //                 let is_authenticated_transaction = await this._validateTransferHolder(params);
    //                 if (is_authenticated_transaction === false) {
    //                     return false;
    //                 }

    //                 let transaction = <holder_transaction>params.transaction;

    //                 let has_balance = await blockchainService.hasWalletBalance(transaction.sender, transaction.tip);
    //                 if (has_balance === false) {
    //                     return false;
    //                 }

    //                 // @TODO SUCCESS! Adicionar transação
    //                 console.log('SUCESSO! ' + type_of_transaction)

    //             }

    //             if (type_of_transaction === "transfer") {

    //                 await this._validateTransferValue(params);
    //                 let is_authenticated_transaction = await this._validateTransferValue(params);
    //                 if (is_authenticated_transaction === false) {
    //                     return false;
    //                 }

    //                 let transaction = <transfer_transaction>params.transaction;

    //                 let has_balance = await blockchainService.hasWalletBalance(transaction.sender, (transaction.tip + transaction.amount));
    //                 if (has_balance === false) {
    //                     return false;
    //                 }

    //                 // @TODO SUCCESS! Adicionar transação
    //                 console.log('SUCESSO! ' + type_of_transaction)

    //             }

    //         });

    //         // New block Added
    //         socket.on('block', async (params: any) => {

    //             if (await p2pLib.checkAuthenticity(params) !== true) {
    //                 return false;
    //             }

    //             let isValidBlock = await this._validateBlock(params);
    //             if (isValidBlock === false) {
    //                 return false;
    //             }

    //             let isValidTransactions = await this._validateBlockTransactions(params);
    //             if (isValidTransactions === false) {
    //                 return false;
    //             }

    //         });

    //     });

    //     // Initial external connection
    //     if (cli_params.nodes && cli_params.nodes.length > 0) {
    //         for (let i in cli_params.nodes) {
    //             await p2pLib.addNode(cli_params.nodes[i]);
    //         }
    //     }

    // }

    // // Helpers
    // async _getTypeOfTransaction(remote_transaction: any): Promise<string> {

    //     let transaction = remote_transaction.transaction;

    //     if (!transaction || !transaction.type) {
    //         return "";
    //     }

    //     switch (transaction.type) {

    //         case "nft":

    //             if (transaction.hasOwnProperty('sender')) { // NFT Transfer
    //                 return "transfer_nft";
    //             } else {
    //                 return "create_nft";
    //             }

    //         case "holder":
    //             return "holder";
    //         case "transfer":
    //             return "transfer";
    //         default:
    //             return "";

    //     }

    // }

    // // Transactions

    // async _validateTransferNFT(params: any): Promise<boolean> {

    //     let transaction = <nft_transaction>params.transaction;

    //     if (!transaction.signature) {
    //         return false;
    //     }

    //     // Check if the transaction was signed with private key
    //     if (await verifySign(params.transaction_authenticy.transition_key, JSON.stringify(transaction), params.transaction_authenticy.signature) !== true) {
    //         return false;
    //     }

    //     // Check if transition key is of sender wallet
    //     if (await walletLib.checkTransitionKeyWithPublicKey(params.transaction_authenticy.transition_key, transaction.sender) !== true) {
    //         return false;
    //     }

    //     if (await walletService.isValidAddress(transaction.sender) === false || await walletService.isValidAddress(transaction.reciver) === false) {
    //         return false;
    //     }

    //     if (transaction.tip < MIN_TIP_TO_TRANSACTIONS) {
    //         return false;
    //     }

    //     if (transaction.observation.length > MAX_OBSERVATION_LENGTH) {
    //         return false;
    //     }

    //     if (await transactionsLib.getTransactionBySignature(transaction.signature) !== null) {
    //         return false;
    //     }

    //     if (await transactionsLib.isValidSignature(transaction, transaction.signature) === false) {
    //         return false;
    //     }

    //     return true;

    // }

    // async _validateCreateNFT(params: any): Promise<boolean> {

    //     let transaction = <nft>params.transaction;

    //     if (!transaction.signature) {
    //         return false;
    //     }

    //     let creator_authenticy = params.transaction_authenticy.creator;
    //     let reciver_authenticy = params.transaction_authenticy.reciver;

    //     // Check if the transaction was signed with private key
    //     if (await verifySign(creator_authenticy.transition_key, JSON.stringify(transaction), creator_authenticy.signature) !== true) {
    //         return false;
    //     }

    //     if (await verifySign(reciver_authenticy.transition_key, JSON.stringify(transaction), reciver_authenticy.signature) !== true) {
    //         return false;
    //     }

    //     // Check if sign correspond wallet address
    //     if (await walletLib.checkTransitionKeyWithPublicKey(creator_authenticy.transition_key, transaction.creator) !== true) {
    //         return false;
    //     }

    //     if (await walletLib.checkTransitionKeyWithPublicKey(reciver_authenticy.transition_key, transaction.reciver) !== true) {
    //         return false;
    //     }

    //     if (transaction.tip < MIN_TIP_TO_TRANSACTIONS) {
    //         return false;
    //     }

    //     if (transaction.observation.length > MAX_OBSERVATION_LENGTH) {
    //         return false;
    //     }

    //     if (await transactionsLib.getTransactionBySignature(transaction.signature) !== null) {
    //         return false;
    //     }

    //     if (await transactionsLib.isValidSignature(transaction, transaction.signature) === false) {
    //         return false;
    //     }

    //     return true;

    // }


    // async _validateTransferHolder(params: any): Promise<boolean> {

    //     let transaction = <holder_transaction>params.transaction;

    //     if (!transaction.signature) {
    //         return false;
    //     }

    //     // Check if the transaction was signed with private key
    //     if (await verifySign(params.transaction_authenticy.transition_key, JSON.stringify(transaction), params.transaction_authenticy.signature) !== true) {
    //         return false;
    //     }

    //     // Check if transition key is of sender wallet
    //     if (await walletLib.checkTransitionKeyWithPublicKey(params.transaction_authenticy.transition_key, transaction.sender) !== true) {
    //         return false;
    //     }

    //     if (await walletService.isValidAddress(transaction.sender) === false) {
    //         return false;
    //     }

    //     if (transaction.tip < MIN_TIP_TO_TRANSACTIONS) {
    //         return false;
    //     }

    //     if (await transactionsLib.getTransactionBySignature(transaction.signature) !== null) {
    //         return false;
    //     }

    //     if (await transactionsLib.isValidSignature(transaction, transaction.signature) === false) {
    //         return false;
    //     }

    //     return true;

    // }

    // async _validateTransferValue(params: any): Promise<boolean> {

    //     let transaction = <transfer_transaction>params.transaction;

    //     if (!transaction.signature) {
    //         return false;
    //     }

    //     // Check if the transaction was signed with private key
    //     if (await verifySign(params.transaction_authenticy.transition_key, JSON.stringify(transaction), params.transaction_authenticy.signature) !== true) {
    //         return false;
    //     }

    //     // Check if transition key is of sender wallet
    //     if (await walletLib.checkTransitionKeyWithPublicKey(params.transaction_authenticy.transition_key, transaction.sender) !== true) {
    //         return false;
    //     }

    //     if (await walletService.isValidAddress(transaction.sender) === false || await walletService.isValidAddress(transaction.reciver) === false) {
    //         return false;
    //     }

    //     if (transaction.tip < MIN_TIP_TO_TRANSACTIONS) {
    //         return false;
    //     }

    //     if (transaction.observation.length > MAX_OBSERVATION_LENGTH) {
    //         return false;
    //     }

    //     if (await transactionsLib.getTransactionBySignature(transaction.signature) !== null) {
    //         return false;
    //     }

    //     if (await transactionsLib.isValidSignature(transaction, transaction.signature) === false) {
    //         return false;
    //     }

    //     return true;

    // }


    // // Block

    // async _validateBlock(params: any): Promise<boolean> {

    //     // Pré validação se o bloco ja foi inserido
    //     let last_blocks: any = await blockChainLib.getLastBlocks(100);
    //     if ((await last_blocks.map((obj: any) => obj.hash)).indexOf(params.block.hash) > -1) {
    //         return false;
    //     }

    //     let node_wallet_address = params.authenticity.node_wallet;
    //     let holder_wallet_address = await walletLib.convertTransitionKeyToPublicKey(params.holder_authenticity.transition_key);

    //     // Verifico se o node é valido e se o holder também valido com assinatura e após, pegando o node pelo holder
    //     if (await verifySign(params.holder_authenticity.transition_key, JSON.stringify(params.block), params.holder_authenticity.signature) !== true) {
    //         return false;
    //     }

    //     // Verifica se o holder está no server que enviou o bloco
    //     if (await blockChainLib.isHolderInNodeAddress(holder_wallet_address, node_wallet_address) === false) {
    //         return false;
    //     }

    //     // Valida de a blockchain atual é valida
    //     if (await blockChainLib.isValidBlockChain(transactionsLib.isValidSignature) === false) {
    //         // @todo sincronizar
    //         return false;
    //     }

    //     ///////

    //     let last_block: any = (await blockChainLib.getLastBlocks(1))[0];
    //     let blocks_to_validation: any = await blockChainLib.getLastBlocks(300);
    //     let online_node_wallets = await (await p2pLib.getOnlineNodes()).map(obj => obj.node_wallet);
    //     let responsable_node_address = await blockChainLib.getResponsableNode();
    //     let blockchain_counter = await blockChainLib.getCounter();

    //     // Se o bloco não for redirecionado pra mim
    //     if (node_wallet_address !== responsable_node_address) {
    //         return false;
    //     }

    //     if (blockchain_counter > 1 && await blockChainLib.getResponsableNode() == node_wallet_address) {
    //         //logLib.showLog('socket_new_block', 'Servidor passado não minerou, então segue os mineradores antigos')
    //     } else if ((await punishmentLib.IsNodeInPunishment(blocks_to_validation, await blockChainLib.holderPerNode(online_node_wallets), node_wallet_address)) === true) {
    //         //logLib.showLog('socket_new_block', 'Cota de participação excedida')
    //         return false;
    //     }

    //     // Valido se o proximo bloco da blockchain local vai ter o mesmo hash do bloco passado
    //     let hash: any = await blockChainLib.getHash(transactionsLib.isValidSignature, last_block);
    //     if (hash !== params.block.hash) {
    //         // Inserido porém com bifurcação em alguma parte

    //         // logLib.showLog('socket_new_block', 'Hashs diferentes, desatualizado... sincronize')
    //         // syncronize();
    //         return false;
    //     }

    //     // Valida de a blockchain apois a insercao do bloco, vai continuar sendo valida
    //     if (!await blockChainLib.isValidBlockChain(transactionsLib.isValidSignature, params.block)) {
    //         // logLib.showLog('socket_new_block', 'Blockchain invalida, sincronize')
    //         // syncronize();
    //         return false;
    //     }

    //     return true;

    // }

    // async _validateBlockTransactions(params: any) {

    //     let node_wallet_address = params.authenticity.node_wallet;
    //     let transactions = params.block.transactions;

    //     if (!transactions) {
    //         return false;
    //     }

    //     if (transactions.length === 0) {
    //         return false;
    //     }

    //     if (transactions.length > MAX_TRANSACTIONS_PER_BLOCK) {
    //         return false;
    //     }

    //     for (let i in transactions) {

    //         if (transactions[i].type === "transfer") {
    //             // await this._validateBlockTransactionTransfer(transactions[i]);
    //         }

    //         if (transactions[i].type === "holder") {

    //         }

    //         if (transactions[i].type === "nft") {

    //             if (transactions[i].hasOwnProperty('sender')) { // NFT Transfer

    //             } else {

    //             }

    //         }

    //     }

    //     return true;

    // }

    // async _validateBlockTransactionTransfer(transaction: any) {

    //     // let transaction = <transfer_transaction>transaction;

    //     // if (!transaction.signature) {
    //     //     return false;
    //     // }

    //     // // Check if the transaction was signed with private key
    //     // if (await verifySign(params.transaction_authenticy.transition_key, JSON.stringify(transaction), params.transaction_authenticy.signature) !== true) {
    //     //     return false;
    //     // }

    //     // // Check if transition key is of sender wallet
    //     // if (await walletLib.checkTransitionKeyWithPublicKey(params.transaction_authenticy.transition_key, transaction.sender) !== true) {
    //     //     return false;
    //     // }

    //     // if (await walletService.isValidAddress(transaction.sender) === false || await walletService.isValidAddress(transaction.reciver) === false) {
    //     //     return false;
    //     // }

    //     // if (transaction.tip < MIN_TIP_TO_TRANSACTIONS) {
    //     //     return false;
    //     // }

    //     // if (transaction.observation.length > MAX_OBSERVATION_LENGTH) {
    //     //     return false;
    //     // }

    //     // if (await transactionsLib.getTransactionBySignature(transaction.signature) !== null) {
    //     //     return false;
    //     // }

    //     // if (await transactionsLib.isValidSignature(transaction, transaction.signature) === false) {
    //     //     return false;
    //     // }

    //     // return true;

    // }

    // // upSocketRequests(): void {

    // //     this.io.on('connection', (socket: any) => {

    // //         // ## CONNECTIONS COMMUNICATION

    // //         // Connect with other node
    // //         socket.on('connected', async (remote_node: any) => {

    // //             // Servidor ainda esta se conectando ao socket
    // //             console.log('response 1')
    // //             if (p2pLib.p2p_started === false) {
    // //                 return false;
    // //             }
    // //             console.log('response 2', remote_node)
    // //             console.log(await p2pLib.checkAuthenticity(remote_node))
    // //             // if (await p2pLib.checkAuthenticity(remote_node) !== true) {
    // //             //     return false;
    // //             // }
    // //             console.log('response 3')
    // //             let connected_nodes = await p2pLib.listNodes();
    // //             if (connected_nodes.indexOf(remote_node.remote_ip) < 0) {
    // //                 console.log('response 4')
    // //                 p2pLib.addNode(remote_node.address);
    // //                 p2pLib.refreshRemoteNode(remote_node);
    // //             }

    // //         });

    // //         // Discover New Connected Nodes
    // //         socket.on('discover_nodes', async (params: any) => {

    // //             if (await p2pLib.checkAuthenticity(params) !== true) {
    // //                 return false;
    // //             }

    // //             await p2pLib.sendEventToIp(params.remote_node.address, "response_discover_nodes", {
    // //                 nodes: await p2pLib.listNodes(),
    // //             })

    // //         })

    // //         // Remote node nodes
    // //         socket.on('response_discover_nodes', async (remote_nodes: any) => {

    // //             if (await p2pLib.checkAuthenticity(remote_nodes) !== true) {
    // //                 return false;
    // //             }

    // //             for (let i in remote_nodes.nodes) {

    // //                 p2pLib.addNode(remote_nodes.nodes[i].address);

    // //                 // Aproveitar e atualizar dados como chain_hash
    // //                 await p2pLib.refreshRemoteNode(remote_nodes.nodes[i], false);

    // //             }

    // //         })

    // //         // ## TRANSACTION
    // //         socket.on('new_nft_transaction', async (remote_transaction: any) => {

    // //             if (await p2pLib.checkAuthenticity(remote_transaction) !== true) {
    // //                 return false;
    // //             }

    // //             // @TODO ver se não tem uma operação aberta... NFT só pode ter uma transação

    // //             if (!remote_transaction.transaction || !remote_transaction.signature || !remote_transaction.transition_key) {
    // //                 return;
    // //             }

    // //             let external_transaction = (remote_transaction.transaction);

    // //             // Precisa adicionar as validações do outro bloco aqui

    // //             if (external_transaction.type && external_transaction.type === "nft") {

    // //                 if (external_transaction.hasOwnProperty('sender')) { // NFT Transfer

    // //                     if (await verifySign(remote_transaction.transition_key, JSON.stringify(remote_transaction.transaction), remote_transaction.signature) !== true) {
    // //                         return;
    // //                     }

    // //                     if (await walletLib.checkTransitionKeyWithPublicKey(remote_transaction.transition_key, remote_transaction.sender) !== true) {
    // //                         return;
    // //                     }

    // //                     //

    // //                     let balances = await blockChainLib.getAmountByArrPublicKeys([remote_transaction.transaction.sender])
    // //                     let amount_in_transactions = await transactionsLib.getAmountByArrPublicKeysInTransactions([remote_transaction.transaction.sender]);

    // //                     if (balances[remote_transaction.transaction.sender] >= (remote_transaction.transaction.tip + amount_in_transactions[remote_transaction.transaction.sender])) {

    // //                         if (await transactionsLib.addRemoteTransaction(remote_transaction.transaction, remote_transaction.transition_key, remote_transaction.signature) === true) {
    // //                             // Propaga pros outros nodes
    // //                             console.log('ADICIONOU A TRNASAÇÃO')
    // //                             p2pLib.sendEvent("new_nft_transaction", { transaction: remote_transaction.transaction, signature: remote_transaction.signature, transition_key: remote_transaction.transition_key })

    // //                             if (MAX_TRANSACTIONS_PER_BLOCK < transactionsLib.countTransactions()) {
    // //                                 await BlockchainController.proccessAddBlock();
    // //                             }

    // //                         }

    // //                     }

    // //                 } else { // Create NFT

    // //                     let obj_signatures = JSON.parse(remote_transaction.signature);
    // //                     let obj_transition_keys = JSON.parse(remote_transaction.transition_key)
    // //                     // console.log(obj_signatures)
    // //                     // Check transition signature

    // //                     // if (await verifySign(transition_key, external_string_transitions, server_signature) !== true) {
    // //                     if (await verifySign(obj_transition_keys.creator, JSON.stringify(remote_transaction.transaction), obj_signatures.creator) !== true) {
    // //                         return;
    // //                     }

    // //                     if (await verifySign(obj_transition_keys.reciver, JSON.stringify(remote_transaction.transaction), obj_signatures.reciver) !== true) {
    // //                         return;
    // //                     }

    // //                     // Check public key

    // //                     if (await walletLib.checkTransitionKeyWithPublicKey(obj_transition_keys.creator, remote_transaction.transaction.creator) !== true) {
    // //                         return;
    // //                     }

    // //                     if (await walletLib.checkTransitionKeyWithPublicKey(obj_transition_keys.reciver, remote_transaction.transaction.reciver) !== true) {
    // //                         return;
    // //                     }

    // //                     //
    // //                     let balances = await blockChainLib.getAmountByArrPublicKeys([remote_transaction.transaction.reciver])
    // //                     let amount_in_transactions = await transactionsLib.getAmountByArrPublicKeysInTransactions([remote_transaction.transaction.reciver]);

    // //                     if (balances[remote_transaction.transaction.reciver] >= (remote_transaction.transaction.tip + amount_in_transactions[remote_transaction.transaction.reciver])) {

    // //                         if (await transactionsLib.addRemoteTransaction(remote_transaction.transaction, remote_transaction.transition_key, remote_transaction.signature) === true) {
    // //                             // Propaga pros outros nodes
    // //                             p2pLib.propagateEmit("new_nft_transaction", { transaction: remote_transaction.transaction, signature: remote_transaction.signature, transition_key: remote_transaction.transition_key })

    // //                         }

    // //                     }

    // //                 }

    // //             }

    // //         })


    // //         // Recive remote node new transaction
    // //         socket.on('new_transaction', async (remote_transaction: any) => {

    // //             if (await p2pLib.checkAuthenticity(remote_transaction) !== true) {
    // //                 return false;
    // //             }

    // //             if (!remote_transaction.transaction || !remote_transaction.signature || !remote_transaction.transition_key) {
    // //                 return;
    // //             }

    // //             let external_transaction = (remote_transaction.transaction);
    // //             let external_string_transitions = JSON.stringify(remote_transaction.transaction);
    // //             let transition_key = remote_transaction.transition_key;
    // //             let server_signature = remote_transaction.signature;

    // //             if (external_transaction.type) {

    // //                 if (await verifySign(transition_key, external_string_transitions, server_signature) !== true) {
    // //                     return;
    // //                 }

    // //                 if (!await transactionsLib.getTransactionBySignature(external_transaction.signature)) {

    // //                     let transaction: any = null;
    // //                     switch (external_transaction.type) {

    // //                         case "holder":
    // //                             transaction = <holder_transaction>external_transaction;
    // //                             break;
    // //                         case "transfer":
    // //                             transaction = <transfer_transaction>external_transaction;
    // //                             break;
    // //                         default:
    // //                             transaction = null;

    // //                     }

    // //                     if (transaction && transaction.sender) {

    // //                         if (await walletLib.checkTransitionKeyWithPublicKey(transition_key, transaction.sender) !== true) {
    // //                             return;
    // //                         }

    // //                         let balances = await blockChainLib.getAmountByArrPublicKeys([transaction.sender])
    // //                         let amount_in_transactions = await transactionsLib.getAmountByArrPublicKeysInTransactions([transaction.sender]);

    // //                         if (transaction.type === "holder") {

    // //                             if (balances[transaction.sender] >= (transaction.amount + amount_in_transactions[transaction.sender])) {
    // //                                 if (await transactionsLib.addRemoteTransaction(transaction, transition_key, server_signature) === true) {
    // //                                     // Propaga pros outros nodes
    // //                                     p2pLib.propagateEmit("new_transaction", { transaction: transaction, transition_key: transition_key, signature: server_signature })

    // //                                 }

    // //                             }

    // //                         } else {

    // //                             if (balances[transaction.sender] >= (transaction.amount + transaction.tip + amount_in_transactions[transaction.sender])) {
    // //                                 if (await transactionsLib.addRemoteTransaction(transaction, transition_key, server_signature) === true) {
    // //                                     // Propaga pros outros nodes
    // //                                     p2pLib.propagateEmit("new_transaction", { transaction: transaction, transition_key: transition_key, signature: server_signature })

    // //                                 }

    // //                             }

    // //                         }

    // //                         if (MAX_TRANSACTIONS_PER_BLOCK < transactionsLib.countTransactions()) {
    // //                             await BlockchainController.proccessAddBlock();
    // //                         }

    // //                     }

    // //                 }

    // //             }

    // //         })

    // //         socket.on('new_block', async (remote_block: any) => {

    // //             console.log('Novo bloco remoto')
    // //             if (await p2pLib.checkAuthenticity(remote_block) !== true) {
    // //                 return false;
    // //             }

    // //             const syncronize = async () => {

    // //                 let remote_nodes = await p2pLib.getRemoteNodes();
    // //                 let arr_addresses = await remote_nodes.map(node => node.address);
    // //                 await blockChainLib.syncronize(arr_addresses);

    // //             }

    // //             // Verifico se os parametros estão chegando
    // //             if (!(remote_block.block && remote_block.server_signatures && remote_block.block_signature && remote_block.transition_key && remote_block.node_address)) {
    // //                 console.log('Log: Parametros inválidos')
    // //                 return;
    // //             }

    // //             logLib.showLog('socket_new_block', 'RECEBEU UM BLOCO EXTERNO PARA ADICIONAR')

    // //             // Valido se o bloco já foi inserido
    // //             let last_blocks: any = await blockChainLib.getLastBlocks(10);
    // //             if ((await last_blocks.map((obj: any) => obj.hash)).indexOf(remote_block.block.hash) > -1) {
    // //                 logLib.showLog('socket_new_block', 'Log: bloco já inserido')
    // //                 return;
    // //             }

    // //             // Verifico se o node é valido e se o holder também valido com assinatura e após, pegando o node pelo holder
    // //             if (await verifySign(remote_block.transition_key, JSON.stringify(remote_block.block), remote_block.block_signature) !== true) {
    // //                 logLib.showLog('socket_new_block', 'Assinatura do holder invalida')
    // //                 return;
    // //             }

    // //             // Verifica se o holder está no server que enviou o bloco
    // //             let holder = await walletLib.convertTransitionKeyToPublicKey(remote_block.transition_key);
    // //             if (await blockChainLib.isHolderInNodeAddress(holder, remote_block.node_address) === false) {
    // //                 logLib.showLog('socket_new_block', 'Holder não identificado no node ' + remote_block.node_address)
    // //                 return;
    // //             }

    // //             // Valida de a blockchain atual é valida
    // //             if (await blockChainLib.isValidBlockChain(transactionsLib.isValidSignature) === false) {
    // //                 logLib.showLog('socket_new_block', 'blockchain atual invalida')
    // //                 syncronize();
    // //                 return;
    // //             }

    // //             let last_block: any = (await blockChainLib.getLastBlocks(1))[0];
    // //             let blocks_to_validation: any = await blockChainLib.getLastBlocks(300);
    // //             let online_node_wallets = await (await p2pLib.getOnlineNodes()).map(obj => obj.node_wallet);
    // //             let responsable_node_address = await blockChainLib.getResponsableNode();
    // //             let blockchain_counter = await blockChainLib.getCounter();


    // //             logLib.showLog('socket_new_block', 'Responsavel por adicionar o bloco: ' + responsable_node_address)

    // //             // Se o bloco não for redirecionado pra mim
    // //             if (remote_block.node_address !== responsable_node_address) {
    // //                 logLib.showLog('socket_new_block', 'bloco não direcionado nao é desse node')
    // //                 return;
    // //             }

    // //             if (blockchain_counter > 1 && await blockChainLib.getResponsableNode() == remote_block.node_address) {
    // //                 logLib.showLog('socket_new_block', 'Servidor passado não minerou, então segue os mineradores antigos')
    // //             } else if ((await punishmentLib.IsNodeInPunishment(blocks_to_validation, await blockChainLib.holderPerNode(online_node_wallets), remote_block.node_address)) === true) {
    // //                 logLib.showLog('socket_new_block', 'Cota de participação excedida')
    // //                 return;
    // //             }

    // //             // Valido se o proximo bloco da blockchain local vai ter o mesmo hash do bloco passado
    // //             let hash: any = await blockChainLib.getHash(transactionsLib.isValidSignature, last_block);
    // //             if (hash !== remote_block.block.hash) {
    // //                 logLib.showLog('socket_new_block', 'Hashs diferentes, desatualizado... sincronize')
    // //                 syncronize();
    // //                 return;
    // //             }

    // //             // Valida de a blockchain apois a insercao do bloco, vai continuar sendo valida
    // //             if (!await blockChainLib.isValidBlockChain(transactionsLib.isValidSignature, remote_block.block)) {
    // //                 logLib.showLog('socket_new_block', 'Blockchain invalida, sincronize')
    // //                 syncronize();
    // //                 return;
    // //             }

    // //             // Verifico as transações e sua assinaturas pra ver se são válidas
    // //             let counter = 0;
    // //             for (let i in remote_block.block.transactions) {

    // //                 if (remote_block.block.transactions[i].type === "transfer" || remote_block.block.transactions[i].type === "holder") {

    // //                     ++counter;

    // //                     if (counter > MAX_TRANSACTIONS_PER_BLOCK) {
    // //                         continue;
    // //                     }

    // //                     let signatura = await remote_block.server_signatures.filter((transaction_metadata: any) => transaction_metadata.transition_signature === remote_block.block.transactions[i].signature)

    // //                     if (!signatura[0]) {
    // //                         return;
    // //                     }

    // //                     if (await verifySign(signatura[0].transition_key, JSON.stringify(remote_block.block.transactions[i]), signatura[0].signature) !== true) {
    // //                         return;
    // //                     }

    // //                     if (await walletLib.checkTransitionKeyWithPublicKey(signatura[0].transition_key, remote_block.block.transactions[i].sender) !== true) {
    // //                         return;
    // //                     }

    // //                 }

    // //                 if (remote_block.block.transactions[i].type === "nft") {

    // //                     ++counter;

    // //                     if (counter > MAX_TRANSACTIONS_PER_BLOCK) {
    // //                         continue;
    // //                     }

    // //                     console.log('NFT <<<')

    // //                     // Se a assinatura não esta no meu server, eu não insiro
    // //                     let signatura = await remote_block.server_signatures.filter((transaction_metadata: any) => transaction_metadata.transition_signature === remote_block.block.transactions[i].signature)
    // //                     console.log('NFT 2 ', signatura)
    // //                     if (!signatura[0]) {
    // //                         return;
    // //                     }

    // //                     console.log(remote_block.block.transactions[i].hasOwnProperty('sender'));

    // //                     if (remote_block.block.transactions[i].hasOwnProperty('sender')) { // NFT Transfer
    // //                         console.log('aaaaaa1')
    // //                         ++counter;

    // //                         if (counter > MAX_TRANSACTIONS_PER_BLOCK) {
    // //                             continue;
    // //                         }
    // //                         console.log('aaaaaa2')
    // //                         let signatura = await remote_block.server_signatures.filter((transaction_metadata: any) => transaction_metadata.transition_signature === remote_block.block.transactions[i].signature)
    // //                         console.log('aaaaaa3')
    // //                         if (!signatura[0]) {
    // //                             return;
    // //                         }
    // //                         console.log('aaaaaa4', signatura[0])
    // //                         if (await verifySign(signatura[0].transition_key, JSON.stringify(remote_block.block.transactions[i]), signatura[0].signature) !== true) {
    // //                             return;
    // //                         }
    // //                         console.log('aaaaaa5')
    // //                         if (await walletLib.checkTransitionKeyWithPublicKey(signatura[0].transition_key, remote_block.block.transactions[i].sender) !== true) {
    // //                             return;
    // //                         }

    // //                         console.log('aaaaaa6')

    // //                     } else { // Create NFT

    // //                         let obj_signatures = JSON.parse(signatura[0].signature);
    // //                         let obj_transition_keys = JSON.parse(signatura[0].transition_key)

    // //                         if (await verifySign(obj_transition_keys.creator, JSON.stringify(remote_block.block.transactions[i]), obj_signatures.creator) !== true) {
    // //                             return;
    // //                         }

    // //                         if (await verifySign(obj_transition_keys.reciver, JSON.stringify(remote_block.block.transactions[i]), obj_signatures.reciver) !== true) {
    // //                             return;
    // //                         }

    // //                         console.log('aaa');

    // //                         // Check public key

    // //                         if (await walletLib.checkTransitionKeyWithPublicKey(obj_transition_keys.creator, remote_block.block.transactions[i].creator) !== true) {
    // //                             return;
    // //                         }

    // //                         if (await walletLib.checkTransitionKeyWithPublicKey(obj_transition_keys.reciver, remote_block.block.transactions[i].reciver) !== true) {
    // //                             return;
    // //                         }
    // //                         console.log('check nft 2 - a')

    // //                     }

    // //                 }

    // //             }

    // //             // Repetir a validação de blocos ao final... desenvargo de conciencia
    // //             last_blocks = await blockChainLib.getLastBlocks(10);
    // //             if ((await last_blocks.map((obj: any) => obj.hash)).indexOf(remote_block.block.hash) > -1) {
    // //                 logLib.showLog('socket_new_block', 'Segunda validacao, bloco já inserido')
    // //                 return;
    // //             }

    // //             // Adiciona o bloco
    // //             logLib.showLog('socket_new_block', 'BLOCO EXTERNO ADICIONADO');
    // //             await blockChainLib.addRemoteBlock(remote_block.block);
    // //             transactionsLib.clearTransactions((await blockChainLib.getLastBlocks(1))[0]);

    // //             // Propaga pro resto da rede
    // //             logLib.showLog('socket_new_block', 'Propaga bloco externo pra rede');

    // //             console.log('EVENTO | Inseriu bloco remoto');
    // //             await p2pLib.propagateEmit("new_block", remote_block);

    // //             await BlockchainController.proccessAddBlock();

    // //         })

    // //     })
    // // }

}

export default Socket;