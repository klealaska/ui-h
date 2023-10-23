const common = require("./IDC_Common.js")();

load.initialize("Initialize", async function () {
});

load.action('T01_Launch', async function() {

load.global.common =  common;

    var TT =common.settings.TT;

    const T01_Launch_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T01_Launch");

    T01_Launch_tnx.start();

    const webResponse1 = new load.WebRequest({
        id: 1,
        url: "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
        method: "GET",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        resources: [
        ],
    }).sendSync();

    const webResponse2 = new load.WebRequest({
        id: 2,
        url: "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/assets/config/app.config.json",
        method: "GET",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": "Bearer",
            "Cache-Control": "no-cache, no-store",
            "Connection": "keep-alive",
            "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Request-Id": "|3c5f9d4fec5f46aea61cd9ca3b55908b.a34c6dbfff5649d2",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "traceparent": "00-3c5f9d4fec5f46aea61cd9ca3b55908b-a34c6dbfff5649d2-01",
            "x-dtpc": "6$54384479_938h2vWIFTMMAFRUGKMTJUCMALPHMPFAWAFRDO-0e0"
        },
    }).sendSync();

    const webResponse6 = new load.WebRequest({
        id: 6,
        url: "https://login.qa.avidsuite.com/auth/login",
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
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        resources: [
        ],
        queryString: {
            "to_app": "DataCapture",
            "sso_callback": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/sso/callback",
            "to_url": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/"
        },
        extractors: [
            // Source='Record scan' Original value="CfDJ8ErveS368FZHgdtshP8oh0jvNF3QuHbltK4N5sBYNb-i8iPIso1nxMjW4c5t3gZMeOCPIX5yjHsyzlIbH2GqO0IPElPGRQr...
            new load.HtmlExtractor("c_RequestVerificationToken", {
                querySelector: "input[name=__RequestVerificationToken][type=hidden]",
                attributeName: "value"
            }), 
            new load.TextCheckExtractor("Launch_Check", { text: "Sign In - AvidXchange Login", failOn: false, scope: load.ExtractorScope.Body }),
        ],
    }).sendSync();

	c_RequestVerificationToken = `${webResponse6.extractors['c_RequestVerificationToken']}`;

    const webResponse13 = new load.WebRequest({
        id: 13,
        url: "https://avidxchange.oktapreview.com/api/v1/sessions/me",
        method: "OPTIONS",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "content-type,x-okta-user-agent-extended",
            "access-control-request-method": "GET",
            "origin": "https://login.qa.avidsuite.com",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();
    
      if(Launch_Check = "true")
    {
    	T01_Launch_tnx.stop("Passed");
    }
    	
    else
    {
    	T01_Launch_tnx.stop("Failed");
    }
    load.thinkTime(TT);
    
});

