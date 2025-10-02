import { isEmptyObject } from '../common/utilities.js'
import { useImages } from '../hooks'
import { useEffect, useRef } from 'react'
import { mprData, Planes, sourceImages } from '../common/constants.js'
import { windowImage } from '../common/windowing.js'
import { renderMprByPlane } from '../common/mpr.js'
import { getCanvasStyle, getSpacingFromSpec } from '../common/canvas-helpers.js'

export const ScanViewer = ({ value, spec = {}, windowing, plane, onEnableMpr, point }) => {
  const canvasRef = useRef(null)
  const windowingRef = useRef(null)
  const mprDataRef = useRef(null)

  const images = useImages(spec, mprDataRef.current)
  const { size_x, size_y, size_z } = spec
  const { width, level } = windowing
  const style = { height: `${size_x}px`, width: `${size_x}px` }

  useEffect(() => {
    redraw()
  }, [images?.[value], value, windowing?.width, windowing?.level, plane, point])

  useEffect(() => {
    if (Object.keys(images).length === size_z) {
      onEnableMpr()
    }
  }, [images, size_z])

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
    ctx.clearRect(0, 0, size_x, size_y)
  }

  const redraw = () => {
    const img = sourceImages[point.z]
    if (!img || !canvasRef.current || !windowingRef.current) {
      return
    }
    clearCanvas()

    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
    const windowCtx = windowingRef.current.getContext('2d', { willReadFrequently: true })

    const dimensions = { width: size_x, height: plane === Planes.AXIAL ? size_y : size_z }
    const imageData =
      plane === Planes.AXIAL
        ? mprData[point.z]
        : renderMprByPlane({
            plane,
            point,
            mprData: mprData,
            height: size_y
          })

    const windowedImg = windowImage({ imageData, width, level, ctx: windowCtx, dimensions, plane })

    ctx.putImageData(windowedImg, 0, 0)
  }

  const renderEmptyViewer = () => {
    return <div className="viewer-text">No data to display</div>
  }

  const renderLoadingViewer = () => {
    return (
      <div className="viewer-text">
        Loading slice {value + 1}/{size_z}
      </div>
    )
  }

  const renderImageViewer = () => {
    return (
      <canvas
        width={size_x}
        height={plane === Planes.AXIAL ? size_y : size_z}
        ref={canvasRef}
        style={style2}
      />
    )
  }

  const renderContent = () => {
    if (!spec || isEmptyObject(spec)) {
      return renderEmptyViewer()
    }

    if (!images[value]) {
      return renderLoadingViewer()
    }

    return renderImageViewer()
  }

  const renderWindowingCanvas = () => {
    return <canvas width={size_x} height={size_y} ref={windowingRef} style={{ display: 'none' }} />
  }

  const renderMprDataCanvas = () => {
    return <canvas width={size_x} height={size_y} ref={mprDataRef} style={{ display: 'none' }} />
  }

  const spacing = getSpacingFromSpec(spec.spacing, plane)
  const style2 = getCanvasStyle([size_x, size_y], spacing, plane)

  return (
    <div className="scan-viewer" style={style}>
      {renderMprDataCanvas()}
      {renderWindowingCanvas()}
      {renderContent()}
    </div>
  )
}
