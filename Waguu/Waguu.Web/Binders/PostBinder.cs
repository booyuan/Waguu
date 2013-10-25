/**
 * copyright @ waguu.com 2013 
 */

namespace Waguu.Web.Binders
{
    using System;
    using System.Web.Http.Controllers;
    using System.Web.Http.ModelBinding;
    using Newtonsoft.Json;
    using Waguu.Data;

    public class PostBinder : IModelBinder
    {
        private static readonly Type PostType = typeof(Post);

        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType != PostType)
            {
                return false;
            }

            try
            {
                var obj = JsonConvert.DeserializeObject<dynamic>(actionContext.Request.Content.ReadAsStringAsync().Result);

                // parse data from the json input
                bindingContext.Model = new Post
                {
                    AlbumId = obj.Album+"",
                    Description = "Testing Data",
                    Owner = "shawnca",
                    PostId = obj.ID,
                    Source = obj.URL,
                    Title = "Testing",
                    Content = string.Join("||", obj.Sections)
                };

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}