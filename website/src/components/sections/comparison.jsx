import { Check, X, AlertCircle } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";











const features = [
{ name: 'AI-Powered Insights', kubeSight: 'Chat + Proactive', lens: false, k9s: false, k8sDashboard: false },
{ name: 'Built-in Security Scanning', kubeSight: 'Trivy Integrated', lens: 'Plugin', k9s: false, k8sDashboard: false },
{ name: 'Multi-Cluster', kubeSight: 'Unlimited', lens: 'Paid', k9s: true, k8sDashboard: 'Limited' },
{ name: 'Browser-Based Terminals', kubeSight: 'Full PTY', lens: false, k9s: false, k8sDashboard: false },
{ name: 'Helm Visual Deployment', kubeSight: true, lens: 'Basic', k9s: false, k8sDashboard: false },
{ name: 'Cost Optimization', kubeSight: 'AI-Powered', lens: false, k9s: false, k8sDashboard: false },
{ name: 'Price', kubeSight: 'FREE', lens: 'Paid ($)', k9s: 'Free', k8sDashboard: 'Free' },
{ name: 'Installation', kubeSight: 'Docker/Helm', lens: 'Desktop App', k9s: 'CLI', k8sDashboard: 'Complex' }];


function renderCell(value, highlight = false) {
  if (value === true) {
    return /*#__PURE__*/_jsxDEV(Check, { className: `mx-auto h-5 w-5 ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-green-600 dark:text-green-400'}` }, void 0, false);
  }
  if (value === false) {
    return /*#__PURE__*/_jsxDEV(X, { className: "mx-auto h-5 w-5 text-gray-400 dark:text-gray-600" }, void 0, false);
  }
  // Check if value contains a warning indicator (Plugin, Paid, Limited, etc.)
  const isWarning = typeof value === 'string' && ['Plugin', 'Paid', 'Limited', 'Complex'].some((w) => value.includes(w));

  return (/*#__PURE__*/
    _jsxDEV("span", { className: `text-sm font-medium ${highlight ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : isWarning ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100'}`, children:
      value }, void 0, false
    ));

}

export function Comparison() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-gray-950 py-24 sm:py-32", children: /*#__PURE__*/
      _jsxDEV("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "mx-auto max-w-2xl text-center", children: [/*#__PURE__*/
          _jsxDEV("h2", { className: "text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl", children: "Why KubeSight?" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300", children: "We're not just another Kubernetes dashboard. Here's how we compare to the alternatives." }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "mx-auto mt-16 max-w-5xl", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
            _jsxDEV("table", { className: "w-full text-left border-collapse", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b-2 border-gray-300 dark:border-gray-600", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "pb-4 pr-6 font-semibold text-gray-900 dark:text-white text-left", children: "Feature" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "pb-4 px-6 text-center", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "inline-flex flex-col items-center", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "font-bold text-indigo-600 dark:text-indigo-400 text-lg", children: "KubeSight" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-normal text-gray-500 dark:text-gray-400 mt-1", children: "This product" }, void 0, false)] }, void 0, true
                    ) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("th", { className: "pb-4 px-6 text-center font-semibold text-gray-600 dark:text-gray-300", children: "Lens" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "pb-4 px-6 text-center font-semibold text-gray-600 dark:text-gray-300", children: "k9s" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "pb-4 pl-6 text-center font-semibold text-gray-600 dark:text-gray-300", children: "K8s Dashboard" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children:
                features.map((feature, idx) => /*#__PURE__*/
                _jsxDEV("tr", { className: idx % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/50', children: [/*#__PURE__*/
                  _jsxDEV("td", { className: "py-4 pr-6 text-sm font-medium text-gray-900 dark:text-white", children: feature.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-4 px-6 text-center bg-indigo-50/50 dark:bg-indigo-900/20", children:
                    renderCell(feature.kubeSight, true) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-4 px-6 text-center", children:
                    renderCell(feature.lens) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-4 px-6 text-center", children:
                    renderCell(feature.k9s) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-4 pl-6 text-center", children:
                    renderCell(feature.k8sDashboard) }, void 0, false
                  )] }, feature.name, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "mt-8 flex items-center justify-center gap-x-6 text-sm text-gray-600 dark:text-gray-300", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-x-2", children: [/*#__PURE__*/
              _jsxDEV(Check, { className: "h-4 w-4 text-green-600 dark:text-green-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "Available" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-x-2", children: [/*#__PURE__*/
              _jsxDEV(X, { className: "h-4 w-4 text-gray-400 dark:text-gray-600" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "Not available" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-x-2", children: [/*#__PURE__*/
              _jsxDEV(AlertCircle, { className: "h-4 w-4 text-orange-600 dark:text-orange-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-orange-600 dark:text-orange-400", children: "Limited/Paid" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}