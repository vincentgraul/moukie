import json
import re
import sys
from html import escape
from html.parser import HTMLParser
from pathlib import Path

KINDS = {
    "toi": "Toi", "figma": "Figma", "web": "Veille web", "lit": "lit", "skill": "skill",
    "recu": "reçoit", "ecrit": "écrit", "git": "git", "forge": "forge", "notif": "notifie", "rend": "rend",
}
ROW_KINDS = {"", "dec", "loop"}
CSS = ':root{--paper:#FBFAF8;--panel:#FFFFFF;--ink:#171717;--muted:#6F6B64;--line:#E4E0D8;--accent:#5B4BC4;--accent-soft:#EFEDFC;--accent-ink:#3A2F8F;--flag:#A8362B;--flag-soft:#FBEDEA;--cond:#A0620A;--cond-soft:#FBF1E1;\n--k-toi:#FBEFD9;--k-toi-i:#7A4A06;--k-figma:#F1E9FB;--k-figma-i:#5B2E8F;--k-web:#E5EFFA;--k-web-i:#1F4F86;--k-ecrit:#E1F3EE;--k-ecrit-i:#11604C;--k-notif:#FBE7E1;--k-notif-i:#8A2F14;\n--sans:"DM Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;}\n@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#141312;--panel:#1C1A18;--ink:#F2F0EC;--muted:#9B958B;--line:#2E2B27;--accent:#A99CF2;--accent-soft:#272144;--accent-ink:#C8BFFA;--flag:#E0917F;--flag-soft:#33211D;--cond:#E2B15B;--cond-soft:#2F2614;\n--k-toi:#33270F;--k-toi-i:#F0C77E;--k-figma:#2A1F3A;--k-figma-i:#D4B8F5;--k-web:#16263A;--k-web-i:#9CC3EE;--k-ecrit:#122C26;--k-ecrit-i:#8ED9C3;--k-notif:#36190F;--k-notif-i:#F2A68C;}}\n:root[data-theme="dark"]{--paper:#141312;--panel:#1C1A18;--ink:#F2F0EC;--muted:#9B958B;--line:#2E2B27;--accent:#A99CF2;--accent-soft:#272144;--accent-ink:#C8BFFA;--flag:#E0917F;--flag-soft:#33211D;--cond:#E2B15B;--cond-soft:#2F2614;\n--k-toi:#33270F;--k-toi-i:#F0C77E;--k-figma:#2A1F3A;--k-figma-i:#D4B8F5;--k-web:#16263A;--k-web-i:#9CC3EE;--k-ecrit:#122C26;--k-ecrit-i:#8ED9C3;--k-notif:#36190F;--k-notif-i:#F2A68C;}\nbody{background:var(--paper);color:var(--ink);font-family:var(--sans);line-height:1.55;}\n.wrap{max-width:1240px;margin:0 auto;padding-inline:20px;padding-block:44px 72px;}\nh1{font-size:28px;font-weight:500;letter-spacing:-.01em;margin:0 0 6px;}\n.lede{color:var(--muted);font-size:15px;margin:0 0 6px;max-width:70ch;}\n.meta{font-family:var(--mono);font-size:11.5px;color:var(--muted);margin:0;}\ncode{font-family:var(--mono);font-size:.86em;color:var(--accent-ink);}\nnav.toc{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 8px;}\nnav.toc a{font-size:13px;color:var(--ink);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:5px 12px;background:var(--panel);}\nnav.toc a:hover,nav.toc a:focus-visible{border-color:var(--accent);outline:none;}\n.legend{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:18px 0 0;font-size:12.5px;color:var(--muted);}\n.legend .sample{display:inline-flex;align-items:center;gap:6px;}\n.legend .box{display:inline-block;width:26px;height:14px;border-radius:4px;border:1.5px solid var(--accent);background:var(--accent-soft);}\n.legend .box.d{border-style:dashed;background:transparent;}\n.chip{display:inline-flex;gap:6px;align-items:baseline;font-size:12.5px;line-height:1.4;padding:4px 9px;border-radius:7px;background:var(--panel);border:1px solid var(--line);color:var(--ink);margin:0 0 6px;max-width:100%;}\n.chip b{font-family:var(--mono);font-size:10.5px;font-weight:500;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;color:var(--muted);}\n.k-toi{background:var(--k-toi);border-color:transparent;}.k-toi b{color:var(--k-toi-i);}\n.k-figma{background:var(--k-figma);border-color:transparent;}.k-figma b{color:var(--k-figma-i);}\n.k-web{background:var(--k-web);border-color:transparent;}.k-web b{color:var(--k-web-i);}\n.k-ecrit{background:var(--k-ecrit);border-color:transparent;}.k-ecrit b{color:var(--k-ecrit-i);}\n.k-notif{background:var(--k-notif);border-color:transparent;}.k-notif b{color:var(--k-notif-i);}\n.k-skill b,.k-git b,.k-forge b{color:var(--accent-ink);}\n.k-recu{border-style:dashed;}\n.phase{margin:56px 0 0;scroll-margin-top:16px;}\n.ph{display:flex;gap:14px;align-items:flex-start;margin:0 0 14px;}\n.phn{font-size:26px;line-height:1;color:var(--accent);}\n.ph h2{font-size:20px;font-weight:500;margin:0;}\n.trig{margin:2px 0 0;font-size:13.5px;color:var(--muted);}\n.cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr) minmax(0,1fr);gap:18px;padding:0 0 8px;border-bottom:1px solid var(--line);margin-bottom:12px;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);}\n.row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr) minmax(0,1fr);gap:18px;align-items:start;margin:0 0 12px;}\n.in{text-align:right;}\n.step{position:relative;display:flex;gap:12px;background:var(--accent-soft);border:1.5px solid var(--accent);border-radius:10px;padding:11px 14px;}\n.row.opt .step{border-style:dashed;background:color-mix(in srgb,var(--accent-soft) 45%,transparent);}\n.row.dec .step h4::first-letter{color:var(--cond);}\n.row.loop .step{background:var(--flag-soft);border-color:var(--flag);}\n.row.loop .num{background:var(--flag);}\n.num{flex:none;min-width:30px;height:24px;padding:0 6px;border-radius:12px;background:var(--accent);color:var(--paper);font-family:var(--mono);font-size:11.5px;display:inline-flex;align-items:center;justify-content:center;}\n.body{min-width:0;}\n.step h4{margin:1px 0 3px;font-size:14.5px;font-weight:500;}\n.who{font-family:var(--mono);font-size:10.5px;font-weight:400;color:var(--muted);margin-left:4px;white-space:nowrap;}\n.step p{margin:0;font-size:13.5px;color:var(--ink);}\n.cond{display:inline-block;font-family:var(--mono);font-size:11px;color:var(--cond);background:var(--cond-soft);border-radius:5px;padding:1px 7px;margin:0 0 5px;}\n.warn{margin:7px 0 0!important;font-size:12.5px!important;color:var(--flag)!important;}\n.call{margin:4px 0 16px;padding:12px 14px 4px;border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb,var(--panel) 70%,transparent);}\n.call.opt{border-style:dashed;}\n.call-h,.call-f{font-family:var(--mono);font-size:11.5px;color:var(--muted);margin:0 0 10px;}\n.call-f{margin:2px 0 8px;text-align:center;}\n.call .row{margin-bottom:10px;}\n.call .step{background:var(--panel);}\n.call .row.opt .step,.call.opt .step{border-style:dashed;}\n.always{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;}\n.always>div{border:1px solid var(--line);border-radius:10px;padding:12px 14px;background:var(--panel);}\n.always h4{margin:0 0 4px;font-size:14px;font-weight:500;}\n.always p{margin:0;font-size:13.5px;color:var(--muted);}\n.findings{margin:64px 0 0;scroll-margin-top:16px;}\n.findings h2,.inv h2.t{font-size:20px;font-weight:500;margin:0 0 6px;}\n.findings ol{margin:18px 0 0;padding-left:22px;display:grid;gap:12px;max-width:80ch;}\n.findings li{font-size:14px;}\n.rule{border:0;border-top:1px solid var(--line);margin:56px 0 40px;}\n.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:26px 34px;}\nsection h2.p{font-family:var(--mono);}\n.grid section h2{font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:0 0 14px;padding-bottom:9px;border-bottom:1px solid var(--line);}\ndl{margin:0;}dt{font-family:var(--mono);font-size:12.5px;color:var(--accent-ink);margin-top:13px;}dt:first-of-type{margin-top:0;}\ndd{margin:1px 0 0;font-size:13.5px;color:var(--muted);}dd b{font-weight:500;color:var(--ink);}\n.flag{color:var(--flag);}dd .cond{margin:0;}\n.open{font-family:var(--mono);font-size:11.5px;color:var(--flag);background:var(--flag-soft);border-radius:5px;padding:1px 6px;}\n.fixed{font-family:var(--mono);font-size:11.5px;color:var(--k-ecrit-i);background:var(--k-ecrit);border-radius:5px;padding:1px 6px;}\n@media (max-width:820px){.cols{display:none;}.row{grid-template-columns:1fr;gap:6px;}.in{text-align:left;order:2;}.step{order:1;}.out{order:3;}.in:empty,.out:empty{display:none;}}\n@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto;}}\nhtml{scroll-behavior:smooth;}'


