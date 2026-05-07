const DEFAULT_CONFIG = { port: 3000, logLevel: "info" };


function loadConfig(
  config: string | { port: number; logLevel: string }
): { port: number; logLevel: string } {
  if (typeof config === "string") {
    console.log("Loading config from file: " + config);
    return DEFAULT_CONFIG;
  }
  return { ...DEFAULT_CONFIG, ...config };
}


console.log(loadConfig("config.json"));
console.log(loadConfig({ port: 8080 }));
console.log(loadConfig({ port: 8080, logLevel: "debug" }));
console.log(loadConfig({ logLevel: "error" }));
console.log(loadConfig({}));
