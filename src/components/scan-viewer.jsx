import { isEmptyObject } from '../common/utilities.js'
import { useImages } from '../hooks'
import { useEffect, useRef } from 'react'
import { Planes } from '../common/constants.js'
import { windowImage } from '../common/windowing.js'
import { renderMprByPlane } from '../common/mpr.js'
import { getCanvasStyle, getSpacingFromSpec } from '../common/canvas-helpers.js'

export const ScanViewer = ({ point, spec = {}, windowing, onEnableMpr, plane }) => {
  const canvasRef = useRef(null)
  const mprDataRef = useRef(null)
  const windowingRef = useRef(null)
  const images = useImages(spec, mprDataRef.current)
  const { size_x, size_y, size_z } = spec
  const style = { height: `${size_x}px`, width: `${size_x}px` }

  const volumeDimensions = getSpacingFromSpec(spec.spacing, plane)
  const canvasStyle = getCanvasStyle([size_x, size_y], volumeDimensions, plane)

  const { width, level } = windowing

  useEffect(() => {
    redraw()
  }, [
    point,
    images?.[point.z],
    canvasRef.current,
    windowingRef.current,
    windowing.width,
    windowing.level,
    plane
  ])

  useEffect(() => {
    if (Object.values(images).length === size_z) {
      onEnableMpr()
    }
  }, [images])

  const renderEmptyViewer = () => {
    return <div className="viewer-text">No data to display</div>
  }

  const renderLoadingViewer = () => {
    return (
      <div className="viewer-text">
        Loading slice {point.z + 1}/{size_z}
      </div>
    )
  }

  const redraw = () => {
    if (!canvasRef.current || !windowingRef.current) {
      return
    }

    const windowingCtx = windowingRef.current.getContext('2d', { willReadFrequently: true })
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })

    const mprImageData = renderMprByPlane({
      plane,
      height: size_y,
      point
    })

    const windowedImage = windowImage({
      imageData: mprImageData,
      level,
      width,
      ctx: windowingCtx,
      dimensions: { width: size_x, height: size_y }
    })

    ctx.putImageData(windowedImage, 0, 0)
  }

  const renderImageViewer = () => {
    return (
      <canvas
        width={size_x}
        height={plane === Planes.AXIAL ? size_y : size_z}
        ref={canvasRef}
        style={canvasStyle}
      />
    )
  }

  const renderMprDataCanvas = () => {
    return <canvas width={size_x} height={size_y} ref={mprDataRef} style={{ display: 'none' }} />
  }

  const renderWindowingCanvas = () => {
    return <canvas width={size_x} height={size_y} ref={windowingRef} style={{ display: 'none' }} />
  }

  const renderContent = () => {
    if (!spec || isEmptyObject(spec)) {
      return renderEmptyViewer()
    }

    if (!images[point.z]) {
      return renderLoadingViewer()
    }

    return renderImageViewer()
  }

  return (
    <div className="scan-viewer" style={style}>
      {renderWindowingCanvas()}
      {renderMprDataCanvas()}
      {renderContent()}
    </div>
  )
}
