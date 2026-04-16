const raspunsuriSelectate = {
  1: false,
  2: false,
  3: false
};

const mesajeFeedback = {
  "zi-linistita": "Bunătatea rămâne unul dintre cele mai frumoase lucruri pe care le poate purta un om. Și nu trece niciodată neobservată.",
  "zi-vesela": "Curăția inimii este rară și prețiosă. Este genul de frumusețe care nu are nevoie să se explice.",
  "zi-surprize": "Felul în care îi faci pe celalți să se simtă spune mai mult decât orice cuvânt. Și chiar rămâne.",
  "flori": "Mda, chiar... cele mai liniștite momente sunt cele mai simple. Acolo parcă se așează totul mai frumos.",
  "momente": "Când ai oameni dragi aproape, liniștea vine mult mai ușor, nu prea depune efort. E un dar care contează mult.",
  "mesaje": "Pacea din inimă este ceva rar și profund. Când începi să o simți, parcă totul capătă alt sens.",
  "zambet": "Frumos! Credința ține omul drept chiar și în zilele grele. Este un sprijin care nu se vede dar se simte mereu.",
  "simtire": "Oamenii sinceri sunt un dar rar. Ei fac viața mai curată și mai liniștită.",
  "amintire": "Bucuria din lucrurile simple este poate cea mai adevărată. Și cea care rămâne cel mai mult"
};

const letterTextContent = `Astăzi n-am vrut să-ți spun doar „La mulți ani”.
Am vrut să rămână puțin mai mult decât atât.
Nu prin ceva mare și complicat, ci print-un gând simplu, dar sincer.
Nu toate lucrurile frumoase trebuie spuse direct. Unele se simt. Și poate că exact asta am vrut să las aici.
Un loc mic, în care să rămână ceva din ceea ce nu prea reușesc să spun ușor în cuvinte.
Sunt oameni pe care îi observi fără să-ți dai seama de ce și nici să-îi uiți nu se poate. Și nu pentru că încearcă ceva... ci pentru că au un fel al lor de a fi.
Și tu ești genul acela de persoană.
Ai un fel aparte, car aduce liniște, și o frumusețe care nu se explică, dar se simte.
Și, poate fără să-ți dai mereu seama, lași ceva bun în urma ta, în felul în care vorbești, în felul în care ești, în felul în care trăiești...
Îți doresc ca DUMNEZEU să-ți păstreze pașii drepți mereu, inima liniștită și gândurile curate.
Să ai parte de oameni sinceri, de momente care conteză și de bucurii care nu trec repede.
Iar în zilele în care poate nu o să fie la fel de ușor, să nu uiți că ești mai puternică decât crezi și mai prețiosă decât îți dai seama.
Și, dincolo de toate, sper și vreau să rămână cu tine măcar un pic din liniștea acestui moment.

La mulți ani, Mira.`;

function getBgAudio() {
  return document.getElementById("bgAudio");
}

function getSoundButton() {
  return document.getElementById("soundToggleBtn");
}

function actualizeazaButonSunet() {
  const audio = getBgAudio();
  const btn = getSoundButton();

  if (!btn) return;

  if (!audio || audio.paused) {
    if (btn.textContent.includes("Pornește")) {
      btn.textContent = "🔇 Pornește melodia";
    } else {
      btn.textContent = "🔇 Melodia este oprită";
    }
  } else {
    btn.textContent = "🔊 Melodia este pornită";
  }
}

function pornesteAudioDacaExista() {
  const audio = getBgAudio();
  if (!audio) {
    actualizeazaButonSunet();
    return;
  }

  const shouldPlay = localStorage.getItem("audioEnabled") === "true";
  audio.volume = 0.35;

  if (shouldPlay) {
    audio.play()
      .then(() => actualizeazaButonSunet())
      .catch(() => actualizeazaButonSunet());
  } else {
    actualizeazaButonSunet();
  }
}

function toggleAudio() {
  const audio = getBgAudio();
  if (!audio) return;

  if (audio.paused) {
    localStorage.setItem("audioEnabled", "true");
    audio.volume = 0.35;
    audio.play()
      .then(() => actualizeazaButonSunet())
      .catch(() => actualizeazaButonSunet());
  } else {
    audio.pause();
    localStorage.setItem("audioEnabled", "false");
    actualizeazaButonSunet();
  }
}

