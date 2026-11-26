import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  CommandLineIcon,
  LockClosedIcon } from
'@heroicons/react/24/outline';

// Import shared animation variants

// OAuth provider icons
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";const GoogleIcon = () => /*#__PURE__*/
_jsxDEV("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [/*#__PURE__*/
  _jsxDEV("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" }, void 0, false)] }, void 0, true
);


const GitHubIcon = () => /*#__PURE__*/
_jsxDEV("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
  _jsxDEV("path", { fillRule: "evenodd", d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", clipRule: "evenodd" }, void 0, false) }, void 0, false
);


const GitLabIcon = () => /*#__PURE__*/
_jsxDEV("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [/*#__PURE__*/
  _jsxDEV("path", { fill: "#E24329", d: "M12 21.35l3.19-9.81H8.81z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#FC6D26", d: "M12 21.35l-3.19-9.81H2.29z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#FCA326", d: "M2.29 11.54l-.95 2.93c-.09.27 0 .57.23.73L12 21.35z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#E24329", d: "M2.29 11.54h6.52L5.95 2.67c-.1-.3-.52-.3-.62 0z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#FC6D26", d: "M12 21.35l3.19-9.81h6.52z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#FCA326", d: "M21.71 11.54l.95 2.93c.09.27 0 .57-.23.73L12 21.35z" }, void 0, false), /*#__PURE__*/
  _jsxDEV("path", { fill: "#E24329", d: "M21.71 11.54h-6.52l2.86-8.87c.1-.3.52-.3.62 0z" }, void 0, false)] }, void 0, true
);







// Typewriter effect component
function TypewriterText({ texts, className = '' }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(text.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts]);

  return (/*#__PURE__*/
    _jsxDEV("span", { className: className, children: [
      currentText, /*#__PURE__*/
      _jsxDEV(motion.span, {
        animate: { opacity: [1, 0] },
        transition: { duration: 0.5, repeat: Infinity },
        className: "inline-block w-0.5 h-8 bg-cyan-400 ml-1 align-middle" }, void 0, false
      )] }, void 0, true
    ));

}

// Floating particle component
function FloatingParticle({ delay = 0 }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      className: "absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60",
      initial: {
        x: Math.random() * 100 + '%',
        y: '100%',
        opacity: 0
      },
      animate: {
        y: '-100%',
        opacity: [0, 0.6, 0.6, 0]
      },
      transition: {
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
        ease: 'linear'
      } }, void 0, false
    ));

}

