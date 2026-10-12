import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { GlobalFooter } from "@/components/blocks/GlobalFooter";
import { GlobalHeader } from "@/components/blocks/GlobalHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const UE_HOST = process.env.NEXT_PUBLIC_AEM_UE_HOST;
const UE_SERVICE = process.env.NEXT_PUBLIC_UE_SERVICE;

export const metadata: Metadata = {
  title: "Fabio Gois",
  description: "Site pessoal do Fabio Gois",
  // Conexão do Universal Editor com o AEM e com o UES local.
  other: {
    ...(UE_HOST && { "urn:adobe:aue:system:aemconnection": `aem:${UE_HOST}` }),
    ...(UE_SERVICE && { "urn:adobe:aue:config:service": UE_SERVICE }),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {UE_HOST && (
          <>
            <script src="https://universal-editor-service.adobe.io/cors.js" async />
            {/* Definições JSON lidas pelo Universal Editor, não são executadas pelo navegador. */}
            {/* eslint-disable @next/next/no-sync-scripts */}
            <script type="application/vnd.adobe.aue.component+json" src="/component-definition.json" />
            <script type="application/vnd.adobe.aue.model+json" src="/component-models.json" />
            <script type="application/vnd.adobe.aue.filter+json" src="/component-filters.json" />
            {/* eslint-enable @next/next/no-sync-scripts */}
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {/* Header/footer vêm do AEM sem cache: precisam de Suspense com Cache Components. */}
        <Suspense fallback={<div className="h-16 border-b" />}>
          <GlobalHeader />
        </Suspense>
        {children}
        <Suspense>
          <GlobalFooter />
        </Suspense>
      </body>
    </html>
  );
}
