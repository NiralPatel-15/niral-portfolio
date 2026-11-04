import "./globals.css";
import ScanOverlay from "@/components/ScanOverlay";
import ScrollToTop from "@/components/ScrollToTop";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Niral Patel | Full-Stack Developer",
  description:
    "Niral Patel is a Full-Stack Developer passionate about building modern, responsive, and scalable web applications.",
  applicationName: "Niral Patel Portfolio",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Niral Patel | Full-Stack Developer",
    description:
      "Explore the portfolio, projects, skills, and experience of Niral Patel.",
    type: "website",
    siteName: "Niral Patel Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Niral Patel | Full-Stack Developer",
    description:
      "Explore the portfolio and development projects of Niral Patel.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mesh-bg" aria-hidden="true">
          <div className="blob" />
          <div className="blob" />
          <div className="blob" />
          <div className="blob" />
          <div className="blob" />
        </div>

        <ScanOverlay />

        <div className="particles" aria-hidden="true">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>

        <ClientLayout>{children}</ClientLayout>
        <ScrollToTop />
      </body>
    </html>
  );
}
