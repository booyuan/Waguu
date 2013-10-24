/**
 * copyright @ waguu.com 2013 
 */

namespace Waguu.Web.Framework
{
    using System;
    using System.Reflection;
    using System.Web;
    using System.Web.Http;
    using Ninject;
    using Ninject.Web.Common;
    using Waguu.Data;
    using Waguu.Data.WindowsAzure;

    public class WebApplication : NinjectHttpApplication
    {
        protected override IKernel CreateKernel()
        {
            var kernel = new StandardKernel();

            // do we need to load other dependent assemblies?
            kernel.Load(Assembly.GetExecutingAssembly());
            kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
            kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

            RegisterServices(kernel);

            // let global configuration service resolver to use it
            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);

            return kernel;
        }

        private static void RegisterServices(IKernel kernel)
        {
            // This is where we tell Ninject how to resolve service requests
            kernel.Bind<IPostRepository>().To<PostRepository>();
        }
    }
}