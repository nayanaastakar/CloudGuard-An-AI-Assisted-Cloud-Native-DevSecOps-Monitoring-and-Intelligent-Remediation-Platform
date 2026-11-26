
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { APP_NAME } from "@/lib/constants";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: `${APP_NAME} - AI-Powered Kubernetes Management`,
    template: `%s | ${APP_NAME}`
  },
  description:
  "AI-powered Kubernetes management platform with built-in security scanning, multi-cluster support, and intelligent insights. Free & Open Source.",
  keywords: [
  "Kubernetes",
  "K8s",
  "Dashboard",
  "AI",
  "DevOps",
  "Monitoring",
  "Security",
  "Trivy",
  "Helm",
  "Multi-cluster",
  "Open Source"],

  authors: [{ name: "KubeSight Team" }],
  creator: "KubeSight",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kubesight.dev",
    title: `${APP_NAME} - AI-Powered Kubernetes Management`,
    description:
    "AI-powered Kubernetes management platform with built-in security scanning and intelligent insights.",
    siteName: APP_NAME
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - AI-Powered Kubernetes Management`,
    description:
    "AI-powered Kubernetes management platform with built-in security scanning and intelligent insights.",
    creator: "@kubesight"
  },
  icons: {
    icon: [
    { url: '/icon.svg', type: 'image/svg+xml' }],

    apple: '/apple-icon.svg'
  }
};

export default function RootLayout({
  children


}) {
  return (/*#__PURE__*/
    _jsxDEV("html", { lang: "en", suppressHydrationWarning: true, children: /*#__PURE__*/
      _jsxDEV("body", { className: inter.className, children: /*#__PURE__*/
        _jsxDEV(ThemeProvider, { children: [/*#__PURE__*/
          _jsxDEV(Nav, {}, void 0, false), /*#__PURE__*/
          _jsxDEV("main", { children: children }, void 0, false), /*#__PURE__*/
          _jsxDEV(Footer, {}, void 0, false)] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}