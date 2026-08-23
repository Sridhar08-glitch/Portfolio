// One-shot content migration: add honest "who / where" audience copy per project.
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../content/projects.json", import.meta.url);
const projects = JSON.parse(readFileSync(path, "utf8"));

const AUDIENCE = {
  shielddns: {
    who: "Privacy-conscious individuals, families and small teams who want ads, trackers and malware blocked on every device — without trusting a third-party resolver with their browsing history.",
    where: "Personal Android phones (no root), Windows desktops and any Chromium/Firefox browser; equally at home protecting a household or a small office network.",
  },
  "meetingmind-ai": {
    who: "Teams and organisations that record meetings but can't ship confidential audio to a cloud AI — legal, healthcare, finance, or anyone who values data sovereignty.",
    where: "On-premise or self-hosted deployments where transcripts, summaries, decisions and action items must stay inside the organisation's own infrastructure.",
  },
  commerceos: {
    who: "Businesses of any vertical — fashion, grocery, pharmacy, B2B wholesale — that need a real commerce backend without building one from scratch.",
    where: "As the headless engine behind one store or a whole portfolio of tenants: one deployment, many isolated storefronts, any frontend.",
  },
  "nexus-erp": {
    who: "Organisations that outgrow spreadsheets but can't afford a development team for every process change — operations, finance and admin teams who want to shape their own tools.",
    where: "Internal business platforms in the space of Odoo/Salesforce: custom entities, approval chains, SLAs and accounting assembled through configuration, not code.",
  },
  "construction-erp": {
    who: "Construction companies whose site and field staff work where connectivity is unreliable or absent — and who don't want to pay for an always-on server.",
    where: "On-site Windows laptops and office desktops that must stay fully productive offline and converge automatically when a connection returns.",
  },
  airsume: {
    who: "Recruiters, HR teams and job seekers who need resume screening they can actually defend — every score traceable to the exact text and rule that produced it.",
    where: "Hiring pipelines where explainability and data privacy rule out cloud LLMs: parsing, skill matching and ATS scoring entirely on owned infrastructure.",
  },
  "medical-erp": {
    who: "Hospitals and clinics that need every department — reception, doctors, lab, pharmacy, wards, billing — working from one live picture of the patient.",
    where: "Clinical operations where a lab result or a freed bed must reach the right person instantly; eight distinct roles from doctors to accountants.",
  },
  trafficvision: {
    who: "Traffic authorities, researchers and smart-city teams who need structured intelligence from raw road video — counts, congestion, lane-level behaviour.",
    where: "Research and evaluation settings today; architected for RTSP/CCTV ingestion and multi-GPU scale as the detection model matures.",
  },
  "ocr-document-intelligence": {
    who: "Businesses processing confidential documents — invoices, IDs, contracts — under privacy or data-residency rules that forbid third-party OCR APIs.",
    where: "Back-office document pipelines feeding ERPs and business systems, with low-confidence results routed to human review instead of guessed.",
  },
  "carwash-booking": {
    who: "Car-wash and vehicle-service businesses that want bookings, live tracking, memberships, loyalty and payments in one branded app.",
    where: "Customer phones (Android and iOS via one Flutter codebase) plus an operations dashboard for staff, scheduling and revenue analytics.",
  },
  "plugged-in-scents": {
    who: "A UK fragrance brand selling direct to consumers, with staff managing products, orders and customers from a custom dashboard.",
    where: "Live at pluggedinscents.co.uk — storefront, Stripe checkout and admin, running on Linux with media on AWS S3.",
  },
  "seven-stars-stationery": {
    who: "A Doha stationery and office-supplies store extending beyond its physical shop to students, professionals and businesses.",
    where: "Live at sevenstars.qa — 24/7 ordering with COD and online payment, automated invoices, and SEO-tuned server-rendered pages.",
  },
  "indiguard-security": {
    who: "A UK security-services provider — manned guarding, CCTV monitoring, keyholding — presenting services and capturing qualified inquiries.",
    where: "Live at indiguardsecurity.co.uk — dynamic service modules the client extends without code changes, plus quotation workflows.",
  },
  "nh-livespace": {
    who: "A licensed construction and interior-solutions company showcasing craftsmanship and converting visitors into project inquiries.",
    where: "Live at nhlivespace.com — services, portfolio and secure inquiry handling on a Linux deployment.",
  },
  techynova: {
    who: "A technology consultancy's own storefront — presenting web and application development services to prospective clients.",
    where: "Live at techynova.tech — service showcase, inquiry capture and SEO-friendly structure.",
  },
  "student-teacher-management": {
    who: "Schools and coaching institutes digitalising attendance, marks and communication between teachers and students.",
    where: "Android and iOS from one React Native codebase, with role-separated dashboards for teachers and students.",
  },
  "inventory-management": {
    who: "Businesses tracking products, stock movement, sellers and sales performance in one place.",
    where: "Web-based back office with live stock levels, low-stock alerts and analytics dashboards.",
  },
  "people-safety": {
    who: "Communities and local authorities coordinating on public safety — reporting incidents, tracking danger zones, reaching help fast.",
    where: "A web platform with map-based reporting, real-time chat with authorities and SOS alerts to saved contacts.",
  },
  "smart-cafeteria": {
    who: "Cafeteria operators streamlining menus, orders and nutrition awareness for their customers.",
    where: "A Flask web app covering authentication, menu management and order processing with email notifications.",
  },
};

let count = 0;
for (const p of projects) {
  if (AUDIENCE[p.id]) {
    p.audience = AUDIENCE[p.id];
    count++;
  }
}
writeFileSync(path, JSON.stringify(projects, null, 2) + "\n");
console.log(`audience added to ${count}/${projects.length} projects`);
