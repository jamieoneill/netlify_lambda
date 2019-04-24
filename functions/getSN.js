const axios = require('axios');
var parseString = require('xml2js').parseString;

exports.handler = function (event, context, callback) {
    const {
        SN_TICKET,
        TOKEN
    } = process.env;

    // Send user response
    const send = body => {
        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            body: body//JSON.stringify(body)
        });
    }

    const getInc = () => {

        let xmls = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:inc=\"http://www.service-now.com/IncidentServiceAPI\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <inc:IncidentAPIRequest>\r\n         <snTicketNumber>${SN_TICKET}</snTicketNumber>\r\n         <sourceSystem>Test</sourceSystem>\r\n         <operation>GetRecord</operation>\r\n      </inc:IncidentAPIRequest>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>";

        axios.post('https://aigm3.service-now.com/IncidentAPI.do?SOAP=',
                xmls, {
                    headers: {
                        "Content-Type": "text/xml",
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": "Basic ${TOKEN}",
                    }
                }).then(res =>
                parseString(res.data,  function (err, result) {send( JSON.stringify(result['SOAP-ENV:Envelope']['SOAP-ENV:Body']));}))
            .catch(err => send(err));
    }

    // Make sure method is GET
    if (event.httpMethod == 'GET') {
        // Run
        getInc();
    }
}
