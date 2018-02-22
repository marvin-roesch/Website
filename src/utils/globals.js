const userUtils = require('./userUtils');
const dateFormat = require('dateformat');
const marked = require('marked');
const highlightjs = require('highlight.js');

const env = process.env.BUILD_ENV || 'dev';

module.exports = {
    publicFolder: () => {
        if (env === 'dev') {
            return 'http://localhost:1234';
        } else if (env === 'staging') {
            return 'https://dev.diluv.io';
        }
        return 'https://download.nodecdn.net/containers/diluv';
    },
    /**
     * Returns the endpoint for the current build type
     * @returns {string} The endpoint for the build type, either dev, staging or production
     */
    endPoint: () => {
        if (env === 'dev') {
            return 'http://localhost:8080/v1';
        } else if (env === 'staging') {
            return 'https://api.diluv.io/v1';
        }
        return 'http://api.diluv.com/v1';
    },

    hasProjectPermission(permission, type) {
        return permission != null && ((1 << type) & permission) > 0;
    },

    hasUserPermission(permission, type) {
        if (!userUtils.isUserLoggedIn()) {
            return false;
        }
        return permission != null && ((1 << type) & permission) > 0;
    },

    PROJECT_PERMISSION: {
        EDIT_DESCRIPTION: 1,
        EDIT_SETTINGS: 2,
        ADD_USER: 4,

        UPLOAD_FILE: 30,
    },

    getDate(epoch) {
        return dateFormat(new Date(epoch), 'HH:mm:ss dd/mm/yyyy');
    },

    parseMarkdown(data) {
        marked.setOptions({
            sanitize: true,
            highlight(code) {
                return highlightjs.highlightAuto(code).value;
            },
        });
        return marked(data);
    },
};

