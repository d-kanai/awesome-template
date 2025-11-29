/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-shared-to-features",
      comment:
        "shared/ は features/ に依存してはいけない（依存方向: features → shared の一方向のみ）",
      severity: "error",
      from: {
        path: "^shared/",
      },
      to: {
        path: "^features/",
      },
    },
    {
      name: "no-cross-feature-dependency",
      comment:
        "feature 間の直接依存は禁止。ただし routes.ts（ナビゲーション用）は許可",
      severity: "error",
      from: {
        path: "^features/([^/]+)/",
      },
      to: {
        path: "^features/([^/]+)/",
        pathNot: ["^features/$1/", "routes\\.ts$"],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: ["node_modules", ".next", "coverage", "test-results"],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
