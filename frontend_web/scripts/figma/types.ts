/**
 * Figma REST API の型定義
 * @see https://www.figma.com/developers/api
 */

export interface FigmaVariable {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, VariableValue>;
  remote: boolean;
  description: string;
  hiddenFromPublishing: boolean;
  scopes: string[];
  codeSyntax: Record<string, string>;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  key: string;
  modes: Array<{
    modeId: string;
    name: string;
  }>;
  defaultModeId: string;
  remote: boolean;
  hiddenFromPublishing: boolean;
  variableIds: string[];
}

export type VariableValue =
  | {
      r: number;
      g: number;
      b: number;
      a: number;
    }
  | number
  | string
  | boolean
  | {
      type: "VARIABLE_ALIAS";
      id: string;
    };

export interface FigmaVariablesResponse {
  status: number;
  error: boolean;
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  };
}

export interface FigmaStyle {
  key: string;
  file_key: string;
  node_id: string;
  style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
  sort_position: string;
}

export interface FigmaFileStylesResponse {
  status: number;
  error: boolean;
  meta: {
    styles: Record<string, FigmaStyle>;
  };
}

export interface DesignToken {
  type: "color" | "spacing" | "fontSize" | "fontWeight" | "lineHeight";
  value: string | number;
  description?: string;
  mode?: string;
}

export interface DesignTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  fontSize: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
}
