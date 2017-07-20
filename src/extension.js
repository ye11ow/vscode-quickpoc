const vscode = require('vscode');
const Window = vscode.window;
const Range = vscode.Range;

class TerminalManager {
    constructor() {
        this._terminal = null;
        Window.onDidCloseTerminal(_term => {
            if (this._terminal) {

                // seems not nessesary to check the processId.
                if (this._terminal.processId === _term.processId) {
                    this._terminal = null;
                }
            }
        });
    }

    initTerminal() {
        let filetype = this.detectType();

        if (!this._terminal) {
            let terminal = Window.createTerminal({
                name: filetype
            });

            terminal.sendText('node');
            terminal.show();

            this._terminal = terminal;
        }

        return this._terminal;
    }

    getTerminal() {
        if (!this._terminal) {
            this._terminal = this.initTerminal();
        }

        return this._terminal;
    }

    detectType() {
        return 'node';
    }

    runCode(code) {
        this.getTerminal().sendText(code);
    }
}

function activate(context) {

    console.log('Congratulations, your extension "quickpoc" is now active!');
    let tm = new TerminalManager();

    let disposable = vscode.commands.registerCommand('extension.runPoC', function() {
        if (!Window.activeTextEditor) {
            return;
        }

        let editor = Window.activeTextEditor;
        let doc = editor.document;
        let selections = editor.selections;

        if (selections && selections.length > 0) {
            let rawCode = selections.map(sel => {
                return doc.getText(new Range(sel.start, sel.end));
            });

            console.log(rawCode);

            rawCode.forEach(code => {
                tm.runCode(code);
            });
        }

        // Window.showInformationMessage('Running!');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;