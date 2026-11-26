import * as React from "react";
import { cn } from "@/lib/utils";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Card = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    className: cn(
      "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-gray-50 shadow-sm",
      className
    ), ...
    props }, void 0, false
  )
);
Card.displayName = "Card";

const CardHeader = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    className: cn("flex flex-col space-y-1.5 p-6", className), ...
    props }, void 0, false
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("h3", {
    ref: ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white",
      className
    ), ...
    props }, void 0, false
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("p", {
    ref: ref,
    className: cn("text-sm text-gray-500 dark:text-gray-400", className), ...
    props }, void 0, false
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", { ref: ref, className: cn("p-6 pt-0", className), ...props }, void 0, false)
);
CardContent.displayName = "CardContent";

const CardFooter = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    className: cn("flex items-center p-6 pt-0", className), ...
    props }, void 0, false
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };