using System.Collections.Generic;

namespace GBGraphics.Web
{
    public class FileUploadOptions
    {
        public int MaxSizeInBytesBeforeResizing { get; set; }
        public IEnumerable<string> AcceptedMimeTypes { get; set; } = new List<string>();
    }
}