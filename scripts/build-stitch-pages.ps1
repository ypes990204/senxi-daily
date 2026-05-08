#requires -Version 5.1
# Build Stitch-styled HTML pages by combining shared header/footer template
# with body fragments. This script contains NO Chinese characters to avoid
# PowerShell 5.1 codepage issues; all Chinese content lives in fragments
# read with explicit UTF-8 encoding.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $root 'public'
$fragDir = Join-Path $PSScriptRoot 'fragments'

if (-not (Test-Path $fragDir)) { throw "Fragments directory not found: $fragDir" }

# Load template from v4-stitch.html
$srcPath = Join-Path $publicDir 'v4-stitch.html'
$src = Get-Content -Raw -Encoding UTF8 $srcPath

$headMarker = '<!-- 3. Hero Section -->'
$footerMarker = '<!-- 12. Footer -->'

$headEnd = $src.IndexOf($headMarker)
if ($headEnd -lt 0) { throw "Marker not found: $headMarker" }
$head = $src.Substring(0, $headEnd)

$footerStart = $src.IndexOf($footerMarker)
if ($footerStart -lt 0) { throw "Marker not found: $footerMarker" }
$tail = $src.Substring($footerStart)

# Strip any previously injected route script
$tail = [regex]::Replace($tail, '<script>\s*\(function\s*\(\)[\s\S]*?\}\)\(\);?\s*</script>\s*', '')

# Read inject script fragment
$injectPath = Join-Path $fragDir '_inject-script.html'
if (-not (Test-Path $injectPath)) { throw "Inject script not found: $injectPath" }
$injectScript = Get-Content -Raw -Encoding UTF8 $injectPath

$tailWithScript = $tail -replace '</body>', ($injectScript + "`n</body>")

# Pages to build
$pages = @('herbs', 'crystals', 'about', 'product-detail', 'account', 'checkout-success', 'journal')

$built = 0
foreach ($name in $pages) {
    $bodyPath = Join-Path $fragDir "$name.html"
    if (-not (Test-Path $bodyPath)) {
        Write-Host "  [SKIP] $name (fragment not found)"
        continue
    }
    $body = Get-Content -Raw -Encoding UTF8 $bodyPath
    $finalHtml = $head + $body + $tailWithScript
    $outPath = Join-Path $publicDir "$name-stitch.html"
    Set-Content -Path $outPath -Value $finalHtml -Encoding UTF8 -NoNewline
    $sizeKB = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
    Write-Host "  [OK]   $name-stitch.html ($sizeKB KB)"
    $built++
}

Write-Host ""
Write-Host "Built $built / $($pages.Count) pages"
