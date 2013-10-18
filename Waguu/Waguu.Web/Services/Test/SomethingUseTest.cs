namespace Waguu.Web.Services.Test
{
    public class SomethingUseTest
    {
        public SomethingUseTest(ITestInterface test)
        {
            this.TestName = test.GetName();
        }

        public string TestName { get; private set; }
    }
}