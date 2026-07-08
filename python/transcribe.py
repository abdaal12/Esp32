"""
backend/python/transcribe.py

The ONLY Python file in this project. Takes a .wav path as an argv,
runs faster-whisper on it, and prints {"text": "..."} as JSON to stdout
so Node (transcriptController.js) can parse it via child_process.

Usage: python3 transcribe.py <path_to_wav>
"""

import sys
import json
import os

from faster_whisper import WhisperModel

MODEL_SIZE = os.environ.get("WHISPER_MODEL_SIZE", "base")


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No wav path provided"}))
        sys.exit(1)

    wav_path = sys.argv[1]

    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    segments, _info = model.transcribe(wav_path, language="en")

    text = " ".join(segment.text.strip() for segment in segments).strip()

    print(json.dumps({"text": text}))


if __name__ == "__main__":
    main()
