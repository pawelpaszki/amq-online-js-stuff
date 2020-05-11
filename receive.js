var container = require('rhea');

var args = require('./options.js').options({
    'u': {alias : 'username', default: 'developer', describe: 'username for messaging'},
    'k': {alias: 'password', default: 'pwd', describe: 'password for messaging'},
    'm': { alias: 'messages', default: 5, describe: 'number of messages to send'},
    'n': { alias: 'node', default: 'queue1', describe: 'name of node (e.g. queue) to which messages are sent'},
    'h': { alias: 'host', default: 'messaging-uxufcfwkss-enmasse-infra.192.168.99.100.nip.io', describe: 'dns or ip name of server where you want to connect'},
    'p': { alias: 'port', default: 443, describe: 'port to connect to'}
}).help('help').argv;

var received = 0;
var expected = args.messages;

container.on('message', function (context) {
    if (context.message.id && context.message.id < received) {
        // ignore duplicate message
        console.log("Duplicate")
        return;
    }
    if (expected === 0 || received < expected) {
        console.log(JSON.stringify(context.message));
        if (++received === expected) {
            console.log("All messages received")
            context.receiver.detach();
            context.connection.close();
        }
    }
});

container.connect({username:args.username, password:args.password, port:args.port, host:args.host, transport:'tls', rejectUnauthorized:false, reconnect:false}).open_receiver(args.node);

