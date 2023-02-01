process.on("message", (msg) => {
  if (msg.mensaje == "start") {
    const numeros = {};
    for (let i = 0; i < msg.cantidad; i++) {
      const randoms = Math.floor(Math.random() * 100);
      numeros[randoms] = numeros[randoms] ? numeros[randoms] + 1 : 1;
    }
    process.send(numeros);
  }
});
