var fakeHeaders = {
  'X-Plex-Product': 'Plex+Web',
  'X-Plex-Version': '2.3.21',
  'X-Plex-Client-Identifier': 'r4zsj3rp4r4wjyvi',
  'X-Plex-Platform': 'Chrome',
  'X-Plex-Platform-Version': '41.0',
  'X-Plex-Device': 'Linux',
  'X-Plex-Device-Name': 'Plex+Web+(Chrome)',
  'Accept-Language': 'en'
};

if(Meteor.isServer){

  var plexPin = new PlexPin(fakeHeaders);

  Tinytest.add('Properties - Can I access plexPin?', function (test) {
    test.equal(typeof plexPin, 'object');
  });

  Tinytest.add('Properties - has headers?', function (test) {
    test.equal(plexPin.hasOwnProperty('headers'), true);
  });

  Tinytest.add('Properties - has regEx for PIN, expireTime, requestId, and authToken?', function (test) {
    test.equal(
      !!(
         plexPin.hasOwnProperty('regEx')
        && plexPin.regEx.hasOwnProperty('pin')
        && plexPin.regEx.hasOwnProperty('authToken')
        && plexPin.regEx.hasOwnProperty('expireTime')
        && plexPin.regEx.hasOwnProperty('requestId')
      )
    , true);
  });

  Tinytest.addAsync('getPin() - Does getPin() set properties correctly?', function (test, done) {
    var getDatPin = Meteor.bindEnvironment(function(result){
          plexPin.setPin(result);
          plexPin.setRequestId(result);
          plexPin.setExpireTime(result);

          var isSet = !!(plexPin.getPin() && plexPin.getExpireTime() && plexPin.getRequestId());
  
          test.equal(isSet, true);
    
          done();
        });

    plexPin.requestPin().then(getDatPin);
  });
}

if(Meteor.isClient){
  plexPin = new PlexPin(fakeHeaders);

  Tinytest.add('Can I access PlexPin on the client?', function(test){
    test.equal(typeof plexPin, 'object');
  });

  Tinytest.addAsync('requestPin() - Do the needed properties get set when PIN is granted?', function(test, done){
    plexPin.requestPin().then(function(result){
      plexPin.setPin(result.content);
      plexPin.setExpireTime(result.content);
      plexPin.setRequestId(result.content);

      console.group('plexPin Properties');
      console.dir('PIN: ' + plexPin.getPin());
      console.dir('ExpireTime: ' + plexPin.getExpireTime());
      console.dir('RequestId: ' + plexPin.getRequestId());

      console.groupEnd();


      var isSet = plexPin.getPin() ? true : false;
      isSet = isSet ? plexPin.getExpireTime() : false;
      isSet = isSet ? plexPin.getRequestId() : false;
      console.log('All props set: ' + isSet);

      test.equal(!!(plexPin.getPin() && plexPin.getExpireTime() && plexPin.getRequestId()), true);
      done();
    }).catch(function(error){
      console.error('Message: ', error.message);
      console.error('Stack: ', error.stack);
      done();
    });
  });

  // Uncomment when you need to test it
  // The token must already be authorized before running this test

/*  Tinytest.addAsync('checkPin() - Should set authorized token to property?', function(test, done){
    var reqId = '11464856';
    plexPin.checkPin(reqId).then(function(result){
      plexPin.setAuthToken(result.content);

      console.group('plexPin Properties');
        console.dir('AuthToken: ' + plexPin.getAuthToken());
      console.groupEnd();


      test.equal(plexPin.getAuthToken() ? true : false, true);
      done();
    }).catch(function(error){
      console.error('Message: ', error.message);
      console.error('Stack: ', error.stack);

       // Test is flawed if it reaches this 
      done();
    });
  });
*/
  Tinytest.addAsync('checkPin() - Should generate 404?', function(test, done){
    var reqId = '12312453';
    plexPin.checkPin(reqId).then(function(result){
      done();
    }).catch(function(error){
      
      test.equal(/\[404\]/g.test(error), true);
      done();
    });
  });

}