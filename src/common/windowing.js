/**
 * Generates a windowed image data object based on the given parameters.
 *
 * @param {Object} options - The input parameters for the operation.
 * @param {Array<Array<number>>} options.imageData - A 2D array containing the pixel intensity values.
 * @param {number} options.width - The window width for the intensity range.
 * @param {number} options.level - The window level for adjusting the centre of the intensity range.
 * @param {CanvasRenderingContext2D} options.ctx - The canvas rendering context used to create image data.
 * @param {Object} options.dimensions - An object specifying the dimensions of the output image.
 * @param {number} options.dimensions.width - The width of the output image.
 * @param {number} options.dimensions.height - The height of the output image.
 * @returns {ImageData|null} The modified ImageData object containing the windowed image, or null if an error occurs.
 */
export const windowImage = ({
  imageData,
  width,
  level,
  ctx,
  dimensions: { width: dWidth, height: dHeight }
}) => {
  const iD = ctx.createImageData(dWidth, dHeight)
  const data = iD.data

  for (let i = 3, n = data.length; i < n; i += 4) {
    data[i] = 255
  }

  const scanData = imageData
  const outputData = []
  scanData.forEach((row) => {
    row.forEach((item) => {
      outputData.push(item)
    })
  })

  const alpha = 255 / width
  const beta = 255 * (0.5 - level / width)
  const minHU = level - width / 2

  try {
    for (let srcIndex = 0; srcIndex < outputData.length; srcIndex += 1) {
      const hu = outputData[srcIndex]
      if (hu > minHU) {
        const windowedValue = alpha * hu + beta
        data.set([windowedValue, windowedValue, windowedValue], srcIndex * 4)
      }
    }
  } catch (error) {
    if (error instanceof RangeError) {
      return null
    } else {
      console.warn(error)
    }
  }

  return iD
}
