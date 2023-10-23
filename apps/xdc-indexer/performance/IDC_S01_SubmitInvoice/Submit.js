	require("./T01_Launch.js");

	require("./T02_Login.js");

	require("./SelectBuyer.js");

	require("./OpenInvoice_EnterDetails.js");

	load.action('Submit', async function() {
            	
    common = load.global.common;
     
    common.init();
      
    var p_UserName = common.settings.p_UserName;
    
    var p_Password = common.settings.p_Password;

	var p_BuyerID = common.settings.p_BuyerID;	
	   
	var TT=common.settings.TT;
	
	var CurDate;
	
	//	--------- To generate the current Date -	START	--------
	
	var today = new Date();
	var dd = today.getDate();

	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	if(dd<10) 
	{
    dd='0'+dd;
	} 
	if(mm<10) 
	{
    mm='0'+mm;
	} 

	CurDate = mm+'/'+dd+'/'+yyyy;

	today = new Date().toString();

	var p_scheduledDate = new Date().toJSON();

	//	--------- To generate the current Date -	END	--------																																										

	//	--------- To generate the Random invoice number - START ---------------
 
	var invNum = "AC" + load.config.user.userId +( new Date().getTime().toString()).substring(8);
	
	//	--------- To generate the Random invoice number - END ---------------
	
	var submitActivityLabels = []; 
        
    var SubmitChangeLog = [];
    
    var Alias = [
    	{
			"id": "00000000-0000-0000-0000-000000000000",
			"label": "ShipToAlias",
			"page": 0,
			"value": {
				"boundingBox": [],
				"confidence": 1,
				"incomplete": false,
				"incompleteReason": null,
				"required": false,
				"text": null,
				"type": "string",
				"verificationState": "NotRequired"
			}
		},
    	{
			"id": "00000000-0000-0000-0000-000000000000",
			"label": "VendorExternalSystemID",
			"page": 0,
			"value": {
				"boundingBox": [],
				"confidence": 1,
				"incomplete": false,
				"incompleteReason": null,
				"required": false,
				"text": "676159",
				"type": "string",
				"verificationState": "NotRequired"
			}
		},
    	{
			"id": "00000000-0000-0000-0000-000000000000",
			"label": "SupplierAlias",
			"page": 0,
			"value": {
				"boundingBox": [],
				"confidence": 1,
				"incomplete": false,
				"incompleteReason": null,
				"required": false,
				"text": null,
				"type": "string",
				"verificationState": "NotRequired"
			}
		}
    ];
        
    labels = labels.concat(Alias);
    
    var SubmitPayloadLabels = labels; //look for label with InvoiceNumber and change it value.
        
SubmitPayloadLabels.forEach(function (element)
{ 
switch(element.label)
{
case "InvoiceDate":	
	var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
    newElement.value.text = CurDate;
    element.value.text = CurDate;  //also change value in SubmitPayloadsLabel
    newElement.value.confidence = 1;
    newElement.value.boundingBox = [];
    SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(newElement);
    break;
        
case "ServiceStartDate":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	newElement.value.text = CurDate;
	element.value.text = CurDate;
    break;
    
case "ServiceEndDate":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
    newElement.value.text = CurDate;
	element.value.text = CurDate;
    break;

case "ShipToAddress":
    var newElement = JSON.parse(JSON.stringify(element));
	var oldElement = JSON.parse(JSON.stringify(element));
	var ShipToAddress = c_ShipToAddress1;
	newElement.value.text = ShipToAddress;
	element.value.text = ShipToAddress;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    break;

case "Supplier":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var supplier = c_vendorName;
	newElement.value.text = supplier;
	element.value.text = supplier;
  	SubmitChangeLog.push({ previous : oldElement, current: newElement});
	submitActivityLabels.push(element);
    break;
    
case "VendorExternalSystemID":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var VendorExternalSystemID = c_VendorExternalSystemID;
	newElement.value.text = VendorExternalSystemID;
	element.value.text = VendorExternalSystemID;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;
    
case "SupplierAddress":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var SupplierAddress = c_SupplierAddress1;
	newElement.value.text = SupplierAddress;
	element.value.text = SupplierAddress;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;
       
 case "RegistrationCode":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var RegistrationCode = c_vendorRegistrationCode;
	newElement.value.text = RegistrationCode;
	newElement.value.type = "string";
	element.value.text = RegistrationCode;
	element.value.type = "string";
	newElement.value.confidence = 1;
    newElement.value.boundingBox = [];
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(newElement);
    break;
    
 case "SupplierId":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var SupplierId = p_CurrentSupplierID;
	newElement.value.text = SupplierId;
	element.value.text = SupplierId;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
	submitActivityLabels.push(element);
    break;
    
 case "CustomerAccountNumber":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var CustAccountNum = c_CurCustAccountNum ;
    newElement.value.text = CustAccountNum;
    element.value.text = CustAccountNum;
    SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;
    
case "VendorAccountId":
	var newElement = JSON.parse(JSON.stringify(element));
	var oldElement = JSON.parse(JSON.stringify(element));
	var VendorAccountId = p_CurVendorAccId ;
	newElement.value.text = VendorAccountId;
	element.value.text = VendorAccountId;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;

case "ShipToName":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
    var ShipToName = c_CurShipToName;
	newElement.value.text = ShipToName;
	element.value.text = ShipToName;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);	
    break;
    
case "PropertyCode":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var PropertyCode = c_CurPropertyCode;
	newElement.value.text = PropertyCode;
	element.value.text = PropertyCode;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;
    
case "ShipToAlias":
     	
    var newElement = JSON.parse(JSON.stringify(element)); 
    var oldElement = JSON.parse(JSON.stringify(element));//new copy of the old value
	var ShipToAlias = c_ShipToAlias;     	
	newElement.value.text = ShipToAlias;
	element.value.text = ShipToAlias;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;
    
case "ShipToID":
    var newElement = JSON.parse(JSON.stringify(element));
    var oldElement = JSON.parse(JSON.stringify(element));
	var ShipToId = c_CurShipToID;
	newElement.value.text = ShipToId;
	element.value.text = ShipToId;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;
    
case "SupplierAlias":
    var newElement = JSON.parse(JSON.stringify(element)); //new copy of the old value 
	var oldElement = JSON.parse(JSON.stringify(element));
	var SupplierAlias = c_SupplierAlias; 
    newElement.value.text = SupplierAlias;
    element.value.text = SupplierAlias;
    break;

case "InvoiceNumber":
    var newElement = JSON.parse(JSON.stringify(element)); //new copy of the old value
    var oldElement = JSON.parse(JSON.stringify(element));
    element.value.text = invNum; //change the submitpayload label to new value
    var PrevInvNum = c_invoiceNumber;
	newElement.value.text = invNum;
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break;
    
case "InvoiceAmount":
    var newElement = JSON.parse(JSON.stringify(element)); //new copy of the old value    
	var oldElement = JSON.parse(JSON.stringify(element));     
	var InvoiceAmount = c_PrevInvoiceAmount;
	newElement.value.text = "20.00";
	element.value.text = "20.00";
	SubmitChangeLog.push({ previous : oldElement, current: newElement});
    submitActivityLabels.push(element);
    break; 
}
});
    
    const T06_Submit_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T06_Submit");

    T06_Submit_tnx.start();

    const webResponse82 = new load.WebRequest({
        id: 82,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/indexed/submit",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "PUT",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "overrideDuplicate": "false"
        },
    }).sendSync();
    
    load.log(invNum);
	
  const webResponse83 = new load.WebRequest({
        id: 83,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/indexed/submit",
        method: "PUT",
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
        	"id": c_indexedDocumentId,
        	"documentId": c_documentId1,
        	"documentType": "Indexed",
        	"fileId": c_FileID,
			 "dateReceived": c_DateReceived,
        	 "indexer": "IDC",
        	 "lastModifiedByUser": "System",
            "labels": SubmitPayloadLabels,		        		
            "activities": [        
				CrtActivity,        		
                {
                    "description": "",
                    "labels": submitActivityLabels,                  	
                    "ordinal": 2,
                    "activity": "Submit",
                    "changeLog": SubmitChangeLog,
                    "endDate": "2023-01-30T16:44:31.525+05:30",
                    "escalation": null,
                    "indexer": p_UserName,
                    	"startDate": p_scheduledDate
                },
            ],
            
            "secondsSpentIndexing": 0,
            "dateRecycled": c_dateSubmitted,
            "dateFirstOpened": c_dateSubmitted,           
            "lastModified": p_scheduledDate,
            "isSubmitted": false,       
      		"dateSubmitted": c_dateSubmitted,            
            "previousQueue": "Pending Processing",            
        },
        queryString: {
            "overrideDuplicate": "false"
        },
    }).sendSync();

    const webResponse84 = new load.WebRequest({
        id: 84,
        url: `https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/lock/`+ c_documentId1,
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,cache-control,content-security-policy,content-type,strict-transport-security",
            "Access-Control-Request-Method": "DELETE",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse85 = new load.WebRequest({
        id: 85,
        url: `https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/lock/`+ c_documentId1,
        method: "DELETE",
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
    }).sendSync();

    const webResponse86 = new load.WebRequest({
        id: 86,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/document/next/p_UserName",
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

    const webResponse87 = new load.WebRequest({
        id: 87,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/document/next/p_UserName",
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
                "Page": 1,
                "PageSize": 30,
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
            "SortField": "dateReceived",
            "SortDirection": "asc"
        },
		extractors: [
 			 new load.TextCheckExtractor("SubmitInv_Check", { text: "indexed", failOn: false, scope: load.ExtractorScope.Body }),
 		],
    }).sendSync();

    const webResponse91 = new load.WebRequest({
        id: 91,
        url: `https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/file/`+ c_nextdocumentId,
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

if(SubmitInv_Check = "true")
    {
    	T06_Submit_tnx.stop("Passed");
    }
    	
    else
    {
    	T06_Submit_tnx.stop("Failed");
    }
    
    load.thinkTime(TT);
    
    });