import { site } from "@/lib/content";
import { personJsonLd } from "@/lib/seo";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-mineral focus:px-4 focus:py-2 focus:on-dark"
      >
        Skip to content
      </a>
      <Nav site={site} />
      <main id="main">{children}</main>
      <Footer site={site} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
    </>
  );
}
