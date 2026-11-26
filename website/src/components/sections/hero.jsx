import Link from 'next/link';
import { ArrowRight, Github, Star, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { GITHUB_URL, DOCS_URL } from '@/lib/constants';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export function Hero() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative overflow-hidden bg-white dark:bg-gray-950 pt-14", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "absolute inset-0 -z-10 overflow-hidden", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-3xl animate-pulse" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl animate-pulse delay-1000" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "absolute bottom-0 right-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse delay-2000" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "mx-auto max-w-7xl px-6 pb-16 pt-4 sm:pb-24 lg:flex lg:items-center lg:px-8 lg:py-16", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "mt-4 sm:mt-6 lg:mt-4", children: /*#__PURE__*/
            _jsxDEV("a", {
              href: `${GITHUB_URL}/releases`,
              className: "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-300 ring-1 ring-indigo-600/20 dark:ring-indigo-400/20", children: [/*#__PURE__*/

              _jsxDEV(Sparkles, { className: "h-3.5 w-3.5 animate-pulse" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "Latest release: v1.4.0" }, void 0, false), /*#__PURE__*/
              _jsxDEV(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("h1", { className: "mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "block text-gray-900 dark:text-white", children: "The Kubernetes Dashboard" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("span", { className: "block mt-2", children: /*#__PURE__*/
              _jsxDEV("span", { className: "inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient bg-300% hover:animate-gradient-fast", children: "That Thinks For You" }, void 0, false

              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("p", { className: "mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl", children: ["AI-powered Kubernetes management with",
            ' ', /*#__PURE__*/
            _jsxDEV("span", { className: "font-semibold text-indigo-600 dark:text-indigo-400", children: "built-in security scanning" }, void 0, false), ",", ' ', /*#__PURE__*/
            _jsxDEV("span", { className: "font-semibold text-purple-600 dark:text-purple-400", children: "multi-cluster support" }, void 0, false), ", and", ' ', /*#__PURE__*/
            _jsxDEV("span", { className: "font-semibold text-pink-600 dark:text-pink-400", children: "beautiful UX" }, void 0, false), "."] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("p", { className: "mt-3 text-xl font-bold text-gray-900 dark:text-white", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "inline-block animate-bounce-slow", children: "🚀" }, void 0, false), " No enterprise pricing. No cluster limits. No BS."] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "mt-6 flex flex-wrap gap-3", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 ring-1 ring-purple-600/20 dark:ring-purple-400/20 hover:scale-105 transition-transform cursor-default", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-base group-hover:animate-spin", children: "🤖" }, void 0, false), " AI-Powered"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300 ring-1 ring-green-600/20 dark:ring-green-400/20 hover:scale-105 transition-transform cursor-default", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-base group-hover:animate-bounce", children: "🔒" }, void 0, false), " Security Built-in"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-900/50 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/20 dark:ring-blue-400/20 hover:scale-105 transition-transform cursor-default", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-base group-hover:animate-pulse", children: "⚡" }, void 0, false), " Multi-Cluster"] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [/*#__PURE__*/
            _jsxDEV(Link, { href: DOCS_URL, target: "_blank", rel: "noopener noreferrer", className: "group", children: /*#__PURE__*/
              _jsxDEV(Button, {
                size: "lg",
                className: "w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-x-2 shadow-lg shadow-indigo-600/50 hover:shadow-xl hover:shadow-indigo-600/60 transition-all duration-300 hover:scale-105", children: [
                "Get Started", /*#__PURE__*/

                _jsxDEV(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" }, void 0, false)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(Link, { href: GITHUB_URL, target: "_blank", rel: "noopener noreferrer", className: "group", children: /*#__PURE__*/
              _jsxDEV(Button, {
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto gap-x-2 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300", children: [/*#__PURE__*/

                _jsxDEV(Github, { className: "h-5 w-5 transition-transform group-hover:rotate-12" }, void 0, false), "View on GitHub"] }, void 0, true

              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "mt-8 flex items-center gap-x-8 text-sm", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-x-2 group cursor-default", children: [/*#__PURE__*/
              _jsxDEV(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400 group-hover:animate-spin" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: "Open Source" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "text-gray-600 dark:text-gray-400", children: /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-gray-900 dark:text-white", children: "MIT License" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "text-gray-600 dark:text-gray-400", children: /*#__PURE__*/
              _jsxDEV("span", { className: "inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-white", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" }, void 0, false), "v1.4.0"] }, void 0, true

              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-20", children: /*#__PURE__*/
          _jsxDEV("div", { className: "max-w-3xl flex-none sm:max-w-5xl lg:max-w-none group", children: /*#__PURE__*/
            _jsxDEV("div", { className: "relative rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-2 ring-1 ring-indigo-500/20 dark:ring-indigo-400/20 lg:rounded-2xl lg:p-4 hover:ring-2 hover:ring-indigo-500/40 dark:hover:ring-indigo-400/40 transition-all duration-300 hover:scale-[1.02]", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" }, void 0, false), /*#__PURE__*/
              _jsxDEV("img", {
                src: "/images/dashboard-overview.png",
                alt: "KubeSight Dashboard",
                width: 2432,
                height: 1442,
                className: "relative w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10" }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true
    ));

}