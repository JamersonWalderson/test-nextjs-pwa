import Image from "next/image";
import InstallButton from "./components/InstallButton";
import NotificationButton from "./components/NotificationButton";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Progressive Web App
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Instale este app e ative as notificações para a melhor experiência.
          </p>
          
          {/* Seção de Notificações */}
          <div className="w-full max-w-md space-y-2">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
              Notificações Push
            </h2>
            <NotificationButton />
          </div>

          {/* Seção de Instalação */}
          <div className="w-full max-w-md space-y-2 pt-4">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
              Instalação PWA
            </h2>
            <InstallButton />
          </div>
        </div>
        <strong>Teste PWA v.1.0.10</strong>
      </main>
    </div>
  );
}
