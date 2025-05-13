export default class LoginPage {
  async render() {
    return `
      <div class="login-container" id="main-content" style="view-transition-name: main-content">
        <h2>Login</h2>
        <form id="login-form">
          <label>Email:</label>
          <input type="email" id="email" required>
          <label>Password:</label>
          <input type="password" id="password" required>
          <button type="submit">Login</button>
          <div>
          <a href="#/register">register</a>
          </div>
        </form>
      </div>
    `;
  }

  async afterRender() {
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!result.error) {
      localStorage.setItem("token", result.loginResult.token);
      localStorage.setItem("name", result.loginResult.name);
      localStorage.setItem("userId", result.loginResult.userId);

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          window.location.href = "/src/index.html";
        });
      } else {
        window.location.href = "/src/index.html";
      }
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Terjadi kesalahan saat login.");
  }
});

  }
}
