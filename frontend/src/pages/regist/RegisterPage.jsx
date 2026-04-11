import "./register.css";

const RegisterPage = () => {
  return ( 
    <section className="register-page">
      <div className="register-card">
        <h1 className="title-register">Регистрация</h1>

        <form className="form-register">
          <input
            className="username"
            type="text"
            placeholder="Имя пользователя"
          />

          <input
            className="mail"
            type="text"
            placeholder="Почта"
          />

          <input
            className="register-password"
            type="password"
            placeholder="Пароль"
          />

          <button className="auth-button" type="button" onClick={() => navigate("/register")}>
            ЗАРЕГЕСТРИРОВАТЬСЯ
          </button>
        </form>
      </div>
    </section>
   );
}
 
export default RegisterPage;