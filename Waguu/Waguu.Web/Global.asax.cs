/**
 * copyright @ waguu.com 2013 
 */

using Waguu.Data;
using Waguu.Web.Binders;

namespace Waguu.Web
{
    using System;
    using System.Configuration;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;
    using Framework;
    using Microsoft.WindowsAzure;

    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : WebApplication
    {
        protected override void OnApplicationStarted()
        {
            AreaRegistration.RegisterAllAreas();
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            CloudStorageAccount.SetConfigurationSettingPublisher(
                (configName, configSetter) => configSetter(ConfigurationManager.ConnectionStrings[configName].ConnectionString));
        }

        void Application_BeginRequest(object sender, EventArgs e)
        {
            var path = Request.Url.PathAndQuery.ToLower();
            switch (path)
            {
                case "/ld":
                    Context.RewritePath("~/scripts/loader.js");
                    break;
                case "/r":
                    Context.RewritePath("~/scripts/require.js");
                    break;
                case "/clip":
                    Context.RewritePath("~/content/clip/clip.css");
                    break;
                default:
                    break;
            }
        }
    }
}