"""從 wa-iro 和色辭典隨機挑選一個適合點燈的顏色。
用法：python pick_color.py
　　　python pick_color.py --exclude "#4288B9" "#f0883e"
"""
import json, random, sys, re, os

# 讀取 wa-iro 色彩資料（ES module → 抽取 JSON array）
COLORS_JS = os.path.join(
    os.path.dirname(__file__),
    "..", "wa-iro", "src", "lib", "data", "colors.js"
)

def load_wairo_colors():
    with open(COLORS_JS, encoding="utf-8") as f:
        text = f.read()
    # 抽取 export const colors = [...] 中的 JSON array
    match = re.search(r"export const colors = (\[.+?\]);", text, re.DOTALL)
    if not match:
        raise ValueError("無法解析 colors.js")
    # 移除尾部逗號（JSON 不允許）
    raw = re.sub(r",\s*([}\]])", r"\1", match.group(1))
    return json.loads(raw)

def hex_to_hsl(hex_color):
    """hex → (h, s, l) where h=0-360, s/l=0-1"""
    hex_color = hex_color.lstrip("#")
    r, g, b = [int(hex_color[i:i+2], 16) / 255 for i in (0, 2, 4)]
    mx, mn = max(r, g, b), min(r, g, b)
    l = (mx + mn) / 2
    if mx == mn:
        h = s = 0
    else:
        d = mx - mn
        s = d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)
        if mx == r:
            h = (g - b) / d + (6 if g < b else 0)
        elif mx == g:
            h = (b - r) / d + 2
        else:
            h = (r - g) / d + 4
        h /= 6
    return h * 360, s, l

def is_good_for_dark_bg(hex_color):
    """過濾：太淺（白系）、太深（黒系）、太灰的顏色在深色背景上效果不好"""
    _, s, l = hex_to_hsl(hex_color)
    if l > 0.85:  # 太淺
        return False
    if l < 0.15:  # 太深
        return False
    if s < 0.15 and l < 0.6:  # 太灰太暗
        return False
    return True

def load_existing_colors():
    """讀取 data.json 中已用過的顏色"""
    data_json = os.path.join(os.path.dirname(__file__), "data.json")
    try:
        with open(data_json, encoding="utf-8") as f:
            data = json.load(f)
        return {cell["color"].upper() for cell in data.get("cells", [])}
    except Exception:
        return set()

def main():
    colors = load_wairo_colors()
    existing = load_existing_colors()

    # 額外排除清單
    exclude = set()
    if "--exclude" in sys.argv:
        idx = sys.argv.index("--exclude")
        for arg in sys.argv[idx + 1:]:
            if arg.startswith("#"):
                exclude.add(arg.upper())

    # 過濾
    candidates = [
        c for c in colors
        if is_good_for_dark_bg(c["hex"])
        and c["hex"].upper() not in existing
        and c["hex"].upper() not in exclude
        and c["category"] not in ("白系", "黒系")
    ]

    if not candidates:
        print("所有適合的顏色都已用過！")
        sys.exit(1)

    pick = random.choice(candidates)
    print(f"🎨 和色：{pick['name']}（{pick.get('reading', '')}）")
    print(f"   Hex: {pick['hex']}")
    print(f"   類別: {pick['category']}")
    print(f"   可用色數: {len(candidates)}/{len(colors)}")

if __name__ == "__main__":
    main()
