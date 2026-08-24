import type { Metadata } from "next";
import { RegionPicker } from "@/components/resume/region-picker";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Download Sridhar Mahalingam's resume, formatted for your region — Qatar, GCC, India, Singapore, UK, EU, US, Canada and Australia versions in PDF and Word.",
};

export default function ResumePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-field pointer-events-none absolute inset-0" aria-hidden />
        <div className="shell relative py-14 sm:py-16">
          <div className="max-w-2xl">
            <p className="label">Home / Resume</p>
            <h1 className="serif mt-4 text-5xl sm:text-6xl">
              Resume,{" "}
              <em
                className="bg-clip-text italic text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
                }}
              >
                formatted for your region.
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Resume conventions differ by country — photographs, personal
              details and length expectations aren&apos;t the same everywhere.
              Each version below is formatted for its market. Pick yours, or
              use the one detected for you.
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-12">
        <RegionPicker />
      </section>
    </>
  );
}
