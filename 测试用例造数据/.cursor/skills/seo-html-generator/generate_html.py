#!/usr/bin/env python3
"""Generate SEO test HTML files aligned with data/SEO评分维度.md"""

from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parents[3] / "测试用例htm"

BASE_URL = "https://example.com/product/cabinet-hinges"
HTTP_URL = "http://example.com/product/general-hardware"

TITLE_BASE = "Best Cabinet Hinges for Furniture Hardware"
META_BASE = (
    "Discover premium cabinet hinges for your furniture projects. "
    "Our high-quality cabinet hinges offer smooth operation, durable construction, "
    "and easy installation for cabinets and drawers."
)
H1_BASE = "Cabinet Hinges Hardware Solutions"

BODY_PARAS_FULL = [
    (
        "When it comes to building or renovating furniture, choosing the right cabinet hinges "
        "is essential for both functionality and longevity. Our premium selection of cabinet hinges "
        "provides reliable performance that professional woodworkers and DIY enthusiasts trust "
        "for their most important projects. Whether you are installing new kitchen cabinets or "
        "upgrading existing furniture pieces, quality hinges make all the difference in smooth "
        "door operation and long-term durability."
    ),
    (
        "We carry a comprehensive range of cabinet hinges designed for various applications. "
        "From concealed hinges that provide a clean, modern look to decorative butt hinges that "
        "add a touch of traditional elegance, our inventory covers every need. Each type of cabinet "
        "hinge in our catalog has been tested for thousands of open-close cycles to ensure lasting "
        "quality and smooth operation throughout years of daily use."
    ),
    (
        "Installing cabinet hinges correctly is crucial for proper door alignment and smooth operation. "
        "Our detailed guide walks you through every step of the process, from measuring and marking "
        "to final adjustment. With the right tools and our step-by-step instructions, even first-time "
        "installers can achieve professional results. The key is precise positioning of the hinge "
        "plates on both the cabinet frame and the door, followed by careful adjustment of the tension "
        "screws for perfect closing action."
    ),
    (
        "For a successful cabinet hinges installation, gather a power drill, appropriate drill bits, "
        "a screwdriver set, a measuring tape, and a level. Having these tools ready before you start "
        "will make the entire process smoother and more efficient. We also recommend using a hinge "
        "jig for consistent placement across multiple doors."
    ),
    (
        "Our cabinet hinges are manufactured using high-grade steel and advanced coating technology "
        "that resists corrosion and wear. Each hinge undergoes rigorous quality control testing before "
        "it reaches your hands. We source materials from certified suppliers and maintain strict "
        "manufacturing tolerances to ensure every piece performs flawlessly. Customers across the "
        "furniture industry rely on our hardware components for both residential and commercial projects, "
        "knowing that our products deliver consistent quality at competitive prices."
    ),
    (
        'Beyond cabinet hinges, we also offer a complete line of complementary hardware including '
        '<a href="https://example.com/products/drawer-slides">drawer slides</a>, knobs, pulls, '
        "and other furniture accessories. Our commitment to quality and customer satisfaction has made "
        "us a trusted name in the hardware supply industry for over fifteen years."
    ),
    (
        "To keep your cabinet hinges functioning properly for years, periodic maintenance is recommended. "
        "Apply a small amount of lubricant to the hinge pins annually, and check that all screws remain "
        "tight. If you notice any squeaking or stiffness, a quick adjustment of the hinge tension usually "
        "resolves the issue. With proper care, quality cabinet hinges will provide decades of reliable "
        "service in any furniture application."
    ),
]

