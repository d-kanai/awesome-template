/**
 * Examples Home Page - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 562:8332
 * Size: 1735x3102px
 * Variants: Desktop (1200x2070px), Mobile (375x3058px)
 */

const imgShape = "http://localhost:3845/assets/11dbcb982f9ba115c7d5cc790cc48a457815fb67.png";
const imgDirectionRow1 = "http://localhost:3845/assets/0707e6b2022462187b7b2dab43ed95bab6b24a66.png";
const imgIcon = "http://localhost:3845/assets/ebe5c6a172229471bc405eee20532fadc2e19425.svg";
const imgIcon1 = "http://localhost:3845/assets/e9973bef1cd66784f002825983137d4699835cdf.svg";
const imgDirectionRow = "http://localhost:3845/assets/d4c3bac78b200cfb907deaea86f331a1ec54cb0a.svg";
const imgDirectionRow2 = "http://localhost:3845/assets/f7670ccd9f4a0daef6ffdd182abe963966b9e064.svg";
const imgDirectionRow3 = "http://localhost:3845/assets/06d5686ebc43f358ce6232b368c6aaa3e6dc3c02.svg";
const imgDirectionRow4 = "http://localhost:3845/assets/6861e555b302aeb3c106fc8f569473bc6de7b388.svg";
const imgDirectionRow5 = "http://localhost:3845/assets/7f3f966fdf4b0fd049db80f6afdf1614bcd3f100.svg";
const imgDirectionRow6 = "http://localhost:3845/assets/5ea18c437665224c3c840c1832ded6b6c216b20a.svg";

type TextLinkListItemProps = {
  className?: string;
  text?: string;
};

function TextLinkListItem({ className, text = "List item" }: TextLinkListItemProps) {
  return (
    <div className={className} data-name="Text Link List Item" data-node-id="2153:7973">
      <div className="absolute bottom-0 flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center leading-[0] left-0 not-italic right-[26.97%] text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap top-0" data-node-id="2153:7955">
        <p className="leading-[1.4] whitespace-pre">{text}</p>
      </div>
    </div>
  );
}

type TextStrongProps = {
  className?: string;
  text?: string;
};

function TextStrong({ className, text = "Text Strong" }: TextStrongProps) {
  return (
    <div className={className} data-name="Text Strong" data-node-id="2087:8486">
      <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Semi_Bold',sans-serif)] font-[var(--sds-typography-body-font-weight-strong,600)] leading-[1.4] not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre" data-node-id="2087:8468">
        {text}
      </p>
    </div>
  );
}

type TextLinkListProps = {
  className?: string;
  hasTitle?: boolean;
  density?: "Default" | "Tight";
};

function TextLinkList({ className, hasTitle = true, density = "Default" }: TextLinkListProps) {
  const element = <TextLinkListItem className="h-[22px] relative shrink-0 w-[89px]" />;
  if (density === "Tight") {
    return (
      <div className={className} data-name="Density=Tight" data-node-id="322:9322">
        {hasTitle && (
          <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-[var(--sds-size-space-100,4px)] pt-0 px-0 relative shrink-0 w-full" data-name="Title" data-node-id="322:9323">
            <TextStrong className="content-stretch flex items-start relative shrink-0 w-full" />
          </div>
        )}
        {element}
        {element}
        {element}
        {element}
        {element}
        {element}
        {element}
      </div>
    );
  }
  return (
    <div className={className} data-name="Density=Default" data-node-id="2153:7990">
      {hasTitle && (
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-[var(--sds-size-space-400,16px)] pt-0 px-0 relative shrink-0 w-full" data-name="Title" data-node-id="2162:7479">
          <TextStrong className="content-stretch flex items-start relative shrink-0 w-full" />
        </div>
      )}
      {element}
      {element}
      {element}
      {element}
      {element}
      {element}
      {element}
    </div>
  );
}

type AvatarProps = {
  className?: string;
  type?: "Initial" | "Image";
  size?: "Large" | "Small" | "Medium";
  shape?: "Circle" | "Square";
};

