import { useState } from 'react'

import { Button, Range, RadioGroup } from '../form-components'
import { DataVisualiser, ScanViewer } from '../components'

import { API_URL, DEFAULT_IMAGE_SIZE, Planes, RangeValuePosition } from '../common/constants.js'

import '../styles/main.scss'

const radioItems = [
  { label: 'Axial', value: Planes.AXIAL },
  { label: 'Coronal', value: Planes.CORONAL },
  { label: 'Sagittal', value: Planes.SAGITTAL }
]

export const Main = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [mprEnabled, setMprEnabled] = useState(false)
  const [plane, setPlane] = useState(Planes.AXIAL)
  const [windowing, setWindowing] = useState({ level: -1000, width: 1 })
  const [point, setPoint] = useState({ x: 0, y: 0, z: 0 })

  const { size_x, size_z, size_y } = data

  const handleOnMprEnable = () => {
    setMprEnabled(true)
  }

  const handleOnDataClick = () => {
    setLoading(true)
    fetch(API_URL, { method: 'GET', mode: 'cors' })
      .then((response) => response.json())
      .then((result) => {
        setData(result.data)
        setWindowing({ level: result.data.windowing.level, width: result.data.windowing.width })
      })
      .finally(() => setLoading(false))
  }

  const handleOnPlaneChange = (value) => {
    setPlane(value)
  }

  const handleOnPointChange = (value) => {
    setPoint(value)
  }

  const handleOnWindowingChange = (level, width) => {
    setWindowing({ level, width })
  }

  const renderMainControls = () => {
    return (
      <div className="main-controls">
        <Button onClick={handleOnDataClick} disabled={loading}>
          {loading ? 'Getting data' : 'Get data'}
        </Button>
        <DataVisualiser data={data} />
      </div>
    )
  }

  const renderScanRange = () => {
    return (
      <>
        <div style={{ width: `${size_x ?? DEFAULT_IMAGE_SIZE}px` }}>
          Axial:
          <Range
            value={point.z + 1}
            min={1}
            max={size_z || 0}
            onChange={(newValue) =>
              handleOnPointChange({ x: point.x, y: point.y, z: newValue - 1 })
            }
            className="scan-viewer-range"
            annotations={true}
            valuePosition={RangeValuePosition.bottom}
            disabled={!size_z || plane !== Planes.AXIAL}
          />
        </div>
        <div style={{ width: `${size_x ?? DEFAULT_IMAGE_SIZE}px` }}>
          Coronal:
          <Range
            value={point.y + 1}
            min={1}
            max={size_y || 0}
            onChange={(newValue) =>
              handleOnPointChange({ x: point.x, y: newValue - 1, z: point.z })
            }
            className="scan-viewer-range"
            annotations={true}
            valuePosition={RangeValuePosition.bottom}
            disabled={plane !== Planes.CORONAL}
          />
        </div>
        <div style={{ width: `${size_x ?? DEFAULT_IMAGE_SIZE}px` }}>
          Sagittal:
          <Range
            value={point.x + 1}
            min={1}
            max={size_x || 0}
            onChange={(newValue) =>
              handleOnPointChange({ x: newValue - 1, y: point.y, z: point.z })
            }
            className="scan-viewer-range"
            annotations={true}
            valuePosition={RangeValuePosition.bottom}
            disabled={plane !== Planes.SAGITTAL}
          />
        </div>
      </>
    )
  }

  const renderScanControls = () => {
    return (
      <div className="controls">
        <div>
          Windowing Width:
          <Range
            value={windowing.width}
            min={1}
            max={4000}
            onChange={(newVal) => handleOnWindowingChange(windowing.level, newVal)}
            className="scan-viewer-range"
            annotations={true}
          />
        </div>
        <div>
          Windowing Level:
          <Range
            value={windowing.level}
            min={-1000}
            max={1000}
            onChange={(newVal) => handleOnWindowingChange(newVal, windowing.width)}
            className="scan-viewer-range"
            annotations={true}
          />
        </div>
        <RadioGroup
          items={radioItems}
          value={plane}
          onChange={handleOnPlaneChange}
          disabled={!mprEnabled}
        />
      </div>
    )
  }

  return (
    <div className="main">
      <div className="content">
        {renderMainControls()}
        <div className="scan-viewer-container">
          <div className="scan-viewer-wrapper">
            <ScanViewer
              point={point}
              spec={data}
              windowing={windowing}
              plane={plane}
              onEnableMpr={handleOnMprEnable}
            />
            {renderScanRange()}
          </div>
          {renderScanControls()}
        </div>
      </div>
    </div>
  )
}