BODY_PARAS_NO_KW = [
    (
        "When it comes to building or renovating furniture, choosing the right hardware components "
        "is essential for both functionality and longevity. Our premium selection of door fasteners "
        "provides reliable performance that professional woodworkers and DIY enthusiasts trust "
        "for their most important projects."
    ),
    (
        "We carry a comprehensive range of furniture hardware designed for various applications. "
        "From concealed fasteners that provide a clean, modern look to decorative butt fittings "
        "that add a touch of traditional elegance, our inventory covers every need."
    ),
    (
        "Installing door hardware correctly is crucial for proper door alignment and smooth operation. "
        "Our detailed guide walks you through every step of the process, from measuring and marking "
        "to final adjustment."
    ),
    (
        "For a successful hardware installation, gather a power drill, appropriate drill bits, "
        "a screwdriver set, a measuring tape, and a level."
    ),
    (
        "Our door fittings are manufactured using high-grade steel and advanced coating technology "
        "that resists corrosion and wear. Each piece undergoes rigorous quality control testing."
    ),
    (
        'Beyond door mechanisms, we also offer complementary hardware including '
        '<a href="https://example.com/products/drawer-slides">drawer slides</a>, knobs, and pulls.'
    ),
    (
        "To keep your furniture hardware functioning properly for years, periodic maintenance is recommended."
    ),
]

IMG_MAIN = '<img src="https://example.com/images/cabinet-hinges-main.jpg" alt="Premium cabinet hinges installed on wooden furniture">'
IMG_TYPES = '<img src="https://example.com/images/hinge-types.jpg" alt="Different types of cabinet hinges including concealed and butt hinges">'
IMG_TOOLS = '<img src="https://example.com/images/installation-tools.jpg" alt="Tools needed for cabinet hinges installation including drill and screwdriver">'


def head_block(
    title=TITLE_BASE,
    meta=META_BASE,
    page_type="产品详情页",
    canonical=BASE_URL,
    robots=None,
    og_title=None,
    og_desc=None,
    og_image=True,
    twitter=True,
    hreflang=True,
    json_ld=True,
    microdata=False,
    rdfa=False,
    extra_head="",
):
    parts = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    ]
    if title is not None:
        parts.append(f"    <title>{title}</title>")
    if meta is not None:
        parts.append(f'    <meta name="description" content="{meta}">')
    parts.append(f'    <meta name="pageType" content="{page_type}">')
    if robots:
        parts.append(f'    <meta name="robots" content="{robots}">')
    if canonical is not None:
        if isinstance(canonical, list):
            for c in canonical:
                parts.append(f'    <link rel="canonical" href="{c}">')
        else:
            parts.append(f'    <link rel="canonical" href="{canonical}">')
    if og_title is not False and og_desc is not False:
        ot = og_title or title or TITLE_BASE
        od = og_desc or meta or META_BASE
        parts.append(f'    <meta property="og:title" content="{ot}">')
        parts.append(f'    <meta property="og:description" content="{od}">')
        if og_image:
            parts.append('    <meta property="og:image" content="https://example.com/images/cabinet-hinges.jpg">')
        if twitter:
            parts.append('    <meta name="twitter:card" content="summary_large_image">')
    if hreflang:
        parts.append(f'    <link rel="alternate" hreflang="en" href="{BASE_URL}">')
        parts.append(f'    <link rel="alternate" hreflang="zh" href="https://example.com/zh/product/cabinet-hinges">')
        parts.append(f'    <link rel="alternate" hreflang="x-default" href="{BASE_URL}">')
    elif hreflang is None:
        parts.append(f'    <link rel="alternate" hreflang="en" href="{HTTP_URL}">')
        parts.append(f'    <link rel="alternate" hreflang="zh" href="http://example.com/zh/product/general-hardware">')
    if json_ld:
        parts.append(
            """    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Premium Cabinet Hinges",
        "description": "High-quality cabinet hinges for furniture",
        "image": "https://example.com/images/cabinet-hinges.jpg",
        "brand": { "@type": "Brand", "name": "HardwarePro" },
        "offers": { "@type": "Offer", "price": "12.99", "priceCurrency": "USD" }
    }
    </script>"""
        )
    if extra_head:
        parts.append(extra_head)
    parts.append("</head>")
    return "\n".join(parts)


