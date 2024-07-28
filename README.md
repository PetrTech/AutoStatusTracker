# AutoStatusTracker
AutoStatusTracker is an open-source solution that provides users with real-time uptime information.
![image](https://github.com/user-attachments/assets/7d5b49d7-33ad-491e-988e-3fc7ee0235fc)

## How to set up:
All public files should be editable (styling especially). Touching the backend is not recommended.
Don't forget to change the [config](trackerConfig.json)!

## trackerConfig.json
### root:
```json
{
  "hostIP": "IP GOES HERE",
  "hostPort": "PORT GOES HERE",
  "globalCheckFrequency": 60,
  "globalTimeout": 10,
  "stripDataSentToClient": true,
  "targets": []
}
```
* globalCheckFrequency is the default placeholder value used if an endpoint doesn't have a specified check frequency  (IN SECONDS)
* globalTimeout is the default placeholder value used if an endpoint doesn't have a specified check timeout  (IN SECONDS)
* stripDataSentToClient changes whether all data is sent, or unimportant parts are stripped before sending
* targets holds all top-level categories and endpoints

### target:
#### CATEGORY:
```json
{
  "displayName": "Example Category",
  "type": "category",
  "targets": []
}
```
* displayName sets the visible name on the front-end
* type sets the target type (category in this case)
* targets holds categories and endpoints

#### ENDPOINT:
```json
{
  "displayName": "Status Tracker",
  "type": "endpoint",
  "endpoint": "http://localhost:8080/",
  "timeout": 5,
  "checkFrequency": 20,
  "negativeStatus": [404, 500]
}
```
* displayName sets the visible name on the front-end
* type sets the target type (endpoint in this case)
* timeout sets the timeout time of the request (if the request times out, the service is assumed to be OFFLINE) (IN SECONDS) **OPTIONAL**
* negativeStatus can either be a string or an array
  * ARRAY: you can enter STATUS CODES. If the request response is any of these codes, the service will be logged as UNEXPECTED BEHAVIOR
  * STRING: value can be either "any" or "none". Any assumes any response status codes other than 2xx to be UNEXPECTED BEHAVIOR. None completely disables the UNEXPECTED BEHAVIOR state, thus making the service only either ONLINE or OFFLINE
* checkFrequency sets how often the service is checked for outages (IN SECONDS) **OPTIONAL**
* endpoint sets what server should be tested

## FRONT-END:
The front-end files are stored in the ``public`` directory. It is recommended to only change the styling.
The front-end is pretty badly coded, you may recode it if you wish.

### How to change status & main status names
#### ``public/behavior.js``:
At the top of the file, you can see ``statusDisplayNames`` and ``mainStatusNames``. You may change those as you please.
To change ``statusDisplayNames``, you have to edit the SECOND string in the line. Example: ``"ONLINE": "UP", "UNEXPECTED BEHAVIOR": "UNEXPECTED", "OFFLINE": "DOWN"``
To change ``mainStatusNames``, you can replace the current strings. Keep the length at 5.
