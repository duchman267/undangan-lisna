/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Check,
  Send,
  Sparkles,
  BookOpen,
  UserCheck,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import { ThreeBackground } from './components/ThreeBackground';
import { TiltCard3D } from './components/TiltCard3D';
import { FlipUnit3D } from './components/FlipUnit3D';
import { GalleryCarousel3D, GallerySlotItem } from './components/GalleryCarousel3D';
import { romanticAudio } from './utils/romanticAudio';

// ============================================================================
// PUSAT DATA UNDANGAN PERNIKAHAN (MUDAH DIEDIT OLEH NON-PROGRAMMER)
// Cukup ubah teks di dalam tanda kutip ('...') di bawah ini untuk mengganti
// file musik, nama, teks sambutan, alamat, atau link foto cerita.
// ============================================================================
export const DATA_UNDANGAN = {
  // 0. Pengaturan File Musik Latar (mudah diganti cukup dengan mengubah nama file di bawah ini)
  fileMusik: 'musik.mp3',

  // 1. Foto Utama (Hero) — Tetap Hitam Putih (Monokrom Editorial Utuh)
  fotoHeroUtama: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.22_5d952697.jpeg',

  // 2. Informasi Umum & Cover Pembuka
  judulCover: 'The Wedding of Lisna & Anas',
  namaPanggilanPasangan: 'Lisna & Anas',
  tanggalTampilan: 'Jumat, 20 November 2026',
  tanggalTargetCountdownISO: '2026-11-20T08:00:00+07:00',
  namaTamuDefault: 'Tamu Undangan', // Otomatis diganti jika link memakai ?to=NamaTamu

  // 3. Kalimat Pembuka (Section 2 — Bahasa Indonesia tanpa tulisan Arab)
  pembuka: {
    judulPembuka: 'Undangan Hari Bahagia',
    kalimatSopan:
      'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
    kutipan:
      '“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”',
    sumberKutipan: 'QS. Ar-Rum : 21',
  },

  // 4. Data Mempelai Perempuan & Mempelai Pria (Section 3)
  mempelaiPerempuan: {
    namaLengkap: 'Lisna Puspita Sari, S.SI.',
    namaPanggilan: 'Lisna',
    urutanAnak: 'Putri ke-2 dari',
    namaAyah: 'Bapak Dedi Sukirman',
    namaIbu: '& Ibu Ike Komalasari',
    instagramUsername: '@lisna_myff',
    instagramLink: 'https://instagram.com/lisna_myff',
    fotoProfil: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.06__2__37ef7244.jpeg',
    posisiFoto: 'center 25%',
  },

  mempelaiPria: {
    namaLengkap: 'Anas Dwi Harjanto, A.Md.',
    namaPanggilan: 'Anas',
    urutanAnak: 'Putra ke-2 dari',
    namaAyah: 'Bapak Sudarmoko',
    namaIbu: '& (Almh.) Ibu R. Setyaningsih',
    instagramUsername: '@harjantoanasdwi',
    instagramLink: 'https://instagram.com/harjantoanasdwi',
    fotoProfil: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.06__3__e3072caa.jpeg',
    posisiFoto: 'center 22%',
  },

  // 5. Detail Rangkaian Acara: Akad Nikah & Syukuran Pernikahan (Section 5)
  acara: {
    akadNikah: {
      judul: 'Akad Nikah',
      hariTanggal: 'Jumat, 20 November 2026',
      tempat: 'KUA Antapani',
      alamatBaris1: 'Jl. Purwakarta Raya No. 204B',
      alamatBaris2: '(Belakang Kantor Kelurahan Antapani Kidul)',
    },
    syukuran: {
      judul: 'Syukuran Pernikahan',
      hariTanggal: 'Jumat, 20 November 2026',
      pukul: '15.30 WIB - Selesai',
      tempat: 'Kediaman Mempelai',
      alamat: 'Komp. Permata Biru D2 No.42 RT.01 RW.27, Jl. Edelweis 1, Kec. Cileunyi, Kel. Cinunuk',
      linkGoogleMaps:
        'https://www.google.com/maps/@-6.947727,107.7284053,668a,75y,57.67h,83.22t/data=!3m10!1e1!3m8!1slBxejrhRl9nV55mKLTbwuw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D6.776925740665746%26panoid%3DlBxejrhRl9nV55mKLTbwuw%26yaw%3D57.66830628238934!7i16384!8i8192!9m2!1b1!2i52?entry=ttu&g_ep=EgoyMDI2MTAxOC4wIKXMDSoASAFQAw%3D%3D',
    },
  },

  // 6. Our Love Story (Carousel 3D — 5 Kartu Cerita Sesuai Urutan)
  ourLoveStory: {
    judul: 'Our Love Story',
    subjudul: 'Perjalanan kami, dari dua langkah menjadi satu tujuan.',
    items: [
      {
        id: 'story-1',
        // Foto berbusana adat hitam, Anas duduk di kursi kayu dan Lisna berdiri
        src: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.05__1__fcdf8ba5.jpeg',
        orientation: 'portrait',
        title: 'Awal Cerita Kita',
        caption: 'Dua langkah yang dipertemukan dalam satu tujuan suci.',
      },
      {
        id: 'story-2',
        // Hitam putih, Lisna menyandarkan dagu di tangan, Anas di belakang memakai topi
        src: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.06__1__859ac87f.jpeg',
        orientation: 'landscape',
        title: 'Tawa & Ketulusan',
        caption: 'Setiap detik terasa hangat saat dilalui bersama.',
      },
      {
        id: 'story-3',
        // Foto berbusana adat hitam, Anas berdiri dan Lisna duduk di kursi
        src: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.05_4e862539.jpeg',
        orientation: 'portrait',
        title: 'Janji Setia',
        caption: 'Merangkai doa menuju ikatan yang diridhoi-Nya.',
      },
      {
        id: 'story-4',
        // Hitam putih, berdiri berdampingan, Lisna bersandar di bahu Anas
        src: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.06_e62cb89d.jpeg',
        orientation: 'landscape',
        title: 'Harmoni Cinta',
        caption: 'Saling melengkapi dalam suka maupun duka.',
      },
      {
        id: 'story-5',
        // Hitam putih, Lisna berdiri di belakang dan merangkul bahu Anas yang duduk
        src: '/assets/aistudio/WhatsApp_Image_2026-10-26_at_22.39.07_992f7966.jpeg',
        orientation: 'landscape',
        title: 'Menuju Pelaminan',
        caption: 'Menghitung hari menuju lembar kehidupan yang baru.',
      },
    ] as GallerySlotItem[],
  },

  // 7. Penutup (Section 8 — Tanpa tulisan Arab, keluarga dalam 2 baris terpisah)
  penutup: {
    ucapanTerimaKasih:
      'Merupakan suatu kehormatan dan kebahagiaan yang tiada terkira bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai. Atas kehadiran dan untaian doa restunya, kami ucapkan terima kasih.',
    kalimatPenutup:
      'Doa restu dan kehadiran Bapak/Ibu/Saudara/i merupakan kebahagiaan yang tak ternilai bagi kami.',
    keluargaBaris1: 'Keluarga Besar Bapak Dedi Sukirman & Ibu Ike Komalasari',
    keluargaBaris2: 'Keluarga Besar Bapak Sudarmoko & (Almh.) Ibu R. Setyaningsih',
  },
};

