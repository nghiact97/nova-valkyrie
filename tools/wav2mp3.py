# py tools/wav2mp3.py <in.wav> <out.mp3> [kbps]  (16-bit or float WAV -> MP3 via lameenc)
import sys, wave, struct, array, lameenc
src, dst = sys.argv[1], sys.argv[2]; kb = int(sys.argv[3]) if len(sys.argv) > 3 else 128
raw = open(src, 'rb').read()
fmt_i = raw.find(b'fmt '); tag, ch, sr = struct.unpack('<HHI', raw[fmt_i+8:fmt_i+16]); bits = struct.unpack('<H', raw[fmt_i+22:fmt_i+24])[0]
data_i = raw.find(b'data'); n = struct.unpack('<I', raw[data_i+4:data_i+8])[0]; pcm = raw[data_i+8:data_i+8+n]
if tag == 3 or bits == 32:
    f = array.array('f', pcm) if tag == 3 else None
    pcm = array.array('h', (max(-32768, min(32767, int(x * 32767))) for x in f)).tobytes()
e = lameenc.Encoder(); e.set_bit_rate(kb); e.set_in_sample_rate(sr); e.set_channels(ch); e.set_quality(2)
open(dst, 'wb').write(e.encode(pcm) + e.flush())
s = array.array('h', pcm); pk = max(abs(min(s)), max(s)); print(dst, sr, ch, bits, 'len', round(len(s) / ch / sr, 1), 's peak', pk)
