import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Please enter email and password");
      return;
    }

    const loginData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(loginData)
        }
      );

      if (response.ok) {
        const user = await response.json();

        onLogin(user);
      } else {
        alert("Invalid email or password");
      }

    } catch (error) {
      console.log(error);
      alert("Error connecting to backend");
    }
  };

  return (
    <div className="container">

      <h1>Login</h1>

      <div className="form-group">

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;