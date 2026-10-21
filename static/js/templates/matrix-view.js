/**
 * Matrix Template View Renderer
 * Cyberpunk Terminal interface, HUD panels, neon green accents, digital nodes
 * Localized with centralized i18n system
 */

import { t } from '../i18n.js';

export function renderMatrixView(container, data, currentPath, state) {
  if (currentPath === '/side-quests') {
    container.innerHTML = renderMatrixSideQuests();
    return;
  }

  if (currentPath === '/writing') {
    container.innerHTML = renderMatrixWriting();
    return;
  }

  container.innerHTML = renderMatrixHome(data, state);
  setupMatrixInteractions(container, state);
}

function renderMatrixHome(data, state) {
  const { name, job_description, resume, skills, projects, experiences, education, volunteer, contact } = data;

  return `
    <div class="container" style="padding-top: 1.5rem;">
      <!-- Matrix HUD Status Bar -->
      <header class="matrix-hud">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div class="matrix-prompt-line" style="margin-bottom: 0;">
            <span>root@tbs-mainframe:~$</span>
            <span style="color: var(--accent-primary); font-weight: 700;">${t('matrix.prompt_command', './init_portfolio.sh --candidate="OZ"')}</span>
            <span class="blink">_</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button type="button" class="matrix-rain-toggle" id="matrix-toggle-rain">
              <span>${t('matrix.rain_fx', 'Rain FX:')}</span>
              <strong id="rain-status-text">${state.matrixRain ? t('matrix.rain_online', 'ONLINE') : t('matrix.rain_paused', 'PAUSED')}</strong>
            </button>
            <span class="badge" style="border: 1px solid var(--accent-primary);">${t('matrix.sec_ssl', 'SECURE_SSL')}</span>
          </div>
        </div>

        <div class="hud-stats-grid">
          <div class="hud-stat-box">
            <div class="hud-stat-label">${t('matrix.status_label', 'OPERATIONAL STATUS')}</div>
            <div class="hud-stat-value">${t('matrix.status_value', 'ONLINE // ACTIVE')}</div>
          </div>
          <div class="hud-stat-box">
            <div class="hud-stat-label">${t('matrix.directive_label', 'PRIMARY DIRECTIVE')}</div>
            <div class="hud-stat-value" style="color: #FFEA95;">${t('matrix.directive_value', 'PFE INTERNSHIP 2027')}</div>
          </div>
          <div class="hud-stat-box">
            <div class="hud-stat-label">${t('matrix.base_label', 'ACADEMIC BASE')}</div>
            <div class="hud-stat-value">${t('matrix.base_value', 'TBS (TUNIS)')}</div>
          </div>
          <div class="hud-stat-box">
            <div class="hud-stat-label">${t('matrix.spec_label', 'SPECIALIZATION')}</div>
            <div class="hud-stat-value">${t('matrix.spec_value', 'BACKEND + AI')}</div>
          </div>
        </div>
      </header>

      <!-- Matrix Hero -->
      <section class="matrix-hero" id="matrix-hero">
        <div>
          <div class="matrix-prompt-line">
            <span>${t('matrix.subject_id', '[SYS_ID: 0x9AF2]')}</span>
            <span>${t('matrix.identified_subject', 'IDENTIFIED SUBJECT:')}</span>
          </div>

          <h1 class="matrix-glitch-title">${escapeHtml(name.toUpperCase())}</h1>
          <h2 style="color: var(--text-heading); font-size: 1.3rem; margin-top: 0.5rem; font-weight: 600;">
            > ${escapeHtml(job_description)}
          </h2>

          <p class="matrix-tagline">
            "${escapeHtml(resume)}"
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 2rem;">
            <a href="#matrix-projects" class="btn btn-primary">
              ${t('matrix.access_projects', 'ACCESS DEPLOYED PROJECTS')}
            </a>
            <a href="/apis/get_cv?lang=en" target="_blank" rel="noopener" class="btn btn-secondary">
              ${t('matrix.see_dossier_en', t('matrix.download_dossier_en', 'SEE DOSSIER (CV EN)'))}
            </a>
            <a href="/apis/get_cv?lang=fr" target="_blank" rel="noopener" class="btn btn-secondary">
              ${t('matrix.see_dossier_fr', t('matrix.download_dossier_fr', 'DOSSIER (CV FR)'))}
            </a>
          </div>
        </div>

        <!-- Matrix Cyber Avatar Frame -->
        <div class="matrix-avatar-wrap">
          <div class="matrix-frame-hex">
            <img src="/static/images/me_in_suit.png" alt="Oussama Zmitri" class="matrix-profile-img" onerror="this.style.display='none'; const fb = document.getElementById('matrix-avatar-fb'); if(fb) fb.style.display='flex';">
            <div id="matrix-avatar-fb" style="display: none; flex-direction: column; align-items: center; justify-content: center;">
              <span style="font-size: 4.5rem; font-weight: 900; color: var(--accent-primary); letter-spacing: -0.05em;">
                OZ
              </span>
              <span style="font-size: 0.72rem; color: var(--text-body); letter-spacing: 0.15em; text-transform: uppercase;">
                ${t('matrix.avatar_role', 'SYSTEM ARCHITECT // BACKEND & AI')}
              </span>
            </div>
          </div>
          <div class="matrix-pfe-alert">
            ${t('site.seeking_internship', 'LOOKING FOR A PFE INTERNSHIP!')}
          </div>
        </div>
      </section>

      <!-- MATRIX SECTION COMMAND DECK -->
      <nav class="matrix-section-nav" aria-label="Matrix Sector Quick Navigation" id="matrix-section-nav">
        <div class="matrix-nav-deck">
          <a href="#matrix-about" class="matrix-deck-btn" data-section="matrix-about">
            <span class="deck-idx">[ 01 ]</span>
            <span class="deck-label">${t('nav.matrix_section_about', 'IDENTITY_DATA')}</span>
          </a>
          <a href="#matrix-skills" class="matrix-deck-btn" data-section="matrix-skills">
            <span class="deck-idx">[ 02 ]</span>
            <span class="deck-label">${t('nav.matrix_section_skills', 'NEURAL_SKILLS')}</span>
          </a>
          <a href="#matrix-projects" class="matrix-deck-btn" data-section="matrix-projects">
            <span class="deck-idx">[ 03 ]</span>
            <span class="deck-label">${t('nav.matrix_section_projects', 'EXECUTABLE_PROJECTS')}</span>
          </a>
          <a href="#matrix-experience" class="matrix-deck-btn" data-section="matrix-experience">
            <span class="deck-idx">[ 04 ]</span>
            <span class="deck-label">${t('nav.matrix_section_experience', 'TIMELINE_LOGS')}</span>
          </a>
          <a href="#matrix-education" class="matrix-deck-btn" data-section="matrix-education">
            <span class="deck-idx">[ 05 ]</span>
            <span class="deck-label">${t('nav.matrix_section_education', 'ACADEMIC_METRICS')}</span>
          </a>
          <a href="#matrix-contact" class="matrix-deck-btn" data-section="matrix-contact">
            <span class="deck-idx">[ 06 ]</span>
            <span class="deck-label">${t('nav.matrix_section_contact', 'COMMS_GRID')}</span>
          </a>
        </div>
      </nav>

      <!-- PROTOCOL 01 // IDENTITY DATA -->
      <section class="cyber-panel" id="matrix-about">
        <span class="cyber-panel-tag">[ PROTOCOL 01 // IDENTITY_DATA ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.35rem; margin-bottom: 1rem;">
          ${t('about.title', 'Engineering Solid Systems with Data & AI')}
        </h3>
        <p style="color: var(--text-body); line-height: 1.7; font-size: 1.05rem;">
          ${escapeHtml(resume)}
        </p>
        <p style="color: var(--text-secondary); margin-top: 0.75rem; line-height: 1.6; font-size: 0.95rem;">
          ${t('about.narrative_2', 'Bridging IT backend engineering with statistical business analytics at Tunis Business School.')}
        </p>

        <!-- 3 Matrix Identity Capability Boxes -->
        <div class="matrix-identity-grid">
          <div class="matrix-identity-card">
            <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent-primary); margin-bottom: 0.35rem;">[ CORE 01 // BACKEND ]</div>
            <h4 style="color: var(--text-heading); font-size: 1.05rem; margin-bottom: 0.5rem;">${t('about.highlight_1_title', 'Backend Architecture')}</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${t('about.highlight_1_desc', 'Designing RESTful APIs with Python, Flask, Docker, and SQL databases, focused on clean contracts, maintainability, and reliability.')}</p>
          </div>

          <div class="matrix-identity-card">
            <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent-primary); margin-bottom: 0.35rem;">[ CORE 02 // DATA_AI ]</div>
            <h4 style="color: var(--text-heading); font-size: 1.05rem; margin-bottom: 0.5rem;">${t('about.highlight_2_title', 'Data & Statistical Modeling')}</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${t('about.highlight_2_desc', 'Multivariate statistical analysis, PCA, regression modeling, and financial analytics with R, FactoMineR, and Pandas.')}</p>
          </div>

          <div class="matrix-identity-card">
            <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent-primary); margin-bottom: 0.35rem;">[ CORE 03 // ANALYTICS ]</div>
            <h4 style="color: var(--text-heading); font-size: 1.05rem; margin-bottom: 0.5rem;">${t('about.highlight_3_title', 'Business Analytics')}</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${t('about.highlight_3_desc', 'Integrating analytical thinking, financial statement ratios, and profit optimization into software architecture.')}</p>
          </div>
        </div>
      </section>

      <!-- PROTOCOL 02 // NEURAL SKILLS MATRIX -->
      <section class="cyber-panel" id="matrix-skills">
        <span class="cyber-panel-tag">[ PROTOCOL 02 // NEURAL_SKILLS_MATRIX ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1rem;">
          ${t('skills.title', 'Skills & Technologies')}
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">${t('matrix.cat_languages', 'LANGUAGES & RUNTIMES')}</div>
            <div class="matrix-skill-cluster">
              ${(skills.programming_languages || []).map(s => `<span class="matrix-node-tag">λ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>

          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">${t('matrix.cat_frameworks', 'FRAMEWORKS & LIBS')}</div>
            <div class="matrix-skill-cluster">
              ${(skills.frameworks_and_libraries || []).map(s => `<span class="matrix-node-tag">⚡ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>

          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">${t('matrix.cat_data', 'DATA & STATISTICAL SYSTEMS')}</div>
            <div class="matrix-skill-cluster">
              ${(skills.data_analysis_and_visualization || []).map(s => `<span class="matrix-node-tag">◈ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>

          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">${t('matrix.cat_databases', 'DATABASES & DEVOPS')}</div>
            <div class="matrix-skill-cluster">
              ${(skills.databases || []).concat(skills.tools_and_technologies || []).map(s => `<span class="matrix-node-tag">⬡ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-card); padding-top: 1rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem;">${t('matrix.cat_comm', 'LINGUISTIC PROTOCOLS:')}</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${(skills.languages || []).map(l => `
              <span class="matrix-node-tag">
                ${escapeHtml(l.name)}: <strong>${escapeHtml(l.proficiency)}</strong>
              </span>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- PROTOCOL 03 // DEPLOYED PROJECTS -->
      <section class="cyber-panel" id="matrix-projects">
        <span class="cyber-panel-tag">[ PROTOCOL 03 // DEPLOYED_PROJECTS ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1.5rem;">
          ${t('projects.title', 'Projects & Implementations')}
        </h3>

        <div class="matrix-projects-grid">
          ${(projects || []).map((proj, idx) => `
            <div class="matrix-project-box">
              <div>
                <span class="matrix-project-id">[SYS_EXEC_0${idx + 1}]</span>
                <h4 class="matrix-project-title">${escapeHtml(proj.title)}</h4>
                <p class="matrix-project-desc" style="margin-top: 0.75rem;">${Array.isArray(proj.description) ? proj.description.map(d => escapeHtml(d)).join(' ') : escapeHtml(proj.description)}</p>
              </div>

              <div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 1rem;">
                  ${(proj.technologies || []).map(tName => `<span class="tag">${escapeHtml(tName)}</span>`).join('')}
                </div>
                ${proj.url ? `
                  <div style="margin-top: 1rem;">
                    <a href="${escapeHtml(proj.url)}" target="_blank" class="btn btn-sm btn-secondary" style="width: 100%;">
                      ${t('projects.view_project', 'ACCESS REPO // LINK ↗')}
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- PROTOCOL 04 // TIMELINE LOGS -->
      <section class="cyber-panel" id="matrix-experience">
        <span class="cyber-panel-tag">[ PROTOCOL 04 // CHRONOLOGICAL_LOGS ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1.5rem;">
          ${t('matrix.timeline_header', 'CAREER & INTERNSHIP TIMELINES')}
        </h3>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${(experiences || []).map(exp => `
            <div style="border-left: 3px solid var(--accent-primary); padding-left: 1.25rem; background-color: var(--bg-alt); padding: 1.25rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="color: var(--accent-primary); font-size: 1.15rem; font-weight: 700;">
                  ${escapeHtml(exp.position)} @ ${escapeHtml(exp.company)}
                </h4>
                <span style="font-size: 0.8rem; color: var(--text-muted);">
                  [ ${escapeHtml(exp.start_date)} // ${escapeHtml(exp.end_date)} ]
                </span>
              </div>

              <div style="display: flex; gap: 0.5rem; margin: 0.5rem 0;">
                <span class="tag">${escapeHtml(exp.employment_type)}</span>
                <span class="tag">${escapeHtml(exp.work_mode)}</span>
              </div>

              <ul style="list-style: none; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem;">
                ${(exp.description || []).map(desc => `
                  <li style="font-size: 0.92rem; color: var(--text-body);">
                    > ${escapeHtml(desc)}
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- PROTOCOL 05 // ACADEMICS -->
      <section class="cyber-panel" id="matrix-education">
        <span class="cyber-panel-tag">[ PROTOCOL 05 // ACADEMIC_CREDENTIALS ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1rem;">
          ${t('matrix.academic_log', 'INSTITUTIONAL METRICS')}
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${(education || []).map(edu => `
            <div style="background-color: var(--bg-alt); padding: 1.5rem; border: 1px solid var(--border-card);">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem;">
                <img src="/static/images/tbs_logo.png" alt="Tunis Business School Logo" class="edu-card-logo">
                <span class="badge" style="border: 1px solid var(--accent-primary);">${escapeHtml(edu.status || t('education.status_in_progress', 'ACTIVE'))}</span>
              </div>
              <h4 style="color: var(--text-heading); font-size: 1.15rem; margin-top: 0.5rem;">${escapeHtml(edu.institution)}</h4>
              <p style="color: var(--accent-primary); font-size: 0.95rem;">${escapeHtml(edu.degree)}</p>
              <div style="margin-top: 0.75rem; font-size: 0.88rem; color: var(--text-secondary);">
                <p>${t('education.major_label', 'Major:')} ${escapeHtml(edu.major)}</p>
                <p>${t('education.minor_label', 'Minor:')} ${escapeHtml(edu.minor || 'None')}</p>
                <p>${t('education.period_label', 'Period:')} ${escapeHtml(edu.start_date)} — ${escapeHtml(edu.end_date)}</p>
              </div>
            </div>
          `).join('')}

          ${volunteer ? `
            <div style="background-color: var(--bg-alt); padding: 1.5rem; border: 1px solid var(--border-card);">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem;">
                <img src="/static/images/gdg.png" alt="GDG Bizerte Logo" class="edu-card-logo">
                <span class="badge" style="border: 1px solid var(--accent-primary);">${t('education.volunteer_badge', 'COMMUNITY')}</span>
              </div>
              <h4 style="color: var(--text-heading); font-size: 1.15rem; margin-top: 0.5rem;">${escapeHtml(volunteer.club)}</h4>
              <p style="color: var(--text-body); font-size: 0.9rem; margin-top: 0.5rem;">${escapeHtml(volunteer.description)}</p>
              <ul style="list-style: none; margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
                ${(volunteer.tasks || []).map(taskText => `<li>> ${escapeHtml(taskText)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </section>

      <!-- PROTOCOL 06 // COMMS GRID -->
      <section class="cyber-panel" id="matrix-contact">
        <span class="cyber-panel-tag">[ PROTOCOL 06 // COMMS_GRID ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1rem;">
          ${t('matrix.telemetry', 'ENCRYPTED TRANSMISSION CHANNELS')}
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
          ${contact.email ? `
            <a href="mailto:${escapeHtml(contact.email)}" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>✉ ${t('contact.email', 'EMAIL')}: ${escapeHtml(contact.email)}</span>
            </a>
          ` : ''}
          ${contact.phone ? `
            <a href="tel:${escapeHtml(contact.phone)}" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>☎ ${t('contact.phone', 'TEL')}: ${escapeHtml(contact.phone)}</span>
            </a>
          ` : ''}
          ${contact.linkedin ? `
            <a href="${escapeHtml(contact.linkedin)}" target="_blank" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>🔗 ${t('contact.linkedin', 'LINKEDIN')} ↗</span>
            </a>
          ` : ''}
          ${contact.github ? `
            <a href="${escapeHtml(contact.github)}" target="_blank" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>⬡ ${t('contact.github', 'GITHUB')} ↗</span>
            </a>
          ` : ''}
        </div>
      </section>
    </div>
  `;
}

function renderMatrixSideQuests() {
  return `
    <div class="container" style="padding-top: 3rem;">
      <section class="cyber-panel">
        <span class="cyber-panel-tag">[ SECTOR: SIDE_QUESTS // LAB_ENVIRONMENT ]</span>
        <h1 style="color: var(--accent-primary); font-size: 2rem; margin-bottom: 1rem;">
          ${t('side_quests.title', 'FIELD EXPERIMENTS & SIDE QUESTS')}
        </h1>
        <p style="color: var(--text-body); font-size: 1.05rem; line-height: 1.6;">
          ${t('side_quests.desc', 'Terminal sandbox designated for peripheral research, algorithmic experiments, and off-grid technology ventures.')}
        </p>

        <div style="margin-top: 2.5rem; background-color: var(--bg-alt); border: 1px dashed var(--border-card); padding: 2.5rem; text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 0.5rem;">[ 0 // LOGS_DETECTED ]</div>
          <h2 style="font-size: 1.25rem; color: var(--text-heading);">${t('side_quests.empty_title', 'PIPELINE STANDBY // PFE CANDIDACY ACTIVE')}</h2>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0.75rem auto; font-size: 0.95rem;">
            ${t('side_quests.empty_text', 'Currently channeling CPU cycles into academic deliverables at TBS and securing 2027 graduation internship. Additional field logs will stream online soon.')}
          </p>
          <a href="/" data-link class="btn btn-primary" style="margin-top: 1.5rem;">
            ${t('side_quests.return_home', '← RE-ROUTE TO MAIN PORTFOLIO')}
          </a>
        </div>
      </section>
    </div>
  `;
}

function renderMatrixWriting() {
  return `
    <div class="container" style="padding-top: 3rem;">
      <section class="cyber-panel">
        <span class="cyber-panel-tag">[ ARCHIVE: WRITING // PERSPECTIVES ]</span>
        <h1 style="color: var(--accent-primary); font-size: 2rem; margin-bottom: 1rem;">
          ${t('writing.title', 'DISPATCHES & TECHNICAL ESSAYS')}
        </h1>
        <p style="color: var(--text-body); font-size: 1.05rem; line-height: 1.6;">
          ${t('writing.desc', 'Theoretical documentation, architectural case studies, and engineering breakdowns.')}
        </p>

        <div style="margin-top: 2.5rem; background-color: var(--bg-alt); border: 1px dashed var(--border-card); padding: 2.5rem; text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 0.5rem;">[ BUFFER_STATUS: EMPTY ]</div>
          <h2 style="font-size: 1.25rem; color: var(--text-heading);">${t('writing.empty_title', 'DRAFTS INCUBATING IN BACKGROUND THREADS')}</h2>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0.75rem auto; font-size: 0.95rem;">
            ${t('writing.empty_text', 'Articles analyzing financial ratio forecasting, backend API reliability with Flask, and statistical models will be published here upon peer review.')}
          </p>
          <a href="/" data-link class="btn btn-primary" style="margin-top: 1.5rem;">
            ${t('writing.return_home', '← RE-ROUTE TO MAIN PORTFOLIO')}
          </a>
        </div>
      </section>
    </div>
  `;
}

function setupMatrixInteractions(container, state) {
  const rainBtn = container.querySelector('#matrix-toggle-rain');
  const rainText = container.querySelector('#rain-status-text');
  if (rainBtn && rainText) {
    rainBtn.addEventListener('click', () => {
      const nextVal = !state.matrixRain;
      state.setMatrixRain(nextVal);
      rainText.textContent = nextVal ? t('matrix.rain_online', 'ONLINE') : t('matrix.rain_paused', 'PAUSED');
    });
  }

  // Matrix Command Deck Navigation Buttons Smooth Scroll
  const deckBtns = container.querySelectorAll('.matrix-deck-btn');
  deckBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navHeight = (document.querySelector('.site-nav')?.offsetHeight || 70) + (document.querySelector('.matrix-section-nav')?.offsetHeight || 45);
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        deckBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // ScrollSpy for Matrix Panels
  const cyberPanels = container.querySelectorAll('.cyber-panel[id]');
  if (cyberPanels.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          deckBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.section === id);
          });
          document.querySelectorAll('.nav-section-link[data-matrix-section]').forEach(link => {
            link.classList.toggle('active', link.dataset.matrixSection === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    cyberPanels.forEach(p => observer.observe(p));
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
