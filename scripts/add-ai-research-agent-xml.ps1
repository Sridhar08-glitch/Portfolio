# Inserts the AI Research Agent project into the four resume masters by editing
# word/document.xml inside each .docx directly - no Word COM (Word hangs after
# programmatic rewrites of these documents). Duplicates the TrafficVision block's
# paragraph XML so styles, list numbering and fonts carry over exactly, then
# rewrites the copies' runs. Backups: E:\sridhar reums\backup_2026-08-24.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$src = "E:\sridhar reums"
$W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

$em  = [string][char]0x2014
$en  = [string][char]0x2013
$dot = [string][char]0x00B7
$arr = [string][char]0x2192
$D   = "  $dot  "

$titleNew  = "AI Research Agent $em Multi-Agent Research System with Verified Citations"
$roleShort = "Independent project $dot sole architect & developer"
$stackNew  = "Stack: Python $dot LangGraph $dot FastAPI $dot Ollama (local LLM) $dot PostgreSQL + pgvector $dot FAISS $dot sentence-transformers $dot Next.js 16 $dot TypeScript"
$bullets = @(
  "Built a multi-agent research system on a LangGraph state machine $em Planner, Researcher, Analyst, Critic, Writer and Citation-Verifier agents that search the real web, build a per-session RAG index with full provenance, and generate findings grounded only in retrieved evidence $em all running on a fully local LLM (Ollama) with local embeddings and no cloud AI.",
  "Engineered hallucination reduction as architecture rather than prompting $em findings citing pages never fetched are discarded deterministically, a Critic gate loops the workflow back to research when evidence is insufficient (hard-capped at two iterations), and every citation in the final report is semantically verified against the session's own sources; measured citation coverage rose from 0% to 60$($en)86%.",
  "Delivered a FastAPI + Next.js research workstation streaming live agent progress over Server-Sent Events, with hybrid retrieval (dense embeddings fused with BM25 via reciprocal rank fusion), schema-constrained JSON decoding, provider-fallback web search and a built-in evaluation harness benchmarking citation coverage, groundedness and latency across local models $em 38 tests, all external services mocked."
)
$roleFull   = "Independent project $em sole architect and developer"
$toolsFull  = "Python, LangGraph, FastAPI, Pydantic v2, Ollama (local LLM), PostgreSQL + pgvector, FAISS, sentence-transformers, Next.js 16, TypeScript, Docker Compose"
$statusFull = "Complete $em 38 tests passing, benchmarked end to end on real research runs"
$descFull   = "A local-first, multi-agent AI research workstation. LangGraph-orchestrated agents plan the research, search the real web, ground every finding in retrieved evidence, criticise their own analysis and write cited research reports on a fully local LLM $em with every citation verified against the session's own sources before publishing. Everything runs locally except web search: local LLM via Ollama, local embeddings, local database. Designed and built solo, from the agent state machine and RAG pipeline through to the FastAPI backend and the Next.js research-workstation UI."
$features = @(
  @("Multi-agent verification loop", "a Critic agent checks the analysis against the retrieved evidence and loops the workflow back to research with refined queries when evidence is insufficient (hard-capped at two iterations); the report cannot be written until the Critic approves."),
  @("Structural hallucination reduction", "findings citing pages that were never fetched are discarded deterministically, schema-constrained JSON decoding means the model cannot emit malformed output, and honest errors replace fabricated results when sources are unavailable."),
  @("Claim-level citation verification", "every factual sentence in the report is verified as supported, partially supported or unsupported against the session's own evidence; invalid citations are stripped and weak ones disclosed $em measured citation coverage rose from 0% to 60$($en)86%."),
  @("Hybrid RAG retrieval", "a per-session vector store (pgvector $arr FAISS $arr numpy auto-selection) fuses dense embeddings with a BM25 keyword index via reciprocal rank fusion, with full provenance on every chunk."),
  @("Live research workstation", "the FastAPI backend streams agent progress over Server-Sent Events to a Next.js UI with source cards, evidence quotes, confidence bars, clickable citations, agent traces and per-stage timing."),
  @("Honest evaluation built in", "a benchmark harness runs real research sessions and scores citation coverage, groundedness, completeness, retrieval relevance and latency per model and mode $em 100% completion and 78$($en)79% overall quality measured, with quick mode optimised from ~120s to 64s.")
)
$mlFind = "PyTorch, FCOS object detection"
$mlRepl = "PyTorch, LangGraph multi-agent orchestration, RAG (pgvector, FAISS, hybrid BM25 retrieval), Ollama local LLM inference, FCOS object detection"
$profFind = "training OCR and computer-vision models internally without third-party AI services."
$profRepl = "training OCR and computer-vision models internally without third-party AI services, and building multi-agent LLM research systems on fully local models."
$NEXT_TITLES = @("CommerceOS", "Airsume", "MeetingMind", "Medical ERP", "ShieldDNS")

