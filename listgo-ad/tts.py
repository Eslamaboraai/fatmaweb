#!/usr/bin/env python3
"""Generate the Egyptian-Arabic voiceover with Gemini TTS and write timings.js.

Usage:
  GOOGLE_API_KEY=... python3 tts.py      # synthesize voice, then write timings
  python3 tts.py --no-audio               # estimated timings only (silent preview)

The key is read from the environment only; it is never written to disk.
Several keys can be given comma-separated; a rate-limited key falls through to the next.
Tries Google AI Studio first, then Vertex AI.
"""
import base64, json, os, sys, time, urllib.error, urllib.request, wave

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(HERE, "audio")
RATE = 24000
LEAD = 0.15     # silence before a scene's line starts
PAD = 0.75      # breathing room after the line (includes the 0.5s transition)
MODELS = [m for m in os.environ.get("TTS_MODELS", "").split(",") if m] or [
    "gemini-2.5-flash-preview-tts", "gemini-2.5-pro-preview-tts",
    "gemini-2.5-flash-tts", "gemini-2.5-pro-tts",
]


def endpoints(model, key):
    vertex = f"https://aiplatform.googleapis.com/v1/publishers/google/models/{model}:generateContent"
    studio = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    return [studio, vertex]


HITS = {}


def synth_any(text, style, voice, keys):
    """Try each key in turn (comma-separated GOOGLE_API_KEY), so a rate-limited key falls through."""
    for i, key in enumerate(keys):
        try:
            return synth(text, style, voice, key, HITS.setdefault(key, {}))
        except SystemExit as e:
            if i == len(keys) - 1:
                raise
            print(f"  key {i + 1} failed, trying the next one", file=sys.stderr)


def synth(text, style, voice, key, cache):
    body = json.dumps({
        "contents": [{"role": "user", "parts": [{"text": f"{style}\n\nالنص:\n{text}"}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}},
        },
    }).encode()
    tries = [cache["hit"]] if "hit" in cache else [(u, m) for m in MODELS for u in endpoints(m, key)]
    errors = []
    for url, model in tries:
        for attempt in range(3):
            req = urllib.request.Request(url, body, {"Content-Type": "application/json", "x-goog-api-key": key})
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    data = json.load(r)
                part = data["candidates"][0]["content"]["parts"][0]["inlineData"]
                cache["hit"] = (url, model)
                return base64.b64decode(part["data"]), model
            except urllib.error.HTTPError as e:
                msg = e.read().decode(errors="replace")[:300]
                if e.code in (429, 500, 503) and attempt < 2:
                    time.sleep(30 if e.code == 429 else 5); continue
                errors.append(f"{model} @ {url.split('/')[2]}: HTTP {e.code} {msg}")
                break
            except (KeyError, IndexError) as e:
                errors.append(f"{model}: unexpected response ({e})"); break
    sys.exit("TTS failed:\n  " + "\n  ".join(errors))


def write_wav(path, pcm):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(pcm)


def estimate(text):
    return len(text.split()) / 2.6 + 0.4


def main():
    cfg = json.load(open(os.path.join(HERE, "scenes.json"), encoding="utf-8"))
    key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    use_audio = "--no-audio" not in sys.argv
    if use_audio and not key:
        sys.exit("Set GOOGLE_API_KEY (or pass --no-audio for a silent preview).")
    keys = [k.strip() for k in (key or "").split(",") if k.strip()]
    os.makedirs(AUDIO, exist_ok=True)

    timeline, track, t = [], bytearray(), 0.0
    for sc in cfg["scenes"]:
        if use_audio:
            wav = os.path.join(AUDIO, f"{sc['id']}.wav")
            stamp = os.path.join(AUDIO, f"{sc['id']}.txt")
            sig = cfg["voice"]["name"] + "|" + cfg["voice"]["style"] + "|" + sc["vo"]
            if os.path.exists(wav) and os.path.exists(stamp) and open(stamp, encoding="utf-8").read() == sig:
                with wave.open(wav) as w:
                    pcm, model = w.readframes(w.getnframes()), "cached"
            else:
                pcm, model = synth_any(sc["vo"], cfg["voice"]["style"], cfg["voice"]["name"], keys)
                write_wav(wav, pcm)
                open(stamp, "w", encoding="utf-8").write(sig)
            speech = len(pcm) / 2 / RATE
            print(f"{sc['id']:9s} {speech:5.2f}s  ({model})", flush=True)
        else:
            pcm, speech = b"", estimate(sc["vo"])
        dur = max(3.5, LEAD + speech + PAD + sc.get("tail", 0))
        timeline.append({"id": sc["id"], "start": round(t, 3), "dur": round(dur, 3),
                         "caption": sc["caption"], "speech": round(speech, 3)})
        if use_audio:
            track += b"\0\0" * int(LEAD * RATE) + pcm
            track += b"\0\0" * (int(round((t + dur) * RATE)) - len(track) // 2)
        t += dur

    if use_audio:
        write_wav(os.path.join(AUDIO, "voice.wav"), bytes(track))
    with open(os.path.join(HERE, "timings.js"), "w", encoding="utf-8") as f:
        f.write("window.TIMINGS = " + json.dumps(
            {"total": round(t, 3), "audio": "audio/voice.wav" if use_audio else None, "scenes": timeline},
            ensure_ascii=False, indent=1) + ";\n")
    print(f"total {t:.2f}s -> timings.js")


if __name__ == "__main__":
    main()
