import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex min-h-screen flex-col items-center justify-center space-y-12">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                Mango Range Component
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-accent to-accent-hover mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-text-muted max-w-2xl leading-relaxed">
              Custom range slider component for the Mango tech test.
            </p>
          </div>

          <div className="w-full max-w-4xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <Link
                href="/exercise1"
                className="card group hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      Exercise 1: Continuous Range
                    </h2>
                  </div>

                  <p className="text-text-muted leading-relaxed pb-4">
                    Interactive range slider with editable min/max values
                    fetched from API. Features smooth transitions and real-time
                    value updates.
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex space-x-2 text-sm text-text-muted">
                      <span className="bg-background-secondary px-2 py-1 rounded-md">
                        API Integration
                      </span>
                      <span className="bg-background-secondary px-2 py-1 rounded-md">
                        Editable
                      </span>
                    </div>
                    <div className="text-accent font-medium group-hover:text-accent-hover transition-colors">
                      Go to exercise 1 →
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/exercise2"
                className="card group hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      Exercise 2: Discrete Range
                    </h2>
                  </div>

                  <p className="text-text-muted leading-relaxed pb-4">
                    Range slider with fixed currency values that snap to the
                    nearest point. Perfect for financial applications and
                    precise value selection.
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex space-x-2 text-sm text-text-muted">
                      <span className="bg-background-secondary px-2 py-1 rounded-md">
                        Currency
                      </span>
                      <span className="bg-background-secondary px-2 py-1 rounded-md">
                        Snap Points
                      </span>
                    </div>
                    <div className="text-accent font-medium group-hover:text-accent-hover transition-colors">
                      Go to exercise 2 →
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="text-center text-text-muted text-sm space-y-2">
            <p>Made by Jose Antonio Nuevo</p>
          </div>
        </div>
      </div>
    </main>
  );
}
