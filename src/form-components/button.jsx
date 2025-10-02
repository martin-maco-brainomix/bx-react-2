import classnames from 'classnames'
import { ButtonVariants } from '../common/constants.js'

/**
 * A functional React component representing a button with customisable properties.
 *
 * @param {Object} props - The properties passed to the Button component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {boolean} props.disabled - Determines if the button is disabled. Defaults to false.
 * @param {Function} props.onClick - The callback function to be invoked when the button is clicked.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.variant=ButtonVariants.primary] - The styling variant of the button, determining its appearance.
 * @param {Object} [props.rest] - Additional properties to spread onto the button element.
 * @returns {JSX.Element} A button element with the provided configuration.
 */
export const Button = ({
  children,
  disabled,
  onClick,
  className,
  variant = ButtonVariants.primary,
  ...rest
}) => {
  const handleOnClick = (e) => {
    if (disabled) {
      return
    }
    onClick(e)
  }

  return (
    <button
      className={classnames('bx-button', className, variant, { disabled })}
      onClick={handleOnClick}
      disabled={disabled}
      {...rest}>
      {children}
    </button>
  )
}
