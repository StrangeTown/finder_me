'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as open from 'open';
import { ExtensionContext, commands, StatusBarItem, window, StatusBarAlignment, Disposable, TextEditor } from 'vscode';


function getDirectoryPath(filePath: string): string {
    let filePathArr = filePath.split('/')
    filePathArr.splice(-1, 1)
    return filePathArr.join('/')
}

const finderCommand: string = 'extension.finderMe'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    let name = new FileName()
    let controller = new FileNameController(name)
    context.subscriptions.push(controller)
    context.subscriptions.push(name)

    let disposable = commands.registerCommand(finderCommand, () => {
        const editor = window.activeTextEditor
        if (!editor) {
            window.showWarningMessage('No active editor.')
            return
        }

        const filePath = editor.document.fileName
        open(getDirectoryPath(filePath), 'Finder')
    });

    context.subscriptions.push(disposable);
}

class FileName {
    private _statusBarItem: StatusBarItem;

    public showFileName() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        const editor = window.activeTextEditor
        if (!editor) {
            this._statusBarItem.hide()
            return
        }

        const filePath = editor.document.fileName
        this._statusBarItem.text = `$(file-symlink-file) ${filePath}`
        this._statusBarItem.tooltip = 'Finder Me'
        this._statusBarItem.command = finderCommand
        this._statusBarItem.show()
    }

    dispose() {
        this._statusBarItem.dispose()
    }
}

class FileNameController {
    private _disposable: Disposable
    private _fileName: FileName

    constructor(fileName: FileName) {
        this._fileName = fileName

        let subscriptions: Disposable[] = []
        this._fileName.showFileName()
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions)
    }
    private _onEvent() {
        this._fileName.showFileName()
    }

    dispose() {
        this._disposable.dispose()
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
