import * as vscode from 'vscode';
import { TrivuleCompletionProvider } from './completionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Trivule VS Code Extension is now active!');

    const provider = vscode.languages.registerCompletionItemProvider(
        'html',
        new TrivuleCompletionProvider(),
        ':', // Trigger for @v:
        '.', // Trigger for @v:msg.
        '|', // Trigger for chaining rules
        '"'  // Trigger for starting attribute value
    );

    context.subscriptions.push(provider);
}

export function deactivate() { }
