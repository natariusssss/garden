import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
import "./home.css"
import img from "./leaves.svg"

const Home = () => {
    const navigate = useNavigate();
    return ( 
    <>
        <Header/>
        <section className="hero" id="hero">
        <div className="shell">
            <div className="hero__content">
            <div className="hero__text">
                <h1>Взращивай<br/>свои знания</h1>
                <p className="hero__lead">Алгоритм интервального повторения и наглядная визуализация прогресса. Вы видите, какие темы закреплены, какие увядают и что требует внимания.</p>
                <p className="hero__subtext">Система обучения с интервальным повторением и визуализацией прогресса</p>
                <button 
                onClick={() => navigate("/login")}
                 className="hero__cta">Попробовать прямо сейчас
                 </button>
            </div>
            <div className="hero__plant-wrap" aria-hidden="true">
                <img className="hero__plant" src={img} alt="" />
            </div>  
            </div>
        </div>
        <a className="scroll-down" href="#about-goals" aria-label="Прокрутить ниже"><span></span></a>
        </section>

        <section className="about-goals" id="about-goals">
        <div className="shell">
            <h2 className="section-title">Наши цели и возможности</h2>
            <div className="goals-grid">
            <article className="goal-card">
                <h3>Мотивация человека</h3>
                <p>Когда результат не виден сразу, становится трудно сохранять регулярность и продолжать движение к цели.</p>
            </article>
            <article className="goal-card">
                <h3>Достижения и друзья</h3>
                <p>Система достижений помогает замечать успехи, а рейтинг среди друзей добавляет вовлечённость и здоровую мотивацию.</p>
            </article>
            <article className="goal-card">
                <h3>Наглядный и живой прогресс</h3>
                <p>Развивайте свои направления, получайте достижения, отслеживайте рост и видите, как маленькие действия складываются в результат.</p>
            </article>
            <article className="goal-card">
                <h3>Удобство и комфорт</h3>
                <p>Мы хотим сделать путь к цели понятным, визуальным и поддерживающим.</p>
            </article>
            </div>
        </div>
        </section>
    
    </> );
}
 
export default Home;