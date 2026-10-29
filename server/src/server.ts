/* eslint-disable @typescript-eslint/no-unused-vars */
/** --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
   createConnection,
   TextDocuments,
   Diagnostic,
   DiagnosticSeverity,
   ProposedFeatures,
   InitializeParams,
   DidChangeConfigurationNotification,
   CompletionItem,
   CompletionItemKind,
   TextDocumentPositionParams,
   TextDocumentSyncKind,
   InitializeResult,
   DocumentDiagnosticReportKind,
   type DocumentDiagnosticReport,
   InsertTextFormat
} from 'vscode-languageserver/node';

import {
   TextDocument
} from 'vscode-languageserver-textdocument';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
   const capabilities = params.capabilities;

   // Does the client support the `workspace/configuration` request?
   // If not, we fall back using global settings.
   hasConfigurationCapability = !!(
      capabilities.workspace && !!capabilities.workspace.configuration
   );

   hasWorkspaceFolderCapability = !!(
      capabilities.workspace && !!capabilities.workspace.workspaceFolders
   );

   hasDiagnosticRelatedInformationCapability = !!(
      capabilities.textDocument &&
      capabilities.textDocument.publishDiagnostics &&
      capabilities.textDocument.publishDiagnostics.relatedInformation
   );

   const result: InitializeResult = {
      capabilities: {
         textDocumentSync: TextDocumentSyncKind.Incremental,
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
      connection.client.register(DidChangeConfigurationNotification.type, undefined);
   }

   if (hasWorkspaceFolderCapability) {
      connection.workspace.onDidChangeWorkspaceFolders(_event => {
         connection.console.log('Workspace folder change event received.');
      });
   }
});

// The example settings
interface ExampleSettings {
   maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings = new Map<string, Thenable<ExampleSettings>>();

connection.onDidChangeConfiguration(change => {
   if (hasConfigurationCapability) {
      // Reset all cached document settings
      documentSettings.clear();
   } else {
      globalSettings = (
         (change.settings.languageServerExample || defaultSettings)
      );
   }
   // Refresh the diagnostics since the `maxNumberOfProblems` could have changed.
   // We could optimize things here and re-fetch the setting first can compare it
   // to the existing setting, but this is out of scope for this example.
   connection.languages.diagnostics.refresh();
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
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
         kind: DocumentDiagnosticReportKind.Full,
         items: await validateTextDocument(document)
      } satisfies DocumentDiagnosticReport;
   } else {
      // We don't know the document. We can either try to read it from disk
      // or we don't report problems for it.
      return {
         kind: DocumentDiagnosticReportKind.Full,
         items: []
      } satisfies DocumentDiagnosticReport;
   }
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
   hasDiagnosticRelatedInformationCapability = false;
   validateTextDocument(change.document);
});


// Option B: If you want to keep the diagnostic infrastructure but suppress warnings conditionally:
async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
   const settings = await getDocumentSettings(textDocument.uri);
   const diagnostics: Diagnostic[] = [];

   // Add your real validation logic here in the future.
   // Leaving it empty for now removes all current uppercase warnings.

   return diagnostics;
}
connection.onDidChangeWatchedFiles(_change => {
   // Monitored files have change in VSCode
   connection.console.log('We received a file change event');
});

const TypeKW: CompletionItem[] = [
   {
      label: 'byte',
      kind: CompletionItemKind.Keyword,
      data: 6
   },
   {
      label: 'short',
      kind: CompletionItemKind.Keyword,
      data: 7
   },
   {
      label: 'int',
      kind: CompletionItemKind.Keyword,
      data: 8
   },
   {
      label: 'long',
      kind: CompletionItemKind.Keyword,
      data: 9
   },
   {
      label: 'wide',
      kind: CompletionItemKind.Keyword,
      data: 10
   },
   {
      label: 'ubyte',
      kind: CompletionItemKind.Keyword,
      data: 11
   },
   {
      label: 'ushort',
      kind: CompletionItemKind.Keyword,
      data: 12
   },
   {
      label: 'uint',
      kind: CompletionItemKind.Keyword,
      data: 13
   },
   {
      label: 'ulong',
      kind: CompletionItemKind.Keyword,
      data: 14
   },
   {
      label: 'uwide',
      kind: CompletionItemKind.Keyword,
      data: 15
   },
   {
      label: 'float',
      kind: CompletionItemKind.Keyword,
      data: 16
   },
   {
      label: 'double',
      kind: CompletionItemKind.Keyword,
      data: 17
   },
   {
      label: 'quad',
      kind: CompletionItemKind.Keyword,
      data: 18
   },
   {
      label: 'strview',
      kind: CompletionItemKind.Keyword,
      data: 19
   },
   {
      label: 'char',
      kind: CompletionItemKind.Keyword,
      data: 20
   },
   {
      label: 'bool',
      kind: CompletionItemKind.Keyword,
      data: 21
   },
   {
      label: 'usize',
      kind: CompletionItemKind.Keyword,
      data: 22
   },
   {
      label: 'isize',
      kind: CompletionItemKind.Keyword,
      data: 23
   }
];

const keywordCompletions: CompletionItem[] = [
   {
      label: "import",
      kind: CompletionItemKind.Keyword,
      insertTextFormat: InsertTextFormat.Snippet,
      insertText: "import ${0};",
      detail: "Can be used to import another module",
      data: 24
   },
   {
      label: 'fn',
      kind: CompletionItemKind.Keyword,
      data: 25
   },
   {
      label: 'if',
      kind: CompletionItemKind.Keyword,
      data: 26,
      detail: "Conditional keyword"
   },

   {
      label: 'else',
      kind: CompletionItemKind.Keyword,
      data: 27,
      detail: ""
   },

   {
      label: 'return',
      kind: CompletionItemKind.Keyword,
      data: 28,
      detail: ""
   },

   {
      label: 'struct',
      kind: CompletionItemKind.Keyword,
      data: 29,
      detail: ""
   },

   {
      label: 'true',
      kind: CompletionItemKind.Keyword,
      data: 30,
      detail: ""
   },

   {
      label: 'false',
      kind: CompletionItemKind.Keyword,
      data: 31,
      detail: ""
   },

   {
      label: 'match',
      kind: CompletionItemKind.Keyword,
      data: 32,
      detail: ""
   },

   {
      label: 'class',
      kind: CompletionItemKind.Keyword,
      data: 33,
      detail: ""
   },

   {
      label: 'while',
      kind: CompletionItemKind.Keyword,
      data: 34,
      detail: ""
   },

   {
      label: 'for',
      kind: CompletionItemKind.Keyword,
      data: 35,
      detail: ""
   },

   {
      label: 'in',
      kind: CompletionItemKind.Keyword,
      data: 36,
      detail: ""
   },

   {
      label: 'try',
      kind: CompletionItemKind.Keyword,
      data: 37,
      detail: ""
   },

   {
      label: 'throws',
      kind: CompletionItemKind.Keyword,
      data: 38,
      detail: ""
   },

   {
      label: 'virtual',
      kind: CompletionItemKind.Keyword,
      data: 39,
      detail: ""
   },

   {
      label: 'extends',
      kind: CompletionItemKind.Keyword,
      data: 40,
      detail: ""
   },

   {
      label: 'impl',
      kind: CompletionItemKind.Keyword,
      data: 41,
      detail: ""
   },

   {
      label: 'interface',
      kind: CompletionItemKind.Keyword,
      data: 42,
      detail: ""
   },

   {
      label: 'template',
      kind: CompletionItemKind.Keyword,
      data: 43,
      detail: ""
   },

   {
      label: 'type',
      kind: CompletionItemKind.Keyword,
      data: 44,
      detail: ""
   },

   {
      label: 'unsafe',
      kind: CompletionItemKind.Keyword,
      data: 45,
      detail: ""
   },

   {
      label: 'public',
      kind: CompletionItemKind.Keyword,
      data: 46,
      detail: ""
   },

   {
      label: 'private',
      kind: CompletionItemKind.Keyword,
      data: 47,
      detail: ""
   },

   {
      label: 'protected',
      kind: CompletionItemKind.Keyword,
      data: 48,
      detail: ""
   },

   {
      label: 'as',
      kind: CompletionItemKind.Keyword,
      data: 49,
      detail: ""
   },

   {
      label: 'this',
      kind: CompletionItemKind.Keyword,
      data: 50,
      detail: ""
   },

   {
      label: 'async',
      kind: CompletionItemKind.Keyword,
      data: 51,
      detail: ""
   },

   {
      label: 'await',
      kind: CompletionItemKind.Keyword,
      data: 52,
      detail: ""
   },

   {
      label: 'yield',
      kind: CompletionItemKind.Keyword,
      data: 53,
      detail: ""
   },

   {
      label: 'super',
      kind: CompletionItemKind.Keyword,
      data: 54,
      detail: ""
   },
   {
      label: 'base',
      kind: CompletionItemKind.Keyword,
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
      kind: CompletionItemKind.Keyword,
      data: 56,
      detail: ""
   },

   {
      label: 'case',
      kind: CompletionItemKind.Keyword,
      data: 57,
      detail: ""
   },

   {
      label: 'catch',
      kind: CompletionItemKind.Keyword,
      data: 58,
      detail: ""
   },

   {
      label: 'continue',
      kind: CompletionItemKind.Keyword,
      data: 59,
      detail: ""
   },

   {
      label: 'default',
      kind: CompletionItemKind.Keyword,
      data: 60,
      detail: ""
   },

   {
      label: 'loop',
      kind: CompletionItemKind.Keyword,
      data: 61,
      detail: ""
   },

   {
      label: 'enum',
      kind: CompletionItemKind.Keyword,
      data: 62,
      detail: ""
   },

   {
      label: 'export',
      kind: CompletionItemKind.Keyword,
      data: 63,
      detail: ""
   },

   {
      label: 'part',
      kind: CompletionItemKind.Keyword,
      data: 64,
      detail: ""
   },

   {
      label: 'sealed',
      kind: CompletionItemKind.Keyword,
      data: 65,
      detail: ""
   },

   {
      label: 'set',
      kind: CompletionItemKind.Keyword,
      data: 66,
      detail: ""
   },

   {
      label: 'static',
      kind: CompletionItemKind.Keyword,
      data: 67,
      detail: ""
   },

   {
      label: 'get',
      kind: CompletionItemKind.Keyword,
      data: 68,
      detail: ""
   },

   {
      label: 'extern',
      kind: CompletionItemKind.Keyword,
      data: 69,
      detail: ""
   },

   {
      label: 'operator',
      kind: CompletionItemKind.Keyword,
      data: 70,
      detail: ""
   },

   {
      label: 'factory',
      kind: CompletionItemKind.Keyword,
      data: 71,
      detail: ""
   },

   {
      label: 'error',
      kind: CompletionItemKind.Keyword,
      data: 72,
      detail: ""
   },
   {
      label: 'partial',
      kind: CompletionItemKind.Keyword,
      data: 73,
      detail: ""
   },

   {
      label: 'do',
      kind: CompletionItemKind.Keyword,
      data: 74,
      detail: ""
   },
   {
      label: 'eval',
      kind: CompletionItemKind.Keyword,
      data: 75,
      detail: ""
   },
   {
      label: 'of',
      kind: CompletionItemKind.Keyword,
      data: 76,
      detail: ""
   },
   {
      label: 'defer',
      kind: CompletionItemKind.Keyword,
      data: 77,
      detail: ""
   },
   {
      label: 'volatile',
      kind: CompletionItemKind.Keyword,
      data: 78,
      detail: ""
   },
   {
      label: 'copy',
      kind: CompletionItemKind.Keyword,
      data:79 ,
      detail: ""
   },
   {
      label: 'move',
      kind: CompletionItemKind.Keyword,
      data: 80,
      detail: ""
   },
   {
      label: 'null',
      kind: CompletionItemKind.Keyword,
      data: 81,
      detail: ""
   },

];


// This handler provides the initial list of the completion items.
connection.onCompletion(
   (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
      // The pass parameter contains the position of the text document in
      // which code complete got requested. For the example we ignore this
      // info and always provide the same completion items.

      const completions: CompletionItem[] = [
         {
            label: 'var',
            kind: CompletionItemKind.Keyword,
            data: 1,
            detail: ""
         },
         {
            label: 'final',
            kind: CompletionItemKind.Keyword,
            data: 2
         },
         {
            label: 'const',
            kind: CompletionItemKind.Keyword,
            data: 3
         },
         {
            label: 'static',
            kind: CompletionItemKind.Keyword,
            data: 4
         },
         // {
         //    label: '',
         //    kind: CompletionItemKind.Keyword,
         //    data: 77
         // },
      ];
      return mergeArrays(completions, TypeKW, keywordCompletions);
   }
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
   (item: CompletionItem): CompletionItem => {
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
   }
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();


function mergeArrays<T>(...arrays: T[][]) {
   return ([] as T[]).concat(...arrays);
}