class DataError(Exception):
    pass


def chip(kind, text):
    if kind not in KINDS:
        raise DataError(f"type d'étiquette inconnu : {kind!r}")
    return f'<span class="chip k-{kind}"><b>{KINDS[kind]}</b>{text}</span>'


def chips(items):
    return "".join(chip(kind, text) for kind, text in items)


def row(r):
    kind = r.get("kind", "")
    if kind not in ROW_KINDS:
        raise DataError(f"étape {r.get('num')} : kind inconnu {kind!r}")
    cls = "row" + (" opt" if r.get("cond") else "") + (f" {kind}" if kind else "")
    cond = f'<span class="cond">{escape(r["cond"])}</span>' if r.get("cond") else ""
    warn = f'<p class="warn">⚠ {r["warn"]}</p>' if r.get("warn") else ""
    return (f'<div class="{cls}"><div class="in">{chips(r.get("in", []))}</div>'
            f'<div class="step"><span class="num">{r["num"]}</span><div class="body">'
            f'<h4>{r["title"]} <span class="who">{r.get("who", "")}</span></h4>{cond}<p>{r.get("desc", "")}</p>{warn}</div></div>'
            f'<div class="out">{chips(r.get("out", []))}</div></div>')


def call(c):
    cond = f' <span class="cond">{escape(c["cond"])}</span>' if c.get("cond") else ""
    body = "".join(row(r) for r in c["rows"])
    return (f'<div class="call{" opt" if c.get("cond") else ""}"><div class="call-h">↳ appelle <code>{c["skill"]}</code> · {c["mode"]}{cond}</div>'
            f'{body}<div class="call-f">↲ {c["back"]}</div></div>')


