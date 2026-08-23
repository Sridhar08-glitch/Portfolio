import * as React from "react";
import {
  siReact, siDjango, siPostgresql, siRedis, siFlutter, siKotlin, siNextdotjs,
  siTypescript, siPython, siStripe, siDocker, siNginx, siLinux, siMysql,
  siFirebase, siTauri, siRust, siDotnet, siPytorch, siCelery, siGooglechrome,
  siAndroid, siJavascript, siTailwindcss, siSqlite, siGooglemaps, siFlask,
  siJsonwebtokens, siOllama, siFfmpeg, siHtml5, siSharp, siJetpackcompose,
  siVercel, siRender, siBootstrap, siOnnx, siHive, siReactrouter, siRedux,
  siApple, siIos, siGradle, siBrave, siFirefox, siFastapi, siInstagram,
  siGithub,
  type SimpleIcon,
} from "simple-icons";

/**
 * Windows was removed from simple-icons under Microsoft's brand policy; the
 * classic four-pane path is bundled directly so platform rows can still show
 * the original mark.
 */
const WINDOWS_ICON: SimpleIcon = {
  title: "Windows",
  slug: "windows",
  hex: "0078D4",
  path: "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801",
} as SimpleIcon;

/** LinkedIn was also removed from simple-icons under brand policy. */
export const LINKEDIN_ICON: SimpleIcon = {
  title: "LinkedIn",
  slug: "linkedin",
  hex: "0A66C2",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
} as SimpleIcon;
import { Cloud, Cpu, Database, Code2, Layers, Smartphone, Globe } from "lucide-react";

/**
 * Maps technology names from content to official brand icons (simple-icons,
 * bundled SVG paths — no network). Unmatched names fall back to a category
 * glyph from lucide so every chip still gets an icon.
 */

const BRAND: [RegExp, SimpleIcon][] = [
  [/windows|wpf/i, WINDOWS_ICON],
  [/\bios\b/i, siIos],
  [/apple|macos/i, siApple],
  [/gradle/i, siGradle],
  [/brave/i, siBrave],
  [/firefox/i, siFirefox],
  [/linkedin/i, LINKEDIN_ICON],
  [/instagram/i, siInstagram],
  [/github/i, siGithub],
  [/fastapi/i, siFastapi],
  [/react native/i, siReact],
  [/react/i, siReact],
  [/django/i, siDjango],
  [/postgres/i, siPostgresql],
  [/redis/i, siRedis],
  [/flutter/i, siFlutter],
  [/kotlin/i, siKotlin],
  [/next\.?js/i, siNextdotjs],
  [/typescript/i, siTypescript],
  [/python/i, siPython],
  [/stripe/i, siStripe],
  [/docker/i, siDocker],
  [/nginx/i, siNginx],
  [/linux|vps|ubuntu/i, siLinux],
  [/mysql/i, siMysql],
  [/firebase|fcm/i, siFirebase],
  [/tauri/i, siTauri],
  [/rust/i, siRust],
  [/\.net|dotnet|wpf/i, siDotnet],
  [/c#/i, siSharp],
  [/pytorch/i, siPytorch],
  [/celery/i, siCelery],
  [/chrome|manifest v3|declarativenetrequest|extension/i, siGooglechrome],
  [/android|vpnservice/i, siAndroid],
  [/javascript/i, siJavascript],
  [/tailwind/i, siTailwindcss],
  [/sqlite/i, siSqlite],
  [/google maps/i, siGooglemaps],
  [/flask/i, siFlask],
  [/jwt|json web/i, siJsonwebtokens],
  [/ollama|llama/i, siOllama],
  [/ffmpeg/i, siFfmpeg],
  [/html/i, siHtml5],
  [/jetpack|compose/i, siJetpackcompose],
  [/vercel/i, siVercel],
  [/render/i, siRender],
  [/bootstrap/i, siBootstrap],
  [/onnx/i, siOnnx],
  [/hive/i, siHive],
  [/router/i, siReactrouter],
  [/redux|riverpod|zustand|tanstack/i, siRedux],
];

/** No official mark exists — use a category glyph in a recognisable colour. */
const FALLBACK: [RegExp, React.ElementType, string][] = [
  [/aws|s3|ses/i, Cloud, "#FF9900"],
  [/cloud/i, Cloud, "#38BDF8"],
  [/sql|db|storage|datastore/i, Database, "#38BDF8"],
  [/mobile|ios/i, Smartphone, "#4BA47B"],
  [/websocket|channels|realtime/i, Globe, "#22D3EE"],
  [/dns|doh|dot|http|rest/i, Globe, "#60A5FA"],
  [/ml|ai|ocr|vision|whisper|tesseract|fcos|model/i, Cpu, "#A78BFA"],
  [/css|ui|design/i, Layers, "#F472B6"],
];

export function findBrand(name: string): SimpleIcon | null {
  for (const [re, icon] of BRAND) if (re.test(name)) return icon;
  return null;
}

/** Is the official brand colour too dark to read on the dark canvas? */
function isDarkBrand(hex: string): boolean {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 72;
}

export function TechIcon({
  name,
  size = 14,
  className,
  colored = true,
}: {
  name: string;
  size?: number;
  className?: string;
  colored?: boolean;
}) {
  const brand = findBrand(name);
  if (brand) {
    // Dark official colours (Next.js, Flask, Rust, JWT, Apple…) keep their TRUE
    // colour on a light badge tile — the way real logos are shown on dark UIs.
    const dark = colored && isDarkBrand(brand.hex);
    return (
      <svg
        role="img"
        aria-hidden
        viewBox={dark ? "-4 -4 32 32" : "0 0 24 24"}
        width={size}
        height={size}
        className={className}
      >
        {dark && <rect x="-4" y="-4" width="32" height="32" rx="7" fill="#EFE9DC" />}
        <path d={brand.path} fill={colored ? `#${brand.hex}` : "currentColor"} />
      </svg>
    );
  }
  for (const [re, Icon, color] of FALLBACK) {
    if (re.test(name)) {
      return (
        <Icon
          size={size}
          className={className}
          style={colored ? { color } : undefined}
          aria-hidden
        />
      );
    }
  }
  return (
    <Code2
      size={size}
      className={className}
      style={colored ? { color: "#94A3B8" } : undefined}
      aria-hidden
    />
  );
}
