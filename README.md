#nsq-cleanup
Deletes left over channels (channels without subscriber) in given topic.

##Installation
```
npm install -g nsq-cleanup
```

##Usage
`nsq-cleanup` accepts following parameters:
 - `-u, --url`: Url to the NSQD HTTP API.
 - `-t, --topic`: Topic name.

```
nsq-cleanup --url http://127.0.0.1:4151 --topic sample-topic
```
