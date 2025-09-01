import { useState } from "react";
import axios from "axios";

import LoginForm from "../../components/forms/login/LoginForm";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function LoginScreen() {

  const cancelarForm = () => {
    console.log("Limpio");
    setEmail("");
    setPassword("");
    setMensaje("");
  };

  const guardarForm = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);
      const errores = [];

      if (!email || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email.trim()))) {
        errores.push("El email debe tener un formato valido (xxx@xx.xx).");
      }
      if (!password || password.length < 1) {
        errores.push("La clave es un campo obligatorio.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMensaje(mensajeError);
        setFetching(false);
        return;
      }

      const response = await axios({
        url: base_url + "/api/v1/login",
        method: "POST",
        data: {
          email: email.trim(),
          password: password,
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelarForm();
        setMensaje("Bienvenido");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user);
        window.location.reload();
      } else {
        setMensaje(
          `No se pudo iniciar sesión, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setMensaje("Error al iniciar sesión: " + error.message);
      setFetching(false);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);
  const [mensaje, setMensaje] = useState("");

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Inicio de sesión</h1>
      </div>
      <LoginForm
        cancelarFn={cancelarForm}
        guardarFn={guardarForm}
        setEmail={setEmail}
        setPassword={setPassword}
        setFetching={setFetching}
        email={email}
        password={password}
        fetching={fetching}
        mensaje={mensaje}
      />
    </div>
  );
}
