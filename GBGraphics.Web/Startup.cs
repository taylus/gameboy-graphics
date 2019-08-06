using GBGraphics.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace GBGraphics.Web
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddTransient<ColorConverter>();
            services.AddTransient<ImageResizer>();
            services.AddSingleton(new FileUploadOptions()
            {
                MaxSizeInBytesBeforeResizing = 1024 * 500,
                AcceptedMimeTypes = new string[] { "image/jpeg", "image/png", "image/gif", "image/bmp" }
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();
            app.UseMvc();
        }
    }
}
