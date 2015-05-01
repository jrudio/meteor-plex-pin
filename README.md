#Plex-PIN
A Plex.tv PIN request module

## Note
The point of this package is so you can easily create an app that requires myPlex authentication without the user needing to input the credentials of the plex account and instead use the Plex.tv/pin api to get an authorization token for users via PIN.

### Demo
Click [here](http://plexpin.meteor.com/) for a demo

#### Installation

```bash
  meteor add jrudio:plex-pin
```


## Example Usage

#####Constructing the object

The following headers are required and will throw an error if any are omitted:
```javascript
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

  var plexPin = new PlexPin(fakeHeaders);
```
* I plan on automating this in the future


* I suggest using your own info, but the above will work fine as-is

#####Methods
```javascript
  plexPin.setPin();           => grabs PIN via regEx and sets it it as PIN
  plexPin.setRequestId();     => grabs requestId via regEx and sets it it as requestId(Page Id to check for authToken)
  plexPin.setExpiredTime();   => grabs the time via regEx and sets it as expiredTime(5 minutes from when the request was made)
  plexPin.setAuthToken();     => grabs token via regEx and sets it as authToken

  plexPin.getPin();           => returns the pin or undefined
  plexPin.getRequestId();     => returns requestId or undefined
  plexPin.getExpiredTime();   => returns expiredTime or undefined
  plexPin.getAuthToken();     => returns authToken or undefined


  plexPin.requestPin();     => returns a promise
  plexPin.checkPin();     => returns a promise
```


#####Client

###### Request a PIN:
```javascript
plexPin.requestPin().then(function(result.content){

  // Pin expires in 5 minutes
  plexPin.setExpireTime(result.content);

  // Set Pin - Use case: Send to PMS owner to authorize
  plexPin.setPin(result.content);

  // Set requestId of the pin page to monitor
  plexPin.setRequestId(result.content);

  console.log('Code: %s', plexPin.getPin());
  console.log('Request Id: %s', plexPin.getRequestId());
  console.log('Expiration Time: %s', plexPin.getExpireTime());
}).catch(function(error){
  console.error('Error requesting PIN: ' + error);
});
```



###### Check if PIN is Authorized:
```javascript
/* Realtime applications put the following into an setInterval & end setInterval with a setTimeout within 5 minutes  (There is quite possibly a better way to do it)*/

// Check Authorization of PIN
plexPin.checkPin().then(function(result){

  // Looks for auth_token via regex & sets it
  plexPin.setAuthToken(result);

  // If token was not attached to PlexPin then one was not found
  if(!plexPin.getAuthToken()){
    console.log('You are not authorized');
  }
  else{

    // Notify user they are authorized
    console.log('You are authorized!', '\n You can access the token via plexPin.getAuthToken()');

    console.log('Token: %s', plexPin.getAuthToken());
  }
}).catch(function(error){
  console.error('Error Checking PIN: ' + error.statusCode);

  if(error.statusCode === 404){
    console.log('Your pin has expired');
  }
});
```

#####Server-side & Client-side Differences


Client (Make sure to append the '.content' property to the 'result' object):
```javascript
plexPin.requestPin().then(function(result){
  plexPin.setPin(result.content); => As opposed to result.content that is needed on the client
});
```
Server:
```javascript
// Callbacks need to run in a fiber
var requestCallback = Meteor.bindEnvironment(function(result){
  plexPin.setPin(result); => As opposed to result.content that is needed on the client
  plexPin.setPin(result);
});

plexPin.requestPin().then(requestCallback);
```
####v0.0.5
checkPin() utilizes property instead of passing argument

####v0.0.4
Cleaned up and combined some functions.

## License

MIT

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Crafted with <3 by Justin Rudio.

***