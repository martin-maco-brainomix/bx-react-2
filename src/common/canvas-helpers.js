import { isEmptyObject } from './utilities.js'
import { Planes, mprData } from './constants.js'

/**
 * Calculates the volume dimensions based on spacings and the specified plane.
 *
 * @param {Object} spacings - An object representing the spacing values for each axis (x, y, z).
 * @param {string} plane - The plane for which the spacing calculation is being performed. Can be one of the predefined values in `Planes` (e.g. CORONAL, SAGITTAL).
 * @returns {Object} An object containing `volumeWidth` and `volumeHeight` attributes representing the calculated dimensions for the specified plane.
 */
export const getSpacingFromSpec = (spacings, plane) => {
  if (!mprData || isEmptyObject(mprData) || !spacings?.z) {
    return {
      volumeWidth: 1,
      volumeHeight: 1
    }
  }
  const mprDataLength = Object.keys(mprData).length

  const idx1 = Object.keys(mprData)?.[0]
  const idx2 = Object.keys(mprData[idx1])?.[0]

  if (!mprData[idx1]?.[idx2]) {
    return {
      volumeWidth: 1,
      volumeHeight: 1
    }
  }

  switch (plane) {
    case Planes.CORONAL:
      return {
        volumeWidth: spacings.y * mprData[idx1].length,
        volumeHeight: spacings.z * mprDataLength
      }
    case Planes.SAGITTAL:
      return {
        volumeWidth: spacings.x * mprData[idx1][idx2].length,
        volumeHeight: spacings.z * mprDataLength
      }
    default:
      return {
        volumeWidth: spacings.x * mprData[idx1][idx2].length,
        volumeHeight: spacings.y * mprData[idx1].length
      }
  }
}

/**
 * Calculates and returns the style properties for a canvas element based on canvas dimensions,
 * spacing dimensions, and the selected plane.
 *
 * @param {Array<number>} realCanvasDimensions - An array containing the width and height of the canvas [width, height].
 * @param {Object} [spacingDimensions={}] - An optional object containing the volume's width and height for spacing calculations.
 * @param {number} spacingDimensions.volumeWidth - The width of the volume used for spacing calculations.
 * @param {number} spacingDimensions.volumeHeight - The height of the volume used for spacing calculations.
 * @param {string} plane - The desired plane (e.g., axial, sagittal, coronal) for which the canvas style is being calculated.
 *
 * @returns {Object} A style object containing `width`, `height`, `top`, and `left` properties
 * representing the calculated styles for the canvas.
 */
export const getCanvasStyle = (realCanvasDimensions, spacingDimensions = {}, plane) => {
  if (plane === Planes.AXIAL) {
    return {}
  }

  const [cW, cH] = realCanvasDimensions

  const canvasRatio = cW / cH
  const spacingRatio = spacingDimensions.volumeWidth / spacingDimensions.volumeHeight
  const width = canvasRatio > spacingRatio ? cH * spacingRatio : cW
  const height = canvasRatio > spacingRatio ? cH : cW / spacingRatio
  const top = canvasRatio > spacingRatio ? 0 : (cH - height) / 2
  const left = canvasRatio > spacingRatio ? (cW - width) / 2 : 0

  return {
    width: `${Math.floor(width)}px`,
    height: `${Math.floor(height)}px`,
    top: `${Math.floor(top)}px`,
    left: `${Math.floor(left)}px`
  }
}
