import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUp, CalendarDays, MapPin, Gift, Copy, Check, Heart, Music2, VolumeX, Send, ExternalLink, ChevronDown } from 'lucide-react';
import './style.css';

const weddingDate = new Date('2026-11-30T10:00:00+07:00');
const venue = 'Jl. Saun Tugu RT 01 RW 05 No. 63G, Kelurahan Cilangkap, Kecamatan Cipayung, Jakarta Timur';
const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue);
const ease = [0.22, 1, 0.36, 1];
const accounts = [{ key: 'fandy', name: 'Fandy', number: '5740348801' }, { key: 'nadia', name: 'Nadia Ardini Putri', number: '6825582375' }];

function useCountdown() {
  const [time, setTime] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  useEffect(() => {
    const tick = () => {
      const n = Math.max(0, weddingDate.getTime() - Date.now());
      setTime({ hari: Math.floor(n / 86400000), jam: Math.floor(n / 3600000) % 24, menit: Math.floor(n / 60000) % 60, detik: Math.floor(n / 1000) % 60 });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}
function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 48, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.85, delay, ease }}>{children}</motion.div>;
}
function Flourish() { return <div className="flourish" aria-hidden="true"><span />✦<span /></div>; }
function Petals() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return <div className="petals" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ '--i': i, '--left': `${(i * 37 + 11) % 100}%` }}>❦</span>)}</div>;
}
function ParallaxSection({ children, className = '', id }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-65, 65]);
  return <section ref={ref} id={id} className={`parallax ${className}`}><motion.div className="parallax-orb" style={reduce ? undefined : { y }} /><div className="section-content">{children}</div></section>;
}
function App() {
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState('');
  const [attend, setAttend] = useState('Hadir');
  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [wishes, setWishes] = useState(() => { try { return JSON.parse(localStorage.getItem('nadia-fandy-wishes') || '[]'); } catch { return []; } });
  const [audioOn, setAudioOn] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const countdown = useCountdown();
  const reduce = useReducedMotion();
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  useEffect(() => { document.body.style.overflow = opened ? '' : 'hidden'; return () => { document.body.style.overflow = ''; }; }, [opened]);
  async function playMusic() {
    if (!audioRef.current) return;
    try { await audioRef.current.play(); setAudioOn(true); setAudioError(false); }
    catch { setAudioOn(false); setAudioError(true); }
  }
  function toggleMusic() { if (!audioRef.current) return; if (audioRef.current.paused) playMusic(); else { audioRef.current.pause(); setAudioOn(false); } }
  function openInvitation() { setOpened(true); void playMusic(); setTimeout(() => scrollTo('home'), 100); }
  async function copy(key, value) { try { await navigator.clipboard.writeText(value); setCopied(key); setTimeout(() => setCopied(''), 1800); } catch { window.prompt('Salin nomor rekening:', value); } }
  function send(e) {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;
    const next = [{ name: name.trim(), wish: wish.trim(), attend, id: Date.now() }, ...wishes].slice(0, 100);
    setWishes(next);
    try { localStorage.setItem('nadia-fandy-wishes', JSON.stringify(next)); } catch {}
    setName(''); setWish('');
  }
  return <>
    <audio ref={audioRef} src="/music/teman-hidup.mp3" preload="none" loop onPlay={() => setAudioOn(true)} onPause={() => setAudioOn(false)} onError={() => { setAudioOn(false); setAudioError(true); }} />
    <AnimatePresence>{!opened && <motion.div className="cover" exit={{ y: '-110%', opacity: 0 }} transition={{ duration: 1.25, ease }}>
      <div className="cover-glow" /><Petals />
      <motion.div className="cover-inner" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <div className="eyebrow">THE WEDDING OF</div><h1>Nadia <i>&</i> Fandy</h1><Flourish />
        <div className="child-photos">
          <motion.div className="polaroid polaroid-left" initial={{ x: -90, rotate: -20, opacity: 0 }} animate={{ x: 0, rotate: -8, opacity: 1 }} transition={{ duration: 1.2, delay: 0.2, ease }}><img src="/child-nadia.jpg" alt="Ilustrasi AI masa kecil Nadia" /><small>little Nadia ♡</small></motion.div>
          <motion.div className="polaroid polaroid-right" initial={{ x: 90, rotate: 20, opacity: 0 }} animate={{ x: 0, rotate: 8, opacity: 1 }} transition={{ duration: 1.2, delay: 0.35, ease }}><img src="/child-fandy.jpg" alt="Ilustrasi AI masa kecil Fandy" /><small>little Fandy ♡</small></motion.div>
        </div>
        <div className="cover-invite">Kepada Yth.<br /><b>Bapak/Ibu/Saudara/i</b><p>Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dalam hari istimewa kami.</p></div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn primary" onClick={openInvitation}>Buka Undangan <Heart size={16} /></motion.button>
        <div className="cover-date">SENIN · 30 NOVEMBER 2026</div>
      </motion.div><div className="cover-bottom" />
    </motion.div>}</AnimatePresence>
    <main>
      <ParallaxSection id="home" className="hero"><Petals /><Reveal><div className="eyebrow gold">A CELEBRATION OF LOVE</div><h2 className="script jumbo">Nadia & Fandy</h2><Flourish /><p className="hero-sub">Dua hati, satu perjalanan, selamanya.</p><div className="date-pill">30 · 11 · 2026</div><button className="down" onClick={() => scrollTo('couple')} aria-label="Scroll ke mempelai"><ChevronDown /></button></Reveal></ParallaxSection>
      <ParallaxSection id="couple" className="couple-section"><Reveal><div className="kicker">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div><p className="intro">Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.</p><Flourish /><h2 className="script section-title">The Happy Couple</h2></Reveal>
        <div className="names-grid"><Reveal className="person-card"><span className="small-label">THE BRIDE</span><h3 className="script">Nadia Ardini Putri</h3><p>Putri dari<br /><b>Bapak Andrias</b> dan <b>Ibu Furi</b></p></Reveal><div className="amp">&</div><Reveal className="person-card" delay={0.15}><span className="small-label">THE GROOM</span><h3 className="script">Fandy</h3><p>Putra dari<br /><b>Bapak Heryanto</b> dan <b>Ibu Chayatun</b></p></Reveal></div>
      </ParallaxSection>
      <ParallaxSection id="date" className="date-section"><Reveal><span className="small-label">MARK YOUR CALENDAR</span><h2 className="script section-title">Save The Date</h2><Flourish /><div className="big-day">30</div><p className="month">SENIN, NOVEMBER 2026</p></Reveal>
        <div className="events"><Reveal className="event-card"><div className="event-icon">✧</div><h3>Akad Nikah</h3><div className="event-time">10.00 WIB</div><p>Senin, 30 November 2026</p></Reveal><Reveal className="event-card" delay={0.15}><div className="event-icon">❦</div><h3>Resepsi</h3><div className="event-time">11.00 – 14.00 WIB</div><p>Senin, 30 November 2026</p></Reveal></div>
        <Reveal><a className="btn outline" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Nadia+dan+Fandy&dates=20261130T030000Z%2F20261130T070000Z" target="_blank" rel="noreferrer"><CalendarDays size={17} /> Simpan ke Kalender</a></Reveal>
      </ParallaxSection>
      <ParallaxSection id="countdown" className="countdown-section"><Reveal><span className="small-label">COUNTING THE MOMENTS</span><h2 className="script section-title">Menuju Hari Bahagia</h2><div className="countdown-grid">{Object.entries(countdown).map(([k, v]) => <div className="count-box" key={k}><strong>{String(v).padStart(2, '0')}</strong><small>{k}</small></div>)}</div><p>Setiap detik membawa kami lebih dekat ke hari yang dinanti.</p></Reveal></ParallaxSection>
      <ParallaxSection id="location" className="location-section"><Reveal><span className="small-label">WHERE LOVE GATHERS</span><h2 className="script section-title">Lokasi Acara</h2><Flourish /><div className="venue-card"><MapPin size={32} /><h3>Kediaman Keluarga</h3><p>{venue}</p><a className="btn primary" href={maps} target="_blank" rel="noreferrer">Lihat Google Maps <ExternalLink size={16} /></a></div></Reveal></ParallaxSection>
      <ParallaxSection id="gift" className="gift-section"><Reveal><span className="small-label">A TOKEN OF LOVE</span><h2 className="script section-title">Wedding Gift</h2><p className="section-desc">Doa dan kehadiran Anda adalah hadiah terindah. Namun apabila berkenan memberikan tanda kasih, dapat melalui rekening berikut.</p></Reveal><div className="gift-grid">{accounts.map((a, i) => <Reveal key={a.key} delay={i * 0.15} className="bank-card"><div className="bank-head"><span>BCA</span><Gift size={22} /></div><div className="bank-num">{a.number}</div><div className="bank-name">a.n. {a.name}</div><button onClick={() => copy(a.key, a.number)} className="copy-btn">{copied === a.key ? <Check size={16} /> : <Copy size={16} />} {copied === a.key ? 'Tersalin' : 'Salin Rekening'}</button></Reveal>)}</div></ParallaxSection>
      <ParallaxSection id="wishes" className="wishes-section"><Reveal><span className="small-label">SHARE YOUR BLESSINGS</span><h2 className="script section-title">Ucapan & Doa</h2><p className="section-desc">Tinggalkan pesan dan doa terbaik untuk perjalanan baru kami.</p></Reveal><Reveal className="wish-panel"><form onSubmit={send}><label>Nama Anda<input value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" required maxLength={80} /></label><label>Konfirmasi Kehadiran<select value={attend} onChange={e => setAttend(e.target.value)}><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></label><label>Ucapan & Doa<textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="Tuliskan doa dan harapan terbaik..." rows={4} required maxLength={600} /></label><button className="btn primary" type="submit"><Send size={16} /> Kirim Ucapan</button></form><div className="wish-list">{wishes.length === 0 ? <p className="muted">Jadilah yang pertama mengirimkan ucapan ♡</p> : wishes.slice(0, 8).map(w => <div className="wish-item" key={w.id}><b>{w.name}</b><small>{w.attend}</small><p>{w.wish}</p></div>)}</div><small className="muted">Ucapan disimpan di browser ini. Untuk RSVP online bersama semua tamu, hubungkan database.</small></Reveal></ParallaxSection>
      <footer><div className="eyebrow">THANK YOU FOR BEING PART OF OUR STORY</div><h2 className="script">Nadia & Fandy</h2><p>30 November 2026</p><Flourish /><small>Made with love ♡</small></footer>
    </main>
    {opened && <><button className="floating-top" aria-label="Kembali ke atas" onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}><ArrowUp size={18} /></button><motion.button className="floating-music" type="button" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.9 }} onClick={toggleMusic} aria-label={audioOn ? 'Jeda musik' : 'Putar musik'} title={audioError ? 'Pastikan file public/music/teman-hidup.mp3 tersedia' : 'Teman Hidup — Tulus'}>{audioOn ? <Music2 size={21} /> : <VolumeX size={21} />}</motion.button></>}
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
