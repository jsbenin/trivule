import * as vscode from 'vscode';
import { TRIVULE_ATTRIBUTES, TRIVULE_EVENTS, TRIVULE_RULES } from './data';

export class TrivuleCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);

        if (linePrefix.endsWith('@v:')) {
            return this.getAttributeCompletions();
        }

        const eventsMatch = linePrefix.match(/@v:events="([^"]*)$/);
        if (eventsMatch) {
            const currentEvents = eventsMatch[1];
            if (currentEvents.endsWith('|') || currentEvents === '') {
                return this.getEventCompletions();
            }
        }

        const rulesMatch = linePrefix.match(/@v:rules="([^"]*)$/);
        if (rulesMatch) {
            const currentRules = rulesMatch[1];
            if (currentRules.endsWith('|') || currentRules === '') {
                return this.getRuleCompletions();
            }
        }

        if (linePrefix.endsWith('@v:msg.')) {
            const rules = this.getRulesFromCurrentTag(document, position);
            if (rules.length > 0) {
                return this.getRuleCompletions(rules);
            }
            return this.getRuleCompletions();
        }

        return undefined;
    }

    private getAttributeCompletions(): vscode.CompletionItem[] {
        return TRIVULE_ATTRIBUTES.map(attr => {
            const item = new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property);
            item.detail = `Trivule attribute: @v:${attr}`;
            if (attr === 'rules') {
                item.insertText = new vscode.SnippetString('rules="$1"');
            } else if (attr === 'feedback') {
                item.insertText = new vscode.SnippetString('feedback="$1"');
            }
            return item;
        });
    }

    private getEventCompletions(): vscode.CompletionItem[] {
        return TRIVULE_EVENTS.map(event => {
            const item = new vscode.CompletionItem(event, vscode.CompletionItemKind.Method);
            item.detail = `Trivule event: @v:${event}`;
            return item;
        });
    }

    private getRuleCompletions(filterRules?: string[]): vscode.CompletionItem[] {
        const rules = filterRules
            ? TRIVULE_RULES.filter(r => filterRules.includes(r))
            : TRIVULE_RULES;

        return rules.map(rule => {
            const item = new vscode.CompletionItem(rule, vscode.CompletionItemKind.Value);
            item.detail = `Trivule rule: ${rule}`;
            return item;
        });
    }

    private getRulesFromCurrentTag(document: vscode.TextDocument, position: vscode.Position): string[] {
        const text = document.getText();
        const offset = document.offsetAt(position);

        const startSearch = Math.max(0, offset - 2000);
        const endSearch = Math.min(text.length, offset + 2000);

        const before = text.substring(startSearch, offset);
        const after = text.substring(offset, endSearch);

        const lastOpenTag = before.lastIndexOf('<');
        if (lastOpenTag === -1) {
            return [];
        }

        const nextCloseTag = after.indexOf('>');
        if (nextCloseTag === -1) {
            return [];
        }

        const tagContent = before.substring(lastOpenTag) + after.substring(0, nextCloseTag);

        const match = tagContent.match(/@v:rules="([^"]*)"/);
        if (match) {
            return match[1].split('|').map(r => r.split(':')[0].trim()).filter(r => r);
        }

        return [];
    }
}