def nav_block(http=False):
    scheme = "http" if http else "https"
    return f"""    <header>
        <nav>
            <a href="{scheme}://example.com">Home</a>
            <a href="{scheme}://example.com/products">Products</a>
            <a href="{scheme}://example.com/products/hardware">Hardware Supplies</a>
        </nav>
    </header>"""


def footer_block(http=False, link=True):
    scheme = "http" if http else "https"
    link_html = (
        f'        <a href="{scheme}://example.com/products/cabinet-hinges">Cabinet Hinges Collection</a>\n'
        if link
        else ""
    )
    return f"""    <footer>
        <p>&copy; 2024 HardwarePro. All rights reserved.</p>
{link_html}    </footer>"""


def main_structure(
    h1=H1_BASE,
    h1_empty=False,
    h1_multi=None,
    headings=None,
    body_paras=None,
    imgs=None,
    inner_link='drawer slides',
    http=False,
):
    """Build main content. headings: list of (level, text) e.g. [(2,'Types'), (3,'Tools')]"""
    if body_paras is None:
        body_paras = BODY_PARAS_FULL
    if headings is None:
        headings = [
            (2, "Types of Cabinet Hinges We Offer"),
            (2, "Installation Guide"),
            (3, "Tools Needed"),
            (2, "Why Choose Our Hardware"),
            (2, "Maintenance Tips"),
        ]
    if imgs is None:
        imgs = [IMG_MAIN, IMG_TYPES, IMG_TOOLS]

    parts = ["    <main>"]
    if h1 is not None:
        if h1_empty:
            parts.append("        <h1></h1>")
        else:
            parts.append(f"        <h1>{h1}</h1>")
    if h1_multi:
        for extra in h1_multi:
            parts.append(f"        <h1>{extra}</h1>")

    parts.append(f"        <p>{body_paras[0]}</p>")
    img_i = 0
    if imgs and img_i < len(imgs) and imgs[img_i]:
        parts.append(f"        {imgs[img_i]}")
        img_i += 1

    para_i = 1
    for level, text in headings:
        parts.append(f"        <h{level}>{text}</h{level}>")
        if para_i < len(body_paras):
            p = body_paras[para_i]
            if inner_link == "click here" and para_i == 5:
                p = p.replace("drawer slides", "click here").replace(
                    '<a href="https://example.com/products/drawer-slides">click here</a>',
                    '<a href="https://example.com/products/drawer-slides">click here</a>',
                )
            parts.append(f"        <p>{p}</p>")
            para_i += 1
        if img_i < len(imgs) and imgs[img_i] and level in (2, 3):
            parts.append(f"        {imgs[img_i]}")
            img_i += 1

    while para_i < len(body_paras):
        p = body_paras[para_i]
        if inner_link == "click here" and "drawer slides" in p:
            p = p.replace(
                '<a href="https://example.com/products/drawer-slides">drawer slides</a>',
                '<a href="https://example.com/products/drawer-slides">click here</a>',
            )
        parts.append(f"        <p>{p}</p>")
        para_i += 1

    parts.append("    </main>")
    return "\n".join(parts)


def wrap(head, main, http=False, footer_link=True):
    return "\n".join([head, "<body>", nav_block(http), main, footer_block(http, footer_link), "</body>", "</html>"])


def gen_m001():
    return wrap(head_block(), main_structure())