function Avatar({ className, type = "Image", size = "Large", shape = "Circle" }: AvatarProps) {
  return (
    <div className={className} data-name="Type=Image, Size=Large, Shape=Circle" data-node-id="9762:1113">
      <div className="absolute left-1/2 size-[40px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Shape" data-node-id="9762:1114">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgShape} />
      </div>
    </div>
  );
}

function TestimonialCard({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Testimonial Card" data-node-id="7717:3946">
      <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Text Heading" data-node-id="611:26195">
        <p className="basis-0 font-[family-name:var(--sds-typography-heading-font-family,'Inter:Semi_Bold',sans-serif)] font-[var(--sds-typography-heading-font-weight,600)] grow leading-[1.2] min-h-px min-w-px not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-heading-size-base,24px)] tracking-[-0.48px]" data-node-id="I611:26195;2087:8466">
          "Quote"
        </p>
      </div>
      <div className="content-stretch flex gap-[var(--sds-size-space-300,12px)] items-start relative shrink-0 w-[139px]" data-name="Avatar Block" data-node-id="2010:15583">
        <Avatar className="overflow-clip relative rounded-[var(--sds-size-radius-full,9999px)] shrink-0 size-[40px]" />
        <div className="basis-0 content-stretch flex flex-col gap-[var(--sds-size-space-050,2px)] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[length:var(--sds-typography-body-size-medium,16px)]" data-name="Info" data-node-id="I2010:15583;2010:15577">
          <div className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Semi_Bold',sans-serif)] font-[var(--sds-typography-body-font-weight-strong,600)] justify-center relative shrink-0 text-[color:var(--sds-color-text-default-secondary,#757575)] w-full" data-node-id="I2010:15583;2010:15578">
            <p className="leading-[1.4]">Title</p>
          </div>
          <div className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center relative shrink-0 text-[color:var(--sds-color-text-default-tertiary,#b3b3b3)] w-full" data-node-id="I2010:15583;2010:15579">
            <p className="leading-[1.4]">Description</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type TextContentHeadingProps = {
  className?: string;
  hasSubheading?: boolean;
  heading?: string;
  subheading?: string;
  align?: "Start" | "Center";
};

function TextContentHeading({ className, hasSubheading = true, heading = "Heading", subheading = "Subheading", align = "Start" }: TextContentHeadingProps) {
  return (
    <div className={className} data-name="Align=Start" data-node-id="2144:3863">
      <p className="font-[family-name:var(--sds-typography-heading-font-family,'Inter:Semi_Bold',sans-serif)] font-[var(--sds-typography-heading-font-weight,600)] leading-[1.2] relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-heading-size-base,24px)] tracking-[-0.48px] w-full" data-node-id="2144:3861">
        {heading}
      </p>
      {hasSubheading && (
        <div className="flex flex-col font-[family-name:var(--sds-typography-subheading-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-subheading-font-weight,400)] justify-center leading-[0] relative shrink-0 text-[color:var(--sds-color-text-default-secondary,#757575)] text-[length:var(--sds-typography-subheading-size-medium,20px)] w-full" data-node-id="2144:3862">
          <p className="leading-[1.2]">{subheading}</p>
        </div>
      )}
    </div>
  );
}

type ButtonGroupProps = {
  className?: string;
  buttonStart?: boolean;
  buttonEnd?: boolean;
  align?: "Justify" | "Start" | "End" | "Center" | "Stack";
};

function ButtonGroup({ className, buttonStart = true, buttonEnd = true, align = "Justify" }: ButtonGroupProps) {
  return (
    <div className={className} data-name="Align=Justify" data-node-id="2072:9459">
      {buttonStart && (
        <div className="basis-0 box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] grow items-center justify-center min-h-px min-w-px overflow-clip p-[var(--sds-size-space-300,12px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" data-name="Button" data-node-id="2072:9460">
          <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-neutral-default,#303030)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre" data-node-id="I2072:9460;9762:5145">
            Button
          </p>
        </div>
      )}
      {buttonEnd && (
        <div className="basis-0 bg-[var(--sds-color-background-brand-default,#2c2c2c)] border-[var(--sds-color-border-brand-default,#2c2c2c)] border-[var(--sds-size-stroke-border,1px)] border-solid grow min-h-px min-w-px relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" data-name="Button" data-node-id="2072:9461">
          <div className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center overflow-clip p-[var(--sds-size-space-300,12px)] relative rounded-[inherit] w-full">
            <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre" data-node-id="I2072:9461;9762:429">
              Button
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type TextContentTitleProps = {
  className?: string;
  subtitle?: string;
  hasSubtitle?: boolean;
  title?: string;
  align?: "Start" | "Center";
};

function TextContentTitle({ className, subtitle = "Subtitle", hasSubtitle = true, title = "Title", align = "Start" }: TextContentTitleProps) {
  const element = (
    <p className="font-[family-name:var(--sds-typography-title-hero-font-family,'Inter:Bold',sans-serif)] font-[var(--sds-typography-title-hero-font-weight,700)] leading-[1.2] relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-title-hero-size,72px)] tracking-[-2.16px] w-full" data-node-id="2153:5849">
      {title}
    </p>
  );
  const element1 = hasSubtitle && (
    <div className="flex flex-col font-[family-name:var(--sds-typography-subtitle-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-subtitle-font-weight,400)] justify-center leading-[0] relative shrink-0 text-[color:var(--sds-color-text-default-secondary,#757575)] text-[length:var(--sds-typography-subtitle-size-base,32px)] w-full" data-node-id="2153:5850">
      <p className="leading-[1.2]">{subtitle}</p>
    </div>
  );
  if (align === "Center") {
    return (
      <div className={className} data-name="Align=Center" data-node-id="2153:7839">
        {element}
        {element1}
      </div>
    );
  }
  return (
    <div className={className} data-name="Align=Start" data-node-id="2153:5851">
      {element}
      {element1}
    </div>
  );
}

type MenuProps = {
  className?: string;
  size?: "20" | "24" | "32" | "40" | "48" | "16";
};

function Menu({ className, size = "48" }: MenuProps) {
  if (size === "16") {
    return (
      <div className={className} data-name="Size=16" data-node-id="68:15863">
        <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Icon" data-node-id="68:15864">
          <div className="absolute inset-[-10%_-6.67%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" src={imgIcon} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="Size=48" data-node-id="4039:11389">
      <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Icon" data-node-id="7758:11882">
        <div className="absolute inset-[-8.33%_-5.56%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
          <img alt="" className="block max-w-none size-full" src={imgIcon1} />
        </div>
      </div>
    </div>
  );
}

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
      {link7 && <NavigationPill className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />}
    </div>
  );
}

type ExamplesHomePageProps = {
  platform?: "Mobile" | "Desktop";
};

export default function ExamplesHomePage({ platform = "Desktop" }: ExamplesHomePageProps) {
  const block = (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Block">
      <div className="h-[35px] relative shrink-0 w-[40px]" data-name="Figma">
        <div className="absolute bottom-[-5%] left-0 right-0 top-[-5%]">
          <img alt="" className="block max-w-none size-full" src={imgDirectionRow} />
        </div>
      </div>
    </div>
  );
  const element = <TextContentTitle align="Center" className="content-stretch flex flex-col gap-[var(--sds-size-space-200,8px)] items-center not-italic relative shrink-0 text-center" />;
  const element1 = <ButtonGroup className="content-stretch flex gap-[var(--sds-size-space-400,16px)] items-center relative shrink-0 w-[240px]" />;
  const section = (
    <div className="h-[400px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[var(--sds-color-slate-200,#e3e3e3)] inset-0" />
        <img alt="" className="absolute max-w-none object-50%-50% object-contain opacity-20 size-full" src={imgDirectionRow1} />
      </div>
    </div>
  );
  const element2 = <TextContentHeading className="content-stretch flex flex-col gap-[var(--sds-size-space-200,8px)] items-start not-italic relative shrink-0" />;
  const element3 = <TestimonialCard className="basis-0 bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-[var(--sds-size-stroke-border,1px)] border-solid box-border content-stretch flex flex-col gap-[var(--sds-size-space-600,24px)] grow items-start min-h-px min-w-[300px] p-[var(--sds-size-space-600,24px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0" />;
  const figma = (
    <div className="h-[35px] relative shrink-0 w-[23.333px]" data-name="Figma">
      <div className="absolute inset-[-5%_-7.5%]">
        <img alt="" className="block max-w-none size-full" src={imgDirectionRow2} />
      </div>
    </div>
  );
  const buttonList = (
    <div className="content-stretch flex gap-[var(--sds-size-space-400,16px)] items-center relative shrink-0" data-name="Button List">
      <div className="h-[24px] relative shrink-0 w-[23.98px]" data-name="X Logo">
        <img alt="" className="block max-w-none size-full" src={imgDirectionRow3} />
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="Logo Instagram">
        <img alt="" className="block max-w-none size-full" src={imgDirectionRow4} />
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="Logo YouTube">
        <img alt="" className="block max-w-none size-full" src={imgDirectionRow5} />
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="LinkedIn">
        <img alt="" className="block max-w-none size-full" src={imgDirectionRow6} />
      </div>
    </div>
  );

  if (platform === "Mobile") {
    return (
      <div className="bg-[var(--sds-color-background-default-default,#ffffff)] content-stretch flex flex-col items-start w-[var(--sds-responsive-device-width,375px)]" data-name="Platform=Mobile" data-node-id="562:8312">
        <div className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-b-[var(--sds-size-stroke-border,1px)] border-l-0 border-r-0 border-solid border-t-0 relative shrink-0 w-full" data-name="Header" data-node-id="562:8142">
          <div className="box-border content-center flex flex-wrap items-center justify-between overflow-clip p-[var(--sds-size-space-600,24px)] relative rounded-[inherit] w-full">
            {block}
            <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[var(--sds-size-space-200,8px)] relative rounded-[var(--sds-typography-scale-06,32px)] shrink-0" data-name="Icon Button" data-node-id="I562:8142;2322:7007">
              <Menu size="16" className="overflow-clip relative shrink-0 size-[16px]" />
            </div>
          </div>
        </div>
        <div className="bg-[var(--sds-color-background-default-secondary,#f5f5f5)] box-border content-stretch flex flex-col gap-[var(--sds-size-space-800,32px)] items-center px-[var(--sds-size-space-400,16px)] py-[var(--sds-size-space-4000,160px)] relative shrink-0 w-full" data-name="Hero Actions" data-node-id="562:8143">
          {element}
          {element1}
        </div>
        {section}
        <div className="bg-[var(--sds-color-background-default-default,#ffffff)] box-border content-stretch flex flex-col gap-[var(--sds-size-space-1200,48px)] items-start p-[var(--sds-size-space-600,24px)] relative shrink-0 w-full" data-name="Card Grid Testimonials" data-node-id="562:8145">
          {element2}
          <div className="content-start flex flex-wrap gap-[var(--sds-size-space-600,24px)] items-start relative shrink-0 w-full" data-name="Card Grid" data-node-id="I562:8145;348:13350">
            {element3}
            {element3}
            {element3}
            {element3}
            {element3}
            {element3}
          </div>
        </div>
        <div className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-b-0 border-l-0 border-r-0 border-solid border-t-[var(--sds-size-stroke-border,1px)] relative shrink-0 w-[375px]" data-name="Footer" data-node-id="562:8146">
          <div className="box-border content-stretch flex flex-col gap-[var(--sds-size-space-1600,64px)] items-start overflow-clip p-[var(--sds-size-space-800,32px)] relative rounded-[inherit] w-[375px]">
            <div className="content-stretch flex items-center justify-between min-w-[240px] relative shrink-0 w-full" data-name="Title" data-node-id="I562:8146;321:11074">
              {figma}
              {buttonList}
            </div>
            <div className="content-stretch flex flex-col gap-[var(--sds-size-space-600,24px)] items-start relative shrink-0 w-full" data-name="Links" data-node-id="I562:8146;321:11145">
              <TextLinkList density="Tight" className="content-stretch flex flex-col gap-[var(--sds-size-space-200,8px)] items-start relative shrink-0 w-full" />
              <TextLinkList density="Tight" className="content-stretch flex flex-col gap-[var(--sds-size-space-200,8px)] items-start relative shrink-0 w-full" />
              <TextLinkList density="Tight" className="content-stretch flex flex-col gap-[var(--sds-size-space-200,8px)] items-start relative shrink-0 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--sds-color-background-default-default,#ffffff)] content-stretch flex flex-col items-start w-[var(--sds-responsive-device-width,1200px)]" data-name="Platform=Desktop" data-node-id="175:4613">
      <div className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-b-[var(--sds-size-stroke-border,1px)] border-l-0 border-r-0 border-solid border-t-0 relative shrink-0 w-full" data-name="Header" data-node-id="175:4449">
        <div className="box-border content-center flex flex-wrap gap-[var(--sds-size-space-600,0px24px)] items-center overflow-clip p-[var(--sds-size-space-800,32px)] relative rounded-[inherit] w-full">
          {block}
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
      <div className="bg-[var(--sds-color-background-default-secondary,#f5f5f5)] box-border content-stretch flex flex-col gap-[var(--sds-size-space-800,32px)] items-center px-[var(--sds-size-space-600,24px)] py-[var(--sds-size-space-4000,160px)] relative shrink-0 w-full" data-name="Hero Actions" data-node-id="175:4450">
        {element}
        {element1}
      </div>
      {section}
      <div className="bg-[var(--sds-color-background-default-default,#ffffff)] box-border content-stretch flex flex-col gap-[var(--sds-size-space-1200,48px)] items-start p-[var(--sds-size-space-1600,64px)] relative shrink-0 w-full" data-name="Card Grid Testimonials" data-node-id="175:4453">
        {element2}
        <div className="content-start flex flex-wrap gap-[var(--sds-size-space-1200,48px)] items-start relative shrink-0 w-full" data-name="Card Grid" data-node-id="I175:4453;78:24784">
          {element3}
          {element3}
          {element3}
          {element3}
          {element3}
          {element3}
        </div>
      </div>
      <div className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-b-0 border-l-0 border-r-0 border-solid border-t-[var(--sds-size-stroke-border,1px)] relative shrink-0 w-[1200px]" data-name="Footer" data-node-id="175:4454">
        <div className="box-border content-start flex flex-wrap gap-[var(--sds-size-space-400,16px)] items-start overflow-clip pb-[var(--sds-size-space-4000,160px)] pt-[var(--sds-size-space-800,32px)] px-[var(--sds-size-space-800,32px)] relative rounded-[inherit] w-[1200px]">
          <div className="content-stretch flex flex-col gap-[var(--sds-size-space-600,24px)] items-start min-w-[240px] relative shrink-0 w-[262px]" data-name="Title" data-node-id="I175:4454;9640:4285">
            {figma}
            {buttonList}
          </div>
          <TextLinkList className="content-stretch flex flex-col gap-[var(--sds-size-space-300,12px)] items-start relative shrink-0 w-[262px]" />
          <TextLinkList className="content-stretch flex flex-col gap-[var(--sds-size-space-300,12px)] items-start relative shrink-0 w-[262px]" />
          <TextLinkList className="content-stretch flex flex-col gap-[var(--sds-size-space-300,12px)] items-start relative shrink-0 w-[262px]" />
        </div>
      </div>
    </div>
  );
}
