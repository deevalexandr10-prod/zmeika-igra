"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";
type GameState = "ready" | "playing" | "paused" | "over";

const BOARD = 20;
const START_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
const MOVES: Record<Direction, Point> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};
const OPPOSITE: Record<Direction, Direction> = {
  up: "down", down: "up", left: "right", right: "left",
};

function randomFood(snake: Point[]): Point {
  const free: Point[] = [];
  for (let y = 0; y < BOARD; y += 1) {
    for (let x = 0; x < BOARD; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 2, y: 2 };
}

export default function Home() {
  const [snake, setSnake] = useState<Point[]>(START_SNAKE);
  const [food, setFood] = useState<Point>({ x: 14, y: 10 });
  const [status, setStatus] = useState<GameState>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const directionRef = useRef<Direction>("right");
  const queuedDirection = useRef<Direction>("right");

  useEffect(() => setBest(Number(localStorage.getItem("snake-best") || 0)), []);

  const restart = useCallback(() => {
    setSnake(START_SNAKE);
    setFood({ x: 14, y: 10 });
    directionRef.current = "right";
    queuedDirection.current = "right";
    setScore(0);
    setStatus("playing");
  }, []);

  const steer = useCallback((next: Direction) => {
    if (OPPOSITE[directionRef.current] === next) return;
    queuedDirection.current = next;
    setStatus((current) => current === "ready" ? "playing" : current);
  }, []);

  const togglePause = useCallback(() => {
    setStatus((current) => current === "playing" ? "paused" : current === "paused" ? "playing" : current);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const directions: Record<string, Direction> = {
        ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down",
        ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right",
      };
      if (directions[event.key]) {
        event.preventDefault();
        steer(directions[event.key]);
      } else if (event.code === "Space") {
        event.preventDefault();
        togglePause();
      } else if (event.key === "Enter" && status === "over") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [restart, status, steer, togglePause]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => {
      setSnake((current) => {
        directionRef.current = queuedDirection.current;
        const move = MOVES[directionRef.current];
        const head = { x: current[0].x + move.x, y: current[0].y + move.y };
        const ate = head.x === food.x && head.y === food.y;
        const body = ate ? current : current.slice(0, -1);
        const crashed = head.x < 0 || head.y < 0 || head.x >= BOARD || head.y >= BOARD ||
          body.some((part) => part.x === head.x && part.y === head.y);
        if (crashed) {
          setStatus("over");
          setBest((oldBest) => {
            const newBest = Math.max(oldBest, score);
            localStorage.setItem("snake-best", String(newBest));
            return newBest;
          });
          return current;
        }
        const next = [head, ...current];
        if (ate) {
          setScore((value) => value + 1);
          setFood(randomFood(next));
        } else next.pop();
        return next;
      });
    }, Math.max(75, 155 - score * 3));
    return () => window.clearInterval(timer);
  }, [food.x, food.y, score, status]);

  const label = status === "ready" ? "Нажми стрелку, чтобы начать" :
    status === "paused" ? "Пауза" : status === "over" ? "Игра окончена" :
    "Собирай яблоки и не врезайся";

  return (
    <main>
      <section className="game-shell" aria-label="Игра Змейка">
        <header>
          <div><p className="eyebrow">КЛАССИЧЕСКАЯ ИГРА</p><h1>Змейка</h1></div>
          <div className="brand-mark" aria-hidden="true"><span /></div>
        </header>
        <div className="score-row">
          <div className="score-card"><span>СЧЁТ</span><strong>{String(score).padStart(2, "0")}</strong></div>
          <div className="score-card best"><span>РЕКОРД</span><strong>{String(best).padStart(2, "0")}</strong></div>
        </div>
        <div className="board-wrap">
          <div className="board" role="img" aria-label={`Игровое поле. Счёт ${score}`}>
            {Array.from({ length: BOARD * BOARD }, (_, index) => {
              const x = index % BOARD;
              const y = Math.floor(index / BOARD);
              const snakeIndex = snake.findIndex((part) => part.x === x && part.y === y);
              const isFood = food.x === x && food.y === y;
              return <span key={index} className={`${snakeIndex >= 0 ? "snake" : ""} ${snakeIndex === 0 ? "head" : ""} ${isFood ? "food" : ""}`} />;
            })}
            {status === "over" && (
              <div className="game-over">
                <span>ТВОЙ СЧЁТ</span><strong>{score}</strong>
                <button onClick={restart}>Играть снова</button><small>или нажми Enter</small>
              </div>
            )}
          </div>
        </div>
        <div className="status-line"><span className={status === "playing" ? "live" : ""} />{label}</div>
        <div className="controls" aria-label="Управление направлением">
          <div className="dpad">
            <button className="up" onClick={() => steer("up")} aria-label="Вверх">↑</button>
            <button className="left" onClick={() => steer("left")} aria-label="Влево">←</button>
            <button className="down" onClick={() => steer("down")} aria-label="Вниз">↓</button>
            <button className="right" onClick={() => steer("right")} aria-label="Вправо">→</button>
          </div>
          <button className="pause" onClick={status === "over" ? restart : togglePause} disabled={status === "ready"}>
            {status === "paused" ? "▶ Продолжить" : status === "over" ? "↻ Сначала" : "Ⅱ Пауза"}
          </button>
        </div>
        <footer>
          <span><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> или WASD — движение</span>
          <span><kbd>ПРОБЕЛ</kbd> — пауза</span>
        </footer>
      </section>
    </main>
  );
}
