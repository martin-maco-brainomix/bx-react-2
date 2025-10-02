import { useId } from 'react'
import classnames from 'classnames'

/**
 * A functional React component for rendering a group of radio buttons. The component allows users to select one option from a predefined set of items.
 *
 * @param {Object} props - The properties object.
 * @param {*} props.value - The current selected value of the radio group.
 * @param {function} props.onChange - Callback function that is triggered when a different radio button is selected. Receives the value of the selected item as an argument.
 * @param {boolean} [props.disabled=false] - Determines whether the radio group is disabled. When `true`, all radio buttons in the group are non-interactive.
 * @param {string} [props.className] - Additional custom class names to apply to the component for styling purposes.
 * @param {Array<Object>} props.items - An array of objects representing the items in the radio group. Each item object should include:
 *  - `label` (string): The display label for the radio button.
 *  - `value` (*): The value associated with the radio button.
 *  - `id` (string, optional): A unique identifier for the radio button. If not provided, the component generates one internally.
 *  - Additional properties can be passed to customise individual radio inputs.
 *
 * @returns {JSX.Element} A JSX element representing the radio group.
 */
export const RadioGroup = ({ value, onChange, disabled, className, items }) => {
  const componentId = useId()

  const handleOnChange = (itemValue) => {
    if (disabled || itemValue === value) {
      return
    }
    onChange(itemValue)
  }

  const renderItem = (item, index) => {
    const { label, value: itemValue, id: itemId, ...rest } = item
    const id = `${itemId || componentId}-${index}`

    return (
      <div className={classnames('bx-radio', className, { disabled })} key={index}>
        <label htmlFor={id}>
          <input
            type="radio"
            id={id}
            value={itemValue}
            checked={itemValue === value}
            onChange={() => handleOnChange(itemValue)}
            name={componentId}
            {...rest}
          />
          <div>{label}</div>
        </label>
      </div>
    )
  }

  return <div>{items.map(renderItem)}</div>
}
