export default class RegisterPage {
  async render() {
    return `
      <div class="login-container" id="main-content" style="view-transition-name: main-content">
        <h2>Register</h2>
        <form id="register-form">
          <label>Name:</label>
          <input type="text" id="name" required>
          <label>Email:</label>
          <input type="email" id="email" required>
          <label>Password:</label>
          <input type="password" id="password" required>
          <button type="submit">Register</button>
           <div>
          <a href="#/login">login</a>
          </div>
        </form>
      </div>
    `;
  }

  async afterRender() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
          const response = await fetch(
            "https://story-api.dicoding.dev/v1/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, password }),
            }
          );

          const result = await response.json();

          if (!result.error) {
            alert("Registrasi berhasil. Silakan login.");
            window.location.href = "login.html";
          } else {
            alert(result.message);
          }
        } catch (error) {
          console.error("Register error:", error);
          alert("Terjadi kesalahan saat registrasi.");
        }
      });
  }
}
