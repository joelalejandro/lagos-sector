export default class AudioEmitter {
  constructor() {
    this.__element__ = window.document.createElement('audio-emitter');
    this.__element__.controllerObject = this;

    const playing = window.document.createElement('playing');
    this.__elementPlaying__ = playing;

    this.__element__.appendChild(this.__elementPlaying__);
    document.body.appendChild(this.__element__);
  }

  registerSound(options) {
    const soundAsset = this.__element__.ownerDocument.createElement('sound-asset');
    Object.keys(options).forEach((key) => {
      soundAsset.setAttribute(key, options[key]);
    });
    this.__element__.appendChild(soundAsset);
    this.__element__.addEventListener(`sound:${options.name}`, () => {
      this.playSound(soundAsset);
    });
  }

  playSound(soundAsset) {
    const audio = this.__element__.ownerDocument.createElement('audio');
    audio.src = `assets/sounds/${soundAsset.getAttribute('src')}`;
    audio.autoplay = true;

    const volume = soundAsset.getAttribute('volume');
    if (volume) {
      audio.volume = volume;
    }
    audio.onended = () => { audio.remove(); }
    this.__elementPlaying__.appendChild(audio);
  }

  emit(soundName) {
    this.__element__.dispatchEvent(new CustomEvent(`sound:${soundName}`));
  }
}
