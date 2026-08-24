# One-off: inserts the AI Research Agent project into all four resume masters
# in E:\sridhar reums, ahead of TrafficVision. Duplicates the TrafficVision
# block (so every style, list format and font carries over) and rewrites the
# copy's text. Also extends the Machine Learning skills line and the profile
# ML sentence. Backups already taken in E:\sridhar reums\backup_2026-08-24.
$ErrorActionPreference = "Stop"
$src = "E:\sridhar reums"
$logPath = Join-Path $env:TEMP "resume-edit-log.txt"
Remove-Item $logPath -Force -ErrorAction SilentlyContinue
function Log($s) { Add-Content -Path $logPath -Value "$(Get-Date -Format HH:mm:ss.fff) $s"; Write-Output $s }

$em  = [string][char]0x2014   # em dash
$en  = [string][char]0x2013   # en dash
$dot = [string][char]0x00B7   # middle dot
$arr = [string][char]0x2192   # right arrow
$D   = "  $dot  "

# ---- new content: short masters (title-prefix, title-suffix, stack, 3 bullets)
$titleNew   = "AI Research Agent $em Multi-Agent Research System with Verified Citations"
$roleShort  = "Independent project $dot sole architect & developer"
$stackNew   = "Stack: Python $dot LangGraph $dot FastAPI $dot Ollama (local LLM) $dot PostgreSQL + pgvector $dot FAISS $dot sentence-transformers $dot Next.js 16 $dot TypeScript"
$bullets = @(
  "Built a multi-agent research system on a LangGraph state machine $em Planner, Researcher, Analyst, Critic, Writer and Citation-Verifier agents that search the real web, build a per-session RAG index with full provenance, and generate findings grounded only in retrieved evidence $em all running on a fully local LLM (Ollama) with local embeddings and no cloud AI.",
  "Engineered hallucination reduction as architecture rather than prompting $em findings citing pages never fetched are discarded deterministically, a Critic gate loops the workflow back to research when evidence is insufficient (hard-capped at two iterations), and every citation in the final report is semantically verified against the session's own sources; measured citation coverage rose from 0% to 60$($en)86%.",
  "Delivered a FastAPI + Next.js research workstation streaming live agent progress over Server-Sent Events, with hybrid retrieval (dense embeddings fused with BM25 via reciprocal rank fusion), schema-constrained JSON decoding, provider-fallback web search and a built-in evaluation harness benchmarking citation coverage, groundedness and latency across local models $em 38 tests, all external services mocked."
)

# ---- new content: Full masters (label lines keep their bold "Role:" etc.)
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

# ---- skills / profile line updates (Find limit is 255 chars; these fit)
$mlFind = "PyTorch, FCOS object detection"
$mlRepl = "PyTorch, LangGraph multi-agent orchestration, RAG (pgvector, FAISS, hybrid BM25 retrieval), Ollama local LLM inference, FCOS object detection"
$profFind = "training OCR and computer-vision models internally without third-party AI services."
$profRepl = "training OCR and computer-vision models internally without third-party AI services, and building multi-agent LLM research systems on fully local models."

$NEXT_TITLES = @("CommerceOS", "Airsume", "MeetingMind", "Medical ERP", "ShieldDNS")

function Get-ParaText($para) { return $para.Range.Text.TrimEnd([char]13, [char]7) }

function Set-ParaText($doc, $para, $text) {
  $r = $para.Range.Duplicate
  $r.End = $r.End - 1
  $r.Text = $text
}

# Replace the text after a separator, then the text before it, preserving each
# side's run formatting (bold lead / regular rest).
function Split-SetText($doc, $para, $sep, $prefix, $suffix) {
  $t = Get-ParaText $para
  $idx = $t.IndexOf($sep)
  if ($idx -lt 0) { throw "separator '$sep' not found in: $t" }
  $S = $para.Range.Start
  $r2 = $doc.Range($S + $idx + $sep.Length, $S + $t.Length)
  $r2.Text = $suffix
  $r1 = $doc.Range($S, $S + $idx)
  $r1.Text = $prefix
}

# Replace only the text after a "Label: " lead.
function SetAfterLabel($doc, $para, $text) {
  $t = Get-ParaText $para
  $idx = $t.IndexOf(": ")
  if ($idx -lt 0) { throw "label not found in: $t" }
  $S = $para.Range.Start
  $r = $doc.Range($S + $idx + 2, $S + $t.Length)
  $r.Text = $text
}

# Word's Find.Execute hangs on these documents (observed spinning for 18+ min),
# so replace by locating the substring in a paragraph and setting the range text.
function ReplaceInDoc($doc, $find, $repl) {
  foreach ($p in $doc.Paragraphs) {
    $t = $p.Range.Text.TrimEnd([char]13, [char]7)
    $idx = $t.IndexOf($find)
    if ($idx -ge 0) {
      $S = $p.Range.Start
      $r = $doc.Range($S + $idx, $S + $idx + $find.Length)
      $r.Text = $repl
      return $true
    }
  }
  return $false
}

