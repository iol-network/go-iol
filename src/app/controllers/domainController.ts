import BlockChainLib from '../libraries/blockChainLib';
import TransactionLib from '../libraries/transactionLib'

class DomainController {

    async getDNS(req: any, res: any) {

        try {

            let {
                domain,
                extension
            } = req.body.domain
                    ? req.body
                    : req.query;

            if (await TransactionLib.isValisDomain(domain, extension) === false) {
                res.send({ success: false, error: "INVALID_DOMAIN" });
                return;
            }

            let response = await BlockChainLib.getDNS(domain, extension);

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

    async getDNSContracts(req: any, res: any) {

        try {

            let {
                domain,
                extension
            } = req.body.domain
                    ? req.body
                    : req.query;

            if (await TransactionLib.isValisDomain(domain, extension) === false) {
                res.send({ success: false, error: "INVALID_DOMAIN" });
                return;
            }

            let domain_contracts = await BlockChainLib.getDomainBalance(domain, extension);

            res.send({ success: true, metadata: domain_contracts });
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

export default new DomainController();