import Range from "@/components/Range/Range";
import Link from "next/link";

function getRangeData() {
  return {
    rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
  };
}

export default function Exercise2Page() {
  const rangeData = getRangeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="container mx-auto max-w-4xl p-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-4 h-4 rounded-full bg-warning"></div>
            <h1 className="text-4xl font-bold text-foreground">
              Exercise 2: Discrete Range
            </h1>
          </div>
          <p className="text-xl text-text-muted">
            Range slider with fixed currency values that snap to nearest points
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 pb-4">
            Available Currency Values
          </h2>
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {rangeData.rangeValues.map((value: number, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-background border border-border text-foreground"
                >
                  {value}€
                </span>
              ))}
            </div>
            <p className="text-sm text-text-muted mt-3 pt-4">
              Total of {rangeData.rangeValues.length} fixed currency values
              ranging from {rangeData.rangeValues[0]}€ to{" "}
              {rangeData.rangeValues[rangeData.rangeValues.length - 1]}€
            </p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Interactive Currency Range Slider
          </h2>
          <Range
            mode="discrete"
            values={rangeData.rangeValues}
            initialMinIndex={0}
            initialMaxIndex={rangeData.rangeValues.length - 1}
            currency="€"
          />
        </div>

        <div className="flex justify-between items-center">
          <Link
            href="/exercise1"
            className="flex items-center space-x-2 text-accent hover:text-accent-hover transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            <span>Exercise 1: Continuous Range</span>
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-2 text-accent hover:text-accent-hover transition-colors group"
          >
            <span>Back to Home</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
