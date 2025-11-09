"use client";

import DialogBody from "@/features/shared/figma_generated/DialogBody";
import { useState } from "react";

export default function DialogDemoPage() {
  const [cardOpen, setCardOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Dialog Body Component</h1>
          <p className="text-foreground-secondary">Figmaから取り込んだDialogコンポーネント</p>
        </div>

        {/* Card Type */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Type: Card (Modal Style)</h2>
            <button
              onClick={() => setCardOpen(!cardOpen)}
              className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
            >
              {cardOpen ? "Hide" : "Show"}
            </button>
          </div>
          {cardOpen && (
            <div className="flex justify-center items-center min-h-[300px] bg-background-secondary rounded-lg p-8">
              <DialogBody
                type="Card"
                heading="Confirm Action"
                body="Are you sure you want to proceed with this action? This cannot be undone."
                primaryButtonText="Confirm"
                secondaryButtonText="Cancel"
                onPrimaryClick={() => alert("Primary clicked!")}
                onSecondaryClick={() => alert("Secondary clicked!")}
                onClose={() => setCardOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Sheet Type */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Type: Sheet (Bottom Sheet Style)</h2>
            <button
              onClick={() => setSheetOpen(!sheetOpen)}
              className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
            >
              {sheetOpen ? "Hide" : "Show"}
            </button>
          </div>
          {sheetOpen && (
            <div className="flex justify-center items-end min-h-[400px] bg-background-secondary rounded-lg">
              <DialogBody
                type="Sheet"
                heading="Update Available"
                body="A new version is available. Would you like to update now or later?"
                primaryButtonText="Update Now"
                secondaryButtonText="Later"
                onPrimaryClick={() => alert("Update clicked!")}
                onSecondaryClick={() => alert("Later clicked!")}
                onClose={() => setSheetOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Non-dismissible */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Non-dismissible Dialog</h2>
          <div className="flex justify-center items-center min-h-[300px] bg-background-secondary rounded-lg p-8">
            <DialogBody
              type="Card"
              heading="Required Action"
              body="Please complete this required action before continuing."
              primaryButtonText="Continue"
              secondaryButtonText="Go Back"
              dismissible={false}
              onPrimaryClick={() => alert("Continue clicked!")}
              onSecondaryClick={() => alert("Go Back clicked!")}
            />
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Interactive Demo</h2>
          <div className="flex justify-center items-center min-h-[300px] bg-background-secondary rounded-lg p-8">
            <DialogBody
              type="Card"
              heading="Delete Account?"
              body="This will permanently delete your account and all associated data. This action cannot be reversed."
              primaryButtonText="Delete"
              secondaryButtonText="Keep Account"
              onPrimaryClick={() => {
                if (confirm("Are you absolutely sure?")) {
                  alert("Account deleted");
                }
              }}
              onSecondaryClick={() => alert("Account kept safe!")}
              onClose={() => alert("Dialog closed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
