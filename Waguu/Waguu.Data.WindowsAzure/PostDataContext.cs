namespace Waguu.Data.WindowsAzure
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;

    public class PostDataContext : TableServiceContext
    {
        public const string PostTable = "Posts";
        public const string TagTable = "Tags";
        public const string PostTagTable = "PostTags";

        private static bool initialized;
        private static object initializationLock = new object();

        private Dictionary<string, Type> resolverTypes;

        public PostDataContext()
            : this(CloudStorageAccount.FromConfigurationSetting("DataConnectionString"))
        {
        }

        public PostDataContext(Microsoft.WindowsAzure.CloudStorageAccount account)
            : base(account.TableEndpoint.ToString(), account.Credentials)
        {
            if (!initialized)
            {
                lock (initializationLock)
                {
                    if (!initialized)
                    {
                        this.CreateTables();
                        initialized = true;
                    }
                }
            }

            // we are setting up a dictionary of types to resolve in order
            // to workaround a performance bug during serialization
            this.resolverTypes = new Dictionary<string, Type>();
            this.resolverTypes.Add(PostTable, typeof(PostRow));
            this.resolverTypes.Add(TagTable, typeof(TagRow));
            this.resolverTypes.Add(PostTagTable, typeof(PostTagRow));

            this.ResolveType = (name) =>
            {
                var parts = name.Split('.');
                if (parts.Length == 2)
                {
                    return resolverTypes[parts[1]];
                }

                return null;
            };
        }

        public IQueryable<PostRow> Posts
        {
            get
            {
                return this.CreateQuery<PostRow>(PostTable);
            }
        }

        public IQueryable<TagRow> Tags
        {
            get
            {
                return this.CreateQuery<TagRow>(TagTable);
            }
        }

        public IQueryable<PostTagRow> PostTags
        {
            get
            {
                return this.CreateQuery<PostTagRow>(PostTagTable);
            }
        }

        public void CreateTables(Type serviceContextType, string baseAddress, StorageCredentials credentials)
        {
            TableStorageExtensionMethods.CreateTablesFromModel(serviceContextType, baseAddress, credentials);
        }

        public void CreateTables()
        {
            TableStorageExtensionMethods.CreateTablesFromModel(typeof(PostDataContext), this.BaseUri.AbsoluteUri, this.StorageCredentials);
        }
    }
}
