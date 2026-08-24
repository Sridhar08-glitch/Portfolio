# Generates country-specific resume variants from the two master resumes in
# E:\sridhar reums (Singapore = no-photo master, Qatar = photo master), for both
# the short and Full versions, as .docx and .pdf, into public\resume\.
#
# Region facts kept honest: Indian national, Qatar RP (transferable, NOC),
# currently employed in Doha. Every non-Gulf region states that sponsorship is
# REQUIRED â€” no visa status is invented.
#
# Requires Microsoft Word. Run:  powershell -File scripts\generate-resumes.ps1

$ErrorActionPreference = "Stop"
$src = "E:\sridhar reums"
$out = Join-Path $PSScriptRoot "..\public\resume"
$out = (Resolve-Path $out).Path
$dot = [string][char]0x00B7   # Â·
$em  = [string][char]0x2014   # â€”

# Masters use "  Â·  " (two spaces around the middle dot) in the header line.
$D = "  $dot  "

$US_SPELL = @(
  @("Specialises","Specializes"), @("specialises","specializes"),
  @("optimisation","optimization"), @("Optimisation","Optimization"),
  @("optimised","optimized"), @("optimise","optimize"),
  @("minimisation","minimization"),
  @("synchronisation","synchronization"), @("synchronise","synchronize"),
  @("authorisation","authorization"), @("Authorisation","Authorization"),
  @("authorised","authorized"),
  @("normalised","normalized"), @("normalise","normalize"),
  @("modelling","modeling"), @("Modelling","Modeling"),
  @("modelled","modeled"), @("Modelled","Modeled"),
  @("programme","program"), @("Programme","Program"),
  @("behavioural","behavioral"), @("Behavioural","Behavioral"),
  @("materialised","materialized"),
  @("diarisation","diarization"), @("diarise","diarize"),
  @("summarise","summarize"), @("recognising","recognizing"),
  @("utilisation","utilization"), @("organisational","organizational"),
  @("catalogue","catalog"), @("Catalogue","Catalog"),
  @("enquiry","inquiry"), @("Enquiry","Inquiry"), @("enquiries","inquiries")
)

# Marker strings in the masters (verified against document.xml):
$SG_AUTH   = "Requires Employment Pass sponsorship. Qualifications verifiable for MOM assessment; degree certificate and transcripts available on request."
# The _Full master spells the ministry out.
$SG_AUTH2  = "Requires Employment Pass sponsorship. Qualifications verifiable for Ministry of Manpower assessment; degree certificate and transcripts available on request."
$SG_HEAD   = "Open to relocation to Singapore$($D)Requires Employment Pass sponsorship"
$SG_SEEK   = "Seeking a Software Developer role in Singapore"
$SG_BASED  = "permanent, Singapore-based"
$QA_SEEK   = "seeking a Software Developer role within Qatar."
$QA_FOCUS  = "focus) $em Doha, Qatar."
$QA_HEAD   = "Doha, Qatar$($D)Transferable Visa$($D)NOC Available"
$QA_VISA   = "Qatar Residence Permit $em Transferable Visa, NOC available."