def gen_m002():
    title = (
        "Comprehensive Professional Furniture Hardware Solutions and Modern "
        "Cabinet Hinges Installation Guide for Home Renovation Projects"
    )
    meta = (
        "Explore our extensive collection of professional-grade furniture renovation materials "
        "and woodworking supplies designed for discerning craftsmen who demand superior "
        "cabinet hinges and reliable hardware components for every project."
    )
    h1 = "Professional Grade Cabinet Hardware and Hinges Solutions"
    body = list(BODY_PARAS_FULL)
    body[1] = (
        "We carry a comprehensive range of cabinet hinges designed for various applications. "
        "From concealed cabinet hinges that provide a clean look to decorative butt cabinet hinges, "
        "our inventory covers every need. Each type of cabinet hinge in our catalog has been tested. "
        "Whether you need cabinet hinges for kitchen cabinets or cabinet hinges for bathroom vanities, "
        "we have the right cabinet hinges for your project. Our selection includes soft-close cabinet hinges, "
        "self-closing cabinet hinges, and decorative cabinet hinges to match any style."
    )
    head = head_block(
        title=title,
        meta=meta,
        canonical=None,
        og_image=False,
        twitter=False,
        hreflang=None,
        json_ld=False,
        extra_head="""    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Thing",
        "name": "Furniture Hardware Solutions"
    }
    </script>""",
    )
    main = main_structure(
        h1=h1,
        body_paras=body,
        imgs=[
            '<img src="https://example.com/images/main-product.jpg">',
            '<img src="https://example.com/images/hinge-types.jpg" alt="Various types of metal hardware components">',
            '<img src="https://example.com/images/installation-tools.jpg">',
        ],
        inner_link="click here",
    )
    return wrap(head, main)


def gen_m003():
    h1 = "Professional Grade Cabinet Hardware and Hinges Solutions"
    headings = [
        (3, "Types of Cabinet Hinges We Offer"),
        (2, "Installation Guide"),
        (4, "Tools Needed"),
        (2, "Maintenance Tips"),
    ]
    main = main_structure(
        h1=h1,
        h1_multi=["Our Quality Assurance Promise"],
        headings=headings,
        body_paras=BODY_PARAS_FULL[:5] + [BODY_PARAS_FULL[6]],
    )
    return wrap(head_block(), main)


def gen_m004():
    intro = (
        "When it comes to building or renovating furniture, choosing the right components "
        "is essential for both functionality and longevity. Our premium selection provides "
        "reliable performance that professional woodworkers and DIY enthusiasts trust for "
        "their most important projects. Whether you are installing new kitchen cabinets or "
        "upgrading existing furniture pieces, quality hardware makes all the difference."
    )
    body = [
        intro,
        (
            "We carry a comprehensive range of hardware designed for various applications. "
            "From concealed components to decorative fittings, our inventory covers every need."
        ),
        (
            "Installing hardware correctly is crucial. Our guide walks you through every step "
            "with precise positioning followed by careful adjustment of tension screws."
        ),
        (
            "For successful installation, gather a power drill, bits, screwdriver, tape, and level."
        ),
        (
            "Our cabinet hinges are manufactured using high-grade steel and advanced coating technology. "
            "Each piece undergoes rigorous quality control testing before it reaches your hands."
        ),
        (
            'We offer complementary hardware including <a href="https://example.com/products/drawer-slides">drawer slides</a> '
            "and other accessories for residential and commercial projects."
        ),
    ]
    main = main_structure(body_paras=body, imgs=[IMG_MAIN, IMG_TYPES, None])
    return wrap(head_block(), main)


def gen_m005():
    head = head_block(hreflang=False)
    main = main_structure(imgs=[])
    return wrap(head, main)


def gen_m006():
    body = list(BODY_PARAS_FULL)
    body[1] = (
        "We carry a comprehensive range of drawer slide products for various applications. "
        "Each drawer slide in our catalog has been tested. Whether you need a drawer slide for kitchen "
        "cabinets or a drawer slide for office furniture, we have the right drawer slide. "
        "Our drawer slide selection includes soft-close drawer slide, full-extension drawer slide, "
        "and side-mount drawer slide options. The drawer slide is one of our best-selling products. "
        "Every drawer slide comes with a warranty. Install a drawer slide today and experience "
        "the difference a quality drawer slide makes. A good drawer slide ensures smooth operation."
    )
    return wrap(head_block(), main_structure(body_paras=body))


def gen_m007():
    return wrap(head_block(title=None), main_structure())


def gen_m008():
    return wrap(head_block(title=""), main_structure())


def gen_m009():
    return wrap(head_block(title="HW"), main_structure())


