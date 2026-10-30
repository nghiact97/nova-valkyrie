# Builds the code graph used to scope every task (graphify, local AST only, no LLM).
#   py tools/graph_prep.py            -> analysis/game.js + analysis/anime.js, then graphify update
#   py -m graphify affected "fire" --graph analysis/graphify-out/graph.json
# game.js  = the inline <script> of src/game.html (base game)
# anime.js = the page JS that tools/anime-mock.mjs injects (the `const js = `...`` template), unescaped
import re, os, subprocess, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
out = os.path.join(root, "analysis"); os.makedirs(out, exist_ok=True)
html = open(os.path.join(root, "src", "game.html"), encoding="utf8").read()
open(os.path.join(out, "game.js"), "w", encoding="utf8").write("\n".join(re.findall(r"<script[^>]*>(.*?)</script>", html, re.S)))
mock = open(os.path.join(root, "tools", "anime-mock.mjs"), encoding="utf8").read()
i = mock.index("const js = `") + len("const js = `")
j = i
while True:  # end of the template literal = first unescaped backtick
    j = mock.index("`", j)
    if mock[j - 1] != "\\": break
    j += 1
js = mock[i:j].replace("\\`", "`").replace("\\${", "${")
open(os.path.join(out, "anime.js"), "w", encoding="utf8").write(js)
print("game.js", len(html) // 1024, "KB html ->", "anime.js", len(js) // 1024, "KB")
r = subprocess.run([sys.executable, "-m", "graphify", "update", ".", "--force"], cwd=out, capture_output=True, text=True)
print([l for l in r.stdout.splitlines() if "Rebuilt" in l or "No relevant" in l] or r.stdout[-400:])
