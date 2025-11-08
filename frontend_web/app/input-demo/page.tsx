"use client";

import { InputField } from "@/features/shared/figma_generated/InputField";

export default function InputDemoPage() {
  return (
    <div className="container mx-auto p-Space-800">
      <h1 className="text-3xl font-bold mb-Space-600">
        Input Field Component Demo
      </h1>

      <div className="space-y-Space-800">
        {/* Default State */}
        <section className="space-y-Space-400">
          <h2 className="text-2xl font-semibold">Default State</h2>

          <div className="space-y-Space-600">
            <div>
              <h3 className="text-lg font-medium mb-Space-300">
                With Label and Description
              </h3>
              <InputField
                hasLabel
                hasDescription
                label="Email Address"
                description="We'll never share your email"
                placeholder="Enter your email"
                valueType="placeholder"
                state="default"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-Space-300">Label Only</h3>
              <InputField
                hasLabel
                label="Username"
                placeholder="Enter username"
                valueType="placeholder"
                state="default"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-Space-300">No Label</h3>
              <InputField
                placeholder="Search..."
                valueType="placeholder"
                state="default"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-Space-300">
                With Default Value
              </h3>
              <InputField
                hasLabel
                label="Full Name"
                value="John Doe"
                valueType="default"
                state="default"
              />
            </div>
          </div>
        </section>

        {/* Error State */}
        <section className="space-y-Space-400">
          <h2 className="text-2xl font-semibold">Error State</h2>

          <div className="space-y-Space-600">
            <div>
              <h3 className="text-lg font-medium mb-Space-300">
                With Error Message
              </h3>
              <InputField
                hasLabel
                hasError
                label="Password"
                error="Password must be at least 8 characters"
                placeholder="Enter password"
                valueType="placeholder"
                state="error"
                type="password"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-Space-300">
                Error with Description
              </h3>
              <InputField
                hasLabel
                hasDescription
                hasError
                label="Confirmation Code"
                description="Enter the 6-digit code sent to your email"
                error="Invalid code"
                placeholder="000000"
                valueType="placeholder"
                state="error"
              />
            </div>
          </div>
        </section>

        {/* Disabled State */}
        <section className="space-y-Space-400">
          <h2 className="text-2xl font-semibold">Disabled State</h2>

          <div className="space-y-Space-600">
            <div>
              <h3 className="text-lg font-medium mb-Space-300">
                Disabled with Value
              </h3>
              <InputField
                hasLabel
                label="Account ID"
                value="ACC-12345"
                valueType="default"
                state="disabled"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-Space-300">
                Disabled with Placeholder
              </h3>
              <InputField
                hasLabel
                hasDescription
                label="Organization"
                description="This field is managed by your administrator"
                placeholder="Not available"
                valueType="placeholder"
                state="disabled"
              />
            </div>
          </div>
        </section>

        {/* Form Example */}
        <section className="space-y-Space-400">
          <h2 className="text-2xl font-semibold">Form Example</h2>

          <form
            className="space-y-Space-600"
            onSubmit={(e) => e.preventDefault()}
          >
            <InputField
              hasLabel
              label="First Name"
              placeholder="Enter first name"
              valueType="placeholder"
              state="default"
              required
            />

            <InputField
              hasLabel
              label="Last Name"
              placeholder="Enter last name"
              valueType="placeholder"
              state="default"
              required
            />

            <InputField
              hasLabel
              hasDescription
              label="Email"
              description="We'll use this for account recovery"
              placeholder="you@example.com"
              valueType="placeholder"
              state="default"
              type="email"
              required
            />

            <InputField
              hasLabel
              hasDescription
              label="Phone Number"
              description="Include country code"
              placeholder="+1 (555) 000-0000"
              valueType="placeholder"
              state="default"
              type="tel"
            />

            <div className="flex gap-Space-400 pt-Space-400">
              <button
                type="submit"
                className="px-Space-600 py-Space-300 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
              >
                Submit
              </button>
              <button
                type="reset"
                className="px-Space-600 py-Space-300 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary-hover transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
