"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/** --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager.
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true
            },
            diagnosticProvider: {
                interFileDependencies: false,
                workspaceDiagnostics: false
            }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
const documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.languageServerExample || defaultSettings));
    }
    // Refresh the diagnostics since the `maxNumberOfProblems` could have changed.
    // We could optimize things here and re-fetch the setting first can compare it
    // to the existing setting, but this is out of scope for this example.
    connection.languages.diagnostics.refresh();
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'languageServerExample'
        });
        documentSettings.set(resource, result);
    }
    return result;
}
// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});
connection.languages.diagnostics.on(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (document !== undefined) {
        return {
            kind: node_1.DocumentDiagnosticReportKind.Full,
            items: await validateTextDocument(document)
        };
    }
    else {
        // We don't know the document. We can either try to read it from disk
        // or we don't report problems for it.
        return {
            kind: node_1.DocumentDiagnosticReportKind.Full,
            items: []
        };
    }
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    hasDiagnosticRelatedInformationCapability = false;
    validateTextDocument(change.document);
});
// Option B: If you want to keep the diagnostic infrastructure but suppress warnings conditionally:
async function validateTextDocument(textDocument) {
    const settings = await getDocumentSettings(textDocument.uri);
    const diagnostics = [];
    // Add your real validation logic here in the future.
    // Leaving it empty for now removes all current uppercase warnings.
    return diagnostics;
}
connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received a file change event');
});
const TypeKW = [
    {
        label: 'byte',
        kind: node_1.CompletionItemKind.Keyword,
        data: 6
    },
    {
        label: 'short',
        kind: node_1.CompletionItemKind.Keyword,
        data: 7
    },
    {
        label: 'int',
        kind: node_1.CompletionItemKind.Keyword,
        data: 8
    },
    {
        label: 'long',
        kind: node_1.CompletionItemKind.Keyword,
        data: 9
    },
    {
        label: 'wide',
        kind: node_1.CompletionItemKind.Keyword,
        data: 10
    },
    {
        label: 'ubyte',
        kind: node_1.CompletionItemKind.Keyword,
        data: 11
    },
    {
        label: 'ushort',
        kind: node_1.CompletionItemKind.Keyword,
        data: 12
    },
    {
        label: 'uint',
        kind: node_1.CompletionItemKind.Keyword,
        data: 13
    },
    {
        label: 'ulong',
        kind: node_1.CompletionItemKind.Keyword,
        data: 14
    },
    {
        label: 'uwide',
        kind: node_1.CompletionItemKind.Keyword,
        data: 15
    },
    {
        label: 'float',
        kind: node_1.CompletionItemKind.Keyword,
        data: 16
    },
    {
        label: 'double',
        kind: node_1.CompletionItemKind.Keyword,
        data: 17
    },
    {
        label: 'quad',
        kind: node_1.CompletionItemKind.Keyword,
        data: 18
    },
    {
        label: 'strview',
        kind: node_1.CompletionItemKind.Keyword,
        data: 19
    },
    {
        label: 'char',
        kind: node_1.CompletionItemKind.Keyword,
        data: 20
    },
    {
        label: 'bool',
        kind: node_1.CompletionItemKind.Keyword,
        data: 21
    },
    {
        label: 'usize',
        kind: node_1.CompletionItemKind.Keyword,
        data: 22
    },
    {
        label: 'isize',
        kind: node_1.CompletionItemKind.Keyword,
        data: 23
    }
];
const keywordCompletions = [
    {
        label: "import",
        kind: node_1.CompletionItemKind.Keyword,
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: "import ${0};",
        detail: "Can be used to import another module",
        data: 24
    },
    {
        label: 'fn',
        kind: node_1.CompletionItemKind.Keyword,
        data: 25
    },
    {
        label: 'if',
        kind: node_1.CompletionItemKind.Keyword,
        data: 26,
        detail: "Conditional keyword"
    },
    {
        label: 'else',
        kind: node_1.CompletionItemKind.Keyword,
        data: 27,
        detail: ""
    },
    {
        label: 'return',
        kind: node_1.CompletionItemKind.Keyword,
        data: 28,
        detail: ""
    },
    {
        label: 'struct',
        kind: node_1.CompletionItemKind.Keyword,
        data: 29,
        detail: ""
    },
    {
        label: 'true',
        kind: node_1.CompletionItemKind.Keyword,
        data: 30,
        detail: ""
    },
    {
        label: 'false',
        kind: node_1.CompletionItemKind.Keyword,
        data: 31,
        detail: ""
    },
    {
        label: 'match',
        kind: node_1.CompletionItemKind.Keyword,
        data: 32,
        detail: ""
    },
    {
        label: 'class',
        kind: node_1.CompletionItemKind.Keyword,
        data: 33,
        detail: ""
    },
    {
        label: 'while',
        kind: node_1.CompletionItemKind.Keyword,
        data: 34,
        detail: ""
    },
    {
        label: 'for',
        kind: node_1.CompletionItemKind.Keyword,
        data: 35,
        detail: ""
    },
    {
        label: 'in',
        kind: node_1.CompletionItemKind.Keyword,
        data: 36,
        detail: ""
    },
    {
        label: 'try',
        kind: node_1.CompletionItemKind.Keyword,
        data: 37,
        detail: ""
    },
    {
        label: 'throws',
        kind: node_1.CompletionItemKind.Keyword,
        data: 38,
        detail: ""
    },
    {
        label: 'virtual',
        kind: node_1.CompletionItemKind.Keyword,
        data: 39,
        detail: ""
    },
    {
        label: 'extends',
        kind: node_1.CompletionItemKind.Keyword,
        data: 40,
        detail: ""
    },
    {
        label: 'impl',
        kind: node_1.CompletionItemKind.Keyword,
        data: 41,
        detail: ""
    },
    {
        label: 'interface',
        kind: node_1.CompletionItemKind.Keyword,
        data: 42,
        detail: ""
    },
    {
        label: 'template',
        kind: node_1.CompletionItemKind.Keyword,
        data: 43,
        detail: ""
    },
    {
        label: 'type',
        kind: node_1.CompletionItemKind.Keyword,
        data: 44,
        detail: ""
    },
    {
        label: 'unsafe',
        kind: node_1.CompletionItemKind.Keyword,
        data: 45,
        detail: ""
    },
    {
        label: 'public',
        kind: node_1.CompletionItemKind.Keyword,
        data: 46,
        detail: ""
    },
    {
        label: 'private',
        kind: node_1.CompletionItemKind.Keyword,
        data: 47,
        detail: ""
    },
    {
        label: 'protected',
        kind: node_1.CompletionItemKind.Keyword,
        data: 48,
        detail: ""
    },
    {
        label: 'as',
        kind: node_1.CompletionItemKind.Keyword,
        data: 49,
        detail: ""
    },
    {
        label: 'this',
        kind: node_1.CompletionItemKind.Keyword,
        data: 50,
        detail: ""
    },
    {
        label: 'async',
        kind: node_1.CompletionItemKind.Keyword,
        data: 51,
        detail: ""
    },
    {
        label: 'await',
        kind: node_1.CompletionItemKind.Keyword,
        data: 52,
        detail: ""
    },
    {
        label: 'yield',
        kind: node_1.CompletionItemKind.Keyword,
        data: 53,
        detail: ""
    },
    {
        label: 'super',
        kind: node_1.CompletionItemKind.Keyword,
        data: 54,
        detail: ""
    },
    {
        label: 'base',
        kind: node_1.CompletionItemKind.Keyword,
        data: 54,
        detail: ""
    },
    // {
    //    label: 'abstract',
    //    kind: CompletionItemKind.Keyword,
    //    data: 55,
    //    detail: ""
    // },
    {
        label: 'break',
        kind: node_1.CompletionItemKind.Keyword,
        data: 56,
        detail: ""
    },
    {
        label: 'case',
        kind: node_1.CompletionItemKind.Keyword,
        data: 57,
        detail: ""
    },
    {
        label: 'catch',
        kind: node_1.CompletionItemKind.Keyword,
        data: 58,
        detail: ""
    },
    {
        label: 'continue',
        kind: node_1.CompletionItemKind.Keyword,
        data: 59,
        detail: ""
    },
    {
        label: 'default',
        kind: node_1.CompletionItemKind.Keyword,
        data: 60,
        detail: ""
    },
    {
        label: 'loop',
        kind: node_1.CompletionItemKind.Keyword,
        data: 61,
        detail: ""
    },
    {
        label: 'enum',
        kind: node_1.CompletionItemKind.Keyword,
        data: 62,
        detail: ""
    },
    {
        label: 'export',
        kind: node_1.CompletionItemKind.Keyword,
        data: 63,
        detail: ""
    },
    {
        label: 'part',
        kind: node_1.CompletionItemKind.Keyword,
        data: 64,
        detail: ""
    },
    {
        label: 'sealed',
        kind: node_1.CompletionItemKind.Keyword,
        data: 65,
        detail: ""
    },
    {
        label: 'set',
        kind: node_1.CompletionItemKind.Keyword,
        data: 66,
        detail: ""
    },
    {
        label: 'static',
        kind: node_1.CompletionItemKind.Keyword,
        data: 67,
        detail: ""
    },
    {
        label: 'get',
        kind: node_1.CompletionItemKind.Keyword,
        data: 68,
        detail: ""
    },
    {
        label: 'extern',
        kind: node_1.CompletionItemKind.Keyword,
        data: 69,
        detail: ""
    },
    {
        label: 'operator',
        kind: node_1.CompletionItemKind.Keyword,
        data: 70,
        detail: ""
    },
    {
        label: 'factory',
        kind: node_1.CompletionItemKind.Keyword,
        data: 71,
        detail: ""
    },
    {
        label: 'error',
        kind: node_1.CompletionItemKind.Keyword,
        data: 72,
        detail: ""
    },
    {
        label: 'partial',
        kind: node_1.CompletionItemKind.Keyword,
        data: 73,
        detail: ""
    },
    {
        label: 'do',
        kind: node_1.CompletionItemKind.Keyword,
        data: 74,
        detail: ""
    },
    {
        label: 'eval',
        kind: node_1.CompletionItemKind.Keyword,
        data: 75,
        detail: ""
    },
    {
        label: 'of',
        kind: node_1.CompletionItemKind.Keyword,
        data: 76,
        detail: ""
    },
    {
        label: 'defer',
        kind: node_1.CompletionItemKind.Keyword,
        data: 77,
        detail: ""
    },
    {
        label: 'volatile',
        kind: node_1.CompletionItemKind.Keyword,
        data: 78,
        detail: ""
    },
    {
        label: 'copy',
        kind: node_1.CompletionItemKind.Keyword,
        data: 79,
        detail: ""
    },
    {
        label: 'move',
        kind: node_1.CompletionItemKind.Keyword,
        data: 80,
        detail: ""
    },
    {
        label: 'null',
        kind: node_1.CompletionItemKind.Keyword,
        data: 81,
        detail: ""
    },
];
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    const completions = [
        {
            label: 'var',
            kind: node_1.CompletionItemKind.Keyword,
            data: 1,
            detail: ""
        },
        {
            label: 'final',
            kind: node_1.CompletionItemKind.Keyword,
            data: 2
        },
        {
            label: 'const',
            kind: node_1.CompletionItemKind.Keyword,
            data: 3
        },
        {
            label: 'static',
            kind: node_1.CompletionItemKind.Keyword,
            data: 4
        },
        // {
        //    label: '',
        //    kind: CompletionItemKind.Keyword,
        //    data: 77
        // },
    ];
    return mergeArrays(completions, TypeKW, keywordCompletions);
});
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    switch (item.label) {
        case 'var':
            item.detail = "Can be used to declare a variable without specifying its type";
            break;
        // case '':
        // 	item.detail = "";
        // 	break;
        default:
            break;
    }
    return item;
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
function mergeArrays(...arrays) {
    return [].concat(...arrays);
}
//# sourceMappingURL=server.js.map