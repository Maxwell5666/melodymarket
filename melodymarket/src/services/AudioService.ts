import { Audio } from 'expo-av';

class AudioService {
  private static instance: AudioService;
  private sound: Audio.Sound | null = null;
  private currentTrackId: string | null = null;
  private isPreviewMode = false;
  private positionUpdateInterval: NodeJS.Timeout | null = null;

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
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true }
      );
      
      this.sound = sound;
      
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
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: trackUrl },
        { shouldPlay: true }
      );
      
      this.sound = sound;
    } catch (error) {
      console.error('Error playing track:', error);
      this.resetState();
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
    }
  }

  async resume(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
      this.positionUpdateInterval = null;
    }
    this.resetState();
  }

  async seek(positionMillis: number): Promise<void> {
    if (this.sound) {
      await this.sound.setPositionAsync(positionMillis);
    }
  }

  async getStatus(): Promise<any> {
    if (this.sound) {
      return await this.sound.getStatusAsync();
    }
    return null;
  }

  getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  getIsPreviewMode(): boolean {
    return this.isPreviewMode;
  }

  private resetState(): void {
    this.currentTrackId = null;
    this.isPreviewMode = false;
  }

  async dispose(): Promise<void> {
    await this.stop();
  }
}

export default AudioService;