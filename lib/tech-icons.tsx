import * as React from "react";
import {
  siReact, siDjango, siPostgresql, siRedis, siFlutter, siKotlin, siNextdotjs,
  siTypescript, siPython, siStripe, siDocker, siNginx, siLinux, siMysql,
  siFirebase, siTauri, siRust, siDotnet, siPytorch, siCelery, siGooglechrome,
  siAndroid, siJavascript, siTailwindcss, siSqlite, siGooglemaps, siFlask,
  siJsonwebtokens, siOllama, siFfmpeg, siHtml5, siSharp, siJetpackcompose,
  siVercel, siRender, siBootstrap, siOnnx, siHive, siReactrouter, siRedux,
  siApple, siIos, siGradle, siBrave, siFirefox, siFastapi,
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
