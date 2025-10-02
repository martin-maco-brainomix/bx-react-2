import { isEmptyObject } from '../common/utilities.js'
import { useImages } from '../hooks'

export const ScanViewer = ({ value, spec = {} }) => {
  const images = useImages(spec)
  const { size_x, size_y, size_z } = spec
  const style = { height: `${size_x}px`, width: `${size_x}px` }

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
    return <canvas width={size_x} height={size_y} />
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

  return (
    <div className="scan-viewer" style={style}>
      {renderContent()}
    </div>
  )
}
