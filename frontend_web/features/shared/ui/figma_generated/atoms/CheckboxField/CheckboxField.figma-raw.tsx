/**
 * ============================================
 * 🎨 Generated from Figma (RAW)
 * 📅 Generated at: 2025-11-09 19:00:00 JST
 * 🔗 Node ID: 9762-1441
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=9762-1441
 * ============================================
 *
 * This is the RAW version from Figma MCP - DO NOT USE IN PRODUCTION
 * Use CheckboxField.tsx instead
 */
"use client";

import React from "react";

const img = "http://localhost:3845/assets/9b215cead51e1e760cf5acb064d6f134c93d579c.svg";
const img1 = "http://localhost:3845/assets/5ec78d07553db0879c1c9cf1a965d99f9d50f361.svg";
const img2 = "http://localhost:3845/assets/980b428413d8dac62ca15ce8366c9e7f90a3366e.svg";
const img3 = "http://localhost:3845/assets/a978e5181a65527e0f3ca63ada0fa80a98f8ddf6.svg";

export interface CheckboxFieldProps {
  hasDescription?: boolean;
  description?: string;
  label?: string;
  state?: "Default" | "Disabled";
  valueType?: "Unchecked" | "Checked" | "Indeterminate";
}

export default function CheckboxField({
  hasDescription = true,
  description = "Description",
  label = "Label",
  state = "Default",
  valueType = "Checked",
}: CheckboxFieldProps) {
  const element = (
    <p
      className="
        basis-0
        font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
        font-[var(--sds-typography-body-font-weight-regular,400)]
        grow
        leading-[1.4]
        min-h-px
        min-w-px
        not-italic
        relative
        shrink-0
        text-[color:var(--sds-color-text-default-default,#1e1e1e)]
        text-[length:var(--sds-typography-body-size-medium,16px)]
      "
      data-node-id="280:12941"
    >
      {label}
    </p>
  );

  if (state === "Default" && valueType === "Unchecked") {
    return (
      <div
        className="
          content-stretch
          flex
          flex-col
          items-start
          w-[240px]
        "
        data-name="State=Default, Value Type=Unchecked"
        data-node-id="565:15610"
      >
        <div
          className="
            content-stretch
            flex
            gap-[var(--sds-size-space-300,12px)]
            items-center
            relative
            shrink-0
            w-full
          "
          data-name="Checkbox and Label"
          data-node-id="565:15611"
        >
          <div
            className="
              bg-[var(--sds-color-background-default-default,#ffffff)]
              border-[var(--sds-color-border-brand-tertiary,#757575)]
              border-[var(--sds-size-stroke-border,1px)]
              border-solid
              relative
              rounded-[var(--sds-size-radius-100,4px)]
              shrink-0
              size-[16px]
            "
            data-name="Checkbox"
            data-node-id="565:15621"
          >
            <div
              className="
                content-stretch
                flex
                gap-[10px]
                items-center
                justify-center
                overflow-clip
                rounded-[inherit]
                size-[16px]
              "
            />
          </div>
          {element}
        </div>
        {hasDescription && (
          <div
            className="
              content-stretch
              flex
              gap-[var(--sds-size-space-300,12px)]
              items-center
              relative
              shrink-0
              w-full
            "
            data-name="Description Row"
            data-node-id="9762:1446"
          >
            <div className="shrink-0 size-[16px]" data-name="Space" data-node-id="709:11253" />
            <p
              className="
                basis-0
                font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
                font-[var(--sds-typography-body-font-weight-regular,400)]
                grow
                leading-[1.4]
                min-h-px
                min-w-px
                not-italic
                relative
                shrink-0
                text-[color:var(--sds-color-text-default-secondary,#757575)]
                text-[length:var(--sds-typography-body-size-medium,16px)]
              "
              data-node-id="280:13588"
            >
              {description}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (state === "Default" && valueType === "Indeterminate") {
    return (
      <div
        className="
          content-stretch
          flex
          flex-col
          items-start
          w-[240px]
        "
        data-name="State=Default, Value Type=Indeterminate"
        data-node-id="565:15635"
      >
        <div
          className="
            content-stretch
            flex
            gap-[var(--sds-size-space-300,12px)]
            items-center
            relative
            shrink-0
            w-full
          "
          data-name="Checkbox and Label"
          data-node-id="565:15636"
        >
          <div
            className="
              bg-[var(--sds-color-background-brand-default,#2c2c2c)]
              content-stretch
              flex
              gap-[10px]
              items-center
              justify-center
              overflow-clip
              relative
              rounded-[var(--sds-size-radius-100,4px)]
              shrink-0
              size-[16px]
            "
            data-name="Checkbox"
            data-node-id="565:15646"
          >
            <div
              className="
                overflow-clip
                relative
                shrink-0
                size-[16px]
              "
              data-name="Minus"
              data-node-id="565:15647"
            >
              <div
                className="
                  absolute
                  bottom-1/2
                  left-[20.83%]
                  right-[20.83%]
                  top-1/2
                "
                data-name="Icon"
                data-node-id="I565:15647;68:15882"
              >
                <div
                  className="
                    absolute
                    inset-[-0.8px_-8.57%]
                  "
                  style={{ "--stroke-0": "rgba(245, 245, 245, 1)" } as React.CSSProperties}
                >
                  <img alt="" className="block max-w-none size-full" src={img} />
                </div>
              </div>
            </div>
          </div>
          {element}
        </div>
        {hasDescription && (
          <div
            className="
              box-border
              content-stretch
              flex
              items-center
              pl-[var(--sds-size-space-300,12px)]
              pr-0
              py-0
              relative
              shrink-0
              w-full
            "
            data-name="Description Row"
            data-node-id="565:15640"
          >
            <div className="shrink-0 size-[16px]" data-name="Space" data-node-id="709:11415" />
            <p
              className="
                basis-0
                font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
                font-[var(--sds-typography-body-font-weight-regular,400)]
                grow
                leading-[1.4]
                min-h-px
                min-w-px
                not-italic
                relative
                shrink-0
                text-[color:var(--sds-color-text-default-secondary,#757575)]
                text-[length:var(--sds-typography-body-size-medium,16px)]
              "
              data-node-id="280:13588"
            >
              {description}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (state === "Disabled" && valueType === "Checked") {
    return (
      <div
        className="
          content-stretch
          flex
          flex-col
          items-start
          w-[240px]
        "
        data-name="State=Disabled, Value Type=Checked"
        data-node-id="565:15661"
      >
        <div
          className="
            content-stretch
            flex
            gap-[var(--sds-size-space-300,12px)]
            items-center
            relative
            shrink-0
            w-full
          "
          data-name="Checkbox and Label"
          data-node-id="565:15662"
        >
          <div
            className="
              bg-[var(--sds-color-background-disabled-default,#d9d9d9)]
              border-[var(--sds-color-border-disabled-secondary,#b2b2b2)]
              border-[var(--sds-size-stroke-border,1px)]
              border-solid
              relative
              rounded-[var(--sds-size-radius-100,4px)]
              shrink-0
              size-[16px]
            "
            data-name="Checkbox"
            data-node-id="565:15663"
          >
            <div
              className="
                content-stretch
                flex
                gap-[10px]
                items-center
                justify-center
                overflow-clip
                relative
                rounded-[inherit]
                size-[16px]
              "
            >
              <div
                className="
                  overflow-clip
                  relative
                  shrink-0
                  size-[16px]
                "
                data-name="Check"
                data-node-id="565:15664"
              >
                <div
                  className="
                    absolute
                    bottom-[29.17%]
                    left-[16.67%]
                    right-[16.67%]
                    top-1/4
                  "
                  data-name="Icon"
                  data-node-id="I565:15664;68:15642"
                >
                  <div
                    className="
                      absolute
                      inset-[-10.91%_-7.5%]
                    "
                    style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}
                  >
                    <img alt="" className="block max-w-none size-full" src={img1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {element}
        </div>
        {hasDescription && (
          <div
            className="
              content-stretch
              flex
              gap-[var(--sds-size-space-300,12px)]
              items-center
              opacity-50
              relative
              shrink-0
              w-full
            "
            data-name="Description Row"
            data-node-id="565:15666"
          >
            <div className="shrink-0 size-[16px]" data-name="Space" data-node-id="709:11408" />
            <p
              className="
                basis-0
                font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
                font-[var(--sds-typography-body-font-weight-regular,400)]
                grow
                leading-[1.4]
                min-h-px
                min-w-px
                not-italic
                relative
                shrink-0
                text-[color:var(--sds-color-text-default-secondary,#757575)]
                text-[length:var(--sds-typography-body-size-medium,16px)]
              "
              data-node-id="280:13588"
            >
              {description}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (state === "Disabled" && valueType === "Unchecked") {
    return (
      <div
        className="
          content-stretch
          flex
          flex-col
          items-start
          w-[240px]
        "
        data-name="State=Disabled, Value Type=Unchecked"
        data-node-id="9762:1448"
      >
        <div
          className="
            content-stretch
            flex
            gap-[var(--sds-size-space-300,12px)]
            items-center
            relative
            shrink-0
            w-full
          "
          data-name="Checkbox and Label"
          data-node-id="9762:1449"
        >
          <div
            className="
              bg-[var(--sds-color-background-disabled-default,#d9d9d9)]
              border-[var(--sds-color-border-disabled-secondary,#b2b2b2)]
              border-[var(--sds-size-stroke-border,1px)]
              border-solid
              relative
              rounded-[var(--sds-size-radius-100,4px)]
              shrink-0
              size-[16px]
            "
            data-name="Checkbox"
            data-node-id="565:14973"
          >
            <div
              className="
                content-stretch
                flex
                gap-[10px]
                items-center
                justify-center
                overflow-clip
                rounded-[inherit]
                size-[16px]
              "
            />
          </div>
          {element}
        </div>
        {hasDescription && (
          <div
            className="
              content-stretch
              flex
              gap-[var(--sds-size-space-300,12px)]
              items-center
              opacity-50
              relative
              shrink-0
              w-full
            "
            data-name="Description Row"
            data-node-id="565:15666"
          >
            <div className="shrink-0 size-[16px]" data-name="Space" data-node-id="709:11408" />
            <p
              className="
                basis-0
                font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
                font-[var(--sds-typography-body-font-weight-regular,400)]
                grow
                leading-[1.4]
                min-h-px
                min-w-px
                not-italic
                relative
                shrink-0
                text-[color:var(--sds-color-text-default-secondary,#757575)]
                text-[length:var(--sds-typography-body-size-medium,16px)]
              "
              data-node-id="280:13588"
            >
              {description}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (state === "Disabled" && valueType === "Indeterminate") {
    return (
      <div
        className="
          content-stretch
          flex
          flex-col
          items-start
          w-[240px]
        "
        data-name="State=Disabled, Value Type=Indeterminate"
        data-node-id="587:16995"
      >
        <div
          className="
            content-stretch
            flex
            gap-[var(--sds-size-space-300,12px)]
            items-center
            relative
            shrink-0
            w-full
          "
          data-name="Checkbox and Label"
          data-node-id="587:16996"
        >
          <div
            className="
              bg-[var(--sds-color-background-disabled-default,#d9d9d9)]
              border-[var(--sds-color-border-disabled-secondary,#b2b2b2)]
              border-[var(--sds-size-stroke-border,1px)]
              border-solid
              relative
              rounded-[var(--sds-size-radius-100,4px)]
              shrink-0
              size-[16px]
            "
            data-name="Checkbox"
            data-node-id="587:16997"
          >
            <div
              className="
                content-stretch
                flex
                gap-[10px]
                items-center
                justify-center
                overflow-clip
                relative
                rounded-[inherit]
                size-[16px]
              "
            >
              <div
                className="
                  overflow-clip
                  relative
                  shrink-0
                  size-[16px]
                "
                data-name="Minus"
                data-node-id="587:16998"
              >
                <div
                  className="
                    absolute
                    bottom-1/2
                    left-[20.83%]
                    right-[20.83%]
                    top-1/2
                  "
                  data-name="Icon"
                  data-node-id="I587:16998;68:15882"
                >
                  <div
                    className="
                      absolute
                      inset-[-0.8px_-8.57%]
                    "
                    style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}
                  >
                    <img alt="" className="block max-w-none size-full" src={img2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {element}
        </div>
        {hasDescription && (
          <div
            className="
              box-border
              content-stretch
              flex
              items-center
              opacity-50
              pl-[var(--sds-size-space-300,12px)]
              pr-0
              py-0
              relative
              shrink-0
              w-full
            "
            data-name="Description Row"
            data-node-id="587:17000"
          >
            <div className="shrink-0 size-[16px]" data-name="Space" data-node-id="709:11416" />
            <p
              className="
                basis-0
                font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
                font-[var(--sds-typography-body-font-weight-regular,400)]
                grow
                leading-[1.4]
                min-h-px
                min-w-px
                not-italic
                relative
                shrink-0
                text-[color:var(--sds-color-text-default-secondary,#757575)]
                text-[length:var(--sds-typography-body-size-medium,16px)]
              "
              data-node-id="280:13588"
            >
              {description}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="
        content-stretch
        flex
        flex-col
        items-start
        w-[240px]
      "
      data-name="State=Default, Value Type=Checked"
      data-node-id="9762:1442"
    >
      <div
        className="
          content-stretch
          flex
          gap-[var(--sds-size-space-300,12px)]
          items-center
          relative
          shrink-0
          w-full
        "
        data-name="Checkbox and Label"
        data-node-id="9762:1443"
      >
        <div
          className="
            bg-[var(--sds-color-background-brand-default,#2c2c2c)]
            content-stretch
            flex
            gap-[10px]
            items-center
            justify-center
            overflow-clip
            relative
            rounded-[var(--sds-size-radius-100,4px)]
            shrink-0
            size-[16px]
          "
          data-name="Checkbox"
          data-node-id="565:14466"
        >
          <div
            className="
              overflow-clip
              relative
              shrink-0
              size-[16px]
            "
            data-name="Check"
            data-node-id="565:14467"
          >
            <div
              className="
                absolute
                bottom-[29.17%]
                left-[16.67%]
                right-[16.67%]
                top-1/4
              "
              data-name="Icon"
              data-node-id="I565:14467;68:15642"
            >
              <div
                className="
                  absolute
                  inset-[-10.91%_-7.5%]
                "
                style={{ "--stroke-0": "rgba(245, 245, 245, 1)" } as React.CSSProperties}
              >
                <img alt="" className="block max-w-none size-full" src={img3} />
              </div>
            </div>
          </div>
        </div>
        {element}
      </div>
      {hasDescription && (
        <div
          className="
            content-stretch
            flex
            gap-[var(--sds-size-space-300,12px)]
            items-center
            relative
            shrink-0
            w-full
          "
          data-name="Description Row"
          data-node-id="9762:1446"
        >
          <div className="shrink-0 size-[16px]" data-name="Space" data-node-id="709:11253" />
          <p
            className="
              basis-0
              font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
              font-[var(--sds-typography-body-font-weight-regular,400)]
              grow
              leading-[1.4]
              min-h-px
              min-w-px
              not-italic
              relative
              shrink-0
              text-[color:var(--sds-color-text-default-secondary,#757575)]
              text-[length:var(--sds-typography-body-size-medium,16px)]
            "
            data-node-id="280:13588"
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
