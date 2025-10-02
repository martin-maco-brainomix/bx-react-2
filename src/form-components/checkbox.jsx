import { useId } from 'react'
import classnames from 'classnames'

/**
 * A Checkbox component that allows users to toggle between checked and unchecked states.
 *
 * @param {Object} props - The props for the Checkbox component.
 * @param {boolean} props.checked - Indicates whether the checkbox is currently checked.
 * @param {function} props.onChange - A callback function invoked when the checkbox state changes. Receives the new checked state as an argument.
 * @param {string} [props.label] - The label text displayed next to the checkbox.
 * @param {boolean} [props.disabled=false] - Determines whether the checkbox is disabled and non-interactive.
 * @param {string} [props.className] - Additional classes to style the checkbox wrapper element.
 * @param {string} [props.id] - The unique identifier for the checkbox input element. If not provided, a generated ID will be used.
 * @param {Object} [props.rest] - Additional props spread onto the input element.
 */
export const Checkbox = ({ checked, onChange, label, disabled, className, id, ...rest }) => {
  const componentId = useId()

  const handleOnChange = (e) => {
    if (disabled) {
      return
    }

    onChange(e.target.checked)
  }

  return (
    <div className={classnames('bx-checkbox', className, { disabled })}>
      <label htmlFor={id || componentId}>
        <input
          type="checkbox"
          {...rest}
          id={id || componentId}
          checked={checked}
          onChange={handleOnChange}
        />
        <div>{label}</div>
      </label>
    </div>
  )
}