def gen_m010():
    return wrap(head_block(meta=None), main_structure())


def gen_m011():
    return wrap(head_block(meta=""), main_structure())


def gen_m012():
    meta = "Welcome to our online shopping destination for travel packages and vacation deals worldwide."
    return wrap(head_block(meta=meta), main_structure())


def gen_m013():
    main = main_structure(h1=None)
    return wrap(head_block(), main)


def gen_m014():
    return wrap(head_block(), main_structure(h1_empty=True))


def gen_m015():
    body = BODY_PARAS_FULL
    main = """    <main>
        <h1>Welcome to Our Online Store</h1>
""" + "\n".join(f"        <p>{p}</p>" for p in body) + "\n" + "\n".join(
        f"        {img}" for img in [IMG_MAIN, IMG_TYPES, IMG_TOOLS]
    ) + "\n    </main>"
    return wrap(head_block(), main)


def gen_m016():
    head = head_block(
        title="Best Hinges for Furniture Projects",
        meta="Discover premium hinges for your furniture projects. Our high-quality hinges offer smooth operation and durable construction.",
    )
    main = f"""    <main>
        <h1>Premium Hinges for Durable Furniture</h1>
        <p>When building or renovating furniture, choosing the right hinges is essential for functionality and longevity. Our premium hinges provide reliable performance trusted by woodworkers and DIY enthusiasts. Quality hinges make all the difference in smooth door operation and durability.</p>
        {IMG_MAIN.replace("cabinet hinges", "hinges").replace("cabinet hinges", "hinges")}
        <p>We carry a comprehensive range of hinges for various applications. Each product undergoes rigorous testing to ensure lasting quality and smooth operation throughout years of daily use.</p>
        <p>Our <a href="https://example.com/products/drawer-slides">drawer slides</a> and hardware accessories complement our product line.</p>
    </main>"""
    return wrap(head, main)


def gen_m017():
    return wrap(head_block(), main_structure(body_paras=BODY_PARAS_NO_KW))


def gen_m018():
    body = BODY_PARAS_FULL[:4] + [
        (
            'Our products are manufactured using high-grade steel. Customers rely on our hardware. '
            'Our <a href="https://example.com/products/drawer-slides">drawer slides</a> and other '
            "accessories complement our cabinet hinges lineup perfectly."
        ),
    ]
    main = main_structure(body_paras=body, imgs=[IMG_MAIN.replace("cabinet hinges", "hardware"), IMG_TYPES.replace("cabinet hinges", "hardware"), None])
    return wrap(head_block(), main)


def gen_m019():
    stuffing = (
        "When it comes to cabinet hinges, choosing the right cabinet hinges is essential. "
        "Our premium cabinet hinges provide the best value. These cabinet hinges are trusted. "
        "Quality cabinet hinges make all the difference. We offer cabinet hinges for every project. "
        "Our cabinet hinges are the finest cabinet hinges available. Buy cabinet hinges from our collection. "
        "The best cabinet hinges at great prices. Our cabinet hinges outperform other cabinet hinges. "
        "Each pair of cabinet hinges is tested. Professional installers prefer our cabinet hinges. "
        "The cabinet hinges we sell are premium cabinet hinges. These cabinet hinges will last for years. "
        "Our cabinet hinges come with a warranty. Install our cabinet hinges today. "
        "A good cabinet hinges ensures smooth operation. Every set of cabinet hinges includes instructions. "
        "We guarantee our cabinet hinges will fit. Cabinet hinges installation takes minutes. "
        "Keep your cabinet hinges in top condition. Lubricate cabinet hinges annually. "
        "Tighten cabinet hinges screws regularly. Quality cabinet hinges need minimal care."
    )
    body = [stuffing, BODY_PARAS_FULL[1], BODY_PARAS_FULL[5]]
    main = main_structure(body_paras=body, headings=[(2, "Cabinet Hinges Guide"), (2, "More Products")], imgs=[IMG_MAIN, IMG_TYPES, IMG_TOOLS])
    return wrap(head_block(), main)


