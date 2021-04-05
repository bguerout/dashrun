# watch-memory

Watch memory of a node.js script on a terminal dashboard.

```shell
npx watch-memory your_script.js [arg...]
```

Can be used through ssh connections or inside a docker container.

```shell
docker exec -it <container_name> npx watch-memory your_script.js [arg...]
```

*Dashboard are generated using [blessed-contrib](https://www.npmjs.com/package/blessed-contrib)*


