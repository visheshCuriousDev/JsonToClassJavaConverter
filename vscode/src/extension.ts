import * as vscode from 'vscode';
import { faker } from '@faker-js/faker';

export function activate(context: vscode.ExtensionContext) {

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
                } catch (error) {
                    console.error('Error generating JSON:', error);
                    vscode.window.showErrorMessage('Error generating JSON. Check the debug console for more details.');
                }
            } else {
                vscode.window.showWarningMessage('No class name found in the current document.');
            }
        } else {
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
            } catch (error) {
                console.error('Error generating class:', error);
                vscode.window.showErrorMessage('Error generating class. Check the debug console for more details.');
            }
        } else {
            vscode.window.showErrorMessage('No active editor found.');
        }
    });

    context.subscriptions.push(generateJsonCommand);
    context.subscriptions.push(generateClassCommand);
}

// Function to extract the class name from the provided text using regex
function getClassNameFromText(text: string): string {
    // Simple regex to find class name (can be refined further if necessary)
    const match = text.match(/class\s+(\w+)/);
    return match ? match[1] : '';
}

// Function to generate JSON from a DTO (className)
function generateJsonFromDto(className: string): string {
    // Generate a sample JSON based on the class name using faker
    return JSON.stringify({
        className: className,  // Use the className extracted from the document
        age: faker.datatype.number({ min: 18, max: 60 }),  // Random number for age
        email: faker.internet.email(),  // Random email
    }, null, 2);  // Pretty print the JSON
}

// Function to generate a DTO class from the provided JSON
function generateClassFromJson(jsonContent: string): string {
    try {
        const jsonObj = JSON.parse(jsonContent);
        const className = jsonObj.className || 'GeneratedClass';

        // Construct the class definition based on the JSON
        let classString = `class ${className} {\n`;

        // Iterate over JSON object and create class properties
        Object.keys(jsonObj).forEach(key => {
            if (key !== 'className') {
                let type = 'any';  // Default to 'any', can be further refined
                if (typeof jsonObj[key] === 'string') type = 'string';
                if (typeof jsonObj[key] === 'number') type = 'number';
                if (Array.isArray(jsonObj[key])) type = 'Array<any>';
                if (typeof jsonObj[key] === 'boolean') type = 'boolean';

                classString += `  ${key}: ${type};\n`;
            }
        });

        classString += '}\n';

        return classString;
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
}

export function deactivate() {}
