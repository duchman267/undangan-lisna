// Pemutar Musik Latar MP3 untuk Undangan Pernikahan
// Memutar file MP3 ("musik.mp3") dari awal sampai akhir secara berulang (loop) dengan volume sedang.
// Jika file musik gagal dimuat, tidak akan menampilkan error apa pun di layar (diam tanpa suara).

const UPLOADED_FALLBACK_SRC = '/assets/aistudio/musik_7fe9af80.mp3';

class WeddingMusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentSrc = '/musik.mp3';
  private isPlaying = false;
  private triedFallback = false;

  public configure(src: string) {
    if (!src) return;
    const normalized = src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
    if (this.currentSrc !== normalized) {
      this.currentSrc = normalized;
      this.triedFallback = false;
      if (this.audio) {
        this.audio.src = this.currentSrc;
      }
    }
  }

  private ensureAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio(this.currentSrc);
      this.audio.loop = true;
      this.audio.volume = 0.5; // Volume sedang
      this.audio.preload = 'auto';

      // Jika file gagal dimuat, coba cadangan file upload atau diam tanpa pesan error di layar
      this.audio.onerror = () => {
        if (!this.triedFallback && this.currentSrc !== UPLOADED_FALLBACK_SRC) {
          this.triedFallback = true;
          if (this.audio) {
            this.audio.src = UPLOADED_FALLBACK_SRC;
            if (this.isPlaying) {
              this.audio.play().catch(() => {
                this.isPlaying = false;
              });
            }
          }
          return;
        }
        this.isPlaying = false;
      };
    }
    return this.audio;
  }

  public start(src?: string): Promise<boolean> {
    if (src) {
      this.configure(src);
    }
    const audio = this.ensureAudio();
    return audio
      .play()
      .then(() => {
        this.isPlaying = true;
        return true;
      })
      .catch(() => {
        // Jika gagal dimuat di path utama, coba fallback file yang di-upload
        if (!this.triedFallback && audio.src.indexOf('musik_7fe9af80.mp3') === -1) {
          this.triedFallback = true;
          audio.src = UPLOADED_FALLBACK_SRC;
          return audio
            .play()
            .then(() => {
              this.isPlaying = true;
              return true;
            })
            .catch(() => {
              this.isPlaying = false;
              return false;
            });
        }
        // Diam tanpa pesan error di layar
        this.isPlaying = false;
        return false;
      });
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
  }

  public toggle(src?: string): Promise<boolean> {
    if (this.isPlaying && this.audio && !this.audio.paused) {
      this.stop();
      return Promise.resolve(false);
    } else {
      return this.start(src);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new WeddingMusicPlayer();
