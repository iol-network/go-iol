
// import type { cliParams } from './../types'

export const getParams = () => {

    // let params: cliParams = {
    //     start_chain: false,
    //     nodes: [],
    //     port: 80,
    //     server_tax: 0,
    //     private_key: "",
    // };
    // for (let i in process.argv) {

    //     if (process.argv[i].indexOf("--port") > -1) {

    //         let next_index: number = (parseInt(i) + 1);
    //         if (process.argv[next_index] && parseInt(process.argv[next_index]) > 0) {
    //             params.port = parseInt(process.argv[next_index]);
    //         }

    //     }

    //     if (process.argv[i].indexOf("--nodes") > -1) {

    //         let next_index: number = (parseInt(i) + 1);
    //         if (process.argv[next_index] && process.argv[next_index].length > 0 && process.argv[next_index].indexOf('http') > -1) {
    //             params.nodes = process.argv[next_index].split(' ');
    //         }
    //     }

    //     if (process.argv[i].indexOf("--private-key") > -1) {

    //         let next_index: number = (parseInt(i) + 1);
    //         // Check if is valid key
    //         if (process.argv[next_index] && process.argv[next_index].length > 0) {
    //             params.private_key = process.argv[next_index]
    //         }

    //     }

    //     if (process.argv[i].indexOf("--server-tax") > -1) {

    //         let next_index: number = (parseInt(i) + 1);

    //         if (process.argv[next_index] && process.argv[next_index].length > 0) {

    //             let percent = parseFloat(process.argv[next_index]);
    //             if (percent > 0 && percent <= 50) {
    //                 params.server_tax = percent;
    //             } else {
    //                 params.server_tax = 25;
    //             }

    //         } else {
    //             params.server_tax = 25;
    //         }

    //     }

    // }

    // return params;

    return {
        start_chain: false,
        nodes: [],
        port: 80,
        server_tax: 0,
        private_key: "",
    };

}