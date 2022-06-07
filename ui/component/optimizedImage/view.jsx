// @flow
import React from 'react';
import { getImageProxyUrl, getThumbnailCdnUrl } from 'util/thumbnail';

function scaleToDevicePixelRatio(value: number) {
  let scaled;
  // Account for DPR:
  scaled = value * (window.devicePixelRatio || 1.0);
  // Experiment: 2x image for better down-scaling.
  scaled *= 2;
  // Round to next 64px for better caching.
  scaled = (scaled + 0x20) & ~0x3f;
  // Ensure it's an integer for the CDN param.
  return Math.ceil(scaled);
}

function getOptimizedImgUrl(url, width, height, quality) {
  let optimizedUrl = url;
  if (url && !url.startsWith('/public/')) {
    optimizedUrl = url.trim().replace(/^http:\/\//i, 'https://');

    if (optimizedUrl.endsWith('.gif')) {
      optimizedUrl = getImageProxyUrl(optimizedUrl);
    } else {
      optimizedUrl = getThumbnailCdnUrl({ thumbnail: optimizedUrl, width, height, quality });
    }
  }
  return optimizedUrl;
}

// ****************************************************************************
// OptimizedImage
// ****************************************************************************

type Props = {
  src: string,
  width?: number,
  quality?: number,
  waitLoad?: boolean,
};

function OptimizedImage(props: Props) {
  const {
    src,
    width = 0, // 0 = use intrinsic width
    quality = 95,
    waitLoad,
    ...imgProps
  } = props;

  const ref = React.useRef<any>();
  const optimizedSrc = getOptimizedImgUrl(src, scaleToDevicePixelRatio(width), 0, quality);

  if (!src || !optimizedSrc) {
    return null;
  }

  return (
    <img
      ref={ref}
      {...imgProps}
      style={{ visibility: waitLoad ? 'hidden' : 'visible' }}
      src={optimizedSrc}
      onLoad={() => {
        if (waitLoad) {
          ref.current.style.visibility = 'visible';
        }
      }}
    />
  );
}

export default OptimizedImage;
