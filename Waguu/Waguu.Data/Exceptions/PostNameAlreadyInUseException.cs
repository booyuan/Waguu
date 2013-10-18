namespace Waguu.Data.Exceptions
{
    using System;

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2237:MarkISerializableTypesWithSerializable", Justification = "Not Required")]
    public class PostNameAlreadyInUseException : ApplicationException
    {
        public PostNameAlreadyInUseException(string owner, string postName) :
            base("A picture with the same name already exists on this album")
        {
            this.Owner = owner;
            this.PostName = postName;
        }

        public string Owner { get; set; }

        public string PostName { get; set; }
    }
}
