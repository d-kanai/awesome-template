const img = "http://localhost:3845/assets/d4c3bac78b200cfb907deaea86f331a1ec54cb0a.svg";
type NavigationPillProps = {
  className?: string;
  label?: string;
  state?: "Default" | "Active" | "Hover";
};

function NavigationPill({ className, label = "Link", state = "Default" }: NavigationPillProps) {
  if (state === "Active") {
    return (
      <div className={className} data-name="State=Active" data-node-id="7768:19969">
        <div className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand-secondary,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap" data-node-id="7768:19965">
          <p className="leading-none whitespace-pre">{label}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="State=Default" data-node-id="7768:19968">
      <div className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap" data-node-id="7768:19967">
        <p className="leading-none whitespace-pre">{label}</p>
      </div>
    </div>
  );
}
type NavigationPillListProps = {
  className?: string;
  link6?: boolean;
  link2?: boolean;
  link5?: boolean;
  link4?: boolean;
  link3?: boolean;
  link1?: boolean;
  link7?: boolean;
  direction?: "Row" | "Column";
};

function NavigationPillList({ className, link6 = true, link2 = true, link5 = true, link4 = true, link3 = true, link1 = true, link7 = true, direction = "Row" }: NavigationPillListProps) {
  return (
    <div className={className} data-name="Direction=Row" data-node-id="7753:4609">
      {link1 && <NavigationPill state="Active" className="bg-[var(--sds-color-background-brand-tertiary,#f5f5f5)] box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />}
      {link2 && <NavigationPill className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />}
      {link3 && <NavigationPill className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />}
      {link4 && <NavigationPill className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />}
      {link5 && <NavigationPill className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />}
      {link6 && <NavigationPill className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />}
      {link7 && <NavigationPill className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-space-200,8px)] shrink-0" />}
    </div>
  );
}

export default function Header() {
  return (
    <div className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-b-[var(--sds-size-stroke-border,1px)] border-l-0 border-r-0 border-solid border-t-0 relative size-full" data-name="Header" data-node-id="175:4449">
      <div className="box-border content-center flex flex-wrap gap-[var(--sds-size-space-600,0px24px)] items-center p-[var(--sds-size-space-800,32px)] relative size-full">
        <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Block" data-node-id="I175:4449;2299:23057">
          <div className="h-[35px] relative shrink-0 w-[40px]" data-name="Figma" data-node-id="I175:4449;189:26921">
            <div className="absolute bottom-[-5%] left-0 right-0 top-[-5%]">
              <img alt="" className="block max-w-none size-full" src={img} />
            </div>
          </div>
        </div>
        <NavigationPillList className="basis-0 content-start flex flex-wrap gap-[var(--sds-size-space-200,8px)] grow items-start justify-end min-h-px min-w-px relative shrink-0" />
        <div className="content-stretch flex gap-[var(--sds-size-space-300,12px)] items-center relative shrink-0 w-[178px]" data-name="Header Auth" data-node-id="I175:4449;18:9402">
          <div className="basis-0 bg-[var(--sds-color-background-neutral-tertiary,#e3e3e3)] border-[var(--sds-color-border-neutral-secondary,#767676)] border-[var(--sds-size-stroke-border,1px)] border-solid grow min-h-px min-w-px relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" data-name="Button" data-node-id="I175:4449;18:9402;18:9047">
            <div className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center overflow-clip p-[var(--sds-size-space-200,8px)] relative rounded-[inherit] w-full">
              <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre" data-node-id="I175:4449;18:9402;18:9047;34:12129">
                Sign in
              </p>
            </div>
          </div>
          <div className="basis-0 bg-[var(--sds-color-background-brand-default,#2c2c2c)] border-[var(--sds-color-border-brand-default,#2c2c2c)] border-[var(--sds-size-stroke-border,1px)] border-solid grow min-h-px min-w-px relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" data-name="Button" data-node-id="I175:4449;18:9402;18:9048">
            <div className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center overflow-clip p-[var(--sds-size-space-200,8px)] relative rounded-[inherit] w-full">
              <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre" data-node-id="I175:4449;18:9402;18:9048;34:12125">
                Register
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
