# AutoStatusTracker
AutoStatusTracker is an open-source solution that provides users with real-time uptime information.

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
