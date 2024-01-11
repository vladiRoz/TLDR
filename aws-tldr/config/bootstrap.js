const path = require('path');

// Path to the node_modules directory of your dependencies
const dependenciesPath = path.join(__dirname, './node_modules');

// Set NODE_PATH to include the dependencies directory
process.env.NODE_PATH = `${process.env.NODE_PATH || ''}:${dependenciesPath}`;

// Initialize module paths based on the updated NODE_PATH
require('module').Module._initPaths();

// Now you can import your dependencies
const awsSdk = require('@aws-sdk/client-secrets-manager');
const readability = require('@mozilla/readability');
const domReadability = require('dom-readability');
const domino = require('domino');
const got = require('got');
const jsdom = require('jsdom');
const nodeFetch = require('node-fetch');
