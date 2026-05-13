import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Download, Mic, MicOff, Pause, RotateCcw, Save, Sparkles, Trash2, Wifi, WifiOff } from 'lucide-react';
import { createResponse, detectEmotion } from './engine';
import { OptionGroup } from './components/OptionGroup';
import { VoeRobot } from './components/VoeRobot';
import {
  accessoryOptions,
  antennaOptions,
  armOptions,
  defaultCustomization,
  faceOptions,
  getRoomColor,
  roomOptions,
  shellOptions
} from './options';
import { getSpeechRecognition, type SpeechRecognitionLike } from './speech';
import {
  addCheckIn,
  clearAllLocalData,
  deleteCheckIn,
  loadCheckIns,
  loadCustomization,
  loadProgress,
  nextProgress,
  saveCustomization,
  saveProgress
} from './storage';
import type { CheckIn, Customization, EmotionResult, ProgressState } from './types';

const starterText = 'My day is great! How is yours?';

export function App() {
  const [transcript, setTranscript] = useState(starterText);
  const [customization, setCustomization] = useState<Customization>(defaultCustomization);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ xp: 0, parts: 0, streak: 0, lastCheckInDate: null });
  const [activeTab, setActiveTab] = useState<'checkin' | 'customize' | 'history'>('checkin');
  const [recording, setRecording] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>();
  const [notice, setNotice] = useState('Ready offline after first install.');
  const [online, setOnline] = useState(navigator.onLine);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    void Promise.all([loadCheckIns(), loadCustomization(), loadProgress()]).then(([storedCheckIns, storedCustomization, storedProgress]) => {
      setCheckIns(storedCheckIns);
      setCustomization(storedCustomization);
      setProgress(storedProgress);
    });

    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    void saveCustomization(customization);
  }, [customization]);

  const result = useMemo(() => detectEmotion(transcript), [transcript]);
  const previewResponse = useMemo(() => createResponse(result, () => 0.32), [result]);
  const currentAnimation = checkIns[0]?.result.animation ?? result.animation;
  const roomColor = getRoomColor(customization.room);
  const speechSupported = Boolean(getSpeechRecognition());

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setNotice('This browser cannot record audio, but typed check-ins still work offline.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
      };
      recorder.start();
      setRecording(true);
      setNotice('Recording locally. Nothing is uploaded.');
      startSpeechRecognition();
    } catch {
      setNotice('Microphone permission was not available. Type the check-in instead.');
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recognitionRef.current?.stop();
    setRecording(false);
    setSpeechActive(false);
    setNotice('Recording saved locally. Edit the transcript before saving the check-in.');
  }

  function startSpeechRecognition() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setNotice('Speech dictation is not available here. The transcript box is ready for offline typing.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let speechText = '';
      for (let i = 0; i < event.results.length; i += 1) {
        speechText += `${event.results[i][0].transcript} `;
      }
      setTranscript(speechText.trim());
    };
    recognition.onerror = () => {
      setSpeechActive(false);
      setNotice('Dictation stopped. You can still type or edit the transcript.');
    };
    recognition.onend = () => setSpeechActive(false);

    recognitionRef.current = recognition;
    recognition.start();
    setSpeechActive(true);
  }

  async function saveCheckIn() {
    const trimmed = transcript.trim();
    if (!trimmed) {
      setNotice('Add a transcript before saving a check-in.');
      return;
    }

    const savedResult = detectEmotion(trimmed);
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      transcript: trimmed,
      result: savedResult,
      response: createResponse(savedResult),
      audioBlob
    };

    const nextCheckIns = await addCheckIn(checkIn);
    const next = nextProgress(progress);
    await saveProgress(next);
    setCheckIns(nextCheckIns);
    setProgress(next);
    setAudioBlob(undefined);
    setNotice('Check-in saved. VoePal earned parts for today.');
  }

  async function removeCheckIn(id: string) {
    setCheckIns(await deleteCheckIn(id));
    setNotice('That local check-in and any attached audio were deleted.');
  }

  async function resetLocalData() {
    await clearAllLocalData();
    setCheckIns([]);
    setProgress({ xp: 0, parts: 0, streak: 0, lastCheckInDate: null });
    setCustomization(defaultCustomization);
    setAudioBlob(undefined);
    setNotice('Local VoePal data reset.');
  }

  function updateCustomization<K extends keyof Customization>(key: K, value: Customization[K]) {
    setCustomization((current) => ({ ...current, [key]: value }));
  }

  const audioUrl = useMemo(() => (audioBlob ? URL.createObjectURL(audioBlob) : null), [audioBlob]);

  return (
    <main className="app-shell" style={{ '--room-color': roomColor } as React.CSSProperties}>
      <section className="stage-band">
        <div className="topbar">
          <div>
            <p className="eyebrow">Voelori companion lab</p>
            <h1>VoePal</h1>
          </div>
          <div className={online ? 'status online' : 'status offline'}>
            {online ? <Wifi size={18} /> : <WifiOff size={18} />}
            <span>{online ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        <div className="hero-layout">
          <div className="robot-zone">
            <VoeRobot customization={customization} animation={currentAnimation} />
            <div className="stat-strip" aria-label="VoePal progress">
              <span><Sparkles size={16} /> {progress.xp} XP</span>
              <span><Download size={16} /> {progress.parts} parts</span>
              <span><Check size={16} /> {progress.streak} day streak</span>
            </div>
          </div>

          <div className="workspace">
            <div className="tabbar" role="tablist" aria-label="VoePal sections">
              <button className={activeTab === 'checkin' ? 'selected' : ''} onClick={() => setActiveTab('checkin')} type="button">Check-in</button>
              <button className={activeTab === 'customize' ? 'selected' : ''} onClick={() => setActiveTab('customize')} type="button">Customize</button>
              <button className={activeTab === 'history' ? 'selected' : ''} onClick={() => setActiveTab('history')} type="button">History</button>
            </div>

            {activeTab === 'checkin' ? (
              <section className="tool-panel" aria-label="Voice check-in">
                <div className="panel-header">
                  <h2>Today's signal</h2>
                  <span>{result.summary}</span>
                </div>
                <div className="controls-row">
                  <button className="primary-action" onClick={recording ? stopRecording : startRecording} type="button">
                    {recording ? <Pause size={20} /> : <Mic size={20} />}
                    <span>{recording ? 'Stop' : 'Record'}</span>
                  </button>
                  <button className="icon-action" onClick={() => setTranscript('')} title="Clear transcript" type="button">
                    <RotateCcw size={20} />
                  </button>
                  <button className="icon-action" disabled={!audioBlob} onClick={() => setAudioBlob(undefined)} title="Delete unsaved clip" type="button">
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="microcopy">
                  {speechSupported ? 'Dictation may fill the transcript when the browser supports it.' : 'Dictation is unavailable here, so type or edit the transcript.'}
                </p>
                <label className="transcript-box">
                  <span>Editable transcript</span>
                  <textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} rows={7} />
                </label>
                {audioUrl ? (
                  <audio className="audio-player" controls src={audioUrl}>
                    <track kind="captions" />
                  </audio>
                ) : null}
                <div className="result-grid">
                  <div>
                    <span className="label">Emotion</span>
                    <strong>{result.primary}</strong>
                  </div>
                  <div>
                    <span className="label">Intensity</span>
                    <strong>{result.intensity}</strong>
                  </div>
                  <div>
                    <span className="label">Animation</span>
                    <strong>{result.animation}</strong>
                  </div>
                </div>
                <div className={result.isCrisis ? 'response crisis' : 'response'}>
                  <span>VoePal says</span>
                  <p>{previewResponse}</p>
                </div>
                <button className="save-action" onClick={saveCheckIn} type="button">
                  <Save size={20} />
                  <span>Save check-in</span>
                </button>
              </section>
            ) : null}

            {activeTab === 'customize' ? (
              <section className="tool-panel" aria-label="Customize VoePal">
                <div className="panel-header">
                  <h2>Robot parts</h2>
                  <span>5 choices per slot</span>
                </div>
                <OptionGroup label="Shell" value={customization.shell} options={shellOptions} onChange={(value) => updateCustomization('shell', value)} />
                <OptionGroup label="Face" value={customization.face} options={faceOptions} onChange={(value) => updateCustomization('face', value)} />
                <OptionGroup label="Antenna" value={customization.antenna} options={antennaOptions} onChange={(value) => updateCustomization('antenna', value)} />
                <OptionGroup label="Arms" value={customization.arms} options={armOptions} onChange={(value) => updateCustomization('arms', value)} />
                <OptionGroup label="Accessory" value={customization.accessory} options={accessoryOptions} onChange={(value) => updateCustomization('accessory', value)} />
                <OptionGroup label="Room" value={customization.room} options={roomOptions} onChange={(value) => updateCustomization('room', value)} />
              </section>
            ) : null}

            {activeTab === 'history' ? (
              <section className="tool-panel" aria-label="Local history">
                <div className="panel-header">
                  <h2>Local history</h2>
                  <button className="text-action" onClick={resetLocalData} type="button">Reset local data</button>
                </div>
                <div className="trend-row">
                  {['happy', 'sad', 'hopeful', 'anxious', 'stressed'].map((emotion) => (
                    <span key={emotion}>{emotion}: {checkIns.filter((item) => item.result.primary === emotion).length}</span>
                  ))}
                </div>
                <div className="history-list">
                  {checkIns.length === 0 ? <p className="empty-state">No saved check-ins yet.</p> : null}
                  {checkIns.map((checkIn) => (
                    <article className="history-item" key={checkIn.id}>
                      <div>
                        <span className="label">{new Date(checkIn.createdAt).toLocaleString()}</span>
                        <h3>{checkIn.result.summary}</h3>
                      </div>
                      <p>{checkIn.transcript}</p>
                      <blockquote>{checkIn.response}</blockquote>
                      {checkIn.audioBlob ? <AudioBlobPlayer blob={checkIn.audioBlob} /> : null}
                      <button className="icon-action" onClick={() => void removeCheckIn(checkIn.id)} title="Delete this check-in" type="button">
                        <Trash2 size={18} />
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="notice" aria-live="polite">
              {recording ? <MicOff size={18} /> : <Check size={18} />}
              <span>{speechActive ? 'Listening for dictation. ' : ''}{notice}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AudioBlobPlayer({ blob }: { blob: Blob }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  return (
    <audio className="audio-player" controls src={url}>
      <track kind="captions" />
    </audio>
  );
}