function Get-NsMgr($xml) {
  $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
  $ns.AddNamespace("w", $W)
  # comma prevents PowerShell from unrolling the enumerable manager into its prefixes
  return ,$ns
}

function Get-ParaText($p, $ns) {
  $sb = New-Object System.Text.StringBuilder
  foreach ($t in $p.SelectNodes(".//w:t", $ns)) { [void]$sb.Append($t.InnerText) }
  return $sb.ToString()
}

# Merge adjacent same-format plain-text runs so proofing fragmentation cannot
# split a search string across runs.
function Merge-Runs($p, $ns) {
  $runs = @($p.SelectNodes("w:r", $ns))
  for ($i = $runs.Count - 1; $i -ge 1; $i--) {
    $a = $runs[$i - 1]; $b = $runs[$i]
    if ($a.NextSibling -ne $b) { continue }
    $aT = @($a.SelectNodes("w:t", $ns)); $bT = @($b.SelectNodes("w:t", $ns))
    if ($aT.Count -ne 1 -or $bT.Count -ne 1) { continue }
    # only merge runs whose non-rPr content is exactly one w:t
    $aOther = @($a.ChildNodes | Where-Object { $_.LocalName -ne "rPr" -and $_.LocalName -ne "t" })
    $bOther = @($b.ChildNodes | Where-Object { $_.LocalName -ne "rPr" -and $_.LocalName -ne "t" })
    if ($aOther.Count -or $bOther.Count) { continue }
    $aP = $a.SelectSingleNode("w:rPr", $ns); $bP = $b.SelectSingleNode("w:rPr", $ns)
    $aX = ""; if ($aP) { $aX = $aP.OuterXml }
    $bX = ""; if ($bP) { $bX = $bP.OuterXml }
    if ($aX -ne $bX) { continue }
    $aT[0].InnerText = $aT[0].InnerText + $bT[0].InnerText
    Set-Preserve $aT[0]
    [void]$p.RemoveChild($b)
  }
}

function Set-Preserve($tNode) {
  $attr = $tNode.OwnerDocument.CreateAttribute("xml", "space", "http://www.w3.org/XML/1998/namespace")
  $attr.Value = "preserve"
  [void]$tNode.Attributes.Append($attr)
}

function New-Run($xml, $rPrNode, $text) {
  $r = $xml.CreateElement("w", "r", $W)
  if ($rPrNode) { [void]$r.AppendChild($rPrNode.CloneNode($true)) }
  $t = $xml.CreateElement("w", "t", $W)
  $t.InnerText = $text
  Set-Preserve $t
  [void]$r.AppendChild($t)
  return $r
}

function Get-FirstLastRpr($p, $ns) {
  $textRuns = @($p.SelectNodes("w:r", $ns) | Where-Object { $_.SelectSingleNode("w:t", $ns) })
  if (-not $textRuns.Count) { throw "paragraph has no text runs" }
  $first = $textRuns[0].SelectSingleNode("w:rPr", $ns)
  $last = $textRuns[$textRuns.Count - 1].SelectSingleNode("w:rPr", $ns)
  return @($first, $last)
}

# Replace a paragraph's runs with new content. $parts = array of @(rPr, text).
function Rebuild-Para($p, $ns, $parts) {
  $xml = $p.OwnerDocument
  foreach ($child in @($p.ChildNodes)) {
    if ($child.LocalName -ne "pPr") { [void]$p.RemoveChild($child) }
  }
  foreach ($part in $parts) {
    [void]$p.AppendChild((New-Run $xml $part[0] $part[1]))
  }
}

function Set-UniformText($p, $ns, $text) {
  $fl = Get-FirstLastRpr $p $ns
  Rebuild-Para $p $ns @(, @($fl[0], $text))
}

# bold-lead pattern: keep first run formatting for the lead, last for the rest
function Set-SplitText($p, $ns, $sep, $prefix, $suffix) {
  $fl = Get-FirstLastRpr $p $ns
  Rebuild-Para $p $ns @(@($fl[0], $prefix), @($fl[1], "$sep$suffix"))
}

# "Label: rest" pattern: keep the label text and formatting, replace the rest
function Set-AfterLabel($p, $ns, $newRest) {
  $t = Get-ParaText $p $ns
  $idx = $t.IndexOf(": ")
  if ($idx -lt 0) { throw "no label in: $t" }
  $fl = Get-FirstLastRpr $p $ns
  Rebuild-Para $p $ns @(@($fl[0], $t.Substring(0, $idx + 2)), @($fl[1], $newRest))
}

