/**
 * Figma Raw Code for Tag component
 * Generated from Figma using MCP get_design_context
 * Node ID: 56:8830
 *
 * This file preserves the original Figma-generated code structure.
 * DO NOT modify this file manually - it should only be updated via Figma MCP.
 */

const img =
  "http://localhost:3845/assets/9db6e888ea2ba937a92587b4d2255234922a17c7.svg";
const img1 =
  "http://localhost:3845/assets/583b8850656794038e2f6d09a899855f1284181d.svg";
const img2 =
  "http://localhost:3845/assets/e948c761caa363127dbf081d49f02f77a8c1fa95.svg";
const img3 =
  "http://localhost:3845/assets/db51dc634e7e644531bca76368ef6c1cadca372c.svg";
const img4 =
  "http://localhost:3845/assets/6f8a65082b52a2f22832640ff2947a5ff5b702fe.svg";
const img5 =
  "http://localhost:3845/assets/29fc62b749efe1811da01f12525349bc38ddd0f4.svg";
const img6 =
  "http://localhost:3845/assets/bd91860bdfe733d118ae47f00f077bf31299980a.svg";
const img7 =
  "http://localhost:3845/assets/df0f9a587430e45fd37d905dff8d77677151844b.svg";
const img8 =
  "http://localhost:3845/assets/38a0667429f3d180d2b76c9a935b681b0efca69b.svg";
const img9 =
  "http://localhost:3845/assets/7042bdc4186f626723e7be7f42c05a550b7f40b5.svg";

type TagProps = {
  removable?: boolean;
  label?: string;
  scheme?: "Brand" | "Neutral" | "Positive" | "Danger" | "Warning";
  state?: "Default" | "Hover";
  variant?: "Primary" | "Secondary";
};

