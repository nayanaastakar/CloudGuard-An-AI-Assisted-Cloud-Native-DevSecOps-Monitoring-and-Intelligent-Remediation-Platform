import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { APP_NAME, SOCIAL_LINKS, GITHUB_URL } from '@/lib/constants';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const navigation = {
  product: [
  { name: 'Features', href: '/features' },
  { name: 'Documentation', href: '/docs' },
  { name: 'GitHub', href: GITHUB_URL }],

  support: [
  { name: 'Community', href: `${GITHUB_URL}/discussions` },
  { name: 'Issues', href: `${GITHUB_URL}/issues` },
  { name: 'Security', href: `${GITHUB_URL}/security` }],

  company: [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' }],

  legal: [
  { name: 'License', href: `${GITHUB_URL}/blob/main/LICENSE` },
  { name: 'Privacy', href: '/privacy' }]

};

export function Footer() {
  return (/*#__PURE__*/
    _jsxDEV("footer", { className: "bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800", "aria-labelledby": "footer-heading", children: [/*#__PURE__*/
      _jsxDEV("h2", { id: "footer-heading", className: "sr-only", children: "Footer" }, void 0, false

      ), /*#__PURE__*/
      _jsxDEV("div", { className: "mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "xl:grid xl:grid-cols-3 xl:gap-8", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "space-y-8", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent", children: APP_NAME }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm leading-6 text-gray-600 dark:text-gray-300", children: "AI-powered Kubernetes management platform. Free & Open Source." }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex space-x-6", children: [/*#__PURE__*/
              _jsxDEV("a", { href: SOCIAL_LINKS.github, className: "text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400", target: "_blank", rel: "noopener noreferrer", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "sr-only", children: "GitHub" }, void 0, false), /*#__PURE__*/
                _jsxDEV(Github, { className: "h-6 w-6" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("a", { href: SOCIAL_LINKS.twitter, className: "text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400", target: "_blank", rel: "noopener noreferrer", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "sr-only", children: "Twitter" }, void 0, false), /*#__PURE__*/
                _jsxDEV(Twitter, { className: "h-6 w-6" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("a", { href: SOCIAL_LINKS.linkedin, className: "text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400", target: "_blank", rel: "noopener noreferrer", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "sr-only", children: "LinkedIn" }, void 0, false), /*#__PURE__*/
                _jsxDEV(Linkedin, { className: "h-6 w-6" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "md:grid md:grid-cols-2 md:gap-8", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold leading-6 text-gray-900 dark:text-white", children: "Product" }, void 0, false), /*#__PURE__*/
                _jsxDEV("ul", { role: "list", className: "mt-6 space-y-4", children:
                  navigation.product.map((item) => /*#__PURE__*/
                  _jsxDEV("li", { children: /*#__PURE__*/
                    _jsxDEV(Link, { href: item.href, className: "text-sm leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children:
                      item.name }, void 0, false
                    ) }, item.name, false
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "mt-10 md:mt-0", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold leading-6 text-gray-900 dark:text-white", children: "Support" }, void 0, false), /*#__PURE__*/
                _jsxDEV("ul", { role: "list", className: "mt-6 space-y-4", children:
                  navigation.support.map((item) => /*#__PURE__*/
                  _jsxDEV("li", { children: /*#__PURE__*/
                    _jsxDEV(Link, { href: item.href, className: "text-sm leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children:
                      item.name }, void 0, false
                    ) }, item.name, false
                  )
                  ) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "md:grid md:grid-cols-2 md:gap-8", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold leading-6 text-gray-900 dark:text-white", children: "Company" }, void 0, false), /*#__PURE__*/
                _jsxDEV("ul", { role: "list", className: "mt-6 space-y-4", children:
                  navigation.company.map((item) => /*#__PURE__*/
                  _jsxDEV("li", { children: /*#__PURE__*/
                    _jsxDEV(Link, { href: item.href, className: "text-sm leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children:
                      item.name }, void 0, false
                    ) }, item.name, false
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "mt-10 md:mt-0", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold leading-6 text-gray-900 dark:text-white", children: "Legal" }, void 0, false), /*#__PURE__*/
                _jsxDEV("ul", { role: "list", className: "mt-6 space-y-4", children:
                  navigation.legal.map((item) => /*#__PURE__*/
                  _jsxDEV("li", { children: /*#__PURE__*/
                    _jsxDEV(Link, { href: item.href, className: "text-sm leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children:
                      item.name }, void 0, false
                    ) }, item.name, false
                  )
                  ) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "mt-16 border-t border-gray-900/10 dark:border-gray-700/30 pt-8 sm:mt-20 lg:mt-24", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs leading-5 text-gray-500 dark:text-gray-400", children: ["© ",
            new Date().getFullYear(), " ", APP_NAME, ". Released under the MIT License."] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-4 text-xs leading-5 text-gray-400 dark:text-gray-500", children: "Kubernetes, Lens, k9s, and other product names mentioned on this site are trademarks of their respective owners. All trademarks and registered trademarks are the property of their respective owners." }, void 0, false


          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}