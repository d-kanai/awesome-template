import { Button } from "@awesome/design-system";
import "@awesome/design-system/styles.css";

export default function TestDesignSystemPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Design System Test</h1>
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="neutral">Neutral</Button>
        <Button variant="subtle">Subtle</Button>
      </div>
      <div className="flex gap-4 mt-4">
        <Button variant="primary" size="small">
          Small
        </Button>
        <Button variant="primary" size="medium">
          Medium
        </Button>
        <Button variant="primary" size="large">
          Large
        </Button>
      </div>
      <div className="flex gap-4 mt-4">
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}
