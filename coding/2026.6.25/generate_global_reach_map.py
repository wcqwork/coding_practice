"""
Generate a global reach infographic: dotted world map with curved dashed lines
connecting a central hub (China) to 8 destination markers.
Outputs SVG and PNG (via Pillow rendering).
"""

import math
from pathlib import Path

# ---------- Configuration ----------

WIDTH, HEIGHT = 1920, 1080
MARGIN_X, MARGIN_Y = 100, 60

# Colors
COLOR_BG = "#FFFFFF"
COLOR_MAP_DOT = "#DCE0E5"
COLOR_DEST_DOT = "#1A4F8B"
COLOR_LINE = "#5B8DB8"
COLOR_HUB_PIN = "#E53935"
COLOR_LABEL = "#1A3A5C"

# Hub location (China, ~108E, 32N)
HUB_LON, HUB_LAT = 108, 32

# Destinations: (label, lon, lat, label_anchor)
DESTINATIONS = [
    ("Europe",       12,   52,  "top"),
    ("Asia",         72,   32,  "top"),
    ("Africa",       15,    3,  "bottom"),
    ("Saudi",        46,   24,  "top"),
    ("South Africa", 26,  -30,  "bottom"),
    ("North America",-95,  42,  "top"),
    ("Brazil",      -48,  -10,  "left"),
    ("South America",-62, -30,  "bottom"),
]

# Simplified world landmass polygons (rough outlines as lon/lat point lists)
# These are simplified continental boundaries for dot-grid rendering
LAND_BOUNDS = [
    # North America
    [(-168,72),(-141,70),(-130,72),(-100,72),(-85,70),(-60,48),(-65,44),
     (-75,35),(-82,25),(-90,17),(-105,20),(-117,32),(-125,49),(-140,60),(-168,72)],
    # South America
    [(-82,10),(-75,12),(-60,5),(-35,-5),(-35,-20),(-40,-23),(-55,-34),
     (-65,-55),(-75,-50),(-75,-40),(-70,-18),(-80,0),(-82,10)],
    # Europe
    [(-10,36),(0,38),(5,44),(0,50),(-5,58),(5,62),(10,58),(15,55),(20,55),
     (25,60),(30,62),(35,60),(40,55),(30,45),(25,38),(20,36),(10,36),(-10,36)],
    # Africa
    [(-17,15),(-15,28),(-5,36),(10,37),(15,32),(25,32),(33,30),(35,12),
     (42,12),(50,2),(40,-12),(35,-25),(28,-34),(18,-35),(12,-18),(8,-5),
     (0,5),(-5,5),(-15,10),(-17,15)],
    # Asia (mainland)
    [(25,40),(30,42),(35,42),(40,45),(50,45),(55,50),(60,55),(70,55),(75,55),
     (80,50),(85,48),(90,45),(95,40),(100,35),(105,30),(110,25),(115,22),
     (120,25),(125,30),(130,35),(135,40),(140,45),(145,50),(150,55),(155,60),
     (160,65),(170,68),(180,68),(180,40),(145,35),(140,30),(130,25),(120,20),
     (110,15),(105,10),(100,15),(95,20),(90,22),(85,25),(78,8),(73,15),(68,24),
     (62,25),(55,26),(50,30),(45,35),(40,38),(35,38),(30,38),(25,40)],
    # Australia
    [(114,-12),(120,-14),(130,-12),(138,-12),(145,-15),(150,-22),(153,-28),
     (150,-35),(145,-38),(138,-36),(132,-32),(125,-33),(115,-34),(114,-25),(114,-12)],
    # Greenland (simplified)
    [(-55,60),(-45,60),(-20,65),(-18,72),(-20,78),(-35,82),(-50,82),
     (-55,78),(-55,72),(-55,60)],
]


def lon_lat_to_xy(lon, lat):
    """Convert geographic coordinates to canvas pixel coordinates."""
    x = MARGIN_X + (lon + 180) / 360 * (WIDTH - 2 * MARGIN_X)
    y = MARGIN_Y + (90 - lat) / 180 * (HEIGHT - 2 * MARGIN_Y)
    return x, y


