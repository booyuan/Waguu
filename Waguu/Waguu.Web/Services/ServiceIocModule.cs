namespace Waguu.Web.Services
{
    using Test;
    using Ninject.Modules;

    public class ServiceIocModule : NinjectModule
    {
        public override void Load()
        {
            this.Bind<ITestInterface>().To<TestImplementation>().InSingletonScope();
        }
    }
}