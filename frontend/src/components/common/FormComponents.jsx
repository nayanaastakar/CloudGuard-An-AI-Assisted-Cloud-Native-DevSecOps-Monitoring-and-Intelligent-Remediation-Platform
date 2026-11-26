/**
 * Standardized Form Components
 * Provides consistent form inputs, selects, and buttons across the application.
 */

import React, { forwardRef, useState, useId } from 'react';
import { motion } from 'framer-motion';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon } from
'@heroicons/react/24/outline';

// =============================================================================
// SHARED STYLES
// =============================================================================
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
const baseInputStyles = `
  w-full px-4 py-2.5 text-sm
  bg-white dark:bg-slate-800
  border border-gray-300 dark:border-slate-600
  rounded-lg
  text-gray-900 dark:text-white
  placeholder-gray-400 dark:placeholder-gray-500
  transition-all duration-200
  focus:ring-2 focus:ring-primary-500 focus:border-primary-500
  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-700
`;

const errorInputStyles = `
  border-red-500 dark:border-red-400
  focus:ring-red-500 focus:border-red-500
`;

const labelStyles = `
  block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5
`;

const helperTextStyles = `
  mt-1.5 text-xs text-gray-500 dark:text-gray-400
`;

const errorTextStyles = `
  mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1
`;

// =============================================================================
// INPUT COMPONENT
// =============================================================================










