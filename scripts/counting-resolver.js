// Wraps Jest's default resolver and counts unique resolved files per @mui package.
// Use with --runInBand so the count covers the whole run in one process.
const seen = new Set();

process.on("exit", () => {
  const counts = {};
  for (const f of seen) {
    const pkg = f.match(/node_modules\/(@mui\/[^/]+)\//)[1];
    counts[pkg] = (counts[pkg] || 0) + 1;
  }
  console.log("modules loaded:", JSON.stringify(counts));
});

module.exports = (request, options) => {
  const resolved = options.defaultResolver(request, options);
  if (/node_modules\/@mui\//.test(resolved)) seen.add(resolved);
  return resolved;
};
