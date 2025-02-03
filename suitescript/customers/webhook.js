/**
@NApiVersion 2.0
@NScriptType Restlet
*/

define(['N/search', 'N/https', 'N/log', 'N/record'], function (search, https, log, record) {

    function doGet(context) {
        // Log the incoming request parameters for debugging.
        log.debug("Received GET Request", JSON.stringify(context));

        // For demonstration, simply echo back the parameters.
        var responseObj = {
            status: "success",
            message: "RESTlet GET request processed successfully",
            data: context
        };

        var webhookUrl = "https://03e7-103-112-54-213.ngrok-free.app/customers";
        var responseBody = { response : responseObj };

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
        get: doGet
    }

})