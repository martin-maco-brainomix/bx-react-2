import { useEffect, useState } from 'react'
import { isEmptyObject } from '../common/utilities.js'
import { API_URL_BASE, mprData, sourceImages } from '../common/constants.js'
import { computeImageData } from '../common/compute-image-data.js'

export const useImages = (spec, canvas) => {
  const [images, setImages] = useState({})

  const handleOnImageLoad = (image, index) => {
    setImages((prevImages) => ({
      ...prevImages,
      [index]: true
    }))

    mprData[index] = computeImageData({
      image,
      canvas,
      canvasWidth: spec.size_x,
      canvasHeight: spec.size_y
    })

    sourceImages[index] = image
  }

  useEffect(() => {
    if (!spec || isEmptyObject(spec)) {
      return
    }

    const { size_z, image_path } = spec

    for (let i = 0; i < size_z; i++) {
      const image = new Image()

      image.onload = () => handleOnImageLoad(image, i)

      image.crossOrigin = 'anonymous'

      image.src = `${API_URL_BASE}/${image_path}/${i}.png`
    }
  }, [spec])

  return images
}
