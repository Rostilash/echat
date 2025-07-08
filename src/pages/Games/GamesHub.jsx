import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./GamesHubNeon.css";

export const GamesHub = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#7f5af0";
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="hub-wrapper">
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="hub-content">
        <h2 className="neon-title">Оберіть гру:</h2>
        <ul className="neon-list">
          <li>
            <Link to="/games/tictactoe" className="neon-button">
              Хрестики-нулики (TicTacToe)
            </Link>
          </li>
          <li>
            <Link to="/games/monopoly/list" className="neon-button">
              Монополія (Monopoly)
            </Link>
          </li>
          {/* Інші ігри */}
        </ul>
      </div>
    </div>
  );
};
