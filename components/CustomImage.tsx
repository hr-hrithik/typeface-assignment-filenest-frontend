import Image, { ImageProps } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import LottieLoadingBubble from '@/components/LottieFiles/LottieLoading';
import { isValidUrl, uuid } from '@/utils/Helper';
import UpdateSVGIcon from '@/components/CustomSVGIcons/UpdateSVGIcon';

type Props = { src: string; className?: string };

function CustomImage({ src, className, ...props }: Props & ImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageKey, setImageKey] = useState<string>(``);
  const [isValidImageURL, setIsValidImageURL] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  function handleImageReload() {
    setImageKey(`${src}-${uuid(4)}`);
  }

  useEffect(() => {
    if (src) {
      setLoading(true);
      setHasError(false);
      setIsValidImageURL(isValidUrl(src));
      setImageKey(`${src}-${uuid(4)}`);
    } else {
      setLoading(false);
      setHasError(true);
      setIsValidImageURL(false);
    }
  }, [src]);

  return (
    <>
      {loading && (
        <div
          className={`absolute left-0 top-0 flex justify-center items-center w-full h-full`}>
          <LottieLoadingBubble
            stylingClassName={`!w-[48px] !h-[48px] relative`}
          />
        </div>
      )}
      {!hasError && isValidImageURL ? (
        <Image
          ref={imageRef}
          key={imageKey}
          src={src}
          onLoad={() => {
            setLoading(false);
            setHasError(false);
          }}
          onError={() => {
            setLoading(false);
            setHasError(true);
          }}
          className={`${className}`}
          {...props}
        />
      ) : (
        <div className={`text-textLight text-[12px] font-bold`}>
          {isValidImageURL ? (
            <div
              onClick={handleImageReload}
              className={`px-[16px] flex flex-col justify-center items-center`}>
              <div className={`flex gap-[4px] items-center`}>
                <div
                  className={`w-[12px] h-[12px] min-w-[12px] flex justify-center items-center relative`}>
                  <UpdateSVGIcon />
                </div>
              </div>

              <p className={`text-center text-statusRed leading-[1.125]`}>
                Error in loading
              </p>
            </div>
          ) : (
            <p className={`text-textLight text-[12px] font-bold`}>No image</p>
          )}
        </div>
      )}
    </>
  );
}

export default CustomImage;
