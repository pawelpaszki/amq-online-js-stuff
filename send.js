// const util = require('util')
var container = require('rhea');

var args = require('./options.js').options({
  'u': {alias : 'username', default: 'developer', describe: 'username for messaging'},
  'k': {alias: 'password', default: 'pwd', describe: 'password for messaging'},
  'm': { alias: 'messages', default: 5, describe: 'number of messages to send'},
  'n': { alias: 'node', default: 'queue1', describe: 'name of node (e.g. queue) to which messages are sent'},
  'h': { alias: 'host', default: 'messaging-uxufcfwkss-enmasse-infra.192.168.99.100.nip.io', describe: 'dns or ip name of server where you want to connect'},
  'p': { alias: 'port', default: 443, describe: 'port to connect to'}
}).help('help').argv;

var confirmed = 0, sent = 0;
var total = args.messages;

container.on('sendable', function (context) {
    while (context.sender.sendable() && sent < total) {
        sent++;
        console.log('sent ' + sent);
        context.sender.send({message_id:sent, body:{'sequence':sent}, durable: true})
    }
});
container.on('accepted', function (context) {
    if (++confirmed === total) {
        console.log('all messages confirmed');
        context.connection.close();
    }
});

container.on('disconnected', function (context) {
  if (context.error) console.error('%s %j', context.error, context.error);
  sent = confirmed;
});

container.on('connection_open', function (context) {
  console.log('Connected')
});

container.on('sender_open', function (context) {
  console.log('Sender Open')
});

container.connect({username:args.username, password:args.password, port:args.port, host:args.host, transport:'tls', rejectUnauthorized:false, reconnect:false}).open_sender(args.node);
