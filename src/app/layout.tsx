import type { Metadata } from "next";
import './assets/css/materialdesignicons.min.css'
import './assets/scss/tailwind.scss'

export const metadata: Metadata = {
  title: "Edupath - Next Js Online Courses & Education Template",
  description: "Edupath - Next Js Online Courses & Education Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth" dir="ltr">
      <body
        className={` dark:bg-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
