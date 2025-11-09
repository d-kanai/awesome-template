/**
 * ============================================
 * 🎨 Header (Figma Raw)
 * 📅 Generated at: 2025-11-09 18:30 JST
 * 🔗 Node ID (Desktop): 7717-3642
 * 🔗 Node ID (Mobile): 2299-23639
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=2287-22651
 * 📍 Implementation: features/shared/ui/components/Header/Header.tsx
 * ============================================
 */

const imgFigma =
  "http://localhost:3845/assets/d9dff2cab482da26555227b26a6b400d24cd3f3f.svg";
const imgMenu =
  "http://localhost:3845/assets/a30087a6e8c3af0734d17b7eb30c19cd09b07f11.svg";

type HeaderFigmaRawProps = {
  platform?: "Desktop" | "Mobile";
};

export default function HeaderFigmaRaw({
  platform = "Desktop",
}: HeaderFigmaRawProps) {
  if (platform === "Mobile") {
    return (
      <div
        className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-b-[var(--sds-size-stroke-border,1px)] border-l-0 border-r-0 border-solid border-t-0 relative size-full"
        data-name="Platform=Mobile, State=Default"
        data-node-id="2299:23639"
      >
        <div className="box-border content-center flex flex-wrap items-center justify-between p-[var(--sds-size-space-600,24px)] relative size-full">
          <div
            className="content-stretch flex gap-[24px] items-center relative shrink-0"
            data-name="Block"
            data-node-id="2299:23640"
          >
            <div
              className="h-[35px] relative shrink-0 w-[40px]"
              data-name="Figma"
              data-node-id="189:26924"
            >
              <div className="absolute bottom-[-5%] left-0 right-0 top-[-5%]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src={imgFigma}
                />
              </div>
            </div>
          </div>
          <div
            className="box-border content-stretch flex items-center justify-center overflow-clip p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-typography-scale-06,32px)] shrink-0"
            data-name="Icon Button"
            data-node-id="2322:7007"
          >
            <div
              className="overflow-clip relative shrink-0 size-[16px]"
              data-name="Size=16"
              data-node-id="I2322:7007;34:12257"
            >
              <div
                className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4"
                data-name="Icon"
                data-node-id="I2322:7007;34:12257;68:15864"
              >
                <div
                  className="absolute inset-[-8%_-5.33%]"
                  style={
                    {
                      "--stroke-0": "rgba(30, 30, 30, 1)",
                    } as React.CSSProperties
                  }
                >
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={imgMenu}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div
      className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-b-[var(--sds-size-stroke-border,1px)] border-l-0 border-r-0 border-solid border-t-0 relative size-full"
      data-name="Platform=Desktop, State=Default"
      data-node-id="7717:3642"
    >
      <div className="box-border content-center flex flex-wrap gap-[var(--sds-size-space-600,0px24px)] items-center p-[var(--sds-size-space-800,32px)] relative size-full">
        <div
          className="content-stretch flex gap-[24px] items-center relative shrink-0"
          data-name="Block"
          data-node-id="2299:23057"
        >
          <div
            className="h-[35px] relative shrink-0 w-[40px]"
            data-name="Figma"
            data-node-id="189:26921"
          >
            <div className="absolute bottom-[-5%] left-0 right-0 top-[-5%]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={imgFigma}
              />
            </div>
          </div>
        </div>
        <div
          className="basis-0 content-start flex flex-wrap gap-[var(--sds-size-space-200,8px)] grow items-start justify-end min-h-px min-w-px relative shrink-0"
          data-name="Navigation Pill List"
          data-node-id="1442:7704"
        >
          <div
            className="bg-[var(--sds-color-background-brand-tertiary,#f5f5f5)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Navigation Pill"
            data-node-id="I1442:7704;7768:19971"
          >
            <div
              className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand-secondary,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap"
              data-node-id="I1442:7704;7768:19971;7768:19965"
            >
              <p className="leading-none whitespace-pre">Products</p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Navigation Pill"
            data-node-id="I1442:7704;7768:19995"
          >
            <div
              className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap"
              data-node-id="I1442:7704;7768:19995;7768:19967"
            >
              <p className="leading-none whitespace-pre">Solutions</p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Navigation Pill"
            data-node-id="I1442:7704;7768:20019"
          >
            <div
              className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap"
              data-node-id="I1442:7704;7768:20019;7768:19967"
            >
              <p className="leading-none whitespace-pre">Community</p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Navigation Pill"
            data-node-id="I1442:7704;7768:20051"
          >
            <div
              className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap"
              data-node-id="I1442:7704;7768:20051;7768:19967"
            >
              <p className="leading-none whitespace-pre">Resources</p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Navigation Pill"
            data-node-id="I1442:7704;7768:20093"
          >
            <div
              className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap"
              data-node-id="I1442:7704;7768:20093;7768:19967"
            >
              <p className="leading-none whitespace-pre">Pricing</p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Navigation Pill"
            data-node-id="I1442:7704;7768:20145"
          >
            <div
              className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap"
              data-node-id="I1442:7704;7768:20145;7768:19967"
            >
              <p className="leading-none whitespace-pre">Contact</p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Navigation Pill"
            data-node-id="I1442:7704;3529:451"
          >
            <div
              className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap"
              data-node-id="I1442:7704;3529:451;7768:19967"
            >
              <p className="leading-none whitespace-pre">Link</p>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex gap-[var(--sds-size-space-300,12px)] items-center relative shrink-0 w-[178px]"
          data-name="Header Auth"
          data-node-id="18:9402"
        >
          <div
            className="basis-0 bg-[var(--sds-color-background-neutral-tertiary,#e3e3e3)] border-[var(--sds-color-border-neutral-secondary,#767676)] border-[var(--sds-size-stroke-border,1px)] border-solid grow min-h-px min-w-px relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Button"
            data-node-id="I18:9402;18:9047"
          >
            <div className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center overflow-clip p-[var(--sds-size-space-200,8px)] relative rounded-[inherit] w-full">
              <p
                className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
                data-node-id="I18:9402;18:9047;34:12129"
              >
                Sign in
              </p>
            </div>
          </div>
          <div
            className="basis-0 bg-[var(--sds-color-background-brand-default,#2c2c2c)] border-[var(--sds-color-border-brand-default,#2c2c2c)] border-[var(--sds-size-stroke-border,1px)] border-solid grow min-h-px min-w-px relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
            data-name="Button"
            data-node-id="I18:9402;18:9048"
          >
            <div className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center overflow-clip p-[var(--sds-size-space-200,8px)] relative rounded-[inherit] w-full">
              <p
                className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre"
                data-node-id="I18:9402;18:9048;34:12125"
              >
                Register
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
