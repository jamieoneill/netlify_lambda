const axios = require('axios');
var convert = require('xml-js');

exports.handler = function (event, context, callback) {
    const {
        SN_TICKET,
        TOKEN
    } = process.env;

    // Send user response
    const send = body => {
        console.log("sending response")
        console.log(body)
        console.log("body stringify")
        console.log(JSON.stringify(body))

        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            body: JSON.stringify(body)
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
                send( formatJson( JSON.parse(convert.xml2json(res.data, {compact: true, spaces: 0}))["SOAP-ENV:Envelope"]['SOAP-ENV:Body']['snRecord'] )      ))
            .catch(err => send(err));
    }

    // Make sure method is GET
    if (event.httpMethod == 'GET') {
        // Run
        getInc();
    }

    function formatJson(myObj){

        var newObject = '{'
        var keys = Object.keys(myObj); // ['alpha', 'beta'] 
        var values = Object.values(myObj); // ['alpha', 'beta'] 
    
        for(var i in keys) {
            newObject += ' "'+keys[i]+'" : "'+ values[i]._text+'",'
        }
        console.log( JSON.parse(newObject.substring(0, newObject.length - 1) + "}"));
        return JSON.parse(newObject.substring(0, newObject.length - 1)+ "}");
    }
}
