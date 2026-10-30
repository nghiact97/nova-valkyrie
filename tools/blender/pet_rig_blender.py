# Blender side of tools/blender/pet_rig.py: stacks the layered parts as image planes and animates a seamless loop.
#   blender.exe -b -P pet_rig_blender.py -- <parts_dir> <pet> <out_dir> <frames> <rig.json>
import bpy, json, math, os, sys
a = sys.argv[sys.argv.index("--") + 1:]
parts, pet, out, N, rp = a[0], a[1], a[2], int(a[3]), a[4]
rig = json.load(open(rp)); W, H = rig["size"]; bb = rig["body_bbox"]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.resolution_x = sc.render.resolution_y = 384
sc.render.film_transparent = True
sc.render.engine = "CYCLES"; sc.cycles.samples = 16; sc.cycles.use_denoising = False; sc.cycles.device = "CPU"   # EEVEE mis-sorts stacked alpha planes
sc.cycles.transparent_max_bounces = 16
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "Standard"
S = 2.0 / max(W, H)  # canvas -> world units (canvas fills a 2-unit square)

def plane(name, z, pivot):
    img = bpy.data.images.load(os.path.join(parts, f"{pet}_{name}.png"))
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    o = nt.nodes.new("ShaderNodeOutputMaterial"); tx = nt.nodes.new("ShaderNodeTexImage"); tx.image = img; tx.interpolation = "Cubic"
    em = nt.nodes.new("ShaderNodeEmission"); tr = nt.nodes.new("ShaderNodeBsdfTransparent"); mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(tx.outputs["Color"], em.inputs[0]); nt.links.new(tx.outputs["Alpha"], mix.inputs[0])
    nt.links.new(tr.outputs[0], mix.inputs[1]); nt.links.new(em.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], o.inputs[0])
    bpy.ops.mesh.primitive_plane_add(size=1); ob = bpy.context.object; ob.name = name
    pu, pv = pivot  # pivot in canvas fractions (v from the top)
    for v in ob.data.vertices:
        v.co.x = (v.co.x + 0.5 - pu) * W * S; v.co.y = (v.co.y - 0.5 + pv) * H * S
    ob.location = ((pu - 0.5) * W * S, (0.5 - pv) * H * S, z)
    ob.data.materials.append(m); return ob

# workaround: in this Blender build the first image texture a scene uses renders black, so burn it on a hidden dummy plane
_d = plane("body", -5.0, (0.5, 0.5)); _d.name = "dummy"; _d.hide_render = True; _d.location.z = -50
rootE = bpy.data.objects.new("root", None); bpy.context.collection.objects.link(rootE)
obs = {}
for p in rig["parts"]:
    obs[p["name"]] = plane(p["name"], -0.1 if p["behind"] else 0.1, p["pivot"]); obs[p["name"]].parent = rootE
cx = (bb[0] + bb[2]) / 2 / W; cy = (bb[1] + bb[3]) / 2 / H
for n in ("body", "blink"):
    obs[n] = plane(n, 0.0, (cx, cy)); obs[n].parent = rootE

cam_d = bpy.data.cameras.new("cam"); cam_d.type = "ORTHO"; cam_d.ortho_scale = 2.05
cam = bpy.data.objects.new("cam", cam_d); bpy.context.collection.objects.link(cam); cam.location = (0, 0, 5); sc.camera = cam

AMP = {"wing": 26, "arm": 18, "fin": 20, "ear": 12, "tail": 14}
for f in range(N):
    t = f / N; ph = 2 * math.pi * t; beat = math.sin(ph * 2)
    rootE.location.y = 0.045 * math.sin(ph * 2 + 0.9)
    sq = 1 + 0.03 * math.sin(ph * 2 + 0.9)
    for n in ("body", "blink"): obs[n].scale = (1 / sq, sq, 1)
    for p in rig["parts"]:
        ob, k, sd = obs[p["name"]], p["kind"], p["side"]
        if k == "mane":
            s = 1 + 0.05 * math.sin(ph * 2); ob.scale = (s, s, 1); ob.rotation_euler[2] = math.radians(4 * math.sin(ph))
        elif k == "tail":
            ob.rotation_euler[2] = math.radians(AMP[k] * math.sin(ph))
        elif k == "ear":
            ob.rotation_euler[2] = math.radians(AMP[k] * math.sin(ph * 2 + (0.6 if sd == "R" else 0)) * (-1 if sd == "L" else 1))
        else:
            ob.rotation_euler[2] = math.radians(AMP.get(k, 18) * beat * (-1 if sd == "L" else 1))
    blink = 0.62 < t < 0.70
    obs["blink"].hide_render = not blink; obs["body"].hide_render = blink
    sc.render.filepath = os.path.join(out, f"{pet}_{f:02d}.png")
    bpy.ops.render.render(write_still=True)
print("RENDERED", N, "frames", pet)
if os.environ.get("RIGDBG"):
    for o in bpy.data.objects:
        if o.type == "MESH":
            ws = [o.matrix_world @ v.co for v in o.data.vertices]
            print("DBG", o.name, o.hide_render, [m.name for m in o.data.materials], "x", round(min(v.x for v in ws),2), round(max(v.x for v in ws),2), "y", round(min(v.y for v in ws),2), round(max(v.y for v in ws),2), "z", round(ws[0].z,2))
