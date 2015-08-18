#nsq-cleanup
Deletes left over channels (channels without subscriber) in given topic. `nsq-cleanup` offers both cli and npm module.


##Cli
To use `nsq-cleanup` cli tool simply install it globally by running `npm install -g nsq-cleanup` command.
This tool expects following mandatory params:

 - `-h, --host`: Url to the NSQD HTTP API.
 - `-t, --topic`: Topic name.

**Example**
```
nsq-cleanup --host http://127.0.0.1:4151 --topic sample-topic
```

##NPM Module
`nsq-cleanup` can be used in your Node.js project by running `npm install nsq-cleanup --save` command.
It offers following APIs:

###`deleteChannel(options, callback)`
Deletes given channel. `options` must contain following fields:
 - `host`: Base url for the `nsqd` http API.
 - `topic`: Topic name.
 - `channel`: Channel name to be deleted.

**Example**
```javascript
var nsqCleanup = require('nsq-cleanup');
var options = {
  host: 'http://127.0.0.1:4151',
  topic: 'my-topic',
  channel: 'channel-name'
};
nsqCleanup.deleteChannel(options, function(err){
  if(err) throw err;
});
 ```

###`deleteUnusedChannels(host, topic, callback)`
Deletes all channels without subscriber in given topic.
 - `host`: Base url for the `nsqd` http API.
 - `topic`: Topic name.


**Example**
```javascript
var nsqCleanup = require('nsq-cleanup');
nsqCleanup.deleteUnusedChannels('http://127.0.0.1:4151', 'my-topic', function(err){
  if(err) throw err;
});
 ```

In following example, `nsq-cleanup` API is used in conjuction with `node-schedule` module to delete unused channels in `my-topic` topic periodically.
```javascript
var nsqCleanup = require('nsq-cleanup');
var jobScheduler = require('node-schedule');
jobScheduler.scheduleJob('1 * * * * *', function() {
  nsqCleanup.deleteUnusedChannels('http://127.0.0.1:4151', 'my-topic', function(err){
    if(err) throw err;
  });
});
```
