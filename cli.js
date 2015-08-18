#!/usr/bin/env node


var program = require('commander');
var lib     = require('./');


program
  .version('0.0.1')
  .option('-h, --host [address]', 'NSQD HTTP API Url e.g. http://127.0.0.1:4151')
  .option('-t, --topic [name]', 'topic name')
  .parse(process.argv);


if(!program.host) throw new Error('host is missing');
if(!program.topic) throw new Error('topic is missing');


lib.deleteUnusedChannels(program.host, program.topic, function(err, count){
  if(err) throw err;
  if(count == 0) return console.log('Could not find any unused channels in the topic');
  console.log('Deleted ' + count + ' channels from the topic.');
});
