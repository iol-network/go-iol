/**
 * Application's types
 * 
 * @internal bugs? problems? critics? options? suggestions? send me a e-mail
 * @author Fe Oliveira<felipe.wget@gmail.com>
 * @varsion 0.0.1
 */


// Transactions

export type transaction_transfer_amount = {
    uid: string,
    sender: string,
    reciver: string,
    amount: number,
    tip: number,
    transition_key: string,
    signature?: string,
    observation: string,
    type: 'transfer_amount',
    created_at: number,
};

export type transaction_transfer_nft = {
    uid: string,
    nft_id: string,
    sender: string,
    reciver: string,
    tip: number,
    transition_key: string,
    signature?: string
    observation: string,
    type: 'transfer_nft',
    created_at: number,
};

export type transaction_create_nft = {
    uid: string,
    creator: string,
    reciver: string, // Este vai pagar a criação
    data: string,
    tip: number,
    creator_transition_key: string,
    reciver_transition_key: string,
    creator_signature?: string,
    reciver_signature?: string,
    observation: string,
    type: 'create_nft',
    created_at: number,
};

export type transaction_create_domain = {
    uid: string,
    sender: string,
    domain_name: string,
    extension: string,
    days: number,
    amount: number, // Este valor será devolvido à comunidade nas proximas minerações
    server_addresses?: Array<string>,
    tip: number,
    transition_key: string,
    signature?: string
    observation: string,
    type: 'create_domain',
    created_at: number,
};

export type transaction_update_domain = {
    uid: string,
    sender: string,
    domain_name: string,
    extension: string,
    server_addresses: Array<string>,
    tip: number,
    transition_key: string,
    signature?: string,
    observation: string,
    type: 'update_domain',
    created_at: number,
};

export type transaction_award = {
    uid: string,
    reciver: string,
    amount: number,
    observation: string,
    tip: number,
    signature?: string,
    type: 'award',
    created_at: number,
}

export type transaction_create_alias = {
    uid: string,
    sender: string,
    alias: string,
    observation: string,
    tip: number,
    transition_key: string,
    signature?: string,
    type: 'alias',
    created_at: number,
}

export type transactions = Array<transaction_transfer_amount | transaction_transfer_nft | transaction_create_nft | transaction_create_domain | transaction_update_domain | transaction_award | transaction_create_alias>;

// Blocks

export type block = {
    index: number,
    previous_hash: string
    transactions: transactions,
    proof: string,
    created_at: number,
}

export type blockchain = Array<block>;