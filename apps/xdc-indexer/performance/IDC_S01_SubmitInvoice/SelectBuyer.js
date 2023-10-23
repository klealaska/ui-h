	require("./T01_Launch.js");
	require("./T02_Login.js");

	load.action('SelectBuyer', async function() {
   
    common = load.global.common;
     
    common.init();
       
    load.log(common.settings.p_UserName);
      
    var p_UserName = common.settings.p_UserName;
    
    var p_Password = common.settings.p_Password;

	var p_BuyerID = common.settings.p_BuyerID;	
	   
	var TT=common.settings.TT;
		
    let openHandler1 = function (response) {
        //     	var accept  = response.headers['Sec-Websocket-Accept'];
        //     	load.log(`Connected. Status: [${response.status}]. Sec-Websocket-Accept: [${accept}] on ${response.id}`);
    }
            	
    let messageHandler1 = function (message) {
        //     load.log(`Got message  [${message.data}] on ${message.id}`);
        socket1.continue();
    }

    let closeHandler1 = function (message) {
        //     var initiator = (message.isClosedByClient) ? "Client" : "Server";
        //     load.log(`WebSocket connection ${message.id} closed by ${initiator}.Code: [${message.code}], reason: [${message.reason}]`);
    }

    let errorHandler1 = function (errorMessage) {
        //     load.log(`Error details:  ${errorMessage}`, load.LogLevel.error);
    }
     
    const socket1 = new load.WebSocket({
        url: `wss://ax-ae1-nt-idc-invindx-signalr.service.signalr.net/client/?hub=xdchub&asrs.op=%2FxdcHub&negotiateVersion=1&asrs_request_id=`+ c_RequestID+`&id=`+ c_ConnectionID+`&access_token=`+ c_AccessToken1,
        headers: {
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Host": "ax-ae1-nt-idc-invindx-signalr.service.signalr.net",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Pragma": "no-cache",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        onMessage: messageHandler1,
        onOpen: openHandler1,
        onClose: closeHandler1,
        onError: errorHandler1
    });

    socket1.open();

    socket1.send("{\"protocol\":\"json\",\"version\":1}\x1e");

    await socket1.waitForData();  // socket1 received buffer "{}\x1e"

    const T03_Select_Buyer_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T03_Select_Buyer");

    T03_Select_Buyer_tnx.start();

    const webResponse42 = new load.WebRequest({
        id: 42,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "POST",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse43 = new load.WebRequest({
        id: 43,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "POST",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse44 = new load.WebRequest({
        id: 44,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "POST",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse45 = new load.WebRequest({
        id: 45,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "POST",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse46 = new load.WebRequest({
        id: 46,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "POST",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse47 = new load.WebRequest({
        id: 47,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": Authorization,
            "Cache-Control": "no-cache, no-store",
            "Connection": "keep-alive",
            "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';",
            "Content-Type": "application/json",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        body: {
            "Controls": {
                "SourceId": "AvidSuite",
                "Page": 1,
                "PageSize": 30
            },
            "Filters": {
                "buyerId": [
                    p_BuyerID
                ],
                "escalationCategoryIssue": [
                    "None"
                ],
                "ingestionType": [
                    "email",
                    "scan"
                ],
                "isSubmitted": [
                    0
                ]
            },
            "SortField": "dateReceived",
            "SortDirection": "asc"
        },
         extractors: [
        	new load.JsonPathExtractor("c_FirstInvoice","[0]"), 
            // Source='Record scan' Original value="PO2242"
            new load.JsonPathExtractor("c_purchaseOrderIdentifier","[0].purchaseOrderIdentifier"), 
//             Source='Record scan' Original value="Davis Wright Tremaine LLP"
            new load.JsonPathExtractor("c_nextdocumentId","[1].documentId"), 
            // Source='Record scan' Original value="8e4c3309-6dfd-45d3-9112-d0c0f1d46a3a"
            new load.JsonPathExtractor("c_indexedDocumentId","[0].indexedDocumentId"), 
            // Source='Record scan' Original value="3b309374-40eb-4735-82f5-a52f2248bcd9"
            new load.JsonPathExtractor("c_documentId1","[0].documentId"), 
            // Source='Record scan' Original value="WLX4UAJ50"
            new load.JsonPathExtractor("c_registrationCode1","[0].registrationCode"), 
			 
            new load.TextCheckExtractor("Buyer_Check", { text: "indexedDocumentId", failOn: false, scope: load.ExtractorScope.Body }),
        ],
    }).sendSync();
        
    const webResponse48 = new load.WebRequest({
        id: 48,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": Authorization,
            "Cache-Control": "no-cache, no-store",
            "Connection": "keep-alive",
            "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';",
            "Content-Type": "application/json",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        body: {
            "Controls": {
                "SourceId": "AvidSuite",
                "SearchAllPages": true
            },
            "Filters": {
                "buyerId": [
                    p_BuyerID
                ],
                "escalationCategoryIssue": [
                    "None"
                ],
                "ingestionType": [
                    "email",
                    "scan"
                ],
                "isSubmitted": [
                    0
                ]
            },
            "GroupBy": [
                "isSubmitted"
            ],
            "ReduceFields": [
                {
                    "Function": "COUNT",
                    "Alias": "count"
                }
            ]
        },
    }).sendSync();
    
    load.WebRequest.defaults.handleHTTPError = function (webResponse) {
        if (webResponse.status === 404) {
            load.log('Continue with no error on receiving "Page not found"');
            return false; //We can continue, its fine
        }
    };

    const webResponse49 = new load.WebRequest({
        id: 49,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": Authorization,
            "Cache-Control": "no-cache, no-store",
            "Connection": "keep-alive",
            "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';",
            "Content-Type": "application/json",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        body: {
            "Controls": {
                "SourceId": "AvidSuite",
                "SearchAllPages": true
            },
            "Filters": {
                "buyerId": [
                    p_BuyerID
                ],
                "escalationCategoryIssue": [
                    "-None",
                    "-Void",
                    "-Recycle Bin",
                    "-Reject To Sender"
                ],
                "isSubmitted": [
                    0
                ]
            },
            "GroupBy": [
                "isSubmitted"
            ],
            "ReduceFields": [
                {
                    "Function": "COUNT",
                    "Alias": "count"
                }
            ]
        },
    }).sendSync();

    const webResponse50 = new load.WebRequest({
        id: 50,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": Authorization,
            "Cache-Control": "no-cache, no-store",
            "Connection": "keep-alive",
            "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';",
            "Content-Type": "application/json",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        body: {
            "Controls": {
                "SourceId": "AvidSuite",
                "SearchAllPages": true
            },
            "Filters": {
                "buyerId": [
                   p_BuyerID
                ],
                "escalationCategoryIssue": [
                    "None"
                ],
                "ingestionType": [
                    "api"
                ],
                "isSubmitted": [
                    0
                ],
                "sourceEmail": [
					   p_UserName
                ]
            },
            "GroupBy": [
                "isSubmitted"
            ],
            "ReduceFields": [
                {
                    "Function": "COUNT",
                    "Alias": "count"
                }
            ]
        },
    }).sendSync();

	if(Buyer_Check = "true")
    {
    	T03_Select_Buyer_tnx.stop("Passed");
    }
    	
    else
    {
    	T03_Select_Buyer_tnx.stop("Failed");
    }
    
    load.thinkTime(TT);
    
    await socket1.waitForData();  // socket1 received buffer "{\"type\":6}\x1e"
        
    c_indexedDocumentId = `${webResponse47.extractors['c_indexedDocumentId']}`;
    
    c_documentId1 = `${webResponse47.extractors['c_documentId1']}`;

    c_nextdocumentId = `${webResponse47.extractors['c_nextdocumentId']}`;
   
    c_invoiceNumber = `${webResponse47.extractors['c_invoiceNumber']}`;
    
    });