export default function Tag({
  removable = true,
  label = "Tag",
  scheme = "Brand",
  state = "Default",
  variant = "Primary",
}: TagProps) {
  if (scheme === "Brand" && state === "Hover" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-brand-hover,#1e1e1e)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Brand, State=Hover, Variant=Primary"
        data-node-id="56:8881"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8834"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3052:82"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3052:82;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  {
                    "--stroke-0": "rgba(245, 245, 245, 1)",
                  } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Brand" && state === "Default" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-brand-tertiary,#f5f5f5)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Brand, State=Default, Variant=Secondary"
        data-node-id="56:9873"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand-tertiary,#2c2c2c)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:9874"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32295"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32295;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(44, 44, 44, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img1} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Brand" && state === "Hover" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-brand-tertiary-hover,#e6e6e6)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Brand, State=Hover, Variant=Secondary"
        data-node-id="56:9876"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand-tertiary,#2c2c2c)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:9874"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32295"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32295;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(44, 44, 44, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img1} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Danger" && state === "Default" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-danger-default,#ec221f)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Danger, State=Default, Variant=Primary"
        data-node-id="56:8835"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-danger-on-danger,#fee9e7)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8836"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32297"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32297;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  {
                    "--stroke-0": "rgba(254, 233, 231, 1)",
                  } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img2} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Danger" && state === "Hover" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-danger-hover,#c00f0c)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Danger, State=Hover, Variant=Primary"
        data-node-id="56:8884"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-danger-on-danger,#fee9e7)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8836"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32297"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32297;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  {
                    "--stroke-0": "rgba(254, 233, 231, 1)",
                  } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img2} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Danger" && state === "Default" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-danger-secondary,#fdd3d0)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Danger, State=Default, Variant=Secondary"
        data-node-id="56:9879"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-danger-on-danger-secondary,#900b09)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:9880"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3058:75"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3058:75;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(144, 11, 9, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img3} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Danger" && state === "Hover" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-danger-secondary-hover,#fcb3ad)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Danger, State=Hover, Variant=Secondary"
        data-node-id="56:9882"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-danger-on-danger-secondary,#900b09)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:9880"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3058:75"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3058:75;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(144, 11, 9, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img3} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Positive" && state === "Default" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-positive-default,#14ae5c)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Positive, State=Default, Variant=Primary"
        data-node-id="56:8837"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-positive-on-positive,#ebffee)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8838"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3053:22465"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3053:22465;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  {
                    "--stroke-0": "rgba(235, 255, 238, 1)",
                  } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img4} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Positive" && state === "Hover" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-positive-hover,#009951)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Positive, State=Hover, Variant=Primary"
        data-node-id="56:8887"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-positive-on-positive,#ebffee)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8838"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3053:22465"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3053:22465;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  {
                    "--stroke-0": "rgba(235, 255, 238, 1)",
                  } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img4} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Positive" && state === "Default" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-positive-secondary,#cff7d3)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Positive, State=Default, Variant=Secondary"
        data-node-id="56:9885"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-positive-on-positive-secondary,#02542d)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:9886"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32303"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32303;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(2, 84, 45, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img5} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Positive" && state === "Hover" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-positive-secondary-hover,#aff4c6)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Positive, State=Hover, Variant=Secondary"
        data-node-id="56:9888"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-positive-on-positive-secondary,#02542d)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:9886"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32303"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32303;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(2, 84, 45, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img5} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Warning" && state === "Default" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-warning-default,#e8b931)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Warning, State=Default, Variant=Primary"
        data-node-id="56:8839"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-warning-on-warning,#401b01)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8840"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3054:75"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3054:75;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(82, 37, 4, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img6} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Warning" && state === "Hover" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-warning-hover,#e5a000)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Warning, State=Hover, Variant=Primary"
        data-node-id="56:8890"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-warning-on-warning,#401b01)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8840"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3054:75"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3054:75;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(82, 37, 4, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img6} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Warning" && state === "Default" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-warning-default,#e8b931)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Warning, State=Default, Variant=Secondary"
        data-node-id="56:9891"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-warning-on-warning,#401b01)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8840"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32307"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32307;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(64, 27, 1, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img7} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Warning" && state === "Hover" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-warning-secondary-hover,#ffe8a3)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Warning, State=Hover, Variant=Secondary"
        data-node-id="56:9894"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-warning-on-warning-secondary,#682d03)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:9895"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="3061:79"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I3061:79;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(104, 45, 3, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img8} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Neutral" && state === "Default" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-default-tertiary,#d9d9d9)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Neutral, State=Default, Variant=Primary"
        data-node-id="56:8831"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8832"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32309"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32309;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img9} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Neutral" && state === "Hover" && variant === "Primary") {
    return (
      <div
        className="bg-[var(--sds-color-background-default-tertiary-hover,#b3b3b3)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Neutral, State=Hover, Variant=Primary"
        data-node-id="56:8878"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8832"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32309"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32309;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img9} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Neutral" && state === "Default" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-default-secondary,#f5f5f5)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Neutral, State=Default, Variant=Secondary"
        data-node-id="56:9867"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8832"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32309"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32309;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img9} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scheme === "Neutral" && state === "Hover" && variant === "Secondary") {
    return (
      <div
        className="bg-[var(--sds-color-background-default-secondary-hover,#e6e6e6)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
        data-name="Scheme=Neutral, State=Hover, Variant=Secondary"
        data-node-id="56:9870"
      >
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
          data-node-id="56:8832"
        >
          {label}
        </p>
        {removable && (
          <div
            className="overflow-clip relative shrink-0 size-[16px]"
            data-name="X"
            data-node-id="315:32309"
          >
            <div
              className="absolute inset-1/4"
              data-name="Icon"
              data-node-id="I315:32309;68:16114"
            >
              <div
                className="absolute inset-[-10%]"
                style={
                  { "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties
                }
              >
                <img alt="" className="block max-w-none size-full" src={img9} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Brand, Default, Primary
  return (
    <div
      className="bg-[var(--sds-color-background-brand-default,#2c2c2c)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] rounded-[var(--sds-size-radius-200,8px)]"
      data-name="Scheme=Brand, State=Default, Variant=Primary"
      data-node-id="56:8833"
    >
      <p
        className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
        data-node-id="56:8834"
      >
        {label}
      </p>
      {removable && (
        <div
          className="overflow-clip relative shrink-0 size-[16px]"
          data-name="X"
          data-node-id="3052:82"
        >
          <div
            className="absolute inset-1/4"
            data-name="Icon"
            data-node-id="I3052:82;68:16114"
          >
            <div
              className="absolute inset-[-10%]"
              style={
                {
                  "--stroke-0": "rgba(245, 245, 245, 1)",
                } as React.CSSProperties
              }
            >
              <img alt="" className="block max-w-none size-full" src={img} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
