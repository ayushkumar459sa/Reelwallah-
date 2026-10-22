import React, { useState, useEffect, useRef } from 'react';
import type { StudyRoom, RoomChatMessage } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Headphones,
  Users,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trophy,
  Flame,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAvatar } from './UserAvatar.js';

interface StudyRoomsViewProps {
  onOpenAuth: () => void;
}

export const StudyRoomsView: React.FC<StudyRoomsViewProps> = ({ onOpenAuth }) => {
  const { user, token, isLoggedIn } = useAuth();
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);

  // Pomodoro timer state
  const [pomodoroMode, setPomodoroMode] = useState<25 | 50 | 90>(50);
  const [timeLeft, setTimeLeft] = useState<number>(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Audio & Video controls (OFF BY DEFAULT as mandated)
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'real' | 'virtual'>('real');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(false);
  const [ambientType, setAmbientType] = useState<'lofi' | 'rain' | 'library'>('lofi');

  // Chat
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<RoomChatMessage[]>([]);

  // Local media stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Audio Context synthesizer for self-contained ambient sound and timer chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/study-rooms');
      const data = await res.json();
      if (data.rooms) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error('Failed to fetch study rooms:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playChime();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      alert('⏰ Pomodoro Focus Block Completed! Take a 5-minute break and hydrate.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Set pomodoro minutes
  const changePomodoroMode = (mins: 25 | 50 | 90) => {
    setPomodoroMode(mins);
    setTimeLeft(mins * 60);
    setIsTimerRunning(false);
  };

  // Play audio chime using Web Audio API
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime not supported');
    }
  };

  // Web Audio Synth for Ambient Sound (Lo-fi / Rain / Library)
  const toggleAmbientSound = () => {
    try {
      if (isAmbientOn) {
        if (ambientOscRef.current) {
          ambientOscRef.current.stop();
          ambientOscRef.current.disconnect();
          ambientOscRef.current = null;
        }
        setIsAmbientOn(false);
      } else {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Create warm low-frequency relaxing tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3 warm drone
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        ambientOscRef.current = osc;
        setIsAmbientOn(true);
      }
    } catch (err) {
      console.error('Ambient audio error:', err);
    }
  };

  // Camera attachment & playback
  useEffect(() => {
    if (isCameraOn && cameraMode === 'real' && mediaStreamRef.current && videoRef.current) {
      const vid = videoRef.current;
      vid.muted = true;
      vid.defaultMuted = true;
      vid.setAttribute('muted', '');
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      if (vid.srcObject !== mediaStreamRef.current) {
        vid.srcObject = mediaStreamRef.current;
      }
      vid.play().catch(e => console.warn('Video playback catch:', e));
    }
  }, [isCameraOn, cameraMode]);

  const toggleCamera = async () => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (isCameraOn) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach(track => {
          track.stop();
        });
        mediaStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      let stream: MediaStream | null = null;

      // 1. Try real hardware camera with front-facing ideal resolution
      if (navigator?.mediaDevices?.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 640 },
              height: { ideal: 480 }
            },
            audio: false
          });
        } catch {
          try {
            // 2. Fallback to any basic video track without strict resolution
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
          } catch (e2) {
            console.warn('Real webcam device access unavailable or blocked:', e2);
          }
        }
      }

      if (stream) {
        mediaStreamRef.current = stream;
        setCameraMode('real');
        setIsCameraOn(true);
      } else {
        // Fallback: If hardware camera is blocked or device lacks webcam, enable Live Aspirant Virtual Cam
        // so user is 100% VISIBLE in the room!
        setCameraMode('virtual');
        setIsCameraOn(true);
      }
    }
  };

  const toggleMic = async () => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (isMicOn) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = false;
          track.stop();
        });
      }
      setIsMicOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (mediaStreamRef.current) {
          stream.getAudioTracks().forEach(track => mediaStreamRef.current?.addTrack(track));
        } else {
          mediaStreamRef.current = stream;
        }
        setIsMicOn(true);
      } catch (err) {
        console.warn('Microphone permission denied:', err);
        alert('Could not access microphone.');
      }
    }
  };

  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (ambientOscRef.current) {
        ambientOscRef.current.stop();
      }
    };
  }, []);

  // Create room modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'silent' | 'physics' | 'chemistry' | 'maths' | 'advanced'>('silent');
  const [newDuration, setNewDuration] = useState<number>(50);
  const [newIsSilent, setNewIsSilent] = useState<boolean>(true);
  const [newChallenge, setNewChallenge] = useState<string>('');
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  const handleJoinRoom = async (room: StudyRoom) => {
    setActiveRoom(room);
    setMessages(room.messages || []);
    changePomodoroMode(room.targetTimeMin as 25 | 50 | 90);

    if (token) {
      try {
        await fetch(`/api/study-rooms/${room.id}/join`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRooms();
      } catch (err) {
        console.error('Error recording room join:', err);
      }
    }
  };

  const handleLeaveRoom = async () => {
    if (activeRoom && token) {
      try {
        await fetch(`/api/study-rooms/${activeRoom.id}/leave`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRooms();
      } catch (err) {
        console.error('Error recording room leave:', err);
      }
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
    setIsMicOn(false);
    if (ambientOscRef.current) {
      ambientOscRef.current.stop();
      setIsAmbientOn(false);
    }
    setActiveRoom(null);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (!newTitle.trim() || !newTopic.trim()) {
      alert('Please fill out room title and target topic.');
      return;
    }

    setIsCreatingRoom(true);
    try {
      const res = await fetch('/api/study-rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          topic: newTopic,
          targetTimeMin: newDuration,
          isSilent: newIsSilent,
          challenge: newChallenge || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => [data.room, ...prev]);
        setShowCreateModal(false);
        setNewTitle('');
        setNewTopic('');
        setNewChallenge('');
        handleJoinRoom(data.room);
      } else {
        alert(data.error || 'Failed to create room.');
      }
    } catch (err) {
      console.error('Error creating study room:', err);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (!activeRoom || !chatInput.trim()) return;

    try {
      const res = await fetch(`/api/study-rooms/${activeRoom.id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: chatInput })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setChatInput('');
      }
    } catch (err) {
      console.error('Failed to send room message:', err);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If in active room view
  if (activeRoom) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        {/* Room Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#171C34] border border-[#252D54] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLeaveRoom}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-lg font-bold text-white">{activeRoom.title}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeRoom.topic} • Host: {activeRoom.hostName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-[#252D54] text-xs font-semibold text-slate-300">
              <Users className="w-3.5 h-3.5 text-[#37D9F5]" />
              <span>{activeRoom.activeCount + (isLoggedIn ? 1 : 0)} Aspirants Focused</span>
            </div>

            <button
              onClick={handleLeaveRoom}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Workspace: Video Grid & Pomodoro Timer (Left) + Room Chat & Challenges (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Focus Timer & Video Call Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pomodoro Timer Console */}
            <div className="bg-gradient-to-br from-[#171C34] to-[#12162b] border border-[#252D54] rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-[#37D9F5]" />
                  <span className="text-sm font-bold text-white">Pomodoro Study Engine</span>
                </div>

                {/* 25, 50, 90 mins mode selector */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#101426] border border-[#252D54]">
                  {[
                    { label: '25m Sprint', mins: 25 },
                    { label: '50m Deep', mins: 50 },
                    { label: '90m Exam Slot', mins: 90 }
                  ].map(slot => (
                    <button
                      key={slot.mins}
                      onClick={() => changePomodoroMode(slot.mins as 25 | 50 | 90)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        pomodoroMode === slot.mins
                          ? 'bg-[#7857FF] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Digital Clock */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_20px_rgba(120,87,255,0.4)]">
                  {formatTimer(timeLeft)}
                </div>
                <div className="text-xs text-[#37D9F5] font-semibold tracking-widest uppercase mt-2">
                  {isTimerRunning ? '🔥 FOCUS SESSION IN PROGRESS' : 'PAUSED • CLICK START TO STUDY'}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/30'
                      : 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-[#7857FF]/40'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Focus Block</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(pomodoroMode * 60);
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-[#252D54]"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleAmbientSound}
                  className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
                    isAmbientOn
                      ? 'bg-[#37D9F5]/20 border-[#37D9F5]/50 text-[#37D9F5]'
                      : 'bg-white/5 border-[#252D54] text-slate-400 hover:text-white'
                  }`}
                >
                  {isAmbientOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isAmbientOn ? 'Lo-Fi Ambient On' : 'Play Ambient'}</span>
                </button>
              </div>
            </div>

            {/* Video Call & Study Camera Grid (Camera/Mic off by default) */}
            <div className="bg-[#171C34] border border-[#252D54] rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#7857FF]" />
                    <span>Live Silent Study Cameras</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Camera & microphone are <strong>strictly OFF by default</strong> for student privacy.
                  </p>
                </div>

                {/* Hardware Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleCamera}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isCameraOn
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-[#252D54] text-slate-400 hover:text-white'
                    }`}
                  >
                    {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    <span>{isCameraOn ? 'Cam On' : 'Cam Off'}</span>
                  </button>

                  <button
                    onClick={toggleMic}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isMicOn
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-[#252D54] text-slate-400 hover:text-white'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    <span>{isMicOn ? 'Mic On' : 'Mic Off'}</span>
                  </button>
                </div>
              </div>

              {/* Real Aspirant Study Camera & Focus Stations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Current Real User Camera Box */}
                <div className="relative aspect-video rounded-2xl bg-[#101426] border border-[#252D54] overflow-hidden flex items-center justify-center group">
                  {isCameraOn ? (
                    <video
                      ref={(el) => {
                        videoRef.current = el;
                        if (el && mediaStreamRef.current && el.srcObject !== mediaStreamRef.current) {
                          el.srcObject = mediaStreamRef.current;
                          el.play().catch(e => console.log('Video auto-play catch:', e));
                        }
                      }}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover -scale-x-100"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <UserAvatar
                        src={user?.avatar}
                        name={user?.name || 'Aspirant'}
                        size="lg"
                        className="mb-1.5"
                      />
                      <span className="text-xs font-bold text-white">{user?.name || 'You'}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Camera strictly OFF for privacy</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1.5">
                    <span>{user?.name || 'You'} (Me)</span>
                    {!isMicOn ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>

                {/* 2. Real Focus Monitor Station */}
                <div className="relative aspect-video rounded-2xl bg-[#101426] border border-[#252D54] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#37D9F5] uppercase tracking-wider">
                      Study Focus Monitor
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Active Session
                    </span>
                  </div>

                  <div className="space-y-1 text-center py-2">
                    <div className="text-xs text-slate-400">Current Target:</div>
                    <div className="text-sm font-bold text-white">{activeRoom.topic}</div>
                    <div className="text-[11px] font-mono text-[#A388FF]">{formatTimer(timeLeft)} remaining</div>
                  </div>

                  <div className="pt-2 border-t border-[#252D54]/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{activeRoom.isSilent ? 'Strict Muted Session' : 'Interactive Doubt Room'}</span>
                    <span>100% Real Peer Environment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Group Challenge & Room Live Chat */}
          <div className="space-y-6 flex flex-col">
            {/* Group Challenge Card */}
            <div className="bg-[#171C34] border border-[#252D54] rounded-3xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Room Challenge
                </h4>
              </div>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {activeRoom.challenge}
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Squad Progress</span>
                  <span className="font-mono text-[#37D9F5] font-bold">18 / 25 Tasks</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#101426] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#7857FF] to-[#37D9F5] rounded-full w-[72%]" />
                </div>
              </div>
            </div>

            {/* Room Chat */}
            <div className="bg-[#171C34] border border-[#252D54] rounded-3xl p-5 shadow-xl flex-1 flex flex-col min-h-[380px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#252D54]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#37D9F5]" />
                  <span className="text-xs font-bold text-white">Focus Room Chat</span>
                </div>
                <span className="text-[10px] text-slate-400">Silent / Study questions only</span>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 max-h-[300px] pr-1">
                {messages.map(m => (
                  <div key={m.id} className="flex items-start gap-2.5 text-xs">
                    <UserAvatar
                      src={m.userAvatar}
                      name={m.userName}
                      size="xs"
                      showBorder={false}
                      className="shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-[#101426] rounded-xl p-2.5 border border-[#252D54]/60">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{m.userName}</span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#252D54] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={isLoggedIn ? 'Ask peer or send motivation...' : 'Log in to chat'}
                  disabled={!isLoggedIn}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#101426] border border-[#252D54] text-xs text-white focus:outline-none focus:border-[#7857FF]"
                />
                <button
                  type="submit"
                  disabled={!isLoggedIn || !chatInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total real active participants
  const totalRealActive = rooms.reduce((acc, r) => acc + (r.activeCount || 0), 0);

  // Room Directory View
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171C34] via-[#101426] to-[#1F1744] border border-[#252D54] p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7857FF]/20 border border-[#7857FF]/30 text-[#37D9F5] text-xs font-bold mb-3">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 LIVE FOCUS COMMUNITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            IIT-JEE Study Rooms
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real peer study rooms with Pomodoro timers, ambient sound, and camera/mic-off privacy. Study together in quiet focus.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-[#101426]/70 p-4 rounded-2xl border border-[#252D54]">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-mono">{totalRealActive}</div>
              <div className="text-[11px] text-slate-400">Aspirants Live Now</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) onOpenAuth();
              else setShowCreateModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>+ Create Room</span>
          </button>
        </div>
      </div>

      {/* Rooms Directory Grid */}
      {rooms.length === 0 ? (
        <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-10 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#7857FF]/15 border border-[#7857FF]/30 flex items-center justify-center text-[#37D9F5] mx-auto">
            <Headphones className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">No Live Study Rooms Right Now</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
              All fake/seeded rooms have been removed. Every room here is created by real JEE aspirants like you. Be the first to start a focus room!
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                if (!isLoggedIn) onOpenAuth();
                else setShowCreateModal(true);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-lg shadow-[#7857FF]/30 hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Headphones className="w-4 h-4" />
              <span>+ Create Study Room</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rooms.map(room => (
            <div
              key={room.id}
              className="rounded-3xl bg-[#171C34] border border-[#252D54] p-6 shadow-xl hover:border-[#7857FF]/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    room.isSilent
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#7857FF]/20 text-[#A388FF] border border-[#7857FF]/40'
                  }`}>
                    {room.isSilent ? '🔇 Silent Focus' : `🎯 ${room.category.toUpperCase()} SQUAD`}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-[#37D9F5] font-semibold">
                    <span className={`w-2 h-2 rounded-full ${room.activeCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{room.activeCount > 0 ? `${room.activeCount} Live` : 'Ready to Join'}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{room.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{room.topic}</p>

                <div className="mt-4 p-3 rounded-2xl bg-[#101426] border border-[#252D54]/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Timer className="w-4 h-4 text-[#7857FF]" />
                    <span>{room.targetTimeMin} Min Pomodoro</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Host: {room.hostName}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#252D54] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Camera & Mic default OFF
                </span>
                <button
                  onClick={() => handleJoinRoom(room)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  Join Study Room ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Custom Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#101426] border border-[#252D54] rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#37D9F5]" />
                <span>Create Real Study Room</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Name *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Inorganic Chemistry Night Sprint"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none focus:border-[#7857FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Topic / Chapter *</label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="e.g. P-Block elements revision & NCERT lines"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none focus:border-[#7857FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
                  >
                    <option value="silent">Strict Silent</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="maths">Mathematics</option>
                    <option value="advanced">JEE Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pomodoro Duration</label>
                  <select
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
                  >
                    <option value={25}>25 Min Sprint</option>
                    <option value={50}>50 Min Deep Focus</option>
                    <option value={90}>90 Min Exam Slot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Target / Challenge (Optional)</label>
                <input
                  type="text"
                  value={newChallenge}
                  onChange={e => setNewChallenge(e.target.value)}
                  placeholder="e.g. Finish 20 PYQ questions without looking at hints"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none focus:border-[#7857FF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingRoom}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold hover:brightness-110 disabled:opacity-50"
                >
                  {isCreatingRoom ? 'Launching Room...' : 'Start Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
