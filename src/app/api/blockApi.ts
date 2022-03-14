import axios from 'axios';

export const listBlocks = async (external_ip: string, last_index: number | string = "", sort: string = 'ASC') => {

    try {

        let complement_sql = `?sort=${sort}&last_index=${last_index}`;
        let { status, data } = await axios.get(`http://${external_ip}/block/list${complement_sql}`, { timeout: 10000 });

        return data;

    } catch (e: any) {
        return null;
    }

}

export const sendNewBlockSignal = async (remote_ip: string, signal_ip: string, length: number) => {

    try {

        let { status, data } = await axios.post(`http://${remote_ip}/node/block/new`, { signal_ip: signal_ip, length: length }, { timeout: 10000 });

        return data;

    } catch (e: any) {
        return null;
    }

}