def point_in_polygon(px, py, polygon):
    """Ray-casting algorithm to check if point is inside polygon."""
    n = len(polygon)
    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        if ((yi > py) != (yj > py)) and (px < (xj - xi) * (py - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside


def is_land(lon, lat):
    """Check if a lon/lat point falls on land."""
    for poly in LAND_BOUNDS:
        if point_in_polygon(lon, lat, poly):
            return True
    return False


def generate_dot_grid(step_lon=3, step_lat=3, dot_radius=1.5):
    """Generate SVG circles for the dotted world map."""
    dots = []
    for lat_i in range(int(-65 / step_lat), int(82 / step_lat) + 1):
        lat = lat_i * step_lat
        for lon_i in range(int(-180 / step_lon), int(180 / step_lon) + 1):
            lon = lon_i * step_lon
            if is_land(lon, lat):
                x, y = lon_lat_to_xy(lon, lat)
                dots.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{dot_radius}" fill="{COLOR_MAP_DOT}" />')
    return "\n    ".join(dots)


def quadratic_bezier_point(t, p0, p1, p2):
    """Calculate point on quadratic bezier curve at parameter t."""
    x = (1-t)**2 * p0[0] + 2*(1-t)*t * p1[0] + t**2 * p2[0]
    y = (1-t)**2 * p0[1] + 2*(1-t)*t * p1[1] + t**2 * p2[1]
    return x, y


def generate_curved_line(start, end, curve_factor=0.3, curve_down=True):
    """Generate SVG path for a curved dashed line with arrowhead."""
    sx, sy = start
    ex, ey = end

    mx, my = (sx + ex) / 2, (sy + ey) / 2
    dx, dy = ex - sx, ey - sy
    dist = math.sqrt(dx*dx + dy*dy)

    offset = dist * curve_factor
    if dist > 0:
        nx, ny = -dy / dist, dx / dist
    else:
        nx, ny = 0, -1

    # Curve direction: downward (positive y) gives sweeping effect like reference
    offset_sign = 1 if curve_down else -1

    cx = mx + nx * offset * offset_sign
    cy = my + ny * offset * offset_sign

    path = f'M {sx:.1f},{sy:.1f} Q {cx:.1f},{cy:.1f} {ex:.1f},{ey:.1f}'

    # Arrowhead near end
    t = 0.90
    px, py = quadratic_bezier_point(t, (sx, sy), (cx, cy), (ex, ey))
    angle = math.atan2(ey - py, ex - px)

    arrow_size = 9
    a1x = ex - arrow_size * math.cos(angle - 0.32)
    a1y = ey - arrow_size * math.sin(angle - 0.32)
    a2x = ex - arrow_size * math.cos(angle + 0.32)
    a2y = ey - arrow_size * math.sin(angle + 0.32)

    arrow = f'<polygon points="{ex:.1f},{ey:.1f} {a1x:.1f},{a1y:.1f} {a2x:.1f},{a2y:.1f}" fill="{COLOR_LINE}" opacity="0.9" />'

    line = f'<path d="{path}" fill="none" stroke="{COLOR_LINE}" stroke-width="1.3" stroke-dasharray="8,5" opacity="0.85" />'

    return line + "\n    " + arrow


def generate_hub_pin(x, y):
    """Generate SVG for the red location pin at hub."""
    pin_height = 30
    pin_radius = 10
    # Pin body (teardrop shape using path)
    pin = f'''<g transform="translate({x:.1f},{y:.1f})">
      <path d="M 0,-{pin_height} C -{pin_radius},-{pin_height} -{pin_radius},-{pin_height - pin_radius}  -{pin_radius},-{pin_height - pin_radius - 4}
               C -{pin_radius},-{pin_height - pin_radius - 10} 0,0 0,0
               C 0,0 {pin_radius},-{pin_height - pin_radius - 10} {pin_radius},-{pin_height - pin_radius - 4}
               C {pin_radius},-{pin_height - pin_radius} {pin_radius},-{pin_height} 0,-{pin_height} Z"
            fill="{COLOR_HUB_PIN}" />
      <circle cx="0" cy="-{pin_height - pin_radius - 2}" r="4" fill="white" />
    </g>'''
    return pin


def generate_label(x, y, text, anchor="top"):
    """Generate SVG text label near a destination dot."""
    font_size = 16
    offsets = {
        "top": (0, -14),
        "bottom": (0, 22),
        "left": (-12, 5),
        "right": (12, 5),
    }
    ox, oy = offsets.get(anchor, (0, -14))
    text_anchor = "middle"
    if anchor == "left":
        text_anchor = "end"
    elif anchor == "right":
        text_anchor = "start"

    return f'<text x="{x + ox:.1f}" y="{y + oy:.1f}" font-family="Segoe UI, Arial, sans-serif" font-size="{font_size}" fill="{COLOR_LABEL}" text-anchor="{text_anchor}" font-weight="500">{text}</text>'


def generate_svg():
    """Generate the complete SVG string."""
    hub_x, hub_y = lon_lat_to_xy(HUB_LON, HUB_LAT)

    # Build SVG parts
    dots_svg = generate_dot_grid()

    lines_svg = []
    markers_svg = []
    labels_svg = []

    # Per-destination curve tuning: (curve_factor, curve_down)
    # curve_down=True means the arc sweeps below the straight line
    curve_params = {
        "Europe": (0.15, False),
        "Asia": (0.20, False),
        "Africa": (0.20, True),
        "Saudi": (0.12, True),
        "South Africa": (0.25, True),
        "North America": (0.25, False),
        "Brazil": (0.30, True),
        "South America": (0.35, True),
    }

    for label, lon, lat, anchor in DESTINATIONS:
        dx, dy = lon_lat_to_xy(lon, lat)

        cf, cd = curve_params.get(label, (0.25, True))
        lines_svg.append(generate_curved_line((hub_x, hub_y), (dx, dy), cf, cd))
        markers_svg.append(f'<circle cx="{dx:.1f}" cy="{dy:.1f}" r="7" fill="{COLOR_DEST_DOT}" />')
        labels_svg.append(generate_label(dx, dy, label, anchor))

    hub_svg = generate_hub_pin(hub_x, hub_y)

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" width="{WIDTH}" height="{HEIGHT}">
  <rect width="{WIDTH}" height="{HEIGHT}" fill="{COLOR_BG}" />

  <!-- Dotted world map -->
  <g>
    {dots_svg}
  </g>

  <!-- Connection lines -->
  <g>
    {"    ".join(lines_svg)}
  </g>

  <!-- Destination markers -->
  <g>
    {"    ".join(markers_svg)}
  </g>

  <!-- Labels -->
  <g>
    {"    ".join(labels_svg)}
  </g>

  <!-- Hub pin -->
  {hub_svg}
</svg>'''

    return svg


def svg_to_png_pillow(svg_path, png_path):
    """Convert SVG to PNG using Pillow (parse SVG manually for basic elements)."""
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("Pillow not available, trying cairosvg...")
        return False

    img = Image.new('RGB', (WIDTH, HEIGHT), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Try to get a font
    try:
        font = ImageFont.truetype("segoeui.ttf", 18)
        font_bold = ImageFont.truetype("segoeuib.ttf", 18)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("arial.ttf", 18)
            font_bold = font
        except (OSError, IOError):
            font = ImageFont.load_default()
            font_bold = font

    hub_x, hub_y = lon_lat_to_xy(HUB_LON, HUB_LAT)

    # Draw dot grid
    for lat_i in range(int(-65 / 3), int(82 / 3) + 1):
        lat = lat_i * 3
        for lon_i in range(int(-180 / 3), int(180 / 3) + 1):
            lon = lon_i * 3
            if is_land(lon, lat):
                x, y = lon_lat_to_xy(lon, lat)
                r = 1.5
                draw.ellipse([x-r, y-r, x+r, y+r], fill=(220, 224, 229))

    # Per-destination curve tuning
    curve_params = {
        "Europe": (0.15, False),
        "Asia": (0.20, False),
        "Africa": (0.20, True),
        "Saudi": (0.12, True),
        "South Africa": (0.25, True),
        "North America": (0.25, False),
        "Brazil": (0.30, True),
        "South America": (0.35, True),
    }

    # Draw curved dashed lines
    for label, lon, lat, anchor in DESTINATIONS:
        dx, dy = lon_lat_to_xy(lon, lat)
        cf, cd = curve_params.get(label, (0.25, True))

        sx, sy = hub_x, hub_y
        ex, ey = dx, dy
        mx, my = (sx + ex) / 2, (sy + ey) / 2
        ddx, ddy = ex - sx, ey - sy
        d = math.sqrt(ddx*ddx + ddy*ddy)
        offset = d * cf
        if d > 0:
            nx, ny = -ddy / d, ddx / d
        else:
            nx, ny = 0, -1

        offset_sign = 1 if cd else -1

        cx = mx + nx * offset * offset_sign
        cy = my + ny * offset * offset_sign

        # Draw bezier as series of points (dashed)
        points = []
        for i in range(101):
            t = i / 100.0
            px = (1-t)**2 * sx + 2*(1-t)*t * cx + t**2 * ex
            py = (1-t)**2 * sy + 2*(1-t)*t * cy + t**2 * ey
            points.append((px, py))

        # Draw dashed line
        line_color = (91, 141, 184)
        dash_len = 10
        gap_len = 6
        accumulated = 0
        drawing = True
        for i in range(1, len(points)):
            seg_len = math.sqrt((points[i][0]-points[i-1][0])**2 + (points[i][1]-points[i-1][1])**2)
            accumulated += seg_len
            if drawing:
                draw.line([points[i-1], points[i]], fill=line_color, width=2)
            if drawing and accumulated >= dash_len:
                drawing = False
                accumulated = 0
            elif not drawing and accumulated >= gap_len:
                drawing = True
                accumulated = 0

        # Arrowhead
        t = 0.92
        px = (1-t)**2 * sx + 2*(1-t)*t * cx + t**2 * ex
        py = (1-t)**2 * sy + 2*(1-t)*t * cy + t**2 * ey
        angle = math.atan2(ey - py, ex - px)
        arrow_size = 10
        a1x = ex - arrow_size * math.cos(angle - 0.4)
        a1y = ey - arrow_size * math.sin(angle - 0.4)
        a2x = ex - arrow_size * math.cos(angle + 0.4)
        a2y = ey - arrow_size * math.sin(angle + 0.4)
        draw.polygon([(ex, ey), (a1x, a1y), (a2x, a2y)], fill=line_color)

    # Draw destination dots
    for label, lon, lat, anchor in DESTINATIONS:
        dx, dy = lon_lat_to_xy(lon, lat)
        r = 7
        draw.ellipse([dx-r, dy-r, dx+r, dy+r], fill=(26, 79, 139))

    # Draw labels
    for label, lon, lat, anchor in DESTINATIONS:
        dx, dy = lon_lat_to_xy(lon, lat)
        offsets = {"top": (0, -22), "bottom": (0, 16), "left": (-16, 0), "right": (16, 0)}
        ox, oy = offsets.get(anchor, (0, -22))
        tx, ty = dx + ox, dy + oy

        try:
            bbox = draw.textbbox((0, 0), label, font=font_bold)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
        except AttributeError:
            tw, th = draw.textsize(label, font=font_bold)

        if anchor in ("top", "bottom"):
            tx -= tw / 2
        elif anchor == "left":
            tx -= tw
        if anchor == "top":
            ty -= th

        draw.text((tx, ty), label, fill=(26, 58, 92), font=font_bold)

    # Draw hub pin (larger and more visible)
    pin_h = 32
    pin_r = 11
    # Draw pin body (filled circle at top)
    draw.ellipse([hub_x - pin_r, hub_y - pin_h - pin_r, hub_x + pin_r, hub_y - pin_h + pin_r],
                 fill=(229, 57, 53))
    # Pin point (triangle)
    draw.polygon([(hub_x - pin_r + 3, hub_y - pin_h + 3),
                  (hub_x + pin_r - 3, hub_y - pin_h + 3),
                  (hub_x, hub_y)], fill=(229, 57, 53))
    # White inner circle
    inner_r = 5
    draw.ellipse([hub_x - inner_r, hub_y - pin_h - inner_r, hub_x + inner_r, hub_y - pin_h + inner_r],
                 fill=(255, 255, 255))

    img.save(png_path, "PNG", dpi=(150, 150))
    print(f"PNG saved to: {png_path}")
    return True


def main():
    output_dir = Path(__file__).parent
    svg_path = output_dir / "global-reach-map.svg"
    png_path = output_dir / "global-reach-map.png"

    # Generate SVG
    svg_content = generate_svg()
    svg_path.write_text(svg_content, encoding="utf-8")
    print(f"SVG saved to: {svg_path}")

    # Generate PNG
    success = svg_to_png_pillow(svg_path, png_path)
    if not success:
        try:
            import cairosvg
            cairosvg.svg2png(url=str(svg_path), write_to=str(png_path),
                           output_width=WIDTH, output_height=HEIGHT)
            print(f"PNG saved (cairosvg) to: {png_path}")
        except ImportError:
            print("Neither Pillow nor cairosvg available.")
            print("Please install one: pip install Pillow  or  pip install cairosvg")


if __name__ == "__main__":
    main()
