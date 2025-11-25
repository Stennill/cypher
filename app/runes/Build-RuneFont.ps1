param(
    [string]$SvgDir = ".\svg",
    [string]$OutputFont = ".\RuneCipher.ttf",
    [string]$FontForgePath = "C:\Program Files (x86)\FontForgeBuilds\fontforge.exe"
)

if (-not (Test-Path $FontForgePath)) {
    Write-Error "FontForge not found at '$FontForgePath'. Update -FontForgePath to your install location."
    exit 1
}

if (-not (Test-Path $SvgDir)) {
    Write-Error "SVG directory '$SvgDir' does not exist."
    exit 1
}

# This Python code runs INSIDE FontForge's embedded Python, not your system Python.
$pyScript = @"
import fontforge
import sys
import os

svg_dir = sys.argv[1] if len(sys.argv) > 1 else "svg"
output_font = sys.argv[2] if len(sys.argv) > 2 else "RuneCipher.ttf"

font = fontforge.font()
font.encoding = "UnicodeFull"
font.fontname = "RuneCipher"
font.familyname = "Rune Cipher"
font.fullname = "Rune Cipher"

font.em = 1000
font.ascent = 800
font.descent = 200

letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

for ch in letters:
    svg_path = os.path.join(svg_dir, f"{ch}.svg")
    if not os.path.exists(svg_path):
        print(f"Skipping {ch}: {svg_path} not found")
        continue

    codepoint = ord(ch)
    glyph = font.createChar(codepoint, ch)
    glyph.importOutlines(svg_path)

    # Adjust side bearings as needed
    glyph.left_side_bearing = 50
    glyph.right_side_bearing = 50

print(f"Generating font: {output_font}")
font.generate(output_font)
print("Done.")
"@

# Write the Python script to a temporary file
$tempPy = Join-Path $env:TEMP "build_rune_font_temp.py"
Set-Content -Path $tempPy -Value $pyScript -Encoding ASCII

Write-Host "Building rune font from '$SvgDir' to '$OutputFont'..." -ForegroundColor Cyan

# Call FontForge with its embedded Python interpreter
& $FontForgePath -lang=py -script $tempPy $SvgDir $OutputFont

if ($LASTEXITCODE -eq 0) {
    Write-Host "Font generated: $OutputFont" -ForegroundColor Green
} else {
    Write-Error "FontForge returned exit code $LASTEXITCODE"
}

# Optional: clean up the temp script
Remove-Item $tempPy -ErrorAction SilentlyContinue
