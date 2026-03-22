import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Teste PWA",
  description: "Aplicação Progressive Web App de teste",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Teste PWA",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Teste PWA",
    title: "Teste PWA",
    description: "Aplicação Progressive Web App de teste",
  },
  twitter: {
    card: "summary",
    title: "Teste PWA",
    description: "Aplicação Progressive Web App de teste",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                try {
                  await OneSignal.init({
                    appId: "d38fa73a-a9f8-400d-91cb-9a2bec714447",
                  });
                  console.log('OneSignal initialized successfully');
                } catch (error) {
                  console.warn('OneSignal blocked or failed to load:', error);
                  // Opcional: mostrar mensagem para usuário
                  window.onesignalBlocked = true;
                }
              });
              
              // Verificar se script foi carregado
              setTimeout(() => {
                if (!window.OneSignalDeferred) {
                  console.warn('OneSignal script blocked by ad blocker');
                  window.onesignalBlocked = true;
                }
              }, 3000);
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
