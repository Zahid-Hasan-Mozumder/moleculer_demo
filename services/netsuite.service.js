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
                    type: "array",
                    items: "any",
                    optional: true
                },
                status: {
                    type: "any",
                    optional: true
                }
            },
            async handler(ctx) {
                const { response, status } = ctx.params;
                console.log(response);
                console.log(status);
                if (response) {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].itemStatus === "Picked") {
                            const savedItemFulfillment = await this.schema.model.ItemFulfillment.create({
                                item_fulfillment_id: response[i].itemFulfillmentId,
                                sales_order_id: response[i].salesOrderId,
                                item_id: response[i].itemId,
                                already_fulfilled: response[i].alreadyFulfilled,
                                in_process: response[i].inProcess,
                                original_quantity: response[i].originalQuantity,
                                remaining: response[i].remaining,
                                status_type: response[i].statusType,
                                item_status: response[i].itemStatus
                            })
                            console.log(savedItemFulfillment);
                        }
                        else {
                            const updatedItemFulfillment = await this.schema.model.ItemFulfillment.updateOne(
                                {
                                    item_fulfillment_id: response[i].itemFulfillmentId,
                                    item_id : response[i].itemId
                                },
                                {
                                    $set: {
                                        already_fulfilled: response[i].alreadyFulfilled,
                                        in_process: response[i].inProcess,
                                        remaining: response[i].remaining,
                                        status_type: response[i].statusType,
                                        item_status: response[i].itemStatus
                                    }
                                }
                            )
                            console.log(updatedItemFulfillment);
                        }
                    }
                    if(response[0].salesOrderStatus === "E"){
                        const updatedSalesOrder = await this.schema.model.SalesOrder.updateOne(
                            {
                                id: response[0].salesOrderId
                            },
                            {
                                $set : {
                                    status : "Pending Billing/ Partial Fulfillment"
                                }
                            }
                        )
                        console.log(updatedSalesOrder);
                    }
                    if(response[0].salesOrderStatus === "F"){
                        const updatedSalesOrder = await this.schema.model.SalesOrder.updateOne(
                            {
                                id: response[0].salesOrderId
                            },
                            {
                                $set : {
                                    status : "Pending Billing"
                                }
                            }
                        )
                        console.log(updatedSalesOrder);
                    }
                    if(response[0].salesOrderStatus === "G"){
                        const updatedSalesOrder = await this.schema.model.SalesOrder.updateOne(
                            {
                                id: response[0].salesOrderId
                            },
                            {
                                $set : {
                                    status : "Billed"
                                }
                            }
                        )
                        console.log(updatedSalesOrder);
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
    created() { },
    async started() { },
    async stopped() { }
};
