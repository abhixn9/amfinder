const PROFILES = [
  {
    id: "avery",
    name: "Avery",
    gender: "female",
    age: 27,
    city: "San Diego",
    distanceMi: 4.2,
    verified: true,
    avatar: { type: "emoji", emoji: "🌸", colorClass: "bg-rose" },
    interests: ["Coffee", "Hiking", "Indie films"],
  },
  {
    id: "maya",
    name: "Maya",
    gender: "female",
    age: 24,
    city: "Austin",
    distanceMi: 9.8,
    verified: false,
    avatar: { type: "emoji", emoji: "🧋", colorClass: "bg-blush" },
    interests: ["Boba", "Yoga", "Live music"],
  },
  {
    id: "jordan",
    name: "Jordan",
    gender: "male",
    age: 33,
    city: "Brooklyn",
    distanceMi: 2.1,
    verified: true,
    avatar: { type: "emoji", emoji: "🎧", colorClass: "bg-lilac" },
    interests: ["Podcasts", "Museums", "Cooking"],
  },
  {
    id: "sam",
    name: "Sam",
    gender: "male",
    age: 38,
    city: "Seattle",
    distanceMi: 14.6,
    verified: true,
    avatar: { type: "emoji", emoji: "🌲", colorClass: "bg-mint" },
    interests: ["Trail runs", "Photography", "Bookshops"],
  },
  {
    id: "noah",
    name: "Noah",
    gender: "male",
    age: 29,
    city: "Chicago",
    distanceMi: 3.7,
    verified: false,
    avatar: { type: "ai", seed: "noah" },
    interests: ["Basketball", "Street food", "Travel"],
  },
  {
    id: "isha",
    name: "Isha",
    gender: "female",
    age: 26,
    city: "Bengaluru",
    distanceMi: 5.4,
    verified: true,
    avatar: { type: "ai", seed: "isha" },
    interests: ["Startups", "Badminton", "Cafés"],
  },
  {
    id: "arjun",
    name: "Arjun",
    gender: "male",
    age: 31,
    city: "Delhi",
    distanceMi: 8.9,
    verified: true,
    avatar: { type: "ai", seed: "arjun" },
    interests: ["Cricket", "Road trips", "Photography"],
  },
  {
    id: "sara",
    name: "Sara",
    gender: "female",
    age: 28,
    city: "Mumbai",
    distanceMi: 6.1,
    verified: false,
    avatar: { type: "ai", seed: "sara" },
    interests: ["Books", "Pilates", "Music gigs"],
  },
  {
    id: "liam",
    name: "Liam",
    gender: "male",
    age: 25,
    city: "Toronto",
    distanceMi: 11.2,
    verified: false,
    avatar: { type: "ai", seed: "liam" },
    interests: ["Skiing", "Ramen", "Design"],
  },
  {
    id: "priya",
    name: "Priya",
    gender: "female",
    age: 30,
    city: "Pune",
    distanceMi: 7.3,
    verified: true,
    avatar: { type: "ai", seed: "priya" },
    interests: ["Dance", "Movies", "Cooking"],
  },
  {
    id: "emily",
    name: "Emily",
    gender: "female",
    age: 27,
    city: "London",
    distanceMi: 6.6,
    verified: true,
    avatar: { type: "ai", seed: "emily" },
    interests: ["Museums", "Tea", "Running"],
  },
  {
    id: "mateo",
    name: "Mateo",
    gender: "male",
    age: 32,
    city: "Madrid",
    distanceMi: 9.1,
    verified: false,
    avatar: { type: "ai", seed: "mateo" },
    interests: ["Football", "Tapas", "Travel"],
  },
  {
    id: "yuki",
    name: "Yuki",
    gender: "female",
    age: 25,
    city: "Tokyo",
    distanceMi: 4.9,
    verified: true,
    avatar: { type: "ai", seed: "yuki" },
    interests: ["Photography", "Ramen", "Art"],
  },
  {
    id: "lucas",
    name: "Lucas",
    gender: "male",
    age: 28,
    city: "São Paulo",
    distanceMi: 13.4,
    verified: false,
    avatar: { type: "ai", seed: "lucas" },
    interests: ["Coffee", "Music", "Gym"],
  },
  {
    id: "amina",
    name: "Amina",
    gender: "female",
    age: 29,
    city: "Cairo",
    distanceMi: 7.8,
    verified: true,
    avatar: { type: "ai", seed: "amina" },
    interests: ["Cooking", "History", "Movies"],
  },
  {
    id: "ethan",
    name: "Ethan",
    gender: "male",
    age: 30,
    city: "Sydney",
    distanceMi: 10.0,
    verified: true,
    avatar: { type: "ai", seed: "ethan" },
    interests: ["Beach", "Hiking", "BBQ"],
  },
];

let profiles = PROFILES.slice();

const state = {
  activeFilters: new Set(["all"]),
  lastLikedProfileId: null,
  toastTimer: null,
  auth: {
    loggedIn: false,
    premium: false,
    likeCount: 0,
    freeLikeLimit: 10,
    role: "user",
    userId: null,
    email: null,
    mobile: null,
    joinDate: null,
    streak: { count: 0, lastLoginDate: null },
    profile: {
      fullName: "",
      age: "",
      workPlace: "",
      homeTown: "",
      jobInfo: "",
      favFood: "",
      favPlaces: "",
      preference: "go_with_flow",
      dreamPlace: "",
      gender: "other",
      drinkingHabit: "none",
      hobbies: "",
      sports: "",
      images: [],
      selectedAvatar: "ai",
      customAvatarImage: null,
    },
  },
  likedProfileIds: new Set(),
  activeThreadProfileId: null,
  threads: new Map(), // profileId -> { profileId, messages: [{from,text,ts}] }
};

const STORAGE_KEY = "am_demo_state_v1";
let pendingResetCode = null;

const channel = new BroadcastChannel("am_chat_app");
channel.onmessage = (e) => {
  if (e.data.type === "NEW_PROFILE") {
    const p = e.data.profile;
    const existingIdx = profiles.findIndex(existing => existing.id === p.id);
    if (existingIdx === -1) {
      profiles.unshift(p);
      showToast(`${p.name} just joined!`);
    } else {
      profiles[existingIdx] = p;
    }
    renderProfiles();
  }
};

