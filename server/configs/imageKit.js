// Handle both ESM and CommonJS shapes from @imagekit/nodejs
import pkg from "@imagekit/nodejs";

// The package may export the constructor/function as the default export (CJS) or as the module itself.
const ImageKitLib = pkg?.default || pkg;

// If the import resolved to an object that already looks like an instance (rare), use it directly,
// otherwise construct a new instance.
let imagekit;
try {
  if (typeof ImageKitLib === 'function') {
    // typical: ImageKitLib is a constructor
    imagekit = new ImageKitLib({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } else if (ImageKitLib && typeof ImageKitLib === 'object' && (ImageKitLib.url || ImageKitLib.upload || ImageKitLib.uploader || ImageKitLib.uploads)) {
    // Already an initialized instance or an object exposing expected methods
    imagekit = ImageKitLib;
  } else {
    // Fallback: try to construct if there's an exported ImageKit property
    const Candidate = ImageKitLib?.ImageKit || ImageKitLib?.default || ImageKitLib;
    if (typeof Candidate === 'function') {
      imagekit = new Candidate({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });
    } else {
      // As a last resort assign the raw import so diagnostics can surface
      imagekit = ImageKitLib;
    }
  }
} catch (e) {
  // keep the original value for diagnostics
  imagekit = ImageKitLib;
}

// Normalize common method names: ensure there's an `upload` function on the exported object.
// Some SDK versions nest uploading under `uploads.upload` or `uploader.upload`.
if (imagekit && typeof imagekit.upload !== 'function') {
  const uploads = imagekit.uploads || imagekit.uploader || imagekit.uploder || null;
  if (uploads && typeof uploads.upload === 'function') {
    // bind so callers can use imagekit.upload()
    imagekit.upload = uploads.upload.bind(uploads);
  } else if (imagekit.files && typeof imagekit.files.upload === 'function') {
    // newer SDK exposes file operations under `files`
    imagekit.upload = imagekit.files.upload.bind(imagekit.files);
  } else if (imagekit.files && typeof imagekit.files.uploadFile === 'function') {
    imagekit.upload = imagekit.files.uploadFile.bind(imagekit.files);
  }
}

// Export both named and default for compatibility
export { imagekit };
export default imagekit;

// Helper: unified upload function that tries multiple underlying implementations.
export async function uploadImage(options) {
  if (!imagekit) throw new Error('ImageKit client not initialized');

  const candidates = [];
  if (typeof imagekit.upload === 'function') candidates.push({fn: imagekit.upload.bind(imagekit), ctx: imagekit});
  if (imagekit.files && typeof imagekit.files.upload === 'function') candidates.push({fn: imagekit.files.upload.bind(imagekit.files), ctx: imagekit.files});
  if (imagekit.files && typeof imagekit.files.uploadFile === 'function') candidates.push({fn: imagekit.files.uploadFile.bind(imagekit.files), ctx: imagekit.files});
  if (imagekit.uploads && typeof imagekit.uploads.upload === 'function') candidates.push({fn: imagekit.uploads.upload.bind(imagekit.uploads), ctx: imagekit.uploads});
  if (imagekit.uploader && typeof imagekit.uploader.upload === 'function') candidates.push({fn: imagekit.uploader.upload.bind(imagekit.uploader), ctx: imagekit.uploader});

  if (candidates.length === 0) {
    const available = imagekit ? Object.keys(imagekit) : 'none';
    throw new Error(`No upload method found on ImageKit client. Available keys: ${JSON.stringify(available)}`);
  }

  // Use the first candidate
  const {fn} = candidates[0];

  // If the caller passed a Buffer (from multer.memoryStorage), convert to base64 and set fileType.
  const callOptions = { ...options };
  try {
    if (callOptions.file && typeof Buffer !== 'undefined' && Buffer.isBuffer(callOptions.file)) {
      // Convert buffer to base64 string and instruct SDK that this is base64
      callOptions.file = callOptions.file.toString('base64');
      callOptions.fileType = callOptions.fileType || 'base64';
    }

    return await fn(callOptions);
  } catch (err) {
    // Enrich error with available keys for easier debugging
    const available = imagekit ? Object.keys(imagekit) : 'none';
    const e = new Error(`ImageKit upload failed: ${err.message} -- available keys: ${JSON.stringify(available)}`);
    e.cause = err;
    throw e;
  }
}

// Helper: get a usable URL for a stored file. Some SDKs expose `imagekit.url()` while others
// return `filePath` and expect the client to build the URL using the urlEndpoint.
export function getUrl(opts) {
  // opts can be { path: '...'} or { filePath: '...' } or { url: '...' } or transformation array
  if (!imagekit) throw new Error('ImageKit client not initialized');

  // If the SDK exposes a url() helper, use it.
  if (typeof imagekit.url === 'function') {
    return imagekit.url(opts);
  }

  // If the upload response already had a url field, prefer that
  if (opts && opts.url) return opts.url;

  // Determine path
  const path = opts?.path || opts?.filePath || opts?.name || opts?.fileName || null;
  if (!path) {
    throw new Error('Cannot construct ImageKit URL: missing path/filePath/name');
  }

  // Use configured urlEndpoint if available
  const endpoint = (imagekit && imagekit._options && imagekit._options.urlEndpoint) || process.env.IMAGEKIT_URL_ENDPOINT || '';
  // Ensure we don't double-slash
  const cleanedEndpoint = endpoint ? endpoint.replace(/\/+$/, '') : '';
  const cleanedPath = path.replace(/^\/+/, '');
  if (cleanedEndpoint) return `${cleanedEndpoint}/${cleanedPath}`;

  // Last resort: return the path (may be a full URL already)
  return path;
}
