import BlockChainLib from '../libraries/blockChainLib';
import NodeLib from './../libraries/nodeLib';

class NodeService {

    // Param ip is to check specific IP or check new nodes in my added nodes... if null
    async discoverExternalNodes(ip: string | null = null) {

        let finished = false;
        let last_id: string | null = null;

        const getIps = async () => {

            return ip && ip.length > 0
                ? await NodeLib.listRemoteNodes(ip, last_id)
                : await NodeLib.listNodes(last_id);

        }

        while (!finished) {

            let arr_ips = await getIps();

            for (let i in arr_ips) {

                await NodeLib.addNode(arr_ips[i]);

                last_id = arr_ips[i];

            }

            if (arr_ips.length < 1) {
                finished = true;
                break;
            }

        }

    }

    async preccessNewBlock(remote_ip: string, remote_length: number): Promise<void> {

        let length = await BlockChainLib.getBlockChainLength();

        if (remote_length > length) {
            await BlockChainLib.updateWithRemoteChain(remote_ip);
        }

    }

    async propagateNewBlock() {

        let length = await BlockChainLib.getBlockChainLength();
        let local_ip = await NodeLib.getLocalNodeAddress();
        let finished = false;
        let last_id: string | null = null;

        while (!finished) {

            let arr_ips: any = await NodeLib.listNodes(last_id);

            for (let i in arr_ips) {

                NodeLib.sendNewBlockSignal(arr_ips[i], local_ip, length)
                last_id = arr_ips[i];
            }

            if (arr_ips.length < 1) {
                finished = true;
                break;
            }

        }

    }

}

export default new NodeService();