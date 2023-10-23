# Getting Started with Node.js, Playwright, and Azure Key Vault

This guide will walk you through the installation of Node.js using nvm and npm, setting up Playwright, and configuring Azure Key Vault dependencies for accessing secrets.

## Prerequisites

Before you begin, make sure you have the following:

1. [Visual Studio Code](https://code.visualstudio.com/) installed on your machine.

## Installing Node.js using nvm and npm

1. **Install nvm (Node Version Manager)**:

   Follow the instructions provided by Microsoft's official documentation for installing Node.js on Windows using nvm:

   - Open your browser and navigate to the [Node.js on Windows documentation](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).

   - Follow the steps mentioned under the "Install Node.js with the Node Version Manager (NVM) on Windows" section to download and install nvm on Windows.

   - After installing nvm, restart your terminal or Visual Studio Code to start using nvm.

2. **Install Node.js**:

   - Open your terminal (or Visual Studio Code terminal) and run the following command to install the latest LTS version of Node.js using nvm:

     ```bash
     nvm install --lts
     ```

   - To use the installed version, run:

     ```bash
     nvm use --lts
     ```

   Now you have Node.js and npm installed on your system.

## Installing Playwright

1. **Install Playwright**:

   - Open your terminal in Visual Studio Code and run the following command to install Playwright as a dev dependency in your project:

     ```bash
     npm install playwright --save-dev
     ```

   - Now, you can use Playwright in your project to automate browsers.

## Configuring Azure Key Vault Dependencies

1. **Install Azure Key Vault dependencies**:

   To work with Azure Key Vault, you need to install the Azure SDK for JavaScript and the Azure Identity package.

   - Open your terminal in Visual Studio Code and run the following command to install the required dependencies:

     ```bash
     npm install @azure/identity @azure/keyvault-secrets --save
     ```

2. **Perform Azure login**:

   Before accessing the Azure Key Vault, you need to log in to your Azure account using the Azure CLI.

   - Open your terminal in Visual Studio Code and run the following command to log in:

     ```bash
     az login
     ```

   Follow the instructions in the browser to authenticate your Azure account.

   Once you've logged in successfully, you can access secrets from the Azure Key Vault using the Azure SDK for JavaScript.

Congratulations! You've now set up Node.js with npm, Playwright, and the necessary dependencies to work with Azure Key Vault. You can start building applications and automating browser tasks using Playwright, and securely access secrets from the Azure Key Vault in your projects. Happy coding! 🚀