// Neural network node
function NeuralNode({ x, y, delay = 0 }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      className: "absolute w-2 h-2 bg-cyan-500 rounded-full",
      style: { left: x, top: y },
      animate: {
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.8, 0.3],
        boxShadow: [
        '0 0 10px rgba(6, 182, 212, 0.3)',
        '0 0 25px rgba(6, 182, 212, 0.6)',
        '0 0 10px rgba(6, 182, 212, 0.3)']

      },
      transition: {
        duration: 2,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut'
      } }, void 0, false
    ));

}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [oauthProviders, setOAuthProviders] = useState([]);
  const [oauthLoading, setOAuthLoading] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Load remembered username and fetch OAuth providers
  useEffect(() => {
    const remembered = localStorage.getItem('CloudGuard_remember_user') || localStorage.getItem('CloudGuard_remember_user');
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }

    // Fetch OAuth providers
    api.get('/auth/oauth/providers').
    then((res) => {
      if (res.data.enabled && res.data.providers) {
        setOAuthProviders(res.data.providers);
      }
    }).
    catch(() => {

      // OAuth not available, that's fine
    });}, []);

  const handleOAuthLogin = async (provider) => {
    setOAuthLoading(provider);
    setError(null);

    try {
      const res = await api.get(`/auth/oauth/${provider}/authorize`);
      if (res.data.authorization_url) {
        // Redirect to OAuth provider
        window.location.href = res.data.authorization_url;
      }
    } catch (err) {
      setError(`Failed to initiate ${provider} login`);
      setOAuthLoading(null);
    }
  };

  const getOAuthIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case 'google':return /*#__PURE__*/_jsxDEV(GoogleIcon, {}, void 0, false);
      case 'github':return /*#__PURE__*/_jsxDEV(GitHubIcon, {}, void 0, false);
      case 'gitlab':return /*#__PURE__*/_jsxDEV(GitLabIcon, {}, void 0, false);
      default:return null;
    }
  };

  const getOAuthButtonStyle = (provider) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300';
      case 'github':
        return 'bg-slate-800 hover:bg-slate-700 text-white';
      case 'gitlab':
        return 'bg-[#FC6D26] hover:bg-[#E24329] text-white';
      default:
        return 'bg-slate-700 hover:bg-slate-600 text-white';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      if (rememberMe) {
        localStorage.setItem('CloudGuard_remember_user', username);
      } else {
        localStorage.removeItem('CloudGuard_remember_user');
        localStorage.removeItem('CloudGuard_remember_user');
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const typewriterTexts = [
  'Security Posture In Real Time',
  'Vulnerabilities Before Exploits',
  'Attack Paths Across Workloads',
  'Incidents With AI Root-Cause',
  'Remediations With Confidence'];


  const features = [
  { icon: ShieldCheckIcon, title: 'Security Posture', gradient: 'from-cyan-500 to-blue-500' },
  { icon: CpuChipIcon, title: 'AI Investigation', gradient: 'from-purple-500 to-pink-500' },
  { icon: CommandLineIcon, title: 'Attack Path Analysis', gradient: 'from-red-500 to-amber-500' },
  { icon: LockClosedIcon, title: 'Remediation Planner', gradient: 'from-emerald-500 to-teal-500' }];


  return (/*#__PURE__*/
    _jsxDEV("div", { className: "min-h-screen flex bg-slate-950 overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "hidden lg:flex lg:w-[55%] relative", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" }, void 0, false), /*#__PURE__*/


        _jsxDEV(motion.div, {
          className: "absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-[100px]",
          animate: {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          },
          transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(motion.div, {
          className: "absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full filter blur-[100px]",
          animate: {
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          },
          transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' } }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(motion.div, {
          className: "absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/15 rounded-full filter blur-[80px]",
          animate: {
            x: ['-50%', '-40%', '-50%'],
            y: ['-50%', '-60%', '-50%']
          },
          transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' } }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "absolute inset-0 overflow-hidden", children:
          [...Array(20)].map((_, i) => /*#__PURE__*/
          _jsxDEV(FloatingParticle, { delay: i * 0.5 }, i, false)
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "absolute inset-0", children: [/*#__PURE__*/
          _jsxDEV(NeuralNode, { x: "20%", y: "30%", delay: 0 }, void 0, false), /*#__PURE__*/
          _jsxDEV(NeuralNode, { x: "70%", y: "20%", delay: 0.5 }, void 0, false), /*#__PURE__*/
          _jsxDEV(NeuralNode, { x: "40%", y: "60%", delay: 1 }, void 0, false), /*#__PURE__*/
          _jsxDEV(NeuralNode, { x: "80%", y: "50%", delay: 1.5 }, void 0, false), /*#__PURE__*/
          _jsxDEV(NeuralNode, { x: "30%", y: "80%", delay: 2 }, void 0, false), /*#__PURE__*/
          _jsxDEV(NeuralNode, { x: "60%", y: "75%", delay: 2.5 }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "absolute inset-0 opacity-[0.03]", children: /*#__PURE__*/
          _jsxDEV("svg", { className: "w-full h-full", xmlns: "http://www.w3.org/2000/svg", children: [/*#__PURE__*/
            _jsxDEV("defs", { children: /*#__PURE__*/
              _jsxDEV("pattern", { id: "grid", width: "50", height: "50", patternUnits: "userSpaceOnUse", children: /*#__PURE__*/
                _jsxDEV("path", { d: "M 50 0 L 0 0 0 50", fill: "none", stroke: "white", strokeWidth: "0.5" }, void 0, false) }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("rect", { width: "100%", height: "100%", fill: "url(#grid)" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full", children: [/*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            className: "mb-8", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center space-x-4", children: [/*#__PURE__*/
              _jsxDEV(motion.div, {
                className: "relative",
                whileHover: { scale: 1.05 }, children: [/*#__PURE__*/

                _jsxDEV("div", { className: "absolute inset-0 bg-cyan-500 rounded-2xl blur-xl opacity-50" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "relative w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl", children: /*#__PURE__*/
                  _jsxDEV(SparklesIcon, { className: "w-8 h-8 text-white" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h1", { className: "text-3xl font-bold text-white tracking-tight", children: ["Cloud", /*#__PURE__*/
                  _jsxDEV("span", { className: "text-cyan-400", children: "Guard" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-slate-400 text-sm font-medium", children: "AI-Assisted DevSecOps Monitoring & Remediation" }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.2 },
            className: "mb-10", children: [/*#__PURE__*/

            _jsxDEV("h2", { className: "text-4xl xl:text-5xl font-bold leading-tight mb-6", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-white", children: "Secure Your" }, void 0, false), /*#__PURE__*/
              _jsxDEV("br", {}, void 0, false), /*#__PURE__*/
              _jsxDEV(TypewriterText, {
                texts: typewriterTexts,
                className: "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-slate-400 text-base max-w-lg leading-relaxed mb-4", children: "Secure, Analyse and Optimise Your Cloud-Native Infrastructure. Powered by AI to identify vulnerabilities, map attack paths, and automate intelligent remediation." }, void 0, false


            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex flex-wrap gap-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20", children: "DevSecOps Native" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("span", { className: "px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20", children: "CIS & PSS Benchmarks" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("span", { className: "px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: "AI Remediation" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.4 },
            className: "flex flex-wrap gap-2", children:

            features.map((feature, index) => /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.5 + index * 0.05 },
              whileHover: { scale: 1.05 },
              className: "bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 cursor-pointer transition-all flex items-center gap-2", children: [/*#__PURE__*/

              _jsxDEV("div", { className: `w-6 h-6 rounded bg-gradient-to-br ${feature.gradient} flex items-center justify-center`, children: /*#__PURE__*/
                _jsxDEV(feature.icon, { className: "w-3.5 h-3.5 text-white" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-white text-xs font-medium", children: feature.title }, void 0, false)] }, index, true
            )
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.8, delay: 1 },
            className: "mt-10", children: /*#__PURE__*/

            _jsxDEV("span", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "w-2 h-2 rounded-full bg-cyan-400 animate-pulse" }, void 0, false), "v2.0.0 — Security First"] }, void 0, true

            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8 relative", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" }, void 0, false), /*#__PURE__*/


        _jsxDEV("div", { className: "absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px]" }, void 0, false), /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.8 },
          className: "w-full max-w-md space-y-8 relative z-10", children: [/*#__PURE__*/


          _jsxDEV("div", { className: "lg:hidden text-center mb-8", children: /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className: "inline-flex items-center space-x-3", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30", children: /*#__PURE__*/
                _jsxDEV(SparklesIcon, { className: "w-7 h-7 text-white" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-left", children: [/*#__PURE__*/
                _jsxDEV("h1", { className: "text-2xl font-bold text-white", children: ["Cloud", /*#__PURE__*/
                  _jsxDEV("span", { className: "text-cyan-400", children: "Guard" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-slate-400", children: "AI-Assisted DevSecOps Monitoring & Remediation" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "text-center lg:text-left", children: [/*#__PURE__*/
            _jsxDEV(motion.h2, {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              className: "text-3xl font-bold text-white", children:
              "Welcome back" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.p, {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3 },
              className: "mt-2 text-slate-400", children:
              "Sign in to access your AI-powered dashboard" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(motion.form, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.4 },
            className: "space-y-6",
            onSubmit: handleSubmit, children: [/*#__PURE__*/


            _jsxDEV(AnimatePresence, { children:
              error && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, y: -10, scale: 0.95 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: -10, scale: 0.95 },
                className: "rounded-xl bg-red-500/10 border border-red-500/30 p-4", children: /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                  _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-red-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "ml-3 text-sm font-medium text-red-300", children:
                    error }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false

            ), /*#__PURE__*/


            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Username" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV(motion.div, {
                animate: {
                  boxShadow: focusedField === 'username' ?
                  '0 0 0 2px rgba(6, 182, 212, 0.3)' :
                  '0 0 0 0px rgba(6, 182, 212, 0)'
                },
                className: "relative rounded-xl", children: /*#__PURE__*/

                _jsxDEV("input", {
                  type: "text",
                  value: username,
                  onChange: (e) => setUsername(e.target.value),
                  onFocus: () => setFocusedField('username'),
                  onBlur: () => setFocusedField(null),
                  required: true,
                  className: "block w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-all duration-300",
                  placeholder: "Enter your username" }, void 0, false
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Password" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV(motion.div, {
                animate: {
                  boxShadow: focusedField === 'password' ?
                  '0 0 0 2px rgba(6, 182, 212, 0.3)' :
                  '0 0 0 0px rgba(6, 182, 212, 0)'
                },
                className: "relative rounded-xl", children: [/*#__PURE__*/

                _jsxDEV("input", {
                  type: showPassword ? 'text' : 'password',
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  onFocus: () => setFocusedField('password'),
                  onBlur: () => setFocusedField(null),
                  required: true,
                  className: "block w-full px-4 py-3.5 pr-12 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-all duration-300",
                  placeholder: "Enter your password" }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-cyan-400 transition-colors", children:

                  showPassword ? /*#__PURE__*/
                  _jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between", children: /*#__PURE__*/
              _jsxDEV("label", { className: "flex items-center cursor-pointer group", children: [/*#__PURE__*/
                _jsxDEV("input", {
                  type: "checkbox",
                  checked: rememberMe,
                  onChange: (e) => setRememberMe(e.target.checked),
                  className: "h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer" }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "ml-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors", children: "Remember me" }, void 0, false

                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV(motion.button, {
              type: "submit",
              disabled: loading,
              whileHover: { scale: 1.01 },
              whileTap: { scale: 0.99 },
              className: "w-full relative overflow-hidden py-4 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/25", children: [/*#__PURE__*/


              _jsxDEV(motion.div, {
                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
                animate: {
                  x: ['-100%', '200%']
                },
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                } }, void 0, false
              ), /*#__PURE__*/

              _jsxDEV("span", { className: "relative flex items-center justify-center", children:
                loading ? /*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV("svg", {
                    className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
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
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false
                    )] }, void 0, true
                  ), "Authenticating..."] }, void 0, true

                ) : /*#__PURE__*/

                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV(LockClosedIcon, { className: "w-5 h-5 mr-2" }, void 0, false), "Sign In"] }, void 0, true

                ) }, void 0, false

              )] }, void 0, true
            ),


            oauthProviders.length > 0 && /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.5 },
              className: "mt-6", children: [/*#__PURE__*/


              _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "absolute inset-0 flex items-center", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "w-full border-t border-slate-700" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "relative flex justify-center text-sm", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "bg-slate-900 px-4 text-slate-500", children: "or continue with" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "mt-6 grid grid-cols-3 gap-3", children:
                oauthProviders.map((provider) => /*#__PURE__*/
                _jsxDEV(motion.button, {

                  type: "button",
                  onClick: () => handleOAuthLogin(provider.key),
                  disabled: oauthLoading !== null,
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  className: `flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${getOAuthButtonStyle(provider.key)} ${oauthLoading === provider.key ? 'opacity-70' : ''}`, children:

                  oauthLoading === provider.key ? /*#__PURE__*/
                  _jsxDEV("svg", {
                    className: "animate-spin h-5 w-5",
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
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false
                    )] }, void 0, true
                  ) :

                  getOAuthIcon(provider.key) }, provider.key, false

                )
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true

          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.6 },
            className: "text-center", children: /*#__PURE__*/

            _jsxDEV("p", { className: "text-xs text-slate-500", children: ["Secured with ", /*#__PURE__*/
              _jsxDEV("span", { className: "text-slate-400", children: "enterprise-grade encryption" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}