import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerStackIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  BoltIcon,
  CloudIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  CpuChipIcon,
  CircleStackIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  PlayIcon,
  PauseIcon,
  XCircleIcon } from
'@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';
import { useCluster } from '../../contexts/ClusterContext';
import GlassCard from '../common/GlassCard';
import ActionableInsightsCard from './ActionableInsightsCard';
import useDashboardData from '../../hooks/useDashboardData';
import { logger } from '../../utils/logger';
import { chartColors } from '../../styles/design-system';

// Import shared animation variants and utilities
import { containerVariants, itemVariants, COLOR_PALETTE } from '../../utils/constants';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

const CPU_CHART_COLOR = chartColors.primary[0];
const MEMORY_CHART_COLOR = chartColors.success[0];

// Enhanced Donut Chart Component with glow effects and animations
function DonutChart({
  data,
  size = 180,
  strokeWidth = 20




}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const innerRadius = radius - strokeWidth;

  // Calculate the main percentage (running pods)
  const mainPercentage = total > 0 ? Math.round(data[0]?.value / total * 100) : 0;

  let currentOffset = 0;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative group", style: { width: size, height: size }, children: [/*#__PURE__*/

      _jsxDEV("div", {
        className: "absolute inset-4 rounded-full opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-50",
        style: { background: `conic-gradient(${data.map((d, i) => `${d.color} ${i * 33}%`).join(', ')})` } }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("svg", { width: size, height: size, className: "transform -rotate-90 relative z-10", children: [/*#__PURE__*/

        _jsxDEV("defs", { children: [/*#__PURE__*/
          _jsxDEV("filter", { id: "donutGlow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [/*#__PURE__*/
            _jsxDEV("feGaussianBlur", { stdDeviation: "3", result: "blur" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feMerge", { children: [/*#__PURE__*/
              _jsxDEV("feMergeNode", { in: "blur" }, void 0, false), /*#__PURE__*/
              _jsxDEV("feMergeNode", { in: "SourceGraphic" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("filter", { id: "innerShadow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [/*#__PURE__*/
            _jsxDEV("feComponentTransfer", { in: "SourceAlpha", children: /*#__PURE__*/
              _jsxDEV("feFuncA", { type: "table", tableValues: "1 0" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("feGaussianBlur", { stdDeviation: "3" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feOffset", { dx: "0", dy: "2", result: "offsetblur" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feFlood", { floodColor: "#000", floodOpacity: "0.15", result: "color" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feComposite", { in2: "offsetblur", operator: "in" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feComposite", { in2: "SourceAlpha", operator: "in" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feMerge", { children: [/*#__PURE__*/
              _jsxDEV("feMergeNode", { in: "SourceGraphic" }, void 0, false), /*#__PURE__*/
              _jsxDEV("feMergeNode", {}, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("circle", {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: "currentColor",
          className: "text-gray-200 dark:text-slate-700/50",
          strokeWidth: strokeWidth }, void 0, false
        ),


        data.map((item, index) => {
          const percentage = total > 0 ? item.value / total : 0;
          const segmentLength = circumference * percentage;
          const offset = currentOffset;
          currentOffset += segmentLength;
          const isHovered = hoveredIndex === index;

          return (/*#__PURE__*/
            _jsxDEV(motion.circle, {

              cx: size / 2,
              cy: size / 2,
              r: radius,
              fill: "none",
              stroke: item.color,
              strokeWidth: isHovered ? strokeWidth + 4 : strokeWidth,
              strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,
              strokeDashoffset: -offset,
              strokeLinecap: "round",
              filter: isHovered ? "url(#donutGlow)" : undefined,
              initial: { strokeDasharray: `0 ${circumference}` },
              animate: {
                strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,
                strokeWidth: isHovered ? strokeWidth + 4 : strokeWidth
              },
              transition: { duration: 0.8, delay: index * 0.15, ease: "easeOut" },
              onMouseEnter: () => setHoveredIndex(index),
              onMouseLeave: () => setHoveredIndex(null),
              className: "cursor-pointer transition-all duration-200",
              style: { filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : undefined } }, index, false
            ));

        }), /*#__PURE__*/


        _jsxDEV("circle", {
          cx: size / 2,
          cy: size / 2,
          r: innerRadius + 8,
          fill: "none",
          stroke: "currentColor",
          className: "text-gray-100 dark:text-slate-800",
          strokeWidth: "1",
          strokeDasharray: "4 4" }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "absolute inset-0 flex flex-col items-center justify-center z-20", children: /*#__PURE__*/
        _jsxDEV("div", { className: "relative", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { scale: 0.5, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.5, delay: 0.3 },
            className: "text-center", children: [/*#__PURE__*/

            _jsxDEV("span", { className: "text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent", children: [
              mainPercentage, "%"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-0.5", children: "Healthy" }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        hoveredIndex !== null && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
          className: "absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-xl z-30 whitespace-nowrap", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: data[hoveredIndex].color } }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "font-medium", children: [data[hoveredIndex].label, ":"] }, void 0, true), /*#__PURE__*/
            _jsxDEV("span", { children: [data[hoveredIndex].value, " pods"] }, void 0, true)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-slate-700 rotate-45" }, void 0, false)] }, void 0, true
        ) }, void 0, false

      )] }, void 0, true
    ));

}

// Enhanced Area Chart with smooth curves, data points, and tooltips
function AreaChart({
  cpuData,
  memoryData,
  height = 200




}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Use standard SVG dimensions that scale well
  const padding = { top: 25, right: 60, bottom: 30, left: 45 };
  const chartWidth = 500;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...cpuData, ...memoryData, 100);

  // Create smooth bezier curve path
  const createSmoothPath = (data, fill = false) => {
    if (data.length < 2) return '';

    const points = data.map((value, index) => ({
      x: padding.left + index / (data.length - 1) * (chartWidth - padding.left - padding.right),
      y: padding.top + chartHeight - value / maxValue * chartHeight
    }));

    // Create smooth curve using bezier
    let path = `M${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const tension = 0.3;

      const cp1x = current.x + (next.x - (points[i - 1]?.x ?? current.x)) * tension;
      const cp1y = current.y + (next.y - (points[i - 1]?.y ?? current.y)) * tension;
      const cp2x = next.x - (points[i + 2]?.x ?? next.x - current.x) * tension + current.x * tension;
      const cp2y = next.y - ((points[i + 2]?.y ?? next.y) - current.y) * tension;

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    if (fill) {
      path += ` L${points[points.length - 1].x},${padding.top + chartHeight}`;
      path += ` L${points[0].x},${padding.top + chartHeight} Z`;
    }

    return path;
  };

  // Get point coordinates
  const getPointCoords = (data, index) => ({
    x: padding.left + index / (data.length - 1) * (chartWidth - padding.left - padding.right),
    y: padding.top + chartHeight - data[index] / maxValue * chartHeight
  });

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative w-full h-full", children: [/*#__PURE__*/
      _jsxDEV("svg", {
        viewBox: `0 0 ${chartWidth} ${height}`,
        className: "w-full h-full",
        preserveAspectRatio: "xMidYMid meet",
        onMouseLeave: () => setHoveredPoint(null), children: [/*#__PURE__*/


        _jsxDEV("defs", { children: [/*#__PURE__*/

          _jsxDEV("linearGradient", { id: "cpuGradientEnhanced", x1: "0", y1: "0", x2: "0", y2: "1", children: [/*#__PURE__*/
            _jsxDEV("stop", { offset: "0%", stopColor: CPU_CHART_COLOR, stopOpacity: "0.5" }, void 0, false), /*#__PURE__*/
            _jsxDEV("stop", { offset: "50%", stopColor: CPU_CHART_COLOR, stopOpacity: "0.2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("stop", { offset: "100%", stopColor: CPU_CHART_COLOR, stopOpacity: "0.02" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("linearGradient", { id: "memoryGradientEnhanced", x1: "0", y1: "0", x2: "0", y2: "1", children: [/*#__PURE__*/
            _jsxDEV("stop", { offset: "0%", stopColor: MEMORY_CHART_COLOR, stopOpacity: "0.5" }, void 0, false), /*#__PURE__*/
            _jsxDEV("stop", { offset: "50%", stopColor: MEMORY_CHART_COLOR, stopOpacity: "0.2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("stop", { offset: "100%", stopColor: MEMORY_CHART_COLOR, stopOpacity: "0.02" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("filter", { id: "cpuGlow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [/*#__PURE__*/
            _jsxDEV("feGaussianBlur", { stdDeviation: "2", result: "blur" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feFlood", { floodColor: CPU_CHART_COLOR, floodOpacity: "0.5" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feComposite", { in2: "blur", operator: "in" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feMerge", { children: [/*#__PURE__*/
              _jsxDEV("feMergeNode", {}, void 0, false), /*#__PURE__*/
              _jsxDEV("feMergeNode", { in: "SourceGraphic" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("filter", { id: "memoryGlow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [/*#__PURE__*/
            _jsxDEV("feGaussianBlur", { stdDeviation: "2", result: "blur" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feFlood", { floodColor: MEMORY_CHART_COLOR, floodOpacity: "0.5" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feComposite", { in2: "blur", operator: "in" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feMerge", { children: [/*#__PURE__*/
              _jsxDEV("feMergeNode", {}, void 0, false), /*#__PURE__*/
              _jsxDEV("feMergeNode", { in: "SourceGraphic" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("filter", { id: "dotGlow", x: "-100%", y: "-100%", width: "300%", height: "300%", children: [/*#__PURE__*/
            _jsxDEV("feGaussianBlur", { stdDeviation: "1.5", result: "blur" }, void 0, false), /*#__PURE__*/
            _jsxDEV("feMerge", { children: [/*#__PURE__*/
              _jsxDEV("feMergeNode", { in: "blur" }, void 0, false), /*#__PURE__*/
              _jsxDEV("feMergeNode", { in: "SourceGraphic" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ),


        [0, 25, 50, 75, 100].map((percent) => {
          const y = padding.top + chartHeight - percent / maxValue * chartHeight;
          return (/*#__PURE__*/
            _jsxDEV("g", { children: [/*#__PURE__*/
              _jsxDEV("text", {
                x: padding.left - 8,
                y: y + 3,
                textAnchor: "end",
                className: "fill-gray-400 dark:fill-gray-500",
                style: { fontSize: '10px', fontWeight: 500 }, children:

                percent }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("line", {
                x1: padding.left,
                y1: y,
                x2: chartWidth - padding.right,
                y2: y,
                stroke: "currentColor",
                className: "text-gray-200/80 dark:text-slate-700/30",
                strokeWidth: "0.5",
                strokeDasharray: "4 4" }, void 0, false
              )] }, percent, true
            ));

        }), /*#__PURE__*/


        _jsxDEV(motion.path, {
          d: createSmoothPath(cpuData, true),
          fill: "url(#cpuGradientEnhanced)",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8 } }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.path, {
          d: createSmoothPath(memoryData, true),
          fill: "url(#memoryGradientEnhanced)",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8, delay: 0.2 } }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.path, {
          d: createSmoothPath(cpuData),
          fill: "none",
          stroke: CPU_CHART_COLOR,
          strokeWidth: "2.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter: "url(#cpuGlow)",
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 1.2, ease: "easeInOut" } }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.path, {
          d: createSmoothPath(memoryData),
          fill: "none",
          stroke: MEMORY_CHART_COLOR,
          strokeWidth: "2.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter: "url(#memoryGlow)",
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 1.2, delay: 0.2, ease: "easeInOut" } }, void 0, false
        ),


        cpuData.map((_, index) => {
          const coords = getPointCoords(cpuData, index);
          const isHovered = hoveredPoint?.index === index && hoveredPoint?.type === 'cpu';
          const isLast = index === cpuData.length - 1;

          return (/*#__PURE__*/
            _jsxDEV(motion.g, { children:
              (isLast || isHovered) && /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(motion.circle, {
                  cx: coords.x,
                  cy: coords.y,
                  r: isHovered ? 6 : 5,
                  fill: CPU_CHART_COLOR,
                  stroke: "white",
                  strokeWidth: "2",
                  filter: "url(#dotGlow)",
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { duration: 0.3, delay: index * 0.05 },
                  onMouseEnter: () => setHoveredPoint({ index, type: 'cpu' }),
                  className: "cursor-pointer" }, void 0, false
                ),
                isLast && /*#__PURE__*/
                _jsxDEV(motion.circle, {
                  cx: coords.x,
                  cy: coords.y,
                  r: "8",
                  fill: "transparent",
                  stroke: CPU_CHART_COLOR,
                  strokeWidth: "1",
                  initial: { scale: 0, opacity: 0 },
                  animate: { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] },
                  transition: { duration: 2, repeat: Infinity } }, void 0, false
                )] }, void 0, true

              ) }, `cpu-${index}`, false

            ));

        }),


        memoryData.map((_, index) => {
          const coords = getPointCoords(memoryData, index);
          const isHovered = hoveredPoint?.index === index && hoveredPoint?.type === 'memory';
          const isLast = index === memoryData.length - 1;

          return (/*#__PURE__*/
            _jsxDEV(motion.g, { children:
              (isLast || isHovered) && /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(motion.circle, {
                  cx: coords.x,
                  cy: coords.y,
                  r: isHovered ? 6 : 5,
                  fill: MEMORY_CHART_COLOR,
                  stroke: "white",
                  strokeWidth: "2",
                  filter: "url(#dotGlow)",
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { duration: 0.3, delay: index * 0.05 + 0.2 },
                  onMouseEnter: () => setHoveredPoint({ index, type: 'memory' }),
                  className: "cursor-pointer" }, void 0, false
                ),
                isLast && /*#__PURE__*/
                _jsxDEV(motion.circle, {
                  cx: coords.x,
                  cy: coords.y,
                  r: "8",
                  fill: "transparent",
                  stroke: MEMORY_CHART_COLOR,
                  strokeWidth: "1",
                  initial: { scale: 0, opacity: 0 },
                  animate: { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] },
                  transition: { duration: 2, repeat: Infinity, delay: 0.5 } }, void 0, false
                )] }, void 0, true

              ) }, `memory-${index}`, false

            ));

        }), /*#__PURE__*/


        _jsxDEV("g", { children: [/*#__PURE__*/

          _jsxDEV(motion.g, {
            initial: { opacity: 0, x: 5 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 1.2 }, children: [/*#__PURE__*/

            _jsxDEV("rect", {
              x: chartWidth - padding.right + 5,
              y: getPointCoords(cpuData, cpuData.length - 1).y - 10,
              width: "40",
              height: "20",
              rx: "4",
              fill: CPU_CHART_COLOR,
              className: "drop-shadow-md" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("text", {
              x: chartWidth - padding.right + 25,
              y: getPointCoords(cpuData, cpuData.length - 1).y + 2,
              textAnchor: "middle",
              fill: "white",
              style: { fontSize: '11px', fontWeight: 700 }, children: [

              Math.round(cpuData[cpuData.length - 1]), "%"] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(motion.g, {
            initial: { opacity: 0, x: 5 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 1.4 }, children: [/*#__PURE__*/

            _jsxDEV("rect", {
              x: chartWidth - padding.right + 5,
              y: getPointCoords(memoryData, memoryData.length - 1).y - 10,
              width: "40",
              height: "20",
              rx: "4",
              fill: MEMORY_CHART_COLOR,
              className: "drop-shadow-md" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("text", {
              x: chartWidth - padding.right + 25,
              y: getPointCoords(memoryData, memoryData.length - 1).y + 2,
              textAnchor: "middle",
              fill: "white",
              style: { fontSize: '11px', fontWeight: 700 }, children: [

              Math.round(memoryData[memoryData.length - 1]), "%"] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        hoveredPoint && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 5 },
          className: "absolute top-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl z-30 border border-gray-700/50", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("div", {
              className: "w-2 h-2 rounded-full",
              style: { backgroundColor: hoveredPoint.type === 'cpu' ? CPU_CHART_COLOR : MEMORY_CHART_COLOR } }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "font-medium capitalize", children: [hoveredPoint.type, ":"] }, void 0, true), /*#__PURE__*/
            _jsxDEV("span", { className: "font-bold", children: [
              Math.round(hoveredPoint.type === 'cpu' ? cpuData[hoveredPoint.index] : memoryData[hoveredPoint.index]), "%"] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}

// KPI Card Component - Uses shared COLOR_PALETTE
function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  index








}) {
  // Use shared COLOR_PALETTE for consistent colors
  const colors = COLOR_PALETTE[color];

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.05 }, children: /*#__PURE__*/

      _jsxDEV(GlassCard, { padding: "sm", className: `hover:shadow-lg ${colors.glow} transition-shadow`, children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-1.5 rounded-lg ${colors.bg}`, children: /*#__PURE__*/
            _jsxDEV(Icon, { className: `h-4 w-4 ${colors.icon}` }, void 0, false) }, void 0, false
          ),
          trend && /*#__PURE__*/
          _jsxDEV("span", { className: `text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
            trend.isPositive ?
            'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`, children: [

            trend.isPositive ? '+' : '', trend.value, "%"] }, void 0, true
          )] }, void 0, true

        ), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: value }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-[11px] text-gray-500 dark:text-gray-400 mt-0.5", children: title }, void 0, false),
          subtitle && /*#__PURE__*/
          _jsxDEV("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 mt-0.5", children: subtitle }, void 0, false)] }, void 0, true

        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Deployment Row Component
function DeploymentRow({
  name,
  namespace,
  status,
  replicas,
  time






}) {
  const statusConfig = {
    running: { icon: PlayIcon, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
    pending: { icon: PauseIcon, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/10' },
    failed: { icon: XCircleIcon, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-500/10' }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      className: "flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors", children: [/*#__PURE__*/

      _jsxDEV("div", { className: `p-1 rounded ${config.bg}`, children: /*#__PURE__*/
        _jsxDEV(StatusIcon, { className: `h-3.5 w-3.5 ${config.color}` }, void 0, false) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children: name }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-[11px] text-gray-500 dark:text-gray-400", children: namespace }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: replicas }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-[11px] text-gray-400 dark:text-gray-500", children: time }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}

// Event Item Component
function EventItem({
  type,
  message,
  resource,
  time





}) {
  const typeConfig = {
    normal: { color: 'border-blue-500', dot: 'bg-blue-500' },
    warning: { color: 'border-amber-500', dot: 'bg-amber-500' },
    error: { color: 'border-red-500', dot: 'bg-red-500' }
  };

  const config = typeConfig[type];

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: `relative pl-4 pb-4 border-l-2 ${config.color} last:pb-0`, children: [/*#__PURE__*/

      _jsxDEV("div", { className: `absolute -left-[5px] top-0 w-2 h-2 rounded-full ${config.dot}` }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "ml-2", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white", children: message }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 mt-0.5", children: [/*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: resource }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-400 dark:text-gray-500", children: time }, void 0, false)] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}

export default function Dashboard() {
  const toast = useToast();
  const { clusters, activeCluster, setActiveCluster } = useCluster();

  // Use cached dashboard data with cluster-aware caching
  // Passing activeCluster?.id ensures data is refetched when cluster changes
  const { data, isLoading: initialLoading, isRefetching: refreshing, hardReset, error } = useDashboardData(activeCluster?.id);

  // Log errors for debugging
  if (error) {
    logger.error('[Dashboard] Query error', error);
  }

  // Destructure data from cache
  const clusterHealth = data?.clusterHealth ?? null;
  const deployments = data?.deployments ?? [];
  const events = data?.events ?? [];
  const metrics = data?.metrics ?? null;
  const costData = data?.costData ?? null;
  const recommendations = data?.recommendations ?? [];
  const proactiveInsights = data?.proactiveInsights ?? [];
  const cpuHistory = data?.cpuHistory ?? [];
  const memoryHistory = data?.memoryHistory ?? [];

  // Pod status data for donut chart (using hex colors for SVG stroke)
  // Show sample data when no cluster health is available for better UX
  const podStatusData = useMemo(() => {
    if (!clusterHealth) {
      // Sample data to show chart structure when no data available
      return [
      { label: 'Running', value: 24, color: chartColors.success[0] },
      { label: 'Pending', value: 3, color: '#F59E0B' }, // amber-500
      { label: 'Failed', value: 1, color: '#EF4444' } // red-500
      ];
    }
    const running = clusterHealth.running_pods || 0;
    const total = clusterHealth.total_pods || 0;
    const pending = Math.floor((total - running) * 0.6);
    const failed = total - running - pending;
    return [
    { label: 'Running', value: running, color: chartColors.success[0] },
    { label: 'Pending', value: pending, color: '#F59E0B' }, // amber-500
    { label: 'Failed', value: failed, color: '#EF4444' } // red-500
    ];
  }, [clusterHealth]);

  // Transform deployments for display
  const recentDeployments = useMemo(() => {
    return deployments.slice(0, 5).map((dep) => {
      const isHealthy = dep.ready_replicas === dep.replicas;
      const isPending = dep.ready_replicas < dep.replicas && dep.ready_replicas > 0;
      let status = 'running';
      if (!isHealthy) status = isPending ? 'pending' : 'failed';
      if (dep.ready_replicas === 0 && dep.replicas > 0) status = 'failed';

      return {
        name: dep.name,
        namespace: dep.namespace,
        status,
        replicas: `${dep.ready_replicas}/${dep.replicas}`,
        time: dep.age || 'N/A'
      };
    });
  }, [deployments]);

  // Transform events for display
  const recentEvents = useMemo(() => {
    return events.slice(0, 5).map((event) => {
      let type = 'normal';
      if (event.type === 'Warning') type = 'warning';
      if (event.reason?.toLowerCase().includes('fail') || event.reason?.toLowerCase().includes('error')) {
        type = 'error';
      }

      return {
        type,
        message: event.message || event.reason || 'No message',
        resource: `${event.involved_object?.kind || 'Resource'}/${event.involved_object?.name || 'unknown'}`,
        time: event.last_timestamp || event.first_timestamp || 'N/A'
      };
    });
  }, [events]);


  // Get current metrics for chart display
  // Use sample data when no real metrics are available for better UX
  const displayCpuHistory = useMemo(() => {
    if (cpuHistory.length === 0) {
      // Generate deterministic sample data based on current metrics or defaults
      const baseCpu = metrics?.cpu_percent ?? 45;
      return [32, 35, 38, 42, 45, 48, 52, 48, 45, 50, 55, 52, 48, baseCpu, baseCpu];
    }
    if (cpuHistory.length < 15) {
      return [...Array(15 - cpuHistory.length).fill(cpuHistory[0] || 30), ...cpuHistory];
    }
    return cpuHistory;
  }, [cpuHistory, metrics?.cpu_percent]);

  const displayMemoryHistory = useMemo(() => {
    if (memoryHistory.length === 0) {
      // Generate deterministic sample data based on current metrics or defaults
      const baseMem = metrics?.memory_percent ?? 60;
      return [55, 58, 62, 65, 63, 60, 58, 62, 65, 68, 65, 62, 60, baseMem, baseMem];
    }
    if (memoryHistory.length < 15) {
      return [...Array(15 - memoryHistory.length).fill(memoryHistory[0] || 50), ...memoryHistory];
    }
    return memoryHistory;
  }, [memoryHistory, metrics?.memory_percent]);

  // Handle manual refresh - use hardReset for thorough cache clearing
  const handleRefresh = async () => {
    try {
      await hardReset();
      toast.success('Data Refreshed', 'Dashboard data has been updated');
    } catch (err) {
      logger.error('[Dashboard] Refresh failed', err);
      toast.error('Refresh Failed', 'Could not refresh dashboard data');
    }
  };

  // Calculate health score
  const healthScore = useMemo(() => {
    if (!clusterHealth) return 0;
    const nodeHealth = clusterHealth.node_count > 0 ? clusterHealth.ready_nodes / clusterHealth.node_count * 100 : 0;
    const podHealth = clusterHealth.total_pods > 0 ? clusterHealth.running_pods / clusterHealth.total_pods * 100 : 0;
    return Math.round((nodeHealth + podHealth) / 2);
  }, [clusterHealth]);

  // Show loading skeleton on initial load
  if (initialLoading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4 animate-pulse", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex justify-between items-center", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "h-12 w-48 bg-gray-200 dark:bg-slate-700 rounded-xl" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded-xl" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children:
          [...Array(6)].map((_, i) => /*#__PURE__*/
          _jsxDEV("div", { className: "h-24 bg-gray-200 dark:bg-slate-700 rounded-xl" }, i, false)
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "h-64 bg-gray-200 dark:bg-slate-700 rounded-xl" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "h-64 bg-gray-200 dark:bg-slate-700 rounded-xl" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-4", children: [/*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600", children: /*#__PURE__*/
              _jsxDEV(BoltIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "Dashboard" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Real-time cluster overview and insights" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV("select", {
                value: activeCluster?.id || '',
                onChange: (e) => {
                  const cluster = clusters.find((c) => c.id === e.target.value);
                  if (cluster) setActiveCluster(cluster.id);
                },
                className: "appearance-none pl-4 pr-10 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm font-medium text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer", children:

                clusters.map((cluster) => /*#__PURE__*/
                _jsxDEV("option", { value: cluster.id, children:
                  cluster.name }, cluster.id, false
                )
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV(CloudIcon, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl", children: [/*#__PURE__*/
              _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "Auto-refresh: 30s" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleRefresh,
              disabled: refreshing,
              className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing ? 'animate-spin' : ''}` }, void 0, false),
              refreshing ? 'Refreshing...' : 'Refresh'] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(ActionableInsightsCard, { insights: proactiveInsights, loading: initialLoading }, void 0, false) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: [/*#__PURE__*/
          _jsxDEV(KPICard, {
            title: "Cluster Health",
            value: `${healthScore}%`,
            subtitle: clusterHealth?.healthy ? 'All systems operational' : 'Issues detected',
            icon: clusterHealth?.healthy ? CheckCircleIcon : ExclamationTriangleIcon,
            color: healthScore >= 80 ? 'green' : healthScore >= 60 ? 'amber' : 'red',
            index: 0 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(KPICard, {
            title: "Nodes",
            value: clusterHealth ? `${clusterHealth.ready_nodes}/${clusterHealth.node_count}` : '-/-',
            subtitle: "Ready / Total",
            icon: ServerStackIcon,
            color: "blue",
            index: 1 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(KPICard, {
            title: "Pods",
            value: clusterHealth ? `${clusterHealth.running_pods}/${clusterHealth.total_pods}` : '-/-',
            subtitle: "Running / Total",
            icon: CubeIcon,
            color: "purple",
            index: 2 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(KPICard, {
            title: "Deployments",
            value: deployments.length || 0,
            subtitle: "Active deployments",
            icon: RocketLaunchIcon,
            color: "cyan",
            index: 3 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(KPICard, {
            title: "Est. Monthly",
            value: costData?.total_monthly_estimate ? `$${costData.total_monthly_estimate.toFixed(0)}` : '$--',
            subtitle: costData?.summary?.total_cost ? `Current: $${costData.summary.total_cost.total.toFixed(0)}` : 'Loading...',
            icon: CurrencyDollarIcon,
            color: "amber",
            index: 4 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(KPICard, {
            title: "AI Insights",
            value: recommendations.length || 0,
            subtitle: "Optimization recommendations",
            icon: SparklesIcon,
            color: "purple",
            index: 5 }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [/*#__PURE__*/

          _jsxDEV(GlassCard, { padding: "md", className: "h-[300px]", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(CpuChipIcon, { className: "h-4 w-4 text-blue-500" }, void 0, false), "Resource Utilization"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-4 text-xs", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: ["CPU ", /*#__PURE__*/_jsxDEV("span", { className: "font-semibold text-blue-600 dark:text-blue-400", children: [metrics?.cpu_percent?.toFixed(1) || 0, "%"] }, void 0, true)] }, void 0, true)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: ["Memory ", /*#__PURE__*/_jsxDEV("span", { className: "font-semibold text-purple-600 dark:text-purple-400", children: [metrics?.memory_percent?.toFixed(1) || 0, "%"] }, void 0, true)] }, void 0, true)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "h-[210px] w-full", children: /*#__PURE__*/
              _jsxDEV(AreaChart, { cpuData: displayCpuHistory, memoryData: displayMemoryHistory, height: 210 }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-between px-6 text-[11px] text-gray-400 dark:text-gray-500 mt-1", children: [/*#__PURE__*/
              _jsxDEV("span", { children: "15m ago" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "10m ago" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "5m ago" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "Now" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(GlassCard, { padding: "md", className: "h-[300px] overflow-visible", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(CircleStackIcon, { className: "h-4 w-4 text-emerald-500" }, void 0, false), "Pod Status Distribution"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV(Link, {
                to: "/kubernetes",
                className: "text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1", children: [
                "View all", /*#__PURE__*/

                _jsxDEV(ArrowRightIcon, { className: "h-3 w-3" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-center gap-10 py-6", children: [/*#__PURE__*/
              _jsxDEV(DonutChart, { data: podStatusData, size: 170, strokeWidth: 18 }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children:
                podStatusData.map((item, index) => /*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, x: 10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.3 + index * 0.1 },
                  className: "flex items-center gap-3", children: [/*#__PURE__*/

                  _jsxDEV("div", {
                    className: "w-3.5 h-3.5 rounded-full shadow-lg",
                    style: { backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}50` } }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: item.value }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: item.label }, void 0, false)] }, void 0, true
                  )] }, index, true
                )
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [/*#__PURE__*/

          _jsxDEV(GlassCard, { padding: "md", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false), "Recent Deployments"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV(Link, {
                to: "/deploy",
                className: "text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1", children: [
                "View all", /*#__PURE__*/

                _jsxDEV(ArrowRightIcon, { className: "h-3 w-3" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-1", children:
              recentDeployments.length > 0 ?
              recentDeployments.map((deployment, index) => /*#__PURE__*/
              _jsxDEV(DeploymentRow, { ...deployment }, index, false)
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "text-center py-6 text-gray-500 dark:text-gray-400 text-sm", children: "No deployments found" }, void 0, false

              ) }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(GlassCard, { padding: "md", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(ExclamationCircleIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false), "Events Timeline"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV(Link, {
                to: "/events",
                className: "text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1", children: [
                "View all", /*#__PURE__*/

                _jsxDEV(ArrowRightIcon, { className: "h-3 w-3" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-0", children:
              recentEvents.length > 0 ?
              recentEvents.map((event, index) => /*#__PURE__*/
              _jsxDEV(EventItem, { ...event }, index, false)
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "text-center py-6 text-gray-500 dark:text-gray-400 text-sm", children: "No recent events" }, void 0, false

              ) }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(motion.div, { variants: itemVariants, className: "text-center text-xs text-gray-400 dark:text-gray-500", children: ["Press ", /*#__PURE__*/
        _jsxDEV("kbd", { className: "px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-700 font-mono text-xs font-medium", children: "Cmd+K" }, void 0, false), " for quick actions"] }, void 0, true
      )] }, void 0, true
    ));

}