function fadeOutSpecificAudio(audio, duration = 800, callback = null) {
  if (!audio || audio.paused) {
    if (callback) callback();
    return;
  }

  let volume = audio.volume;
  const steps = 16;
  const stepTime = Math.max(20, Math.floor(duration / steps));
  const stepValue = volume / steps;

  const interval = setInterval(() => {
    volume -= stepValue;

    if (volume <= 0.02) {
      audio.volume = 0;
      audio.pause();
      clearInterval(interval);
      if (callback) callback();
    } else {
      audio.volume = volume;
    }
  }, stepTime);
}

function fadeInAudio(audio, targetVolume = 0.6, duration = 1400) {
  if (!audio) return;

  audio.volume = 0;
  const steps = 18;
  const stepTime = Math.max(25, Math.floor(duration / steps));
  const stepValue = targetVolume / steps;
  let volume = 0;

  const interval = setInterval(() => {
    volume += stepValue;
    if (volume >= targetVolume) {
      audio.volume = targetVolume;
      clearInterval(interval);
    } else {
      audio.volume = volume;
    }
  }, stepTime);
}

function goToPage(url, shouldFadeAudio = false, shouldAnimatePage = false) {
  const body = document.body;

  const proceed = () => {
    if (shouldAnimatePage && body) {
      body.classList.add("fade-out-page");
      setTimeout(() => {
        window.location.href = url;
      }, 650);
    } else {
      window.location.href = url;
    }
  };

  if (shouldFadeAudio) {
    const audio = getBgAudio();
    fadeOutSpecificAudio(audio, 700, proceed);
  } else {
    proceed();
  }
}

function intraInPoveste() {
  localStorage.setItem("audioEnabled", "true");
  const audio = getBgAudio();

  if (audio) {
    audio.volume = 0.35;
    audio.play().finally(() => {
      actualizeazaButonSunet();
      goToPage("calendar.html", false, true);
    });
  } else {
    goToPage("calendar.html", false, true);
  }
}

function toggleMessageCard(button) {
  button.classList.toggle("open");
}

function raspundeLaIntrebare(numar, button, tipRaspuns) {
  const card = button.closest(".question-card");
  if (!card) return;

  const toateButoanele = card.querySelectorAll(".answer-btn");
  toateButoanele.forEach(btn => btn.classList.remove("selected-answer"));
  button.classList.add("selected-answer");

  const feedback = card.querySelector(".answer-feedback");
  if (feedback) {
    feedback.textContent = mesajeFeedback[tipRaspuns] || "";
    feedback.classList.add("visible");
  }

  raspunsuriSelectate[numar] = true;
  verificaDacaToateIntrebarileSuntCompletate();
}

