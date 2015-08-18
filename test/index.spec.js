var should  = require('should');
var sinon   = require('sinon');
var request = require('request');
var lib     = require('../');



describe('nsq-cleanup', function(){
  var options = {}

  beforeEach(function(){
    options = {
      host  : 'http://127.0.0.1:4151',
      topic : 'sample_topic'
    };
    sinon.stub(request, 'post');
  });


  afterEach(function(){
    request.post.restore();
  });


  it('Should delete given channel', function(done){
    options.channel = 'my-channel';
    request.post.yields(null);

    lib.deleteChannel(options, function(err) {
      if(err) return done(err);

      request.post.callCount.should.equal(1);
      var endpoint = request.post.firstCall.args[0];
      var opts     = request.post.firstCall.args[1];

      endpoint.should.equal(options.host + '/channel/delete');
      opts.qs.topic.should.equal(options.topic);
      opts.qs.channel.should.equal(options.channel);

      done();
    });

  });

  it('Should delete only unused channels', function(done){
    var body = {
      data: {
        topics: [{
          topic_name: 'sample_topic',
          channels: [{
            channel_name: 'busy_channel', clients: ['A', 'B', 'C']
          },{
            channel_name: 'left_over_channel', clients: []
          }]
        }]
      }
    };

    request.post.yields(null, {body: body}, body);
    sinon.stub(lib, 'deleteChannel').yields(null);

    lib.deleteUnusedChannels(options.host, options.topic, function(err, count){
      if(err) return done(err);

      lib.deleteChannel.yields(null);

      lib.deleteChannel.callCount.should.equal(1);
      var opts = lib.deleteChannel.firstCall.args[0];
      should.deepEqual(opts, {
        host    : 'http://127.0.0.1:4151',
        topic   : 'sample_topic',
        channel : 'left_over_channel'
      });

      lib.deleteChannel.restore();
      done();
    });
  });
});
