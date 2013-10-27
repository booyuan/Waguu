using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Web.WebPages.OAuth;
using Waguu.Web.Models;

namespace Waguu.Web
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
            // To let users of this site log in using their accounts from other sites such as Microsoft, Facebook, and Twitter,
            // you must update this site. For more information visit http://go.microsoft.com/fwlink/?LinkID=252166

            OAuthWebSecurity.RegisterMicrosoftClient(
                clientId: "0000000044107109",
                clientSecret: "Q-mwGmncotnOTnwtGLlPWafuIDRtJi4j");

            OAuthWebSecurity.RegisterTwitterClient(
                consumerKey: "Dw93e3uaohNppRCe9kSvw",
                consumerSecret: "D6tmtHJZ3XdT3NJdMmzBFY9IWc49hBgjyu3ArBcnM");

            OAuthWebSecurity.RegisterFacebookClient(
                appId: "648054308550797",
                appSecret: "1aa39c980c70acdd7035fd8185654aef");

            OAuthWebSecurity.RegisterGoogleClient();
        }
    }
}
