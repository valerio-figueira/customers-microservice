export interface ImageProcessorInterface {
  resize(
    originalFileBuffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer>;

  toFormat(
    fileBuffer: Buffer,
    type: 'webp' | 'jpg' | 'jpeg' | 'png',
  ): Promise<Buffer>;
}
