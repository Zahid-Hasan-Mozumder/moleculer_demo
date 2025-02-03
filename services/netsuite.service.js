"use strict";

const mongoose = require('mongoose');
const Netsuite = require('../model/netsuite.model');

module.exports = {
    name: "netsuite",
    settings: {},
    dependencies: [],
    model: Netsuite,

    actions: {
        notify: {
            params: {
                response: {
                    type: "any",
                    optional: true
                },
                status: {
                    type: "any",
                    optional: true
                }
            },
            async handler(ctx) {
                const { response, status } = ctx.params;

                if (response) {
                    if (response.items[0].itemStatus === "Picked") {
                        var document = {
                            item_fulfillment_id: response.itemFulfillmentId,
                            sales_order_id: response.salesOrderId,
                            items: []
                        }
                        for (var i = 0; i < response.items.length; i++) {
                            document.items.push({
                                item_id: response.items[i].itemId,
                                already_fulfilled: response.items[i].alreadyFulfilled,
                                in_process: response.items[i].inProcess,
                                original_quantity: response.items[i].originalQuantity,
                                remaining: response.items[i].remaining,
                                status_type: response.items[i].statusType,
                                item_status: response.items[i].itemStatus
                            });
                        }
                        const savedItemFulfillment = await this.schema.model.ItemFulfillment.create(document);
                        console.log(savedItemFulfillment);
                    }
                    else {
                        for (var i = 0; i < response.items.length; i++) {
                            await this.schema.model.ItemFulfillment.updateOne(
                                {
                                    item_fulfillment_id: response.itemFulfillmentId,
                                    "items.item_id": response.items[i].itemId
                                },
                                {
                                    $set: {
                                        "items.$.already_fulfilled": response.items[i].alreadyFulfilled,
                                        "items.$.in_process": response.items[i].inProcess,
                                        "items.$.remaining": response.items[i].remaining,
                                        "items.$.status_type": response.items[i].statusType,
                                        "items.$.item_status": response.items[i].itemStatus
                                    }
                                }
                            )
                        }
                        const updatedItemFulfillment = await this.schema.model.ItemFulfillment.findOne({
                            item_fulfillment_id: response.itemFulfillmentId
                        })
                        console.log(updatedItemFulfillment);
                    }
                }

                if (status) {
                    const savedSalesOrder = await this.schema.model.SalesOrder.create({
                        id: status.orderId,
                        status: status.orderStatus
                    })
                    console.log(savedSalesOrder);
                }

                return ctx.params;
            }
        }
    },

    events: {},
    methods: {},
    created() {},
    async started() {},
    async stopped() {}
};
