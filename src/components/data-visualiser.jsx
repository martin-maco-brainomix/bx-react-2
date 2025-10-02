import { useState } from 'react'

/**
 * DataVisualiser is a functional React component that takes in an object
 * as a prop and visually represents its data structure in a hierarchical
 * and readable format with accordion-style collapse/expand functionality.
 *
 * @param {Object} props - The prop object.
 * @param {Object} props.data - The data object to be visualised. It can
 * include various data types such as strings, numbers, booleans, arrays,
 * nested objects, or null/undefined values.
 *
 * @returns {JSX.Element} A JSX element displaying the data in a properly
 * formatted structure with collapsible sections.
 */
export const DataVisualiser = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const renderValue = (value) => {
    if (value === null) {
      return <span className="value-null">null</span>
    }

    if (value === undefined) {
      return <span className="value-undefined">undefined</span>
    }

    if (typeof value === 'boolean') {
      return <span className="value-boolean">{value.toString()}</span>
    }

    if (typeof value === 'number') {
      return <span className="value-number">{value}</span>
    }

    if (typeof value === 'string') {
      return <span className="value-string">"{value}"</span>
    }

    return value
  }

  const renderObject = (obj, level = 0) => {
    if (obj === null || obj === undefined) {
      return renderValue(obj)
    }

    if (typeof obj !== 'object') {
      return renderValue(obj)
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return <span className="empty-array">[]</span>
      }

      return (
        <div className="array-container" style={{ marginLeft: `${level * 20}px` }}>
          <span className="bracket">[</span>
          {obj.map((item, index) => (
            <div key={index} className="array-item">
              <span className="array-index">{index}:</span>
              {renderObject(item, level + 1)}
              {index < obj.length - 1 && <span className="comma">,</span>}
            </div>
          ))}
          <span className="bracket">]</span>
        </div>
      )
    }

    const entries = Object.entries(obj)

    if (entries.length === 0) {
      return <span className="empty-object">{'{}'}</span>
    }

    return (
      <div className="object-container" style={{ marginLeft: `${level * 20}px` }}>
        <span className="bracket">{'{'}</span>
        {entries.map(([key, value], index) => (
          <div key={key} className="object-property">
            <span className="property-key">{key}:</span>
            <span className="property-value">{renderObject(value, level + 1)}</span>
            {index < entries.length - 1 && <span className="comma">,</span>}
          </div>
        ))}
        <span className="bracket">{'}'}</span>
      </div>
    )
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bx-data-visualiser">
      <div className="accordion-header" onClick={toggleExpand}>
        <span className={`accordion-icon ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className="accordion-title">Data Visualiser</span>
      </div>
      {isExpanded && (
        <div className="accordion-content">
          {data && Object.keys(data).length > 0 ? (
            renderObject(data)
          ) : (
            <div className="no-data">No data to display</div>
          )}
        </div>
      )}
    </div>
  )
}
