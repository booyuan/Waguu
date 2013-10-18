namespace Waguu.Web.Services.Test
{
    public class TestImplementation : ITestInterface
    {
        public string GetName()
        {
            return "I'm testing IOC";
        }
    }
}