document.addEventListener("DOMContentLoaded", () => {
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* storage unavailable, ignore */
      }
    },
  };

  /* ---------- urutan warna pin ---------- */
  const T568A = [
    ["Putih-Hijau", "#22c55e", true],
    ["Hijau", "#22c55e", false],
    ["Putih-Oranye", "#f97316", true],
    ["Biru", "#3b82f6", false],
    ["Putih-Biru", "#3b82f6", true],
    ["Oranye", "#f97316", false],
    ["Putih-Coklat", "#92400e", true],
    ["Coklat", "#92400e", false],
  ];
  const T568B = [
    ["Putih-Oranye", "#f97316", true],
    ["Oranye", "#f97316", false],
    ["Putih-Hijau", "#22c55e", true],
    ["Biru", "#3b82f6", false],
    ["Putih-Biru", "#3b82f6", true],
    ["Hijau", "#22c55e", false],
    ["Putih-Coklat", "#92400e", true],
    ["Coklat", "#92400e", false],
  ];

  function renderPins(listEl, data) {
    if (!listEl) return;
    listEl.innerHTML = data
      .map(([label, color, striped]) => {
        const dotClass = striped ? "dot stripe" : "dot solid";
        return `<li><span class="${dotClass}" style="--c:${color}"></span>${label}</li>`;
      })
      .join("");
  }
  renderPins(document.getElementById("pinListA"), T568A);
  renderPins(document.getElementById("pinListB"), T568B);

  /* ---------- logo situs (dari folder img/) ---------- */
  const siteLogo = document.getElementById("siteLogo");
  if (siteLogo) {
    siteLogo.addEventListener("error", () => {
      siteLogo.style.display = "none";
      const fallback = siteLogo.nextElementSibling;
      if (fallback) fallback.style.display = "grid";
    });
  }

  /* ---------- foto profil ---------- */
  const photoInput = document.getElementById("photoInput");
  let activeTarget = null;

  function loadPhoto(id) {
    const img = document.getElementById(`photo-${id}`);
    const saved = store.get(`photo:${id}`, "");
    if (img && saved) img.src = saved;
  }

  function bindAvatar(button) {
    const id = button.dataset.photo;
    loadPhoto(id);
    button.addEventListener("click", () => {
      activeTarget = id;
      photoInput.click();
    });
  }

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file || !activeTarget) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById(`photo-${activeTarget}`);
      if (img) img.src = reader.result;
      store.set(`photo:${activeTarget}`, reader.result);
    };
    reader.readAsDataURL(file);
    photoInput.value = "";
  });

  document.querySelectorAll(".avatar[data-photo]").forEach(bindAvatar);

  /* ---------- teks profil dosen ---------- */
  document.querySelectorAll('[data-person="dosen"] [contenteditable]').forEach((el) => {
    const key = `dosen:${el.dataset.field}`;
    const saved = store.get(key, "");
    if (saved) el.textContent = saved;
    el.addEventListener("blur", () => store.set(key, el.textContent.trim()));
  });

  /* ---------- foto mahasiswa (statis dari folder img/) ---------- */
  function bindStaticPhoto(img) {
    if (!img) return;
    img.addEventListener("error", () => {
      img.closest(".avatar-static").classList.add("img-missing");
    });
  }
  bindStaticPhoto(document.getElementById("studentPhoto"));
});
