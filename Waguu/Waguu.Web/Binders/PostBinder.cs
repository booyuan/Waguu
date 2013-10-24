/**
 * copyright @ waguu.com 2013 
 */

namespace Waguu.Web.Binders
{
    using System;
    using Waguu.Data;
    using System.Web.Http.Controllers;
    using System.Web.Http.ModelBinding;

    public class PostBinder : IModelBinder
    {
        private static readonly Type PostType = typeof (Post);

        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType != PostType)
            {
                return false;
            }

            // parse data from the json input
            bindingContext.Model = new Post
            {

            };

            return true;
        }
    }
}