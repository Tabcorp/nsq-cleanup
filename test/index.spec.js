var should  = require('should');
var sinon   = require('sinon');
var request = require('request');
var lib     = require('../');



describe('nsq-cleanup', function(){
  var options = {}

  beforeEach(function(){
    options = {
      url   : 'http://127.0.0.1:4151',
      topic : 'sample_topic'
    };
    sinon.stub(request, 'post');
    sinon.stub(lib, 'deleteChannel');
  });


  afterEach(function(){
    request.post.restore();
    lib.deleteChannel.restore();
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
    lib.deleteChannel.yields(null);

    lib.deleteUnusedChannels(options.url, options.topic, function(err, count){
      if(err) return done(err);

      lib.deleteChannel.yields(null);

      lib.deleteChannel.callCount.should.equal(1);
      var opts = lib.deleteChannel.firstCall.args[0];
      should.deepEqual(opts, {
        host    : 'http://127.0.0.1:4151',
        topic   : 'sample_topic',
        channel : 'left_over_channel'
      });

      done();
    });
  });
});
