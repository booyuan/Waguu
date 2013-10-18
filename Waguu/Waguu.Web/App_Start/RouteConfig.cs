﻿using System.Web.Mvc;
using System.Web.Routing;

namespace Waguu.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{parameter}",
                defaults: new { controller = "Index", action = "Index", parameter = UrlParameter.Optional }
            );

            //Does not work?
            routes.MapRoute(
                "Catagory",
                "Catagory/{parameter}",
                new { controller = "Index", action = "Index", parameter = UrlParameter.Optional }
            );
        }
    }
}