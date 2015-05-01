PlexPin = function(headers){
  checkHeaders(headers);

  this.headers = headers;

  this.regEx = {
   pin: /\b\w+(?=<\/code>)/g,
   authToken: /\w+(?=<\/auth_token)/g,
   expireTime: /([\w-:]+)(?=<\/expires-at>)/g,
   requestId: /\b\w+(?=<\/id>)/g 
  };

  this.plexUrl = {
    requestPin: 'https://plex.tv/pins.xml',
    /* End checkPin with '.xml' */
    checkPin: 'https://plex.tv/pins/'
  };
};

PlexPin.prototype.requestPin = function(){
  var url = this.plexUrl.requestPin;

  var _headers = this.headers;

  var promise = new Promise(function(resolve, reject){
    Meteor.http.post(url, { headers: _headers }, function(error, result){
      if(error){
        return reject(error);
      }
      else{
        return resolve(result);
      }
    });
  });
    

  return promise;
};

PlexPin.prototype.checkPin = function(requestId){
  var url = this.plexUrl.checkPin;

  var requestId = this.requestId || requestId;

  if(requestId === undefined){
    throw new Error('RequestId is not set');
  }

  url += requestId + '.xml';

  var _headers = this.headers;

  var promise = new Promise(function(resolve, reject){
    Meteor.http.get(url, { headers: _headers }, function(error, result){
      if(error){
        return reject(error);
      }
      else{
        return resolve(result);
      }
    });
  });
    
  return promise;
};

PlexPin.prototype.setPin = function(plexResponse){
  var codeRegEx = this.regEx.pin;

  plexResponse = getInfo(plexResponse, codeRegEx);

  this.pin = plexResponse;
};

PlexPin.prototype.setRequestId = function(plexResponse){
  var reqIdRegEx = this.regEx.requestId;

  plexResponse = getInfo(plexResponse, reqIdRegEx);

  this.requestId = plexResponse;
};

PlexPin.prototype.setExpireTime = function(plexResponse){
  var expireTimeRegEx = this.regEx.expireTime;

  plexResponse = getInfo(plexResponse, expireTimeRegEx);

  this.expireTime = plexResponse;
};

PlexPin.prototype.setAuthToken = function(plexResponse){
  var authTokenRegEx = this.regEx.authToken;

  plexResponse = getInfo(plexResponse, authTokenRegEx);

  this.authToken = plexResponse;
};

PlexPin.prototype.getPin = function(){
  return this.pin;
};

PlexPin.prototype.getRequestId = function(){
  return this.requestId;
};

PlexPin.prototype.getExpireTime = function(){
  return this.expireTime;
};

PlexPin.prototype.getAuthToken = function(){
  return this.authToken;
};

function checkHeaders(_headers){
  if(typeof _headers !== 'object' || !_headers.hasOwnProperty('X-Plex-Product') || !_headers.hasOwnProperty('X-Plex-Version') || !_headers.hasOwnProperty('X-Plex-Client-Identifier') || !_headers.hasOwnProperty('X-Plex-Platform') || !_headers.hasOwnProperty('X-Plex-Platform-Version') || !_headers.hasOwnProperty('X-Plex-Device') || !_headers.hasOwnProperty('X-Plex-Device-Name') || !_headers.hasOwnProperty('Accept-Language')){
    throw new Error('Missing required header(s)');
  }
}

function getInfo(str, regExp){
  var extractedStr = str.match(regExp);

  return extractedStr ? extractedStr[0] : null;
}