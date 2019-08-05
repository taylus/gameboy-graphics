using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Linq;
using SixLabors.ImageSharp;
using GBGraphics.Core;

namespace GBDev.AzureFunctions
{
    public static class ProcessImageFunction
    {
        private static readonly ColorConverter converter = new ColorConverter();
        private static readonly ImageResizer resizer = new ImageResizer();

        //https://blog.rasmustc.com/multipart-data-with-azure-functions-httptriggers/
        [FunctionName("ProcessImage")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest request,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var formData = await request.ReadFormAsync();
            var requestModel = ProcessImageRequest.ParseFrom(formData);
            var errors = requestModel.Validate();
            if (errors.Any()) return new BadRequestObjectResult(errors);

            using (var sourceImage = Image.Load(requestModel.Image.OpenReadStream()))
            {
                if (requestModel.Resize) resizer.Resize(sourceImage, GameBoyConstants.ScreenWidth, GameBoyConstants.ScreenHeight);
                using (var outputImage = converter.Convert(sourceImage, requestModel.Palette))
                using (var outputStream = converter.ToStream(outputImage))
                {
                    return new FileContentResult(outputStream.ToArray(), "image/png");
                }
            }
        }
    }
}
