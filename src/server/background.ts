// import BlockchainController from './../app/controllers/blockchainController';
// import blockChainLib from "../app/libraries/blockChainFileLib";
// import transactionsLib from "../app/libraries/transactionsLib";
// import p2pLib from "../app/libraries/p2pLib";
// import config from './../configs/server_config';
import NodeService from "../app/services/nodeService";

class Background {

    #is_dicovering: boolean = false;

    constructor() {

        this.discoverNodes();

    }

    async discoverNodes() {

        setInterval(async () => {

            if (this.#is_dicovering === false) {

                this.#is_dicovering = true;
                await NodeService.discoverExternalNodes();
                this.#is_dicovering = false;

            }

        }, 10000);

    }

}

export default Background;