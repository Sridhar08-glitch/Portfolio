// One-shot: attach uploaded project screenshots to their projects.
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../content/projects.json", import.meta.url);
const projects = JSON.parse(readFileSync(path, "utf8"));

const IMAGES = {
  "meetingmind-ai": {
    src: "/images/projects/copilot.png",
    alt: "MeetingMind AI — Copilot workspace dashboard with executive brief, workspace score and knowledge tools",
    width: 2880,
    height: 1800,
  },
  "people-safety": {
    src: "/images/projects/feelsafe.png",
    alt: "People Safety & Crime Reporting — web application interface",
    width: 1890,
    height: 856,
  },
  "indiguard-security": {
    src: "/images/projects/indiguard.png",
    alt: "Indiguard Security — service platform homepage",
    width: 1895,
    height: 926,
  },
  "inventory-management": {
    src: "/images/projects/inventory.png",
    alt: "Inventory Management System — dashboard interface",
    width: 1904,
    height: 965,
  },
  "nh-livespace": {
    src: "/images/projects/nhspce.png",
    alt: "NH LiveSpace — construction & interior business website",
    width: 1881,
    height: 948,
  },
  "seven-stars-stationery": {
    src: "/images/projects/sevenstars.png",
    alt: "Seven Stars Stationery — e-commerce storefront",
    width: 1889,
    height: 926,
  },
  "smart-cafeteria": {
    src: "/images/projects/smartcafe.png",
    alt: "Smart Cafeteria Management — web application interface",
    width: 1899,
    height: 927,
  },
  techynova: {
    src: "/images/projects/techynova.png",
    alt: "Techynova — technology business website",
    width: 1902,
    height: 964,
  },
};

let count = 0;
for (const p of projects) {
  if (IMAGES[p.id]) {
    p.images = [IMAGES[p.id]];
    count++;
  }
}
writeFileSync(path, JSON.stringify(projects, null, 2) + "\n");
console.log(`images attached to ${count} projects`);
