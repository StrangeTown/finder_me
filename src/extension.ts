'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as open from 'open';
import {ExtensionContext, commands, StatusBarItem, workspace, window, StatusBarAlignment, Disposable} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    let name = new FileName()
    let controller = new FileNameController(name)
    context.subscriptions.push(controller)
    context.subscriptions.push(name)

    let disposable = commands.registerCommand('extension.finderMe', () => {
        // The code you place here will be executed every time your command is executed

        var folders = workspace.workspaceFolders
        if (!folders) {
            window.showWarningMessage('Not open in a folder.')
            return
        } 
        var path = folders[0].uri.path
        open(folders[0].uri.path, 'Finder')
    });

    context.subscriptions.push(disposable);
}

class FileName {
    private _statusBarItem: StatusBarItem;

    public showFileName() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        let editor = window.activeTextEditor
        if (!editor) {
            this._statusBarItem.hide()
            return
        }

        let filePath = editor.document.fileName
        this._statusBarItem.text = `$(file-symlink-file) ${filePath}`
        this._statusBarItem.tooltip = 'Finder Me'
        this._statusBarItem.command = 'extension.finderMe'
        this._statusBarItem.show()
    }

    dispose() {
        this._statusBarItem.dispose()
    }
}

class FileNameController {
    private _disposable: Disposable

    constructor(fileName: FileName) {
        fileName.showFileName()
    }

    dispose() {
        this._disposable.dispose()
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
