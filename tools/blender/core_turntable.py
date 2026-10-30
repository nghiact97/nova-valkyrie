# Headless Blender demo: a cel-shaded energy core (crystal + 2 rings) rendered as an 8-frame turntable sprite strip.
#   "D:\Programs\Blender\Blender Foundation\Blender 5.2\blender.exe" -b -P tools/blender/core_turntable.py -- <out_dir>
import bpy, math, sys, os
out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "build/blender"
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items] else "BLENDER_EEVEE"
sc.render.resolution_x = sc.render.resolution_y = 256
sc.render.film_transparent = True
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "Standard"

def toon(name, base, glow=0.0):
    """two-step cel shading: Diffuse -> Shader to RGB -> constant ramp, plus emission for the glowing parts"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    o = nt.nodes.new("ShaderNodeOutputMaterial"); d = nt.nodes.new("ShaderNodeBsdfDiffuse"); s2r = nt.nodes.new("ShaderNodeShaderToRGB")
    ramp = nt.nodes.new("ShaderNodeValToRGB"); ramp.color_ramp.interpolation = "CONSTANT"
    ramp.color_ramp.elements[0].color = [c * 0.55 for c in base[:3]] + [1]; ramp.color_ramp.elements[1].position = 0.45; ramp.color_ramp.elements[1].color = list(base[:3]) + [1]
    em = nt.nodes.new("ShaderNodeEmission"); add = nt.nodes.new("ShaderNodeAddShader")
    nt.links.new(d.outputs[0], s2r.inputs[0]); nt.links.new(s2r.outputs[0], ramp.inputs[0])
    nt.links.new(ramp.outputs[0], em.inputs[0]); em.inputs[1].default_value = 1.0
    if glow:
        g = nt.nodes.new("ShaderNodeEmission"); g.inputs[0].default_value = list(base[:3]) + [1]; g.inputs[1].default_value = glow
        nt.links.new(em.outputs[0], add.inputs[0]); nt.links.new(g.outputs[0], add.inputs[1]); nt.links.new(add.outputs[0], o.inputs[0])
    else:
        nt.links.new(em.outputs[0], o.inputs[0])
    return m

def outline(obj, w=0.04):
    """inverted-hull outline: solidify with flipped normals + backface-culled black material"""
    mat = bpy.data.materials.new("outline"); mat.use_nodes = True; nt = mat.node_tree; nt.nodes.clear()
    o = nt.nodes.new("ShaderNodeOutputMaterial"); e = nt.nodes.new("ShaderNodeEmission"); e.inputs[0].default_value = (0.02, 0.03, 0.08, 1)
    nt.links.new(e.outputs[0], o.inputs[0]); mat.use_backface_culling = True
    obj.data.materials.append(mat)
    s = obj.modifiers.new("ol", "SOLIDIFY"); s.thickness = w; s.offset = 1; s.use_flip_normals = True; s.material_offset = len(obj.data.materials) - 1

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.6); core = bpy.context.object
core.scale = (0.8, 0.8, 1.25); core.data.materials.append(toon("crystal", (0.37, 0.91, 1.0), glow=1.2)); outline(core)
rings = []
for i, (r, tilt, col) in enumerate([(1.05, 70, (1.0, 0.44, 0.68)), (1.3, -60, (1.0, 0.78, 0.24))]):
    bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.05, major_segments=48, minor_segments=8)
    t = bpy.context.object; t.rotation_euler = (math.radians(tilt), math.radians(20 * i), 0)
    t.data.materials.append(toon(f"ring{i}", col, glow=0.6)); outline(t, 0.025); rings.append(t)

bpy.ops.object.camera_add(location=(0, -5.2, 1.6)); cam = bpy.context.object
cam.rotation_euler = (math.radians(73), 0, 0); cam.data.type = "ORTHO"; cam.data.ortho_scale = 3.4; sc.camera = cam
bpy.ops.object.light_add(type="SUN", rotation=(math.radians(45), math.radians(-30), math.radians(30))); bpy.context.object.data.energy = 3

N = 8
for f in range(N):
    a = f / N * 2 * math.pi
    core.rotation_euler[2] = a
    rings[0].rotation_euler[2] = a * 1.0; rings[1].rotation_euler[2] = -a * 1.5
    sc.render.filepath = os.path.join(out, f"core_{f}.png")
    bpy.ops.render.render(write_still=True)
print("RENDERED", N, "frames to", out)
