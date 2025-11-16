import { Header } from "@/features/shared/ui/components/Header/Header";
import { HeroActions } from "@/features/shared/ui/components/HeroActions/HeroActions";
import { CardGridTestimonials } from "@/features/shared/ui/components/CardGridTestimonials/CardGridTestimonials";
import { Footer } from "@/features/shared/ui/components/Footer/Footer";

const img1 =
  "http://localhost:3845/assets/0707e6b2022462187b7b2dab43ed95bab6b24a66.png";
const img2 =
  "http://localhost:3845/assets/11dbcb982f9ba115c7d5cc790cc48a457815fb67.png";
const img =
  "http://localhost:3845/assets/d4c3bac78b200cfb907deaea86f331a1ec54cb0a.svg";
const img3 =
  "http://localhost:3845/assets/f7670ccd9f4a0daef6ffdd182abe963966b9e064.svg";
const img4 =
  "http://localhost:3845/assets/06d5686ebc43f358ce6232b368c6aaa3e6dc3c02.svg";
const img5 =
  "http://localhost:3845/assets/6861e555b302aeb3c106fc8f569473bc6de7b388.svg";
const img6 =
  "http://localhost:3845/assets/7f3f966fdf4b0fd049db80f6afdf1614bcd3f100.svg";
const img7 =
  "http://localhost:3845/assets/5ea18c437665224c3c840c1832ded6b6c216b20a.svg";

type ExamplesHomePageProps = {
  platform?: "Mobile" | "Desktop";
};

