import { useState } from 'react'

import { useImages } from '../hooks'

import { Checkbox, Button, Range, RadioGroup } from '../form-components'
import { DataVisualiser, ScanViewer } from '../components'

import {
  API_URL,
  ButtonVariants,
  DEFAULT_IMAGE_SIZE,
  Planes,
  RangeValuePosition
} from '../common/constants.js'

import '../styles/main.scss'

const radioItems = [
  { label: 'Axial', value: Planes.AXIAL },
  { label: 'Coronal', value: Planes.CORONAL },
  { label: 'Sagittal', value: Planes.SAGITTAL }
]

export const Main = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [mprEnabled, setMprEnabled] = useState(false)
  const [rangeValue, setRangeValue] = useState(0)
  const [point, setPoint] = useState({ x: 0, y: 0, z: 0 })
  const [plane, setPlane] = useState(Planes.AXIAL)
  const [windowing, setWindowing] = useState({ level: -1000, width: 1 })

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

  const handleOnWindowingChange = (level, width) => {
    setWindowing({ level, width })
  }

  const handleOnPointChange = (x, y, z) => {
    setPoint({ x, y, z })
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
        <div style={{ width: `${data?.size_x ?? DEFAULT_IMAGE_SIZE}px` }}>
          Axial:
          <Range
            value={point.z}
            min={0}
            max={data.size_z - 1 || 0}
            onChange={(newVal) => handleOnPointChange(point.x, point.y, newVal)}
            className="scan-viewer-range"
            annotations={true}
            valuePosition={RangeValuePosition.bottom}
            disabled={!data.size_z || plane !== Planes.AXIAL}
          />
        </div>
        <div style={{ width: `${data?.size_x ?? DEFAULT_IMAGE_SIZE}px` }}>
          Coronal:
          <Range
            value={point.y}
            min={0}
            max={data.size_y - 1 || 0}
            onChange={(newVal) => handleOnPointChange(point.x, newVal, point.z)}
            className="scan-viewer-range"
            annotations={true}
            valuePosition={RangeValuePosition.bottom}
            disabled={plane !== Planes.CORONAL}
          />
        </div>
        <div style={{ width: `${data?.size_x ?? DEFAULT_IMAGE_SIZE}px` }}>
          Sagittal:
          <Range
            value={point.x}
            min={0}
            max={data.size_x - 1 || 0}
            onChange={(newVal) => handleOnPointChange(newVal, point.y, point.z)}
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
              value={rangeValue}
              spec={data}
              windowing={windowing}
              plane={plane}
              onEnableMpr={handleOnMprEnable}
              point={point}
            />
            {renderScanRange()}
          </div>
          {renderScanControls()}
        </div>
      </div>
    </div>
  )
}
