import * as vscode from "vscode";
import { TrivuleCompletionProvider } from "./completionProvider";

export function activate(context: vscode.ExtensionContext) {
  const supportedLanguages = [
    "html",
    "php",
    "blade",
    "vue",
    "svelte",
    "astro",
    "ejs",
    "handlebars",
    "mustache",
    "nunjucks",
    "pug",
    "twig",
    "erb",
    "edge",
    "eex",
    "jinja",
    "gotemplate",
  ];

  supportedLanguages.forEach((lang) => {
    const provider = vscode.languages.registerCompletionItemProvider(
      lang,
      new TrivuleCompletionProvider(),
      ":", // Trigger for @v:
      ".", // Trigger for @v:msg.
      "|", // Trigger for chaining rules
      '"', // Trigger for starting attribute value
      "'", // Trigger for starting attribute value
    );

    context.subscriptions.push(provider);
  });
}

export function deactivate() {}
