const util = require('util')
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
        context.sender.send({message_id:sent, body:{'sequence':sent, 'message':foo}, durable: true})
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


var foo = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet augue auctor, vehicula augue in, molestie libero. Pellentesque blandit odio et tortor lacinia euismod. Nullam commodo lacus ut dolor iaculis, ut tincidunt ex dictum. Sed id leo id ex ultrices tristique eu eget massa. Sed luctus eros at velit pharetra consectetur. Cras lorem sapien, feugiat sollicitudin enim vitae, porta tristique dui. Nam suscipit nisi quis dignissim lacinia. Duis vitae nisl nec tortor facilisis gravida lacinia nec lacus. Nam augue ipsum, viverra sed tempus id, dictum eget libero. Quisque dapibus nibh vitae turpis rutrum, in hendrerit nibh ultrices. Morbi facilisis laoreet lectus, in elementum ex dapibus quis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce velit sem, ullamcorper non nunc sed, varius dapibus nisl. Vestibulum leo elit, vehicula vel nunc ut, volutpat ornare metus. Etiam non tincidunt purus, et vulputate arcu. Aliquam erat volutpat. Curabitur at mauris sed mauris vulputate placerat. Donec nec sapien quis neque aliquet suscipit. Donec vehicula vestibulum magna nec iaculis. In in scelerisque tellus. Duis varius lorem id finibus dictum. Sed lacinia condimentum metus eget vehicula. Donec euismod orci augue, et commodo ex feugiat non. Maecenas viverra lacinia dui et pulvinar. Nulla at velit mi. Fusce mi justo, aliquet in leo nec, auctor egestas ipsum. Cras sed accumsan metus. Mauris at odio risus. Ut quis enim et dolor hendrerit efficitur. Curabitur quis enim elementum, aliquam metus eu, molestie velit. Pellentesque auctor nisi vel laoreet porta. Curabitur nec eros ultrices tellus interdum pulvinar vel at nisl. Aenean auctor nisi at est ornare egestas. Suspendisse ornare dapibus mauris, vitae pharetra magna imperdiet id. Quisque feugiat, est in auctor facilisis, orci dolor maximus risus, vulputate tempus lacus nulla tincidunt dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer venenatis porttitor magna, vel sollicitudin dolor mollis at. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse ultrices tortor sit amet velit mattis tincidunt. In volutpat nulla sit amet metus tristique molestie. Mauris aliquam neque id iaculis aliquam. Mauris ultrices risus fermentum efficitur maximus. Fusce mattis gravida eros quis ornare. Integer quis nisi sollicitudin, semper magna sed, sodales massa. Morbi eget lobortis quam. Suspendisse elementum elementum sapien, id maximus tortor dapibus eu. Nulla quis dui purus. Nullam accumsan sagittis erat, nec eleifend purus elementum in. Ut congue ac sem sodales hendrerit. Pellentesque condimentum bibendum cursus. Praesent quis arcu sapien. Etiam viverra, massa porttitor condimentum euismod, nibh arcu posuere arcu, vitae facilisis sem felis sed nulla. In ornare, nulla a venenatis ultrices, velit magna consectetur enim, a tristique nunc augue eu sem. Cras faucibus condimentum iaculis."