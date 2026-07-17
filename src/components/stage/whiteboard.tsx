"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  MousePointer2,
  PenLine,
  Type,
  Spline,
  Circle,
  StickyNote as StickyIcon,
  Eraser,
  Grid2x2,
} from "lucide-react";
import {
  ACCENTS,
  type Accent,
  type BoardState,
  type Scribble,
  type StickyNote,
} from "@/lib/whiteboard";

type Tool = "select" | "pen" | "text" | "arrow" | "circle" | "note" | "eraser" | "grid";

const TOOLS: { key: Tool; icon: typeof PenLine; label: string }[] = [
  { key: "select", icon: MousePointer2, label: "Sélectionner" },
  { key: "pen", icon: PenLine, label: "Stylo" },
  { key: "text", icon: Type, label: "Texte" },
  { key: "arrow", icon: Spline, label: "Flèche" },
  { key: "circle", icon: Circle, label: "Cercle" },
  { key: "note", icon: StickyIcon, label: "Note" },
  { key: "eraser", icon: Eraser, label: "Gomme" },
  { key: "grid", icon: Grid2x2, label: "Grille" },
];

/** Plan logique du tableau : le SVG s'y adapte via viewBox. */
const VIEW_W = 1000;
const VIEW_H = 600;

const ACCENT_CYCLE: Accent[] = ["blue", "green", "violet", "orange"];

function toPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
}

type Pt = { x: number; y: number };

/**
 * Point ou le segment centre -> cible sort du rectangle, plus un ecart.
 * Sans ca, la pointe de la fleche resterait cachee sous la carte.
 */
function exitRect(c: Pt, half: { w: number; h: number }, target: Pt, gap = 8): Pt {
  const dx = target.x - c.x;
  const dy = target.y - c.y;
  const tx = dx === 0 ? Infinity : half.w / Math.abs(dx);
  const ty = dy === 0 ? Infinity : half.h / Math.abs(dy);
  const t = Math.min(tx, ty);
  const len = Math.hypot(dx, dy) || 1;
  return { x: c.x + dx * t + (dx / len) * gap, y: c.y + dy * t + (dy / len) * gap };
}

/** Point ou le segment centre -> cible sort de l'ellipse, plus un ecart. */
function exitEllipse(c: Pt, r: { x: number; y: number }, target: Pt, gap = 8): Pt {
  const dx = target.x - c.x;
  const dy = target.y - c.y;
  const t = 1 / Math.hypot(dx / r.x, dy / r.y);
  const len = Math.hypot(dx, dy) || 1;
  return { x: c.x + dx * t + (dx / len) * gap, y: c.y + dy * t + (dy / len) * gap };
}

/**
 * Tableau blanc collaboratif du mockup : cartes reliees a l'idee centrale,
 * plus les outils de dessin. Les traces sont conserves dans l'etat de la salle.
 */
