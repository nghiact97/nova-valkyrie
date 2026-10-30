# Headless Blender: anime magic circle (full gear set aura), seen from straight above, seamless 24-frame loop.
#   blender.exe -b -P tools/blender/magic_circle.py -- <out_dir> <hex colour> <name>
# Layers: outer ring + 12 diamond ticks (turns 30 deg per loop), dashed middle ring (turns -45 deg),
# hexagram + inner ring (turns 60 deg). Each layer turns by its own symmetry angle, so frame 24 == frame 0.
import bpy, math, sys, os
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out = argv[0] if argv else "build/blender"; col = argv[1] if len(argv) > 1 else "ffc83d"; name = argv[2] if len(argv) > 2 else "solar"
os.makedirs(out, exist_ok=True)
rgb = tuple(int(col[i:i + 2], 16) / 255 for i in (0, 2, 4))
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.resolution_x = sc.render.resolution_y = 384
sc.render.film_transparent = True
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "Standard"

def emit(name, c, strength=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    o = nt.nodes.new("ShaderNodeOutputMaterial"); e = nt.nodes.new("ShaderNodeEmission")
    e.inputs[0].default_value = (*c, 1); e.inputs[1].default_value = strength; nt.links.new(e.outputs[0], o.inputs[0]); return m

M_main = emit("main", rgb, 1.0)
M_hot = emit("hot", tuple(min(1, v * 0.4 + 0.6) for v in rgb), 1.0)   # whiter core lines

def ring(r, w, mat, parent):
    bpy.ops.mesh.primitive_circle_add(vertices=128, radius=r, fill_type="NOTHING")
    o = bpy.context.object; o.data.materials.append(mat)
    sk = o.modifiers.new("w", "SKIN"); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.object.mode_set(mode="OBJECT")
    o.modifiers.remove(sk)
    bpy.ops.object.convert(target="CURVE"); o = bpy.context.object; o.data.bevel_depth = w; o.data.materials.clear(); o.data.materials.append(mat)
    o.parent = parent; return o

def poly(points, mat, parent, w=0.0):
    cu = bpy.data.curves.new("p", "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("POLY"); sp.points.add(len(points) - 1)
    for i, (x, y) in enumerate(points): sp.points[i].co = (x, y, 0, 1)
    sp.use_cyclic_u = True; cu.bevel_depth = w; o = bpy.data.objects.new("p", cu); bpy.context.collection.objects.link(o)
    if w == 0:  # filled shape
        cu.dimensions = "2D"; cu.fill_mode = "BOTH"
    o.data.materials.append(mat); o.parent = parent; return o

def pivot(n):
    e = bpy.data.objects.new(n, None); bpy.context.collection.objects.link(e); return e

P1, P2, P3 = pivot("outer"), pivot("mid"), pivot("inner")
# outer: double ring + 12 diamonds + 24 small ticks
ring(1.0, 0.012, M_main, P1); ring(0.93, 0.006, M_main, P1)
for i in range(12):
    a = i / 12 * 2 * math.pi; cx, cy = 0.965 * math.cos(a), 0.965 * math.sin(a); s = 0.045
    pts = [(cx + s * math.cos(a), cy + s * math.sin(a)), (cx + s * .5 * math.cos(a + math.pi / 2), cy + s * .5 * math.sin(a + math.pi / 2)),
           (cx - s * math.cos(a), cy - s * math.sin(a)), (cx + s * .5 * math.cos(a - math.pi / 2), cy + s * .5 * math.sin(a - math.pi / 2))]
    poly(pts, M_hot, P1)
for i in range(24):
    a = (i + .5) / 24 * 2 * math.pi
    poly([(0.9 * math.cos(a), 0.9 * math.sin(a)), (0.86 * math.cos(a), 0.86 * math.sin(a))], M_main, P1, 0.004)
# middle: dashed ring (16 arcs)
for i in range(16):
    a0 = i / 16 * 2 * math.pi; pts = [(0.74 * math.cos(a0 + t / 10 * 0.28), 0.74 * math.sin(a0 + t / 10 * 0.28)) for t in range(11)]
    cu = bpy.data.curves.new("d", "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
    for j, (x, y) in enumerate(pts): sp.points[j].co = (x, y, 0, 1)
    cu.bevel_depth = 0.01; o = bpy.data.objects.new("d", cu); bpy.context.collection.objects.link(o); o.data.materials.append(M_main); o.parent = P2
# inner: hexagram + ring + small centre diamond
for k in (0, 1):
    poly([(0.6 * math.cos(math.pi / 2 + k * math.pi / 3 + j * 2 * math.pi / 3), 0.6 * math.sin(math.pi / 2 + k * math.pi / 3 + j * 2 * math.pi / 3)) for j in range(3)], M_main, P3, 0.008)
ring(0.6, 0.008, M_main, P3); ring(0.3, 0.006, M_hot, P3)

bpy.ops.object.camera_add(location=(0, 0, 5)); cam = bpy.context.object; cam.data.type = "ORTHO"; cam.data.ortho_scale = 2.15; sc.camera = cam

N = 24
for f in range(N):
    t = f / N
    P1.rotation_euler[2] = t * math.radians(30); P2.rotation_euler[2] = -t * math.radians(45); P3.rotation_euler[2] = t * math.radians(60)
    sc.render.filepath = os.path.join(out, f"magic_{name}_{f:02d}.png")
    bpy.ops.render.render(write_still=True)
print("RENDERED", N, "frames", name)
