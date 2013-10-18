namespace Waguu.Web.Framework
{
    using System.Reflection;
    using Ninject;
    using Ninject.Web.Common;

    public class WebApplication : NinjectHttpApplication
    {
        protected override IKernel CreateKernel()
        {
            var kernal = new StandardKernel();

            // do we need to load other dependent assemblies?
            kernal.Load(Assembly.GetExecutingAssembly());
            return kernal;
        }
    }
}