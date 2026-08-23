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

/** AWS was removed from simple-icons under brand policy; classic mark bundled. */
const AWS_ICON: SimpleIcon = {
  title: "AWS",
  slug: "aws",
  hex: "FF9900",
  path: "M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .893-.088 1.164-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z",
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
  [/aws|amazon s3|\bses\b/i, AWS_ICON],
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
