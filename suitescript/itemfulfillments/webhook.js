/**
@NApiVersion 2.0
@NScriptType UserEventScript
*/

define(['N/https', 'N/runtime', 'N/record'], function (https, runtime, record) {

    function afterStatusChange(context) {

        var newRecord = context.newRecord;
        var itemFulfillmentId = newRecord.getValue({ fieldId: 'id' });
        var shipStatus = newRecord.getValue({ fieldId: 'shipstatus' });
        var salesOrderId = newRecord.getValue({ fieldId: 'orderid' });
        salesOrderId = Number(salesOrderId);
        var salesOrder = record.load({
            type: record.Type.SALES_ORDER,
            id: salesOrderId
        });

        var itemFulfillment = {
            itemFulfillmentId : itemFulfillmentId,
            salesOrderId : salesOrderId,
            items : []
        };
        var itemStatus = "No Status"
        if (shipStatus === "A") itemStatus = "Picked";
        if (shipStatus === "B") itemStatus = "Packed";
        if (shipStatus === "C") itemStatus = "Shipped";

        var lineCount = salesOrder.getLineCount({ sublistId: 'item' });
        for (var i = 0; i < lineCount; i++) {
            var itemId = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });
            var quantityFulfilled = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantityfulfilled', line: i });
            var originalQuantity = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'origquantity', line: i });
            var quantityPickPackship = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantitypickpackship', line: i });

            var inProcess = quantityPickPackship - quantityFulfilled;
            var remaining = originalQuantity - quantityPickPackship;
            
            if(remaining){
                itemFulfillment.items.push(
                    {
                        itemId: itemId,
                        alreadyFulfilled : quantityFulfilled,
                        inProcess: inProcess,
                        originalQuantity: originalQuantity,
                        remaining: remaining,
                        statusType: "Partially",
                        itemStatus: itemStatus
                    }
                )
            }
            else{
                itemFulfillment.items.push(
                    {
                        itemFulfillmentId: itemFulfillmentId,
                        salesOrderId: salesOrderId,
                        itemId: itemId,
                        alreadyFulfilled : quantityFulfilled,
                        inProcess: inProcess,
                        originalQuantity: originalQuantity,
                        remaining: remaining,
                        statusType: "Fully",
                        itemStatus: itemStatus
                    }
                )
            }
        }

        var webhookUrl = "https://03e7-103-112-54-213.ngrok-free.app/netsuite/notify";
        var responseBody = { "response": itemFulfillment };

        try {

            var response = https.post({
                url: webhookUrl,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(responseBody)
            });

            log.debug("Response send successfully", response.body);

        } catch (error) {

            log.debug("Error occurs", error.message);

        }
    }

    return {
        afterSubmit: afterStatusChange
    }

})