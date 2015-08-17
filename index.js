var _       = require('lodash');
var request = require('request');
var async   = require('async');


function emptyChannel(channel){
  return channel.clients.length == 0;
}

module.exports.deleteUnusedChannels = function deleteUnusedChannels(host, topic, callback) {
  var endpoint = host + '/stats';
  var options  = {
    qs     : {format: 'json'},
    timeout: 5 * 1000,
    json   : true
  }

  request.post(endpoint, options, function(err, response, body){
    if(err) return callback(err);

    var nsqTopics      = body.data.topics;

    var topicData      = _.find(nsqTopics, {topic_name: topic});
    if(!topicData) return callback(new Error('Topic not found.'));

    var unusedChannels = _.chain(topicData.channels)
                          .filter(emptyChannel)
                          .pluck('channel_name')
                          .value();

    var tasks          = _.map(unusedChannels, function(channel){
                            return {channel:channel, topic: topic, host:host}
                          });

    if(unusedChannels.length == 0) return callback(null, 0);

    var deletedChannels = 0;
    var q               = async.queue(module.exports.deleteChannel, 1);
    q.drain             = function(){
      callback(null, deletedChannels);
    }
    q.push(tasks, function(err, channelName){
      if(err) return;
      deletedChannels++;
    });
  });
}


module.exports.deleteChannel = function deleteChannel(opts, callback){
  var endpoint = opts.host + '/channel/delete';
  var options  = {
    qs: {
      topic   : opts.topic,
      channel : opts.channel
    },
    timeout: 5 * 1000,
    json: true
  };
  request.post(endpoint, options, function(err, response, body){
    if(err) return callback(err);
    callback();
  });
}
