"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, Users, MessageSquare, Smile,
  Ellipsis, Layers, ShieldCheck, Captions, Hand, Circle, PenLine,
  Image as ImageIcon, Grid3x3, Square, LayoutGrid, Link2, Check, BarChart3, UsersRound, Sparkles,
} from "lucide-react";
import type { Meeting } from "@/lib/meetings";
import { ControlBar, type Control } from "@/components/stage/control-bar";
import { VideoTile } from "@/components/stage/video-tile";
import { Whiteboard } from "@/components/stage/whiteboard";
import { ChatPanel, type ChatMessage } from "@/components/stage/chat-panel";
import { Elapsed } from "@/components/stage/elapsed";
import { MobileCall } from "@/components/stage/mobile-call";
import { LiveCaptions } from "@/components/stage/captions";
import { HostParticipantsPanel, type RoomParticipant } from "@/components/stage/host-participants";
import { ReactionsBar, FlyingReactions, useFlyingReactions } from "@/components/stage/reactions";
import { useLiveKit } from "@/lib/use-livekit";
import { useLocalCamera } from "@/lib/use-local-camera";
import { useIdentity } from "@/components/identity-gate";
import { AiCopilotPanel } from "@/components/stage/ai-copilot-panel";
import { useAudioLevel } from "@/lib/use-audio-level";
import { AudioLevelMeter } from "@/components/stage/audio-level-meter";

type Layout = "galerie" | "intervenant" | "tableau";

