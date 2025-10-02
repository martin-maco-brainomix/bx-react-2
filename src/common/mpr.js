import { Planes } from './constants.js'

const { AXIAL, CORONAL, SAGITTAL } = Planes

/**
 * Renders a multi-planar reconstruction (MPR) view based on the specified plane, point, and MPR data.
 *
 * @param {Object} params - Parameters for rendering the MPR view.
 * @param {string} params.plane - The plane to render (e.g., CORONAL, SAGITTAL, AXIAL).
 * @param {Object} params.point - The target point in the MPR space, with `x`, `y`, and `z` as coordinates.
 * @param {Object} params.mprData - The MPR data, represented as a collection of 2D image slices.
 * @param {number} params.height - The height of the image stack.
 * @returns {Array} The extracted scan data for the specified plane.
 */
export const renderMprByPlane = ({ plane, point, mprData, height }) => {
  let scanData = []

  switch (plane) {
    case CORONAL:
      const coronalData = []
      Object.values(mprData).forEach((axialSlice) => {
        coronalData.push([...axialSlice[height - 1 - point.y]])
      })
      scanData = [...coronalData].reverse()
      break
    case SAGITTAL:
      const sagittalData = []
      Object.values(mprData).forEach((axialSlice) => {
        sagittalData.push(axialSlice.map((value) => value[point.x]))
      })
      scanData = [...sagittalData].reverse()
      break
    case AXIAL:
      scanData = mprData[point.z]
      break
    default:
      return []
  }

  return scanData
}
