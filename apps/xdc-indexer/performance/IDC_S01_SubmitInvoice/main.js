require("./T01_Launch.js");

require("./T02_Login.js");

require("./SelectBuyer.js");

require("./OpenInvoice_EnterDetails.js");

require("./Submit.js");

load.action("Action", async function () {
            	
  common = load.global.common;
     
  common.init();
                        
  var TT=common.settings.TT;
      
  const T07_Logout_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T07_Logout");

  T07_Logout_tnx.start();
    
  const webResponse52 = new load.WebRequest({
        id: 52,
        url: "https://login.qa.avidsuite.com/",
        method: "GET",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        extractors: [
            // Source='Record scan' Original value="CfDJ8ErveS368FZHgdtshP8oh0hGCDIvUnwL565yQDUK1DqMpAxtcDzt5qZuo_KSOBvjqwmzLsQ4j9XHZNMURpKv2AeE6ZZ5WIE...
            new load.HtmlExtractor("c_RequestVerificationToken1", {
                querySelector: "input[type=hidden][name=__RequestVerificationToken]",
                attributeName: "value"
            }), 
			 new load.TextCheckExtractor("Logout_Check", { text: "Sign In - AvidXchange Login", failOn: false, scope: load.ExtractorScope.Body }),
        ],
    }).sendSync();
  
    if(Logout_Check = "true")
    {
    	T07_Logout_tnx.stop("Passed");
    }
    	
    else
    {
    	T07_Logout_tnx.stop("Failed");
    }
    
    load.thinkTime(TT);

    const T08_Logout_Auth_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T08_Logout_Auth");

    T08_Logout_Auth_tnx.start();

    const webResponse53 = new load.WebRequest({
        id: 53,
        url: "https://login.qa.avidsuite.com/Auth/LogOut",
        method: "POST",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://login.qa.avidsuite.com",
            "Referer": "https://login.qa.avidsuite.com/",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        body: {
            "__RequestVerificationToken": `${webResponse52.extractors['c_RequestVerificationToken1']}`
        },
        extractors: [
            // Source='Record scan' Original value="CfDJ8ErveS368FZHgdtshP8oh0goTBxTqUxzzrYSDcUlmjlkZj-9yf5SY6zLqVpJLL5WQQXKPITekbb7wYar-dAC_PTU31DY05J...
            new load.BoundaryExtractor("c_State2", {
                leftBoundary: "state=",
                rightBoundary: "&x",
                scope: "headers"
            }), 
        ],
    }).sendSync();

    const webResponse54 = new load.WebRequest({
        id: 54,
        url: "https://login.qa.avidsuite.com/signout/callback",
        method: "GET",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Referer": "https://avidxchange.oktapreview.com/",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        queryString: {
            "state": `${webResponse53.extractors['c_State2']}`
        },
		extractors: [
 			 new load.TextCheckExtractor("SignOut_Check", { text: "Logout - AvidXchange Login", failOn: false, scope: load.ExtractorScope.Body }),
 		],
    }).sendSync();

    if(SignOut_Check = "true")
    {
    	T08_Logout_Auth_tnx.stop("Passed");
    }
    	
    else
    {
    	T08_Logout_Auth_tnx.stop("Failed");
    }
    
});

load.finalize("Finalize", async function () {
});

