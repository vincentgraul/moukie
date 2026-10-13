import json
import re
import sys
from html import escape, unescape
from html.parser import HTMLParser
from pathlib import Path

KINDS = {
    "toi": "Toi", "figma": "Figma", "web": "Veille web", "lit": "lit", "skill": "skill",
    "recu": "reçoit", "ecrit": "écrit", "git": "git", "forge": "forge", "notif": "notifie", "rend": "rend",
}
ROW_KINDS = {"", "dec", "loop"}
CSS = """:root{--paper:#FFFFFF;--panel:#FFFFFF;--ink:#1B1919;--muted:#6E6869;--line:#E9E4E6;--pink:#FFCBF0;--pink-soft:#FFF2FB;--on-pink:#1B1919;--stroke:#1B1919;
--sans:"DM Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#1B1919;--panel:#242121;--ink:#F6F2F4;--muted:#A79FA2;--line:#3A3537;--pink-soft:#3A2C35;}}
:root[data-theme="dark"]{--paper:#1B1919;--panel:#242121;--ink:#F6F2F4;--muted:#A79FA2;--line:#3A3537;--pink-soft:#3A2C35;}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);line-height:1.55;}
.wrap{max-width:1240px;margin:0 auto;padding-inline:20px;padding-block:44px 72px;}
h1{font-size:44px;font-weight:800;line-height:1.1;letter-spacing:-.01em;margin:0 0 10px;color:var(--pink);-webkit-text-stroke:2px var(--stroke);paint-order:stroke fill;}
.lede{color:var(--muted);font-size:15px;margin:0 0 6px;max-width:70ch;}
.meta{font-family:var(--mono);font-size:11.5px;color:var(--muted);margin:0;}
code{font-family:var(--mono);font-size:.86em;}
nav.toc{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 8px;}
nav.toc a{font-size:13px;font-weight:500;color:var(--ink);text-decoration:none;border:2px solid var(--ink);border-radius:999px;padding:4px 12px;background:var(--panel);}
nav.toc a:hover,nav.toc a:focus-visible{background:var(--pink);color:var(--on-pink);outline:none;}
.legend{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:18px 0 0;font-size:12.5px;color:var(--muted);}
.legend .sample{display:inline-flex;align-items:center;gap:6px;}
.legend .box{display:inline-block;width:26px;height:14px;border-radius:4px;border:2px solid var(--ink);background:var(--panel);}
.legend .box.d{border-style:dashed;}
.chip{display:inline-flex;gap:6px;align-items:baseline;font-size:12.5px;line-height:1.4;padding:4px 9px;border-radius:7px;background:var(--panel);border:1px solid var(--line);color:var(--ink);margin:0 0 6px;max-width:100%;}
.chip b{font-family:var(--mono);font-size:10.5px;font-weight:500;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;color:var(--muted);}
.k-toi{background:var(--pink);border-color:var(--pink);color:var(--on-pink);}.k-toi b{color:var(--on-pink);}
.k-ecrit{border:1.5px solid var(--ink);}
.k-figma,.k-web,.k-notif{background:var(--pink-soft);border-color:transparent;}
.k-recu{border-style:dashed;}
.phase{margin:56px 0 0;scroll-margin-top:16px;}
.ph{display:flex;gap:14px;align-items:center;margin:0 0 14px;}
.phn{flex:none;width:40px;height:40px;border-radius:50%;background:var(--pink);border:2px solid var(--stroke);color:var(--on-pink);font-size:20px;display:inline-flex;align-items:center;justify-content:center;}
.ph h2{font-size:22px;font-weight:700;margin:0;}
.trig{margin:2px 0 0;font-size:13.5px;color:var(--muted);}
.cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr) minmax(0,1fr);gap:18px;padding:0 0 8px;border-bottom:2px solid var(--ink);margin-bottom:12px;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);}
.row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr) minmax(0,1fr);gap:18px;align-items:start;margin:0 0 12px;}
.in{text-align:right;}
.step{position:relative;display:flex;gap:12px;background:var(--panel);border:2px solid var(--ink);border-radius:10px;padding:11px 14px;}
.row.opt .step{border-style:dashed;}
.row.loop .step{background:var(--pink-soft);border-style:dashed;}
.row.loop .num{background:var(--pink);color:var(--on-pink);border:1.5px solid var(--stroke);}
.num{flex:none;min-width:30px;height:24px;padding:0 6px;border-radius:12px;background:var(--ink);color:var(--paper);font-family:var(--mono);font-size:11.5px;display:inline-flex;align-items:center;justify-content:center;}
.body{min-width:0;}
.step h4{margin:1px 0 3px;font-size:14.5px;font-weight:700;}
.who{font-family:var(--mono);font-size:10.5px;font-weight:400;color:var(--muted);margin-left:4px;white-space:nowrap;}
.step p{margin:0;font-size:13.5px;}
.cond{display:inline-block;font-family:var(--mono);font-size:11px;color:var(--ink);background:var(--pink-soft);border:1px dashed var(--ink);border-radius:5px;padding:0 7px;margin:0 0 5px;}
.warn{margin:7px 0 0!important;font-size:12.5px!important;color:var(--muted)!important;}
.call{margin:4px 0 16px;padding:12px 14px 4px;border:1.5px dashed var(--muted);border-radius:12px;background:var(--pink-soft);}
.call-h,.call-f{font-family:var(--mono);font-size:11.5px;color:var(--muted);margin:0 0 10px;}
.call-f{margin:2px 0 8px;text-align:center;}
.call .row{margin-bottom:10px;}
.call .step{background:var(--panel);}
.always{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;}
.always>div{border:2px solid var(--ink);border-radius:10px;padding:12px 14px;background:var(--panel);}
.always h4{margin:0 0 4px;font-size:14px;font-weight:700;}
.always p{margin:0;font-size:13.5px;color:var(--muted);}
.foot{margin:56px 0 0;padding-top:12px;border-top:2px solid var(--ink);font-family:var(--mono);font-size:11.5px;color:var(--muted);}
@media (max-width:820px){h1{font-size:34px;}.cols{display:none;}.row{grid-template-columns:1fr;gap:6px;}.in{text-align:left;order:2;}.step{order:1;}.out{order:3;}.in:empty,.out:empty{display:none;}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto;}}
html{scroll-behavior:smooth;}"""


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
    return (f'<div class="call"><div class="call-h">↳ appelle <code>{c["skill"]}</code> · {c["mode"]}{cond}</div>'
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
    nav = "".join(f'<a href="#{p["id"]}">{p["nav"]}</a>' for p in data["phases"])
    version = f' · Moukie {data["version"]}' if data.get("version") else ""
    return f"""<title>{data["title"]}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
{CSS}
</style>
<div class="wrap">
<h1>{data["title"]}</h1>
<p class="lede">{data["lede"]}</p>
<div class="legend"><span class="sample"><span class="box"></span>toujours</span><span class="sample"><span class="box d"></span>selon le cas <span class="cond">condition</span></span><span>◆ décision</span><span>↻ boucle de retour</span><span>↳ skill appelé</span>{legend}</div>
<nav class="toc"><a href="#p0">⓪ Toujours actif</a>{nav}</nav>
{p0}{phases}
<p class="foot">Générée depuis les fichiers du plugin, au {data["date"]}{version}</p>
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
    findings = data.get("findings", {}).get("items", [])
    opened = [i for i in findings if not i.get("fix")]
    print(f"{steps} étapes, {subs} sous-étapes dans {calls} appels de skill → {sys.argv[2]}")
    print(f"{len(opened)} écart(s) ouvert(s), {len(findings) - len(opened)} corrigé(s), dans les données seulement :")
    for item in findings:
        status = "corrigé" if item.get("fix") else "ouvert"
        print(f"  [{status}] {unescape(re.sub(r'<[^>]+>', '', item['title']))}")


if __name__ == "__main__":
    main()