function Replace-InText($body, $ns, $find, $repl) {
  foreach ($p in $body.SelectNodes(".//w:p", $ns)) {
    if ((Get-ParaText $p $ns).Contains($find)) {
      Merge-Runs $p $ns
      foreach ($t in $p.SelectNodes(".//w:t", $ns)) {
        if ($t.InnerText.Contains($find)) {
          $t.InnerText = $t.InnerText.Replace($find, $repl)
          Set-Preserve $t
          return $true
        }
      }
      return $false  # found in paragraph but split across formatting boundaries
    }
  }
  return $false
}

foreach ($name in @(
  "Sridhar_Mahalingam_Software_Developer_Qatar.docx",
  "Sridhar_Mahalingam_Software_Developer_Qatar_Full.docx",
  "Sridhar_Mahalingam_Software_Developer_Singapore.docx",
  "Sridhar_Mahalingam_Software_Developer_Singapore_Full.docx"
)) {
  $path = Join-Path $src $name
  $zip = [System.IO.Compression.ZipFile]::Open($path, "Update")
  try {
    $entry = $zip.GetEntry("word/document.xml")
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $content = $reader.ReadToEnd()
    $reader.Close()

    $xml = New-Object System.Xml.XmlDocument
    $xml.PreserveWhitespace = $true
    $xml.LoadXml($content)
    $ns = Get-NsMgr $xml
    $body = $xml.SelectSingleNode("/w:document/w:body", $ns)

    if ((Get-ParaText $body $ns).Contains("AI Research Agent")) {
      "$name : already contains project, skipping"
      continue
    }

    # 1) skills + profile line updates
    $mlOk = Replace-InText $body $ns $mlFind $mlRepl
    $profOk = Replace-InText $body $ns $profFind $profRepl

    # 2) locate TrafficVision block among body-level paragraphs
    $paras = @($body.SelectNodes(".//w:p", $ns))
    $i = -1
    for ($k = 0; $k -lt $paras.Count; $k++) {
      if ((Get-ParaText $paras[$k] $ns).StartsWith("TrafficVision")) { $i = $k; break }
    }
    if ($i -lt 0) { throw "$name : TrafficVision anchor not found" }
    $j = -1
    for ($k = $i + 1; $k -lt $paras.Count; $k++) {
      $t = Get-ParaText $paras[$k] $ns
      foreach ($nt in $NEXT_TITLES) { if ($t.StartsWith($nt)) { $j = $k; break } }
      if ($j -ge 0) { break }
    }
    if ($j -lt 0) { throw "$name : block end not found" }
    $N = $j - $i

    # 3) clone the block's paragraphs and insert before the original
    $anchor = $paras[$i]
    $parent = $anchor.ParentNode
    $clones = @()
    for ($k = $i; $k -lt $j; $k++) {
      if ($paras[$k].ParentNode -ne $parent) { throw "$name : block spans containers" }
      $c = $paras[$k].CloneNode($true)
      [void]$parent.InsertBefore($c, $anchor)
      $clones += $c
    }
    foreach ($c in $clones) { Merge-Runs $c $ns }

    # 4) rewrite the clones
    $isShort = (Get-ParaText $clones[1] $ns).StartsWith("Stack:")
    if ($isShort) {
      if ($N -ne 5) { throw "$name : expected 5-para short block, got $N" }
      Set-SplitText $clones[0] $ns $D $titleNew $roleShort
      Set-UniformText $clones[1] $ns $stackNew
      for ($b = 0; $b -lt 3; $b++) { Set-UniformText $clones[2 + $b] $ns $bullets[$b] }
    } else {
      if ($N -ne 12) { throw "$name : expected 12-para full block, got $N" }
      Set-UniformText $clones[0] $ns $titleNew
      Set-AfterLabel $clones[1] $ns $roleFull
      Set-AfterLabel $clones[2] $ns $toolsFull
      Set-AfterLabel $clones[3] $ns $statusFull
      Set-UniformText $clones[4] $ns $descFull
      # clones[5] = "Key Features" heading, unchanged
      for ($b = 0; $b -lt 6; $b++) {
        Set-SplitText $clones[6 + $b] $ns " $em " $features[$b][0] $features[$b][1]
      }
    }

    # 5) write document.xml back
    $stream = $entry.Open()
    $stream.SetLength(0)
    $writer = New-Object System.IO.StreamWriter($stream, (New-Object System.Text.UTF8Encoding($false)))
    $xml.Save($writer)
    $writer.Close()

    "$name : inserted (block=$N, short=$isShort) ml=$mlOk profile=$profOk"
  } finally {
    $zip.Dispose()
  }
}
"XML edit complete."
