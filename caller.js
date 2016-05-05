var callsite = require('callsite');

module.exports = function () {
    return callsite()[6].getFileName();
};