function toJsonSafeState() {
  return {
    auth: state.auth,
    likedProfileIds: Array.from(state.likedProfileIds),
    threads: Array.from(state.threads.entries()),
    likeCount: state.auth.likeCount,
    premium: state.auth.premium,
    customProfiles: profiles.filter(p => !PROFILES.find(x => x.id === p.id)),
  };
}

function hydrateFromSaved(saved) {
  if (!saved || typeof saved !== "object") return;
  if (saved.auth) state.auth = saved.auth;
  state.likedProfileIds = new Set(saved.likedProfileIds ?? []);
  state.threads = new Map(saved.threads ?? []);
  if (saved.customProfiles && Array.isArray(saved.customProfiles)) {
    for (const cp of saved.customProfiles) {
      if (!profiles.find(p => p.id === cp.id)) {
        profiles.unshift(cp);
      }
    }
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toJsonSafeState()));
  } catch {
    // ignore
  }
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    hydrateFromSaved(JSON.parse(raw));
  } catch {
    // ignore
  }
}

function hasCompletedProfile() {
  const p = state.auth.profile;
  return Boolean(
    p &&
      p.fullName &&
      String(p.age).trim() &&
      p.homeTown &&
      Array.isArray(p.images) &&
      p.images.length >= 4
  );
}

function $(selector) {
  return document.querySelector(selector);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function seededRand(seed) {
  // Simple deterministic PRNG from a string seed (non-crypto).
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function aiAvatarDataUrl(seed) {
  const rand = seededRand(String(seed));
  const hue = Math.floor(rand() * 360);
  const hue2 = (hue + 50 + Math.floor(rand() * 80)) % 360;
  const accentHue = (hue + 180) % 360;
  const bg1 = `hsl(${hue} 82% 56%)`;
  const bg2 = `hsl(${hue2} 86% 46%)`;
  const stroke = `hsla(${accentHue} 92% 62% / 0.72)`;
  const eye = `hsla(${accentHue} 86% 18% / 0.75)`;
  const x1 = clamp(24 + rand() * 10, 22, 34);
  const x2 = clamp(64 + rand() * 10, 60, 78);
  const mouthY = clamp(66 + rand() * 8, 60, 74);
  const mouthW = clamp(22 + rand() * 14, 18, 38);
  const mouthX = 50 - mouthW / 2;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${bg1}"/>
        <stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.22)"/>
      </filter>
    </defs>
    <rect x="0" y="0" width="128" height="128" rx="64" fill="url(#g)"/>
    <path d="M14 78 C 26 58, 40 54, 64 52 C 86 50, 100 56, 114 78 C 92 110, 36 116, 14 78 Z" fill="rgba(255,255,255,0.18)"/>
    <g filter="url(#s)">
      <circle cx="${x1}" cy="54" r="6.5" fill="rgba(255,255,255,0.62)"/>
      <circle cx="${x2}" cy="54" r="6.5" fill="rgba(255,255,255,0.62)"/>
      <circle cx="${x1}" cy="54" r="2.4" fill="${eye}"/>
      <circle cx="${x2}" cy="54" r="2.4" fill="${eye}"/>
      <path d="M${mouthX} ${mouthY} C ${mouthX + mouthW * 0.25} ${mouthY + 8}, ${
    mouthX + mouthW * 0.75
  } ${mouthY + 8}, ${mouthX + mouthW} ${mouthY}" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

function renderAvatar(avatar) {
  if (!avatar || avatar.type === "emoji") {
    const emoji = avatar?.emoji ?? "🙂";
    const colorClass = avatar?.colorClass ?? "bg-rose";
    return `<div class="avatar ${escapeHtml(colorClass)}" aria-hidden="true">${escapeHtml(emoji)}</div>`;
  }
  if (avatar.type === "ai") {
    const url = aiAvatarDataUrl(avatar.seed ?? "seed");
    return `<img class="avatar avatar-img" src="${url}" alt="" aria-hidden="true" />`;
  }
  return `<div class="avatar bg-rose" aria-hidden="true">🙂</div>`;
}

function showToast(message) {
  const el = $("#toast");
  if (!el) return;

  el.textContent = message;
  el.classList.add("is-visible");

  if (state.toastTimer) window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => el.classList.remove("is-visible"), 2200);
}

function onlyDigits(s) {
  return String(s ?? "").replace(/\D+/g, "");
}

function isValidEmail(email) {
  const v = String(email ?? "").trim();
  return v.length > 3 && v.includes("@") && v.includes(".");
}

function isValidMobile(mobile) {
  const d = onlyDigits(mobile);
  return d.length === 10;
}