def gen_m020():
    body = list(BODY_PARAS_FULL)
    body[0] = (
        "Welcome to the exciting world of tropical travel destinations and beach vacation planning. "
        "Whether you dream of crystal-clear waters, white sandy beaches, or lush rainforest adventures, "
        "our comprehensive travel guides will help you plan the perfect getaway."
    )
    return wrap(head_block(), main_structure(body_paras=body))


def gen_m021():
    imgs = [
        '<img src="https://example.com/images/cabinet-hinges-main.jpg">',
        '<img src="https://example.com/images/hinge-types.jpg">',
        '<img src="https://example.com/images/installation-tools.jpg" alt="Various tools for furniture assembly">',
        '<img src="https://example.com/images/quality-control.jpg">',
        '<img src="https://example.com/images/warehouse.jpg">',
    ]
    main = main_structure(imgs=imgs)
    return wrap(head_block(), main)


def gen_m022():
    head = head_block(canonical=HTTP_URL, hreflang=None)
    return wrap(head, main_structure(http=True), http=True)


def gen_m023():
    head = head_block(robots="noindex", og_title=False, og_desc=False, og_image=False, twitter=False)
    body = list(BODY_PARAS_FULL)
    body[5] = body[5].replace(
        '<a href="https://example.com/products/drawer-slides">drawer slides</a>',
        "drawer slides",
    )
    main = main_structure(body_paras=body, inner_link="none")
    return wrap(head, main, footer_link=False)


def gen_m024():
    head = head_block(
        canonical=[
            BASE_URL,
            "https://example.com/product/hardware-accessories",
            "https://example.com/products/cabinet-hinges-v2",
        ]
    )
    return wrap(head, main_structure())


def gen_m025():
    head = head_block(canonical="https://other-domain.com/hardware/cabinet-fittings")
    return wrap(head, main_structure())


def gen_m026():
    head = head_block(canonical="/product/cabinet-hinges")
    return wrap(head, main_structure())


def gen_m027():
    return wrap(head_block(), main_structure())


def gen_m028():
    micro = """        <div itemscope itemtype="https://schema.org/Product">
            <span itemprop="name">Premium Cabinet Hinges</span>
            <span itemprop="description">High-quality cabinet hinges for furniture</span>
            <img itemprop="image" src="https://example.com/images/cabinet-hinges.jpg" alt="Premium cabinet hinges">
            <div itemprop="brand" itemscope itemtype="https://schema.org/Brand">
                <span itemprop="name">HardwarePro</span>
            </div>
            <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                <span itemprop="price">12.99</span>
                <span itemprop="priceCurrency">USD</span>
            </div>
        </div>"""
    inner = main_structure().replace("    <main>\n", "", 1)
    main = f"    <main>\n{micro}\n{inner}"
    return wrap(head_block(json_ld=False), main)


def gen_m029():
    rdfa = """        <span property="name" content="Premium Cabinet Hinges"></span>
        <span property="description" content="High-quality cabinet hinges for furniture"></span>"""
    inner = main_structure().replace(
        "    <main>\n        <h1>",
        f'    <main vocab="https://schema.org/" typeof="Product">\n{rdfa}\n        <h1>',
        1,
    )
    return wrap(head_block(json_ld=False), inner)


def gen_m030():
    return wrap(head_block(json_ld=False), main_structure())


def gen_m031():
    head = head_block(
        title="Professional Furniture Hardware Solutions",
        meta="Hardware",
        canonical=None,
        hreflang=None,
    )
    main = main_structure(
        h1="Premium Hardware for Durable Furniture",
        h1_multi=["Quality Solutions for Modern Homes"],
        body_paras=BODY_PARAS_FULL[:6],
        imgs=['<img src="https://example.com/images/cabinet-hinges-main.jpg">', IMG_TYPES, None],
        headings=[(2, "Types of Hardware"), (2, "Installation"), (3, "Tools"), (2, "Why Choose Us")],
    )
    return wrap(head, main, http=True)


