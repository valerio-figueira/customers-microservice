import { ImageProcessorInterface } from '../../../core/app/ports/image-processor.interface';
import sharp from 'sharp';

export class ImageProcessorAdapter implements ImageProcessorInterface {
  public async resize(
    originalFileBuffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    return sharp(originalFileBuffer).resize({ height, width }).toBuffer();
  }

  public async toFormat(
    fileBuffer: Buffer,
    type: 'webp' | 'jpg' | 'jpeg' | 'png',
  ): Promise<Buffer> {
    return sharp(fileBuffer).toFormat(type).toBuffer();
  }
}
