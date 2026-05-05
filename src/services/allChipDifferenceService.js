import RequestOrder from "../models/order.js";
import Delivery from "../models/delivery.js";

export const calculateChipDifference = async () => {
    const banks = await RequestOrder.findAll({ attributes: ['bank'], group: ['bank'] });
    const result = {};

    for (const bankObj of banks) {
        const bank = bankObj.bank;
        const chipsReceived = await RequestOrder.sum("chipsReceived", { where: { bank } });
        const chipsDelivered = await Delivery.sum("chipsdelivered", { where: { bank } });

        result[bank] = {
            chipsReceived,
            chipsDelivered,
            difference: chipsReceived - chipsDelivered
        };
    }

    return result;
};