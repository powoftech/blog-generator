import Header from './_components/header'
import RedirectTabBar from './_components/redirect-tab-bar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div>
        <div className="relative">
          <Header />
          <main className="bg-background/80 min-h-[calc(100dvh-4rem-3.5rem)] rounded-2xl px-4 pb-8 sm:px-6 md:min-h-[calc(100dvh-5rem-4.5rem)]">
            <div className="mx-auto max-w-7xl px-2">
              <RedirectTabBar />
            </div>
            {children}
          </main>
          <footer className="py-4 text-center text-sm/6 md:py-6">
            © {new Date().getFullYear()} TractAI. All rights reserved.
          </footer>

          <div
            className="absolute inset-0 -z-10 bg-[35%_top] bg-no-repeat sm:bg-[38%_top] md:bg-[40%_top] lg:bg-[44%_top] xl:bg-top forced-colors:hidden"
            style={{ backgroundImage: "url('/bg-top.jpg')" }}
            aria-hidden={true}
          ></div>
          <div
            className="absolute inset-0 -z-10 bg-[35%_bottom] bg-no-repeat mix-blend-screen sm:bg-[38%_bottom] md:bg-[40%_bottom] lg:bg-[44%_bottom] xl:bg-bottom forced-colors:hidden"
            style={{ backgroundImage: "url('/bg-bottom.jpg')" }}
            aria-hidden={true}
          ></div>
          <div
            className="absolute inset-0 -z-10 bg-top opacity-10 forced-colors:hidden"
            style={{ backgroundImage: "url('/bg-noise.png')" }}
            aria-hidden={true}
          ></div>
        </div>
      </div>
    </div>
  )
}
