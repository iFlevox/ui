#!/usr/bin/env node

// index.ts
import fs from "fs";
import path from "path";
import https from "https";
import { execSync } from "child_process";
import { Command } from "commander";
import prompts from "prompts";
import ora from "ora";
import pc from "picocolors";
var REGISTRY_BASE_URL = process.env.IFLEVOX_REGISTRY_URL || "https://iflevox.uz/api/registry";
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "iflevox-ui-cli/0.1.0",
          Accept: "application/json"
        }
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Server returned HTTP ${res.statusCode} for ${url}`));
          return;
        }
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      }
    ).on("error", reject);
  });
}
function detectPackageManager() {
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("bun.lockb") || fs.existsSync("bun.lock")) return "bun";
  if (fs.existsSync("yarn.lock")) return "yarn";
  return "npm";
}
function ensureCnHelper(projectRoot) {
  const isSrc = fs.existsSync(path.join(projectRoot, "src"));
  const libDir = path.join(projectRoot, isSrc ? "src/lib" : "lib");
  const utilsPath = path.join(libDir, "utils.ts");
  if (!fs.existsSync(utilsPath)) {
    fs.mkdirSync(libDir, { recursive: true });
    const content = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
    fs.writeFileSync(utilsPath, content, "utf8");
    console.log(pc.green(`  \u2713 Created utility helper: `) + pc.dim(path.relative(projectRoot, utilsPath)));
  }
}
async function addComponent(slug, options) {
  const spinner = ora({
    text: `Fetching blueprint for ${pc.cyan(slug)}...`,
    color: "magenta"
  }).start();
  const componentUrl = `${REGISTRY_BASE_URL}/${slug}`;
  let payload;
  try {
    payload = await fetchJson(componentUrl);
    spinner.succeed(`Fetched ${pc.bold(payload.title)}`);
  } catch (err) {
    spinner.fail(`Failed to fetch component "${pc.red(slug)}". Check the slug name or network.`);
    return false;
  }
  const projectRoot = process.cwd();
  ensureCnHelper(projectRoot);
  const isSrc = fs.existsSync(path.join(projectRoot, "src"));
  const targetDir = path.join(projectRoot, isSrc ? "src/components/iflevox" : "components/iflevox");
  fs.mkdirSync(targetDir, { recursive: true });
  for (const file of payload.files) {
    const filename = path.basename(file.path);
    const destPath = path.join(targetDir, filename);
    if (fs.existsSync(destPath) && !options.overwrite) {
      const response = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `File ${pc.yellow(filename)} already exists in components/iflevox. Overwrite?`,
        initial: false
      });
      if (!response.overwrite) {
        console.log(pc.dim(`  Skipped ${filename}`));
        continue;
      }
    }
    fs.writeFileSync(destPath, file.content, "utf8");
    console.log(pc.green(`  \u2713 Written: `) + pc.cyan(path.relative(projectRoot, destPath)));
  }
  const pkgJsonPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const existingDeps = { ...pkg.dependencies || {}, ...pkg.devDependencies || {} };
    const missingDeps = (payload.dependencies || []).filter((dep) => !existingDeps[dep]);
    if (missingDeps.length > 0) {
      const pm = detectPackageManager();
      const depSpinner = ora(`Installing dependencies (${missingDeps.map((d) => pc.cyan(d)).join(", ")})...`).start();
      const installCmd = pm === "pnpm" ? `pnpm add ${missingDeps.join(" ")}` : pm === "bun" ? `bun add ${missingDeps.join(" ")}` : pm === "yarn" ? `yarn add ${missingDeps.join(" ")}` : `npm install ${missingDeps.join(" ")}`;
      try {
        execSync(installCmd, { stdio: "pipe" });
        depSpinner.succeed(`Installed dependencies via ${pc.bold(pm)}`);
      } catch {
        depSpinner.warn(`Automatic install skipped. Run manually: ${pc.yellow(installCmd)}`);
      }
    }
  }
  console.log(
    `
