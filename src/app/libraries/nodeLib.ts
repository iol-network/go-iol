let local_ip = require("ip");
import { PORT } from './../../configs/server_config'
import axios from 'axios';
import { sendNewBlockSignal as sendNewBlockSignalAPI } from './../api/blockApi'

class NodeLib {

    #nodes: Array<string> = [];

    async getLocalNodeAddress(): Promise<string> {
        return `${local_ip.address()}:${PORT}`;
    }

    async addNode(ip: string) {

        if (this.#nodes.indexOf(ip) > -1) {
            return false;
        }

        if (ip == await this.getLocalNodeAddress()) {
            return false;
        }

        // @TODO check server

        this.#nodes.push(ip);

        this.sendRemoteConnectionSignal(ip);

        return true;

    }

    async listNodes(last_node: string | null = null, limit: number = 25): Promise<Array<string>> {

        let response: Array<string> = [];

        let founded = true;
        if (last_node && last_node.length > 0) {
            founded = false;
        }

        for (let i in this.#nodes) {

            if (founded == true) {

                await response.push(this.#nodes[i]);

                if (response.length >= limit) {
                    return response;
                }

            }

            if (founded == false) {
                if (last_node == this.#nodes[i]) {
                    founded = true;
                }
            }

        }

        return response;

    }

    // List nodes in other server
    async listRemoteNodes(external_ip: string, last_node: string | null = null) {

        try {

            let comp_query = last_node && last_node.length > 0 ? `?last_node=${last_node}` : '';

            let { data } = await axios.get(`http://${external_ip}/node/list${comp_query}`, { timeout: 2000 });

            if (data.success && data.success === true) {
                return data.metadata;
            } else {
                return []
            }

        } catch (e: any) {
            console.log(e.message)
            return []
        }

    }

    async sendRemoteConnectionSignal(external_ip: string) {

        try {
            await axios.post(`http://${external_ip}/node/connect`, { node_ip: await this.getLocalNodeAddress() }, { timeout: 2000 });
        } catch (e: any) {

        }

    }

    async sendNewBlockSignal(ip: string, local_ip: string, length: number) {

        for (let i in this.#nodes) {
            sendNewBlockSignalAPI(this.#nodes[i], local_ip, length)
        }

    }

}

export default new NodeLib();