def phase(p):
    items = "".join(call(i) if i["type"] == "call" else row(i) for i in p["items"])
    return (f'<section class="phase" id="{p["id"]}"><header class="ph"><span class="phn">{p["mark"]}</span><div><h2>{p["title"]}</h2>'
            f'<p class="trig">{p["trigger"]}</p></div></header>'
            f'<div class="cols"><span>Ce qui entre</span><span>Étape</span><span>Ce qui sort</span></div>{items}</section>')


def check_numbering(data):
    expected, parent, sub = 1, None, 0
    for p in data["phases"]:
        for item in p["items"]:
            if item["type"] == "row":
                num = str(item["num"])
                if num.isdigit():
                    if int(num) != expected:
                        raise DataError(f"numérotation : {num} trouvé, {expected} attendu")
                    expected, parent, sub = expected + 1, num, 0
            else:
                if parent is None:
                    raise DataError(f"appel de {item['skill']} sans étape parente")
                for r in item["rows"]:
                    sub += 1
                    if str(r["num"]) != f"{parent}.{sub}":
                        raise DataError(f"sous-étape {r['num']} : {parent}.{sub} attendu")
    return expected - 1


class Balance(HTMLParser):
    VOID = {"link", "br", "hr", "meta", "img", "input"}

    def __init__(self):
        super().__init__()
        self.stack, self.errors = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors.append(tag)


