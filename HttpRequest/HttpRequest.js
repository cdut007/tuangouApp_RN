import { AsyncStorage } from 'react-native';

const apiAddr = 'http://ucstage.sealedchat.com:8008/api'
var httpToken = ''
var Global = require('../common/globals');

module.exports = {
get(apiName, body,successCallback, failCallback)
{
    if(httpToken && !httpToken.length)
    {
        httpToken = Global.token;

        AsyncStorage.getItem('k_http_token',function(errs,result)
        {
            if (!errs)
            {
                httpToken = result
                console.log('httpToken = '+httpToken)
            }
            else
            {
                console.log('get http token error:' + errs)
            }
        });



    }else{

    }

    var url = apiAddr + apiName
    console.log('Get requesr:' + url)
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + httpToken
        },
        body: body})
      .then((response) => response.text())
      .then((responseText) => {
        console.log(responseText);
        var response = JSON.parse(responseText);
        if (response.code == 200 || response.access_token || response.id) {
            successCallback(response);
        }else{
            failCallback(responseText)
        }

      })
      .catch(function(err){
        failCallback(err);
      });

  },

post(apiName, body,successCallback, failCallback)
  {
    if(!httpToken.length)
    {
        httpToken = Global.token;

        AsyncStorage.getItem('k_http_token',function(errs,result)
        {
            if (!errs)
            {
                httpToken = result
                console.log('httpToken = '+httpToken)
            }
            else
            {
                console.log('get http token error:' + errs)
            }
        });
    }

    var url = apiAddr + apiName
    try {
        console.log('Post requesr:' + url +":[param body]="+JSON.stringify(body))
    } catch (e) {

    } finally {

    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + httpToken
        },
        body: body})
      .then((response) => response.text())
      .then((responseText) => {
        console.log(responseText);
        var response = JSON.parse(responseText);
        if (response.code == 200 || response.access_token || response.id) {
            successCallback(response);
        }else{
            failCallback(responseText)
        }

      })
      .catch(function(err){
        failCallback(err);
      });
  }
}
