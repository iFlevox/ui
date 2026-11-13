#!/usr/bin/env node

/**
 * iFlevox UI — Next-Gen Component Ownership CLI
 * Direct code copy. Zero npm dependency lock-in. Full customization rights.
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { execSync } from "node:child_process";
import { Command } from "commander";
import prompts from "prompts";
import ora from "ora";
import pc from "picocolors";

const REGISTRY_BASE_URL = process.env.IFLEVOX_REGISTRY_URL || "https://iflevox.uz/api/registry";

interface ComponentFile {
  path: string;
  content: string;
  type: string;
}

interface ComponentPayload {
  name: string;
  title: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  files: ComponentFile[];
  meta?: {
    category?: string;
    isFlagship?: boolean;
  };
}

interface RegistryIndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  isFlagship: boolean;
  dependencies: string[];
}

interface RegistryResponse {
  version: string;
  total: number;
  components: RegistryIndexItem[];
}

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "iflevox-ui-cli/0.1.0",
            Accept: "application/json",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Server returned HTTP ${res.statusCode} for ${url}`));
            return;
          }
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          });
        }
      )
      .on("error", reject);
  });
}

function detectPackageManager(): "pnpm" | "bun" | "yarn" | "npm" {
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("bun.lockb") || fs.existsSync("bun.lock")) return "bun";
  if (fs.existsSync("yarn.lock")) return "yarn";
  return "npm";
}

function ensureCnHelper(projectRoot: string) {
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
    console.log(pc.green(`  ✓ Created utility helper: `) + pc.dim(path.relative(projectRoot, utilsPath)));
  }
}

async function addComponent(slug: string, options: { overwrite?: boolean }) {
  const spinner = ora({
    text: `Fetching blueprint for ${pc.cyan(slug)}...`,
    color: "magenta",
  }).start();

  const componentUrl = `${REGISTRY_BASE_URL}/${slug}`;
  let payload: ComponentPayload;

  try {
    payload = await fetchJson<ComponentPayload>(componentUrl);
    spinner.succeed(`Fetched ${pc.bold(payload.title)}`);
  } catch (err: any) {
    spinner.fail(`Failed to fetch component "${pc.red(slug)}". Check the slug name or network.`);
    return false;
  }

  const projectRoot = process.cwd();
  ensureCnHelper(projectRoot);

  const isSrc = fs.existsSync(path.join(projectRoot, "src"));
  const targetDir = path.join(projectRoot, isSrc ? "src/components/iflevox" : "components/iflevox");
  fs.mkdirSync(targetDir, { recursive: true });

  // Write component files
  for (const file of payload.files) {
    const filename = path.basename(file.path);
    const destPath = path.join(targetDir, filename);

    if (fs.existsSync(destPath) && !options.overwrite) {
      const response = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `File ${pc.yellow(filename)} already exists in components/iflevox. Overwrite?`,
        initial: false,
      });

      if (!response.overwrite) {
        console.log(pc.dim(`  Skipped ${filename}`));
        continue;
      }
    }

    fs.writeFileSync(destPath, file.content, "utf8");
    console.log(pc.green(`  ✓ Written: `) + pc.cyan(path.relative(projectRoot, destPath)));
  }

  // Install dependencies
  const pkgJsonPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const existingDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    const missingDeps = (payload.dependencies || []).filter((dep) => !existingDeps[dep]);

    if (missingDeps.length > 0) {
      const pm = detectPackageManager();
      const depSpinner = ora(`Installing dependencies (${missingDeps.map((d) => pc.cyan(d)).join(", ")})...`).start();
      const installCmd =
        pm === "pnpm"
          ? `pnpm add ${missingDeps.join(" ")}`
          : pm === "bun"
          ? `bun add ${missingDeps.join(" ")}`
          : pm === "yarn"
          ? `yarn add ${missingDeps.join(" ")}`
          : `npm install ${missingDeps.join(" ")}`;

      try {
        execSync(installCmd, { stdio: "pipe" });
        depSpinner.succeed(`Installed dependencies via ${pc.bold(pm)}`);
      } catch {
        depSpinner.warn(`Automatic install skipped. Run manually: ${pc.yellow(installCmd)}`);
      }
    }
  }

  console.log(
    `\n${pc.green("✦ Ready to use:")} import in your page:\n` +
      pc.dim(`  import { ${payload.name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("")} } from "@/components/iflevox/${slug}";\n`)
  );

  return true;
}

const program = new Command();

program
  .name("iflevox-ui")
  .description("Next-generation CLI tool to add production-ready kinetic UI components directly to your project")
  .version("0.1.0");

program
  .command("add [components...]")
  .description("Add one or more components to your project")
  .option("-o, --overwrite", "Overwrite existing component files without asking")
  .action(async (components: string[], options: { overwrite?: boolean }) => {
    console.log(`\n${pc.magenta(pc.bold("✦ iFlevox UI"))} ${pc.dim("— Next-Gen Component Engine")}\n`);

    if (!components || components.length === 0) {
      const listSpinner = ora("Loading component registry...").start();
      let registry: RegistryResponse;
      try {
        registry = await fetchJson<RegistryResponse>(REGISTRY_BASE_URL);
        listSpinner.stop();
      } catch (err: any) {
        listSpinner.fail("Could not reach iFlevox UI registry.");
        process.exit(1);
      }

      const choices = registry.components.map((c) => ({
        title: `${c.title} ${c.isFlagship ? pc.yellow("✦ Flagship") : pc.dim(`(${c.categoryName})`)}`,
        value: c.slug,
        description: c.description,
      }));

      const response = await prompts({
        type: "autocompleteMultiselect",
        name: "selected",
        message: "Select components to install (type to filter, space to select):",
        choices,
        min: 1,
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

program
  .command("list")
  .description("List all available components in the registry")
  .action(async () => {
    const spinner = ora("Fetching iFlevox UI registry...").start();
    try {
      const registry = await fetchJson<RegistryResponse>(REGISTRY_BASE_URL);
      spinner.succeed(`Available Components (${pc.bold(registry.total)} elements):\n`);

      const grouped: Record<string, RegistryIndexItem[]> = {};
      for (const item of registry.components) {
        if (!grouped[item.categoryName]) grouped[item.categoryName] = [];
        grouped[item.categoryName].push(item);
      }

      for (const [category, items] of Object.entries(grouped)) {
        console.log(pc.magenta(pc.bold(`\n📁 ${category} (${items.length}):`)));
        for (const item of items) {
          const badge = item.isFlagship ? pc.yellow(" ✦ Flagship") : "";
          console.log(`   ${pc.cyan(item.slug.padEnd(32))} ${pc.dim(item.title)}${badge}`);
        }
      }

      console.log(pc.green(`\nRun: `) + pc.cyan(`npx iflevox-ui add <slug>`) + pc.dim(` to install any component.\n`));
    } catch (err: any) {
      spinner.fail(`Failed to fetch registry list: ${err.message}`);
    }
  });

program
  .command("init")
  .description("Initialize iFlevox UI configuration in your project")
  .action(async () => {
    console.log(`\n${pc.magenta(pc.bold("✦ Initializing iFlevox UI"))}\n`);
    const projectRoot = process.cwd();
    ensureCnHelper(projectRoot);

    const configPath = path.join(projectRoot, "iflevox.json");
    const config = {
      $schema: "https://iflevox.uz/schema.json",
      style: "default",
      tailwind: {
        config: fs.existsSync("tailwind.config.ts") ? "tailwind.config.ts" : "tailwind.config.js",
        css: fs.existsSync("src/app/globals.css") ? "src/app/globals.css" : "app/globals.css",
        baseColor: "zinc",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/iflevox",
      },
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
    console.log(pc.green(`  ✓ Created configuration: `) + pc.dim("iflevox.json"));
    console.log(pc.green(`\n🎉 Project initialized successfully!`));
    console.log(pc.dim(`  Try adding a component: npx iflevox-ui add magnetic-button\n`));
  });

program.parse(process.argv);