def render(data):
    legend = "".join(chip(k, t) for k, t in [("toi", "toi"), ("figma", "MCP"), ("web", "recherche"), ("lit", "fichier lu"),
                                             ("ecrit", "fichier écrit"), ("git", "branche, commit"), ("notif", "notification")])
    always = "".join(f'<div><h4>{a["title"]}</h4><p>{a["text"]}</p></div>' for a in data["always"])
    p0 = (f'<section class="phase" id="p0"><header class="ph"><span class="phn">⓪</span><div><h2>Toujours actif</h2>'
          f'<p class="trig">Ce qui s\'applique à chaque étape, sans être une étape</p></div></header><div class="always">{always}</div></section>')
    phases = "".join(phase(p) for p in data["phases"])
    f = data["findings"]
    items = []
    for it in f["items"]:
        status = (f' <span class="fixed">Corrigé :</span> {it["fix"]}' if it.get("fix")
                  else ' <span class="open">Ouvert</span>')
        items.append(f'<li><b>{it["title"]}</b> {it["text"]}{status}</li>')
    findings = (f'<section id="trous" class="findings"><h2>{f["title"]}</h2><p class="lede">{f["intro"]}</p>'
                f'<ol>{"".join(items)}</ol></section>') if f["items"] else ""
    inv = "".join(
        "<section><h2>" + s["title"] + "</h2><dl>"
        + "".join(f'<dt>{i["term"]}</dt><dd>{i["desc"]}</dd>' for i in s["items"])
        + "</dl></section>" for s in data["inventory"])
    nav = "".join(f'<a href="#{p["id"]}">{p["nav"]}</a>' for p in data["phases"])
    trous = '<a href="#trous">Ce que l\'analyse a révélé</a>' if f["items"] else ""
    return f"""<title>{data["title"]}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
{CSS}
</style>
<div class="wrap">
<h1>{data["title"]}</h1>
<p class="lede">{data["lede"]}</p>
<p class="meta">analyse des fichiers du plugin au {data["date"]}</p>
<div class="legend"><span class="sample"><span class="box"></span>toujours</span><span class="sample"><span class="box d"></span>selon le cas <span class="cond">condition</span></span><span>◆ décision</span><span>↻ boucle de retour</span><span>↳ skill appelé</span>{legend}</div>
<nav class="toc"><a href="#p0">⓪ Toujours actif</a>{nav}{trous}<a href="#inv">Inventaire</a></nav>
{p0}{phases}{findings}
<hr class="rule">
<section class="inv" id="inv"><h2 class="t">Inventaire</h2><p class="lede" style="margin-bottom:26px">Les pièces du plugin, une par une.</p>
<div class="grid">{inv}</div></section>
</div>
"""


def main():
    if len(sys.argv) != 3:
        sys.exit("usage : render.py <données.json> <page.html>")
    data = json.loads(Path(sys.argv[1]).read_text())
    try:
        steps = check_numbering(data)
        html = render(data)
    except (DataError, KeyError) as error:
        sys.exit(f"données invalides : {error}")
    balance = Balance()
    balance.feed(html)
    if balance.stack or balance.errors:
        sys.exit(f"HTML déséquilibré : non fermées {balance.stack[-3:]}, orphelines {balance.errors[:3]}")
    Path(sys.argv[2]).write_text(html)
    subs = sum(len(i["rows"]) for p in data["phases"] for i in p["items"] if i["type"] == "call")
    calls = sum(1 for p in data["phases"] for i in p["items"] if i["type"] == "call")
    opened = sum(1 for i in data["findings"]["items"] if not i.get("fix"))
    print(f"{steps} étapes, {subs} sous-étapes dans {calls} appels de skill, {opened} écart(s) ouvert(s) → {sys.argv[2]}")


if __name__ == "__main__":
    main()
