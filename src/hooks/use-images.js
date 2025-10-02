import { useState } from 'react'

export const useImages = (spec) => {
  const [images, setImages] = useState({})

  return images
}