function verificaDacaToateIntrebarileSuntCompletate() {
  const toateCompletate =
    raspunsuriSelectate[1] &&
    raspunsuriSelectate[2] &&
    raspunsuriSelectate[3];

  const doneMessage = document.getElementById("questionsDoneMessage");
  const messagesSection = document.getElementById("messagesSection");
  const continueBtn = document.getElementById("continueToFlowersBtn");

  if (!doneMessage || !messagesSection || !continueBtn) return;

  if (toateCompletate) {
    doneMessage.classList.remove("hidden");
    messagesSection.classList.remove("hidden");
    continueBtn.classList.remove("hidden");

    setTimeout(() => {
      messagesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  }
}

function initCalendar() {
  const calendarDays = document.getElementById("calendarDays");
  const monthTitle = document.getElementById("monthTitle");
  const messageBox = document.getElementById("calendarMessage");
  const continueBtn = document.getElementById("continueBtn");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");

  if (!calendarDays || !monthTitle || !messageBox || !continueBtn || !prevMonthBtn || !nextMonthBtn) {
    return;
  }

  const luni = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  const targetYear = 2026;
  const targetMonth = 3;
  const targetDay = 17;

  let currentYear = targetYear;
  let currentMonth = targetMonth;
  let selectedButton = null;

  function renderCalendar(year, month) {
    calendarDays.innerHTML = "";
    messageBox.innerHTML = "";
    continueBtn.classList.add("hidden");
    selectedButton = null;

    monthTitle.textContent = `${luni[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "empty-cell";
      calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayButton = document.createElement("button");
      dayButton.className = "day-cell";
      dayButton.type = "button";
      dayButton.textContent = day;

      if (year === targetYear && month === targetMonth && day === targetDay) {
        dayButton.title = "Aici parcă zâmbește puțin calendarul 😄";
      }

      dayButton.addEventListener("click", function () {
        if (selectedButton) {
          selectedButton.classList.remove("selected", "correct", "wrong");
        }

        selectedButton = dayButton;
        dayButton.classList.add("selected");

        if (year === targetYear && month === targetMonth && day === targetDay) {
          dayButton.classList.remove("wrong");
          dayButton.classList.add("correct");

          messageBox.innerHTML = `
            <div class="message-success">
              Exact. Ai găsit-o.<br>
              Și da... indiciul chiar nu era deloc întâmplător 😄
            </div>
          `;
          continueBtn.classList.remove("hidden");
        } else {
          dayButton.classList.remove("correct");
          dayButton.classList.add("wrong");

          messageBox.innerHTML = `
            <div class="message-error">
              Aproape... dar nu chiar.<br>
              Calendarul încearcă discret să te ducă spre 17 😄
            </div>
          `;
          continueBtn.classList.add("hidden");
        }
      });

      calendarDays.appendChild(dayButton);
    }
  }

  prevMonthBtn.addEventListener("click", function () {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
  });

  nextMonthBtn.addEventListener("click", function () {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
  });

  renderCalendar(currentYear, currentMonth);
}

function openFlowerModal(imageSrc, title, description) {
  const modal = document.getElementById("flowerModal");
  const modalImage = document.getElementById("flowerModalImage");
  const modalTitle = document.getElementById("flowerModalTitle");
  const modalDescription = document.getElementById("flowerModalDescription");

  if (!modal || !modalImage || !modalTitle || !modalDescription) return;

  modalImage.src = imageSrc;
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeFlowerModal() {
  const modal = document.getElementById("flowerModal");
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function initLetterTypewriter() {
  const container = document.getElementById("typewriterText");
  const scrollContainer = document.getElementById("letterScrollContainer");
  const birthdayMoment = document.getElementById("birthdayMoment");
  const birthdaySong = document.getElementById("birthdaySong");
  const bgAudio = document.getElementById("bgAudio");

  if (!container || !scrollContainer) return;

  container.textContent = "";
  let index = 0;

  const typingInterval = setInterval(() => {
    container.textContent += letterTextContent.charAt(index);
    index++;

    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    if (maxScroll > 0) {
      scrollContainer.scrollTop = maxScroll;
    }

    if (index >= letterTextContent.length) {
      clearInterval(typingInterval);

      setTimeout(() => {
        if (birthdayMoment) {
          birthdayMoment.classList.remove("hidden");
          birthdayMoment.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (bgAudio && !bgAudio.paused) {
          fadeOutSpecificAudio(bgAudio, 1800);
        }

        const shouldPlay = localStorage.getItem("audioEnabled") === "true";
        if (birthdaySong && shouldPlay) {
          birthdaySong.play().catch(() => {});
          fadeInAudio(birthdaySong, 0.75, 1800);
        }
      }, 1000);
    }
  }, 42);
}

function initFinalAudio() {
  const finalAudio = document.getElementById("finalVoiceAudio");
  if (!finalAudio) return;

  finalAudio.volume = 0.22;
  const shouldPlay = localStorage.getItem("audioEnabled") === "true";

  if (shouldPlay) {
    finalAudio.play().catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const hasFinalAudio = !!document.getElementById("finalVoiceAudio");
  const isLetterPage = document.body.classList.contains("letter-page");

  if (!isLetterPage && !hasFinalAudio) {
    pornesteAudioDacaExista();
  }

  if (isLetterPage) {
    const bgAudio = getBgAudio();
    const shouldPlay = localStorage.getItem("audioEnabled") === "true";
    if (bgAudio && shouldPlay) {
      bgAudio.volume = 0.25;
      bgAudio.play().catch(() => {});
    }
  }

  actualizeazaButonSunet();
  initCalendar();
  initLetterTypewriter();
  initFinalAudio();

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeFlowerModal();
    }
  });
});