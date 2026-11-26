import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, ArrowRight } from 'lucide-react';
import { GITHUB_URL } from '@/lib/constants';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export const metadata = {
  title: 'About',
  description: 'Learn about KubeSight, our mission, and why we built the best free Kubernetes dashboard.'
};

export default function AboutPage() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-gray-950 pt-24", children: /*#__PURE__*/
      _jsxDEV("div", { className: "mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32", children: /*#__PURE__*/
        _jsxDEV("div", { className: "mx-auto max-w-3xl", children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl", children: "About KubeSight" }, void 0, false

          ), /*#__PURE__*/

          _jsxDEV("div", { className: "mt-10 space-y-8 text-lg leading-8 text-gray-600 dark:text-gray-300", children: [/*#__PURE__*/
            _jsxDEV("p", { children: [/*#__PURE__*/
              _jsxDEV("strong", { className: "text-gray-900 dark:text-white", children: "KubeSight" }, void 0, false), " is a free, open-source Kubernetes management platform that brings the power of artificial intelligence to DevOps teams. We believe that Kubernetes management tools should be accessible to everyone, not just enterprises with deep pockets."] }, void 0, true


            ), /*#__PURE__*/

            _jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-12", children: "Our Mission" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: ["Most Kubernetes dashboards show you ", /*#__PURE__*/
              _jsxDEV("em", { children: "what's wrong" }, void 0, false), ". KubeSight shows you ", /*#__PURE__*/_jsxDEV("em", { children: "why" }, void 0, false), " it's wrong and ", /*#__PURE__*/
              _jsxDEV("em", { children: "how" }, void 0, false), " to fix it. We're building the most intelligent, user-friendly Kubernetes management platform that's completely free and open source."] }, void 0, true

            ), /*#__PURE__*/

            _jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-12", children: "Why We Built This" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: "We were frustrated with the existing Kubernetes dashboards:" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("ul", { className: "list-disc pl-6 space-y-2", children: [/*#__PURE__*/
              _jsxDEV("li", { children: "Lens costs money and limits clusters on the free tier" }, void 0, false), /*#__PURE__*/
              _jsxDEV("li", { children: "k9s is powerful but CLI-only and has a steep learning curve" }, void 0, false), /*#__PURE__*/
              _jsxDEV("li", { children: "The official Kubernetes Dashboard is basic and hard to deploy" }, void 0, false), /*#__PURE__*/
              _jsxDEV("li", { children: "None of them have built-in AI or security scanning" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("p", { className: "mt-6", children: "So we built KubeSight with everything we wished existed:" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("ul", { className: "list-disc pl-6 space-y-2", children: [/*#__PURE__*/
              _jsxDEV("li", { children: [/*#__PURE__*/_jsxDEV("strong", { children: "AI-powered insights" }, void 0, false), " that actually help you fix problems"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("li", { children: [/*#__PURE__*/_jsxDEV("strong", { children: "Built-in security scanning" }, void 0, false), " with Trivy integration"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("li", { children: [/*#__PURE__*/_jsxDEV("strong", { children: "Unlimited multi-cluster support" }, void 0, false), " with no paid tiers"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("li", { children: [/*#__PURE__*/_jsxDEV("strong", { children: "Beautiful browser-based UI" }, void 0, false), " that's easy to use"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("li", { children: [/*#__PURE__*/_jsxDEV("strong", { children: "100% free and open source" }, void 0, false), " under the MIT license"] }, void 0, true)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-12", children: "Open Source" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: "KubeSight is released under the MIT License. This means you can:" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("ul", { className: "list-disc pl-6 space-y-2", children: [/*#__PURE__*/
              _jsxDEV("li", { children: "Use it for any purpose, including commercial projects" }, void 0, false), /*#__PURE__*/
              _jsxDEV("li", { children: "Modify it to fit your needs" }, void 0, false), /*#__PURE__*/
              _jsxDEV("li", { children: "Distribute it freely" }, void 0, false), /*#__PURE__*/
              _jsxDEV("li", { children: "Contribute back to make it better for everyone" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-12", children: "Architecture" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: "KubeSight is built with a modern microservices architecture:" }, void 0, false

            ), /*#__PURE__*/

            _jsxDEV("div", { className: "my-8 rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 bg-white dark:bg-gray-900 p-8", children: /*#__PURE__*/
              _jsxDEV("img", {
                src: "/images/architecture.svg",
                alt: "KubeSight Architecture Diagram",
                className: "w-full h-auto" }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/

            _jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-12", children: "Get Involved" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: "We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or just spreading the word, we'd love your help." }, void 0, false


            ), /*#__PURE__*/

            _jsxDEV("div", { className: "mt-10 flex items-center gap-x-6", children: [/*#__PURE__*/
              _jsxDEV(Link, { href: GITHUB_URL, target: "_blank", rel: "noopener noreferrer", children: /*#__PURE__*/
                _jsxDEV(Button, { size: "lg", className: "gap-x-2", children: [/*#__PURE__*/
                  _jsxDEV(Github, { className: "h-5 w-5" }, void 0, false), "Contribute on GitHub"] }, void 0, true

                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV(Link, { href: `${GITHUB_URL}/discussions`, target: "_blank", rel: "noopener noreferrer", children: /*#__PURE__*/
                _jsxDEV(Button, { variant: "outline", size: "lg", className: "gap-x-2", children: ["Join Discussions", /*#__PURE__*/

                  _jsxDEV(ArrowRight, { className: "h-4 w-4" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}