function openModal(backdropSel, modalSel) {
  const backdrop = $(backdropSel);
  const modal = $(modalSel);
  if (backdrop) backdrop.hidden = false;
  if (modal) modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(backdropSel, modalSel) {
  const backdrop = $(backdropSel);
  const modal = $(modalSel);
  if (backdrop) backdrop.hidden = true;
  if (modal) modal.hidden = true;
  document.body.style.overflow = "";
}

function openAuthModal() {
  openModal("#authBackdrop", "#authModal");
  const tabAccount = $("#tabAccount");
  if (tabAccount instanceof HTMLButtonElement) tabAccount.disabled = true;
  setAuthPanel("contact");
}

function closeAuthModal() {
  if (!state.auth.loggedIn) {
    showToast("Please sign up to continue");
    return;
  }
  closeModal("#authBackdrop", "#authModal");
}

function openPremiumModal() {
  openModal("#premiumBackdrop", "#premiumModal");
}

function closePremiumModal() {
  closeModal("#premiumBackdrop", "#premiumModal");
}

function setPaymentStatus(message) {
  const el = $("#paymentStatus");
  if (el) el.textContent = message;
}

function setSelectedPlan(plan) {
  const title = $("#paymentPlanTitle");
  if (!title) return;
  if (plan === "1") title.textContent = "Premium — $49 / month";
  else if (plan === "3") title.textContent = "Premium — $299 / 3 months";
  else if (plan === "6") title.textContent = "Premium — $699 / 6 months";
  else title.textContent = "Premium";
}

function openPaymentModal(plan) {
  setSelectedPlan(plan);
  setPaymentStatus("");
  $("#cardNumber") && ($("#cardNumber").value = "");
  $("#cardExpiry") && ($("#cardExpiry").value = "");
  $("#cardCvv") && ($("#cardCvv").value = "");
  openPremiumModal();
  $("#cardNumber")?.focus();
}

function resetAuth() {
  setAuthPanel("contact");
}

function setAuthPanel(next) {
  const tabContact = $("#tabContact");
  const tabAccount = $("#tabAccount");
  const tabReset = $("#tabReset");

  const panelContact = $("#panelContact");
  const panelAccount = $("#panelAccount");
  const panelResetEmail = $("#panelResetEmail");
  const panelResetCode = $("#panelResetCode");

  const show = (name) => name === next;
  if (panelContact) panelContact.hidden = !show("contact");
  if (panelAccount) panelAccount.hidden = !show("account");
  if (panelResetEmail) panelResetEmail.hidden = !show("reset_email");
  if (panelResetCode) panelResetCode.hidden = !show("reset_code");

  const markTab = (tab, active) => {
    tab?.classList.toggle("is-active", active);
    tab?.setAttribute?.("aria-selected", active ? "true" : "false");
  };
  markTab(tabContact, next === "contact");
  markTab(tabAccount, next === "account");
  markTab(tabReset, next === "reset_email" || next === "reset_code");

  if (next === "contact") $("#signupEmail")?.focus();
  if (next === "account") $("#signupUserId")?.focus();
  if (next === "reset_email") $("#resetEmail")?.focus();
  if (next === "reset_code") $("#resetCode")?.focus();
}

function markLoggedIn({ method, identifier }) {
  state.auth.loggedIn = true;
  document.body.classList.remove("is-locked");
  closeAuthModal();
  navigateView("discover");
  showToast(`Welcome (${method}${identifier ? `: ${identifier}` : ""})`);
  renderProfileView();
  renderMatchesView();
  renderThreads();
  persist();
  if (!hasCompletedProfile()) {
    showToast("Please fill your profile details");
    navigateView("register");
    document.querySelector("#registerDetailsForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function canLikeMore() {
  if (!state.auth.loggedIn) return { ok: false, reason: "login" };
  if (state.auth.premium) return { ok: true };
  if (state.auth.likeCount < state.auth.freeLikeLimit) return { ok: true };
  return { ok: false, reason: "premium" };
}

function filterLabel(key) {
  switch (key) {
    case "all":
      return "All";
    case "age_18_25":
      return "18–25";
    case "age_26_35":
      return "26–35";
    case "age_36_plus":
      return "36+";
    case "nearby":
      return "Nearby";
    case "verified":
      return "Verified";
    default:
      return key;
  }
}

function getActiveFiltersList() {
  return Array.from(state.activeFilters).sort((a, b) => {
    if (a === "all") return -1;
    if (b === "all") return 1;
    return a.localeCompare(b);
  });
}

function profileMatchesFilters(profile) {
  const filters = state.activeFilters;
  if (filters.has("all") && filters.size === 1) return true;

  const ageOk =
    (!filters.has("age_18_25") && !filters.has("age_26_35") && !filters.has("age_36_plus")) ||
    (filters.has("age_18_25") && profile.age >= 18 && profile.age <= 25) ||
    (filters.has("age_26_35") && profile.age >= 26 && profile.age <= 35) ||
    (filters.has("age_36_plus") && profile.age >= 36);

  const nearbyOk = !filters.has("nearby") || profile.distanceMi <= 10;
  const verifiedOk = !filters.has("verified") || profile.verified === true;

  return ageOk && nearbyOk && verifiedOk;
}

function renderActiveFilterNote() {
  const el = $("#activeFilterNote");
  if (!el) return;

  const list = getActiveFiltersList();
  if (list.length === 1 && list[0] === "all") {
    el.textContent = "Showing: All profiles";
    return;
  }

  el.textContent = `Filters: ${list.map(filterLabel).join(", ")}`;
}

function renderProfiles() {
  const grid = $("#profilesGrid");
  if (!grid) return;

  const visible = profiles.filter(profileMatchesFilters);
  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="placeholder" style="grid-column: 1 / -1;">
        <div class="placeholder-title">No profiles found</div>
        <div class="placeholder-sub">Try clearing a filter chip.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = visible
    .map((p) => {
      const tags = p.interests.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
      const badge = p.verified ? `<span class="badge">✔ Verified</span>` : "";
      const avatarHtml = renderAvatar(p.avatar);
      return `
        <article class="profile-card" data-profile-id="${escapeHtml(p.id)}">
          <div class="profile-top">
            <div class="profile-left">
              ${avatarHtml}
              <div class="profile-text">
                <div class="profile-name">${escapeHtml(p.name)}, ${p.age}</div>
                <div class="profile-meta">${escapeHtml(p.city)} • ${p.distanceMi.toFixed(
        1
      )} mi away</div>
              </div>
            </div>
            ${badge}
          </div>
          <div class="tags" aria-label="Interests">${tags}</div>
          <div class="profile-actions">
            <button class="btn btn-small btn-ghost" type="button" data-action="skip">Skip</button>
            <button class="btn btn-small btn-like" type="button" data-action="like">Like</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sendPrompt(profile) {
  const greeting = pick([
    `Hey ${profile.name}!`,
    `Hi ${profile.name} —`,
    `Hey ${profile.name} :)`,
    `Hi ${profile.name}!`,
  ]);

  const interest = pick(profile.interests);
  const cityHook = pick([
    `I’m curious—what’s your favorite spot in ${profile.city}?`,
    `Any must-try places in ${profile.city} lately?`,
    `What’s a perfect weekend in ${profile.city} for you?`,
  ]);

  const interestHook = pick([
    `I saw you’re into ${interest}. What got you into it?`,
    `If we did something ${interest}-related this week, what would you pick?`,
    `Your ${interest} tag caught my eye—recommend me one thing to start with?`,
  ]);

  return `${greeting} ${interestHook} ${cityHook}`;
}

function setGeneratedMessage(profile, message) {
  const textarea = $("#generatedMessage");
  const meta = $("#composerMeta");
  if (textarea) textarea.value = message;
  if (meta) meta.textContent = `For ${profile.name}, ${profile.age} • ${profile.city}`;
}

function wireChips() {
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.getAttribute("data-filter");
      if (!key) return;

      const next = new Set(state.activeFilters);
      const isAll = key === "all";
      const isActive = next.has(key);

      if (isAll) {
        next.clear();
        next.add("all");
      } else {
        next.delete("all");
        if (isActive) next.delete(key);
        else next.add(key);
        if (next.size === 0) next.add("all");
      }

      state.activeFilters = next;

      chips.forEach((c) => {
        const k = c.getAttribute("data-filter");
        c.classList.toggle("is-active", k ? state.activeFilters.has(k) : false);
      });

      renderActiveFilterNote();
      renderProfiles();
    });
  });
}

function wireGridActions() {
  const grid = $("#profilesGrid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (!target) return;

    const action = target.getAttribute("data-action");

    const card = target.closest("[data-profile-id]");
    const id = card ? card.getAttribute("data-profile-id") : null;
    if (!id) return;

    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;

    if (!action) {
      const modal = $("#otherProfileModal");
      if (modal) {
        const mockJoin = new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString();
        const mockStreak = Math.floor(Math.random() * 15);
        const mockPremium = Math.random() > 0.5 ? "Premium" : "Basic plan";
        const mockDrinking = ["none", "rare", "regular"][Math.floor(Math.random() * 3)];
        
        const titleEl = $("#otherProfileTitle");
        if(titleEl) titleEl.textContent = `${profile.name}'s Profile`;
        const idEl = $("#otherProfileUserId");
        if(idEl) idEl.textContent = profile.id;
        const joinEl = $("#otherProfileJoinDate");
        if(joinEl) joinEl.textContent = mockJoin;
        const planEl = $("#otherProfilePlan");
        if(planEl) planEl.textContent = mockPremium;
        const drinkEl = $("#otherProfileDrinking");
        if(drinkEl) drinkEl.textContent = mockDrinking;
        const streakEl = $("#otherProfileStreak");
        if(streakEl) streakEl.textContent = mockStreak;
        const prefEl = $("#otherProfilePreference");
        if(prefEl) prefEl.textContent = "go_with_flow";
        const hobEl = $("#otherProfileHobbies");
        if(hobEl) hobEl.textContent = "reading, gaming";
        const sportEl = $("#otherProfileSports");
        if(sportEl) sportEl.textContent = "basketball";
        
        const avatarContainer = $("#otherProfileAvatarContainer");
        if (avatarContainer) {
          avatarContainer.innerHTML = renderAvatar(profile.avatar).replace("avatar-img", "avatar-img avatar-lg").replace("avatar", "avatar avatar-lg");
        }
        
        modal.hidden = false;
      }
      return;
    }

    if (action === "skip") {
      showToast(`Skipped ${profile.name}`);
      return;
    }

    if (action === "like") {
      const gate = canLikeMore();
      if (!gate.ok) {
        if (gate.reason === "login") {
          showToast("Please log in to like profiles");
          openAuthModal();
          return;
        }
        if (gate.reason === "premium") {
          showToast("Basic plan likes finished — upgrade to Premium");
          openPremiumModal();
          return;
        }
      }

      const overlay = $("#heartOverlay");
      if (overlay) {
        overlay.hidden = false;
        overlay.classList.remove("is-animating");
        void overlay.offsetWidth;
        overlay.classList.add("is-animating");
        setTimeout(() => {
          overlay.classList.remove("is-animating");
          overlay.hidden = true;
        }, 1200);
      }

      state.auth.likeCount += 1;
      state.lastLikedProfileId = profile.id;
      state.likedProfileIds.add(profile.id);
      const message = sendPrompt(profile);
      setGeneratedMessage(profile, message);
      ensureThread(profile.id);
      state.threads.get(profile.id).messages.push({ from: "me", text: message, ts: Date.now() });
      state.threads.get(profile.id).messages.push({ from: "them", text: "Hey! Nice to meet you.", ts: Date.now() });
      renderMatchesView();
      renderThreads();
      persist();
      showToast(`Liked ${profile.name} — opener generated`);
      document.querySelector(".composer")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  });
}

function wireTopButtons() {
  $("#otherProfileCloseBtn")?.addEventListener("click", () => {
    const modal = $("#otherProfileModal");
    if (modal) modal.hidden = true;
  });

  $("#myProfileBtn")?.addEventListener("click", () => {
    if (!state.auth.loggedIn) {
      openAuthModal();
      return;
    }
    navigateView("profile");
  });
  $("#getStartedBtn")?.addEventListener("click", () => {
    document.querySelector("#discover")?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Scroll to Discover");
  });
  $("#howItWorksBtn")?.addEventListener("click", () =>
    toggleHowItWorks()
  );
  $("#viewMatchesBtn")?.addEventListener("click", () => {
    document.querySelector("#matches")?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Scroll to Matches");
  });
}

function toggleHowItWorks() {
  const bar = $("#howItWorksBar");
  if (!bar) return;
  bar.hidden = !bar.hidden;
  if (!bar.hidden) {
    bar.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function wireComposer() {
  $("#copyMessageBtn")?.addEventListener("click", async () => {
    const textarea = $("#generatedMessage");
    const value = textarea ? textarea.value.trim() : "";
    if (!value) {
      showToast("Nothing to copy yet");
      return;
    }
    const ok = await copyToClipboard(value);
    showToast(ok ? "Copied to clipboard" : "Copy failed (browser permission)");
  });

  $("#clearMessageBtn")?.addEventListener("click", () => {
    const textarea = $("#generatedMessage");
    const meta = $("#composerMeta");
    if (textarea) textarea.value = "";
    if (meta) meta.textContent = "Like a profile to generate a message.";
    showToast("Cleared");
  });
}

function wireAuth() {
  $("#authCloseBtn")?.addEventListener("click", closeAuthModal);
  $("#authBackdrop")?.addEventListener("click", closeAuthModal);

  $("#tabContact")?.addEventListener("click", () => setAuthPanel("contact"));
  $("#tabAccount")?.addEventListener("click", () => {
    const btn = $("#tabAccount");
    if (btn instanceof HTMLButtonElement && btn.disabled) return;
    setAuthPanel("account");
  });
  $("#tabReset")?.addEventListener("click", () => setAuthPanel("reset_email"));

  $("#signupNextBtn")?.addEventListener("click", () => {
    const email = $("#signupEmail")?.value ?? "";
    const mobile = $("#signupMobile")?.value ?? "";
    if (!isValidEmail(email)) {
      showToast("Enter a valid email");
      $("#signupEmail")?.focus();
      return;
    }
    if (!isValidMobile(mobile)) {
      showToast("Enter a valid 10-digit mobile number");
      $("#signupMobile")?.focus();
      return;
    }
    const tabAccount = $("#tabAccount");
    if (tabAccount instanceof HTMLButtonElement) tabAccount.disabled = false;
    setAuthPanel("account");
  });

  $("#signupBackBtn")?.addEventListener("click", () => {
    setAuthPanel("contact");
  });

  $("#forgotPasswordBtn")?.addEventListener("click", () => setAuthPanel("reset_email"));
  $("#resetBackBtn")?.addEventListener("click", () => setAuthPanel("account"));

  $("#sendResetCodeBtn")?.addEventListener("click", () => {
    const email = $("#resetEmail")?.value ?? "";
    if (!isValidEmail(email)) {
      showToast("Enter a valid email");
      $("#resetEmail")?.focus();
      return;
    }
    pendingResetCode = String(Math.floor(100000 + Math.random() * 900000));
    showToast(`Verification code sent (mock: ${pendingResetCode})`);
    setAuthPanel("reset_code");
  });

  $("#resetEmailTabBtn")?.addEventListener("click", () => setAuthPanel("reset_email"));
  $("#verifyResetCodeBtn")?.addEventListener("click", () => {
    const code = onlyDigits($("#resetCode")?.value ?? "");
    if (!pendingResetCode) {
      showToast("Please request a code first");
      setAuthPanel("reset_email");
      return;
    }
    if (code !== pendingResetCode) {
      showToast("Incorrect verification code");
      $("#resetCode")?.focus();
      return;
    }
    pendingResetCode = null;
    showToast("Verified. You can create a new password (mock).");
    setAuthPanel("account");
  });

  $("#signupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#signupEmail")?.value ?? "";
    const mobile = $("#signupMobile")?.value ?? "";
    const userId = $("#signupUserId")?.value?.trim() ?? "";
    const roleRequested = $("#signupRole")?.value ?? "user";
    const password = $("#signupPassword")?.value ?? "";
    if (!isValidEmail(email)) {
      showToast("Enter a valid email");
      setAuthPanel("contact");
      return;
    }
    if (!isValidMobile(mobile)) {
      showToast("Enter a valid 10-digit mobile number");
      setAuthPanel("contact");
      return;
    }
    if (!userId) {
      showToast("Create your User ID");
      $("#signupUserId")?.focus();
      return;
    }
    if (!password) {
      showToast("Create your password");
      $("#signupPassword")?.focus();
      return;
    }

    // Exactly two admin accounts are allowed (mock): admin1 / admin2
    const normalizedId = userId.toLowerCase();
    const role =
      roleRequested === "admin" && (normalizedId === "admin1" || normalizedId === "admin2")
        ? "admin"
        : "user";

    state.auth.userId = userId;
    state.auth.email = String(email).trim();
    state.auth.mobile = onlyDigits(mobile);
    state.auth.role = role;
    markLoggedIn({ method: role === "admin" ? "Admin" : "User", identifier: userId });
  });

  $("#showLoginFieldsBtn")?.addEventListener("click", () => {
    const container = $("#loginFieldsContainer");
    if (container) {
      container.hidden = false;
      $("#loginUserId")?.focus();
    }
  });

  $("#loginBtn")?.addEventListener("click", () => {
    const userId = $("#loginUserId")?.value?.trim() ?? "";
    const password = $("#loginPassword")?.value?.trim() ?? "";
    if (!userId || !password) {
      showToast("Please enter both User ID and Password");
      return;
    }
    
    const normalizedId = userId.toLowerCase();
    const role = (normalizedId === "admin1" || normalizedId === "admin2") ? "admin" : "user";
    
    state.auth.userId = userId;
    state.auth.email = "existing@example.com";
    state.auth.mobile = "9999999999";
    state.auth.role = role;
    markLoggedIn({ method: role === "admin" ? "Admin" : "User", identifier: userId });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#authModal")?.hidden) closeAuthModal();
    if (!$("#premiumModal")?.hidden) closePremiumModal();
  });
}

function wirePremium() {
  $("#premiumCloseBtn")?.addEventListener("click", closePremiumModal);
  $("#premiumBackdrop")?.addEventListener("click", closePremiumModal);
  $("#paymentCancelBtn")?.addEventListener("click", closePremiumModal);
  $("#paymentForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const number = onlyDigits($("#cardNumber")?.value ?? "");
    const cvv = onlyDigits($("#cardCvv")?.value ?? "");
    const expiry = String($("#cardExpiry")?.value ?? "").trim();

    if (number.length !== 16) {
      setPaymentStatus("Payment failed: enter a valid 16-digit card number.");
      return;
    }
    if (cvv.length !== 3) {
      setPaymentStatus("Payment failed: enter a valid 3-digit CVV.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setPaymentStatus("Payment failed: expiry must be MM/YY.");
      return;
    }

    // Mock payment result
    const ok = Math.random() < 0.8;
    if (!ok) {
      setPaymentStatus("Payment is failed. Please try again.");
      showToast("Payment failed");
      return;
    }

    state.auth.premium = true;
    persist();
    setPaymentStatus("Congratulations! You got the Premium plan.");
    showToast("Congratulations for getting the Premium plan");
    renderProfileView();
    renderMatchesView();
    window.setTimeout(() => closePremiumModal(), 900);
  });
}

function wirePremiumPlansInProfile() {
  $("#profile")?.addEventListener("click", (e) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    const btn = target?.closest("[data-premium-plan]");
    const plan = btn ? btn.getAttribute("data-premium-plan") : null;
    if (!plan) return;
    if (!state.auth.loggedIn) return openAuthModal();
    openPaymentModal(plan);
  });
}

