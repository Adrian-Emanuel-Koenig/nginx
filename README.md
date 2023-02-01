# Proxy $ Nginx

Para iniciar el servidor con modo fork y cluster:
npm start

Comandos PM2

Listado:
pm2 list

Monitorear:
pm2 monit

Destruir:
pm2 kill

Comandos Nginx

Ejecutar Nginx:
./nginx.exe
 
Reload:
./nginx.exe -s reload

Analizar:
tasklist /fi "imagename eq nginx.exe"

Borrar:
taskkill /F /PID <pid> 
