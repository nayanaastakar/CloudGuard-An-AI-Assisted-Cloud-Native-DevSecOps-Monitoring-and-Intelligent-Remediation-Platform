import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '../ui/button';
import { GITHUB_URL, DOCS_URL } from '@/lib/constants';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export function CTA() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "absolute inset-0 opacity-20", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/30 blur-3xl" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/30 blur-3xl" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8", children: /*#__PURE__*/
        _jsxDEV("div", { className: "mx-auto max-w-2xl text-center", children: [/*#__PURE__*/
          _jsxDEV("h2", { className: "text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Ready to get started?" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90", children: "Deploy KubeSight in minutes with Docker Compose or Helm. Join hundreds of teams already managing their Kubernetes clusters smarter." }, void 0, false


          ), /*#__PURE__*/
          _jsxDEV("div", { className: "mt-10 flex flex-col sm:flex-row items-center justify-center gap-4", children: [/*#__PURE__*/
            _jsxDEV(Link, { href: DOCS_URL, target: "_blank", rel: "noopener noreferrer", className: "group", children: /*#__PURE__*/
              _jsxDEV(Button, { size: "lg", className: "bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-white dark:text-indigo-900 dark:hover:bg-gray-100 gap-x-2 shadow-lg hover:shadow-xl transition-all hover:scale-105", children: ["Get Started", /*#__PURE__*/

                _jsxDEV(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" }, void 0, false)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(Link, { href: GITHUB_URL, target: "_blank", rel: "noopener noreferrer", className: "group", children: /*#__PURE__*/
              _jsxDEV(Button, { size: "lg", variant: "outline", className: "border-2 border-white text-white hover:bg-white/10 gap-x-2 hover:scale-105 transition-all", children: [/*#__PURE__*/
                _jsxDEV(Github, { className: "h-5 w-5 transition-transform group-hover:rotate-12" }, void 0, false), "View on GitHub"] }, void 0, true

              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "mt-10 text-center", children: /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-white/80", children: "Free & Open Source · MIT License · No Credit Card Required" }, void 0, false

            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}