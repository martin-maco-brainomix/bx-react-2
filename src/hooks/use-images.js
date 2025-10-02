import { useEffect, useState } from 'react'
import { isEmptyObject } from '../common/utilities.js'
import { API_URL_BASE, mprData, sourceImages } from '../common/constants.js'
import { computeImageData } from '../common/compute-image-data.js'

export const useImages = (spec, canvas) => {
  const [images, setImages] = useState({})

  const handleOnImageLoad = (index, image) => {
    images[index] = image

    setImages((prevState) => ({
      ...prevState,
      [index]: image
    }))

    sourceImages[index] = image
    mprData[index] = computeImageData({
      image,
      canvas,
      canvasWidth: spec.size_x,
      canvasHeight: spec.size_y
    })
  }

  useEffect(() => {
    if (!spec || isEmptyObject(spec) || !canvas) {
      return
    }

    const { size_z, image_path } = spec

    for (let i = 0; i < size_z; i += 1) {
      const url = `${API_URL_BASE}/${image_path}/${i}.png`
      const img = new Image()

      img.crossOrigin = 'anonymous'

      img.onload = () => handleOnImageLoad(i, img)

      img.src = url
    }
  }, [spec, canvas])

  return images
}
