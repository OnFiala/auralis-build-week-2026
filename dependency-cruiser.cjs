/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-unresolvable",
      severity: "error",
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: "no-browser-to-server",
      comment: "Client composition and browser adapters must not import trusted-server implementations.",
      severity: "error",
      from: { path: "^src/(app/page\\.tsx$|browser/)" },
      to: { path: "^src/(app/api/|server/)" },
    },
    {
      name: "no-server-to-browser",
      comment: "Trusted-server code must not import browser adapters.",
      severity: "error",
      from: { path: "^src/(app/api/|server/)" },
      to: { path: "^src/browser/" },
    },
    {
      name: "no-browser-adapter-to-composition",
      comment: "Browser adapters must not depend on the React composition layer.",
      severity: "error",
      from: { path: "^src/browser/" },
      to: { path: "^src/app/" },
    },
    {
      name: "no-pure-core-to-outer-layers",
      comment: "Pure contracts and core logic must not import composition or adapter layers.",
      severity: "error",
      from: { path: "^src/(contracts|core)/" },
      to: { path: "^src/(app|browser|server)/" },
    },
    {
      name: "no-composition-owned-transformation-or-safety",
      comment: "The page may compose the core and audio adapter but must not own transformation or safety rules.",
      severity: "error",
      from: { path: "^src/app/page\\.tsx$" },
      to: { path: "^src/core/(transformation|safety)\\.ts$" },
    },
    {
      name: "no-runtime-dev-dependencies",
      comment: "Production source must not import development-only packages.",
      severity: "error",
      from: {
        path: "^src/",
        pathNot: "\\.(test|spec)\\.[cm]?[jt]sx?$",
      },
      to: { dependencyTypes: ["npm-dev"] },
    },
    {
      name: "no-unapproved-runtime-packages",
      comment: "Increment 10A runtime source may import only the approved framework packages and Zod.",
      severity: "error",
      from: {
        path: "^src/",
        pathNot: "\\.(test|spec)\\.[cm]?[jt]sx?$",
      },
      to: {
        dependencyTypes: ["npm", "npm-optional", "npm-peer"],
        pathNot: "^node_modules/(next|react|react-dom|zod)(/|$)",
      },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
  },
};

// Folder naming and semantic dumping-ground rules remain review-enforced;
// static import analysis cannot prove those concerns on its own.
