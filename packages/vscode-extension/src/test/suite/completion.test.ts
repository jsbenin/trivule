import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Completion Test Suite', () => {
    async function getCompletions(content: string, position: vscode.Position) {
        const doc = await vscode.workspace.openTextDocument({
            content: content,
            language: 'html'
        });
        const editor = await vscode.window.showTextDocument(doc);

        await new Promise(r => setTimeout(r, 500));

        const list = (await vscode.commands.executeCommand(
            'vscode.executeCompletionItemProvider',
            doc.uri,
            position
        )) as vscode.CompletionList;

        return list ? list.items.map(i => i.label) : [];
    }

    test('Attribute completion', async () => {
        const items = await getCompletions('<input @v:', new vscode.Position(0, 10));

        assert.ok(items.includes('rules'), `Expected 'rules' in ${JSON.stringify(items)}`);
        assert.ok(items.includes('feedback'));
        assert.ok(items.includes('events'));
    });

    test('Rules completion', async () => {
        const items = await getCompletions('<input @v:rules="', new vscode.Position(0, 17));
        assert.ok(items.includes('required'));
    });

    test('Events completion', async () => {
        const items = await getCompletions('<input @v:events="', new vscode.Position(0, 18));
        assert.ok(items.includes('blur'));
    });
});
