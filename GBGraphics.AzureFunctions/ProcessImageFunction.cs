using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Linq;
using SixLabors.ImageSharp;
using GBGraphics.Core;
using System.Diagnostics;

namespace GBDev.AzureFunctions
{
    public static class ProcessImageFunction
    {
        private static readonly ColorConverter converter = new ColorConverter();
        private static readonly ImageResizer resizer = new ImageResizer();
        private const int maxFileSizeInBytesBeforeResizing = 1024 * 500;

        //https://blog.rasmustc.com/multipart-data-with-azure-functions-httptriggers/
        [FunctionName("ProcessImage")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest request,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var formData = await request.ReadFormAsync();
            var requestModel = ProcessImageRequest.ParseFrom(formData);
            log.LogInformation($"Request data: {requestModel}");

            var errors = requestModel.Validate();
            if (errors.Any())
            {
                log.LogWarning($"Rejecting request with validation errors: {string.Join(" ", errors)}");
                return new BadRequestObjectResult(errors);
            }

            var stopwatch = new Stopwatch();
            stopwatch.Start();
            using (var sourceImage = Image.Load(requestModel.Image.OpenReadStream()))
            {
                if (requestModel.Resize || requestModel.Image.Length > maxFileSizeInBytesBeforeResizing)
                {
                    log.LogInformation($"Resizing image per request or because it is too large.");
                    resizer.Resize(sourceImage, GameBoyConstants.ScreenWidth, GameBoyConstants.ScreenHeight);
                }
                using (var outputImage = converter.Convert(sourceImage, requestModel.Palette))
                {
                    stopwatch.Stop();
                    log.LogInformation($"Processed image in {stopwatch.Elapsed.TotalSeconds:n3} sec.");
                    return new FileContentResult(converter.ToBytes(outputImage), "image/png");
                }
            }
        }
    }
}
