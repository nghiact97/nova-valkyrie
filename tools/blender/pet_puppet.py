# Headless Blender cut-out puppet for a chibi pet: body (+ blink swap) and two wings that flap around their roots.
#   blender.exe -b -P tools/blender/pet_puppet.py -- <parts_dir> <pet> <out_dir> [frames]
# Parts: <pet>_body.png, <pet>_blink.png, <pet>_wingL.png, <pet>_wingR.png (any size, transparent).
# RIG below places each part (centre x/y, height, pivot as fraction of the part image, z order) in a 2-unit square view.
import bpy, math, sys, os
a = sys.argv[sys.argv.index("--") + 1:]
parts, pet, out = a[0], a[1], a[2]; N = int(a[3]) if len(a) > 3 else 24
os.makedirs(out, exist_ok=True)
RIG = {  # x, y, height, pivot_u, pivot_v, z
    "wingL": (-0.42, 0.18, 0.95, 0.88, 0.22, -0.1),
    "wingR": (0.42, 0.18, 0.95, 0.12, 0.22, -0.1),
    "body": (0.0, -0.02, 1.45, 0.5, 0.5, 0.0),
    "blink": (0.0, -0.02, 1.45, 0.5, 0.5, 0.01),
}
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.resolution_x = sc.render.resolution_y = 384
sc.render.film_transparent = True
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "Standard"

def part(name):
    img = bpy.data.images.load(os.path.join(parts, f"{pet}_{name}.png"))
    w, h = img.size; x, y, H, pu, pv, z = RIG[name]; W = H * w / h
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    o = nt.nodes.new("ShaderNodeOutputMaterial"); tx = nt.nodes.new("ShaderNodeTexImage"); tx.image = img; tx.interpolation = "Cubic"
    em = nt.nodes.new("ShaderNodeEmission"); tr = nt.nodes.new("ShaderNodeBsdfTransparent"); mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(tx.outputs["Color"], em.inputs[0]); nt.links.new(tx.outputs["Alpha"], mix.inputs[0])
    nt.links.new(tr.outputs[0], mix.inputs[1]); nt.links.new(em.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], o.inputs[0])
    m.blend_method = "BLEND" if hasattr(m, "blend_method") else None
    # plane whose origin sits on the pivot, so rotating the object swings the part around its root
    bpy.ops.mesh.primitive_plane_add(size=1); ob = bpy.context.object; ob.name = name
    me = ob.data
    for v in me.vertices:
        v.co.x = (v.co.x + 0.5 - pu) * W; v.co.y = (v.co.y + 0.5 - pv) * H
    ob.location = (x - (0.5 - pu) * W, y - (0.5 - pv) * H, z)
    me.materials.append(m); return ob

obs = {k: part(k) for k in RIG}
cam_d = bpy.data.cameras.new("cam"); cam_d.type = "ORTHO"; cam_d.ortho_scale = 2.0
cam = bpy.data.objects.new("cam", cam_d); bpy.context.collection.objects.link(cam); cam.location = (0, 0, 5); sc.camera = cam

base = {k: (o.location.copy()) for k, o in obs.items()}
for f in range(N):
    t = f / N; ph = 2 * math.pi * t
    flap = math.sin(ph * 2)                     # two wing beats per loop
    bob = 0.05 * math.sin(ph * 2 + 0.9)         # body rises a little after each down-stroke
    sq = 1 + 0.03 * math.sin(ph * 2 + 0.9)
    obs["wingL"].rotation_euler[2] = math.radians(-28 * flap)
    obs["wingR"].rotation_euler[2] = math.radians(28 * flap)
    for k in obs:
        obs[k].location.y = base[k].y + bob
    for k in ("body", "blink"):
        obs[k].scale = (1 / sq, sq, 1)
    blink = 0.62 < t < 0.70                      # one quick blink per loop
    obs["blink"].hide_render = not blink; obs["body"].hide_render = blink
    sc.render.filepath = os.path.join(out, f"{pet}_{f:02d}.png")
    bpy.ops.render.render(write_still=True)
print("RENDERED", N, "frames", pet)
