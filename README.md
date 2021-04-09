# dashrun

Run a node.js script and watch its memory usage on a terminal dashboard.

```shell
npx dashrun your_script.js [arg...]
```

![image](https://user-images.githubusercontent.com/221211/113982536-2d00e500-9849-11eb-83b9-7bf2c5fdee0a.png)
*Dashboard is generated using [blessed-contrib](https://www.npmjs.com/package/blessed-contrib)*




Can be used through ssh connections or inside a docker container.

```shell
docker exec -it <container_name> npx dashrun your_script.js [arg...]
```
