/**
 * copyright @ waguu.com 2013 
 */

namespace Waguu.Web
{
    using System;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using System.Web.Http.ModelBinding.Binders;
    using Waguu.Data;
    using Waguu.Web.Binders;

    public static class WebApiConfig
    {
        private static readonly Type ModelBinderProviderType = typeof(ModelBinderProvider);
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "ClipAPI",
                routeTemplate: "api/clip/{action}",
                defaults: new { controller = "clip" }
            );

            config.Routes.MapHttpRoute(
                name: "DocumentAPI",
                routeTemplate: "api/document/{action}",
                defaults: new { controller = "document" }
                );

            // add model binders
            config.Services.Insert(ModelBinderProviderType, 0, new SimpleModelBinderProvider(typeof(Post), new PostBinder()));
        }
    }
}
