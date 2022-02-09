import { MimeType } from "../../../types/file";
import { Transformer } from "../../../types/transformer";
import { typeHandlers } from "./handlers";
import { bilinearInterpolation } from "./interpolation";

const supportedInputs = new Set([
  MimeType.JPEG,
  MimeType.PNG,
  MimeType.GIF,
  MimeType.BMP,
  MimeType.TIFF,
]);

const supportedOutputs = new Set([
  MimeType.JPEG,
  MimeType.PNG,
  MimeType.GIF,
  MimeType.BMP,
]);

export const pureTransformer: Transformer = {
  name: "pureTransformer",
  supportedInputs,
  supportedOutputs,
  transform: async (
    { data, contentType: inputContentType },
    {
      contentType: outputContentType,
      width,
      height,
      fit,
      position,
      background,
      quality,
      compressionLevel,
      loop,
      delay,
    }
  ) => {
    const inputHandler = typeHandlers[inputContentType];
    const rgba = await inputHandler.decode(data);

    let targetWidth = width || rgba.width * ((height || 0) / rgba.height);
    let targetHeight = height || rgba.height * ((width || 0) / rgba.width);

    if (targetWidth <= 0 || targetHeight <= 0) {
      throw new Error("At least one dimension must be provided!");
    }

    targetWidth = Math.round(targetWidth);
    targetHeight = Math.round(targetHeight);

    const rawImageData = {
      data: new Uint8Array(targetWidth * targetHeight * 4),
      width: targetWidth,
      height: targetHeight,
    };

    bilinearInterpolation(rgba, rawImageData);

    const outputHandler = typeHandlers[outputContentType || inputContentType];
    return outputHandler.encode(rawImageData, {
      width: targetWidth,
      height: targetHeight,
      fit,
      position,
      background,
      quality,
      compressionLevel,
      loop,
      delay,
    });
  },
};
