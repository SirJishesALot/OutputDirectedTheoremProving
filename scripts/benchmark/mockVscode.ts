// Mock vscode module for headless CLI execution
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Module = require('module');

const mockVscode = {
    window: {
        activeTextEditor: undefined,
        visibleTextEditors: [],
        createOutputChannel: () => ({
            appendLine: () => {},
            append: () => {},
            show: () => {},
            clear: () => {},
            dispose: () => {},
        }),
        showInformationMessage: async () => undefined,
        showWarningMessage: async () => undefined,
        showErrorMessage: async () => undefined,
    },
    workspace: {
        getConfiguration: () => ({
            get: (_key: string, defaultValue: any) => defaultValue,
        }),
    },
    Uri: {
        file: (path: string) => ({ fsPath: path, path, scheme: 'file', toString: () => path }),
        parse: (uriStr: string) => ({ fsPath: uriStr, path: uriStr, scheme: 'file', toString: () => uriStr }),
    },
    Range: class {
        constructor(public startLine: number, public startChar: number, public endLine: number, public endChar: number) {}
    },
    Position: class {
        constructor(public line: number, public character: number) {}
    },
    CancellationTokenSource: class {
        token = { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => {} }) };
        cancel() { (this.token as any).isCancellationRequested = true; }
        dispose() {}
    },
};

const origLoad = Module._load;
Module._load = function (request: string, parent: any, isMain: boolean) {
    if (request === 'vscode') {
        return mockVscode;
    }
    return origLoad.apply(this, arguments);
};

export { mockVscode };
