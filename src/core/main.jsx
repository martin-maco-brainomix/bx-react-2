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
  const [rangeValue, setRangeValue] = useState(0)
  const [plane, setPlane] = useState(Planes.AXIAL)
  const [windowing, setWindowing] = useState({ level: -1000, width: 1 })

  const { size_x, size_z } = data

  const handleOnMprEnable = () => {
    setMprEnabled(true)
  }

  const handleOnDataClick = () => {
    setLoading(true)
    fetch(API_URL, { method: 'GET', mode: 'cors' })
      .then((response) => response.json())
      .then((result) => {
        setData(result.data)
      })
      .finally(() => setLoading(false))
  }

  const handleOnPlaneChange = (value) => {
    setPlane(value)
  }

  const handleOnRangeChange = (value) => {
    setRangeValue(value - 1)
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
            value={rangeValue + 1}
            min={1}
            max={size_z || 0}
            onChange={handleOnRangeChange}
            className="scan-viewer-range"
            annotations={true}
            valuePosition={RangeValuePosition.bottom}
            disabled={!size_z}
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
            />
            {renderScanRange()}
          </div>
          {renderScanControls()}
        </div>
      </div>
    </div>
  )
}
