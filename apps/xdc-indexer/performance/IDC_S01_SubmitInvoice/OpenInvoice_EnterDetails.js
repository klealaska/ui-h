	require("./T01_Launch.js");

	require("./T02_Login.js");

	require("./SelectBuyer.js");

	load.action('OpenInvoice_EnterDetails', async function() {
	
    common = load.global.common;
     
    common.init();
       
    var p_UserName = common.settings.p_UserName;
    
    var p_Password = common.settings.p_Password;

	var p_BuyerID = common.settings.p_BuyerID;	
	   
	var TT=common.settings.TT;
	
	const T04_Open_Invoice_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T04_Open_Invoice");

    T04_Open_Invoice_tnx.start();

    const webResponse55 = new load.WebRequest({
        id: 55,
        url: `https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/unindexed/invoice/`+ c_documentId1 + `/user/p_UserName`,
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "GET",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse56 = new load.WebRequest({
        id: 56,
        url: `https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/unindexed/invoice/`+ c_documentId1 + `/user/p_UserName`,
        method: "GET",
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
	 extractors: [
        	
            // Source='Record scan' Original value="0001-01-01T00:00:00"
            new load.JsonPathExtractor("c_dateSubmitted",".indexed.dateSubmitted"), 
			//To capture the entire indexed data
            new load.JsonPathExtractor("c_OpenInvLabels",".indexed.labels"),
            
            new load.JsonPathExtractor("c_Invoice_createActivity",".indexed.activities[0]"),
            
			 new load.BoundaryExtractor("c_FileID", {
                leftBoundary: "fileId\":\"",
                rightBoundary: "\",\"dateReceived",
                scope: "body"
            }), //"4506053",
			 new load.BoundaryExtractor("c_DateReceived", {
                leftBoundary: "dateReceived\":\"",
                rightBoundary: "\",\"indexer\":\"IDC",
                scope: "body"
            }), //"2023-01-19T15:46:34.3779442Z",
			 new load.BoundaryExtractor("c_LastModified", {
                leftBoundary: "lastModified\":\"",
                rightBoundary: "\",\"labels",
                scope: "body"
            }), //"2023-01-19T15:49:53.4406824Z",
			 
            new load.JsonPathExtractor("c_PrevServiceStartDate",'$.indexed.labels[?(@.label=="ServiceStartDate")].value.text'),
            
            new load.JsonPathExtractor("c_PrevInvoiceDate",'$.indexed.labels[?(@.label=="InvoiceDate")].value.text'),

            new load.JsonPathExtractor("c_PrevServiceEndDate",'$.indexed.labels[?(@.label=="ServiceEndDate")].value.text'),

            new load.JsonPathExtractor("c_PrevSupplier",'$.indexed.labels[?(@.label=="Supplier")].value.text'),

            new load.JsonPathExtractor("c_PrevSupplierAddress",'$.indexed.labels[?(@.label=="SupplierAddress")].value.text'),

            new load.JsonPathExtractor("c_PrevRegistrationCode",'$.indexed.labels[?(@.label=="RegistrationCode")].value.text'),

            new load.JsonPathExtractor("c_PrevSupplierID",'$.indexed.labels[?(@.label=="SupplierId")].value.text'),

            new load.JsonPathExtractor("c_PrevCustAccountNum",'$.indexed.labels[?(@.label=="CustomerAccountNumber")].value.text'),

            new load.JsonPathExtractor("c_PrevVendorAccountId",'$.indexed.labels[?(@.label=="VendorAccountId")].value.text'),

            new load.JsonPathExtractor("c_PrevShipToName",'$.indexed.labels[?(@.label=="ShipToName")].value.text'),

            new load.JsonPathExtractor("c_PrevPropertyCode",'$.indexed.labels[?(@.label=="PropertyCode")].value.text'),

            new load.JsonPathExtractor("c_PrevShiptToID",'$.indexed.labels[?(@.label=="ShipToID")].value.text'),

            new load.JsonPathExtractor("c_PrevInvoiceAmount",'$.indexed.labels[?(@.label=="InvoiceAmount")].value.text'),

            new load.TextCheckExtractor("OpenInvoice_Check", { text: "indexed", failOn: false, scope: load.ExtractorScope.Body }),
        ],      
    }).sendSync();
        
    const webResponse60 = new load.WebRequest({
        id: 60,
        url: `https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/file/`+ c_documentId1,
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization",
            "Access-Control-Request-Method": "GET",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

	if(OpenInvoice_Check = "true")
    {
    	T04_Open_Invoice_tnx.stop("Passed");
    }
    	
    else
    {
    	T04_Open_Invoice_tnx.stop("Failed");
    }
    
    load.thinkTime(TT);    

    const T05_Enter_Details_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T05_Enter_Details");

    T05_Enter_Details_tnx.start();

    const webResponse64 = new load.WebRequest({
        id: 64,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getvendors",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "GET",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "limit": "50",
            "q": "",
            "organizationId": p_BuyerID,
            "accountingsystemId": ""
        },
    }).sendSync();

    const webResponse65 = new load.WebRequest({
        id: 65,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getvendors",
        method: "GET",
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
        queryString: {
            "limit": "50",
            "q": "",
            "organizationId": p_BuyerID,
            "accountingsystemId": ""
        },
        extractors: [

        ],
    }).sendSync();


    const webResponse67 = new load.WebRequest({
        id: 67,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getvendors",
        method: "GET",
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
        queryString: {
            "limit": "50",
            "q": "",
            "organizationId": p_BuyerID,
            "accountingsystemId": ""
        },
    }).sendSync();

    const webResponse69 = new load.WebRequest({
        id: 69,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getvendors",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "GET",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "limit": "50",
            "q": "100",
            "organizationId": p_BuyerID,
            "accountingsystemId": ""
        },
    }).sendSync();

    const webResponse70 = new load.WebRequest({
        id: 70,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getvendors",
        method: "GET",
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
        queryString: {
            "limit": "50",
            "q": "100",
            "organizationId": p_BuyerID,
            "accountingsystemId": ""
        },
        extractors: [
        	
        	new load.JsonPathExtractor("c_SupplierAddLine1",".records[2].line1"), 
        	 
        	 new load.JsonPathExtractor("c_SupplierAddLine2",".records[2].line2"),
        	 
        	 new load.JsonPathExtractor("c_SupplierCity",".records[2].city"),
        	 
        	 new load.JsonPathExtractor("c_SupplierState",".records[2].state"),
        	 
        	 new load.JsonPathExtractor("c_SupplierPostalCode",".records[2].postalCode"),
        	 
        	 new load.JsonPathExtractor("p_CurrentSupplierID",".records[2].vendorID"),
        	 
        	 new load.JsonPathExtractor("c_VendorExternalSystemID",".records[2].vendorExternalSystemID"),
        	 
        	 new load.JsonPathExtractor("c_SupplierAlias",".records[2].alias"),
        	 
        	 new load.JsonPathExtractor("c_AccountSystemID",".records[2].accountingSystemID"),
        	 // Source='Record scan' Original value="100 HIDDEN BAY CONDOMINIUM ASSOCIATION, INC."
            new load.JsonPathExtractor("c_vendorName",".records[2].vendorName"), 
            // Source='Record scan' Original value="M57HJVGOZ"
            new load.JsonPathExtractor("c_vendorRegistrationCode",".records[2].vendorRegistrationCode"), 
        	],

    }).sendSync();

    const webResponse72 = new load.WebRequest({
        id: 72,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getvendoraccounts",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "GET",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "limit": "50",
            "q": "",
            "vendorId": `${webResponse70.extractors['p_CurrentSupplierID']}`,
            "exactMatch": "false"
        },
    }).sendSync();

    const webResponse73 = new load.WebRequest({
        id: 73,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getvendoraccounts",
        method: "GET",
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
        queryString: {
            "limit": "50",
            "q": "",
            "vendorId": `${webResponse70.extractors['p_CurrentSupplierID']}`,
            "exactMatch": "false"
        },
        extractors: [
 			 new load.BoundaryExtractor("p_CurVendorAccId", {
                leftBoundary: "vendorAccountId\":",
                rightBoundary: ",\"accountNo",
                scope: "body"
            }), //"14462647",
			 new load.BoundaryExtractor("c_CurCustAccountNum", {
                leftBoundary: "accountNo\":\"",
                rightBoundary: "\",\"propertyId",
                scope: "body"
            }), //"none",
 		],
    }).sendSync();

    const webResponse76 = new load.WebRequest({
        id: 76,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getproperties",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "GET",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "limit": "50",
            "q": "",
            "organizationId": p_BuyerID,
            "accountingsystemId": `${webResponse70.extractors['c_AccountSystemID']}`
        },
    }).sendSync();

    const webResponse77 = new load.WebRequest({
        id: 77,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getproperties",
        method: "GET",
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
        queryString: {
            "limit": "50",
            "q": "",
            "organizationId": p_BuyerID,
            "accountingsystemId": `${webResponse70.extractors['c_AccountSystemID']}`
        },
        extractors: [
        	
        	new load.JsonPathExtractor("c_CurShipToName",'$.records[2].propertyName'),
        	
        	new load.JsonPathExtractor("c_CurPropertyCode",'$.records[2].propertyCode'),
        	
        	new load.JsonPathExtractor("c_ShipToAlias",'$.records[2].alias'),
        	
        	new load.JsonPathExtractor("c_CurShipToID",'$.records[2].propertyAddressID'),
        	
        	new load.JsonPathExtractor("c_CurShipToAddLine1",'$.records[2].line1'),
        	
        	new load.JsonPathExtractor("c_CurShipToAddLine2",'$.records[2].line2'),
        	
        	new load.JsonPathExtractor("c_CurShipToCity",'$.records[2].city'),
        	
        	new load.JsonPathExtractor("c_CurShipToState",'$.records[2].state'),
        	
        	new load.JsonPathExtractor("c_CurShipTopostalCode",'$.records[2].postalCode'),
			 
			],
    }).sendSync();

    const webResponse79 = new load.WebRequest({
        id: 79,
        url: "https://ax-ae1-nt-idc-invindx-avidbillproxy01-int-api.qa-ase-avidxchange.com/api/avidbill/getproperties",
        method: "GET",
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
        queryString: {
            "limit": "50",
            "q": "",
            "organizationId": p_BuyerID,
            "accountingsystemId": `${webResponse70.extractors['c_AccountSystemID']}`
        },
		extractors: [
 			 new load.TextCheckExtractor("EnterDetails_Check", { text: "count", failOn: false, scope: load.ExtractorScope.Body }),
 		],
    }).sendSync();

	if(EnterDetails_Check = "true")
    {
    	T05_Enter_Details_tnx.stop("Passed");
    }
    	
    else
    {
    	T05_Enter_Details_tnx.stop("Failed");
    }
    
    load.thinkTime(TT);
    
    c_FileID = `${webResponse56.extractors['c_FileID']}`;
    
    c_DateReceived = `${webResponse56.extractors['c_DateReceived']}`;
    
    c_dateSubmitted = `${webResponse56.extractors['c_dateSubmitted']}`;
    
    labels = webResponse56.extractors['c_OpenInvLabels'];
    
    CrtActivity = webResponse56.extractors['c_Invoice_createActivity'];
    
    c_ShipToAddress1 = `${webResponse77.extractors['c_CurShipToAddLine1']} ${webResponse77.extractors['c_CurShipToAddLine2']} ${webResponse77.extractors['c_CurShipToCity']}, ${webResponse77.extractors['c_CurShipToState']} ${webResponse77.extractors['c_CurShipTopostalCode']}`;
    
    c_vendorName = `${webResponse70.extractors['c_vendorName']}`;
    
    c_VendorExternalSystemID = `${webResponse70.extractors['c_VendorExternalSystemID']}`;
    
    c_SupplierAddress1 = `${webResponse70.extractors['c_SupplierAddLine1']} ${webResponse70.extractors['c_SupplierAddLine2']} ${webResponse70.extractors['c_SupplierCity']}, ${webResponse70.extractors['c_SupplierState']} ${webResponse70.extractors['c_SupplierPostalCode']}`
    
    c_vendorRegistrationCode = `${webResponse70.extractors['c_vendorRegistrationCode']}`;
    
    p_CurrentSupplierID = `${webResponse70.extractors['p_CurrentSupplierID']}`;
    
    c_CurCustAccountNum = `${webResponse73.extractors['c_CurCustAccountNum']}`;
    
    p_CurVendorAccId = `${webResponse73.extractors['p_CurVendorAccId']}`;
    
    c_CurShipToName = `${webResponse77.extractors['c_CurShipToName']}`;
    
    c_CurPropertyCode = `${webResponse77.extractors['c_CurPropertyCode']}`;
    
    c_ShipToAlias = `${webResponse77.extractors['c_ShipToAlias']}`;
    
    c_CurShipToID = `${webResponse77.extractors['c_CurShipToID']}`;
    
    c_SupplierAlias = `${webResponse70.extractors['c_SupplierAlias']}`;
        
    c_PrevInvoiceAmount = `${webResponse56.extractors['c_PrevInvoiceAmount']}`;    
    
});