export function MeetingRoom({ meeting, initialMicOn = true, initialCamOn = true }: { meeting: Meeting; initialMicOn?: boolean; initialCamOn?: boolean }) {
  const router = useRouter();
  const identity = useIdentity();
  const realName = identity?.fullName ?? "Participant";
  const lk = useLiveKit(meeting.code, "host", realName, identity?.id, initialMicOn, initialCamOn);

  // Contrôles A/V (LiveKit si dispo, sinon état local + vraie webcam pour "moi").
  const [localMic, setLocalMic] = useState(initialMicOn);
  const [localCam, setLocalCam] = useState(initialCamOn);
  const [localShare, setLocalShare] = useState(false);
  const micOn = lk.enabled ? lk.micOn : localMic;
  const camOn = lk.enabled ? lk.camOn : localCam;
  const sharing = lk.enabled ? lk.sharing : localShare;
  const toggleMic = lk.enabled ? lk.toggleMic : () => setLocalMic((v) => !v);
  const toggleCam = lk.enabled ? lk.toggleCam : () => setLocalCam((v) => !v);
  const toggleShare = lk.enabled ? lk.toggleShare : () => setLocalShare((v) => !v);
  const localCamera = useLocalCamera(!lk.enabled && camOn, !lk.enabled && micOn);
  const selfStream = lk.enabled ? lk.localStream : localCamera.stream;
  const audioLevel = useAudioLevel(selfStream, micOn);

  // Panneaux & fonctionnalités
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showReactions, setShowReactions] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [recording, setRecording] = useState(false);
  const [layout, setLayout] = useState<Layout>("tableau");
  const [locked, setLocked] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [chatAllowed, setChatAllowed] = useState(true);
  const [menu, setMenu] = useState<"layout" | "security" | "more" | null>(null);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(meeting.messages);
  const { items: flying, push: pushReaction } = useFlyingReactions();

  // Participants : moi (hôte) + les autres, avec état mutable côté hôte.
  const [people, setPeople] = useState<RoomParticipant[]>(() => [{
    id: identity?.id ?? "self",
    name: `${realName} (moi)`,
    muted: !micOn,
    handRaised: false,
    isHost: true,
    isSelf: true,
  }]);

  useEffect(() => {
    // Synchronise la liste mutable de moderation avec les participants LiveKit.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPeople((previous) => {
      const self = previous.find((p) => p.isSelf) ?? previous[0];
      if (!lk.enabled) return [{ ...self, name: `${realName} (moi)`, muted: !micOn }];
      return [
        { ...self, name: `${realName} (moi)`, muted: !micOn },
        ...lk.remotes.map((remote) => ({
          id: remote.identity,
          name: remote.name,
          muted: remote.stream.getAudioTracks().length === 0,
          handRaised: false,
          isHost: false,
          isSelf: false,
        })),
      ];
    });
  }, [lk.enabled, lk.remotes, micOn, realName]);

  const streamFor = (participant: RoomParticipant) => participant.isSelf
    ? (selfStream ?? undefined)
    : (lk.remotes.find((remote) => remote.identity === participant.id)?.stream ?? undefined);

  const send = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `c${Date.now()}`, author: realName, text, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) },
    ]);
  };

  const raiseHand = () => {
    setHandRaised((v) => !v);
    setPeople((prev) => prev.map((p) => (p.isSelf ? { ...p, handRaised: !handRaised } : p)));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/reunion/${meeting.code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard indisponible */ }
  };

  const controls: Control[] = [
    { key: "micro", icon: micOn ? Mic : MicOff, label: "Micro", tone: micOn ? "default" : "off", onClick: toggleMic },
    { key: "camera", icon: camOn ? Video : VideoOff, label: "Caméra", tone: camOn ? "default" : "off", onClick: toggleCam },
    { key: "partager", icon: MonitorUp, label: "Partager", tone: sharing ? "active" : "default", onClick: toggleShare },
    { key: "participants", icon: Users, label: "Participants", badge: people.length, tone: showParticipants ? "active" : "default", onClick: () => { setShowParticipants((v) => !v); setShowChat(false); setShowAI(false); } },
    { key: "chat", icon: MessageSquare, label: "Chat", tone: showChat ? "active" : "default", onClick: () => { if (!chatAllowed) return; setShowChat((v) => !v); setShowAI(false); setShowParticipants(false); } },
    { key: "ia", icon: Sparkles, label: "Copilote IA", tone: showAI ? "active" : "default", onClick: () => { setShowAI((v) => !v); setShowChat(false); setShowParticipants(false); } },
    { key: "main", icon: Hand, label: "Main", tone: handRaised ? "active" : "default", onClick: raiseHand },
    { key: "reactions", icon: Smile, label: "Réactions", tone: showReactions ? "active" : "default", onClick: () => setShowReactions((v) => !v) },
    { key: "plus", icon: Ellipsis, label: "Plus", tone: menu === "more" ? "active" : "default", onClick: () => setMenu(menu === "more" ? null : "more") },
  ];

  const raisedCount = people.filter((p) => p.handRaised).length;

  return (
    <>
      <MobileCall
        meeting={meeting}
        participants={people}
        audioLevel={audioLevel}
        liveStatus={lk.enabled ? (lk.connected ? "transmis" : "connexion") : "non-configure"}
        controls={{ micOn, camOn, sharing, toggleMic, toggleCam, toggleShare, localStream: selfStream, speakerStream: lk.enabled ? (lk.remotes[0]?.stream ?? null) : null }}
      />

      {lk.remotes.map((remote) => <RemoteAudio key={remote.identity} stream={remote.stream} />)}

      <div className="hidden h-dvh flex-col bg-stage md:flex">
        {/* En-tête */}
        <header className="relative flex h-[42px] shrink-0 items-center px-3">
          <div className="z-10 flex items-center gap-2">
            <span className="hidden text-[11px] font-medium text-white/45 sm:block">{meeting.code}</span>
            {recording && (
              <span className="flex items-center gap-1 rounded-full bg-danger/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                <Circle size={7} className="animate-pulse fill-white" /> REC
              </span>
            )}
            {locked && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/80">🔒 Verrouillée</span>}
          </div>

          <div className="absolute inset-x-0 flex flex-col items-center justify-center leading-tight">
            <h1 className="text-[12.5px] font-semibold text-white">{meeting.title}</h1>
            <Elapsed from={meeting.elapsedSeconds} className="text-[10px] text-white/55" />
          </div>

          <div className="z-10 ml-auto flex items-center gap-1">
            <HeaderBtn icon={Link2} label={copied ? "Lien copié !" : "Copier le lien"} active={copied} onClick={copyLink} />
            <HeaderBtn icon={Captions} label="Sous-titres" active={showCaptions} onClick={() => setShowCaptions((v) => !v)} />
            <div className="relative">
              <HeaderBtn icon={Layers} label="Disposition" active={menu === "layout"} onClick={() => setMenu(menu === "layout" ? null : "layout")} />
              {menu === "layout" && (
                <Dropdown onClose={() => setMenu(null)}>
                  <DropItem icon={LayoutGrid} label="Vue galerie" active={layout === "galerie"} onClick={() => { setLayout("galerie"); setMenu(null); }} />
                  <DropItem icon={Square} label="Vue intervenant" active={layout === "intervenant"} onClick={() => { setLayout("intervenant"); setMenu(null); }} />
                  <DropItem icon={PenLine} label="Tableau blanc" active={layout === "tableau"} onClick={() => { setLayout("tableau"); setMenu(null); }} />
                </Dropdown>
              )}
            </div>
            <div className="relative">
              <HeaderBtn icon={ShieldCheck} label="Sécurité" active={menu === "security"} onClick={() => setMenu(menu === "security" ? null : "security")} />
              {menu === "security" && (
                <Dropdown onClose={() => setMenu(null)}>
                  <DropToggle label="Verrouiller la réunion" on={locked} onClick={() => setLocked((v) => !v)} />
                  <DropToggle label="Salle d'attente" on={waitingRoom} onClick={() => setWaitingRoom((v) => !v)} />
                  <DropToggle label="Autoriser le chat" on={chatAllowed} onClick={() => setChatAllowed((v) => !v)} />
                  <DropItem icon={MicOff} label="Couper le micro de tous" onClick={() => { setPeople((prev) => prev.map((p) => (p.isSelf ? p : { ...p, muted: true }))); setMenu(null); }} />
                </Dropdown>
              )}
            </div>
            <HeaderBtn icon={Circle} label={recording ? "Arrêter l'enregistrement" : "Enregistrer"} active={recording} onClick={() => setRecording((v) => !v)} />
            <button type="button" onClick={() => router.push("/reunions")} className="ml-1 rounded-lg bg-danger px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-danger-hover">
              Quitter
            </button>
          </div>
        </header>

        {/* Bandeau vignettes (vue intervenant/tableau) */}
        {layout !== "galerie" && (
          <div className="flex shrink-0 items-center gap-1.5 px-2 pb-2">
            {people.slice(0, 6).map((p) => (
              <Tile key={p.id} p={p} stream={streamFor(p)} mirror={p.isSelf} small />
            ))}
            {raisedCount > 0 && (
              <span className="ml-auto rounded-full bg-accent-orange/20 px-2 py-0.5 text-[10px] font-semibold text-accent-orange">
                ✋ {raisedCount}
              </span>
            )}
          </div>
        )}

        {/* Scène + panneaux */}
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-t-xl bg-surface">
          <div className="relative min-w-0 flex-1">
            {layout === "tableau" && <Whiteboard initial={meeting.board} className="size-full" />}

            {layout === "intervenant" && (
              <div className="grid size-full place-items-center bg-navy p-4">
                <Tile p={people[0]} stream={streamFor(people[0])} mirror={people[0]?.isSelf} className="aspect-video w-full max-w-[720px]" big />
              </div>
            )}

            {layout === "galerie" && (
              <div className="grid size-full grid-cols-2 gap-2 overflow-y-auto bg-navy p-3 lg:grid-cols-3">
                {people.map((p) => (
                  <Tile key={p.id} p={p} stream={streamFor(p)} mirror={p.isSelf} className="aspect-video w-full" />
                ))}
              </div>
            )}

            <FlyingReactions items={flying} />
            <ReactionsBar open={showReactions} onClose={() => setShowReactions(false)} onReact={pushReaction} />

            {showCaptions && (
              <div className="pointer-events-none absolute inset-x-4 bottom-14 flex justify-center">
                <LiveCaptions onClose={() => setShowCaptions(false)} />
              </div>
            )}
          </div>

          {showParticipants && (
            <HostParticipantsPanel
              participants={people}
              isHost
              onToggleMute={(id) => setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, muted: !p.muted } : p)))}
              onLowerHand={(id) => setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, handRaised: false } : p)))}
              onMakeCoHost={(id) => setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, isCoHost: true } : p)))}
              onRemove={(id) => setPeople((prev) => prev.filter((p) => p.id !== id))}
              onMuteAll={() => setPeople((prev) => prev.map((p) => (p.isSelf ? p : { ...p, muted: true })))}
              onClose={() => setShowParticipants(false)}
            />
          )}

          {showChat && chatAllowed && !showParticipants && !showAI && (
            <ChatPanel messages={messages} onSend={send} onClose={() => setShowChat(false)} className="hidden w-[248px] shrink-0 md:flex" />
          )}
          {showAI && (
            <AiCopilotPanel
              context={[`Réunion : ${meeting.title}`, ...messages.map((m) => `${m.author}: ${m.text}`)].join("\n")}
              onClose={() => setShowAI(false)}
            />
          )}
        </div>

        <div className="relative">
          {menu === "more" && (
            <div className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2">
              <Dropdown onClose={() => setMenu(null)} up>
                <DropItem icon={ImageIcon} label="Arrière-plan virtuel" onClick={() => setMenu(null)} />
                <DropItem icon={UsersRound} label="Salles de sous-groupes" onClick={() => setMenu(null)} />
                <DropItem icon={BarChart3} label="Lancer un sondage" onClick={() => setMenu(null)} />
                <DropItem icon={Grid3x3} label="Tableau blanc" onClick={() => { setLayout("tableau"); setMenu(null); }} />
              </Dropdown>
            </div>
          )}
          <div className="absolute bottom-3 left-4 z-20 w-28">
            <AudioLevelMeter level={micOn ? audioLevel : 0} />
            <p className={`mt-1 text-[9px] font-semibold ${lk.connected ? "text-accent-green" : "text-amber-300"}`}>
              {lk.connected ? "Audio transmis" : lk.enabled ? "Connexion audio…" : "Audio non transmis"}
            </p>
          </div>
          <ControlBar controls={controls} compact className="shrink-0" />
        </div>
      </div>
    </>
  );
}

