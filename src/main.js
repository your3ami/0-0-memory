 (cd "$(git rev-parse --show-toplevel)" && printf '%s' 'diff --git a/src/main.js b/src/main.js
new file mode 100644
index 0000000000000000000000000000000000000000..3f800725c7a11995b40ef799d0729bb1b6d62431
--- /dev/null
+++ b/src/main.js
@@ -0,0 +1,104 @@
+const memories = [
+  { title: '\''비가 멈춘 뒤의 산책'\'', date: '\''2024. 05. 18'\'', text: '\''비가 그친 뒤라 공기가 유난히 맑았다. 우산을 접고, 우리가 좋아하는 골목으로 천천히 걸었다.'\'', image: '\''https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1000&q=85'\'', code: '\''M-001'\'' },
+  { title: '\''여름의 마지막 바다'\'', date: '\''2023. 08. 27'\'', text: '\''발끝을 적시는 파도와 조금 짠 바람. 해가 지기 전까지 아무 말도 하지 않았다.'\'', image: '\''https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85'\'', code: '\''M-002'\'' },
+  { title: '\''창가의 레몬 케이크'\'', date: '\''2023. 02. 14'\'', text: '\''조그만 접시 위의 노란 케이크. 따뜻한 오후가 유난히 오래 기억에 남았다.'\'', image: '\''https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1000&q=85'\'', code: '\''M-003'\'' }
+];
+
+let active = 0;
+let pixelated = false;
+let rating = 0;
+const $ = (selector) => document.querySelector(selector);
+
+function drawImage() {
+  const memory = memories[active];
+  const canvas = $('\''#pixelCanvas'\'');
+  const context = canvas.getContext('\''2d'\'');
+  const image = new Image();
+  image.crossOrigin = '\''anonymous'\'';
+  image.onload = () => {
+    context.clearRect(0, 0, canvas.width, canvas.height);
+    if (pixelated) {
+      const thumbnail = document.createElement('\''canvas'\'');
+      thumbnail.width = 40;
+      thumbnail.height = 27;
+      const smallContext = thumbnail.getContext('\''2d'\'');
+      smallContext.drawImage(image, 0, 0, thumbnail.width, thumbnail.height);
+      context.imageSmoothingEnabled = false;
+      context.drawImage(thumbnail, 0, 0, thumbnail.width, thumbnail.height, 0, 0, canvas.width, canvas.height);
+      return;
+    }
+    context.imageSmoothingEnabled = true;
+    context.drawImage(image, 0, 0, canvas.width, canvas.height);
+  };
+  image.src = memory.image;
+}
+
+function renderStars() {
+  $('\''#stars'\'').innerHTML = [1, 2, 3, 4, 5].map((value) => `<button class="star ${value <= rating ? '\''on'\'' : '\'''\''}" data-star="${value}" aria-label="${value}점">★</button>`).join('\'''\'');
+  document.querySelectorAll('\''.star'\'').forEach((star) => {
+    star.onclick = () => { rating = Number(star.dataset.star); renderStars(); };
+  });
+}
+
+function render() {
+  const memory = memories[active];
+  $('\''#memoryCode'\'').textContent = memory.code;
+  $('\''#detailCode'\'').textContent = memory.code;
+  $('\''#screenDate'\'').textContent = memory.date;
+  $('\''#screenTitle'\'').textContent = memory.title;
+  $('\''#memoryDate'\'').textContent = memory.date;
+  $('\''#memoryTitle'\'').textContent = memory.title;
+  $('\''#memoryText'\'').textContent = memory.text;
+  $('\''#archiveCount'\'').textContent = String(memories.length).padStart(2, '\''0'\'');
+  $('\''#comment'\'').value = '\'''\'';
+  rating = 0;
+  pixelated = false;
+  $('\''#pixelButton'\'').innerHTML = '\''PX<br />ON'\'';
+  document.querySelectorAll('\''.floating-chip'\'').forEach((chip) => chip.classList.toggle('\''active'\'', Number(chip.dataset.index) === active));
+  renderStars();
+  drawImage();
+}
+
+document.querySelectorAll('\''.floating-chip'\'').forEach((chip) => {
+  chip.onclick = () => {
+    active = Number(chip.dataset.index);
+    render();
+    $('\''#memoryDetail'\'').scrollIntoView({ behavior: '\''smooth'\'', block: '\''start'\'' });
+  };
+});
+
+$('\''#pixelButton'\'').onclick = () => {
+  pixelated = !pixelated;
+  $('\''#pixelButton'\'').innerHTML = pixelated ? '\''PX<br />OFF'\'' : '\''PX<br />ON'\'';
+  drawImage();
+};
+
+$('\''#saveNote'\'').onclick = () => {
+  const button = $('\''#saveNote'\'');
+  button.innerHTML = '\''NOTE SAVED ✓'\'';
+  button.classList.add('\''saved'\'');
+  setTimeout(() => { button.innerHTML = '\''SAVE A NOTE <b>↗</b>'\''; button.classList.remove('\''saved'\''); }, 1600);
+};
+
+$('\''#openArchive'\'').onclick = () => $('\''#memoryDetail'\'').scrollIntoView({ behavior: '\''smooth'\'' });
+$('\''#addButton'\'').onclick = () => $('\''#modal'\'').classList.add('\''open'\'');
+$('\''#closeModal'\'').onclick = () => $('\''#modal'\'').classList.remove('\''open'\'');
+$('\''#modal'\'').onclick = (event) => { if (event.target === $('\''#modal'\'')) $('\''#modal'\'').classList.remove('\''open'\''); };
+$('\''#memoryForm'\'').onsubmit = (event) => {
+  event.preventDefault();
+  const form = new FormData(event.target);
+  const code = `M-${String(memories.length + 1).padStart(3, '\''0'\'')}`;
+  memories.push({ title: form.get('\''title'\''), date: form.get('\''date'\''), text: form.get('\''text'\''), image: form.get('\''image'\''), code });
+  active = memories.length - 1;
+  const chip = document.createElement('\''button'\'');
+  chip.className = '\''floating-chip active chip-three'\'';
+  chip.dataset.index = active;
+  chip.innerHTML = `<span class="chip-art">✦</span><b>${form.get('\''title'\'').slice(0, 10)}</b><i>${code}</i>`;
+  chip.onclick = () => { active = Number(chip.dataset.index); render(); };
+  $('\''.arcade-stage'\'').append(chip);
+  $('\''#modal'\'').classList.remove('\''open'\'');
+  event.target.reset();
+  render();
+};
+
+render();
' | git apply --3way)
