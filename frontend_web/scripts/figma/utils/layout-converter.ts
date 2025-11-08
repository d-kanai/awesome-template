/**
 * Figma Auto Layout情報をTailwind classに変換するユーティリティ
 */

interface AutoLayoutInfo {
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE" | null;
  paddingLeft?: number | null;
  paddingRight?: number | null;
  paddingTop?: number | null;
  paddingBottom?: number | null;
  itemSpacing?: number | null;
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN" | null;
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | null;
}

/**
 * spacing値をSpace tokenにマッピング
 */
function mapSpacingToToken(value: number): string {
  const spacingMap: Record<number, string> = {
    2: "Space-50",
    4: "Space-100",
    6: "Space-150",
    8: "Space-200",
    12: "Space-300",
    16: "Space-400",
    20: "Space-500",
    24: "Space-600",
    32: "Space-800",
    40: "Space-1000",
    48: "Space-1200",
    64: "Space-1600",
  };

  return spacingMap[value] || `[${value}px]`;
}

/**
 * paddingをTailwind classに変換
 */
function convertPadding(layout: AutoLayoutInfo): string[] {
  const classes: string[] = [];
  const { paddingLeft, paddingRight, paddingTop, paddingBottom } = layout;

  // 全て同じ値の場合
  if (
    paddingLeft === paddingRight &&
    paddingLeft === paddingTop &&
    paddingLeft === paddingBottom &&
    paddingLeft != null
  ) {
    classes.push(`p-${mapSpacingToToken(paddingLeft)}`);
    return classes;
  }

  // 左右が同じ、上下が同じ場合
  if (
    paddingLeft === paddingRight &&
    paddingTop === paddingBottom &&
    paddingLeft != null &&
    paddingTop != null
  ) {
    classes.push(`px-${mapSpacingToToken(paddingLeft)}`);
    classes.push(`py-${mapSpacingToToken(paddingTop)}`);
    return classes;
  }

  // 個別に設定
  if (paddingLeft != null) {
    classes.push(`pl-${mapSpacingToToken(paddingLeft)}`);
  }
  if (paddingRight != null) {
    classes.push(`pr-${mapSpacingToToken(paddingRight)}`);
  }
  if (paddingTop != null) {
    classes.push(`pt-${mapSpacingToToken(paddingTop)}`);
  }
  if (paddingBottom != null) {
    classes.push(`pb-${mapSpacingToToken(paddingBottom)}`);
  }

  return classes;
}

/**
 * Auto LayoutをTailwind classに変換
 */
export function convertAutoLayoutToClasses(layout: AutoLayoutInfo): string[] {
  const classes: string[] = [];

  // layoutMode
  if (layout.layoutMode === "HORIZONTAL") {
    classes.push("flex", "flex-row");
  } else if (layout.layoutMode === "VERTICAL") {
    classes.push("flex", "flex-col");
  }

  // itemSpacing (gap)
  if (layout.itemSpacing != null && layout.itemSpacing > 0) {
    classes.push(`gap-${mapSpacingToToken(layout.itemSpacing)}`);
  }

  // counterAxisAlignItems (cross-axis alignment)
  if (layout.counterAxisAlignItems === "MIN") {
    classes.push(
      layout.layoutMode === "HORIZONTAL" ? "items-start" : "justify-start",
    );
  } else if (layout.counterAxisAlignItems === "CENTER") {
    classes.push(
      layout.layoutMode === "HORIZONTAL" ? "items-center" : "justify-center",
    );
  } else if (layout.counterAxisAlignItems === "MAX") {
    classes.push(
      layout.layoutMode === "HORIZONTAL" ? "items-end" : "justify-end",
    );
  }

  // primaryAxisAlignItems (main-axis alignment)
  if (layout.primaryAxisAlignItems === "MIN") {
    classes.push(
      layout.layoutMode === "HORIZONTAL" ? "justify-start" : "items-start",
    );
  } else if (layout.primaryAxisAlignItems === "CENTER") {
    classes.push(
      layout.layoutMode === "HORIZONTAL" ? "justify-center" : "items-center",
    );
  } else if (layout.primaryAxisAlignItems === "MAX") {
    classes.push(
      layout.layoutMode === "HORIZONTAL" ? "justify-end" : "items-end",
    );
  } else if (layout.primaryAxisAlignItems === "SPACE_BETWEEN") {
    classes.push("justify-between");
  }

  // padding
  classes.push(...convertPadding(layout));

  return classes;
}