def gen_m032():
    head = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <meta name="description" content="">
    <meta name="pageType" content="产品详情页">
    <meta name="robots" content="noindex">
</head>"""
    main = """    <main>
        <p>Welcome to our online store. We offer a variety of products for home improvement and renovation projects. Browse our catalog to find what you need.</p>
        <p>Whether you are working on a small repair or a major renovation, we have the supplies you need. Our products are sourced from trusted manufacturers.</p>
        <p>Contact our support team if you have any questions about our products or services.</p>
    </main>"""
    return wrap(head, main, http=True, footer_link=False)


def gen_m033():
    head = head_block(
        title="Best Cabinet Hardware for Modern Furniture Projects",
        meta="Discover premium Hinges for your furniture projects. Our high-quality hardware offers smooth operation and durable construction for cabinets and drawers.",
    )
    return wrap(head, main_structure(h1="Premium Cabinet Hardware for Durable Furniture Solutions"))


def gen_m034():
    head = head_block(
        title="Professional Furniture Components and Accessories",
        meta="Explore our selection of furniture components and accessories for home renovation and improvement projects.",
    )
    body = BODY_PARAS_FULL
    main = """    <main>
        <h1>Welcome to Our Furniture Component Store</h1>
""" + "\n".join(f"        <p>{p}</p>" for p in body) + "\n" + "\n".join(
        f"        {img}" for img in [IMG_MAIN, IMG_TYPES, IMG_TOOLS]
    ) + "\n    </main>"
    return wrap(head, main)


def gen_m035():
    h1 = (
        "Premium Professional Grade Cabinet Hinges for Durable Furniture Hardware "
        "Solutions and Modern Home Renovation Projects"
    )
    return wrap(head_block(), main_structure(h1=h1))


def gen_m036():
    head = head_block(
        title="Best 橱柜铰链 for Furniture Hardware",
        meta="Discover premium 橱柜铰链 for your furniture projects. Our high-quality cabinet hardware offers smooth operation and durable construction.",
    )
    body = list(BODY_PARAS_FULL)
    body[0] = body[0].replace("cabinet hinges", "橱柜铰链", 2)
    imgs = [
        IMG_MAIN.replace("cabinet hinges", "橱柜铰链"),
        IMG_TYPES.replace("cabinet hinges", "橱柜铰链"),
        IMG_TOOLS.replace("cabinet hinges", "橱柜铰链"),
    ]
    return wrap(head, main_structure(h1="Premium 橱柜铰链 for Durable Furniture", body_paras=body, imgs=imgs))


def gen_m037():
    head = head_block(canonical=[BASE_URL, BASE_URL])
    return wrap(head, main_structure())


GENERATORS = {
    f"SEO-M-{i:03d}": fn
    for i, fn in enumerate(
        [
            gen_m001,
            gen_m002,
            gen_m003,
            gen_m004,
            gen_m005,
            gen_m006,
            gen_m007,
            gen_m008,
            gen_m009,
            gen_m010,
            gen_m011,
            gen_m012,
            gen_m013,
            gen_m014,
            gen_m015,
            gen_m016,
            gen_m017,
            gen_m018,
            gen_m019,
            gen_m020,
            gen_m021,
            gen_m022,
            gen_m023,
            gen_m024,
            gen_m025,
            gen_m026,
            gen_m027,
            gen_m028,
            gen_m029,
            gen_m030,
            gen_m031,
            gen_m032,
            gen_m033,
            gen_m034,
            gen_m035,
            gen_m036,
            gen_m037,
        ],
        start=1,
    )
}


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, gen in GENERATORS.items():
        path = OUTPUT_DIR / f"{name}.html"
        path.write_text(gen() + "\n", encoding="utf-8")
        print(f"Wrote {path.name}")
    print(f"\nTotal: {len(GENERATORS)} files -> {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