export default function ExamplesHomePage({
  platform = "Desktop",
}: ExamplesHomePageProps) {
  const block = (
    <div
      className="content-stretch flex gap-[24px] items-center relative shrink-0"
      data-name="Block"
    >
      <div className="h-[35px] relative shrink-0 w-[40px]" data-name="Figma">
        <div className="absolute bottom-[-5%] left-0 right-0 top-[-5%]">
          <img alt="" className="block max-w-none size-full" src={img} />
        </div>
      </div>
    </div>
  );
  const element = (
    <div className="flex flex-col font-[family-name:var(--sds-typography-subtitle-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-subtitle-font-weight,400)] justify-center leading-[0] relative shrink-0 text-[color:var(--sds-color-text-default-secondary,#757575)] text-[length:var(--sds-typography-subtitle-size-base,32px)] w-full">
      <p className="leading-[1.2]">Subtitle</p>
    </div>
  );
  const buttonGroup = (
    <div
      className="content-stretch flex gap-[var(--sds-size-space-400,16px)] items-center relative shrink-0 w-[240px]"
      data-name="Button Group"
    >
      <div
        className="basis-0 bg-[var(--sds-color-background-neutral-tertiary,#e3e3e3)] border-[var(--sds-color-border-neutral-secondary,#767676)] border-[var(--sds-size-stroke-border,1px)] border-solid grow min-h-px min-w-px relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
        data-name="Button"
      >
        <div className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center overflow-clip p-[var(--sds-size-space-300,12px)] relative rounded-[inherit] w-full">
          <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre">
            Button
          </p>
        </div>
      </div>
      <div
        className="basis-0 bg-[var(--sds-color-background-brand-default,#2c2c2c)] border-[var(--sds-color-border-brand-default,#2c2c2c)] border-[var(--sds-size-stroke-border,1px)] border-solid grow min-h-px min-w-px relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
        data-name="Button"
      >
        <div className="box-border content-stretch flex gap-[var(--sds-size-space-200,8px)] items-center justify-center overflow-clip p-[var(--sds-size-space-300,12px)] relative rounded-[inherit] w-full">
          <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] leading-none not-italic relative shrink-0 text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)] text-[length:var(--sds-typography-body-size-medium,16px)] text-nowrap whitespace-pre">
            Button
          </p>
        </div>
      </div>
    </div>
  );
  const section = (
    <div className="h-[400px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[var(--sds-color-slate-200,#e3e3e3)] inset-0" />
        <img
          alt=""
          className="absolute max-w-none object-50%-50% object-contain opacity-20 size-full"
          src={img1}
        />
      </div>
    </div>
  );
  const textContentHeading = (
    <div
      className="content-stretch flex flex-col gap-[var(--sds-size-space-200,8px)] items-start not-italic relative shrink-0"
      data-name="Text Content Heading"
    >
      <p className="font-[family-name:var(--sds-typography-heading-font-family,'Inter:Semi_Bold',sans-serif)] font-[var(--sds-typography-heading-font-weight,600)] leading-[1.2] relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-heading-size-base,24px)] tracking-[-0.48px] w-full">
        Heading
      </p>
      <div className="flex flex-col font-[family-name:var(--sds-typography-subheading-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-subheading-font-weight,400)] justify-center leading-[0] relative shrink-0 text-[color:var(--sds-color-text-default-secondary,#757575)] text-[length:var(--sds-typography-subheading-size-medium,20px)] w-full">
        <p className="leading-[1.2]">Subheading</p>
      </div>
    </div>
  );
  const testimonialCard = (
    <div
      className="basis-0 bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-[var(--sds-size-stroke-border,1px)] border-solid box-border content-stretch flex flex-col gap-[var(--sds-size-space-600,24px)] grow items-start min-h-px min-w-[300px] p-[var(--sds-size-space-600,24px)] relative rounded-[var(--sds-size-radius-200,8px)] shrink-0"
      data-name="Testimonial Card"
    >
      <div
        className="content-stretch flex items-start relative shrink-0 w-full"
        data-name="Text Heading"
      >
        <p className="basis-0 font-[family-name:var(--sds-typography-heading-font-family,'Inter:Semi_Bold',sans-serif)] font-[var(--sds-typography-heading-font-weight,600)] grow leading-[1.2] min-h-px min-w-px not-italic relative shrink-0 text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-[length:var(--sds-typography-heading-size-base,24px)] tracking-[-0.48px]">
          "Quote"
        </p>
      </div>
      <div
        className="content-stretch flex gap-[var(--sds-size-space-300,12px)] items-start relative shrink-0 w-[139px]"
        data-name="Avatar Block"
      >
        <div
          className="overflow-clip relative rounded-[var(--sds-size-radius-full,9999px)] shrink-0 size-[40px]"
          data-name="Avatar"
        >
          <div
            className="absolute left-1/2 size-[40px] top-1/2 translate-x-[-50%] translate-y-[-50%]"
            data-name="Shape"
          >
            <img
              alt=""
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
              src={img2}
            />
          </div>
        </div>
        <div
          className="basis-0 content-stretch flex flex-col gap-[var(--sds-size-space-050,2px)] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[length:var(--sds-typography-body-size-medium,16px)]"
          data-name="Info"
        >
          <div className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Semi_Bold',sans-serif)] font-[var(--sds-typography-body-font-weight-strong,600)] justify-center relative shrink-0 text-[color:var(--sds-color-text-default-secondary,#757575)] w-full">
            <p className="leading-[1.4]">Title</p>
          </div>
          <div className="flex flex-col font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] justify-center relative shrink-0 text-[color:var(--sds-color-text-default-tertiary,#b3b3b3)] w-full">
            <p className="leading-[1.4]">Description</p>
          </div>
        </div>
      </div>
    </div>
  );
  const figma = (
    <div className="h-[35px] relative shrink-0 w-[23.333px]" data-name="Figma">
      <div className="absolute inset-[-5%_-7.5%]">
        <img alt="" className="block max-w-none size-full" src={img3} />
      </div>
    </div>
  );
  const buttonList = (
    <div
      className="content-stretch flex gap-[var(--sds-size-space-400,16px)] items-center relative shrink-0"
      data-name="Button List"
    >
      <div
        className="h-[24px] relative shrink-0 w-[23.98px]"
        data-name="X Logo"
      >
        <img alt="" className="block max-w-none size-full" src={img4} />
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="Logo Instagram">
        <img alt="" className="block max-w-none size-full" src={img5} />
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="Logo YouTube">
        <img alt="" className="block max-w-none size-full" src={img6} />
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="LinkedIn">
        <img alt="" className="block max-w-none size-full" src={img7} />
      </div>
    </div>
  );
  if (platform === "Mobile") {
    return (
      <div
        className="bg-[var(--sds-color-background-default-default,#ffffff)] content-stretch flex flex-col items-start w-[var(--sds-responsive-device-width,375px)]"
        data-name="Platform=Mobile"
        data-node-id="562:8312"
      >
        <Header
          navigationItems={[
            { label: "Products", isActive: true },
            { label: "Solutions" },
            { label: "Community" },
            { label: "Resources" },
            { label: "Pricing" },
            { label: "Contact" },
            { label: "Link" },
          ]}
        />
        <HeroActions
          title="Title"
          subtitle="Subtitle"
          primaryButtonText="Button"
          secondaryButtonText="Button"
        />
        {section}
        <CardGridTestimonials
          heading="Heading"
          subheading="Subheading"
          hasSubheading={true}
          testimonials={[
            {
              quote: "Sample testimonial",
              title: "John Doe",
              description: "CEO, Company",
            },
          ]}
        />
        <Footer
          linkSections={[
            {
              title: "Use cases",
              links: [
                { label: "UI design" },
                { label: "UX design" },
                { label: "Wireframing" },
              ],
            },
            {
              title: "Explore",
              links: [{ label: "Design" }, { label: "Prototyping" }],
            },
          ]}
        />
      </div>
    );
  }
  return (
    <div
      className="bg-[var(--sds-color-background-default-default,#ffffff)] content-stretch flex flex-col items-start w-[var(--sds-responsive-device-width,1200px)]"
      data-name="Platform=Desktop"
      data-node-id="175:4613"
    >
      <Header
        navigationItems={[
          { label: "Products", isActive: true },
          { label: "Solutions" },
          { label: "Community" },
          { label: "Resources" },
          { label: "Pricing" },
          { label: "Contact" },
          { label: "Link" },
        ]}
      />
      <HeroActions
        title="Title"
        subtitle="Subtitle"
        primaryButtonText="Button"
        secondaryButtonText="Button"
      />
      {section}
      <CardGridTestimonials
        heading="Heading"
        subheading="Subheading"
        hasSubheading={true}
        testimonials={[
          {
            quote: "Sample testimonial",
            title: "John Doe",
            description: "CEO, Company",
          },
        ]}
      />
      <Footer
        linkSections={[
          {
            title: "Use cases",
            links: [
              { label: "UI design" },
              { label: "UX design" },
              { label: "Wireframing" },
            ],
          },
          {
            title: "Explore",
            links: [{ label: "Design" }, { label: "Prototyping" }],
          },
        ]}
      />
    </div>
  );
}