$REGIONS = @(
  @{ Name="US"; Master="Singapore"; Spell=$true; Forbid=@("Singapore","Employment Pass","MOM"); Repl=@(
      @($SG_AUTH, "Requires employer visa sponsorship (H-1B or similar); degree certificate and transcripts available on request."),
      @($SG_AUTH2, "Requires employer visa sponsorship (H-1B or similar); degree certificate and transcripts available on request."),
      @($SG_HEAD, "Open to relocation to the United States$($D)Requires visa sponsorship"),
      @($SG_SEEK, "Seeking a Software Developer role in the United States"),
      @($SG_BASED, "permanent, US-based")) },
  @{ Name="Canada"; Master="Singapore"; Spell=$false; Forbid=@("Singapore","Employment Pass","MOM"); Repl=@(
      @($SG_AUTH, "Requires employer work-permit sponsorship; degree certificate and transcripts available on request."),
      @($SG_AUTH2, "Requires employer work-permit sponsorship; degree certificate and transcripts available on request."),
      @($SG_HEAD, "Open to relocation to Canada$($D)Requires work-permit sponsorship"),
      @($SG_SEEK, "Seeking a Software Developer role in Canada"),
      @($SG_BASED, "permanent, Canada-based")) },
  @{ Name="UK"; Master="Singapore"; Spell=$false; Forbid=@("Singapore","Employment Pass","MOM"); Repl=@(
      @($SG_AUTH, "Requires Skilled Worker visa sponsorship; degree certificate and transcripts available on request."),
      @($SG_AUTH2, "Requires Skilled Worker visa sponsorship; degree certificate and transcripts available on request."),
      @($SG_HEAD, "Open to relocation to the United Kingdom$($D)Requires Skilled Worker sponsorship"),
      @($SG_SEEK, "Seeking a Software Developer role in the United Kingdom"),
      @($SG_BASED, "permanent, UK-based")) },
  @{ Name="Australia"; Master="Singapore"; Spell=$false; Forbid=@("Singapore","Employment Pass","MOM"); Repl=@(
      @($SG_AUTH, "Requires employer-sponsored work visa (subclass 482 or similar); degree certificate and transcripts available on request."),
      @($SG_AUTH2, "Requires employer-sponsored work visa (subclass 482 or similar); degree certificate and transcripts available on request."),
      @($SG_HEAD, "Open to relocation to Australia or New Zealand$($D)Requires visa sponsorship"),
      @($SG_SEEK, "Seeking a Software Developer role in Australia or New Zealand"),
      @($SG_BASED, "permanent, Australia-based")) },
  @{ Name="Gulf"; Master="Qatar"; Spell=$false; Forbid=@("role within Qatar"); Repl=@(
      @($QA_SEEK, "seeking Software Developer roles across the GCC."),
      @($QA_FOCUS, "focus) $em Qatar and the wider GCC (UAE, Saudi Arabia, Kuwait, Bahrain, Oman)."),
      @($QA_HEAD, "Doha, Qatar (open to GCC)$($D)Transferable Visa$($D)NOC Available")) },
  @{ Name="Europe"; Master="Qatar"; Spell=$false; Forbid=@("NOC","Transferable","within Qatar"); Repl=@(
      @($QA_VISA, "Currently on a Qatar Residence Permit; requires EU work authorisation $em employer-sponsored EU Blue Card route. Degree certificate and transcripts available on request."),
      @($QA_SEEK, "seeking a Software Developer role within the European Union."),
      @($QA_FOCUS, "focus) $em European Union."),
      @($QA_HEAD, "Currently in Doha, Qatar$($D)Open to EU relocation$($D)Requires work-visa sponsorship")) },
  @{ Name="India"; Master="Qatar"; Spell=$false; Forbid=@("NOC","Transferable","within Qatar"); Repl=@(
      @($QA_VISA, "Indian citizen $em full right to work in India, no sponsorship required. Currently on a Qatar Residence Permit in Doha."),
      @($QA_SEEK, "seeking a Software Developer role in India."),
      @($QA_FOCUS, "focus) $em India (relocating from Doha)."),
      @($QA_HEAD, "India$($D)Indian citizen$($D)No sponsorship required")) }
)

function Replace-InDoc($doc, $find, $repl) {
  # Walk every story (body, headers, footers, text boxes) so nothing is missed.
  foreach ($story in $doc.StoryRanges) {
    $range = $story
    while ($null -ne $range) {
      $f = $range.Find
      $f.ClearFormatting(); $f.Replacement.ClearFormatting()
      [void]$f.Execute($find, $true, $false, $false, $false, $false, $true, 1, $false, $repl, 2)
      $range = $range.NextStoryRange
    }
  }
}

$m = [System.Reflection.Missing]::Value
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$results = @()

try {
  foreach ($variant in @("", "_Full")) {
    foreach ($r in $REGIONS) {
      $masterPath = Join-Path $src "Sridhar_Mahalingam_Software_Developer_$($r.Master)$variant.docx"
      $target = Join-Path $out "Sridhar_Mahalingam_Software_Developer_$($r.Name)$variant"
      # OpenAndRepair (13th arg) â€” the Qatar masters refuse a plain open.
      $doc = $word.Documents.Open($masterPath, $false, $false, $false, $m, $m, $false, $m, $m, $m, $m, $false, $true)
      $doc.SaveAs2("$target.docx", 16)
      foreach ($pair in $r.Repl) { Replace-InDoc $doc $pair[0] $pair[1] }
      if ($r.Spell) { foreach ($pair in $US_SPELL) { Replace-InDoc $doc $pair[0] $pair[1] } }
      $doc.Save()
      $doc.ExportAsFixedFormat("$target.pdf", 17)
      $text = $doc.Content.Text
      $leftover = @($r.Forbid | Where-Object { $text.Contains($_) })
      $status = if ($leftover.Count) { "FAIL leftover: $($leftover -join ', ')" } else { "OK" }
      $results += "$($r.Name)$variant : $status"
      $doc.Close($false)
    }
  }
  # The two masters ship as-is.
  foreach ($f in Get-ChildItem $src -Filter "Sridhar_Mahalingam_Software_Developer_*" -File) {
    Copy-Item $f.FullName (Join-Path $out $f.Name) -Force
  }
} finally {
  $word.Quit()
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}

$results | ForEach-Object { $_ }
"Done. Files in $out :"
(Get-ChildItem $out -Filter "*_Software_Developer_*").Count

