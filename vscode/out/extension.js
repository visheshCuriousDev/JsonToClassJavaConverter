"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const faker_1 = require("@faker-js/faker");
function activate(context) {
    // Command to generate JSON from a DTO class
    let generateJsonCommand = vscode.commands.registerCommand('extension.generateJsonFromDto', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const doc = editor.document;
            const className = getClassNameFromText(doc.getText());
            if (className) {
                try {
                    const json = generateJsonFromDto(className);
                    vscode.window.showInformationMessage(`Generated JSON: ${json}`);
                }
                catch (error) {
                    console.error('Error generating JSON:', error);
                    vscode.window.showErrorMessage('Error generating JSON. Check the debug console for more details.');
                }
            }
            else {
                vscode.window.showWarningMessage('No class name found in the current document.');
            }
        }
        else {
            vscode.window.showErrorMessage('No active editor found.');
        }
    });
    // Command to generate DTO class from a JSON string
    let generateClassCommand = vscode.commands.registerCommand('extension.generateClassFromJson', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const doc = editor.document;
            const jsonContent = doc.getText();
            try {
                const classString = generateClassFromJson(jsonContent);
                vscode.window.showInformationMessage(`Generated Class: ${classString}`);
            }
            catch (error) {
                console.error('Error generating class:', error);
                vscode.window.showErrorMessage('Error generating class. Check the debug console for more details.');
            }
        }
        else {
            vscode.window.showErrorMessage('No active editor found.');
        }
    });
    context.subscriptions.push(generateJsonCommand);
    context.subscriptions.push(generateClassCommand);
}
exports.activate = activate;
// Function to extract the class name from the provided text using regex
function getClassNameFromText(text) {
    // Simple regex to find class name (can be refined further if necessary)
    const match = text.match(/class\s+(\w+)/);
    return match ? match[1] : '';
}
// Function to generate JSON from a DTO (className)
function generateJsonFromDto(className) {
    // Generate a sample JSON based on the class name using faker
    return JSON.stringify({
        className: className,
        age: faker_1.faker.datatype.number({ min: 18, max: 60 }),
        email: faker_1.faker.internet.email(), // Random email
    }, null, 2); // Pretty print the JSON
}
// Function to generate a DTO class from the provided JSON
function generateClassFromJson(jsonContent) {
    try {
        const jsonObj = JSON.parse(jsonContent);
        const className = jsonObj.className || 'GeneratedClass';
        // Construct the class definition based on the JSON
        let classString = `class ${className} {\n`;
        // Iterate over JSON object and create class properties
        Object.keys(jsonObj).forEach(key => {
            if (key !== 'className') {
                let type = 'any'; // Default to 'any', can be further refined
                if (typeof jsonObj[key] === 'string')
                    type = 'string';
                if (typeof jsonObj[key] === 'number')
                    type = 'number';
                if (Array.isArray(jsonObj[key]))
                    type = 'Array<any>';
                if (typeof jsonObj[key] === 'boolean')
                    type = 'boolean';
                classString += `  ${key}: ${type};\n`;
            }
        });
        classString += '}\n';
        return classString;
    }
    catch (error) {
        throw new Error('Invalid JSON format');
    }
}
function deactivate() { }
exports.deactivate = deactivate;
