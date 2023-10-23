module.exports = function()
{

	var settings = {
			c_RequestVerificationToken: "",
			c_SessionToken: "",
			c_Code1 : "",
			c_State1 : "",
			c_Code : "",
			c_State : "",
			c_AccessToken :"",
			c_RequestID : "",
			c_ConnectionID : "",
			c_AccessToken1 : "",
			Authorization : "",
			c_indexedDocumentId : "",
			c_documentId1 : "",
			c_FileID : "",
			c_DateReceived : "",
			c_dateSubmitted : "",
			labels : "",
			CrtActivity : "",
			c_ShipToAddress1 : "",
			c_vendorName : "",
			c_VendorExternalSystemID : "",
			c_SupplierAddress1 : "",
			c_vendorRegistrationCode : "",
			p_CurrentSupplierID : "",
			c_CurCustAccountNum : "",
			p_CurVendorAccId : "",
			c_CurShipToName : "",
			c_CurPropertyCode : "",
			c_ShipToAlias : "",
			c_CurShipToID : "",
			c_SupplierAlias : "",
			c_invoiceNumber : "",
			c_PrevInvoiceAmount : "",
			c_nextdocumentId : "",
			
			p_UserName : "",
			p_Password : "",
			p_BuyerID : "",
			
			TT : 3 ,
			invNum : "",
			dummy : "Test"

	}

	function getSocket(c_RequestID, c_ConnectionID, c_AccessToken1)
	{
		const socket1 = new load.WebSocket({
        url: `wss://ax-ae1-nt-idc-invindx-signalr.service.signalr.net/client/?hub=xdchub&asrs.op=%2FxdcHub&negotiateVersion=1&asrs_request_id=settings.c_RequestID&id=${webResponse36.extractors['c_ConnectionID']}&access_token=${webResponse34.extractors['c_AccessToken1']}`,
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
		
		return socket1;
		
	}
	
	function init()
		
	{
		settings.p_UserName = `${load.params.p_UserName}`;
    
    	settings.p_Password = `${load.params.p_Password}`;

	    settings.p_BuyerID = `${load.params.p_BuyerID}`;

	}
	
	return	{
		init,
		settings
//		getSocket	
	};
}