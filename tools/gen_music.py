# Generates music with Stable Audio 3 Medium (licensed training data, Stability Community License)
# through the official Hugging Face demo Space.  py tools/gen_music.py <name> <seconds> <seed> "<prompt>"
import sys, shutil, os
from gradio_client import Client
name, secs, seed, prompt = sys.argv[1], float(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
neg = "vocals, singing, lyrics, speech, low quality, distorted, noise, muffled"
c = Client("stabilityai/stable-audio-3")
out, _ = c.predict("medium", prompt, neg, secs, 8, 1.0, "pingpong", seed, 1.0, 1.0, 6.0, True, None, 0.9, None, 0.0, 0.0, 0, api_name="/infer_advanced")
dst = os.path.join(os.path.dirname(__file__), "..", "art", "music", "src", f"{name}_s{seed}" + os.path.splitext(out)[1])
shutil.copy(out, dst); print("saved", os.path.normpath(dst), os.path.getsize(dst) // 1024, "KB")
