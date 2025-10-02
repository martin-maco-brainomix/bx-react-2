import { useEffect, useRef, useState } from 'react'

import classnames from 'classnames'

import { RangeValuePosition } from '../common/constants.js'

/**
 * Range is a customisable component that renders an accessible, styled range input, also known as a slider.
 *
 * @param {object} props - The properties object.
 * @param {number} props.value - The current value of the range.
 * @param {number} props.min - The minimum value of the range.
 * @param {number} props.max - The maximum value of the range.
 * @param {string} [props.className] - Additional CSS class names to apply to the range component.
 * @param {boolean} [props.disabled] - If true, disables the range input.
 * @param {function} props.onChange - Callback function triggered when the range value changes.
 * @param {boolean} [props.annotations] - Whether to display annotations (min/max values).
 * @param {string} [props.valuePosition] - The position of the value bubble relative to the slider,
 *       typically `top` or `bottom`.
 * @param {object} [props.rest] - Additional properties to be spread onto the `input` element.
 */
export const Range = ({
  value,
  min = 0,
  max = 100,
  className,
  disabled,
  onChange,
  annotations,
  valuePosition = RangeValuePosition.top,
  ...rest
}) => {
  const inputRef = useRef(null)
  const debounceTimer = useRef(null)
  const [bubblePosition, setBubblePosition] = useState('0px')

  const handleOnChange = (e) => {
    if (disabled) {
      return
    }

    const newValue = parseInt(e.target.value, 10)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      onChange(newValue)
    }, 1)
  }

  const calculatePercentage = () => {
    return ((value - min) / (max - min)) * 100
  }

  const calculateBubblePosition = () => {
    if (!inputRef.current) {
      return '0px'
    }
    const percentage = calculatePercentage()
    const input = inputRef.current
    const inputWidth = input.offsetWidth
    const inputLeft = input.offsetLeft
    const thumbWidth = 18 // Width of the thumb/handle

    // Calculate the centre of the thumb
    let thumbCenter = inputLeft + (inputWidth * percentage) / 100

    thumbCenter +=
      percentage < 50
        ? ((1 - percentage / 50) * thumbWidth) / 2
        : -(((percentage - 50) / 50) * thumbWidth) / 2

    return `${thumbCenter}px`
  }

  const updateBubblePosition = () => {
    const position = calculateBubblePosition()
    setBubblePosition(position)
  }

  useEffect(() => {
    updateBubblePosition()
  }, [value, max, min])

  useEffect(() => {
    // Update position after the initial mount when DOM is ready
    const timer = setTimeout(() => {
      updateBubblePosition()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const renderLeftAnnotations = () => (
    <div className="bx-range-annotations">
      <span className="bx-range-min">{min}</span>
    </div>
  )

  const renderRightAnnotations = () => (
    <div className="bx-range-annotations">
      <span className="bx-range-max">{max}</span>
    </div>
  )

  const renderBubbleAnnotation = () => {
    const bubbleClassName = classnames(
      'bx-range-value-bubble',
      RangeValuePosition.top === valuePosition ? 'top' : 'bottom',
      { disabled }
    )

    return (
      <div className={bubbleClassName} style={{ left: bubblePosition }}>
        {value}
      </div>
    )
  }

  const renderInput = () => (
    <input
      ref={inputRef}
      type="range"
      value={value}
      min={min}
      max={max}
      className={classnames('bx-range', className, { disabled })}
      disabled={disabled}
      onChange={handleOnChange}
      {...rest}
    />
  )

  const renderContent = () => {
    if (!annotations || !max) {
      return renderInput()
    }

    if (valuePosition === RangeValuePosition.top) {
      return (
        <>
          {renderBubbleAnnotation()}
          {renderLeftAnnotations()}
          {renderInput()}
          {renderRightAnnotations()}
        </>
      )
    }

    return (
      <>
        {renderLeftAnnotations()}
        {renderInput()}
        {renderBubbleAnnotation()}
        {renderRightAnnotations()}
      </>
    )
  }

  return <div className="bx-range-wrapper">{renderContent()}</div>
}
