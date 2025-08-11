class AudioService {
  private static instance: AudioService;
  private audio: HTMLAudioElement | null = null;
  private currentTrackId: string | null = null;
  private isPreviewMode = false;
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async playPreview(trackId: string, previewUrl: string): Promise<void> {
    try {
      await this.stop();
      
      this.currentTrackId = trackId;
      this.isPreviewMode = true;
      
      this.audio = new Audio(previewUrl);
      this.audio.volume = 0.7;
      
      this.audio.addEventListener('play', () => this.notifyListeners(true));
      this.audio.addEventListener('pause', () => this.notifyListeners(false));
      this.audio.addEventListener('ended', () => {
        this.notifyListeners(false);
        this.resetState();
      });
      
      await this.audio.play();
      
      // Auto-stop after 1 minute for preview
      setTimeout(() => {
        if (this.isPreviewMode && this.currentTrackId === trackId) {
          this.stop();
        }
      }, 60000);
    } catch (error) {
      console.error('Error playing preview:', error);
      this.resetState();
      throw error;
    }
  }

  async playFullTrack(trackId: string, trackUrl: string): Promise<void> {
    try {
      await this.stop();
      
      this.currentTrackId = trackId;
      this.isPreviewMode = false;
      
      this.audio = new Audio(trackUrl);
      this.audio.volume = 0.7;
      
      this.audio.addEventListener('play', () => this.notifyListeners(true));
      this.audio.addEventListener('pause', () => this.notifyListeners(false));
      this.audio.addEventListener('ended', () => {
        this.notifyListeners(false);
        this.resetState();
      });
      
      await this.audio.play();
    } catch (error) {
      console.error('Error playing track:', error);
      this.resetState();
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.audio) {
      this.audio.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.audio) {
      await this.audio.play();
    }
  }

  async stop(): Promise<void> {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.notifyListeners(false);
    this.resetState();
  }

  async seek(time: number): Promise<void> {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  getIsPreviewMode(): boolean {
    return this.isPreviewMode;
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  addPlayStateListener(listener: (isPlaying: boolean) => void): void {
    this.listeners.add(listener);
  }

  removePlayStateListener(listener: (isPlaying: boolean) => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(isPlaying: boolean): void {
    this.listeners.forEach(listener => listener(isPlaying));
  }

  private resetState(): void {
    this.currentTrackId = null;
    this.isPreviewMode = false;
  }
}

export default AudioService;