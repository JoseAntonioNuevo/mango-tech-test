import Range from "@/components/Range/Range";
import Link from "next/link";

function getRangeData() {
  return {
    min: 1,
    max: 100,
  };
}

export default function Exercise1Page() {
  const rangeData = getRangeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="container mx-auto max-w-4xl p-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-4 h-4 rounded-full bg-success"></div>
            <h1 className="text-4xl font-bold text-foreground">
              Exercise 1: Continuous Range
            </h1>
          </div>
          <p className="text-xl text-text-muted">
            Interactive range slider with editable min/max values fetched from
            API
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 pb-4">
            API Response Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background-secondary rounded-lg p-4">
              <span className="text-sm font-medium text-text-muted">Range</span>
              <p className="text-lg font-semibold text-foreground">
                {rangeData.min} to {rangeData.max}
              </p>
            </div>
            <div className="bg-background-secondary rounded-lg p-4">
              <span className="text-sm font-medium text-text-muted">
                Minimum Value
              </span>
              <p className="text-lg font-semibold text-foreground">
                {rangeData.min}
              </p>
            </div>
            <div className="bg-background-secondary rounded-lg p-4">
              <span className="text-sm font-medium text-text-muted">
                Maximum Value
              </span>
              <p className="text-lg font-semibold text-foreground">
                {rangeData.max}
              </p>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Interactive Range Slider
          </h2>
          <Range
            mode="continuous"
            min={rangeData.min}
            max={rangeData.max}
            initialMin={rangeData.min}
            initialMax={rangeData.max}
            step={1}
          />
        </div>

        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 text-accent hover:text-accent-hover transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/exercise2"
            className="flex items-center space-x-2 text-accent hover:text-accent-hover transition-colors group"
          >
            <span>Exercise 2: Discrete Range</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
