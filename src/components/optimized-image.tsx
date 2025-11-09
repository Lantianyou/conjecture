import Image, { type ImageProps } from "next/image";

type OptimizedImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function OptimizedImage({ src, ...props }: OptimizedImageProps) {
  // Check if the image is from polymarket-upload.s3.us-east-2.amazonaws.com
  // These images resolve to private IPs and can't be optimized by Next.js
  const isPolymarketImage = src.includes(
    "polymarket-upload.s3.us-east-2.amazonaws.com"
  );

  return <Image src={src} unoptimized={isPolymarketImage} {...props} />;
}