${pc.green("\u2726 Ready to use:")} import in your page:
` + pc.dim(`  import { ${payload.name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("")} } from "@/components/iflevox/${slug}";
`)
  );
  return true;
}
var program = new Command();
program.name("iflevox-ui").description("Next-generation CLI tool to add production-ready kinetic UI components directly to your project").version("0.1.0");
program.command("add [components...]").description("Add one or more components to your project").option("-o, --overwrite", "Overwrite existing component files without asking").action(async (components, options) => {
  console.log(`
${pc.magenta(pc.bold("\u2726 iFlevox UI"))} ${pc.dim("\u2014 Next-Gen Component Engine")}
`);
  if (!components || components.length === 0) {
    const listSpinner = ora("Loading component registry...").start();
    let registry;
    try {
      registry = await fetchJson(REGISTRY_BASE_URL);
      listSpinner.stop();
    } catch (err) {
      listSpinner.fail("Could not reach iFlevox UI registry.");
      process.exit(1);
    }
    const choices = registry.components.map((c) => ({
      title: `${c.title} ${c.isFlagship ? pc.yellow("\u2726 Flagship") : pc.dim(`(${c.categoryName})`)}`,
      value: c.slug,
      description: c.description
    }));
    const response = await prompts({
      type: "autocompleteMultiselect",
      name: "selected",
      message: "Select components to install (type to filter, space to select):",
      choices,
      min: 1
    });
    if (!response.selected || response.selected.length === 0) {
      console.log(pc.yellow("No components selected. Exiting."));
      return;
    }
    for (const slug of response.selected) {
      await addComponent(slug, options);
    }
    return;
  }
  for (const slug of components) {
    await addComponent(slug, options);
  }
});
program.command("list").description("List all available components in the registry").action(async () => {
  const spinner = ora("Fetching iFlevox UI registry...").start();
  try {
    const registry = await fetchJson(REGISTRY_BASE_URL);
    spinner.succeed(`Available Components (${pc.bold(registry.total)} elements):
`);
    const grouped = {};
    for (const item of registry.components) {
      if (!grouped[item.categoryName]) grouped[item.categoryName] = [];
      grouped[item.categoryName].push(item);
    }
    for (const [category, items] of Object.entries(grouped)) {
      console.log(pc.magenta(pc.bold(`
\u{1F4C1} ${category} (${items.length}):`)));
      for (const item of items) {
        const badge = item.isFlagship ? pc.yellow(" \u2726 Flagship") : "";
        console.log(`   ${pc.cyan(item.slug.padEnd(32))} ${pc.dim(item.title)}${badge}`);
      }
    }
    console.log(pc.green(`
Run: `) + pc.cyan(`npx iflevox-ui add <slug>`) + pc.dim(` to install any component.
`));
  } catch (err) {
    spinner.fail(`Failed to fetch registry list: ${err.message}`);
  }
});
program.command("init").description("Initialize iFlevox UI configuration in your project").action(async () => {
  console.log(`
${pc.magenta(pc.bold("\u2726 Initializing iFlevox UI"))}
`);
  const projectRoot = process.cwd();
  ensureCnHelper(projectRoot);
  const configPath = path.join(projectRoot, "iflevox.json");
  const config = {
    $schema: "https://iflevox.uz/schema.json",
    style: "default",
    tailwind: {
      config: fs.existsSync("tailwind.config.ts") ? "tailwind.config.ts" : "tailwind.config.js",
      css: fs.existsSync("src/app/globals.css") ? "src/app/globals.css" : "app/globals.css",
      baseColor: "zinc"
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/iflevox"
    }
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  console.log(pc.green(`  \u2713 Created configuration: `) + pc.dim("iflevox.json"));
  console.log(pc.green(`
\u{1F389} Project initialized successfully!`));
  console.log(pc.dim(`  Try adding a component: npx iflevox-ui add magnetic-button
`));
});
program.parse(process.argv);
