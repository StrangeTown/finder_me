'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as open from 'open';
import {ExtensionContext, commands, StatusBarItem, workspace, window, StatusBarAlignment, Disposable} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "finder-me" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

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
        this._statusBarItem.text = filePath
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
