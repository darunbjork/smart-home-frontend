import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-[var(--space-8)] flex flex-col items-center">
      {/* Container Card */}
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--space-3)] p-[var(--space-6)] flex flex-col gap-[var(--space-4)] animate-slide-up">
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[var(--text-lg)] font-[var(--weight-bold)] text-[var(--text-primary)]">
              Living Room Light
            </h1>
            <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
              ID: 8823-X92
            </p>
          </div>
          <Badge value="online" />
        </div>

        <div className="h-[1px] bg-[var(--border)] w-full" />

        <div className="flex gap-[var(--space-3)]">
          <Button variant="primary" size="sm" onClick={() => console.log("On")}>
            Turn On
          </Button>
          <Button variant="secondary" size="sm">
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;