function RemoteAudio({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    audio.srcObject = stream;
    void audio.play().catch(() => undefined);
    return () => { audio.srcObject = null; };
  }, [stream]);
  return <audio ref={ref} autoPlay playsInline className="hidden" />;
}

/* ————— Sous-composants ————— */

function Tile({ p, stream, mirror, small, big, className }: {
  p: RoomParticipant; stream?: MediaStream; mirror?: boolean; small?: boolean; big?: boolean; className?: string;
}) {
  return (
    <div className={`relative shrink-0 ${small ? "w-[104px] sm:w-[132px] lg:w-[158px]" : ""} ${className ?? ""}`}>
      <VideoTile
        participant={{ id: p.id, name: p.name, avatarUrl: p.avatarUrl, muted: p.muted, stream }}
        className={small ? "aspect-[7/5] w-full" : "size-full"}
        avatarSize={big ? 72 : 34}
        mirror={mirror}
      />
      <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded bg-black/45">
        {p.muted ? <MicOff size={9} className="text-danger" /> : <Mic size={9} className="text-accent-green" />}
      </span>
      {p.handRaised && (
        <span className="absolute top-1.5 left-1.5 text-[13px]">✋</span>
      )}
    </div>
  );
}

function HeaderBtn({ icon: Icon, label, active, onClick }: { icon: typeof Mic; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`grid size-7 place-items-center rounded-lg transition-colors hover:bg-white/10 hover:text-white ${active ? "bg-accent-green text-white" : "text-white/85"}`}
    >
      <Icon size={15} />
    </button>
  );
}

function Dropdown({ children, onClose, up }: { children: React.ReactNode; onClose: () => void; up?: boolean }) {
  return (
    <>
      <button type="button" aria-hidden className="fixed inset-0 z-10 cursor-default" onClick={onClose} tabIndex={-1} />
      <div className={`absolute right-0 z-20 w-56 overflow-hidden rounded-xl border border-white/10 bg-navy py-1 shadow-xl ${up ? "bottom-9" : "top-9"}`}>
        {children}
      </div>
    </>
  );
}

function DropItem({ icon: Icon, label, active, onClick }: { icon: typeof Mic; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12.5px] hover:bg-white/10 ${active ? "text-accent-green" : "text-white/90"}`}>
      <Icon size={15} /> {label}
    </button>
  );
}

function DropToggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between px-3 py-2 text-left text-[12.5px] text-white/90 hover:bg-white/10">
      {label}
      <span className={`grid size-4 place-items-center rounded ${on ? "bg-accent-green text-white" : "border border-white/25"}`}>
        {on && <Check size={11} />}
      </span>
    </button>
  );
}