interface WishItem {
  id: string;
  name: string;
  guestsCount: number;
  attendance: 'Hadir' | 'Tidak Hadir';
  message: string;
  timestamp: string;
}

// Fungsi pembaca nama tamu dari parameter URL (?to=...) dengan dekode aman & batas 60 karakter
function parseGuestFromUrl(defaultName: string): { name: string; fromUrl: boolean } {
  if (typeof window === 'undefined') {
    return { name: defaultName, fromUrl: false };
  }

  const search = window.location.search || '';
  const params = new URLSearchParams(search);
  let raw = params.get('to') ?? params.get('kepada') ?? '';

  // Dukungan tambahan jika pengirim menulis tanda '&' tanpa encode di dalam ?to=Budi & Ani
  const rawMatch = search.match(/[?&](?:to|kepada)=([^#]*)/i);
  if (rawMatch && rawMatch[1]) {
    const segments = rawMatch[1].split('&');
    const collected: string[] = [segments[0]];
    for (let i = 1; i < segments.length; i++) {
      // Jika segmen berikutnya tidak mengandung '=', berarti '&' adalah bagian dari nama tamu
      if (!segments[i].includes('=')) {
        collected.push(segments[i]);
      } else {
        break;
      }
    }
    const candidate = collected.join('&').replace(/\+/g, ' ');
    try {
      raw = decodeURIComponent(candidate);
    } catch {
      raw = candidate;
    }
  }

  // Bersihkan spasi berlebih dan batasi maksimal 60 karakter (murni teks biasa / textContent)
  const cleaned = raw.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);

  if (cleaned.length > 0) {
    return { name: cleaned, fromUrl: true };
  }

  return { name: defaultName, fromUrl: false };
}

export default function App() {
  const initialGuest = parseGuestFromUrl(DATA_UNDANGAN.namaTamuDefault);
  const [guestName, setGuestName] = useState<string>(initialGuest.name);

  // State Cover Opening & Hero Split-Join Animation
  const [isOpened, setIsOpened] = useState(false);
  const [isOpeningGate, setIsOpeningGate] = useState(false);

  // State untuk efek sentuh Hitam-Putih ke Berwarna pada kartu profil
  const [brideColored, setBrideColored] = useState(false);
  const [groomColored, setGroomColored] = useState(false);

  // State Musik Latar
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // State 3D Parallax (-1 s/d 1)
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // State Countdown Timer menuju Jumat, 20 November 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 24,
    hours: 8,
    minutes: 22,
    seconds: 40,
  });

  // State Form RSVP & Daftar Ucapan (Dimulai Kosong Tanpa Data Dummy)
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [rsvpName, setRsvpName] = useState<string>(initialGuest.fromUrl ? initialGuest.name : '');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpAttendance, setRsvpAttendance] = useState<'Hadir' | 'Tidak Hadir'>('Hadir');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Baca nama tamu dari URL ?to=NamaTamu dan konfigurasi file musik
  useEffect(() => {
    romanticAudio.configure(DATA_UNDANGAN.fileMusik);
    const parsed = parseGuestFromUrl(DATA_UNDANGAN.namaTamuDefault);
    setGuestName(parsed.name);
    if (parsed.fromUrl) {
      setRsvpName(parsed.name);
    }
  }, []);

  // Mouse & Gyroscope / Kemiringan HP untuk Efek 3D Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setPointer({ x: nx, y: ny });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const nx = Math.max(-1, Math.min(1, e.gamma / 30));
        const ny = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        setPointer({ x: nx, y: ny });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Hitung mundur menuju Jumat, 20 November 2026
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(DATA_UNDANGAN.tanggalTargetCountdownISO).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handler saat tombol "Buka Undangan" diklik (otomatis memutar musik.mp3)
  const handleOpenInvitation = () => {
    setIsOpeningGate(true);
    romanticAudio.start(DATA_UNDANGAN.fileMusik).then((playing) => {
      setIsPlayingMusic(playing);
    });
    setTimeout(() => {
      setIsOpened(true);
    }, 900);
  };

  const handleToggleMusic = () => {
    romanticAudio.toggle(DATA_UNDANGAN.fileMusik).then((playing) => {
      setIsPlayingMusic(playing);
    });
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMessage.trim()) return;

    const createdWish: WishItem = {
      id: `wish-${Date.now()}`,
      name: rsvpName.trim(),
      guestsCount: rsvpAttendance === 'Hadir' ? rsvpGuests : 0,
      attendance: rsvpAttendance,
      message: rsvpMessage.trim(),
      timestamp: 'Baru saja',
    };

    setWishes((prev) => [createdWish, ...prev]);
    setRsvpSubmitted(true);
    setRsvpName('');
    setRsvpMessage('');
    setTimeout(() => setRsvpSubmitted(false), 4000);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0D] text-[#FAFAFA] selection:bg-[#C5A059]/30 selection:text-white">
      {/* Three.js Partikel Emas Champagne Tipis yang Melayang Pelan */}
      <ThreeBackground pointerX={pointer.x} pointerY={pointer.y} />

      {/* ====================================================================
          SECTION 1: COVER / OPENING 3D (DENGAN ANIMASI TIRAI / AMPLOP 3D)
         ==================================================================== */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="cover-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.75, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden perspective-2000 bg-[#070709]"
          >
            {/* Tirai / Pintu 3D Kiri */}
            <motion.div
              animate={
                isOpeningGate
                  ? { rotateY: -108, x: '-20%', opacity: 0 }
                  : { rotateY: 0, x: '0%', opacity: 1 }
              }
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#070709] via-[#101014] to-[#18181D] border-r border-[#C5A059]/35 z-10 pointer-events-none"
            />

            {/* Tirai / Pintu 3D Kanan */}
            <motion.div
              animate={
                isOpeningGate
                  ? { rotateY: 108, x: '20%', opacity: 0 }
                  : { rotateY: 0, x: '0%', opacity: 1 }
              }
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
              className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#070709] via-[#101014] to-[#18181D] border-l border-[#C5A059]/35 z-10 pointer-events-none"
            />

            {/* Kartu Amplop 3D Editorial di Tengah */}
            <motion.div
              animate={
                isOpeningGate
                  ? { scale: 1.12, rotateX: 18, y: -32, opacity: 0 }
                  : {
                      rotateX: -pointer.y * 4,
                      rotateY: pointer.x * 5,
                      scale: 1,
                      opacity: 1,
                    }
              }
              transition={{ duration: isOpeningGate ? 0.85 : 0.2, ease: 'easeOut' }}
              className="relative z-20 w-full max-w-md mx-4 rounded-3xl bg-[#121216]/95 border border-[#C5A059]/45 p-6 sm:p-8 text-center shadow-[0_35px_100px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Garis tepi tipis champagne gold */}
              <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#C5A059]/20" />

              <p className="relative z-10 text-[11px] uppercase tracking-[0.28em] text-[#E6C687] font-medium px-2">
                {DATA_UNDANGAN.judulCover}
              </p>

              {/* Pratinjau Foto Monokrom Utuh */}
              <div className="relative z-10 w-48 sm:w-56 mx-auto mt-4 mb-5 rounded-2xl p-[1.5px] bg-gradient-to-b from-[#E6C687] via-[#C5A059]/40 to-[#18181C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
                <div className="w-full rounded-[15px] overflow-hidden bg-[#262629] relative">
                  <img
                    src={DATA_UNDANGAN.fotoHeroUtama}
                    alt={DATA_UNDANGAN.judulCover}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block grayscale contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                </div>
              </div>

              <h1 className="relative z-10 font-serif-luxury text-4xl sm:text-5xl font-semibold text-[#FAFAFA] tracking-tight px-2">
                Lisna <span className="text-[#C5A059] italic font-normal">&amp;</span> Anas
              </h1>
              <p className="relative z-10 mt-1.5 text-xs sm:text-sm text-[#A1A1AA] tracking-[0.18em] uppercase px-2">
                {DATA_UNDANGAN.tanggalTampilan}
              </p>

              {/* Kotak Nama Tamu Undangan — Rata Tengah, Padding Kiri-Kanan >= 24px (px-6), Tidak Terpotong */}
              <div className="relative z-10 mt-5 py-4 px-6 rounded-2xl bg-[#18181E] border border-[#C5A059]/30 w-full box-border text-center overflow-hidden">
                <p className="text-xs sm:text-sm text-[#D4D4D8] text-center leading-relaxed whitespace-normal break-words">
                  Kepada Yth. Bapak/Ibu/Saudara/i
                </p>
                <p className="mt-1.5 font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#FAFAFA] text-center leading-snug whitespace-normal break-words">
                  {guestName}
                </p>
              </div>

              {/* Tombol Buka Undangan */}
              <div className="relative z-10 mt-5">
                <button
                  type="button"
                  onClick={handleOpenInvitation}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E6C687] to-[#C5A059] text-[#0B0B0D] font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 shadow-[0_12px_35px_rgba(197,160,89,0.35)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buka Undangan</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          TOP BAR NAVIGATION (Clean 3-Zone Editorial Contract)
         ==================================================================== */}
      <header className="fixed top-0 inset-x-0 z-30 bg-[#0B0B0D]/90 border-b border-[#C5A059]/20 px-4 sm:px-8 h-14 flex items-center">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-8">
          <a
            href="#hero"
            className="font-serif-luxury text-xl sm:text-2xl font-semibold tracking-wider text-[#FAFAFA] whitespace-nowrap shrink-0"
          >
            Lisna <span className="text-[#C5A059] italic">&amp;</span> Anas
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#A1A1AA]">
            <a
              href="#pembuka"
              className="hover:text-[#FAFAFA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Pembuka
            </a>
            <a
              href="#mempelai"
              className="hover:text-[#FAFAFA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Mempelai
            </a>
            <a
              href="#countdown"
              className="hover:text-[#FAFAFA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Hari Bahagia
            </a>
            <a
              href="#acara"
              className="hover:text-[#FAFAFA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Acara
            </a>
            <a
              href="#galeri"
              className="hover:text-[#FAFAFA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Our Love Story
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <a
              href="#rsvp"
              className="min-h-[36px] px-4 py-1.5 rounded-lg border border-[#C5A059]/50 text-[#E6C687] hover:bg-[#C5A059] hover:text-[#0B0B0D] text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center"
            >
              RSVP &amp; Doa
            </a>
          </div>
        </div>
      </header>

      {/* ====================================================================
          TOMBOL MUSIK LATAR MELAYANG DI POJOK LAYAR
         ==================================================================== */}
      <div
        style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
        className="fixed right-3 sm:right-5 z-40"
      >
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-label={isPlayingMusic ? 'Jeda Musik Latar' : 'Putar Musik Latar'}
          className="w-10 h-10 sm:w-auto sm:min-h-[44px] sm:px-3.5 rounded-full bg-[#141418]/90 text-[#FAFAFA] border border-[#C5A059]/60 shadow-[0_12px_30px_rgba(0,0,0,0.75)] flex items-center justify-center gap-2 hover:border-[#E6C687] active:scale-95 transition-all cursor-pointer"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 text-[#E6C687]" />
              <span className="text-xs font-medium hidden sm:inline whitespace-nowrap">
                Musik Menyala
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#71717A]" />
              <span className="text-xs font-medium hidden sm:inline whitespace-nowrap">
                Musik Dijeda
              </span>
            </>
          )}
        </button>
      </div>

      {/* ====================================================================
          HERO SECTION:
          - Foto hero hitam putih tampil 100% UTUH (width: 100%, height: auto,
            tanpa zoom & tanpa dipotong sama sekali) tepat di bawah header
          - Jika layar HP lebih tinggi dari foto, area atas/bawah menyatu dengan
            warna background studio foto (#454545) dan gradasi halus ke #0B0B0D
          - Teks "THE WEDDING OF", "Lisna & Anas", tanggal, dan "Kepada Yth."
            berada di bagian bawah foto (di atas area kemeja putih) dengan
            gradasi gelap halus dan jarak aman bawah >= 48px + safe-area-inset-bottom
         ==================================================================== */}
      <section
        id="hero"
        className="relative w-full min-h-[100svh] pt-14 bg-gradient-to-b from-[#454545] via-[#262628] to-[#0B0B0D] overflow-hidden select-none flex flex-col justify-between"
      >
        {/* Kontainer Utama Hero: Lebar penuh di HP, mengikuti rasio asli foto tanpa crop */}
        <div
          style={{
            paddingBottom: 'calc(48px + env(safe-area-inset-bottom, 0px))',
          }}
          className="relative w-full max-w-[440px] mx-auto flex-1 flex flex-col justify-between"
        >
          {/* Bungkus Foto Utuh Tepat di Bawah Header */}
          <div className="relative w-full bg-[#454545] overflow-hidden">
            <motion.div
              style={{
                x: pointer.x * -5,
                y: pointer.y * -3,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 22 }}
              className="relative w-full"
            >
              {/* Gambar acuan rasio asli (width: 100%, height: auto) agar 100% utuh dari rambut sampai kemeja */}
              <img
                src={DATA_UNDANGAN.fotoHeroUtama}
                alt="Anas & Lisna"
                referrerPolicy="no-referrer"
                className="w-full h-auto block opacity-0 pointer-events-none select-none"
              />

              {/* Belahan Kiri: Sisi Anas masuk dari Kiri (Utuh tanpa zoom/crop) */}
              <motion.div
                initial={{ x: '-50%', opacity: 0 }}
                animate={
                  isOpened
                    ? { x: '0%', opacity: 1 }
                    : { x: '-50%', opacity: 0 }
                }
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{
                  clipPath: 'polygon(0% 0%, 50.2% 0%, 50.2% 100%, 0% 100%)',
                }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={DATA_UNDANGAN.fotoHeroUtama}
                  alt="Anas Dwi Harjanto"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain block grayscale contrast-105"
                />
              </motion.div>

              {/* Belahan Kanan: Sisi Lisna masuk dari Kanan (Utuh tanpa zoom/crop) */}
              <motion.div
                initial={{ x: '50%', opacity: 0 }}
                animate={
                  isOpened
                    ? { x: '0%', opacity: 1 }
                    : { x: '50%', opacity: 0 }
                }
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{
                  clipPath: 'polygon(49.8% 0%, 100% 0%, 100% 100%, 49.8% 100%)',
                }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={DATA_UNDANGAN.fotoHeroUtama}
                  alt="Lisna Puspita Sari"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain block grayscale contrast-105"
                />
              </motion.div>

              {/* Efek Cahaya Emas Halus saat Sisi Anas & Sisi Lisna Bertemu di Tengah */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={
                  isOpened
                    ? { opacity: [0, 0.9, 0.25, 0], scaleY: [0.2, 1, 1, 1] }
                    : { opacity: 0, scaleY: 0.2 }
                }
                transition={{ duration: 2.1, times: [0, 0.45, 0.8, 1], delay: 0.9 }}
                className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-20 bg-gradient-to-r from-transparent via-[#E6C687]/65 to-transparent blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, height: '0%' }}
                animate={
                  isOpened
                    ? { opacity: [0, 1, 0.35, 0], height: ['0%', '100%', '100%', '100%'] }
                    : { opacity: 0 }
                }
                transition={{ duration: 1.9, delay: 0.95 }}
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-[#E6C687] to-transparent shadow-[0_0_18px_#D4AF37]"
              />

              {/* Gradasi gelap halus di bagian bawah foto (area kemeja putih) menuju hitam */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent" />
            </motion.div>

            {/* Blok Teks di Bagian Bawah Foto (Di Atas Area Kemeja Putih, Tidak Menutupi Wajah) */}
            <div className="relative z-20 -mt-36 sm:-mt-40 pt-10 pb-2 px-6 text-center bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/90 to-transparent">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 1.1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transform: `translateX(${pointer.x * 5}px) translateY(${pointer.y * 3}px)`,
                }}
              >
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.34em] text-[#E6C687] font-medium mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  The Wedding Of
                </p>
                <h1 className="font-serif-luxury text-4xl sm:text-6xl font-semibold leading-none tracking-tight text-[#FAFAFA] drop-shadow-[0_10px_28px_rgba(0,0,0,0.95)]">
                  Lisna{' '}
                  <span className="italic font-normal text-[#E6C687] px-1">&amp;</span>{' '}
                  Anas
                </h1>

                <div className="mt-2.5 sm:mt-3.5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#131317]/95 border border-[#C5A059]/45 text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[#FAFAFA] shadow-lg">
                  <span className="w-2 h-[1px] bg-[#C5A059]" />
                  <span>{DATA_UNDANGAN.tanggalTampilan}</span>
                  <span className="w-2 h-[1px] bg-[#C5A059]" />
                </div>

                <div className="mt-2.5 px-6 text-center max-w-full mx-auto">
                  <p className="text-xs sm:text-sm text-[#E4E4E7] leading-relaxed whitespace-normal break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    Kepada Yth. Bapak/Ibu/Saudara/i
                  </p>
                  <p className="mt-0.5 font-serif-luxury text-xl sm:text-2xl text-[#E6C687] font-semibold leading-snug whitespace-normal break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {guestName}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Penyambung Gradasi Halus di Bawah Foto untuk Layar HP yang Lebih Tinggi (844px / 932px) */}
          <div className="flex-1 w-full bg-[#0B0B0D]" />
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: PEMBUKA (BAHASA INDONESIA TANPA TULISAN ARAB)
         ==================================================================== */}
      <section
        id="pembuka"
        className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75 }}
        >
          <TiltCard3D
            intensity={6}
            className="rounded-3xl bg-[#131317] border border-[#C5A059]/35 p-8 sm:p-14 text-center shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)]"
          >
            <div style={{ transform: 'translateZ(24px)' }}>
              <Sparkles className="w-5 h-5 text-[#C5A059] mx-auto mb-4" />
              <p className="text-xs uppercase tracking-[0.28em] text-[#E6C687] font-medium">
                {DATA_UNDANGAN.pembuka.judulPembuka}
              </p>

              <p className="mt-5 text-base sm:text-lg text-[#FAFAFA] leading-relaxed max-w-2xl mx-auto font-normal">
                {DATA_UNDANGAN.pembuka.kalimatSopan}
              </p>

              <div className="my-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent mx-auto" />

              <p className="font-serif-luxury italic text-lg sm:text-2xl text-[#D4D4D8] leading-relaxed max-w-2xl mx-auto">
                {DATA_UNDANGAN.pembuka.kutipan}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                — {DATA_UNDANGAN.pembuka.sumberKutipan} —
              </p>
            </div>
          </TiltCard3D>
        </motion.div>
      </section>

      {/* ====================================================================
          SECTION 3: PROFIL MEMPELAI (KARTU 3D LISNA & ANAS)
          - Bersih tanpa teks petunjuk teknis
          - Efek Hitam-Putih berubah jadi Berwarna saat foto disentuh / di-hover
         ==================================================================== */}
      <section
        id="mempelai"
        className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-[#C5A059] font-medium">
            The Bride &amp; The Groom
          </p>
          <h2 className="mt-2 font-serif-luxury text-4xl sm:text-5xl font-semibold text-[#FAFAFA]">
            Mempelai yang Berbahagia
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Kartu 3D Mempelai Perempuan: Lisna Puspita Sari, S.SI. */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <TiltCard3D
              intensity={9}
              className="h-full rounded-3xl bg-[#131317] border border-[#C5A059]/40 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center text-center group"
            >
              <div
                onClick={() => setBrideColored((prev) => !prev)}
                onTouchStart={() => setBrideColored(true)}
                style={{ transform: 'translateZ(34px)' }}
                className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl p-[1.5px] bg-gradient-to-b from-[#E6C687] via-[#C5A059]/50 to-[#18181B] shadow-[0_22px_50px_rgba(0,0,0,0.75)] overflow-hidden cursor-pointer"
              >
                <div className="w-full h-full rounded-[15px] overflow-hidden bg-[#18181B] relative">
                  <img
                    src={DATA_UNDANGAN.mempelaiPerempuan.fotoProfil}
                    alt={DATA_UNDANGAN.mempelaiPerempuan.namaLengkap}
                    referrerPolicy="no-referrer"
                    style={{
                      objectPosition: DATA_UNDANGAN.mempelaiPerempuan.posisiFoto,
                    }}
                    className={`w-full h-full object-cover bw-to-color group-hover:scale-105 ${
                      brideColored ? 'is-colored' : ''
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
              </div>

              <div style={{ transform: 'translateZ(22px)' }} className="mt-7 w-full px-2">
                <p className="text-xs uppercase tracking-[0.25em] text-[#E6C687] font-medium">
                  Mempelai Perempuan
                </p>
                <h3 className="mt-2 font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#FAFAFA]">
                  {DATA_UNDANGAN.mempelaiPerempuan.namaLengkap}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">
                  ({DATA_UNDANGAN.mempelaiPerempuan.namaPanggilan})
                </p>

                <div className="my-5 w-12 h-[1px] bg-[#C5A059]/40 mx-auto" />

                {/* Nama Orang Tua Lisna — Satu Nama Per Baris, Utuh & Rapi */}
                <div className="space-y-1">
                  <p className="text-xs text-[#A1A1AA]">
                    {DATA_UNDANGAN.mempelaiPerempuan.urutanAnak}
                  </p>
                  <p className="text-sm sm:text-base font-medium text-[#FAFAFA]">
                    {DATA_UNDANGAN.mempelaiPerempuan.namaAyah}
                  </p>
                  <p className="text-sm sm:text-base font-medium text-[#FAFAFA]">
                    {DATA_UNDANGAN.mempelaiPerempuan.namaIbu}
                  </p>
                </div>

                <div className="mt-6">
                  <a
                    href={DATA_UNDANGAN.mempelaiPerempuan.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-full bg-[#1C1C22] hover:bg-[#C5A059] text-[#E6C687] hover:text-[#0B0B0D] border border-[#C5A059]/35 text-xs font-medium transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>{DATA_UNDANGAN.mempelaiPerempuan.instagramUsername}</span>
                  </a>
                </div>
              </div>
            </TiltCard3D>
          </motion.div>

          {/* Kartu 3D Mempelai Pria: Anas Dwi Harjanto, A.Md. */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <TiltCard3D
              intensity={9}
              className="h-full rounded-3xl bg-[#131317] border border-[#C5A059]/40 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center text-center group"
            >
              <div
                onClick={() => setGroomColored((prev) => !prev)}
                onTouchStart={() => setGroomColored(true)}
                style={{ transform: 'translateZ(34px)' }}
                className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl p-[1.5px] bg-gradient-to-b from-[#E6C687] via-[#C5A059]/50 to-[#18181B] shadow-[0_22px_50px_rgba(0,0,0,0.75)] overflow-hidden cursor-pointer"
              >
                <div className="w-full h-full rounded-[15px] overflow-hidden bg-[#18181B] relative">
                  <img
                    src={DATA_UNDANGAN.mempelaiPria.fotoProfil}
                    alt={DATA_UNDANGAN.mempelaiPria.namaLengkap}
                    referrerPolicy="no-referrer"
                    style={{
                      objectPosition: DATA_UNDANGAN.mempelaiPria.posisiFoto,
                    }}
                    className={`w-full h-full object-cover bw-to-color group-hover:scale-105 ${
                      groomColored ? 'is-colored' : ''
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
              </div>

              <div style={{ transform: 'translateZ(22px)' }} className="mt-7 w-full px-2">
                <p className="text-xs uppercase tracking-[0.25em] text-[#E6C687] font-medium">
                  Mempelai Pria
                </p>
                <h3 className="mt-2 font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#FAFAFA]">
                  {DATA_UNDANGAN.mempelaiPria.namaLengkap}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">
                  ({DATA_UNDANGAN.mempelaiPria.namaPanggilan})
                </p>

                <div className="my-5 w-12 h-[1px] bg-[#C5A059]/40 mx-auto" />

                {/* Nama Orang Tua Anas — Satu Nama Per Baris, Utuh & Rapi */}
                <div className="space-y-1">
                  <p className="text-xs text-[#A1A1AA]">
                    {DATA_UNDANGAN.mempelaiPria.urutanAnak}
                  </p>
                  <p className="text-sm sm:text-base font-medium text-[#FAFAFA]">
                    {DATA_UNDANGAN.mempelaiPria.namaAyah}
                  </p>
                  <p className="text-sm sm:text-base font-medium text-[#FAFAFA]">
                    {DATA_UNDANGAN.mempelaiPria.namaIbu}
                  </p>
                </div>

                <div className="mt-6">
                  <a
                    href={DATA_UNDANGAN.mempelaiPria.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-full bg-[#1C1C22] hover:bg-[#C5A059] text-[#E6C687] hover:text-[#0B0B0D] border border-[#C5A059]/35 text-xs font-medium transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>{DATA_UNDANGAN.mempelaiPria.instagramUsername}</span>
                  </a>
                </div>
              </div>
            </TiltCard3D>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: COUNTDOWN TIMER MENUJU JUMAT, 20 NOVEMBER 2026 (3D FLIP)
         ==================================================================== */}
      <section
        id="countdown"
        className="relative z-20 py-14 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-gradient-to-b from-[#15151A] to-[#0E0E12] border border-[#C5A059]/35 p-8 sm:p-12 text-center shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85)]"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-[#C5A059] font-medium">
            Save The Date
          </p>
          <h2 className="mt-2 font-serif-luxury text-3xl sm:text-5xl font-semibold text-[#FAFAFA]">
            Menuju Hari Bahagia
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] tracking-wider">
            {DATA_UNDANGAN.tanggalTampilan}
          </p>

          {/* 3D Flip Countdown Digits */}
          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-6">
            <FlipUnit3D value={timeLeft.days} label="Hari" />
            <FlipUnit3D value={timeLeft.hours} label="Jam" />
            <FlipUnit3D value={timeLeft.minutes} label="Menit" />
            <FlipUnit3D value={timeLeft.seconds} label="Detik" />
          </div>
        </motion.div>
      </section>

      {/* ====================================================================
          SECTION 5: DETAIL ACARA (DUA KARTU TERPISAH: AKAD NIKAH & SYUKURAN)
          - Kartu Akad Nikah: HANYA hari/tanggal, tempat, dan alamat (TANPA Pukul)
          - Kartu Syukuran: hari/tanggal, Pukul 15.30 WIB - Selesai, tempat, dan alamat
         ==================================================================== */}
      <section
        id="acara"
        className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-[#C5A059] font-medium">
            Rangkaian Acara
          </p>
          <h2 className="mt-2 font-serif-luxury text-4xl sm:text-5xl font-semibold text-[#FAFAFA]">
            Waktu &amp; Lokasi Acara
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-light">
            Dengan penuh kerendahan hati, kami mengharapkan kehadiran Bapak/Ibu/Saudara/i pada
            acara pernikahan kami:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Kartu 1: Akad Nikah (Hanya Hari/Tanggal, Nama Tempat & Alamat Lengkap, Tanpa Tombol/Link Maps) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <TiltCard3D
              intensity={8}
              className="h-full rounded-3xl bg-[#131317] border border-[#C5A059]/40 p-7 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            >
              <div style={{ transform: 'translateZ(22px)' }}>
                <div className="w-12 h-12 rounded-2xl bg-[#1C1C22] border border-[#C5A059]/40 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#E6C687]" />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#C5A059] font-medium">
                  01 · Prosesi Sakral
                </p>
                <h3 className="mt-1 font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#FAFAFA]">
                  {DATA_UNDANGAN.acara.akadNikah.judul}
                </h3>

                <div className="mt-6 space-y-4 pt-5 border-t border-white/10 text-sm">
                  <div className="flex items-start gap-3.5">
                    <Calendar className="w-4 h-4 text-[#E6C687] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#FAFAFA]">
                      {DATA_UNDANGAN.acara.akadNikah.hariTanggal}
                    </span>
                  </div>
                  <div className="pt-1 text-left">
                    <p className="font-semibold text-base text-[#FAFAFA]">
                      {DATA_UNDANGAN.acara.akadNikah.tempat}
                    </p>
                    <div className="text-xs sm:text-sm text-[#A1A1AA] mt-1 leading-relaxed break-normal">
                      <p>{DATA_UNDANGAN.acara.akadNikah.alamatBaris1}</p>
                      <p>{DATA_UNDANGAN.acara.akadNikah.alamatBaris2}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          </motion.div>

          {/* Kartu 2: Syukuran Pernikahan (Dengan Jam 15.30 WIB - Selesai) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <TiltCard3D
              intensity={8}
              className="h-full rounded-3xl bg-[#131317] border border-[#C5A059]/40 p-7 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            >
              <div style={{ transform: 'translateZ(22px)' }}>
                <div className="w-12 h-12 rounded-2xl bg-[#1C1C22] border border-[#C5A059]/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#E6C687]" />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#C5A059] font-medium">
                  02 · Ramah Tamah &amp; Doa Restu
                </p>
                <h3 className="mt-1 font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#FAFAFA]">
                  {DATA_UNDANGAN.acara.syukuran.judul}
                </h3>

                <div className="mt-6 space-y-4 pt-5 border-t border-white/10 text-sm">
                  <div className="flex items-start gap-3.5">
                    <Calendar className="w-4 h-4 text-[#E6C687] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#FAFAFA]">
                      {DATA_UNDANGAN.acara.syukuran.hariTanggal}
                    </span>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <Clock className="w-4 h-4 text-[#E6C687] shrink-0 mt-0.5" />
                    <span className="text-[#D4D4D8] tabular-nums">
                      Pukul {DATA_UNDANGAN.acara.syukuran.pukul}
                    </span>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-4 h-4 text-[#E6C687] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#FAFAFA]">
                        {DATA_UNDANGAN.acara.syukuran.tempat}
                      </p>
                      <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 leading-relaxed">
                        {DATA_UNDANGAN.acara.syukuran.alamat}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ transform: 'translateZ(32px)' }} className="mt-8">
                <a
                  href={DATA_UNDANGAN.acara.syukuran.linkGoogleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E6C687] to-[#C5A059] text-[#0B0B0D] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Buka Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </TiltCard3D>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: OUR LOVE STORY (CAROUSEL 3D — BERSIH UNTUK TAMU UNDANGAN)
         ==================================================================== */}
      <section
        id="galeri"
        className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center max-w-xl mx-auto mb-10"
        >
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-semibold text-[#FAFAFA]">
            {DATA_UNDANGAN.ourLoveStory.judul}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-light">
            {DATA_UNDANGAN.ourLoveStory.subjudul}
          </p>
        </motion.div>

        <GalleryCarousel3D items={DATA_UNDANGAN.ourLoveStory.items} />
      </section>

      {/* ====================================================================
          SECTION 7: RSVP (FORM KONFIRMASI KEHADIRAN & UCAPAN/DOA DI BAWAHNYA)
         ==================================================================== */}
      <section
        id="rsvp"
        className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto border-t border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-10"
        >
          {/* Kartu Form RSVP */}
          <TiltCard3D
            intensity={5}
            className="rounded-3xl bg-[#131317] border border-[#C5A059]/40 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
          >
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#1C1C22] border border-[#C5A059]/40 mb-3">
                <UserCheck className="w-5 h-5 text-[#E6C687]" />
              </div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#C5A059] font-medium">
                Reservation &amp; Wishes
              </p>
              <h2 className="mt-1.5 font-serif-luxury text-3xl sm:text-5xl font-semibold text-[#FAFAFA]">
                Konfirmasi Kehadiran &amp; Doa
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA]">
                Mohon konfirmasi kehadiran Bapak/Ibu/Saudara/i serta tuliskan doa restu untuk Lisna
                &amp; Anas.
              </p>
            </div>

            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value.slice(0, 60))}
                  placeholder="Masukkan nama Anda..."
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-white/15 text-sm text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0B0B0D] border border-white/10">
                    <button
                      type="button"
                      onClick={() => setRsvpAttendance('Hadir')}
                      className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors ${
                        rsvpAttendance === 'Hadir'
                          ? 'bg-[#C5A059] text-[#0B0B0D]'
                          : 'text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpAttendance('Tidak Hadir')}
                      className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors ${
                        rsvpAttendance === 'Tidak Hadir'
                          ? 'bg-[#C5A059] text-[#0B0B0D]'
                          : 'text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      Tidak Hadir
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                    Jumlah Tamu
                  </label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(Number(e.target.value))}
                    disabled={rsvpAttendance === 'Tidak Hadir'}
                    className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-white/15 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#C5A059] disabled:opacity-40"
                  >
                    <option value={1}>1 Orang</option>
                    <option value={2}>2 Orang</option>
                    <option value={3}>3 Orang</option>
                    <option value={4}>4 Orang (Keluarga)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                  Ucapan &amp; Doa Restu
                </label>
                <textarea
                  rows={3}
                  required
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Tuliskan ucapan selamat dan doa restu untuk Lisna & Anas..."
                  className="w-full p-4 rounded-xl bg-[#0B0B0D] border border-white/15 text-sm text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                {rsvpSubmitted ? (
                  <span className="text-xs font-medium text-[#E6C687] flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Terima kasih! Konfirmasi dan doa Anda telah tampil di bawah.
                  </span>
                ) : (
                  <span className="text-xs text-[#A1A1AA] tabular-nums">
                    {wishes.length} Ucapan &amp; Doa Restu
                  </span>
                )}

                <button
                  type="submit"
                  className="min-h-[48px] px-7 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E6C687] to-[#C5A059] text-[#0B0B0D] text-xs sm:text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Ucapan</span>
                </button>
              </div>
            </form>
          </TiltCard3D>

          {/* Daftar Ucapan & Doa yang Tampil di Bawah Form RSVP */}
          <div className="rounded-3xl bg-[#131317] border border-white/10 p-6 sm:p-9 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#FAFAFA]">
                Doa &amp; Ucapan Kehadiran
              </h3>
              <span className="text-xs text-[#C5A059] tabular-nums">{wishes.length} Pesan</span>
            </div>

            {wishes.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <p className="font-serif-luxury italic text-lg sm:text-xl text-[#D4D4D8] max-w-md mx-auto leading-relaxed">
                  Belum ada ucapan. Jadilah yang pertama memberikan doa dan restu untuk Lisna &amp;
                  Anas.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10 max-h-[420px] overflow-y-auto pr-1">
                {wishes.map((w) => (
                  <div key={w.id} className="py-4 first:pt-1 last:pb-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-[#FAFAFA]">{w.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                        <span className="text-[#E6C687] font-medium">{w.attendance}</span>
                        {w.attendance === 'Hadir' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{w.guestsCount} Tamu</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{w.timestamp}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-[#D4D4D8] leading-relaxed font-light">
                      {w.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ====================================================================
          SECTION 8: PENUTUP (UCAPAN TERIMA KASIH, DOA RESTU & NAMA KELUARGA)
          - Tanpa tulisan Arab
          - Nama keluarga besar 2 baris terpisah, jarak aman >= 24px (px-6 sm:px-10),
            nama orang tidak pernah terpecah di tengah, kontras terang & jelas
         ==================================================================== */}
      <footer className="relative z-20 mt-10 bg-[#08080A] border-t border-[#C5A059]/30 py-20 sm:py-28 px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          {/* Bingkai Monokrom Pasangan Utuh */}
          <div className="w-40 sm:w-44 mx-auto rounded-2xl p-[1.5px] bg-gradient-to-b from-[#E6C687] via-[#C5A059]/40 to-transparent shadow-2xl overflow-hidden">
            <img
              src={DATA_UNDANGAN.fotoHeroUtama}
              alt={DATA_UNDANGAN.namaPanggilanPasangan}
              referrerPolicy="no-referrer"
              className="w-full h-auto block rounded-[15px] grayscale contrast-105"
            />
          </div>

          <p className="mt-8 text-sm sm:text-base text-[#E4E4E7] leading-relaxed font-light max-w-2xl mx-auto">
            {DATA_UNDANGAN.penutup.ucapanTerimaKasih}
          </p>

          <p className="mt-5 font-serif-luxury italic text-lg sm:text-2xl text-[#E6C687] max-w-xl mx-auto">
            {DATA_UNDANGAN.penutup.kalimatPenutup}
          </p>

          <div className="my-8 w-16 h-[1px] bg-[#C5A059]/40 mx-auto" />

          <p className="text-xs uppercase tracking-[0.28em] text-[#D4D4D8]">
            Kami yang Berbahagia
          </p>
          <h2 className="mt-2 font-serif-luxury text-5xl sm:text-6xl font-semibold text-[#FAFAFA]">
            Lisna <span className="text-[#C5A059] italic font-normal">&amp;</span> Anas
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#D4D4D8] tracking-wider">
            {DATA_UNDANGAN.tanggalTampilan}
          </p>

          {/* Tulisan Keluarga Besar: 2 Baris Terpisah, Jarak Aman Kiri-Kanan, Kontras Tinggi, Nama Utuh */}
          <div className="mt-7 space-y-2.5 text-sm sm:text-base text-[#F4F4F5] font-normal leading-relaxed max-w-2xl mx-auto">
            <p className="text-center">
              <span className="inline-block">Keluarga Besar</span>{' '}
              <span className="inline-block whitespace-nowrap font-medium text-white">
                Bapak Dedi Sukirman
              </span>{' '}
              <span className="inline-block whitespace-nowrap font-medium text-white">
                &amp; Ibu Ike Komalasari
              </span>
            </p>
            <p className="text-center">
              <span className="inline-block">Keluarga Besar</span>{' '}
              <span className="inline-block whitespace-nowrap font-medium text-white">
                Bapak Sudarmoko
              </span>{' '}
              <span className="inline-block whitespace-nowrap font-medium text-white">
                &amp; (Almh.) Ibu R. Setyaningsih
              </span>
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