$m = [System.Reflection.Missing]::Value

foreach ($name in @(
  "Sridhar_Mahalingam_Software_Developer_Qatar.docx",
  "Sridhar_Mahalingam_Software_Developer_Qatar_Full.docx",
  "Sridhar_Mahalingam_Software_Developer_Singapore.docx",
  "Sridhar_Mahalingam_Software_Developer_Singapore_Full.docx"
)) {
  $path = Join-Path $src $name
  Log "=== $name : starting Word"
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  try {
    $word.Options.CheckSpellingAsYouType = $false
    $word.Options.CheckGrammarAsYouType = $false
    $doc = $word.Documents.Open($path, $false, $false, $false, $m, $m, $false, $m, $m, $m, $m, $false, $true)
    Log "opened, scanning"
    if ($doc.Content.Text.Contains("AI Research Agent")) {
      Log "$name : already contains AI Research Agent, skipping insert"
      $doc.Close($false); continue
    }
    $doc.TrackRevisions = $false

    # Word enters a state after the block rewrite where any further Find or
    # paragraph enumeration hangs, so do the small line replacements FIRST.
    $mlOk = ReplaceInDoc $doc $mlFind $mlRepl
    $profOk = ReplaceInDoc $doc $profFind $profRepl
    Log "line updates done: ml=$mlOk profile=$profOk"

    $paras = @($doc.Paragraphs)
    Log "paragraphs: $($paras.Count)"

    # locate the TrafficVision block and the next project title after it
    $i = -1
    for ($k = 0; $k -lt $paras.Count; $k++) {
      if ((Get-ParaText $paras[$k]).StartsWith("TrafficVision")) { $i = $k; break }
    }
    if ($i -lt 0) { throw "$name : TrafficVision anchor not found" }
    $j = -1
    for ($k = $i + 1; $k -lt $paras.Count; $k++) {
      $t = Get-ParaText $paras[$k]
      foreach ($nt in $NEXT_TITLES) { if ($t.StartsWith($nt)) { $j = $k; break } }
      if ($j -ge 0) { break }
    }
    if ($j -lt 0) { throw "$name : end of TrafficVision block not found" }
    $N = $j - $i
    Log "anchor at $i, block size $N"

    # duplicate the block in place (formatting preserved)
    $blockRange = $doc.Range($paras[$i].Range.Start, $paras[$j].Range.Start)
    $ins = $doc.Range($paras[$i].Range.Start, $paras[$i].Range.Start)
    $ins.FormattedText = $blockRange.FormattedText
    Log "block duplicated"

    # re-fetch: the new copy sits at i..i+N-1
    $paras = @($doc.Paragraphs)
    if (-not (Get-ParaText $paras[$i]).StartsWith("TrafficVision")) { throw "$name : duplication landed wrong" }
    if (-not (Get-ParaText $paras[$i + $N]).StartsWith("TrafficVision")) { throw "$name : original block not found after copy" }
    $block = $paras[$i..($i + $N - 1)]

    $isShort = (Get-ParaText $block[1]).StartsWith("Stack:")
    Log "rewriting (short=$isShort)"
    if ($isShort) {
      if ($N -ne 5) { throw "$name : expected 5-paragraph short block, got $N" }
      # bottom-up so earlier offsets stay valid
      Set-ParaText $doc $block[4] $bullets[2]
      Set-ParaText $doc $block[3] $bullets[1]
      Set-ParaText $doc $block[2] $bullets[0]
      Set-ParaText $doc $block[1] $stackNew
      Split-SetText $doc $block[0] $D $titleNew $roleShort
    } else {
      if ($N -ne 12) { throw "$name : expected 12-paragraph full block, got $N" }
      for ($b = 5; $b -ge 0; $b--) {
        Split-SetText $doc $block[6 + $b] " $em " $features[$b][0] $features[$b][1]
      }
      # block[5] is the "Key Features" heading - unchanged
      Set-ParaText $doc $block[4] $descFull
      SetAfterLabel $doc $block[3] $statusFull
      SetAfterLabel $doc $block[2] $toolsFull
      SetAfterLabel $doc $block[1] $roleFull
      Set-ParaText $doc $block[0] $titleNew
    }
    Log "rewrite done, saving"

    # OpenAndRepair yields a detached recovered document (FullName "Document1");
    # plain Save() never reaches the master, so save back to the path explicitly.
    $doc.SaveAs2($path, 16)
    Log "$name : inserted (block=$N paras, short=$isShort) ml-line=$mlOk profile=$profOk"
    $doc.Close($false)
  } finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
  }
}
Log "Masters updated."