export function Whiteboard({
  initial,
  className = "",
}: {
  initial: BoardState;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);

  const [tool, setTool] = useState<Tool>("pen");
  const [notes, setNotes] = useState<StickyNote[]>(initial.notes);
  const [scribbles, setScribbles] = useState<Scribble[]>(initial.scribbles);
  const [showGrid, setShowGrid] = useState(false);
  const [drawing, setDrawing] = useState<Scribble | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

  /** Convertit un point ecran en coordonnees du plan, quel que soit le zoom. */
  const toBoard = useCallback((e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * VIEW_W,
      y: ((e.clientY - r.top) / r.height) * VIEW_H,
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (tool !== "pen") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toBoard(e);
    setDrawing({ id: `s${Date.now()}`, points: [p], color: "#2563eb" });
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (drag) {
      const p = toBoard(e);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === drag.id ? { ...n, x: p.x - drag.dx, y: p.y - drag.dy } : n,
        ),
      );
      return;
    }
    if (!drawing) return;
    const p = toBoard(e);
    setDrawing((d) => (d ? { ...d, points: [...d.points, p] } : d));
  };

  const onPointerUp = () => {
    dragRef.current = null;
    if (drawing && drawing.points.length > 1) {
      setScribbles((prev) => [...prev, drawing]);
    }
    setDrawing(null);
  };

  const addNote = () => {
    const accent = ACCENT_CYCLE[notes.length % ACCENT_CYCLE.length];
    setNotes((prev) => [
      ...prev,
      {
        id: `n${Date.now()}`,
        x: 420,
        y: 60,
        w: 190,
        accent,
        title: "Nouvelle idée",
        bullets: [],
      },
    ]);
  };

  const handleTool = (key: Tool) => {
    if (key === "note") return addNote();
    if (key === "grid") return setShowGrid((v) => !v);
    if (key === "eraser") {
      setScribbles([]);
      return;
    }
    setTool(key);
  };

  const isActive = (key: Tool) =>
    key === "grid" ? showGrid : key === "note" || key === "eraser" ? false : tool === key;

  return (
    <div className={`relative min-h-0 bg-surface ${className}`}>
      {/* Barre d'outils verticale, collee a gauche du plan */}
      <div className="absolute top-1/2 left-2 z-10 flex -translate-y-1/2 flex-col gap-0.5 rounded-xl border border-hairline bg-surface p-1 shadow-sm">
        {TOOLS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={isActive(key)}
            onClick={() => handleTool(key)}
            className={`grid size-7 place-items-center rounded-lg transition-colors ${
              isActive(key)
                ? "bg-primary text-white"
                : "text-ink-soft hover:bg-canvas hover:text-ink"
            }`}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className={`size-full touch-none ${tool === "pen" ? "cursor-crosshair" : "cursor-default"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="application"
        aria-label="Tableau blanc collaboratif"
      >
        <defs>
          <marker
            id={`${uid}-head`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2937" />
          </marker>
          <pattern id={`${uid}-grid`} width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#dfe3ea" />
          </pattern>
        </defs>

        {showGrid && <rect width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-grid)`} />}

        {/* Fleches a double tete entre l'idee centrale et chaque carte */}
        {notes.slice(0, 4).map((n) => {
          const h = 46 + n.bullets.length * 22;
          const card = { x: n.x + n.w / 2, y: n.y + h / 2 };
          const idea = initial.center;
          const start = exitRect(card, { w: n.w / 2, h: h / 2 }, idea);
          const end = exitEllipse(idea, { x: 72, y: 46 }, card);
          // Legere courbure vers l'exterieur, comme un trace a main levee.
          const mx = (start.x + end.x) / 2 + (card.x < idea.x ? -22 : 22);
          const my = (start.y + end.y) / 2;
          return (
            <path
              key={`arrow-${n.id}`}
              d={`M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`}
              fill="none"
              stroke="#1f2937"
              strokeWidth="1.6"
              markerStart={`url(#${uid}-head)`}
              markerEnd={`url(#${uid}-head)`}
            />
          );
        })}

        {/* Noeud central */}
        <ellipse
          cx={initial.center.x}
          cy={initial.center.y}
          rx="72"
          ry="46"
          fill="#ffffff"
          stroke="#1f2937"
          strokeWidth="1.8"
        />
        <text
          x={initial.center.x}
          y={initial.center.y - 4}
          textAnchor="middle"
          className="font-hand"
          fontSize="22"
          fill="#101828"
        >
          Idée
        </text>
        <text
          x={initial.center.x}
          y={initial.center.y + 20}
          textAnchor="middle"
          className="font-hand"
          fontSize="22"
          fill="#101828"
        >
          principale
        </text>

        {/* Annotation "Lancement" + etoile */}
        {initial.caption && (
          <>
            <text
              x={initial.caption.x}
              y={initial.caption.y}
              className="font-hand"
              fontSize="24"
              fill="#101828"
            >
              {initial.caption.text}
            </text>
            <path
              d="M 0 -9 L 2.4 -2.8 L 9 -2.8 L 3.6 1.2 L 5.6 7.6 L 0 3.6 L -5.6 7.6 L -3.6 1.2 L -9 -2.8 L -2.4 -2.8 Z"
              transform={`translate(${initial.caption.x + 118} ${initial.caption.y - 6})`}
              fill="none"
              stroke="#f79a2b"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Cartes */}
        {notes.map((n) => {
          const a = ACCENTS[n.accent];
          const h = 46 + n.bullets.length * 22;
          return (
            <g
              key={n.id}
              onPointerDown={(e) => {
                if (tool !== "select") return;
                e.stopPropagation();
                const p = toBoard(e);
                dragRef.current = { id: n.id, dx: p.x - n.x, dy: p.y - n.y };
              }}
              className={tool === "select" ? "cursor-move" : ""}
            >
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={h}
                rx="10"
                fill={a.tint}
                stroke={a.border}
                strokeWidth="1.8"
              />
              <text
                x={n.x + 14}
                y={n.y + 26}
                className="font-hand"
                fontSize="19"
                fontWeight="700"
                fill={a.text}
              >
                {n.title}
              </text>
              {n.bullets.map((b, i) => (
                <text
                  key={b}
                  x={n.x + 20}
                  y={n.y + 50 + i * 22}
                  className="font-hand"
                  fontSize="16"
                  fill="#101828"
                >
                  • {b}
                </text>
              ))}
            </g>
          );
        })}

        {/* Traces a main levee */}
        {[...scribbles, ...(drawing ? [drawing] : [])].map((s) => (
          <path
            key={s.id}
            d={toPath(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}
