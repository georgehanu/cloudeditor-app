const trace = () => {
  const e = new Error("dummy");
  return e.stack
    .replace(/^[^(]+?[\n$]/gm, "")
    .replace(/^\s+at\s+/gm, "")
    .replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@")
    .split("\n");
};

const disable = true;

class Logger {
  /**
   * Logs a warning. Warnings are things that are exceptional, but easily to recover from.
   */
  warn(...args) {
    if (!disable) console.warn("Warning:", ...args);
  }

  /**
   * Logs a debug message. Debug messages are things that help developers debugging things.
   */
  debug(...args) {
    if (!disable) console.log("Debug:", ...args);
  }

  /**
   * Logs an info. Infos are things that might be interesting for someone who needs to take a closer look.
   */
  info(...args) {
    if (!disable) console.log("Info:", ...args);
  }

  /**
   * Logs an error. Error are things that are exceptional, but can be recovered from.
   */
  error(...args) {
    if (!disable) {
      console.error("Error:", ...args);
      console.error("Trace:", trace());
    }
  }

  /**
   * Logs a fatal error. Fatal errors are things that are exceptional and can not be recovered from.
   */
  fatal(...args) {
    if (!disable) {
      console.error("Fatal:", ...args);
      console.error("Trace:", trace());
      throw new Error(args.join(" "));
    }
  }

  /**
   * Logs a message.
   */
  log(...args) {
    if (!disable) {
      console.log("Fatal:", ...args);
      console.log("Trace:", trace());
    }
  }
}

const instance = new Logger();

module.exports = instance;
