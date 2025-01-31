/**
@NApiVersion 2.0
@NScriptType UserEventScript
*/

define(['N/https', 'N/runtime'], function (https, runtime) {

    function afterStatusChange(context) {

        var newRecord = context.newRecord;
        var orderId = newRecord.getValue({ fieldId: 'id' });
        var orderStatus = newRecord.getValue({ fieldId: 'orderstatus' });

        var message = "No Status";
        if (orderStatus === "B") message = "Pending Fulfillment";

        var webhookUrl = "https://3a63-103-112-54-213.ngrok-free.app/netsuite/notify";
        var responseBody = { 
            "status": {
                "orderId" : orderId,
                "orderStatus" : message
            } 
        };

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