function setActiveNav(view) {
  document.querySelectorAll(".nav-link").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    const id = href.startsWith("#") ? href.slice(1) : href;
    a.classList.toggle("is-active", id === view);
  });
}

function navigateView(view) {
  document.body.dataset.view = view;
  setActiveNav(view);
  if (view === "discover") {
    document.querySelector("#discover")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    document.querySelector(`#${view}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const overlay = $("#amOverlay");
  if (overlay) {
    overlay.style.pointerEvents = "auto";
    overlay.style.opacity = "1";
    setTimeout(() => {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }, 500);
  }
}

function ensureThread(profileId) {
  if (!state.threads.has(profileId)) {
    state.threads.set(profileId, { profileId, messages: [] });
  }
}

function renderMatchesView() {
  const grid = $("#matchesGrid");
  if (!grid) return;
  const likesNote = $("#matchesLikesNote");
  if (likesNote) {
    likesNote.textContent = state.auth.premium
      ? `Premium • Likes: ${state.auth.likeCount}`
      : `Basic plan • Likes: ${state.auth.likeCount}/${state.auth.freeLikeLimit}`;
  }
  const list = profiles.filter((p) => state.likedProfileIds.has(p.id));
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="placeholder" style="grid-column: 1 / -1;">
        <div class="placeholder-title">No matches yet</div>
        <div class="placeholder-sub">Like a profile in Discover to see it here.</div>
      </div>
    `;
    return;
  }
  grid.innerHTML = list
    .map((p) => {
      const avatarHtml = renderAvatar(p.avatar);
      return `
        <article class="profile-card" data-thread-profile-id="${escapeHtml(p.id)}">
          <div class="profile-top">
            <div class="profile-left">
              ${avatarHtml}
              <div class="profile-text">
                <div class="profile-name">${escapeHtml(p.name)}, ${p.age}</div>
                <div class="profile-meta">${escapeHtml(p.city)} • ${p.distanceMi.toFixed(1)} mi away</div>
              </div>
            </div>
            ${p.verified ? `<span class="badge">✔ Verified</span>` : ""}
          </div>
          <div class="profile-actions">
            <button class="btn btn-small btn-primary" type="button" data-open-thread="${escapeHtml(
              p.id
            )}">Message</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProfileView() {
  $("#profileStreak") && ($("#profileStreak").textContent = state.auth.streak?.count || 0);

  const avatarContainer = $("#profileAvatarContainer");
  if (avatarContainer) {
    const selected = state.auth.profile.selectedAvatar || "ai";
    const customImg = state.auth.profile.customAvatarImage || (state.auth.profile.images && state.auth.profile.images[0] ? state.auth.profile.images[0] : null);
    if (selected === "image" && customImg) {
      avatarContainer.innerHTML = `<img src="${customImg}" class="avatar avatar-lg" style="width: 80px; height: 80px; border: 2px solid var(--accent); object-fit: cover;" />`;
    } else if (selected !== "ai" && selected !== "image") {
      avatarContainer.innerHTML = `<div class="avatar avatar-lg bg-rose" style="width:80px;height:80px;font-size:40px;border: 2px solid var(--accent);">${escapeHtml(selected)}</div>`;
    } else {
      const html = renderAvatar({ type: "ai", seed: state.auth.userId });
      avatarContainer.innerHTML = html.replace("avatar-img", "avatar-img avatar-lg").replace("avatar", "avatar avatar-lg");
    }
  }

  // Update chips UI
  const chips = document.querySelectorAll("#avatarSelector .chip");
  chips.forEach(chip => {
    const isSelected = chip.getAttribute("data-avatar") === (state.auth.profile.selectedAvatar || "ai");
    chip.classList.toggle("is-active", isSelected);
  });

  $("#profileUserId") && ($("#profileUserId").textContent = state.auth.userId ?? "—");
  $("#profileJoinDate") && ($("#profileJoinDate").textContent = state.auth.joinDate ?? "—");
  $("#profileRole") && ($("#profileRole").textContent = state.auth.role ?? "—");
  $("#profileEmail") && ($("#profileEmail").textContent = state.auth.email ?? "—");
  $("#profileMobile") && ($("#profileMobile").textContent = state.auth.mobile ?? "—");
  $("#profileHobbies") && ($("#profileHobbies").textContent = state.auth.profile.hobbies || "—");
  $("#profileSports") && ($("#profileSports").textContent = state.auth.profile.sports || "—");
  $("#profilePlan") &&
    ($("#profilePlan").textContent = state.auth.premium ? "Premium" : "Basic plan");

  const adminPanel = $("#adminPanel");
  if (adminPanel) adminPanel.hidden = state.auth.role !== "admin";
  if (state.auth.role === "admin") {
    reloadAdminJson();
  }

  // Profile view is separate; editing happens in Register tab.
}

function reloadAdminJson() {
  const ta = $("#adminProfilesJson");
  if (!ta) return;
  ta.value = JSON.stringify(profiles, null, 2);
}

function applyAdminJson() {
  const ta = $("#adminProfilesJson");
  if (!ta) return;
  try {
    const next = JSON.parse(ta.value);
    if (!Array.isArray(next)) throw new Error("JSON must be an array");
    profiles = next;
    renderProfiles();
    renderMatchesView();
    showToast("Applied profile changes (mock)");
  } catch {
    showToast("Invalid JSON — could not apply");
  }
}

function renderThreads() {
  const listEl = $("#threadsList");
  if (!listEl) return;
  const matched = profiles.filter((p) => state.likedProfileIds.has(p.id));
  if (matched.length === 0) {
    listEl.innerHTML = `<div class="help">No threads yet. Like someone first.</div>`;
    return;
  }
  listEl.innerHTML = matched
    .map((p) => {
      ensureThread(p.id);
      const thread = state.threads.get(p.id);
      const last = thread.messages.at(-1)?.text ?? "Say hi 👋";
      const active = state.activeThreadProfileId === p.id;
      return `
        <div class="thread-item ${active ? "is-active" : ""}" data-thread-id="${escapeHtml(p.id)}">
          ${renderAvatar(p.avatar)}
          <div class="thread-meta">
            <div class="thread-name">${escapeHtml(p.name)}</div>
            <div class="thread-sub">${escapeHtml(last)}</div>
          </div>
        </div>
      `;
    })
    .join("");

  if (!state.activeThreadProfileId && matched[0]) {
    state.activeThreadProfileId = matched[0].id;
  }
  renderChat();
}

function renderChat() {
  const head = $("#chatHead");
  const body = $("#chatBody");
  if (!head || !body) return;
  const id = state.activeThreadProfileId;
  if (!id) {
    head.textContent = "Select a match to chat";
    body.innerHTML = "";
    return;
  }
  const profile = profiles.find((p) => p.id === id);
  ensureThread(id);
  const thread = state.threads.get(id);
  head.textContent = profile ? `Chat with ${profile.name}` : "Chat";
  body.innerHTML = thread.messages
    .map((m, i) => `<div class="bubble ${m.from === "me" ? "me" : "them"}" data-msg-idx="${i}">${escapeHtml(m.text)}</div>`)
    .join("");
  body.scrollTop = body.scrollHeight;
}

function wireNavigation() {
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href") ?? "#discover";
      const view = href.startsWith("#") ? href.slice(1) : href;
      if (!state.auth.loggedIn) {
        openAuthModal();
        return;
      }
      navigateView(view);
    });
  });
  $("#viewMatchesBtn")?.addEventListener("click", () => {
    if (!state.auth.loggedIn) return openAuthModal();
    navigateView("matches");
  });
}

function wireMatchesAndMessages() {
  $("#matches")?.addEventListener("click", (e) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (!target) return;
    const openId = target.getAttribute("data-open-thread");
    if (!openId) return;
    state.activeThreadProfileId = openId;
    navigateView("messages");
    renderThreads();
  });

  const threadsList = $("#threadsList");
  if (threadsList) {
    threadsList.addEventListener("click", (e) => {
      const target = e.target instanceof HTMLElement ? e.target : null;
      const item = target?.closest("[data-thread-id]");
      const id = item ? item.getAttribute("data-thread-id") : null;
      if (!id) return;
      state.activeThreadProfileId = id;
      renderThreads();
    });
  }


  $("#chatEmojiBar")?.addEventListener("click", (e) => {
    const target = e.target;
    if (target.id === "allEmojisToggleBtn") {
      const container = $("#fullEmojiPickerContainer");
      if (container) container.hidden = !container.hidden;
      return;
    }
    if (target.tagName !== "BUTTON") return;
    const emoji = target.getAttribute("data-emoji");
    if (!emoji) return;
    const input = $("#chatInput");
    if (input) {
      input.value += emoji;
      input.focus();
    }
  });

  const picker = document.querySelector("emoji-picker");
  if (picker) {
    picker.addEventListener("emoji-click", event => {
      const input = $("#chatInput");
      if (input) {
        input.value += event.detail.unicode;
        input.focus();
      }
      const container = $("#fullEmojiPickerContainer");
      if (container) container.hidden = true;
    });
  }

  $("#chatComposeForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#chatInput");
    const text = input?.value?.trim() ?? "";
    if (!text) return;
    const id = state.activeThreadProfileId;
    if (!id) return;
    ensureThread(id);
    state.threads.get(id).messages.push({ from: "me", text, ts: Date.now() });
    input.value = "";
    renderThreads();
    
    // Simulate real reply
    setTimeout(async () => {
      const lower = text.toLowerCase();
      let reply = "That's interesting! Tell me more.";
      
      const isQuestion = lower.includes("what is") || lower.includes("who is");
      if (isQuestion) {
        try {
          const match = text.match(/(?:what is|who is)\s+(.*?)(?:\?|$)/i);
          if (match && match[1]) {
            const topic = match[1].trim();
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.extract) reply = data.extract;
              else reply = "I couldn't find a direct answer for that, but it sounds fascinating!";
            } else {
              reply = "I couldn't find an answer for that right now.";
            }
          }
        } catch(e) {
          reply = "I'm having trouble thinking of the answer to that right now.";
        }
      } else if (lower.includes("how are you")) {
        reply = "I'm doing great, thanks for asking! How about you?";
      } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        reply = "Hey there! 😊";
      } else if (lower.includes("what are you doing") || lower.includes("up to")) {
        reply = "Just chatting with you! What are you up to?";
      } else if (lower.includes("love") || lower.includes("like")) {
        reply = "I love that too! ❤️";
      } else if (lower.includes("?")) {
        reply = "That's a good question! What do you think?";
      } else if (text.length < 5) {
        reply = "Haha nice!";
      }
      
      state.threads.get(id).messages.push({
        from: "them",
        text: reply,
        ts: Date.now(),
      });
      renderThreads();
    }, 1000);
  });
}

function wireAdmin() {
  $("#adminReloadJsonBtn")?.addEventListener("click", reloadAdminJson);
  $("#adminApplyJsonBtn")?.addEventListener("click", applyAdminJson);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function renderRegisterForm() {
  const p = state.auth.profile ?? {};
  $("#regFullName") && ($("#regFullName").value = p.fullName ?? "");
  $("#regAge") && ($("#regAge").value = p.age ?? "");
  $("#regWorkPlace") && ($("#regWorkPlace").value = p.workPlace ?? "");
  $("#regHomeTown") && ($("#regHomeTown").value = p.homeTown ?? "");
  $("#regJobInfo") && ($("#regJobInfo").value = p.jobInfo ?? "");
  $("#regFavFood") && ($("#regFavFood").value = p.favFood ?? "");
  $("#regFavPlaces") && ($("#regFavPlaces").value = p.favPlaces ?? "");
  $("#regPreference") && ($("#regPreference").value = p.preference ?? "go_with_flow");
  $("#regDreamPlace") && ($("#regDreamPlace").value = p.dreamPlace ?? "");
  $("#regGender") && ($("#regGender").value = p.gender ?? "other");
  $("#regHobbies") && ($("#regHobbies").value = p.hobbies ?? "");
  $("#regSports") && ($("#regSports").value = p.sports ?? "");
  renderRegisterImages();
}

function renderRegisterImages() {
  const grid = $("#regImagesGrid");
  if (!grid) return;
  const imgs = state.auth.profile.images ?? [];
  grid.innerHTML = imgs
    .map((src) => `<div class="img-tile"><img src="${src}" alt="" aria-hidden="true" /></div>`)
    .join("");
}

async function filesToDataUrls(files) {
  const urls = [];
  for (const f of files) {
    // eslint-disable-next-line no-await-in-loop
    const u = await fileToDataUrl(f);
    urls.push(u);
  }
  return urls;
}

function wireRegisterDetails() {
  $("#openReportBtn")?.addEventListener("click", () => {
    const bar = $("#reportBar");
    if (!bar) return;
    bar.hidden = !bar.hidden;
    if (!bar.hidden) {
      $("#reportDetails")?.focus();
      bar.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  $("#closeReportBtn")?.addEventListener("click", () => {
    const bar = $("#reportBar");
    if (bar) bar.hidden = true;
  });

  $("#editDetailsBtn")?.addEventListener("click", () => {
    if (!state.auth.loggedIn) return openAuthModal();
    navigateView("register");
    renderRegisterForm();
  });

  $("#avatarSelector")?.addEventListener("click", (e) => {
    const target = e.target.closest("button.chip");
    if (!target) return;
    const avatar = target.getAttribute("data-avatar");
    if (!avatar) return;
    
    if (avatar === "image") {
      $("#avatarUploadInput")?.click();
      return;
    }
    
    state.auth.profile.selectedAvatar = avatar;
    persist();
    renderProfileView();
    showToast("Avatar updated");
  });

  $("#avatarUploadInput")?.addEventListener("change", async (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const file = input.files ? input.files[0] : null;
    if (!file) return;

    try {
      const url = await fileToDataUrl(file);
      state.auth.profile.customAvatarImage = url;
      state.auth.profile.selectedAvatar = "image";
      persist();
      renderProfileView();
      showToast("Photo updated");
    } catch {
      showToast("Could not read image");
    }
  });

  $("#logoutBtn")?.addEventListener("click", () => {
    state.auth.loggedIn = false;
    state.auth.userId = null;
    state.auth.email = null;
    state.auth.mobile = null;
    state.auth.role = "user";
    state.auth.streak = { count: 0, lastLoginDate: null };
    state.auth.profile = {
      fullName: "",
      age: "",
      workPlace: "",
      homeTown: "",
      jobInfo: "",
      favFood: "",
      favPlaces: "",
      preference: "go_with_flow",
      dreamPlace: "",
      gender: "other",
      images: [],
    };
    persist();
    showToast("Logged out");
    document.body.classList.add("is-locked");
    resetAuth();
    openAuthModal();
  });

  $("#regImages")?.addEventListener("change", async (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length === 0) return;
    if (files.length > 6) {
      showToast("Max 6 images allowed");
    }
    try {
      const urls = await filesToDataUrls(files);
      const combined = [...(state.auth.profile.images || []), ...urls];
      state.auth.profile.images = combined.slice(0, 6);
      renderRegisterImages();
      persist();
      showToast(`Added images (Total: ${state.auth.profile.images.length}/6)`);
    } catch {
      showToast("Could not read images");
    }
  });

  $("#registerDetailsForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const p = state.auth.profile;
    const parsedAge = parseInt($("#regAge")?.value ?? "");
    if (!parsedAge || parsedAge < 18) {
      showToast("You must be 18 or older to use this app.");
      return;
    }
    p.fullName = $("#regFullName")?.value?.trim?.() ?? "";
    p.age = parsedAge;
    p.workPlace = $("#regWorkPlace")?.value?.trim?.() ?? "";
    p.homeTown = $("#regHomeTown")?.value?.trim?.() ?? "";
    p.jobInfo = $("#regJobInfo")?.value?.trim?.() ?? "";
    p.favFood = $("#regFavFood")?.value?.trim?.() ?? "";
    p.favPlaces = $("#regFavPlaces")?.value?.trim?.() ?? "";
    p.preference = $("#regPreference")?.value ?? "go_with_flow";
    p.drinkingHabit = $("#regDrinking")?.value ?? "none";
    p.dreamPlace = $("#regDreamPlace")?.value?.trim?.() ?? "";
    p.gender = $("#regGender")?.value ?? "other";
    p.hobbies = $("#regHobbies")?.value?.trim?.() ?? "";
    p.sports = $("#regSports")?.value?.trim?.() ?? "";

    const imgCount = Array.isArray(p.images) ? p.images.length : 0;
    if (imgCount < 4) {
      showToast("Please add minimum 4 images");
      return;
    }
    if (imgCount > 6) {
      p.images = p.images.slice(0, 6);
    }

    persist();

    const newProfile = {
      id: state.auth.userId,
      name: p.fullName || state.auth.userId,
      gender: p.gender,
      age: parseInt(p.age) || 25,
      city: p.homeTown || "Unknown",
      distanceMi: 2.5,
      verified: true,
      avatar: p.selectedAvatar === "image" && (p.customAvatarImage || p.images[0]) ? { type: "ai", seed: p.customAvatarImage || p.images[0] } : (p.selectedAvatar && p.selectedAvatar !== "ai" ? { type: "emoji", emoji: p.selectedAvatar, colorClass: "bg-rose" } : { type: "ai", seed: state.auth.userId }),
      interests: [p.favFood, p.favPlaces].filter(Boolean),
    };

    const existingIdx = profiles.findIndex(existing => existing.id === newProfile.id);
    if (existingIdx === -1) {
      profiles.unshift(newProfile);
    } else {
      profiles[existingIdx] = newProfile;
    }

    channel.postMessage({
      type: "NEW_PROFILE",
      profile: newProfile
    });

    showToast("Details saved");
    navigateView("discover");
    renderProfiles();
  });

  $("#reportForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const details = $("#reportDetails")?.value?.trim?.() ?? "";
    if (!details) {
      showToast("Please enter report details");
      return;
    }
    showToast("Report submitted");
    const ta = $("#reportDetails");
    if (ta) ta.value = "";
    const bar = $("#reportBar");
    if (bar) bar.hidden = true;
  });
}

function init() {
  loadPersisted();
  document.body.classList.add("is-locked");
  renderActiveFilterNote();
  wireChips();
  renderProfiles();
  wireGridActions();
  wireTopButtons();
  wireComposer();
  wireAuth();
  wirePremium();
  wirePremiumPlansInProfile();
  wireNavigation();
  wireMatchesAndMessages();
  wireAdmin();
  wireRegisterDetails();
  resetAuth();
  if (state.auth.loggedIn) {
    if (!state.auth.joinDate) state.auth.joinDate = new Date().toLocaleDateString();
    
    const today = new Date().toISOString().split("T")[0];
    if (!state.auth.streak) state.auth.streak = { count: 0, lastLoginDate: null };
    const lastDate = state.auth.streak.lastLoginDate;
    
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (lastDate === yesterday) {
        state.auth.streak.count += 1;
      } else {
        state.auth.streak.count = 1;
      }
      state.auth.streak.lastLoginDate = today;

      if (state.auth.streak.count >= 7) {
        state.auth.freeLikeLimit += 5;
        state.auth.streak.count = 0;
        setTimeout(() => showToast("🔥 7-day streak! +5 extra free likes unlocked!"), 500);
      }
      persist();
    }

    document.body.classList.remove("is-locked");
    navigateView("discover");
    renderProfileView();
    renderMatchesView();
    renderThreads();
    renderRegisterForm();
  } else {
    openAuthModal();
  }
}

document.addEventListener("DOMContentLoaded", init);

