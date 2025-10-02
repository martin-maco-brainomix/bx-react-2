/**
 * Redraws an image onto a given canvas context.
 *
 * This function clears the specified rectangular area within the canvas context
 * and then draws an image at the coordinate origin (0,0).
 *
 * @param {HTMLImageElement} image - The image to be drawn onto the canvas.
 * @param {CanvasRenderingContext2D} context - The drawing context of the canvas.
 * @param {number} width - The width of the area to be cleared on the canvas.
 * @param {number} height - The height of the area to be cleared on the canvas.
 */
const redrawImage = (image, context, width, height) => {
  context.clearRect(0, 0, width, height)
  context.drawImage(image, 0, 0)
}

/**
 * Processes an image and extracts its pixel data into a 2D array of transformed integer values.
 *
 * @param {Object} params - An object containing the parameters for the function.
 * @param {HTMLImageElement} params.image - The image to be processed.
 * @param {HTMLCanvasElement} params.canvas - The canvas element used for drawing and extracting pixel data.
 * @param {number} [params.canvasWidth] - The width of the canvas to which the image will be drawn.
 * @param {number} [params.canvasHeight] - The height of the canvas to which the image will be drawn.
 * @param {boolean} [params.keepOriginalCanvasSize=false] - If true, the canvas size will be reset to its original dimensions after processing.
 *
 * @returns {number[][]} A 2D array where each element represents a row of the image, with pixel values transformed into signed 16-bit integers.
 */
export const computeImageData = ({
  image,
  canvas,
  canvasWidth,
  canvasHeight,
  keepOriginalCanvasSize = false
}) => {
  if (!canvas) {
    return null
  }

  const originalDimensions = [canvas?.width, canvas?.height]

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const context = canvas.getContext('2d', { willReadFrequently: true })
  redrawImage(image, context, canvasWidth, canvasHeight)

  const naturalWidth = image?.naturalWidth ?? canvasWidth
  const naturalHeight = image?.naturalHeight ?? canvasHeight
  let imageData

  imageData = context.getImageData(0, 0, naturalWidth, naturalHeight).data

  const result = []

  for (let rowIndex = 0; rowIndex < imageData.length; rowIndex += naturalWidth * 4) {
    let rowData = imageData.slice(rowIndex, rowIndex + naturalWidth * 4)
    let convertedRowData = new Array(naturalWidth)

    for (let srcIndex = 0, destIndex = 0; srcIndex < rowData.length; srcIndex += 4, ++destIndex) {
      convertedRowData[destIndex] = (rowData[srcIndex] << 8) + rowData[srcIndex + 1] - 32768
    }

    result.push(convertedRowData)
  }

  if (keepOriginalCanvasSize) {
    canvas.width = originalDimensions[0]
    canvas.height = originalDimensions[1]
  }

  return result
}