export const Input = /*#__PURE__*/forwardRef(
  (
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    showPasswordToggle,
    type = 'text',
    className = '',
    id,
    ...props
  },
  ref) =>
  {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle ?
    showPassword ?
    'text' :
    'password' :
    type;

    return (/*#__PURE__*/
      _jsxDEV("div", { className: className, children: [
        label && /*#__PURE__*/
        _jsxDEV("label", { htmlFor: inputId, className: labelStyles, children: [
          label,
          props.required && /*#__PURE__*/_jsxDEV("span", { className: "text-red-500 ml-0.5", children: "*" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "relative", children: [
          leftIcon && /*#__PURE__*/
          _jsxDEV("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", children:
            leftIcon }, void 0, false
          ), /*#__PURE__*/

          _jsxDEV("input", {
            ref: ref,
            id: inputId,
            type: inputType,
            className: `
              ${baseInputStyles}
              ${error ? errorInputStyles : ''}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
            `,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${inputId}-error` : undefined, ...
            props }, void 0, false
          ),
          showPasswordToggle && /*#__PURE__*/
          _jsxDEV("button", {
            type: "button",
            onClick: () => setShowPassword(!showPassword),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children:

            showPassword ? /*#__PURE__*/
            _jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

          ),

          rightIcon && !showPasswordToggle && /*#__PURE__*/
          _jsxDEV("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children:
            rightIcon }, void 0, false
          )] }, void 0, true

        ),
        error && /*#__PURE__*/
        _jsxDEV(motion.p, {
          initial: { opacity: 0, y: -5 },
          animate: { opacity: 1, y: 0 },
          id: `${inputId}-error`,
          className: errorTextStyles, children: [/*#__PURE__*/

          _jsxDEV(ExclamationCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false),
          error] }, void 0, true
        ),

        helperText && !error && /*#__PURE__*/
        _jsxDEV("p", { className: helperTextStyles, children: helperText }, void 0, false)] }, void 0, true

      ));

  }
);

Input.displayName = 'Input';

// =============================================================================
// SEARCH INPUT COMPONENT
// =============================================================================





export const SearchInput = /*#__PURE__*/forwardRef(
  ({ onClear, value, ...props }, ref) => {
    return (/*#__PURE__*/
      _jsxDEV(Input, {
        ref: ref,
        type: "search",
        leftIcon: /*#__PURE__*/_jsxDEV(MagnifyingGlassIcon, { className: "h-5 w-5" }, void 0, false),
        value: value, ...
        props }, void 0, false
      ));

  }
);

SearchInput.displayName = 'SearchInput';

// =============================================================================
// TEXTAREA COMPONENT
// =============================================================================








export const Textarea = /*#__PURE__*/forwardRef(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (/*#__PURE__*/
      _jsxDEV("div", { className: className, children: [
        label && /*#__PURE__*/
        _jsxDEV("label", { htmlFor: textareaId, className: labelStyles, children: [
          label,
          props.required && /*#__PURE__*/_jsxDEV("span", { className: "text-red-500 ml-0.5", children: "*" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("textarea", {
          ref: ref,
          id: textareaId,
          className: `
            ${baseInputStyles}
            ${error ? errorInputStyles : ''}
            min-h-[100px] resize-y
          `,
          "aria-invalid": !!error,
          "aria-describedby": error ? `${textareaId}-error` : undefined, ...
          props }, void 0, false
        ),
        error && /*#__PURE__*/
        _jsxDEV(motion.p, {
          initial: { opacity: 0, y: -5 },
          animate: { opacity: 1, y: 0 },
          id: `${textareaId}-error`,
          className: errorTextStyles, children: [/*#__PURE__*/

          _jsxDEV(ExclamationCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false),
          error] }, void 0, true
        ),

        helperText && !error && /*#__PURE__*/
        _jsxDEV("p", { className: helperTextStyles, children: helperText }, void 0, false)] }, void 0, true

      ));

  }
);

Textarea.displayName = 'Textarea';

// =============================================================================
// SELECT COMPONENT
// =============================================================================
















export const Select = /*#__PURE__*/forwardRef(
  (
  { label, error, helperText, options, placeholder, className = '', id, ...props },
  ref) =>
  {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (/*#__PURE__*/
      _jsxDEV("div", { className: className, children: [
        label && /*#__PURE__*/
        _jsxDEV("label", { htmlFor: selectId, className: labelStyles, children: [
          label,
          props.required && /*#__PURE__*/_jsxDEV("span", { className: "text-red-500 ml-0.5", children: "*" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
          _jsxDEV("select", {
            ref: ref,
            id: selectId,
            className: `
              ${baseInputStyles}
              ${error ? errorInputStyles : ''}
              appearance-none pr-10 cursor-pointer
            `,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${selectId}-error` : undefined, ...
            props, children: [

            placeholder && /*#__PURE__*/
            _jsxDEV("option", { value: "", disabled: true, children:
              placeholder }, void 0, false
            ),

            options.map((option) => /*#__PURE__*/
            _jsxDEV("option", {

              value: option.value,
              disabled: option.disabled, children:

              option.label }, option.value, false
            )
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(ChevronDownIcon, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" }, void 0, false)] }, void 0, true
        ),
        error && /*#__PURE__*/
        _jsxDEV(motion.p, {
          initial: { opacity: 0, y: -5 },
          animate: { opacity: 1, y: 0 },
          id: `${selectId}-error`,
          className: errorTextStyles, children: [/*#__PURE__*/

          _jsxDEV(ExclamationCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false),
          error] }, void 0, true
        ),

        helperText && !error && /*#__PURE__*/
        _jsxDEV("p", { className: helperTextStyles, children: helperText }, void 0, false)] }, void 0, true

      ));

  }
);

Select.displayName = 'Select';

// =============================================================================
// CHECKBOX COMPONENT
// =============================================================================








export const Checkbox = /*#__PURE__*/forwardRef(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (/*#__PURE__*/
      _jsxDEV("div", { className: className, children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center h-5", children: /*#__PURE__*/
            _jsxDEV("input", {
              ref: ref,
              id: checkboxId,
              type: "checkbox",
              className: `
                h-4 w-4 rounded
                border-gray-300 dark:border-slate-600
                text-primary-600
                focus:ring-primary-500 focus:ring-offset-0
                dark:bg-slate-800
                disabled:opacity-50 disabled:cursor-not-allowed
                ${error ? 'border-red-500' : ''}
              `,
              "aria-invalid": !!error, ...
              props }, void 0, false
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
            _jsxDEV("label", {
              htmlFor: checkboxId,
              className: "text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer", children:

              label }, void 0, false
            ),
            description && /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children:
              description }, void 0, false
            )] }, void 0, true

          )] }, void 0, true
        ),
        error && /*#__PURE__*/
        _jsxDEV(motion.p, {
          initial: { opacity: 0, y: -5 },
          animate: { opacity: 1, y: 0 },
          className: `${errorTextStyles} ml-7`, children: [/*#__PURE__*/

          _jsxDEV(ExclamationCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false),
          error] }, void 0, true
        )] }, void 0, true

      ));

  }
);

Checkbox.displayName = 'Checkbox';

// =============================================================================
// SWITCH/TOGGLE COMPONENT
// =============================================================================










