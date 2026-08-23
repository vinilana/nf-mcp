const diagnostic = Object.freeze({
  code: "EXECUTION_FAILED",
  message: "Connector configuration is invalid.",
});

export function reportConnectorConfigurationFailure(error: unknown): boolean {
  if (
    !(error instanceof TypeError) ||
    error.message !== diagnostic.message
  ) {
    return false;
  }
  process.stderr.write(`${JSON.stringify(diagnostic)}\n`);
  process.exitCode = 1;
  return true;
}
