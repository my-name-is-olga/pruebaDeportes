const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

//ruta html
app.get("/", (req, res) => {
  try {
    res.sendFile(`${__dirname}/public/index.html`);
  } catch (error) {
    res.status(200).send(error.message);
  }
});

//ruta para registrar datos
app.get("/agregar", (req, res) => {
  const { nombre, precio } = req.query;

  if (!nombre || !precio) {
    return res.send("Completa los campos solicitados, por favor");
  }

  try {
    const data = JSON.parse(fs.readFileSync("deportePrecio.json", "utf8"));
    const nombrePrecio = { nombre, precio };

    data.nombrePrecio.push(nombrePrecio);
    fs.writeFileSync("deportePrecio.json", JSON.stringify(data));

    res.status(200).send("Sus datos han sido registrados");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//ruta para mostrar datos registrados
app.get("/deportes", (req, res) => {
  try {
    const data = fs.readFileSync("deportePrecio.json", "utf8");
    const deportesRegistrados = JSON.parse(data).nombrePrecio;

    if (deportesRegistrados.length > 0) {
      res.status(200).json(deportesRegistrados);
    } else {
      res.status(200).send("No hay registro de datos aún");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//ruta para editar precios registrados
app.get("/editar", (req, res) => {
  try {
    const { nombre, precio } = req.query;

    const data = fs.readFileSync("deportePrecio.json", "utf8");
    const deportesRegistrados = JSON.parse(data).nombrePrecio;

    const modificarPrecio = deportesRegistrados.find(
      (deporte) => deporte.nombre === nombre
    );

    if (modificarPrecio) {
      modificarPrecio.precio = precio;

      fs.writeFileSync(
        "deportePrecio.json",
        JSON.stringify({ nombrePrecio: deportesRegistrados })
      );

      res.status(200).send("¡Precio del deporte modificado exitosamente!");
    } else {
      res.status(404).send("Deporte no encontrado");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//ruta para eliminar registros
app.get("/eliminar", (req, res) => {
  try {
    const nombre = req.query.nombre;

    const data = fs.readFileSync("deportePrecio.json", "utf8");
    const deportesRegistrados = JSON.parse(data).nombrePrecio;

    const index = deportesRegistrados.findIndex(
      (deporte) => deporte.nombre === nombre
    );

    if (index !== -1) {
      deportesRegistrados.splice(index, 1);

      fs.writeFileSync(
        "deportePrecio.json",
        JSON.stringify({ nombrePrecio: deportesRegistrados })
      );

      res.status(200).send("¡Deporte eliminado exitosamente!");
    } else {
      res.status(404).send("Deporte no encontrado");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//servidor
app.listen(port, () => {
  console.log("Servidor levantado correctamente");
});
