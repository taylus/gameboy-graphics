using GBGraphics.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GBGraphics.Web
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddTransient<ColorConverter>();
            services.AddTransient<ImageResizer>();
            services.AddSingleton(new FileUploadOptions()
            {
                MaxSizeInBytesBeforeResizing = 1024 * 500,
                AcceptedMimeTypes = new string[] { "image/jpeg", "image/png", "image/gif", "image/bmp" }
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
