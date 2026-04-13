import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";

function App() {
  return (
    <div className="p-[var(--space-8)] flex flex-col gap-[var(--space-4)]">
      <div className="flex gap-[var(--space-2)]">
        <Button variant="primary">Primary Action</Button>
        <Button variant="secondary" loading>Loading State</Button>
      </div>
      <div className="flex gap-[var(--space-2)]">
        <Badge value="online" />
        <Badge value="owner" />
      </div>
    </div>
  )
}

export default App;