export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md'
}) {
  const id = useId();
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'h-3 w-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'h-5 w-5', translate: 'translate-x-5' }
  };

  const s = sizes[size];

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex items-center justify-between gap-3", children: [
      (label || description) && /*#__PURE__*/
      _jsxDEV("div", { className: "flex-1", children: [
        label && /*#__PURE__*/
        _jsxDEV("label", {
          htmlFor: id,
          className: "text-sm font-medium text-gray-700 dark:text-gray-300", children:

          label }, void 0, false
        ),

        description && /*#__PURE__*/
        _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children:
          description }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/

      _jsxDEV("button", {
        id: id,
        type: "button",
        role: "switch",
        "aria-checked": checked,
        disabled: disabled,
        onClick: () => onChange(!checked),
        className: `
          ${s.track}
          relative inline-flex shrink-0 cursor-pointer rounded-full
          border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-slate-600'}
        `, children: /*#__PURE__*/

        _jsxDEV("span", {
          className: `
            ${s.thumb}
            pointer-events-none inline-block rounded-full
            bg-white shadow-lg ring-0
            transition duration-200 ease-in-out
            ${checked ? s.translate : 'translate-x-0'}
          ` }, void 0, false
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// =============================================================================
// BUTTON COMPONENT
// =============================================================================













const buttonVariants = {
  primary: `
    bg-gradient-to-r from-primary-500 to-primary-600
    hover:from-primary-600 hover:to-primary-700
    text-white shadow-lg shadow-primary-500/25
    hover:shadow-xl hover:shadow-primary-500/30
  `,
  secondary: `
    bg-gray-100 dark:bg-slate-700
    hover:bg-gray-200 dark:hover:bg-slate-600
    text-gray-700 dark:text-gray-200
  `,
  danger: `
    bg-gradient-to-r from-red-500 to-red-600
    hover:from-red-600 hover:to-red-700
    text-white shadow-lg shadow-red-500/25
    hover:shadow-xl hover:shadow-red-500/30
  `,
  ghost: `
    bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800
    text-gray-600 dark:text-gray-400
  `,
  outline: `
    bg-transparent border border-gray-300 dark:border-slate-600
    hover:bg-gray-50 dark:hover:bg-slate-800
    text-gray-700 dark:text-gray-300
  `
};

const buttonSizes = {
  xs: 'px-2 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2'
};

export const Button = /*#__PURE__*/forwardRef(
  (
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
  },
  ref) =>
  {
    const isDisabled = disabled || loading;

    return (/*#__PURE__*/
      _jsxDEV(motion.button, {
        ref: ref,
        whileHover: !isDisabled ? { scale: 1.02 } : undefined,
        whileTap: !isDisabled ? { scale: 0.98 } : undefined,
        disabled: isDisabled,
        className: `
          inline-flex items-center justify-center
          font-medium rounded-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${buttonVariants[variant]}
          ${buttonSizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `, ...
        props, children:

        loading ? /*#__PURE__*/
        _jsxDEV(_Fragment, { children: [/*#__PURE__*/
          _jsxDEV("svg", {
            className: "animate-spin h-4 w-4",
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24", children: [/*#__PURE__*/

            _jsxDEV("circle", {
              className: "opacity-25",
              cx: "12",
              cy: "12",
              r: "10",
              stroke: "currentColor",
              strokeWidth: "4" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("path", {
              className: "opacity-75",
              fill: "currentColor",
              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("span", { children: "Loading..." }, void 0, false)] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV(_Fragment, { children: [
          leftIcon,
          children,
          rightIcon] }, void 0, true
        ) }, void 0, false

      ));

  }
);

Button.displayName = 'Button';

// =============================================================================
// ICON BUTTON COMPONENT
// =============================================================================






export const IconButton = /*#__PURE__*/forwardRef(
  ({ icon, size = 'md', className = '', ...props }, ref) => {
    const iconSizes = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3'
    };

    return (/*#__PURE__*/
      _jsxDEV(Button, {
        ref: ref,
        size: size,
        className: `${iconSizes[size]} ${className}`, ...
        props, children:

        icon }, void 0, false
      ));

  }
);

IconButton.displayName = 'IconButton';

// =============================================================================
// FORM GROUP COMPONENT (for layouts)
// =============================================================================






export function FormGroup({ children, className = '' }) {
  return /*#__PURE__*/_jsxDEV("div", { className: `space-y-4 ${className}`, children: children }, void 0, false);
}

// =============================================================================
// FORM ROW COMPONENT (for inline fields)
// =============================================================================






export function FormRow({ children, className = '' }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: `grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`, children:
      children }, void 0, false
    ));

}

// =============================================================================
// FORM SECTION COMPONENT (for grouped fields with title)
// =============================================================================








export function FormSection({
  title,
  description,
  children,
  className = ''
}) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: `space-y-4 ${className}`, children: [/*#__PURE__*/
      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children:
          title }, void 0, false
        ),
        description && /*#__PURE__*/
        _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children:
          description }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: children }, void 0, false)] }, void 0, true
    ));

}

// =============================================================================
// VALIDATION INDICATOR COMPONENT
// =============================================================================






export function ValidationIndicator({ valid, message }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: `flex items-center gap-1.5 text-xs ${valid ? 'text-emerald-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`, children: [
      valid ? /*#__PURE__*/
      _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

      _jsxDEV("div", { className: "h-3.5 w-3.5 rounded-full border-2 border-current" }, void 0, false),

      message] }, void 0, true
    ));

}