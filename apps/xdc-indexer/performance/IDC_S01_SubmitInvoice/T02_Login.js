
load.action('T02_Login', async function() {
        
    common = load.global.common;
            		    
    common.init();
    
    load.log(common.settings.p_UserName);
      
    var p_UserName = common.settings.p_UserName;
    
    var p_Password = common.settings.p_Password;

	var p_BuyerID = common.settings.p_BuyerID;	
	   
	var TT=common.settings.TT;
	    
   const T02_Login_tnx = new load.Transaction("IDC_S01_Indexer_Submit_Invoice_T02_Login");

    T02_Login_tnx.start();

    const webResponse15 = new load.WebRequest({
        id: 15,
        url: "https://avidxchange.oktapreview.com/.well-known/webfinger",
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
        queryString: {
            "resource": "okta:acct:p_UserName",
            "requestContext": "https://login.qa.avidsuite.com/auth/login?to_app=DataCapture&sso_callback=https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/sso/callback&to_url=https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/"
        },
    }).sendSync();

    const webResponse16 = new load.WebRequest({
        id: 16,
        url: "https://avidxchange.oktapreview.com/.well-known/webfinger",
        method: "GET",
        headers: {
            "accept": "application/jrd+json",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en",
            "content-type": "application/json",
            "origin": "https://login.qa.avidsuite.com",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "x-okta-user-agent-extended": "okta-auth-js/7.0.1 okta-signin-widget-7.2.1"
        },
        queryString: {
            "resource": "okta:acct:p_UserName",
            "requestContext": "https://login.qa.avidsuite.com/auth/login?to_app=DataCapture&sso_callback=https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/sso/callback&to_url=https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/"
        },
    }).sendSync();

    const webResponse17 = new load.WebRequest({
        id: 17,
        url: "https://avidxchange.oktapreview.com/api/v1/authn",
        method: "OPTIONS",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "content-type,x-okta-user-agent-extended",
            "access-control-request-method": "POST",
            "origin": "https://login.qa.avidsuite.com",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
    }).sendSync();

    const webResponse18 = new load.WebRequest({
        id: 18,
        url: "https://avidxchange.oktapreview.com/api/v1/authn",
        method: "POST",
        headers: {
            "accept": "application/json",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en",
            "content-type": "application/json",
            "origin": "https://login.qa.avidsuite.com",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "x-okta-user-agent-extended": "okta-auth-js/7.0.1 okta-signin-widget-7.2.1"
        },
        body: {
            "password": p_Password,
            "username": p_UserName,
            "options": {
                "warnBeforePasswordExpired": true,
                "multiOptionalFactorEnroll": true
            }
        },
        extractors: [
            // Source='Record scan' Original value="20111fzvFiV8EtEnM-OjNf88IRKvf3B3Bxp5YJgqiv4ti3GWAbECLbo"
            new load.JsonPathExtractor("c_SessionToken",".sessionToken"), 
        ],
    }).sendSync();

    const webResponse19 = new load.WebRequest({
        id: 19,
        url: "https://login.qa.avidsuite.com/",
        method: "POST",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://login.qa.avidsuite.com",
            "Referer": "https://login.qa.avidsuite.com/signin",
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
            "sessionToken": `${webResponse18.extractors['c_SessionToken']}`,
            "authType": "okta",
            "__RequestVerificationToken": c_RequestVerificationToken
        },
        extractors: [
            // Source='Record scan' Original value="s8SiWywnIuV0bnRIrFpJ-RTHkVlkf4NwPabsbvAoeJg"
            new load.HtmlExtractor("c_Code1", {
                querySelector: "input[type=hidden][name=code]",
                attributeName: "value"
            }), 
            // Source='Record scan' Original value="CfDJ8ErveS368FZHgdtshP8oh0gvn9ShE8-EerDBFcml5YKOvLTb-IFyZKvioapII5Av1wgnHC5SCzWSOAFTFDF7ApbuJehHXIc...
            new load.BoundaryExtractor("c_State1", {
                leftBoundary: "state=",
                rightBoundary: "&x",
                scope: "headers"
            }), 
        ],
    }).sendSync();

    const webResponse20 = new load.WebRequest({
        id: 20,
        url: "https://login.qa.avidsuite.com/profile/callback/",
        method: "POST",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "null",
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
        body: {
            "state": `${webResponse19.extractors['c_State1']}`,
            "code": `${webResponse19.extractors['c_Code1']}`
        },
    }).sendSync();

    const webResponse21 = new load.WebRequest({
        id: 21,
        url: "https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/sso/initiate",
        method: "GET",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "to_app": "DataCapture",
            "to_url": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "sso_callback": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/sso/callback"
        },
        extractors: [
            // Source='Record scan' Original value="SDY3yMqtOiasSI-0sNYrATYHmtbnqY0Pk1V1m_oGwgk"
            new load.BoundaryExtractor("c_Code", {
                leftBoundary: "code=",
                rightBoundary: "&state",
                scope: "headers"
            }), 
            // Source='Record scan' Original value="4742b226c948474d804b45490cd37f31"
            new load.BoundaryExtractor("c_State", {
                leftBoundary: "state=",
                rightBoundary: "&code_challenge_method",
                scope: "headers"
            }), 
        ],
    }).sendSync();

    const webResponse22 = new load.WebRequest({
        id: 22,
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
            "Referer": `https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/sso/callback?state=${webResponse21.extractors['c_State']}&code=${webResponse21.extractors['c_Code']}`,
            "Request-Id": "|2001a8bc22b44c999d7442b3c599b78f.71007f3cbbf34a6f",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "traceparent": "00-2001a8bc22b44c999d7442b3c599b78f-71007f3cbbf34a6f-01",
            "x-dtpc": "6$54430619_162h2vWIFTMMAFRUGKMTJUCMALPHMPFAWAFRDO-0e0"
        },
    }).sendSync();

    const webResponse23 = new load.WebRequest({
        id: 23,
        url: "https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/sso/tokens",
        method: "OPTIONS",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "authorization",
            "access-control-request-method": "POST",
            "origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "code": `${webResponse21.extractors['c_Code']}`,
            "state": `${webResponse21.extractors['c_State']}`
        },
    }).sendSync();

    const webResponse25 = new load.WebRequest({
        id: 25,
        url: "https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/sso/tokens",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer",
            "origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "code": `${webResponse21.extractors['c_Code']}`,
            "state": `${webResponse21.extractors['c_State']}`
        },
		extractors: [
 			 new load.BoundaryExtractor("c_AccessToken", {
                leftBoundary: "access_token\": \"",
                rightBoundary: "\",\n      \"scope",
                scope: "body"
            }), //"eyJraWQiOiJVWW56YUZjVzRhcjFZR3JUbFdOWUQ4NVhEVVpQT2s0cnMzVmliZER2T1BRIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIi...,
 		],
        
    }).sendSync();

    c_AccessToken = `${webResponse25.extractors['c_AccessToken']}`;
    
    Authorization = "Bearer "+ c_AccessToken;
    
    const webResponse28 = new load.WebRequest({
        id: 28,
        url: "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
        method: "GET",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Referer": `https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/sso/callback?state=${webResponse21.extractors['c_State']}&code=${webResponse21.extractors['c_Code']}`,
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
		extractors: [
 			 new load.TextCheckExtractor("Login_Check", { text: "AvidCapture", failOn: false, scope: load.ExtractorScope.Body }),
 		],
    }).sendSync();

    const webResponse29 = new load.WebRequest({
        id: 29,
        url: "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/assets/config/app.config.json",
        method: "GET",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": `Bearer ${webResponse25.extractors['c_AccessToken']}`,
            "Cache-Control": "no-cache, no-store",
            "Connection": "keep-alive",
            "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Request-Id": "|81ba561434d24f80ac95a7f8dcef5877.ae44445d95ad4e9e",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "traceparent": "00-81ba561434d24f80ac95a7f8dcef5877-ae44445d95ad4e9e-01",
            "x-dtpc": "6$54433605_719h2vWIFTMMAFRUGKMTJUCMALPHMPFAWAFRDO-0e0"
        },
    }).sendSync();

    const webResponse31 = new load.WebRequest({
        id: 31,
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

    const webResponse32 = new load.WebRequest({
        id: 32,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/xdcHub/negotiate",
        method: "OPTIONS",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Access-Control-Request-Headers": "authorization,x-requested-with,x-signalr-user-agent",
            "Access-Control-Request-Method": "POST",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "negotiateVersion": "1"
        },
    }).sendSync();

    const webResponse33 = new load.WebRequest({
        id: 33,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/api/search/aggregate",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": `Bearer ${webResponse25.extractors['c_AccessToken']}`,
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
                "buyerId": [],
                "documentId": [
                    "-nothing"
                ]
            },
            "GroupBy": [
                "buyerName",
                "buyerId"
            ]
        },
    }).sendSync();

    const webResponse34 = new load.WebRequest({
        id: 34,
        url: "https://ax-ae1-nt-idc-invindx-indexingapi01-int-api.qa-ase-avidxchange.com/xdcHub/negotiate",
        method: "POST",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": `Bearer ${webResponse25.extractors['c_AccessToken']}`,
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Content-Type": "text/plain;charset=UTF-8",
            "Origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "Referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "X-SignalR-User-Agent": "Microsoft SignalR/6.0 (6.0.10; Unknown OS; Browser; Unknown Runtime Version)",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        },
        queryString: {
            "negotiateVersion": "1"
        },
		extractors: [
 			 new load.BoundaryExtractor("c_AccessToken1", {
                leftBoundary: "accessToken\":\"",
                rightBoundary: "\",\"availableTransports",
                scope: "body"
            }), //"eyJhbGciOiJIUzI1NiIsImtpZCI6Ii0xNTkxNjMyOTI3IiwidHlwIjoiSldUIn0.eyJhc3JzLnMudWlkIjoiZTAzZWY5NjljZTR...,
			 new load.BoundaryExtractor("c_RequestID", {
                leftBoundary: "u0026asrs_request_id=",
                rightBoundary: "\",\"accessToken",
                scope: "body"
            }), //"`Bearer ${webResponse34.extractors['c_RequestID']}`",
 		],
    }).sendSync();
    
    c_RequestID = `${webResponse34.extractors['c_RequestID']}`;
    
    c_AccessToken1 = `${webResponse34.extractors['c_AccessToken1']}`;

    const webResponse35 = new load.WebRequest({
        id: 35,
        url: "https://ax-ae1-nt-idc-invindx-signalr.service.signalr.net/client/negotiate",
        method: "OPTIONS",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "authorization,x-requested-with,x-signalr-user-agent",
            "access-control-request-method": "POST",
            "cache-control": "max-age=0",
            "origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        queryString: {
            "hub": "xdchub",
            "asrs.op": "/xdcHub",
            "negotiateVersion": "1",
            "asrs_request_id": `${webResponse34.extractors['c_RequestID']}`
        },
    }).sendSync();

    const webResponse36 = new load.WebRequest({
        id: 36,
        url: "https://ax-ae1-nt-idc-invindx-signalr.service.signalr.net/client/negotiate",
        method: "POST",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "e]n-US,en;q=0.9",
			"Authorization": `Bearer ${webResponse34.extractors['c_AccessToken1']}`,
            "cache-control": "max-age=0",
            "content-type": "text/plain;charset=UTF-8",
            "origin": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com",
            "referer": "https://ax-ae1-nt-idc-invindx-indexerui01-web-ui.qa-ase-avidxchange.com/",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
            "x-signalr-user-agent": "Microsoft SignalR/6.0 (6.0.10; Unknown OS; Browser; Unknown Runtime Version)"
        },
        queryString: {
            "hub": "xdchub",
            "asrs.op": "/xdcHub",
            "negotiateVersion": "1",
            "asrs_request_id": `${webResponse34.extractors['c_RequestID']}`
        },
		extractors: [
 			 new load.BoundaryExtractor("c_ConnectionID", {
                leftBoundary: "connectionId\":\"",
                rightBoundary: "\",\"availableTransports",
                scope: "body"
            }), //"SQTjWO_0a7zNtoYZBab9hA0da6accf1",
 		],
    }).sendSync();

if(Login_Check = "true")
    {
    	T02_Login_tnx.stop("Passed");
    }
    	
    else
    {
    	T02_Login_tnx.stop("Failed");
    }	
    
	load.thinkTime(TT);	

	c_ConnectionID = `${webResponse36.extractors['c_ConnectionID']}`;
	
});
